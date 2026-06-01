---
mode: "agent"
description: "Generate a comprehensive repository summary and narrative story from commit history"
tools:
  [
    "changes",
    "search/codebase",
    "edit/editFiles",
    "githubRepo",
    "runCommands",
    "runTasks",
    "search",
    "search/searchResults",
    "runCommands/terminalLastCommand",
    "runCommands/terminalSelection",
  ]
---

## Deprecation Notice

- Status: Deprecated in `.github/prompts/` and migrated to ``prompts/repo-story-time.prompt``.
- Action: Use ``prompts/repo-story-time.prompt`` as the canonical organisation-wide prompt path.
- Effective date: 2026-06-01.
- Migration reference: `.github/projects/active/refactor-migrate-prompts/artifacts/migration-matrix.md`.
