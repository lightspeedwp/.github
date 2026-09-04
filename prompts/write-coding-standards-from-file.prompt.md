---
file_type: "prompt"
title: "Write Coding Standards From File"
description: "Refactored organisation-wide prompt migrated from .github/prompts/write-coding-standards-from-file.prompt.md"
version: "1.0.0"
last_updated: "2026-06-01"
owners: ["LightSpeed Team"]
tags: ["prompts", "migration", "organisation-wide"]
status: "active"
stability: "stable"
domain: "generic"
migration_source: ".github/prompts/write-coding-standards-from-file.prompt.md"
---

# Write Coding Standards From File

## Context

Define the repository context, objective, and constraints relevant to this task.

## Task

Describe exactly what needs to be produced and where outputs should be stored.

## Constraints

- Use UK English.
- Keep outputs practical, reproducible, and maintainable.
- Prefer minimal, modular solutions.
- Include validation steps for quality, performance, and accessibility where applicable.

## Acceptance Criteria

- Deliverable is complete and aligned to LightSpeed standards.
- Any generated code/documentation includes clear rationale.
- Validation checks are listed and, where possible, executed.

## References

- Source prompt: `.github/prompts` migration origin
## Legacy Source (For Transition)

```markdown
---
mode: "agent"
description: "Write a coding standards document for a project using the coding styles from the file(s) and/or folder(s) passed as arguments in the prompt."
tools:
  ["createFile", "editFiles", "fetch", "githubRepo", "search", "testFailure"]
---
```
