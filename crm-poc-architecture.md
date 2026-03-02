# Simple CRM System Architecture

## Overview
Simple CRM is a full-stack, data-driven application designed for relationship management. It uses a modern decoupled architecture where a React frontend communicates with a FastAPI backend via a proxied API layer.

## System Block Diagram

```mermaid
graph TD
    subgraph Client_Tier [Client Tier]
        UI[React Frontend / Vite]
        Style[Vanilla CSS Theme]
    end

    subgraph Logic_Tier [Logic Tier]
        Proxy[Vite Dev Proxy]
        API[FastAPI / Python]
        Auth[CORS Middleware]
        Router[Routers: Customers, Tasks, Activities]
    end

    subgraph Data_Tier [Data Tier]
        ORM[SQLAlchemy ORM]
        DB[(SQLite / crm.db)]
    end

    UI --> Proxy
    Proxy --> API
    API --> Router
    Router --> ORM
    ORM --> DB
```

## Data Flow: Update Task Status (Sequence Diagram)
This diagram illustrates the automated audit trail feature where changing a task's status creates an interaction activity.

```mermaid
sequenceDiagram
    participant User as User (Kanban)
    participant FE as Frontend (App.jsx)
    participant BE as Backend (Tasks Router)
    participant DB as Database (SQLite)

    User->>FE: Click "Work on" (In Progress)
    FE->>BE: PATCH /tasks/{id} (status: "In Progress")
    activate BE
    BE->>BE: Detect status change
    BE->>BE: Create Activity(type="Note", summary="Status changed...")
    BE->>DB: Update Task Record
    BE->>DB: Insert Activity Record
    DB-->>BE: Success
    BE-->>FE: Return Updated Task
    deactivate BE
    FE->>FE: Trigger refreshData()
    FE->>BE: GET /activities/
    BE-->>FE: Return Activities (incl. new status note)
    FE-->>User: Update Kanban Board & Home Feed
```

## Component Map
-   **Frontend (React 19):** Managed in `frontend/`. Uses a state-driven approach to refresh all dashboard components independently for high resilience.
-   **API (FastAPI):** Managed in `app/`. Provides a RESTful interface for all CRM entities.
-   **Persistence (SQLAlchemy):** Implements a relational schema with Many-to-Many support for tagging.
-   **Audit System:** A backend-driven trigger that ensures every task transition is permanently recorded in the interaction history.

## Multi-Agent Coordination
The architecture is designed to be modified by multiple agents in parallel.
-   **Atomic Routers:** Tasks, Activities, and Customers are decoupled into separate files to prevent merge conflicts.
-   **Shared Types:** Frontend components share a common API utility layer to ensure data consistency.
-   **Environment Parity:** The `DEPLOY.md` ensures that any environment (local, Martin's PC, or CI) runs the exact same architectural handshake.
