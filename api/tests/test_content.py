from datetime import date
from decimal import Decimal

import pytest

from app import storage
from app.media import store_image
from app.models import Book, Place, PlaceKind, PlaceStatus, Post, Project
from tests.conftest import auth_headers
from tests.images import jpeg

ENDPOINTS = ["/api/books", "/api/projects", "/api/projects/1", "/api/places", "/api/posts", "/api/posts/x"]


@pytest.fixture(scope="module", autouse=True)
def _bucket():
    storage.ensure_bucket()


@pytest.fixture
async def headers(client, user):
    return await auth_headers(client)


@pytest.mark.parametrize("path", ENDPOINTS)
async def test_content_requires_login(client, path):
    r = await client.get(path)
    assert r.status_code == 401


async def test_books_sorted_and_shaped(client, headers, session):
    cover = await store_image(session, jpeg(color=(5, 5, 5)), "cover.jpg")
    session.add_all([
        Book(goodreads_id="1", title="Four", author="A", rating=Decimal("4"), review="", date_read=date(2024, 1, 1)),
        Book(goodreads_id="2", title="Five old", author="B", rating=Decimal("5"), review="", date_read=date(2020, 1, 1)),
        Book(goodreads_id="3", title="Five reviewed", author="C", rating=Decimal("5"), review="Loved it",
             date_read=date(2019, 5, 1), cover_media_id=cover.id),
        Book(goodreads_id="4", title="Five new", author="D", rating=Decimal("5"), review="", date_read=date(2023, 1, 1)),
        Book(goodreads_id="5", title="Half", author="E", rating=Decimal("4.5"), review="", date_read=None),
    ])
    await session.commit()

    r = await client.get("/api/books", headers=headers)
    assert r.status_code == 200
    books = r.json()
    # Most recently read first; no read date goes last.
    assert [b["title"] for b in books] == ["Four", "Five new", "Five old", "Five reviewed", "Half"]
    reviewed = books[3]
    assert set(reviewed) == {"id", "title", "author", "isbn13", "rating", "review", "dateRead", "coverUrl", "currentlyReading"}
    assert reviewed["dateRead"] == "2019-05-01"
    assert reviewed["coverUrl"].startswith("http://localhost:8333/test-media/") and "sm.webp" in reviewed["coverUrl"]
    assert books[4]["rating"] == 4.5 and books[4]["coverUrl"] is None


async def test_projects_list_and_detail(client, headers, session):
    img = await store_image(session, jpeg(color=(7, 7, 7)), "sample.png")
    extra = await store_image(session, jpeg(color=(8, 8, 8)), "extra.png")
    session.add_all([
        Project(id=2, title="Second", position=1, tech=["Python"]),
        Project(id=1, title="First", position=0, github_url="https://github.com/x", image_media_id=img.id,
                extra_images=[{"media_id": str(extra.id), "caption": "Screenshot"}]),
    ])
    await session.commit()

    projects = (await client.get("/api/projects", headers=headers)).json()
    assert [p["title"] for p in projects] == ["First", "Second"]
    assert "sm.webp" in projects[0]["image"]["src"] and projects[1]["image"] is None
    assert projects[0]["githubUrl"] == "https://github.com/x"

    detail = (await client.get("/api/projects/1", headers=headers)).json()
    assert "lg.webp" in detail["image"]["src"]
    assert detail["extraImages"][0]["caption"] == "Screenshot" and detail["extraImages"][0]["width"] > 0
    for missing in ("/api/projects/99", "/api/projects/abc"):
        assert (await client.get(missing, headers=headers)).status_code == 404


async def test_places_split_by_kind(client, headers, session):
    session.add_all([
        Place(kind=PlaceKind.country, code="FR", name="France", continent="Europe", status=PlaceStatus.lived,
              description="Home", newsletter_slugs=["first-week"]),
        Place(kind=PlaceKind.state, code="CO", name="Colorado", status=PlaceStatus.lived),
    ])
    await session.commit()
    data = (await client.get("/api/places", headers=headers)).json()
    assert data["countries"] == [{"id": "FR", "name": "France", "continent": "Europe", "status": "lived",
                                  "photo": None, "description": "Home", "newsletterSlugs": ["first-week"]}]
    assert data["states"][0]["id"] == "CO"


async def _seed_posts(session):
    a = await store_image(session, jpeg(color=(10, 0, 0)), "a.jpg")
    b = await store_image(session, jpeg(color=(0, 10, 0)), "b.jpg")
    c = await store_image(session, jpeg(color=(0, 0, 10)), "c.jpg")
    long_para = "word " * 60
    session.add_all([
        Post(slug="old", title="Week 1", date_label="January 2026", position=1, tags=["Travel"],
             sections=[{"type": "paragraph", "content": long_para},
                       {"type": "photo-left", "media_id": str(a.id), "caption": "Plaza", "text": "Hi"},
                       {"type": "three-photos", "photos": [{"media_id": str(b.id), "caption": "1"},
                                                           {"media_id": str(c.id), "caption": "2"}]}]),
        Post(slug="new", title="Week 2", position=2, preview_description="Custom preview", cover_media_id=c.id,
             cover_caption="Cover!", sections=[{"type": "callout", "content": "Day 1"}]),
        Post(slug="draft", title="Draft", position=3, published=False, sections=[]),
    ])
    await session.commit()


async def test_posts_list(client, headers, session):
    await _seed_posts(session)
    posts = (await client.get("/api/posts", headers=headers)).json()
    assert [p["slug"] for p in posts] == ["new", "old"]  # newest first, drafts hidden
    new, old = posts
    assert new["previewText"] == "Custom preview" and new["previewImage"] is None
    assert old["previewText"].endswith("…") and len(old["previewText"]) == 181
    assert "sm.webp" in old["previewImage"]["src"]
    assert "sections" not in old


async def test_post_detail_resolves_images(client, headers, session):
    await _seed_posts(session)
    r = await client.get("/api/posts/old", headers=headers)
    assert r.status_code == 200
    s = r.json()["sections"]
    assert s[1]["src"].startswith("http://localhost:8333/") and s[1]["width"] == 1600
    assert s[1]["caption"] == "Plaza" and s[1]["text"] == "Hi" and "media_id" not in s[1]
    assert [p["caption"] for p in s[2]["photos"]] == ["1", "2"]
    assert all("lg.webp" in p["src"] and "media_id" not in p for p in s[2]["photos"])

    new = (await client.get("/api/posts/new", headers=headers)).json()
    assert new["coverPhoto"]["src"] and new["coverCaption"] == "Cover!" and new["heroImage"] is None

    for missing in ("/api/posts/nope", "/api/posts/draft"):
        assert (await client.get(missing, headers=headers)).status_code == 404


async def test_site_content_requires_login_and_resolves_files(client, headers, session):
    from app.models import SiteContent

    assert (await client.get("/api/site")).status_code == 401
    assert (await client.get("/api/site", headers=headers)).json() == {}  # nothing imported yet

    photo = await store_image(session, jpeg(color=(4, 4, 4)), "hero.jpg")
    storage.put("site/ab/abc.mp4", b"fake video", "video/mp4")
    session.add(SiteContent(id=1, data={
        "home": {"greeting": "Hey", "heroVideo": {"storage_key": "site/ab/abc.mp4", "content_type": "video/mp4"},
                 "photo": {"media_id": str(photo.id)}},
        "footer": {"links": [{"label": "Instagram", "url": "https://instagram.com/x"}]},
    }))
    await session.commit()

    data = (await client.get("/api/site", headers=headers)).json()
    assert data["home"]["greeting"] == "Hey"
    video = data["home"]["heroVideo"]
    assert video["contentType"] == "video/mp4" and "site/ab/abc.mp4" in video["url"] and "X-Amz-Signature" in video["url"]
    assert "lg.webp" in data["home"]["photo"]["src"]
    assert data["footer"]["links"][0]["url"] == "https://instagram.com/x"
    assert "storage_key" not in str(data) and "media_id" not in str(data)
