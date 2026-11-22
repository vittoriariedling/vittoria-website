import pytest
from sqlalchemy import select

from app import storage
from app.models import Place
from tests.conftest import auth_headers
from tests.images import jpeg

POST = {"slug": "week-20", "title": "Week 20", "date_label": "May 2026", "tags": ["travel"],
        "sections": [{"type": "paragraph", "content": "Hello"}]}


@pytest.fixture(scope="module", autouse=True)
def _bucket():
    storage.ensure_bucket()


async def _upload(client, headers, color=(10, 120, 30)):
    r = await client.post("/api/admin/media?filename=a.jpg", content=jpeg(size=(800, 600), color=color, gps=True),
                          headers={**headers, "Content-Type": "image/jpeg"})
    assert r.status_code == 201, r.text
    return r.json()["id"]


@pytest.mark.parametrize("path", ["/api/admin/posts", "/api/admin/places", "/api/admin/books", "/api/admin/projects"])
async def test_members_cannot_edit(client, user, path):
    headers = await auth_headers(client)
    assert (await client.get(path, headers=headers)).status_code == 403
    assert (await client.post(path, json={}, headers=headers)).status_code == 403


async def test_upload_rejects_non_images(client, admin_headers):
    r = await client.post("/api/admin/media", content=b"not an image",
                          headers={**admin_headers, "Content-Type": "image/jpeg"})
    assert r.status_code == 400
    r = await client.post("/api/admin/media", content=b"x", headers={**admin_headers, "Content-Type": "text/plain"})
    assert r.status_code == 415


async def test_draft_post_hidden_until_published(client, admin_headers, user):
    photo = await _upload(client, admin_headers)
    body = {**POST, "sections": POST["sections"] + [
        {"type": "photo-left", "media_id": photo, "caption": "Retiro", "text": "Sunday walk"},
        {"type": "three-photos", "photos": [{"media_id": photo}, {"media_id": photo, "caption": "b"}]},
    ]}
    r = await client.post("/api/admin/posts", json=body, headers=admin_headers)
    assert r.status_code == 201, r.text
    post = r.json()
    assert post["published"] is False and photo in post["previews"]

    member = await auth_headers(client)
    assert (await client.get("/api/posts/week-20", headers=member)).status_code == 404
    assert all(p["slug"] != "week-20" for p in (await client.get("/api/posts", headers=member)).json())
    # ...but the admin can preview it
    assert (await client.get("/api/posts/week-20", headers=admin_headers)).status_code == 200

    r = await client.put(f"/api/admin/posts/{post['id']}", json={**body, "published": True}, headers=admin_headers)
    assert r.status_code == 200
    detail = (await client.get("/api/posts/week-20", headers=member)).json()
    assert [s["type"] for s in detail["sections"]] == ["paragraph", "photo-left", "three-photos"]
    assert detail["sections"][1]["src"] and detail["sections"][1]["text"] == "Sunday walk"


async def test_post_validation(client, admin_headers):
    bad = [
        {**POST, "slug": "Not A Slug"},
        {**POST, "sections": [{"type": "paragraph"}]},  # no text
        {**POST, "sections": [{"type": "image"}]},  # no photo
        {**POST, "sections": [{"type": "video", "content": "x"}]},
        {**POST, "sections": [{"type": "image", "media_id": "00000000-0000-0000-0000-000000000000"}]},
    ]
    for body in bad:
        r = await client.post("/api/admin/posts", json=body, headers=admin_headers)
        assert r.status_code in (400, 422), body
    assert (await client.post("/api/admin/posts", json=POST, headers=admin_headers)).status_code == 201
    assert (await client.post("/api/admin/posts", json=POST, headers=admin_headers)).status_code == 409


async def test_new_posts_go_first(client, admin_headers):
    for i in range(3):
        await client.post("/api/admin/posts", json={**POST, "slug": f"w{i}", "published": True}, headers=admin_headers)
    slugs = [p["slug"] for p in (await client.get("/api/admin/posts", headers=admin_headers)).json()]
    assert slugs == ["w2", "w1", "w0"]


async def test_place_links_follow_slug_changes(client, admin_headers, session):
    post = (await client.post("/api/admin/posts", json=POST, headers=admin_headers)).json()
    r = await client.post("/api/admin/places", headers=admin_headers, json={
        "kind": "country", "code": "fr", "name": "France", "continent": "Europe", "status": "lived",
        "newsletter_slugs": ["week-20"]})
    assert r.status_code == 201, r.text
    assert r.json()["code"] == "FR"

    await client.put(f"/api/admin/posts/{post['id']}", json={**POST, "slug": "week-twenty"}, headers=admin_headers)
    place = await session.scalar(select(Place))
    assert place.newsletter_slugs == ["week-twenty"]

    await client.delete(f"/api/admin/posts/{post['id']}", headers=admin_headers)
    await session.refresh(place)
    assert place.newsletter_slugs == []


async def test_place_validation(client, admin_headers):
    base = {"kind": "country", "code": "FR", "name": "France"}
    assert (await client.post("/api/admin/places", json={**base, "code": "FRA"}, headers=admin_headers)).status_code == 422
    assert (await client.post("/api/admin/places", json={**base, "code": "ZZ"}, headers=admin_headers)).status_code == 422
    r = await client.post("/api/admin/places", json={**base, "newsletter_slugs": ["nope"]}, headers=admin_headers)
    assert r.status_code == 400
    assert (await client.post("/api/admin/places", json=base, headers=admin_headers)).status_code == 201
    assert (await client.post("/api/admin/places", json=base, headers=admin_headers)).status_code == 409
    state = await client.post("/api/admin/places", json={"kind": "state", "code": "co", "name": "Colorado"},
                              headers=admin_headers)
    assert state.status_code == 201 and state.json()["continent"] == "North America"


async def test_books_crud(client, admin_headers, user):
    cover = await _upload(client, admin_headers)
    body = {"title": "Dune", "author": "Frank Herbert", "isbn13": "978-0-441-17271-9", "rating": 4.5,
            "review": "Spice!", "date_read": "2026-03-01", "cover_media_id": cover}
    r = await client.post("/api/admin/books", json=body, headers=admin_headers)
    assert r.status_code == 201, r.text
    book = r.json()
    assert book["isbn13"] == "9780441172719" and book["cover_url"]

    assert (await client.post("/api/admin/books", json={**body, "rating": 4.3}, headers=admin_headers)).status_code == 422
    assert (await client.post("/api/admin/books", json={**body, "rating": 6}, headers=admin_headers)).status_code == 422

    await client.put(f"/api/admin/books/{book['id']}", json={**body, "rating": 5}, headers=admin_headers)
    public = (await client.get("/api/books", headers=await auth_headers(client))).json()
    assert public[0]["title"] == "Dune" and public[0]["rating"] == 5

    assert (await client.delete(f"/api/admin/books/{book['id']}", headers=admin_headers)).status_code == 204
    assert (await client.get("/api/admin/books", headers=admin_headers)).json() == []


async def test_projects_crud_and_order(client, admin_headers, user):
    img = await _upload(client, admin_headers)
    ids = []
    for title in ("One", "Two", "Three"):
        r = await client.post("/api/admin/projects", headers=admin_headers, json={
            "title": title, "tech": ["Python"], "github_url": "", "image_media_id": img,
            "extra_images": [{"media_id": img, "caption": "screen"}]})
        assert r.status_code == 201, r.text
        assert r.json()["github_url"] is None
        ids.append(r.json()["id"])

    bad = await client.post("/api/admin/projects", json={"title": "x", "github_url": "javascript:alert(1)"},
                            headers=admin_headers)
    assert bad.status_code == 422

    r = await client.put("/api/admin/projects-order", json={"ids": ids[::-1]}, headers=admin_headers)
    assert [p["title"] for p in r.json()["projects"]] == ["Three", "Two", "One"]
    assert (await client.put("/api/admin/projects-order", json={"ids": ids[:2]}, headers=admin_headers)).status_code == 400

    public = (await client.get("/api/projects", headers=await auth_headers(client))).json()
    assert [p["title"] for p in public] == ["Three", "Two", "One"]
    assert public[0]["extraImages"][0]["caption"] == "screen"


async def test_currently_reading_flag(client, admin_headers, user):
    body = {"title": "In Progress", "author": "A", "rating": 0, "currently_reading": True}
    r = await client.post("/api/admin/books", json=body, headers=admin_headers)
    assert r.status_code == 201 and r.json()["currently_reading"] is True
    public = (await client.get("/api/books", headers=await auth_headers(client))).json()
    assert public[0]["currentlyReading"] is True and public[0]["rating"] == 0
