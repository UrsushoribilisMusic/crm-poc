# Claude Memory: Status & Context Handover

## Last Active Session: March 2, 2026
**Current Focus:** Agent documentation + fleet architecture alignment.

### Completed This Session
- [x] Initial project scaffolding (FastAPI + SQLite + CSV export + Makefile).
- [x] GitHub repo created and pushed: `UrsushoribilisMusic/crm-poc`.
- [x] GitHub Kanban project created (4 columns: Todo / In Progress / Review / Done).
- [x] Ticket #1 (venv + Makefile setup) completed — moved to Review.
- [x] Created `CLAUDE.md`, `AGENTS/CLAUDE_INSTRUCTIONS.md`, `AGENTS/CLAUDE_MEMORY.md`.
- [x] Updated `AGENTS/PROJECT_GOAL.md` to reflect current fleet state.

### Known Issues to Address (Next Session)
- [ ] PATCH `/customers/{id}` does not check email uniqueness against other records → 400 bug risk.
- [ ] CORS is open `*` — tighten before any production/demo use with real data.
- [ ] No test suite yet (pytest + httpx) — Gemini flagged this as next priority.

### Context for Next Agent
- Repo: `https://github.com/UrsushoribilisMusic/crm-poc.git`
- Kanban: `https://github.com/users/UrsushoribilisMusic/projects/2`
- Always start with `AGENTS/PROJECT_GOAL.md` and your own Memory file.
- The `master` branch is stable and passing. All new work via feature branches.
- Gemini owns synthesis/docs; Claude owns API precision and GitHub ops.
