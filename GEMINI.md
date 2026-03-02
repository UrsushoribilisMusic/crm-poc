# Gemini CLI Workflow & Git Rules

## Session Initialization
1.  **Check Context:** Read `AGENTS/PROJECT_GOAL.md` and `AGENTS/GEMINI_MEMORY.md`.
2.  **Verify State:** Run `git status` to ensure working directory is clean.

## Git Operations
- **Branches:** Always create a new branch from `master` for any code change:
  `git checkout -b feature/ISSUE-NAME`
- **Commits:** Use the `-m` flag with clear, concise messages.
- **Pushing:** Push to origin and notify the user to open a PR.

## Tool Preferences
- **Parallelism:** Use parallel search (`grep_search`) and read (`read_file`) for efficient context gathering.
- **Validation:** Always use `run_shell_command` to verify syntax or run tests.

## Escalation
- If a task is underspecified or risks the stability of `master`, ask for clarification from the "Switchboard Manager" (the user).
