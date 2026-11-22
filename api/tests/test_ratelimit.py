from app.ratelimit import RateLimiter
from tests.conftest import PASSWORD, login


async def test_login_locks_email_after_repeated_failures(client, user):
    for _ in range(5):
        assert (await login(client, password="wrong wrong wrong")).status_code == 401
    r = await login(client, password=PASSWORD)  # even the right password is refused now
    assert r.status_code == 429
    assert int(r.headers["retry-after"]) > 0


async def test_login_lockout_is_per_email(client, user):
    for _ in range(5):
        await login(client, email="ghost@example.com", password="wrong wrong wrong")
    assert (await login(client)).status_code == 200


async def test_successful_logins_do_not_count_toward_lockout(client, user):
    for _ in range(8):
        assert (await login(client)).status_code == 200


async def test_login_ip_limit(client, user):
    codes = [(await login(client, email=f"u{i}@example.com", password="x")).status_code for i in range(21)]
    assert codes[:20] == [401] * 20
    assert codes[20] == 429


async def test_invite_check_is_rate_limited(client):
    codes = [(await client.post("/api/auth/invites/check", json={"token": f"t{i}"})).status_code for i in range(31)]
    assert codes[-1] == 429 and set(codes[:-1]) == {404}


def test_sliding_window_expires(monkeypatch):
    import app.ratelimit as rl
    now = [1000.0]
    monkeypatch.setattr(rl.time, "monotonic", lambda: now[0])
    lim = RateLimiter()
    for _ in range(3):
        lim.hit("k", 3, 60)
    assert lim.retry_after("k", 3, 60) == 60
    now[0] += 61
    assert lim.retry_after("k", 3, 60) is None


async def test_refresh_limit_is_per_session_not_per_ip(client, user):
    from app.routers.auth import REFRESH_PER_SESSION
    from tests.conftest import new_client

    limit = REFRESH_PER_SESSION[0]
    await login(client)
    for _ in range(limit):
        assert (await client.post("/api/auth/refresh")).status_code == 200
    r = await client.post("/api/auth/refresh")
    assert r.status_code == 429 and int(r.headers["retry-after"]) > 0

    # Someone else on the same IP (same test client host) is unaffected.
    async with new_client() as other:
        assert (await login(other)).status_code == 200
        assert (await other.post("/api/auth/refresh")).status_code == 200
