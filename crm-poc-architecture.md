# CRM POC System Architecture

## Overview
A lightweight, multi-agent developed Customer Relationship Manager built with FastAPI, SQLite, and Pydantic v2.

## Component Map
- **API (FastAPI):** Entry point in `app/main.py`. Handles routing and global middleware.
- **Persistence (SQLite):** Database file located in `data/crm.db` (git-ignored).
- **ORM (SQLAlchemy):** Models in `app/models.py`, engine configuration in `app/database.py`.
- **Validation (Pydantic):** Schemas in `app/schemas/customer.py` for structured requests and responses.
- **Exports:** CSV generation via streaming response in `app/routers/customers.py`.

## Data Flow
1. **Request:** Client hits a `/customers` endpoint.
2. **Schema:** Pydantic validates the request body (if POST/PATCH).
3. **Logic:** FastAPI router handles DB interaction via SQLAlchemy Session.
4. **Model:** SQLAlchemy interacts with SQLite `customers` table.
5. **Response:** Data is serialized via Pydantic schema and returned to client.

## Security & Defaults
- **CORS:** Currently open to all origins (`*`) for easy development.
- **DB Creation:** Automatically created on first run via `Base.metadata.create_all()`.
