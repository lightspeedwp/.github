---
file_type: "prompt"
title: "Shuffle Json Data"
description: "Refactored organisation-wide prompt migrated from .github/prompts/shuffle-json-data.prompt.md"
version: "1.0.0"
last_updated: "2026-06-01"
owners: ["LightSpeed Team"]
tags: ["prompts", "migration", "organisation-wide"]
status: "active"
stability: "stable"
domain: "generic"
migration_source: ".github/prompts/shuffle-json-data.prompt.md"
---

# Shuffle Json Data

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
description: "Shuffle repetitive JSON objects safely by validating schema consistency before randomising entries."
tools: ["edit/editFiles", "runInTerminal", "pylanceRunCodeSnippet"]
---
```
