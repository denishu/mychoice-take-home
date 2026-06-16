from enum import Enum
from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import Optional


class ItemGroup(str, Enum):
    """Valid groups — stored as plain strings in DB, validated here at the API boundary."""
    PRIMARY = "Primary"
    SECONDARY = "Secondary"


class ItemCreate(BaseModel):
    """Schema for POST /items/ — defines what a valid create request looks like."""
    name: str = Field(..., min_length=1, max_length=255)  # ... = required
    group: ItemGroup
    author: str = Field(..., min_length=1, max_length=50)

    @field_validator("name")
    @classmethod
    def trim_and_validate_name(cls, v: str) -> str:
        """Strip whitespace and reject blank names. Returned value replaces original."""
        trimmed = v.strip()
        if not trimmed:
            raise ValueError("Name must not be empty.")
        return trimmed


class ItemUpdate(BaseModel):
    """Schema for PATCH /items/{id}/ — both fields optional for partial updates."""
    name: Optional[str] = Field(None, max_length=255)  # None = not required
    group: Optional[ItemGroup] = None
    author: Optional[str] = Field(None, max_length=50)

    @field_validator("name")
    @classmethod
    def trim_and_validate_name(cls, v: Optional[str]) -> Optional[str]:
        """Same trim logic as create, but allows None (field not sent)."""
        if v is None:
            return v
        trimmed = v.strip()
        if not trimmed:
            raise ValueError("Name must not be empty.")
        return trimmed


class ItemResponse(BaseModel):
    """Schema for all responses — controls what the API sends back to the frontend."""
    id: int
    name: str
    group: str
    created_at: datetime
    updated_at: datetime
    author: str

    model_config = {"from_attributes": True}  # read from ORM object attributes, not dict keys
