"""Admin editing of site content: newsletters, travel places, books, coding
projects, and image uploads. Admin-only.

Images are uploaded first (POST /api/admin/media) and then referenced by id.
Responses carry a `previews` map ({media_id: thumbnail url}) so the editor can
show thumbnails without another request.
"""

import asyncio
import re
import uuid
from datetime import date, datetime
from decimal import Decimal
from typing import Annotated, Any, Literal

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from pydantic import BaseModel, ConfigDict, Field, StringConstraints, field_validator, model_validator
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError

from app.countries import CONTINENTS, COUNTRY_CODES, US_STATE_CODES
from app.deps import AdminUser, SessionDep, require_admin
from app.importer import fetch_cover
from app.media import BadImage, image_json, load_media, store_image
from app.models import Book, Media, Place, PlaceKind, PlaceStatus, Post, Project

router = APIRouter(prefix="/api/admin", tags=["admin-content"], dependencies=[Depends(require_admin)])

MAX_UPLOAD_BYTES = 30 * 1024 * 1024

Text = Annotated[str, StringConstraints(strip_whitespace=True, max_length=20_000)]
Line = Annotated[str, StringConstraints(strip_whitespace=True, max_length=500)]
Title = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=300)]
Tag = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=60)]
Slug = Annotated[str, StringConstraints(pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$", max_length=200)]


class Strict(BaseModel):
    model_config = ConfigDict(extra="forbid")


def _404(what: str):
    return HTTPException(status.HTTP_404_NOT_FOUND, f"{what} not found")


async def _require_media(session, ids) -> None:
    """Every referenced image must exist (JSON references have no foreign key)."""
    wanted = {uuid.UUID(str(i)) for i in ids if i}
    if wanted:
        found = set(await session.scalars(select(Media.id).where(Media.id.in_(wanted))))
        if wanted - found:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "An image is missing; please upload it again")


async def _previews(session, ids) -> dict[str, str]:
    media = await load_media(session, ids)
    return {str(m.id): image_json(m, "sm")["src"] for m in media.values()}


def _ids(*values) -> list[uuid.UUID]:
    return [v for v in values if v]


# ── Images ───────────────────────────────────────────────────────────


class MediaOut(BaseModel):
    id: uuid.UUID
    src: str
    width: int
    height: int


@router.post("/media", response_model=MediaOut, status_code=status.HTTP_201_CREATED)
async def upload_image(request: Request, admin: AdminUser, session: SessionDep,
                       filename: Annotated[str, Query(max_length=255)] = "upload"):
    """Upload one image as the raw request body (Content-Type: image/*).

    It's resized to WebP with all metadata (including GPS location) removed."""
    if not request.headers.get("content-type", "").startswith("image/"):
        raise HTTPException(status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, "Upload an image file")
    if int(request.headers.get("content-length") or 0) > MAX_UPLOAD_BYTES:
        raise HTTPException(status.HTTP_413_CONTENT_TOO_LARGE, "Images must be under 30 MB")
    data = bytearray()
    async for chunk in request.stream():
        data += chunk
        if len(data) > MAX_UPLOAD_BYTES:
            raise HTTPException(status.HTTP_413_CONTENT_TOO_LARGE, "Images must be under 30 MB")
    try:
        media = await store_image(session, bytes(data), filename, uploaded_by=admin.id)
    except BadImage:
        raise HTTPException(status.HTTP_400_BAD_REQUEST,
                            "That file couldn't be read as an image (JPEG, PNG, WebP or GIF work)")
    await session.commit()
    return MediaOut(id=media.id, **image_json(media, "sm"))


# ── Newsletters ──────────────────────────────────────────────────────


class Photo(Strict):
    media_id: uuid.UUID
    caption: Line | None = None


class Section(Strict):
    """One block of a newsletter. Which fields apply depends on `type`."""

    type: Literal["paragraph", "callout", "quote", "image", "photo-left", "photo-right", "three-photos"]
    content: Text | None = None  # paragraph, callout (subheading), quote
    label: Line | None = None  # quote
    media_id: uuid.UUID | None = None  # image, photo-left/right
    caption: Line | None = None  # image, photo-left/right
    text: Text | None = None  # photo-left/right: text beside the photo
    photos: list[Photo] | None = Field(None, max_length=3)  # three-photos

    @model_validator(mode="after")
    def _complete(self):
        if self.type in ("paragraph", "callout", "quote") and not self.content:
            raise ValueError(f"a {self.type} section needs text")
        if self.type in ("image", "photo-left", "photo-right") and not self.media_id:
            raise ValueError(f"a {self.type} section needs a photo")
        if self.type == "three-photos" and not self.photos:
            raise ValueError("a three-photos section needs at least one photo")
        return self

    def stored(self) -> dict[str, Any]:
        keep = {
            "paragraph": ("content",), "callout": ("content",), "quote": ("content", "label"),
            "image": ("media_id", "caption"), "photo-left": ("media_id", "caption", "text"),
            "photo-right": ("media_id", "caption", "text"), "three-photos": ("photos",),
        }[self.type]
        out: dict[str, Any] = {"type": self.type}
        for field in keep:
            value = getattr(self, field)
            if field == "photos":
                out["photos"] = [{"media_id": str(p.media_id), **({"caption": p.caption} if p.caption else {})}
                                 for p in value]
            elif value:
                out[field] = str(value) if field == "media_id" else value
        return out


def _section_media(sections: list[dict]) -> list[str]:
    ids = []
    for s in sections:
        ids.append(s.get("media_id"))
        ids.extend(p.get("media_id") for p in s.get("photos") or [])
    return [i for i in ids if i]


class PostIn(Strict):
    slug: Slug
    title: Title
    date_label: Annotated[str, StringConstraints(strip_whitespace=True, max_length=100)] = ""
    region: Annotated[str, StringConstraints(strip_whitespace=True, max_length=50)] | None = None
    tags: list[Tag] = Field(default_factory=list, max_length=12)
    preview_description: Annotated[str, StringConstraints(strip_whitespace=True, max_length=1000)] | None = None
    hero_media_id: uuid.UUID | None = None
    hero_alt: Line | None = None
    cover_media_id: uuid.UUID | None = None
    cover_alt: Line | None = None
    cover_caption: Line | None = None
    sections: list[Section] = Field(default_factory=list, max_length=300)
    published: bool = False


class PostListItem(BaseModel):
    id: uuid.UUID
    slug: str
    title: str
    date_label: str
    published: bool
    position: int
    updated_at: datetime


class PostAdminOut(PostListItem):
    region: str | None
    tags: list[str]
    preview_description: str | None
    hero_media_id: uuid.UUID | None
    hero_alt: str | None
    cover_media_id: uuid.UUID | None
    cover_alt: str | None
    cover_caption: str | None
    sections: list[dict[str, Any]]
    previews: dict[str, str]


async def _post_out(session, post: Post) -> PostAdminOut:
    fields = {f: getattr(post, f) for f in PostAdminOut.model_fields if f != "previews"}
    previews = await _previews(session, _section_media(post.sections) + _ids(post.hero_media_id, post.cover_media_id))
    return PostAdminOut(**fields, previews=previews)


async def _get_post(session, post_id: uuid.UUID) -> Post:
    post = await session.get(Post, post_id)
    if post is None:
        raise _404("Newsletter")
    return post


async def _save_post(session, post: Post, body: PostIn) -> None:
    sections = [s.stored() for s in body.sections]
    await _require_media(session, _section_media(sections) + _ids(body.hero_media_id, body.cover_media_id))
    old_slug = post.slug
    for field, value in body.model_dump(exclude={"sections"}).items():
        setattr(post, field, value)
    post.sections = sections
    session.add(post)
    try:
        await session.flush()
    except IntegrityError:
        await session.rollback()
        raise HTTPException(status.HTTP_409_CONFLICT, "Another newsletter already uses that URL slug")
    if old_slug and old_slug != body.slug:
        # Keep the travel map's links to this newsletter working.
        for place in await session.scalars(select(Place).where(Place.newsletter_slugs.contains([old_slug]))):
            place.newsletter_slugs = [body.slug if s == old_slug else s for s in place.newsletter_slugs]
    await session.commit()
    await session.refresh(post)


@router.get("/posts", response_model=list[PostListItem])
async def list_posts(session: SessionDep):
    return (await session.scalars(select(Post).order_by(Post.position.desc()))).all()


@router.get("/posts/{post_id}", response_model=PostAdminOut)
async def get_post(post_id: uuid.UUID, session: SessionDep):
    return await _post_out(session, await _get_post(session, post_id))


@router.post("/posts", response_model=PostAdminOut, status_code=status.HTTP_201_CREATED)
async def create_post(body: PostIn, session: SessionDep):
    top = await session.scalar(select(func.max(Post.position)))
    post = Post(position=(top or 0) + 1)  # newest first
    await _save_post(session, post, body)
    return await _post_out(session, post)


@router.put("/posts/{post_id}", response_model=PostAdminOut)
async def update_post(post_id: uuid.UUID, body: PostIn, session: SessionDep):
    post = await _get_post(session, post_id)
    await _save_post(session, post, body)
    return await _post_out(session, post)


@router.delete("/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(post_id: uuid.UUID, session: SessionDep):
    post = await _get_post(session, post_id)
    for place in await session.scalars(select(Place).where(Place.newsletter_slugs.contains([post.slug]))):
        place.newsletter_slugs = [s for s in place.newsletter_slugs if s != post.slug]
    await session.delete(post)
    await session.commit()


# ── Travel places ────────────────────────────────────────────────────


class PlaceIn(Strict):
    kind: PlaceKind
    code: Annotated[str, StringConstraints(strip_whitespace=True, to_upper=True, min_length=2, max_length=2)]
    name: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=200)]
    continent: Literal[CONTINENTS] | None = None  # type: ignore[valid-type]
    status: PlaceStatus = PlaceStatus.visited
    description: Annotated[str, StringConstraints(strip_whitespace=True, max_length=5000)] = ""
    newsletter_slugs: list[Slug] = Field(default_factory=list, max_length=50)
    photo_media_id: uuid.UUID | None = None

    @model_validator(mode="after")
    def _known_code(self):
        known = COUNTRY_CODES if self.kind == PlaceKind.country else US_STATE_CODES
        if self.code not in known:
            what = "two-letter country code" if self.kind == PlaceKind.country else "US state code"
            raise ValueError(f"{self.code} isn't a known {what}")
        if self.kind == PlaceKind.state:
            self.continent = "North America"
        return self


class PlaceAdminOut(BaseModel):
    id: uuid.UUID
    kind: PlaceKind
    code: str
    name: str
    continent: str | None
    status: PlaceStatus
    description: str
    newsletter_slugs: list[str]
    photo_media_id: uuid.UUID | None
    updated_at: datetime


class PlacesAdminOut(BaseModel):
    places: list[PlaceAdminOut]
    previews: dict[str, str]


async def _get_place(session, place_id: uuid.UUID) -> Place:
    place = await session.get(Place, place_id)
    if place is None:
        raise _404("Place")
    return place


async def _save_place(session, place: Place, body: PlaceIn) -> PlaceAdminOut:
    await _require_media(session, _ids(body.photo_media_id))
    slugs = list(dict.fromkeys(body.newsletter_slugs))
    if slugs:
        found = set(await session.scalars(select(Post.slug).where(Post.slug.in_(slugs))))
        if missing := [s for s in slugs if s not in found]:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, f"No newsletter with slug: {', '.join(missing)}")
    for field, value in body.model_dump().items():
        setattr(place, field, value)
    place.newsletter_slugs = slugs
    session.add(place)
    try:
        await session.commit()
    except IntegrityError:
        await session.rollback()
        raise HTTPException(status.HTTP_409_CONFLICT, f"{body.name} is already on the map")
    await session.refresh(place)
    return PlaceAdminOut.model_validate(place, from_attributes=True)


@router.get("/places", response_model=PlacesAdminOut)
async def list_places(session: SessionDep):
    places = (await session.scalars(select(Place).order_by(Place.kind, Place.name))).all()
    return PlacesAdminOut(
        places=[PlaceAdminOut.model_validate(p, from_attributes=True) for p in places],
        previews=await _previews(session, (p.photo_media_id for p in places)),
    )


@router.post("/places", response_model=PlaceAdminOut, status_code=status.HTTP_201_CREATED)
async def create_place(body: PlaceIn, session: SessionDep):
    place = Place()
    return await _save_place(session, place, body)


@router.put("/places/{place_id}", response_model=PlaceAdminOut)
async def update_place(place_id: uuid.UUID, body: PlaceIn, session: SessionDep):
    return await _save_place(session, await _get_place(session, place_id), body)


@router.delete("/places/{place_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_place(place_id: uuid.UUID, session: SessionDep):
    await session.delete(await _get_place(session, place_id))
    await session.commit()


# ── Books ────────────────────────────────────────────────────────────


def normalize_isbn(v: str | None) -> str | None:
    if not v or not v.strip():
        return None
    digits = re.sub(r"[\s-]", "", v)
    if not re.fullmatch(r"\d{13}", digits):
        raise ValueError("ISBN-13 should be 13 digits")
    return digits


class BookIn(Strict):
    title: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=500)]
    author: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=300)]
    isbn13: str | None = None
    rating: Decimal = Field(ge=0, le=5)
    review: Text = ""
    date_read: date | None = None
    cover_media_id: uuid.UUID | None = None
    currently_reading: bool = False

    _isbn = field_validator("isbn13")(lambda v: normalize_isbn(v))

    @field_validator("rating")
    @classmethod
    def _half_stars(cls, v: Decimal) -> Decimal:
        if (v * 2) % 1:
            raise ValueError("rating goes in half stars")
        return v


class BookAdminOut(BaseModel):
    id: uuid.UUID
    title: str
    author: str
    isbn13: str | None
    rating: float
    review: str
    date_read: date | None
    cover_media_id: uuid.UUID | None
    currently_reading: bool
    cover_url: str | None = None
    updated_at: datetime


async def _book_out(session, book: Book) -> BookAdminOut:
    out = BookAdminOut.model_validate(book, from_attributes=True)
    out.cover_url = (await _previews(session, _ids(book.cover_media_id))).get(str(book.cover_media_id))
    return out


async def _save_book(session, book: Book, body: BookIn) -> BookAdminOut:
    await _require_media(session, _ids(body.cover_media_id))
    for field, value in body.model_dump().items():
        setattr(book, field, value)
    session.add(book)
    await session.commit()
    await session.refresh(book)
    return await _book_out(session, book)


async def _get_book(session, book_id: uuid.UUID) -> Book:
    book = await session.get(Book, book_id)
    if book is None:
        raise _404("Book")
    return book


@router.get("/books", response_model=list[BookAdminOut])
async def list_books(session: SessionDep):
    books = (await session.scalars(
        select(Book).order_by(Book.date_read.desc().nulls_last(), Book.rating.desc(), Book.title))).all()
    previews = await _previews(session, (b.cover_media_id for b in books))
    out = []
    for b in books:
        item = BookAdminOut.model_validate(b, from_attributes=True)
        item.cover_url = previews.get(str(b.cover_media_id))
        out.append(item)
    return out


@router.post("/books", response_model=BookAdminOut, status_code=status.HTTP_201_CREATED)
async def create_book(body: BookIn, session: SessionDep):
    book = Book()
    return await _save_book(session, book, body)


@router.put("/books/{book_id}", response_model=BookAdminOut)
async def update_book(book_id: uuid.UUID, body: BookIn, session: SessionDep):
    return await _save_book(session, await _get_book(session, book_id), body)


@router.delete("/books/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_book(book_id: uuid.UUID, session: SessionDep):
    await session.delete(await _get_book(session, book_id))
    await session.commit()


class CoverLookup(Strict):
    isbn13: str

    _isbn = field_validator("isbn13")(lambda v: normalize_isbn(v))


@router.post("/books/find-cover", response_model=MediaOut)
async def find_cover(body: CoverLookup, admin: AdminUser, session: SessionDep):
    """Look up a cover by ISBN (Open Library, then Google Books) and store a private copy."""
    data = await asyncio.to_thread(fetch_cover, body.isbn13) if body.isbn13 else None
    if not data:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No cover found for that ISBN; you can upload one instead")
    try:
        media = await store_image(session, data, f"cover-{body.isbn13}.jpg", uploaded_by=admin.id)
    except BadImage:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No usable cover found for that ISBN")
    await session.commit()
    return MediaOut(id=media.id, **image_json(media, "sm"))


# ── Coding projects ──────────────────────────────────────────────────


class ExtraImageIn(Strict):
    media_id: uuid.UUID
    caption: Line | None = None


class ProjectIn(Strict):
    title: Title
    tag: Annotated[str, StringConstraints(strip_whitespace=True, max_length=200)] = ""
    description: Text = ""
    long_description: Text | None = None
    github_url: Annotated[str, StringConstraints(strip_whitespace=True, max_length=500,
                                                 pattern=r"^https?://\S+$")] | None = None
    year: Annotated[str, StringConstraints(strip_whitespace=True, max_length=20)] | None = None
    tech: list[Tag] = Field(default_factory=list, max_length=30)
    team: Annotated[str, StringConstraints(strip_whitespace=True, max_length=300)] | None = None
    image_media_id: uuid.UUID | None = None
    extra_images: list[ExtraImageIn] = Field(default_factory=list, max_length=30)

    @field_validator("github_url", "year", "team", "long_description", mode="before")
    @classmethod
    def _blank_is_none(cls, v):
        return None if isinstance(v, str) and not v.strip() else v


class ProjectAdminOut(BaseModel):
    id: int
    title: str
    tag: str
    description: str
    long_description: str | None
    github_url: str | None
    year: str | None
    tech: list[str]
    team: str | None
    image_media_id: uuid.UUID | None
    extra_images: list[dict[str, Any]]
    position: int
    updated_at: datetime


class ProjectsAdminOut(BaseModel):
    projects: list[ProjectAdminOut]
    previews: dict[str, str]


def _project_media(p) -> list:
    return _ids(p.image_media_id) + [e["media_id"] if isinstance(e, dict) else e.media_id for e in p.extra_images]


async def _get_project(session, project_id: int) -> Project:
    project = await session.get(Project, project_id)
    if project is None:
        raise _404("Project")
    return project


async def _projects_out(session) -> ProjectsAdminOut:
    projects = (await session.scalars(select(Project).order_by(Project.position, Project.id))).all()
    return ProjectsAdminOut(
        projects=[ProjectAdminOut.model_validate(p, from_attributes=True) for p in projects],
        previews=await _previews(session, [i for p in projects for i in _project_media(p)]),
    )


async def _save_project(session, project: Project, body: ProjectIn) -> ProjectAdminOut:
    await _require_media(session, _project_media(body))
    for field, value in body.model_dump(exclude={"extra_images"}).items():
        setattr(project, field, value)
    project.extra_images = [{"media_id": str(e.media_id), "caption": e.caption} for e in body.extra_images]
    session.add(project)
    await session.commit()
    await session.refresh(project)
    return ProjectAdminOut.model_validate(project, from_attributes=True)


@router.get("/projects", response_model=ProjectsAdminOut)
async def list_projects(session: SessionDep):
    return await _projects_out(session)


@router.post("/projects", response_model=ProjectAdminOut, status_code=status.HTTP_201_CREATED)
async def create_project(body: ProjectIn, session: SessionDep):
    last = await session.scalar(select(func.max(Project.position)))
    project = Project(position=(last if last is not None else -1) + 1)
    return await _save_project(session, project, body)


@router.put("/projects/{project_id}", response_model=ProjectAdminOut)
async def update_project(project_id: int, body: ProjectIn, session: SessionDep):
    return await _save_project(session, await _get_project(session, project_id), body)


@router.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(project_id: int, session: SessionDep):
    await session.delete(await _get_project(session, project_id))
    await session.commit()


class ProjectOrder(Strict):
    ids: list[int] = Field(max_length=500)


@router.put("/projects-order", response_model=ProjectsAdminOut)
async def reorder_projects(body: ProjectOrder, session: SessionDep):
    """Set the carousel order: `ids` lists every project, first to last."""
    projects = {p.id: p for p in await session.scalars(select(Project))}
    if sorted(body.ids) != sorted(projects):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "List every project exactly once")
    for i, pid in enumerate(body.ids):
        projects[pid].position = i
    await session.commit()
    return await _projects_out(session)
