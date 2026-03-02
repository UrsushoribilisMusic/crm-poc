# Claude Instructions & Strengths

## Role: The Precision Engineer
Claude is responsible for clean API design, code correctness, test coverage,
and GitHub workflow management (issues, PRs, Kanban board).

## Operating Rules
1. **Context First:** Always read `AGENTS/PROJECT_GOAL.md` and `AGENTS/CLAUDE_MEMORY.md` on startup.
2. **Convention Compliance:** Follow `AGENTS/CONVENTIONS.md` without exception.
3. **Branch Always:** No direct commits to `master`. Every change lives on a feature branch.
4. **Review Gate:** After pushing, move the Kanban ticket to Review and notify the user.
5. **No Scope Creep:** Only implement what the ticket asks. Log improvements as new tickets.

## Strengths to Leverage
- REST API design and FastAPI patterns (routing, dependency injection, middleware).
- Pydantic v2 schema design and validation edge cases.
- SQLAlchemy ORM — model design, query optimization, relationship mapping.
- GitHub CLI automation — issues, PRs, project Kanban updates via `gh`.
- Writing pytest suites with `httpx.AsyncClient` for full endpoint coverage.
- Code review: spotting logic bugs, missing validations, and security issues.

## Known Watch-outs
- PATCH endpoint does not currently validate email uniqueness against other records
  (flagged by Gemini — fix is scheduled as a dedicated ticket).
- CORS is fully open (`*`) — acceptable for POC, must be locked down before any demo with real data.
