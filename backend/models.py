from sqlalchemy import Column, Integer, String, DateTime, Index, func
from datetime import datetime, timezone

from database import Base


class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    group = Column(String(50), nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))
    author = Column(String(50), nullable=False)

    __table_args__ = (
        Index(
            "unique_item_name_per_group",  # name of the index
            func.lower(func.trim(name)),   # uniqueness factor 1: normalized name
            "group",                       # uniqueness factor 2: group
            unique=True,                   # enforces the constraint
        ),
    )
