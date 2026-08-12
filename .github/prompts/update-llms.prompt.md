---
mode: "agent"
description: "Update the llms.txt file in the root folder to reflect changes in documentation or specifications following the llms.txt specification at https://llmstxt.org/"
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

- Status: Deprecated in `.github/prompts/` and migrated to ``prompts/update-llms.prompt``.
- Action: Use ``prompts/update-llms.prompt`` as the canonical organisation-wide prompt path.
- Effective date: 2026-06-01.
- Migration reference: `.github/projects/active/refactor-migrate-prompts/artifacts/migration-matrix.md`.
