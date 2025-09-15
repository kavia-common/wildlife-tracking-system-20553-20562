from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


# PUBLIC_INTERFACE
class AnimalBase(BaseModel):
    """
    Common attributes shared by create and update operations.
    """
    name: str = Field(..., description="Animal display name", examples=["Balu"])
    species: str = Field(..., description="Species of the animal", examples=["Sloth Bear"])
    tag_id: str = Field(..., description="Unique tracking tag ID", examples=["TAG-001"])
    last_latitude: Optional[float] = Field(None, description="Last known latitude")
    last_longitude: Optional[float] = Field(None, description="Last known longitude")
    last_seen_at: Optional[datetime] = Field(None, description="Timestamp of the last observation")
    status: Optional[str] = Field("active", description="Current status of the animal")


# PUBLIC_INTERFACE
class AnimalCreate(AnimalBase):
    """
    Payload schema for creating a new animal.
    """
    pass


# PUBLIC_INTERFACE
class AnimalUpdate(BaseModel):
    """
    Payload schema for updating an animal. All fields optional.
    """
    name: Optional[str] = Field(None, description="Animal display name")
    species: Optional[str] = Field(None, description="Species of the animal")
    tag_id: Optional[str] = Field(None, description="Unique tracking tag ID")
    last_latitude: Optional[float] = Field(None, description="Last known latitude")
    last_longitude: Optional[float] = Field(None, description="Last known longitude")
    last_seen_at: Optional[datetime] = Field(None, description="Timestamp of the last observation")
    status: Optional[str] = Field(None, description="Current status of the animal")


# PUBLIC_INTERFACE
class AnimalOut(AnimalBase):
    """
    Response schema for animal records.
    """
    id: int = Field(..., description="Primary key ID")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")

    class Config:
        from_attributes = True
