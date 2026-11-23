"""Admin CLI.

    docker compose exec api python -m app.cli create-admin --email you@example.com --name "Your Name"
    docker compose exec api python -m app.cli reset-link --email you@example.com
"""

import argparse
import asyncio
import getpass
import sys
from datetime import timedelta
from urllib.parse import urlencode

from pydantic import TypeAdapter, ValidationError
from sqlalchemy import select, update

from app.config import get_settings
from app.db import SessionLocal, engine
from app.models import PasswordReset, Role, User
from app.schemas import Email
from app.security import (
    PASSWORD_MAX_LENGTH,
    PASSWORD_MIN_LENGTH,
    generate_opaque_token,
    hash_opaque_token,
    hash_password,
    utcnow,
)


def _prompt_password() -> str:
    while True:
        pw = getpass.getpass("Password: ")
        if not (PASSWORD_MIN_LENGTH <= len(pw) <= PASSWORD_MAX_LENGTH):
            print(f"Password must be {PASSWORD_MIN_LENGTH}-{PASSWORD_MAX_LENGTH} characters.")
            continue
        if getpass.getpass("Confirm password: ") != pw:
            print("Passwords don't match.")
            continue
        return pw


async def create_admin(email: str, name: str) -> None:
    async with SessionLocal() as session:
        existing = await session.scalar(select(User).where(User.email == email))
        if existing:
            if existing.role == Role.admin:
                sys.exit(f"{email} is already an admin.")
            if input(f"{email} exists as a member. Promote to admin? [y/N] ").lower() != "y":
                sys.exit(1)
            existing.role = Role.admin
        else:
            session.add(
                User(email=email, display_name=name, password_hash=hash_password(_prompt_password()),
                     role=Role.admin)
            )
        await session.commit()
    await engine.dispose()
    print(f"Admin ready: {email}")


async def make_reset_link(email: str) -> str:
    """Password reset link for any account, including your own (the admin
    page only offers reset links for other people). Using it logs that
    account out everywhere. Any earlier reset link for the account stops
    working."""
    async with SessionLocal() as session:
        user = await session.scalar(select(User).where(User.email == email))
        if user is None:
            raise LookupError(f"No account with email {email}")
        if not user.is_active:
            raise LookupError(f"{email} is deactivated")
        now = utcnow()
        await session.execute(
            update(PasswordReset)
            .where(PasswordReset.user_id == user.id, PasswordReset.used_at.is_(None))
            .values(used_at=now)
        )
        token = generate_opaque_token()
        s = get_settings()
        session.add(PasswordReset(token_hash=hash_opaque_token(token), user_id=user.id,
                                  expires_at=now + timedelta(hours=s.password_reset_ttl_hours)))
        await session.commit()
    return f"{s.public_base_url.rstrip('/')}/reset-password?{urlencode({'token': token})}"


async def reset_link(email: str) -> None:
    try:
        url = await make_reset_link(email)
    except LookupError as e:
        sys.exit(str(e))
    finally:
        await engine.dispose()
    print(f"Reset link for {email} (valid {get_settings().password_reset_ttl_hours} hours, single use):")
    print(url)


def main() -> None:
    parser = argparse.ArgumentParser(prog="python -m app.cli")
    sub = parser.add_subparsers(dest="command", required=True)
    p = sub.add_parser("create-admin", help="Create (or promote) an admin user")
    p.add_argument("--email", required=True)
    p.add_argument("--name", required=True)
    p = sub.add_parser("reset-link", help="Print a password reset link for an account (including your own)")
    p.add_argument("--email", required=True)
    args = parser.parse_args()

    try:
        email = TypeAdapter(Email).validate_python(args.email)
    except ValidationError:
        sys.exit("Invalid email address.")
    if args.command == "create-admin":
        asyncio.run(create_admin(email, args.name.strip()[:100]))
    elif args.command == "reset-link":
        asyncio.run(reset_link(email))


if __name__ == "__main__":
    main()
