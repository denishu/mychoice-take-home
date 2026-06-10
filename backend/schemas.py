from enum import Enum
from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import Optional


class ItemGroup(str, Enum):
    PRIMARY = "Primary"
    SECONDARY = "Secondary"


class ItemCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    group: ItemGroup

    @field_validator("name")
    @classmethod
    def trim_and_validate_name(cls, v: str) -> str:
        trimmed = v.strip()
        if not trimmed:
            raise ValueError("Name must not be empty.")
        return trimmed


class ItemUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=255)
    group: Optional[ItemGroup] = None

    @field_validator("name")
    @classmethod
    def trim_and_validate_name(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        trimmed = v.strip()
        if not trimmed:
            raise ValueError("Name must not be empty.")
        return trimmed


class ItemResponse(BaseModel):
    id: int
    name: str
    group: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
