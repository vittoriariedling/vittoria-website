from datetime import timedelta
from urllib.parse import parse_qs, urlparse

from sqlalchemy import update

from app.models import PasswordReset
from app.security import utcnow
from tests.conftest import PASSWORD, login, new_client

NEW_PW = "a fresh new password!"


def _token(url: str) -> str:
    return parse_qs(urlparse(url).query)["token"][0]


async def test_list_users(client, admin_headers, user):
    r = await client.get("/api/admin/users", headers=admin_headers)
    assert r.status_code == 200
    emails = {u["email"]: u for u in r.json()}
    assert set(emails) == {"admin@example.com", "member@example.com"}
    assert "password_hash" not in emails["member@example.com"]
    assert emails["member@example.com"]["is_active"] is True


async def test_deactivate_user_kills_sessions(client, admin_headers, user):
    async with new_client() as member:
        await login(member)
        r = await client.patch(f"/api/admin/users/{user.id}", json={"is_active": False}, headers=admin_headers)
        assert r.status_code == 200 and r.json()["is_active"] is False
        assert (await member.post("/api/auth/refresh")).status_code == 401
        assert (await login(member)).status_code == 401

    r = await client.patch(f"/api/admin/users/{user.id}", json={"is_active": True}, headers=admin_headers)
    assert r.status_code == 200
    async with new_client() as member:
        assert (await login(member)).status_code == 200


async def test_promote_user(client, admin_headers, user):
    r = await client.patch(f"/api/admin/users/{user.id}", json={"role": "admin"}, headers=admin_headers)
    assert r.json()["role"] == "admin"


async def test_admin_cannot_lock_themselves_out(client, admin, admin_headers):
    for body in ({"is_active": False}, {"role": "member"}):
        r = await client.patch(f"/api/admin/users/{admin.id}", json=body, headers=admin_headers)
        assert r.status_code == 400


async def test_unknown_user_404(client, admin_headers):
    r = await client.patch("/api/admin/users/00000000-0000-0000-0000-000000000000",
                           json={"is_active": False}, headers=admin_headers)
    assert r.status_code == 404


# ── Password reset links ─────────────────────────────────────────────


async def test_reset_link_flow(client, admin_headers, user):
    r = await client.post(f"/api/admin/users/{user.id}/password-reset", headers=admin_headers)
    assert r.status_code == 201
    url = r.json()["url"]
    assert url.startswith("http://localhost:5173/reset-password?token=")
    token = _token(url)

    check = await client.post("/api/auth/password-reset/check", json={"token": token})
    assert check.status_code == 200 and check.json() == {"email": "member@example.com"}

    async with new_client() as member:
        await login(member)  # an existing session, e.g. on a stolen laptop
        r = await client.post("/api/auth/password-reset", json={"token": token, "password": NEW_PW})
        assert r.status_code == 204
        assert (await member.post("/api/auth/refresh")).status_code == 401

    assert (await login(client, password=PASSWORD)).status_code == 401
    assert (await login(client, password=NEW_PW)).status_code == 200
    # single use
    r = await client.post("/api/auth/password-reset", json={"token": token, "password": "another password!!"})
    assert r.status_code == 400


async def test_new_reset_link_invalidates_old_one(client, admin_headers, user):
    first = _token((await client.post(f"/api/admin/users/{user.id}/password-reset", headers=admin_headers)).json()["url"])
    second = _token((await client.post(f"/api/admin/users/{user.id}/password-reset", headers=admin_headers)).json()["url"])
    assert (await client.post("/api/auth/password-reset/check", json={"token": first})).status_code == 404
    assert (await client.post("/api/auth/password-reset/check", json={"token": second})).status_code == 200


async def test_expired_reset_link_rejected(client, admin_headers, user, session):
    token = _token((await client.post(f"/api/admin/users/{user.id}/password-reset", headers=admin_headers)).json()["url"])
    await session.execute(update(PasswordReset).values(expires_at=utcnow() - timedelta(seconds=1)))
    await session.commit()
    r = await client.post("/api/auth/password-reset", json={"token": token, "password": NEW_PW})
    assert r.status_code == 400


async def test_reset_enforces_password_policy(client, admin_headers, user):
    token = _token((await client.post(f"/api/admin/users/{user.id}/password-reset", headers=admin_headers)).json()["url"])
    r = await client.post("/api/auth/password-reset", json={"token": token, "password": "short"})
    assert r.status_code == 422


async def test_reset_link_for_deactivated_user_refused(client, admin_headers, user):
    await client.patch(f"/api/admin/users/{user.id}", json={"is_active": False}, headers=admin_headers)
    r = await client.post(f"/api/admin/users/{user.id}/password-reset", headers=admin_headers)
    assert r.status_code == 400
