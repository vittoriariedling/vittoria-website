from functools import lru_cache
from typing import Literal

from pydantic import SecretStr, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# HS512 keys should be at least as long as the hash output (512 bits).
# 64 characters of url-safe base64 is ~384 bits, so require 86+ chars,
# which is what `secrets.token_urlsafe(64)` produces.
MIN_SECRET_LENGTH = 86


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    environment: Literal["dev", "test", "prod"] = "dev"

    database_url: str

    jwt_access_secret: SecretStr
    jwt_refresh_secret: SecretStr
    jwt_issuer: str = "personal-website"
    jwt_audience: str = "personal-website"
    access_token_ttl_minutes: int = 15
    refresh_token_ttl_days: int = 14
    password_reset_ttl_hours: int = 24
    # See sessions.rotate: tolerates refresh responses lost to a tab reload.
    refresh_reuse_grace_seconds: int = 20

    # Where the frontend lives; used to build invite and reset links.
    public_base_url: str = "http://localhost:5173"

    # Origins allowed to call the API with credentials. Also used as the
    # allow-list for the Origin check on cookie-authenticated endpoints.
    cors_origins: list[str] = ["http://localhost:5173"]

    # ── Object storage (S3-compatible: SeaweedFS in dev, Cloudflare R2 in prod)
    s3_endpoint_url: str  # how the API reaches storage
    s3_public_url: str  # how browsers reach it; signed photo URLs point here
    s3_bucket: str = "media"
    s3_region: str = "us-east-1"
    s3_access_key: str
    s3_secret_key: SecretStr
    # Signed media URLs stay identical for this long (so browsers can cache
    # photos) and remain valid for twice as long.
    media_url_window_hours: int = 12

    # Browsers treat http://localhost as a secure context, so Secure cookies
    # work in local dev in Chrome/Firefox/Edge. Only disable if you must.
    cookie_secure: bool = True

    @field_validator("jwt_access_secret", "jwt_refresh_secret")
    @classmethod
    def _secret_long_enough(cls, v: SecretStr) -> SecretStr:
        if len(v.get_secret_value()) < MIN_SECRET_LENGTH:
            raise ValueError(
                f"must be at least {MIN_SECRET_LENGTH} characters; generate with "
                "python -c \"import secrets; print(secrets.token_urlsafe(64))\""
            )
        return v

    @model_validator(mode="after")
    def _secrets_differ(self) -> "Settings":
        if self.jwt_access_secret.get_secret_value() == self.jwt_refresh_secret.get_secret_value():
            raise ValueError("JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be different")
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()
