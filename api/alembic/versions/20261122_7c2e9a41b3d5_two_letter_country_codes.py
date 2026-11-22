"""two-letter country codes

Countries on the travel map were stored with three-letter ISO codes (ESP);
switch them to two-letter codes (ES). US states already use two letters.

Revision ID: 7c2e9a41b3d5
Revises: 45266dd0ebf3
Create Date: 2026-11-22 12:00:00
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

from app.countries import ALPHA3_TO_ALPHA2

revision: str = '7c2e9a41b3d5'
down_revision: Union[str, None] = '45266dd0ebf3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

_UPDATE = sa.text("UPDATE places SET code = :new WHERE kind = 'country' AND code = :old")


def upgrade() -> None:
    conn = op.get_bind()
    unknown = conn.execute(sa.text(
        "SELECT code FROM places WHERE kind = 'country' AND length(code) = 3")).scalars().all()
    unknown = [c for c in unknown if c not in ALPHA3_TO_ALPHA2]
    if unknown:
        raise RuntimeError(f"No two-letter code known for: {', '.join(unknown)}")
    for old, new in ALPHA3_TO_ALPHA2.items():
        conn.execute(_UPDATE, {"old": old, "new": new})
    op.alter_column('places', 'code', type_=sa.String(length=2), existing_type=sa.String(length=3))


def downgrade() -> None:
    op.alter_column('places', 'code', type_=sa.String(length=3), existing_type=sa.String(length=2))
    conn = op.get_bind()
    for old, new in ALPHA3_TO_ALPHA2.items():
        conn.execute(_UPDATE, {"old": new, "new": old})
