from datetime import timedelta

from sqlalchemy import func, select, update

from app.models import LoginEvent
from app.security import utcnow
from tests.conftest import login, new_client


async def test_logins_are_recorded_by_account_and_ip(client, admin_headers, user):
    async with new_client() as member:
        assert (await login(member, password="wrong password!!")).status_code == 401
        assert (await login(member)).status_code == 200
    # unknown emails aren't recorded
    assert (await login(client, email="nobody@example.com")).status_code == 401

    r = await client.get("/api/admin/logins", params={"user_id": str(user.id)}, headers=admin_headers)
    assert r.status_code == 200
    events = r.json()
    assert [e["success"] for e in events] == [True, False]  # newest first
    assert events[0]["email"] == "member@example.com"
    assert events[0]["ip"] == "127.0.0.1"

    r = await client.get("/api/admin/logins/summary", headers=admin_headers)
    rows = {row["email"]: row for row in r.json()}
    assert set(rows) == {"admin@example.com", "member@example.com"}
    assert rows["member@example.com"]["successes"] == 1
    assert rows["member@example.com"]["failures"] == 1
    assert rows["member@example.com"]["ip"] == "127.0.0.1"


async def test_ip_filter(client, admin_headers, user):
    async with new_client() as member:
        await login(member)
    r = await client.get("/api/admin/logins", params={"ip": "10.0.0.1"}, headers=admin_headers)
    assert r.json() == []
    r = await client.get("/api/admin/logins", params={"ip": "127.0.0.1"}, headers=admin_headers)
    assert len(r.json()) == 2  # the admin's and the member's


async def test_deactivated_login_recorded_as_failure(client, admin_headers, user, session):
    await client.patch(f"/api/admin/users/{user.id}", json={"is_active": False}, headers=admin_headers)
    async with new_client() as member:
        assert (await login(member)).status_code == 401
    r = await client.get("/api/admin/logins", params={"user_id": str(user.id)}, headers=admin_headers)
    assert [e["success"] for e in r.json()] == [False]


async def test_old_events_pruned(client, admin_headers, user, session):
    async with new_client() as member:
        await login(member)
    await session.execute(update(LoginEvent).values(created_at=utcnow() - timedelta(days=365)))
    await session.commit()
    async with new_client() as member:
        await login(member)  # triggers pruning
    assert await session.scalar(select(func.count()).select_from(LoginEvent)) == 1


async def test_members_cannot_see_logins(client, user):
    async with new_client() as member:
        r = await login(member)
        headers = {"Authorization": f"Bearer {r.json()['access_token']}"}
        assert (await member.get("/api/admin/logins", headers=headers)).status_code == 403
        assert (await member.get("/api/admin/logins/summary", headers=headers)).status_code == 403
