---
file_type: "prompt"
title: "Architecture Blueprint"
description: "Refactored organisation-wide prompt migrated from .github/prompts/architecture-blueprint-generator.prompt.md"
version: "1.0.0"
last_updated: "2026-06-01"
owners: ["LightSpeed Team"]
tags: ["prompts", "migration", "organisation-wide"]
status: "active"
stability: "stable"
domain: "generic"
migration_source: ".github/prompts/architecture-blueprint-generator.prompt.md"
---

# Architecture Blueprint

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
description: "Comprehensive project architecture blueprint generator that analyzes codebases to create detailed architectural documentation. Automatically detects technology stacks and architectural patterns, generates visual diagrams, documents implementation patterns, and provides extensible blueprints for maintaining architectural consistency and guiding new development."
mode: "agent"
---
```
