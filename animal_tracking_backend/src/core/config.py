import os
from functools import lru_cache
from pydantic import BaseModel, Field


class Settings(BaseModel):
    """
    PUBLIC_INTERFACE
    Application settings loaded from environment variables.

    Attributes:
        DATABASE_URL: SQLAlchemy-compatible database URL.
        SECRET_KEY: Secret key for JWT signing.
        ACCESS_TOKEN_EXPIRE_MINUTES: Token expiration time in minutes.
        CORS_ALLOW_ORIGINS: Allowed origins for CORS.
        ENVIRONMENT: Current environment (development, staging, production).
    """
    DATABASE_URL: str = Field(default=os.getenv("DATABASE_URL", "sqlite:///./animal_tracking.db"),
                              description="SQLAlchemy database URL.")
    SECRET_KEY: str = Field(default=os.getenv("SECRET_KEY", "CHANGE_ME_SECRET"),
                            description="Secret key for JWT signing.")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60")),
                                             description="Access token expiration time in minutes.")
    CORS_ALLOW_ORIGINS: list[str] = Field(
        default_factory=lambda: os.getenv("CORS_ALLOW_ORIGINS", "*").split(","),
        description="Comma-separated list of allowed CORS origins."
    )
    ENVIRONMENT: str = Field(default=os.getenv("ENVIRONMENT", "development"),
                             description="Runtime environment.")


@lru_cache
def get_settings() -> Settings:
    """
    PUBLIC_INTERFACE
    Returns cached application settings.
    """
    return Settings()


# Export singleton-like settings accessor
settings = get_settings()
