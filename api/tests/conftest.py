import os

# Point the app at the test database BEFORE any app module is imported.
_test_url = os.environ.get("TEST_DATABASE_URL")
if not _test_url:
    raise RuntimeError("TEST_DATABASE_URL is not set; run tests via `docker compose exec api pytest`")
os.environ["DATABASE_URL"] = _test_url
os.environ["ENVIRONMENT"] = "test"
os.environ["S3_BUCKET"] = "test-media"  # never touch real photos

import pytest  # noqa: E402
from httpx import ASGITransport, AsyncClient  # noqa: E402
from sqlalchemy import text  # noqa: E402

from app.db import SessionLocal, engine  # noqa: E402
from app.main import app  # noqa: E402
from app.models import Base, Role, User  # noqa: E402
from app.ratelimit import limiter  # noqa: E402
from app.security import hash_password  # noqa: E402

ORIGIN = "http://localhost:5173"
PASSWORD = "correct horse battery staple"


@pytest.fixture(scope="session", autouse=True)
async def _schema():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()


@pytest.fixture(autouse=True)
async def _clean():
    limiter.reset()
    yield
    tables = ", ".join(t.name for t in Base.metadata.sorted_tables)
    async with engine.begin() as conn:
        await conn.execute(text(f"TRUNCATE {tables} CASCADE"))


@pytest.fixture
async def session():
    async with SessionLocal() as s:
        yield s


async def make_user(email="member@example.com", role=Role.member, is_active=True) -> User:
    async with SessionLocal() as s:
        user = User(email=email, display_name="Test", password_hash=hash_password(PASSWORD),
                    role=role, is_active=is_active)
        s.add(user)
        await s.commit()
        return user


@pytest.fixture
async def user():
    return await make_user()


def new_client() -> AsyncClient:
    return AsyncClient(
        transport=ASGITransport(app=app),
        base_url="https://testserver.local",
        headers={"Origin": ORIGIN},
    )


@pytest.fixture
async def client():
    async with new_client() as c:
        yield c


async def login(client: AsyncClient, email="member@example.com", password=PASSWORD):
    return await client.post("/api/auth/login", json={"email": email, "password": password})


async def auth_headers(client: AsyncClient, email="member@example.com", password=PASSWORD) -> dict:
    r = await login(client, email, password)
    assert r.status_code == 200, r.text
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


@pytest.fixture
async def admin():
    return await make_user(email="admin@example.com", role=Role.admin)


@pytest.fixture
async def admin_headers(admin):
    async with new_client() as c:
        return await auth_headers(c, email="admin@example.com")
