# Simple CRM System Architecture

## Overview
Simple CRM is a full-stack, data-driven application designed for relationship management. It uses a modern decoupled architecture where a React frontend communicates with a FastAPI backend via a proxied API layer.

## System Block Diagram

```mermaid
graph TD
    subgraph Client_Tier [Client Tier]
        UI[React Frontend / Vite]
        Style[Vanilla CSS Theme]
        CalendarView[Calendar Tab Component]
    end

    subgraph Logic_Tier [Logic Tier]
        Proxy[Vite Dev Proxy]
        API[FastAPI / Python]
        Auth[CORS Middleware]
        Router[Routers: Customers, Tasks, Activities, Users, GCal]
    end

    subgraph Data_Tier [Data Tier]
        ORM[SQLAlchemy ORM]
        DB[(SQLite / crm.db)]
        GAuth[Google OAuth Token Storage]
    end

    subgraph External_Services [External Services]
        GCal[Google Calendar API]
    end

    UI --> Proxy
    Proxy --> API
    API --> Router
    Router --> ORM
    ORM --> DB
    Router --> GCal
    GCal -. OAuth2 Flow .-> UI
```

## Data Flow: Google Calendar Sync (Sequence Diagram)
This diagram illustrates the Phase 2 feature for OAuth2-based task synchronization.

```mermaid
sequenceDiagram
    participant User as User
    participant FE as Frontend (CalendarView)
    participant BE as Backend (GCal Router)
    participant Google as Google Calendar API
    participant DB as Database (SQLite)

    User->>FE: Click "Sync to Google Calendar"
    FE->>BE: POST /sync-calendar/{user_id}
    alt Not Authenticated
        BE-->>FE: 400 (Need Auth)
        FE->>BE: GET /google-auth/{user_id}
        BE-->>FE: Return Authorization URL
        FE->>Google: Redirect to Google Login
        Google-->>BE: Callback with Code
        BE->>Google: Exchange Code for Tokens
        BE->>DB: Save google_token to User
        BE-->>FE: Redirect to CRM (?auth=success)
        FE->>User: Show "Connected" Alert
    else Authenticated
        BE->>DB: Load google_token
        BE->>DB: Load Pending Tasks
        BE->>Google: Insert Events for each Task
        Google-->>BE: Success
        BE-->>FE: Return Synced Count
        FE->>User: Show "Synced X Tasks" Alert
    end
```

## Component Map
-   **Frontend (React 19):** Managed in `frontend/`. Includes the `CalendarView` for monthly task visualization.
-   **API (FastAPI):** Managed in `app/`. The `google_calendar.py` router handles OAuth2 flows and synchronization logic.
-   **Persistence (SQLAlchemy):** Extended in Phase 2 to store encrypted OAuth tokens in the `User` model.
-   **External Integration:** Uses `google-api-python-client` for secure communication with Google Services.

## Multi-Agent Coordination
The architecture is designed to be modified by multiple agents in parallel.
-   **Atomic Routers:** Tasks, Activities, and GCal are decoupled into separate files to prevent merge conflicts.
-   **Shared Types:** Phase 2 introduced the `UserInternal` and `UserUpdate` schemas for secure token handling.
-   **Environment Parity:** The `DEPLOY.md` ensures that any environment runs the exact same architectural handshake.
