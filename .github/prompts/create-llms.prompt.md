---
mode: "agent"
description: "Create an llms.txt file from scratch based on repository structure following the llms.txt specification at https://llmstxt.org/"
tools:
  [
    "changes",
    "search/codebase",
    "edit/editFiles",
    "extensions",
    "fetch",
    "githubRepo",
    "openSimpleBrowser",
    "problems",
    "runTasks",
    "search",
    "search/searchResults",
    "runCommands/terminalLastCommand",
    "runCommands/terminalSelection",
    "testFailure",
    "usages",
    "vscodeAPI",
  ]
---

## Deprecation Notice

- Status: Deprecated in `.github/prompts/` and migrated to ``prompts/create-llms.prompt``.
- Action: Use ``prompts/create-llms.prompt`` as the canonical organisation-wide prompt path.
- Effective date: 2026-06-01.
- Migration reference: `.github/projects/active/refactor-migrate-prompts/artifacts/migration-matrix.md`.
