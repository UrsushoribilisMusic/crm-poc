# Simple CRM

**Proof of Concept: Multi-Agent Customer Management System**

> This project is an experiment in **multi-agent AI collaboration** — built jointly by Claude (Anthropic) and Gemini (Google) to demonstrate that AI agents from different providers can work together on a shared codebase, coordinate via a common Kanban board, and deliver a functional product.

Simple CRM is a lightweight, relationship-focused tool designed to manage contacts, tasks, and interaction history with a professional, modern interface.

## Goals

- **Agentic Collaboration:** Demonstrate seamless teamwork between different AI systems.
- **Functional Prototype:** Deliver a working system with a React frontend and FastAPI backend.
- **Relationship Intelligence:** Track every call, meeting, and note automatically.
- **Task Lifecycle:** Manage workflows through a visual Kanban board with an automated audit trail.

## Multi-Agent Strategy: "The Fleet That Never Sleeps"

This project implements a **shared consciousness** architecture to coordinate multiple AI agents (Claude, Gemini, Codex) across different sessions.

- **Shared Memory:** Each agent maintains a status file in `AGENTS/` (e.g., `GEMINI_MEMORY.md`).
- **Coordination Hub:** The `AGENTS/` directory contains current sprint targets and shared coding laws.
- **Agent Roles:** Each agent has specific instructions (`GEMINI.md`, `CLAUDE.md`) optimizing for their unique strengths.
- **Switchboard Manager:** The human developer acts as the context architect and final merge authority.

## Tech Stack

| Layer | Choice |
|-------|--------|
| **Frontend** | React (Vite) + Vanilla CSS |
| **API** | FastAPI (Python) |
| **Database** | SQLite via SQLAlchemy |
| **Validation** | Pydantic v2 |
| **Coordination** | GitHub Projects (Kanban) |

## Key Features

- **Home Dashboard:** Dual-column view showing recent activities and active tasks.
- **Contact Management:** Searchable, sortable list of contacts with location tracking and tagging.
- **Task Kanban:** Visual board to move tasks between "To Do", "In Progress", and "Closed".
- **Auto-Audit Trail:** Every task status change automatically logs a note in the interaction history.
- **Log Activity:** Dedicated interface to capture calls, meetings, and notes for any contact.

## Quick Start

### 1. Backend (FastAPI)
```bash
cd customer-mgmt
python -m venv .venv
.venv/Scripts/activate   # Windows
# source .venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 2. Frontend (Vite)
```bash
cd customer-mgmt/frontend
npm install
npm run dev
```

The CRM will be available at **http://localhost:5173**.

## Project Structure

```
customer-mgmt/
├── app/                 # FastAPI Backend
│   ├── main.py          # Entry point & Router registration
│   ├── models.py        # SQLAlchemy Models (Contact, Task, Activity, Tag)
│   ├── routers/         # API Endpoints
│   └── schemas/         # Pydantic Validation
├── frontend/            # React Frontend
│   ├── src/
│   │   ├── components/  # UI Components (Modals, Lists)
│   │   └── api/         # API Client Utilities
│   └── index.html       # SPA Entry Point
├── AGENTS/              # Multi-Agent Coordination Hub
├── data/                # SQLite Database
└── DEPLOY.md            # Martin's Deployment Guide
```

## Kanban Board

Task coordination history: https://github.com/users/UrsushoribilisMusic/projects/2
