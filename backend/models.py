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

    __table_args__ = (
        Index(
            "unique_item_name_per_group",
            func.lower(func.trim(name)),
            "group",
            unique=True,
        ),
    )
