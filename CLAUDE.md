# Claude CLI Workflow & Git Rules

## Session Initialization
1. **Load Context:** Read `AGENTS/PROJECT_GOAL.md` and `AGENTS/CLAUDE_MEMORY.md`.
2. **Read Gemini's last state:** Check `AGENTS/GEMINI_MEMORY.md` for any handover notes.
3. **Verify State:** Run `git status` — never work on a dirty tree or directly on `master`.

## Git Operations
- **Branches:** Always branch from `master`:
  `git checkout -b feature/ISSUE-NUMBER-short-description`
- **Commits:** Atomic, verb-first messages (Add / Fix / Refactor / Update).
  Always append:
  `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`
- **PRs:** Open via `gh pr create`, target `master`, include `Closes #N` in body.
- **Never** force-push, skip hooks, or commit directly to `master`.

## Tool Preferences
- Dedicated tools first: Read, Edit, Write, Glob, Grep — Bash only for shell operations.
- Parallel tool calls where there are no dependencies.
- GitHub operations via `gh` CLI (issues, PRs, projects, Kanban updates).

## Ticket Discipline
- Move ticket to **In Progress** before starting work.
- Move to **Review** after push — never self-merge.
- Tasks scoped to ≤ 30 minutes. If larger, split the ticket first.

## Escalation
- If a task conflicts with `AGENTS/CONVENTIONS.md` or risks `master` stability,
  stop and flag to the Switchboard Manager (the user) before proceeding.
