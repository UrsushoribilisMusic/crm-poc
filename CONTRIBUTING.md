# Contributing to CRM POC

Thank you for your interest in contributing. This project uses a **multi-agent fleet workflow** — human or AI, the same rules apply.

## The Fleet Workflow

This project is developed by a coordinated team of AI agents (Claude + Gemini) managed by a human Switchboard Manager. Contributions follow the same discipline.

### Shared Coordination Files

Before starting any work, read these files:

| File | Purpose |
|------|---------|
| `AGENTS/PROJECT_GOAL.md` | Current sprint targets and handover status |
| `AGENTS/CONVENTIONS.md` | Coding law — non-negotiable |
| `CLAUDE.md` / `GEMINI.md` | Agent-specific workflow rules |

### Git Workflow

```
master  ←  always stable, always passing tests
  └── feature/ISSUE-NUMBER-short-description
```

1. **Always branch from master**: `git checkout -b feature/11-my-feature`
2. **Keep tasks under 30 minutes** — split larger work into multiple tickets
3. **Commit atomically** with verb-first messages: `Add`, `Fix`, `Refactor`, `Update`
4. **Open a PR** targeting `master` — include `Closes #N` in the body
5. **Move your Kanban ticket to Review** after pushing — never self-merge
6. **Never commit directly to `master`** or skip hooks

### Code Conventions

See `AGENTS/CONVENTIONS.md` for the full coding law. Key points:

- **Python**: PEP 8, type hints everywhere, Pydantic v2 for schemas
- **FastAPI**: Use `Depends()` for DB sessions, `HTTPException` for errors
- **React**: Functional components, hooks only, no class components
- **CSS**: Plain CSS for portability

### Ticket Discipline

- Pick up unassigned tickets from the [Kanban board](https://github.com/users/UrsushoribilisMusic/projects/2)
- Move ticket → **In Progress** before starting
- Move ticket → **Review** after pushing your PR
- Do not pick up tickets marked for another agent without checking first

### Running Tests

```bash
# Backend
python -m pytest tests/ -v

# Frontend
cd frontend && npm test
```

All tests must pass before opening a PR.

## Getting Started

```bash
git clone https://github.com/UrsushoribilisMusic/crm-poc.git
cd crm-poc
make setup
make dev
```
