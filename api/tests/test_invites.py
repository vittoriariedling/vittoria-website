import asyncio
from datetime import timedelta
from urllib.parse import parse_qs, urlparse

from sqlalchemy import select, update

from app.models import Invite, User
from app.routers.auth import REFRESH_COOKIE
from app.security import hash_opaque_token, utcnow
from tests.conftest import make_user, new_client

NEW_PW = "brand new password 123"


async def create_invite(client, headers, **body):
    body.setdefault("kind", "link")
    r = await client.post("/api/admin/invites", json=body, headers=headers)
    assert r.status_code == 201, r.text
    return r.json()


async def register(client, token, email="new@example.com", name="New Person", password=NEW_PW):
    return await client.post("/api/auth/register", json={
        "invite_token": token, "email": email, "display_name": name, "password": password,
    })


# ── Admin invite management ──────────────────────────────────────────


async def test_create_link_invite_returns_token_once_and_stores_hash(client, admin_headers, session):
    inv = await create_invite(client, admin_headers, max_uses=5, note="friends")
    assert inv["status"] == "active" and inv["max_uses"] == 5
    qs = parse_qs(urlparse(inv["url"]).query)
    assert qs["invite"] == [inv["token"]]
    assert inv["url"].startswith("http://localhost:5173/register?")

    row = await session.scalar(select(Invite))
    assert row.token_hash == hash_opaque_token(inv["token"])
    assert inv["token"] not in row.token_hash

    listed = (await client.get("/api/admin/invites", headers=admin_headers)).json()
    assert len(listed) == 1 and "token" not in listed[0] and "url" not in listed[0]


async def test_email_invite_forces_single_use_and_requires_email(client, admin_headers):
    inv = await create_invite(client, admin_headers, kind="email", email="Friend@Example.com", max_uses=50)
    assert inv["max_uses"] == 1 and inv["email"] == "friend@example.com"

    r = await client.post("/api/admin/invites", json={"kind": "email"}, headers=admin_headers)
    assert r.status_code == 422
    r = await client.post("/api/admin/invites", json={"kind": "link", "email": "a@example.com"},
                          headers=admin_headers)
    assert r.status_code == 422


async def test_email_invite_for_existing_account_rejected(client, admin_headers, user):
    r = await client.post("/api/admin/invites", json={"kind": "email", "email": "member@example.com"},
                          headers=admin_headers)
    assert r.status_code == 409


async def test_admin_endpoints_forbidden_for_members(client, user):
    from tests.conftest import auth_headers
    h = await auth_headers(client)
    assert (await client.get("/api/admin/invites", headers=h)).status_code == 403
    assert (await client.post("/api/admin/invites", json={"kind": "link"}, headers=h)).status_code == 403
    assert (await client.get("/api/admin/invites")).status_code == 401


# ── Checking and registering ─────────────────────────────────────────


async def test_check_invite(client, admin_headers):
    inv = await create_invite(client, admin_headers, kind="email", email="friend@example.com")
    r = await client.post("/api/auth/invites/check", json={"token": inv["token"]})
    assert r.status_code == 200
    assert r.json()["email"] == "friend@example.com" and r.json()["kind"] == "email"
    assert (await client.post("/api/auth/invites/check", json={"token": "bogus"})).status_code == 404


async def test_register_with_link_invite_logs_in(client, admin_headers, session):
    inv = await create_invite(client, admin_headers, max_uses=2)
    async with new_client() as c:
        r = await register(c, inv["token"], email="  New@Example.com ", name="  New Person  ")
        assert r.status_code == 201, r.text
        body = r.json()
        assert body["user"]["email"] == "new@example.com"
        assert body["user"]["display_name"] == "New Person"
        assert body["user"]["role"] == "member"
        assert REFRESH_COOKIE in c.cookies
        me = await c.get("/api/users/me", headers={"Authorization": f"Bearer {body['access_token']}"})
        assert me.status_code == 200

    user = await session.scalar(select(User).where(User.email == "new@example.com"))
    assert user.invited_by_invite_id is not None
    row = await session.scalar(select(Invite))
    assert row.use_count == 1


async def test_link_invite_stops_at_max_uses(client, admin_headers):
    inv = await create_invite(client, admin_headers, max_uses=2)
    assert (await register(client, inv["token"], email="a@example.com")).status_code == 201
    assert (await register(client, inv["token"], email="b@example.com")).status_code == 201
    r = await register(client, inv["token"], email="c@example.com")
    assert r.status_code == 400
    listed = (await client.get("/api/admin/invites", headers=admin_headers)).json()
    assert listed[0]["status"] == "used"


async def test_concurrent_signups_cannot_exceed_max_uses(client, admin_headers, session):
    inv = await create_invite(client, admin_headers, max_uses=1)

    async def attempt(i):
        async with new_client() as c:
            return (await register(c, inv["token"], email=f"racer{i}@example.com")).status_code

    codes = await asyncio.gather(*(attempt(i) for i in range(5)))
    assert sorted(codes) == [201, 400, 400, 400, 400]
    assert (await session.scalar(select(Invite))).use_count == 1


async def test_email_invite_only_works_for_that_email(client, admin_headers):
    inv = await create_invite(client, admin_headers, kind="email", email="friend@example.com")
    r = await register(client, inv["token"], email="someone-else@example.com")
    assert r.status_code == 400
    assert (await register(client, inv["token"], email="FRIEND@example.com")).status_code == 201
    # single use
    assert (await register(client, inv["token"], email="friend@example.com")).status_code == 400


async def test_register_rejects_existing_email(client, admin_headers, user):
    inv = await create_invite(client, admin_headers, max_uses=5)
    r = await register(client, inv["token"], email="member@example.com")
    assert r.status_code == 409


async def test_register_rejects_revoked_and_expired(client, admin_headers, session):
    revoked = await create_invite(client, admin_headers)
    r = await client.post(f"/api/admin/invites/{revoked['id']}/revoke", headers=admin_headers)
    assert r.status_code == 204
    assert (await register(client, revoked["token"])).status_code == 400

    expired = await create_invite(client, admin_headers)
    await session.execute(update(Invite).where(Invite.id == expired["id"])
                          .values(expires_at=utcnow() - timedelta(seconds=1)))
    await session.commit()
    assert (await register(client, expired["token"])).status_code == 400
    statuses = {i["id"]: i["status"] for i in (await client.get("/api/admin/invites", headers=admin_headers)).json()}
    assert statuses == {revoked["id"]: "revoked", expired["id"]: "expired"}


async def test_register_enforces_password_policy(client, admin_headers):
    inv = await create_invite(client, admin_headers)
    assert (await register(client, inv["token"], password="short")).status_code == 422
    assert (await register(client, inv["token"], password="x" * 129)).status_code == 422
    assert (await register(client, inv["token"], name="   ")).status_code == 422


async def test_register_requires_trusted_origin(client, admin_headers):
    inv = await create_invite(client, admin_headers)
    r = await client.post("/api/auth/register", headers={"Origin": "https://evil.example"}, json={
        "invite_token": inv["token"], "email": "x@example.com", "display_name": "X", "password": NEW_PW,
    })
    assert r.status_code == 403


async def test_inactive_admin_cannot_create_invites(client, session):
    from app.models import Role
    from tests.conftest import auth_headers
    admin = await make_user(email="boss@example.com", role=Role.admin)
    h = await auth_headers(client, email="boss@example.com")
    admin.is_active = False
    await session.merge(admin)
    await session.commit()
    assert (await client.post("/api/admin/invites", json={"kind": "link"}, headers=h)).status_code == 401
