# CRM POC

Customer Management System — Proof of Concept

Built with **FastAPI** + **SQLite** (via SQLAlchemy). Includes CSV export.

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload
```

API docs available at: http://localhost:8000/docs

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/customers` | List all customers (supports `?search=` and `?status=`) |
| POST | `/customers` | Create a customer |
| GET | `/customers/{id}` | Get one customer |
| PATCH | `/customers/{id}` | Update a customer |
| DELETE | `/customers/{id}` | Delete a customer |
| GET | `/customers/export/csv` | Export all customers as CSV |
| GET | `/health` | Health check |

## Data

- **Database**: `data/crm.db` (SQLite, auto-created on first run, git-ignored)
- **CSV exports**: `exports/` folder (git-ignored)

## Project Structure

```
customer-mgmt/
├── app/
│   ├── main.py          # FastAPI app + startup
│   ├── database.py      # SQLite connection
│   ├── models.py        # SQLAlchemy ORM models
│   ├── routers/
│   │   └── customers.py # CRUD + CSV export endpoints
│   └── schemas/
│       └── customer.py  # Pydantic request/response schemas
├── data/                # SQLite DB lives here (git-ignored)
├── exports/             # CSV exports (git-ignored)
└── requirements.txt
```
