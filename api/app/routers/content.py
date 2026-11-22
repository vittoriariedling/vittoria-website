"""Read-only content API. Every endpoint requires a logged-in user.

Responses use camelCase keys (matching the existing React components) and
contain signed, time-limited URLs for every image.
"""

import copy
from datetime import date
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel
from sqlalchemy import select

from app import storage
from app.deps import CurrentUser, SessionDep, get_current_user
from app.media import load_media, resolve_image
from app.models import Book, Place, PlaceKind, Post, Project, Role, SiteContent

router = APIRouter(prefix="/api", tags=["content"], dependencies=[Depends(get_current_user)])


class CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class Image(BaseModel):
    src: str
    width: int
    height: int


# ── Books ────────────────────────────────────────────────────────────


class BookOut(CamelModel):
    id: str
    title: str
    author: str
    isbn13: str | None
    rating: float
    review: str
    date_read: date | None
    cover_url: str | None
    currently_reading: bool


def _book_sort_key(b: Book):
    # Most recently read first; books without a read date go last, best-rated first.
    return (b.date_read is None, -(b.date_read.toordinal() if b.date_read else 0), -b.rating, b.title.lower())


@router.get("/books", response_model=list[BookOut])
async def list_books(session: SessionDep):
    books = sorted((await session.scalars(select(Book))).all(), key=_book_sort_key)
    media = await load_media(session, (b.cover_media_id for b in books))
    out = []
    for b in books:
        cover = resolve_image(media, b.cover_media_id, "sm")
        out.append(BookOut(
            id=b.goodreads_id or str(b.id), title=b.title, author=b.author, isbn13=b.isbn13,
            rating=float(b.rating), review=b.review, date_read=b.date_read,
            cover_url=cover["src"] if cover else None, currently_reading=b.currently_reading,
        ))
    return out


# ── Projects ─────────────────────────────────────────────────────────


class ExtraImage(Image):
    caption: str | None = None


class ProjectOut(CamelModel):
    id: int
    title: str
    tag: str
    description: str
    long_description: str | None
    github_url: str | None
    year: str | None
    tech: list[str]
    team: str | None
    image: Image | None
    extra_images: list[ExtraImage]


async def _projects_out(session, projects: list[Project], size: str) -> list[ProjectOut]:
    ids = [p.image_media_id for p in projects]
    ids += [img.get("media_id") for p in projects for img in p.extra_images]
    media = await load_media(session, ids)
    out = []
    for p in projects:
        extras = []
        for img in p.extra_images:
            resolved = resolve_image(media, img.get("media_id"))
            if resolved:
                extras.append(ExtraImage(**resolved, caption=img.get("caption")))
        out.append(ProjectOut(
            id=p.id, title=p.title, tag=p.tag, description=p.description,
            long_description=p.long_description, github_url=p.github_url, year=p.year,
            tech=p.tech or [], team=p.team, image=resolve_image(media, p.image_media_id, size),
            extra_images=extras,
        ))
    return out


@router.get("/projects", response_model=list[ProjectOut])
async def list_projects(session: SessionDep):
    projects = (await session.scalars(select(Project).order_by(Project.position, Project.id))).all()
    return await _projects_out(session, list(projects), "sm")


@router.get("/projects/{project_id}", response_model=ProjectOut)
async def get_project(project_id: str, session: SessionDep):
    # Taken as a string so /projects/abc is a plain 404, not a validation error.
    project = await session.get(Project, int(project_id)) if project_id.isdigit() else None
    if project is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Project not found")
    return (await _projects_out(session, [project], "lg"))[0]


# ── Travel map ───────────────────────────────────────────────────────


class PlaceOut(CamelModel):
    id: str  # two-letter ISO country code or US postal code
    name: str
    continent: str | None
    status: str
    photo: str | None
    description: str
    newsletter_slugs: list[str]


class PlacesOut(BaseModel):
    countries: list[PlaceOut]
    states: list[PlaceOut]


@router.get("/places", response_model=PlacesOut)
async def list_places(session: SessionDep):
    places = (await session.scalars(select(Place).order_by(Place.name))).all()
    media = await load_media(session, (p.photo_media_id for p in places))

    def out(p: Place) -> PlaceOut:
        photo = resolve_image(media, p.photo_media_id)
        return PlaceOut(id=p.code, name=p.name, continent=p.continent, status=p.status.value,
                        photo=photo["src"] if photo else None, description=p.description,
                        newsletter_slugs=p.newsletter_slugs or [])

    return PlacesOut(
        countries=[out(p) for p in places if p.kind == PlaceKind.country],
        states=[out(p) for p in places if p.kind == PlaceKind.state],
    )


# ── Site-wide content ────────────────────────────────────────────────


def _resolve_site(obj, media):
    """Replace stored file references with signed URLs, recursively."""
    if isinstance(obj, dict):
        if "storage_key" in obj:
            return {"url": storage.signed_url(obj["storage_key"]), "contentType": obj.get("content_type")}
        if "media_id" in obj:
            return resolve_image(media, obj["media_id"])
        return {k: _resolve_site(v, media) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_resolve_site(v, media) for v in obj]
    return obj


def _media_ids(obj):
    if isinstance(obj, dict):
        if "media_id" in obj:
            yield obj["media_id"]
        for v in obj.values():
            yield from _media_ids(v)
    elif isinstance(obj, list):
        for v in obj:
            yield from _media_ids(v)


@router.get("/site")
async def get_site(session: SessionDep) -> dict[str, Any]:
    """Landing page copy, page titles/intros, footer links, hero video, etc."""
    row = await session.get(SiteContent, 1)
    if row is None:
        return {}
    media = await load_media(session, _media_ids(row.data))
    return _resolve_site(row.data, media)


# ── Newsletter posts ─────────────────────────────────────────────────

IMAGE_SECTION_TYPES = {"image", "photo-left", "photo-right"}
PREVIEW_CHARS = 180


def _section_media_ids(sections: list[dict]) -> list[Any]:
    ids = []
    for s in sections:
        ids.append(s.get("media_id"))
        ids.extend(p.get("media_id") for p in s.get("photos") or [])
    return ids


def _first_image_id(sections: list[dict]):
    for s in sections:
        if s.get("type") in IMAGE_SECTION_TYPES and s.get("media_id"):
            return s["media_id"]
        if s.get("type") == "three-photos":
            for p in s.get("photos") or []:
                if p.get("media_id"):
                    return p["media_id"]
    return None


def _preview_text(post: Post) -> str:
    if post.preview_description:
        return post.preview_description
    para = next((s.get("content", "") for s in post.sections if s.get("type") == "paragraph"), "")
    return para if len(para) <= PREVIEW_CHARS else para[:PREVIEW_CHARS] + "…"


def _with_src(item: dict, media) -> dict:
    """Replace {"media_id"} with {"src", "width", "height"}; drop the internal id."""
    out = {k: v for k, v in item.items() if k != "media_id"}
    if "media_id" in item:
        img = resolve_image(media, item["media_id"])
        out.update(img or {"src": None})
    return out


class PostSummary(CamelModel):
    id: str
    slug: str
    title: str
    date: str
    region: str | None
    tags: list[str]
    preview_text: str
    preview_image: Image | None


class PostDetail(CamelModel):
    id: str
    slug: str
    title: str
    date: str
    region: str | None
    tags: list[str]
    preview_description: str | None
    hero_image: Image | None
    hero_alt: str | None
    cover_photo: Image | None
    cover_alt: str | None
    cover_caption: str | None
    sections: list[dict[str, Any]]


@router.get("/posts", response_model=list[PostSummary])
async def list_posts(session: SessionDep):
    posts = (await session.scalars(
        select(Post).where(Post.published.is_(True)).order_by(Post.position.desc())
    )).all()
    first_images = {p.id: _first_image_id(p.sections) for p in posts}
    media = await load_media(session, first_images.values())
    return [
        PostSummary(id=str(p.id), slug=p.slug, title=p.title, date=p.date_label, region=p.region,
                    tags=p.tags or [], preview_text=_preview_text(p),
                    preview_image=resolve_image(media, first_images[p.id], "sm"))
        for p in posts
    ]


@router.get("/posts/{slug}", response_model=PostDetail)
async def get_post(slug: str, session: SessionDep, user: CurrentUser):
    query = select(Post).where(Post.slug == slug)
    if user.role != Role.admin:  # admins can preview drafts
        query = query.where(Post.published.is_(True))
    post = await session.scalar(query)
    if post is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Post not found")
    sections = copy.deepcopy(post.sections)
    media = await load_media(session, _section_media_ids(sections) + [post.hero_media_id, post.cover_media_id])
    resolved = []
    for s in sections:
        out = _with_src(s, media)
        if "photos" in s:
            out["photos"] = [_with_src(p, media) for p in s["photos"]]
        resolved.append(out)
    return PostDetail(
        id=str(post.id), slug=post.slug, title=post.title, date=post.date_label, region=post.region,
        tags=post.tags or [], preview_description=post.preview_description,
        hero_image=resolve_image(media, post.hero_media_id), hero_alt=post.hero_alt,
        cover_photo=resolve_image(media, post.cover_media_id), cover_alt=post.cover_alt,
        cover_caption=post.cover_caption, sections=resolved,
    )
