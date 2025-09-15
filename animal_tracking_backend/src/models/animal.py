from sqlalchemy import Integer, String, Float, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column

from src.db.session import Base


class Animal(Base):
    """
    PUBLIC_INTERFACE
    SQLAlchemy model representing an animal tracked in the system.

    Attributes:
        id: Primary key.
        name: Animal's display name.
        species: Animal species (e.g., 'Sloth Bear').
        tag_id: Unique identifier for the tracking device or tag.
        last_latitude: Last known latitude.
        last_longitude: Last known longitude.
        last_seen_at: Timestamp for the last location update.
        status: Current status (e.g., 'active', 'inactive', 'missing').
    """
    __tablename__ = "animals"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    species: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    tag_id: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    last_latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    last_longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    last_seen_at: Mapped["DateTime | None"] = mapped_column(DateTime(timezone=True), nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="active", nullable=False)
    created_at: Mapped["DateTime"] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped["DateTime"] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
