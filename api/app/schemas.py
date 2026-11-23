import uuid
from datetime import datetime
from typing import Annotated, Literal

from pydantic import (
    AfterValidator,
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    StringConstraints,
    model_validator,
)

from app.models import InviteKind, Role
from app.security import PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH


def normalize_email(email: str) -> str:
    return email.strip().lower()


Email = Annotated[EmailStr, AfterValidator(normalize_email)]
NewPassword = Annotated[str, Field(min_length=PASSWORD_MIN_LENGTH, max_length=PASSWORD_MAX_LENGTH)]
DisplayName = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=100)]
OpaqueToken = Annotated[str, Field(min_length=1, max_length=128)]


# ── Auth ─────────────────────────────────────────────────────────────


class LoginRequest(BaseModel):
    email: Email
    # No min length here: we never want to reveal the password policy on login,
    # just reject. Max length still bounds hashing cost.
    password: str = Field(min_length=1, max_length=PASSWORD_MAX_LENGTH)


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: str
    display_name: str
    role: Role
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds
    user: UserOut


class TokenCheck(BaseModel):
    token: OpaqueToken


class InviteCheckResponse(BaseModel):
    kind: InviteKind
    email: str | None  # set for email invites so the form can prefill/lock it
    expires_at: datetime


class RegisterRequest(BaseModel):
    invite_token: OpaqueToken
    email: Email
    display_name: DisplayName
    password: NewPassword


class ResetCheckResponse(BaseModel):
    email: str


class ResetPasswordRequest(BaseModel):
    token: OpaqueToken
    password: NewPassword


# ── Admin ────────────────────────────────────────────────────────────


class InviteCreate(BaseModel):
    kind: InviteKind
    email: Email | None = None
    note: Annotated[str, StringConstraints(strip_whitespace=True, max_length=200)] | None = None
    max_uses: int = Field(default=1, ge=1, le=1000)
    expires_in_days: int = Field(default=7, ge=1, le=90)

    @model_validator(mode="after")
    def _check_kind(self) -> "InviteCreate":
        if self.kind == InviteKind.email:
            if self.email is None:
                raise ValueError("email is required for email invites")
            self.max_uses = 1
        elif self.email is not None:
            raise ValueError("email is only allowed on email invites")
        return self


InviteStatus = Literal["active", "used", "expired", "revoked"]


class InviteOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    kind: InviteKind
    email: str | None
    note: str | None
    max_uses: int
    use_count: int
    expires_at: datetime
    revoked_at: datetime | None
    created_at: datetime
    status: InviteStatus


class InviteCreated(InviteOut):
    # Only returned once, at creation. The server keeps just a hash.
    token: str
    url: str


class AdminUserOut(UserOut):
    is_active: bool


class AdminUserUpdate(BaseModel):
    is_active: bool | None = None
    role: Role | None = None


class ResetLinkOut(BaseModel):
    url: str
    expires_at: datetime


# ── Login history ────────────────────────────────────────────────────


class LoginEventOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    display_name: str
    email: str
    ip: str | None
    user_agent: str | None
    success: bool
    created_at: datetime


class LoginSummaryOut(BaseModel):
    """Logins grouped by account and IP address."""

    user_id: uuid.UUID
    display_name: str
    email: str
    ip: str | None
    successes: int
    failures: int
    first_seen: datetime
    last_seen: datetime
