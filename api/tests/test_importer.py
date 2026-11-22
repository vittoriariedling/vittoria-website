import json

import pytest
from sqlalchemy import func, select

from app import importer, storage
from app.models import Book, Media, Place, Post, Project, SiteContent
from tests.images import jpeg


@pytest.fixture(scope="module", autouse=True)
def _bucket():
    storage.ensure_bucket()


def _write_assets(root, *, posts_extra=()):
    (root / "newsletter photos" / "week1").mkdir(parents=True)
    (root / "coding projects").mkdir()
    (root / "_export").mkdir()
    (root / "newsletter photos" / "week1" / "a.jpg").write_bytes(jpeg(color=(1, 1, 1), gps=True))
    (root / "newsletter photos" / "week1" / "b.jpg").write_bytes(jpeg(color=(2, 2, 2)))
    # Same bytes as a.jpg under another name: should be stored once.
    (root / "newsletter photos" / "week1" / "a-copy.jpg").write_bytes(jpeg(color=(1, 1, 1), gps=True))
    (root / "coding projects" / "sample.png").write_bytes(jpeg(color=(3, 3, 3)))
    (root / "hero.mp4").write_bytes(b"not really a video")

    img = lambda rel: {"$image": rel}  # noqa: E731
    content = {
        "exportedAt": "now",
        "books": [{"id": "1001", "title": " A Sample Book ", "author": "Test Author",
                   "isbn13": "", "rating": 4.5, "review": "", "dateRead": "2022/04/23"}],
        "projects": [
            {"id": 1, "title": "Sample", "tag": "Web", "imageURL": "sample.png", "githubURL": "https://g", "description": "d"},
            {"id": 5, "title": "Placeholder", "imageURL": "https://via.placeholder.com/300", "tech": "Python, SQL"},
        ],
        "posts": [
            {"id": 1, "title": "Week 1", "date": "January 2026", "slug": "week-1", "position": 1,
             "coverPhoto": img("newsletter photos/week1/a-copy.jpg"),
             "sections": [
                 {"type": "paragraph", "content": "Hello"},
                 {"type": "image", "src": img("newsletter photos/week1/a.jpg"), "caption": "A"},
                 {"type": "three-photos", "photos": [{"src": img("newsletter photos/week1/b.jpg"), "caption": "B"}]},
             ]},
            *posts_extra,
        ],
        "countries": [{"id": "FRA", "name": "France", "continent": "Europe", "status": "lived",
                       "photo": None, "description": "Home", "newsletterSlugs": ["week-1", ""]}],
        "states": [{"id": "CO", "name": "Colorado", "status": "lived", "photo": None, "description": ""}],
        "site": {"home": {"greeting": "Hey there", "heroVideo": {"$file": "hero.mp4"},
                          "photo": img("newsletter photos/week1/b.jpg")}},
    }
    (root / "_export" / "content.json").write_text(json.dumps(content), encoding="utf-8")
    return content


async def _count(session, model):
    return await session.scalar(select(func.count()).select_from(model))


async def test_import_end_to_end_and_idempotent(tmp_path, session):
    _write_assets(tmp_path)
    await importer.run(tmp_path, skip_covers=True, prune=False)

    assert await _count(session, Media) == 3  # a, b, sample (a-copy deduplicated)
    book = await session.scalar(select(Book))
    assert book.title == "A Sample Book" and book.isbn13 is None
    assert str(book.rating) == "4.5" and book.date_read.isoformat() == "2022-04-23"

    sample, placeholder = (await session.scalars(select(Project).order_by(Project.id))).all()
    assert sample.image_media_id is not None and placeholder.image_media_id is None
    assert placeholder.tech == ["Python", "SQL"]

    post = await session.scalar(select(Post))
    assert post.sections[1]["media_id"] and "src" not in post.sections[1]
    assert post.sections[2]["photos"][0]["media_id"] and post.sections[2]["photos"][0]["caption"] == "B"
    assert post.cover_media_id is not None
    assert str(post.cover_media_id) == post.sections[1]["media_id"]  # same photo, same media row

    site = (await session.get(SiteContent, 1)).data
    assert site["home"]["greeting"] == "Hey there"
    assert site["home"]["heroVideo"]["content_type"] == "video/mp4"
    assert site["home"]["heroVideo"]["storage_key"].startswith("site/") and site["home"]["heroVideo"]["storage_key"].endswith(".mp4")
    assert site["home"]["photo"]["media_id"] == post.sections[2]["photos"][0]["media_id"]

    france = await session.scalar(select(Place).where(Place.code == "FR"))
    assert france.newsletter_slugs == ["week-1"]

    # Running again changes nothing and processes no images.
    await importer.run(tmp_path, skip_covers=True, prune=False)
    assert await _count(session, Media) == 3
    assert await _count(session, Post) == 1 and await _count(session, Book) == 1


async def test_import_updates_and_prunes(tmp_path, session):
    content = _write_assets(tmp_path)
    await importer.run(tmp_path, skip_covers=True, prune=False)

    content["posts"][0]["title"] = "Week 1 (edited)"
    content["books"] = []
    (tmp_path / "_export" / "content.json").write_text(json.dumps(content), encoding="utf-8")

    # By default existing records are left alone (they may have been edited in the admin page).
    await importer.run(tmp_path, skip_covers=True, prune=False)
    assert (await session.scalar(select(Post.title))) == "Week 1"

    await importer.run(tmp_path, skip_covers=True, prune=False, overwrite=True)
    session.expire_all()
    assert (await session.scalar(select(Post.title))) == "Week 1 (edited)"
    assert await _count(session, Book) == 1  # not pruned without --prune

    with pytest.raises(importer.ImportFailed, match="--overwrite"):
        await importer.run(tmp_path, skip_covers=True, prune=True)
    await importer.run(tmp_path, skip_covers=True, prune=True, overwrite=True)
    assert await _count(session, Book) == 0


async def test_missing_image_fails_clearly(tmp_path):
    _write_assets(tmp_path, posts_extra=[{
        "title": "Broken", "slug": "broken", "position": 2,
        "sections": [{"type": "image", "src": {"$image": "newsletter photos/nope.jpg"}}],
    }])
    with pytest.raises(importer.ImportFailed, match="image not found: newsletter photos/nope.jpg"):
        await importer.run(tmp_path, skip_covers=True, prune=False)


async def test_image_paths_cannot_escape_assets(tmp_path):
    _write_assets(tmp_path, posts_extra=[{
        "title": "Evil", "slug": "evil", "position": 2,
        "sections": [{"type": "image", "src": {"$image": "../../etc/passwd"}}],
    }])
    with pytest.raises(importer.ImportFailed, match="escapes"):
        await importer.run(tmp_path, skip_covers=True, prune=False)


async def test_missing_export_explains_next_step(tmp_path):
    with pytest.raises(importer.ImportFailed, match="export-content.mjs"):
        await importer.run(tmp_path, skip_covers=True, prune=False)
