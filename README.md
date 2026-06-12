# Items CRUD App

A full-stack CRUD application for managing items, built with **FastAPI** (backend) and **React + TypeScript** (frontend).

## Project Structure

```
├── backend/        # FastAPI + SQLAlchemy + Pydantic
├── frontend/       # React + TypeScript + Vite
└── README.md
```

## Prerequisites

- Python 3.11+
- Node.js 18+
- npm

## Backend Setup

```bash
cd backend
pip install -r requirements.txt   # one-time only
python -m uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

### API Endpoints

| Method | Endpoint         | Description          |
|--------|------------------|----------------------|
| GET    | `/items/`        | List all items       |
| POST   | `/items/`        | Create a new item    |
| GET    | `/items/{id}/`   | Get a specific item  |
| PATCH  | `/items/{id}/`   | Update an item       |

Interactive API docs available at `http://localhost:8000/docs`.

## Frontend Setup

```bash
cd frontend
npm install   # one-time only
npm run dev
```

The app will be available at `http://localhost:5173`.

## Testing

### Backend Tests

```bash
cd backend
pytest
```

The backend uses **pytest** with **Hypothesis** for property-based testing of API validation and uniqueness constraints.

### Frontend Tests

```bash
cd frontend
npm test
```

The frontend uses **Vitest** with **React Testing Library** for component and integration tests.

## Design Decisions

- **FastAPI** over Django — lightweight, async-capable, automatic OpenAPI docs, and Pydantic validation built in
- **SQLite** — zero-config local database, easily swappable for PostgreSQL
- **React + TypeScript + Vite** — type safety, fast dev server, modern tooling
- **Case-insensitive uniqueness** — item names are unique per group (case-insensitive, whitespace-trimmed)

## Item Groups

Items belong to one of two groups: **Primary** or **Secondary**. Each group enforces unique item names (case-insensitive).
