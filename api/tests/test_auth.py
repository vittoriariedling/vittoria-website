from datetime import timedelta

from sqlalchemy import select, update

from app.models import RefreshToken
from app.routers.auth import REFRESH_COOKIE
from app.security import utcnow
from tests.conftest import ORIGIN, PASSWORD, login, make_user, new_client


def _refresh_cookie_header(resp) -> str:
    return next(v for k, v in resp.headers.multi_items() if k == "set-cookie" and v.startswith(REFRESH_COOKIE))


async def test_health(client):
    r = await client.get("/api/health")
    assert r.status_code == 200


# ── Login ────────────────────────────────────────────────────────────


async def test_login_sets_hardened_cookie(client, user):
    r = await login(client)
    assert r.status_code == 200
    body = r.json()
    assert body["token_type"] == "bearer"
    assert body["user"]["email"] == "member@example.com"
    assert "password_hash" not in body["user"]
    assert r.headers["cache-control"] == "no-store"

    cookie = _refresh_cookie_header(r).lower()
    assert "httponly" in cookie
    assert "secure" in cookie
    assert "samesite=strict" in cookie
    assert "path=/api/auth" in cookie
    # The refresh token must never appear in the JSON body.
    assert client.cookies[REFRESH_COOKIE] not in r.text


async def test_login_email_is_case_insensitive(client, user):
    r = await login(client, email="  Member@Example.COM ")
    assert r.status_code == 200


async def test_login_failures_are_indistinguishable(client, user):
    wrong_pw = await login(client, password="nope nope nope")
    no_user = await login(client, email="ghost@example.com")
    assert wrong_pw.status_code == no_user.status_code == 401
    assert wrong_pw.json() == no_user.json()
    assert REFRESH_COOKIE not in client.cookies


async def test_inactive_user_cannot_login(client):
    await make_user(is_active=False)
    r = await login(client)
    assert r.status_code == 401


# ── Access token ─────────────────────────────────────────────────────


async def test_me_requires_access_token(client, user):
    assert (await client.get("/api/users/me")).status_code == 401
    token = (await login(client)).json()["access_token"]
    r = await client.get("/api/users/me", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200
    assert r.json()["email"] == "member@example.com"


async def test_refresh_token_cannot_be_used_as_access_token(client, user):
    await login(client)
    refresh = client.cookies[REFRESH_COOKIE]
    r = await client.get("/api/users/me", headers={"Authorization": f"Bearer {refresh}"})
    assert r.status_code == 401


async def test_deactivated_user_access_token_stops_working(client, user, session):
    token = (await login(client)).json()["access_token"]
    user.is_active = False
    await session.merge(user)
    await session.commit()
    r = await client.get("/api/users/me", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 401


# ── Refresh rotation ─────────────────────────────────────────────────


async def test_refresh_rotates_token(client, user, session):
    await login(client)
    first = client.cookies[REFRESH_COOKIE]

    r = await client.post("/api/auth/refresh")
    assert r.status_code == 200
    assert r.json()["access_token"]
    second = client.cookies[REFRESH_COOKIE]
    assert second != first

    rows = (await session.scalars(select(RefreshToken).order_by(RefreshToken.created_at))).all()
    assert len(rows) == 2
    assert rows[0].used_at is not None and rows[0].replaced_by == rows[1].jti
    assert rows[1].used_at is None
    assert rows[0].family_id == rows[1].family_id


def _set_cookie(c, token):
    c.cookies.set(REFRESH_COOKIE, token, domain="testserver.local", path="/api/auth")


async def _age_used_tokens(session, seconds=60):
    await session.execute(
        update(RefreshToken).where(RefreshToken.used_at.is_not(None))
        .values(used_at=utcnow() - timedelta(seconds=seconds))
    )
    await session.commit()


async def test_reused_refresh_token_revokes_whole_family(client, user, session):
    await login(client)
    stolen = client.cookies[REFRESH_COOKIE]
    assert (await client.post("/api/auth/refresh")).status_code == 200
    legit = client.cookies[REFRESH_COOKIE]
    await _age_used_tokens(session)  # replay happens after the grace window

    # Attacker replays the old token from another client.
    async with new_client() as attacker:
        attacker.cookies.set(REFRESH_COOKIE, stolen, domain="testserver.local", path="/api/auth")
        r = await attacker.post("/api/auth/refresh")
        assert r.status_code == 401

    # The legitimate user's newer token is now dead too.
    client.cookies.set(REFRESH_COOKIE, legit, domain="testserver.local", path="/api/auth")
    assert (await client.post("/api/auth/refresh")).status_code == 401


async def test_lost_refresh_response_is_recovered_within_grace(client, user, session):
    """Tab reloaded mid-refresh: server rotated, browser never stored the new cookie."""
    await login(client)
    first = client.cookies[REFRESH_COOKIE]
    assert (await client.post("/api/auth/refresh")).status_code == 200
    orphan = client.cookies[REFRESH_COOKIE]

    _set_cookie(client, first)  # the browser still has the old cookie
    r = await client.post("/api/auth/refresh")
    assert r.status_code == 200
    third = client.cookies[REFRESH_COOKIE]
    assert third not in (first, orphan)

    rows = {r.jti: r for r in (await session.scalars(select(RefreshToken))).all()}
    assert sum(r.revoked_at is not None for r in rows.values()) == 1  # just the orphan
    assert (await client.post("/api/auth/refresh")).status_code == 200  # session continues


async def test_orphaned_token_presented_later_revokes_family(client, user):
    """If an attacker won the grace race, the real user's next refresh kills everything."""
    await login(client)
    first = client.cookies[REFRESH_COOKIE]
    await client.post("/api/auth/refresh")
    victims_token = client.cookies[REFRESH_COOKIE]

    async with new_client() as attacker:
        _set_cookie(attacker, first)
        assert (await attacker.post("/api/auth/refresh")).status_code == 200  # within grace
        _set_cookie(client, victims_token)
        assert (await client.post("/api/auth/refresh")).status_code == 401  # revoked -> theft
        assert (await attacker.post("/api/auth/refresh")).status_code == 401  # family dead


async def test_reuse_within_grace_after_successor_used_is_theft(client, user):
    await login(client)
    first = client.cookies[REFRESH_COOKIE]
    await client.post("/api/auth/refresh")
    await client.post("/api/auth/refresh")  # successor of `first` has now been used
    latest = client.cookies[REFRESH_COOKIE]

    async with new_client() as attacker:
        _set_cookie(attacker, first)
        assert (await attacker.post("/api/auth/refresh")).status_code == 401
    _set_cookie(client, latest)
    assert (await client.post("/api/auth/refresh")).status_code == 401


async def test_refresh_requires_trusted_origin(client, user):
    await login(client)
    r = await client.post("/api/auth/refresh", headers={"Origin": "https://evil.example"})
    assert r.status_code == 403
    del client.headers["Origin"]
    r = await client.post("/api/auth/refresh")
    assert r.status_code == 403
    client.headers["Origin"] = ORIGIN
    assert (await client.post("/api/auth/refresh")).status_code == 200


async def test_refresh_without_cookie(client):
    assert (await client.post("/api/auth/refresh")).status_code == 401


async def test_expired_refresh_row_rejected_and_cookie_cleared(client, user, session):
    await login(client)
    await session.execute(update(RefreshToken).values(expires_at=utcnow() - timedelta(seconds=1)))
    await session.commit()
    r = await client.post("/api/auth/refresh")
    assert r.status_code == 401
    assert REFRESH_COOKIE not in client.cookies


async def test_refresh_fails_for_deactivated_user(client, user, session):
    await login(client)
    user.is_active = False
    await session.merge(user)
    await session.commit()
    assert (await client.post("/api/auth/refresh")).status_code == 401


# ── Logout ───────────────────────────────────────────────────────────


async def test_logout_revokes_session(client, user):
    await login(client)
    token = client.cookies[REFRESH_COOKIE]
    r = await client.post("/api/auth/logout")
    assert r.status_code == 204
    assert REFRESH_COOKIE not in client.cookies

    client.cookies.set(REFRESH_COOKIE, token, domain="testserver.local", path="/api/auth")
    assert (await client.post("/api/auth/refresh")).status_code == 401


async def test_logout_all_revokes_other_devices(user):
    async with new_client() as laptop, new_client() as phone:
        access = (await login(laptop)).json()["access_token"]
        await login(phone)
        r = await laptop.post("/api/auth/logout-all", headers={"Authorization": f"Bearer {access}"})
        assert r.status_code == 204
        assert (await phone.post("/api/auth/refresh")).status_code == 401


async def test_logout_without_session_is_fine(client):
    assert (await client.post("/api/auth/logout")).status_code == 204


async def test_password_param_upgrade_rehashes_on_login(client, session):
    from pwdlib import PasswordHash
    from pwdlib.hashers.argon2 import Argon2Hasher

    from app.models import User

    weak = PasswordHash((Argon2Hasher(time_cost=1, memory_cost=8 * 1024, parallelism=1),)).hash(PASSWORD)
    u = User(email="old@example.com", display_name="Old", password_hash=weak)
    session.add(u)
    await session.commit()

    assert (await login(client, email="old@example.com")).status_code == 200
    await session.refresh(u)
    assert u.password_hash != weak
    assert "m=65536,t=3,p=4" in u.password_hash
