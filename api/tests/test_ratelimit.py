import asyncio

from httpx import ASGITransport, AsyncClient

from app.main import app
from app.ratelimit import RateLimiter
from tests.conftest import ORIGIN, PASSWORD, login


def client_from(ip: str) -> AsyncClient:
    """A test client whose requests come from the given IP address."""
    return AsyncClient(transport=ASGITransport(app=app, client=(ip, 1234)),
                       base_url="https://testserver.local", headers={"Origin": ORIGIN})


async def test_login_locks_email_after_repeated_failures(client, user):
    for _ in range(5):
        assert (await login(client, password="wrong wrong wrong")).status_code == 401
    r = await login(client, password=PASSWORD)  # even the right password is refused now
    assert r.status_code == 429
    assert int(r.headers["retry-after"]) > 0


async def test_lockout_from_one_ip_does_not_lock_out_the_owner(client, user):
    # Someone hammering this email from their own IP only locks themselves out.
    async with client_from("203.0.113.9") as attacker:
        for _ in range(5):
            await login(attacker, password="wrong wrong wrong")
        assert (await login(attacker)).status_code == 429
    async with client_from("198.51.100.7") as owner:
        assert (await login(owner)).status_code == 200


async def test_parallel_attempts_cannot_exceed_the_limit(client, user):
    codes = await asyncio.gather(*(login(client, password="wrong wrong wrong") for _ in range(12)))
    codes = [r.status_code for r in codes]
    assert codes.count(401) == 5 and codes.count(429) == 7


async def test_distributed_guessing_is_slowed_but_owner_still_gets_in(client, user, monkeypatch):
    import app.routers.auth as auth
    slept = []

    async def fake_sleep(seconds):
        slept.append(seconds)

    monkeypatch.setattr(auth.asyncio, "sleep", fake_sleep)
    for i in range(12):  # many IPs, each under its own limit
        async with client_from(f"203.0.113.{i + 1}") as c:
            assert (await login(c, password="wrong wrong wrong")).status_code == 401
    assert slept and max(slept) <= auth.LOGIN_SLOWDOWN_MAX_SECONDS
    async with client_from("198.51.100.7") as owner:
        assert (await login(owner)).status_code == 200  # slowed, never refused


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
