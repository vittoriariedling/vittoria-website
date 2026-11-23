import enum
import uuid
from datetime import date, datetime
from decimal import Decimal
from typing import Any

from sqlalchemy import (
    CheckConstraint,
    Date,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy import false as sa_false
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


def _ts(nullable: bool = True) -> Mapped:
    return mapped_column(DateTime(timezone=True), nullable=nullable)


class Role(str, enum.Enum):
    admin = "admin"
    member = "member"


class InviteKind(str, enum.Enum):
    email = "email"  # single-use, bound to one email address
    link = "link"  # shareable, limited by max_uses and expiry


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    # Always stored lowercased/stripped (see schemas.normalize_email).
    email: Mapped[str] = mapped_column(String(320), unique=True)
    display_name: Mapped[str] = mapped_column(String(100))
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[Role] = mapped_column(
        Enum(Role, native_enum=False, length=16), default=Role.member
    )
    is_active: Mapped[bool] = mapped_column(default=True)
    invited_by_invite_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey(
            "invites.id", ondelete="SET NULL", use_alter=True, name="users_invited_by_invite_id_fkey"
        )
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class RefreshToken(Base):
    """One row per issued refresh JWT, keyed by its `jti`.

    A refresh JWT is only accepted if its row exists, is unexpired, unused and
    unrevoked. Using it marks it used and issues a successor in the same
    family. Presenting an already-used token means it was stolen (or replayed),
    so the whole family is revoked (see sessions.rotate for the grace window).
    """

    __tablename__ = "refresh_tokens"

    jti: Mapped[uuid.UUID] = mapped_column(primary_key=True)
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    family_id: Mapped[uuid.UUID] = mapped_column(index=True)
    expires_at: Mapped[datetime] = _ts(nullable=False)
    used_at: Mapped[datetime | None] = _ts()
    revoked_at: Mapped[datetime | None] = _ts()
    replaced_by: Mapped[uuid.UUID | None]
    user_agent: Mapped[str | None] = mapped_column(String(512))
    ip: Mapped[str | None] = mapped_column(String(64))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


class LoginEvent(Base):
    """One row per login attempt on an existing account, for the admin's
    login history. Attempts on unknown emails are not recorded. Rows older
    than logins.LOGIN_HISTORY_DAYS are pruned."""

    __tablename__ = "login_events"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    ip: Mapped[str | None] = mapped_column(String(64), index=True)
    user_agent: Mapped[str | None] = mapped_column(String(512))
    success: Mapped[bool]
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), index=True
    )


class Invite(Base):
    __tablename__ = "invites"
    __table_args__ = (
        CheckConstraint("max_uses >= 1", name="max_uses_positive"),
        CheckConstraint("use_count >= 0 AND use_count <= max_uses", name="use_count_in_range"),
        CheckConstraint(
            "(kind = 'email') = (email IS NOT NULL)", name="email_iff_email_kind"
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    # SHA-256 hex of the random invite token; the token itself is never stored.
    token_hash: Mapped[str] = mapped_column(String(64), unique=True)
    kind: Mapped[InviteKind] = mapped_column(Enum(InviteKind, native_enum=False, length=16))
    email: Mapped[str | None] = mapped_column(String(320))
    note: Mapped[str | None] = mapped_column(String(200))
    max_uses: Mapped[int] = mapped_column(Integer, default=1)
    use_count: Mapped[int] = mapped_column(Integer, default=0)
    expires_at: Mapped[datetime] = _ts(nullable=False)
    revoked_at: Mapped[datetime | None] = _ts()
    created_by: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL")
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


class PasswordReset(Base):
    __tablename__ = "password_resets"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    token_hash: Mapped[str] = mapped_column(String(64), unique=True)
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    expires_at: Mapped[datetime] = _ts(nullable=False)
    used_at: Mapped[datetime | None] = _ts()
    created_by: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL")
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


# ── Content ──────────────────────────────────────────────────────────


def _created() -> Mapped[datetime]:
    return mapped_column(DateTime(timezone=True), server_default=func.now())


def _updated() -> Mapped[datetime]:
    return mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


def _media_fk() -> Mapped[uuid.UUID | None]:
    return mapped_column(ForeignKey("media.id", ondelete="SET NULL"))


class Media(Base):
    """An image stored in object storage, in two sizes.

    Uploads are re-encoded to WebP with all metadata (EXIF, GPS) stripped.
    Keys are derived from the original file's SHA-256, so importing the same
    photo twice reuses the existing object.
    """

    __tablename__ = "media"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    sha256: Mapped[str] = mapped_column(String(64), unique=True)
    original_name: Mapped[str] = mapped_column(String(255))
    width: Mapped[int]  # of the large variant
    height: Mapped[int]
    key_lg: Mapped[str] = mapped_column(String(255))  # up to 1600px
    key_sm: Mapped[str] = mapped_column(String(255))  # up to 640px, for cards/thumbnails
    bytes_lg: Mapped[int]
    uploaded_by: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))
    created_at: Mapped[datetime] = _created()


class Book(Base):
    __tablename__ = "books"
    __table_args__ = (CheckConstraint("rating >= 0 AND rating <= 5", name="rating_range"),)

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    goodreads_id: Mapped[str | None] = mapped_column(String(32), unique=True)
    title: Mapped[str] = mapped_column(String(500))
    author: Mapped[str] = mapped_column(String(300))
    isbn13: Mapped[str | None] = mapped_column(String(13))
    rating: Mapped[Decimal] = mapped_column(Numeric(2, 1))  # allows half stars
    review: Mapped[str] = mapped_column(Text, default="")
    date_read: Mapped[date | None] = mapped_column(Date)
    # In progress: shown in "currently reading" at the top of the page, not in the read list.
    currently_reading: Mapped[bool] = mapped_column(default=False, server_default=sa_false())
    cover_media_id: Mapped[uuid.UUID | None] = _media_fk()
    created_at: Mapped[datetime] = _created()
    updated_at: Mapped[datetime] = _updated()


class Project(Base):
    __tablename__ = "projects"

    # Integer ids keep the existing /coding-projects/:id URLs working.
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(300))
    tag: Mapped[str] = mapped_column(String(200), default="")
    description: Mapped[str] = mapped_column(Text, default="")
    long_description: Mapped[str | None] = mapped_column(Text)
    github_url: Mapped[str | None] = mapped_column(String(500))
    year: Mapped[str | None] = mapped_column(String(20))
    tech: Mapped[list[str]] = mapped_column(JSONB, default=list)
    team: Mapped[str | None] = mapped_column(String(300))
    image_media_id: Mapped[uuid.UUID | None] = _media_fk()
    # [{"media_id": "...", "caption": "..."}]
    extra_images: Mapped[list[dict[str, Any]]] = mapped_column(JSONB, default=list)
    position: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = _created()
    updated_at: Mapped[datetime] = _updated()


class PlaceKind(str, enum.Enum):
    country = "country"  # code = two-letter ISO 3166-1 alpha-2, e.g. ES
    state = "state"  # code = US postal code, e.g. TN


class PlaceStatus(str, enum.Enum):
    visited = "visited"
    lived = "lived"


class Place(Base):
    __tablename__ = "places"
    __table_args__ = (UniqueConstraint("kind", "code", name="places_kind_code_key"),)

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    kind: Mapped[PlaceKind] = mapped_column(Enum(PlaceKind, native_enum=False, length=16))
    code: Mapped[str] = mapped_column(String(2))
    name: Mapped[str] = mapped_column(String(200))
    continent: Mapped[str | None] = mapped_column(String(50))
    status: Mapped[PlaceStatus] = mapped_column(Enum(PlaceStatus, native_enum=False, length=16))
    description: Mapped[str] = mapped_column(Text, default="")
    newsletter_slugs: Mapped[list[str]] = mapped_column(JSONB, default=list)
    photo_media_id: Mapped[uuid.UUID | None] = _media_fk()
    created_at: Mapped[datetime] = _created()
    updated_at: Mapped[datetime] = _updated()


class SiteContent(Base):
    """Site-wide copy and settings (landing page text, page intros,
    hero video...), kept in the database so none of it ships in the public
    frontend bundle. A single row (id=1) holding one JSON document.

    File references inside `data` are stored as {"storage_key", "content_type"}
    (raw files such as the hero video) or {"media_id"} (processed images), and
    turned into signed URLs by the API.
    """

    __tablename__ = "site_content"
    __table_args__ = (CheckConstraint("id = 1", name="single_row"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    data: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict)
    updated_at: Mapped[datetime] = _updated()


class Post(Base):
    """A newsletter issue.

    `sections` keeps the original section format (paragraph, callout, image,
    photo-left, photo-right, three-photos). Image references are stored as
    {"media_id": "..."} and turned into signed `src` URLs when served.
    """

    __tablename__ = "posts"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    slug: Mapped[str] = mapped_column(String(200), unique=True)
    title: Mapped[str] = mapped_column(String(300))
    date_label: Mapped[str] = mapped_column(String(100), default="")  # e.g. "February 2, 2026"
    position: Mapped[int] = mapped_column(Integer, default=0, index=True)  # higher = newer
    region: Mapped[str | None] = mapped_column(String(50))
    tags: Mapped[list[str]] = mapped_column(JSONB, default=list)
    preview_description: Mapped[str | None] = mapped_column(Text)
    hero_media_id: Mapped[uuid.UUID | None] = _media_fk()
    hero_alt: Mapped[str | None] = mapped_column(String(300))
    cover_media_id: Mapped[uuid.UUID | None] = _media_fk()
    cover_alt: Mapped[str | None] = mapped_column(String(300))
    cover_caption: Mapped[str | None] = mapped_column(String(500))
    sections: Mapped[list[dict[str, Any]]] = mapped_column(JSONB, default=list)
    published: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = _created()
    updated_at: Mapped[datetime] = _updated()
