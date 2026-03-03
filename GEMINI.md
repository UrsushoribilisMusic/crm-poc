# Project Memory: crm-poc

## Core Identity
Simple CRM is a proof-of-concept demonstrating the power of **Multi-Agent AI Collaboration**. It was built by a coordinated fleet (Gemini & Claude) working on a shared React/FastAPI codebase.

## Shared Consciousness: "The Fleet That Never Sleeps"
The project uses a strict documentation-driven coordination hub in the `AGENTS/` directory:
- `PROJECT_GOAL.md`: The active sprint target and shared source of truth.
- `CONVENTIONS.md`: Shared coding laws (naming, style, error handling).
- `[AGENT]_INSTRUCTIONS.md`: Rules optimizing for specific agent strengths.
- `[AGENT]_MEMORY.md`: Session status and handover context.

## Architectural "Soul"
- **Relational Integrity:** All tasks and activities are linked to users via Foreign Keys (`assigned_to_id`, `user_id`). Name changes reflect globally and instantly.
- **Automated Audit:** The backend (`PATCH /tasks/`) automatically generates interaction notes when statuses change.
- **Resilient UI:** Frontend components (`refreshData`) load independently so one API failure doesn't break the entire dashboard.
- **Performance:** Server-side pagination (limit=50) for activity streams.

## Multi-Agent Workflow Rules
1. **Context First:** Always read `AGENTS/` hub before starting work.
2. **Atomic Tickets:** Work is broken into 15+ granular tickets to prevent drift and overlap.
3. **Branch-Driven:** Every feature/fix happens on a named branch (`feature/N-name`).
4. **Validation:** In-memory SQLite (`pytest`) and relative-path proxying ensure reliability across different PCs.

---
*Stored on March 2, 2026. Freude herrscht!*
