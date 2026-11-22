"""Admin CLI.

    docker compose exec api python -m app.cli create-admin --email you@example.com --name "Your Name"
"""

import argparse
import asyncio
import getpass
import sys

from pydantic import TypeAdapter, ValidationError
from sqlalchemy import select

from app.db import SessionLocal, engine
from app.models import Role, User
from app.schemas import Email
from app.security import PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, hash_password


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


def main() -> None:
    parser = argparse.ArgumentParser(prog="python -m app.cli")
    sub = parser.add_subparsers(dest="command", required=True)
    p = sub.add_parser("create-admin", help="Create (or promote) an admin user")
    p.add_argument("--email", required=True)
    p.add_argument("--name", required=True)
    args = parser.parse_args()

    try:
        email = TypeAdapter(Email).validate_python(args.email)
    except ValidationError:
        sys.exit("Invalid email address.")
    if args.command == "create-admin":
        asyncio.run(create_admin(email, args.name.strip()[:100]))


if __name__ == "__main__":
    main()
