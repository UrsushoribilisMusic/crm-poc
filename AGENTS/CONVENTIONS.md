# Shared Coding Conventions

## Python / FastAPI
- **Style:** PEP 8 compliance.
- **Type Hinting:** Mandatory for all function signatures and Pydantic models.
- **Dependency Injection:** Use FastAPI `Depends()` for database sessions and shared logic.
- **Async:** Use `def` for synchronous DB operations (SQLAlchemy 2.0+ supports async, but currently using sync/SQLite).
- **Validation:** Pydantic v2 for all request/response schemas.

## Database (SQLAlchemy)
- **Naming:** CamelCase for models, snake_case for tables.
- **Migrations:** Currently using `Base.metadata.create_all()`; consider Alembic if schema grows.

## Git Workflow
- **Branching:** `feature/ISSUE-NUMBER-description`.
- **Commits:** Atomic, descriptive, starting with a verb (e.g., "Add", "Fix", "Update").
- **PRs:** Target `master`, include "Closes #N".

## Error Handling
- Use FastAPI `HTTPException` for client errors (400, 404, etc.).
- Ensure consistent JSON error responses.
