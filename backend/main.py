from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Depends, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timezone

from database import Base, engine, get_db
from models import Item
from schemas import ItemCreate, ItemUpdate, ItemResponse, ItemGroup
import models  # noqa: F401 - ensures models are registered with Base before create_all


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create all tables on startup
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(lifespan=lifespan)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Convert path parameter validation errors to 404 responses."""
    for error in exc.errors():
        if error.get("loc") and "path" in error["loc"]:
            return JSONResponse(
                status_code=404,
                content={"detail": "Not found."},
            )
    # For non-path validation errors, return standard 422
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )


@app.get("/items/", response_model=list[ItemResponse], status_code=200)
def list_items(db: Session = Depends(get_db)):
    """Return all items as a JSON list."""
    return db.query(Item).all()


@app.post("/items/", response_model=ItemResponse, status_code=201)
def create_item(payload: ItemCreate, db: Session = Depends(get_db)):
    """Create a new item with uniqueness check."""
    # Check case-insensitive uniqueness within group
    existing = db.query(Item).filter(
        func.lower(func.trim(Item.name)) == payload.name.strip().lower(),
        Item.group == payload.group.value,
    ).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="An item with this name already exists in the specified group.",
        )

    now = datetime.now(timezone.utc)
    item = Item(
        name=payload.name,
        group=payload.group.value,
        created_at=now,
        updated_at=now,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@app.get("/items/{item_id}/", response_model=ItemResponse, status_code=200)
def get_item(item_id: int, db: Session = Depends(get_db)):
    """Retrieve a specific item by ID."""
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Not found.")
    return item


@app.patch("/items/{item_id}/", response_model=ItemResponse, status_code=200)
def update_item(item_id: int, payload: ItemUpdate, db: Session = Depends(get_db)):
    """Partial update of an item."""
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Not found.")

    update_data = payload.model_dump(exclude_unset=True)
    if not update_data:
        return item

    # Determine the new name and group for uniqueness check
    new_name = update_data.get("name", item.name)
    new_group = update_data.get("group", item.group)
    if isinstance(new_group, ItemGroup):
        new_group = new_group.value

    # Check uniqueness constraint for the new name+group combination
    existing = db.query(Item).filter(
        func.lower(func.trim(Item.name)) == new_name.strip().lower(),
        Item.group == new_group,
        Item.id != item_id,
    ).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="An item with this name already exists in the specified group.",
        )

    # Apply updates
    for field, value in update_data.items():
        if isinstance(value, ItemGroup):
            value = value.value
        setattr(item, field, value)
    item.updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(item)
    return item
