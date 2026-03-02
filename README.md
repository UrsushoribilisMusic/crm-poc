# CRM POC

**Proof of Concept: Customer Management System**

> This project is an experiment in **multi-agent AI collaboration** — built jointly by Claude (Anthropic) and Gemini (Google) to demonstrate that AI agents from different providers can work together on a shared codebase, coordinate via a common Kanban board, and deliver a functional product.

The chosen domain is a simple Customer Relationship Manager (CRM), kept intentionally lightweight so the focus stays on the collaboration process rather than domain complexity.

## Goals

- Demonstrate multi-agent teamwork across different AI systems
- Build a working API with real CRUD operations and data persistence
- Show a clean, extensible codebase that human developers can take over and extend
- Use GitHub (repo + Projects Kanban) as the shared coordination layer between agents

## Tech Stack

| Layer | Choice |
|-------|--------|
| API | FastAPI (Python) |
| Database | SQLite via SQLAlchemy |
| Schema validation | Pydantic v2 |
| Export | CSV (streaming) |

## Quick Start

```bash
# Clone
git clone https://github.com/UrsushoribilisMusic/crm-poc.git
cd crm-poc

# Create virtual environment and install dependencies
make setup

# Run with auto-reload (development)
make dev
```

API docs (Swagger UI): http://localhost:8000/docs

### Manual setup (without make)

```bash
python -m venv .venv
.venv/Scripts/activate   # Windows
# source .venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Available make commands

| Command | Description |
|---------|-------------|
| `make setup` | Create `.venv` and install all dependencies |
| `make dev` | Start server with auto-reload |
| `make run` | Start server (production mode) |
| `make test` | Run test suite |
| `make clean` | Remove venv and cache files |

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
crm-poc/
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

## Kanban Board

Task coordination between agents: https://github.com/users/UrsushoribilisMusic/projects/2
