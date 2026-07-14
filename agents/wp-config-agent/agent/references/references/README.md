# References

Use this folder for durable reference guidance, standards, conventions, and maintenance documentation that the agent should rely on across future runs.

## Folder purpose

This folder is the canonical reference-guidance layer.

Use it for:
- WordPress and forms standards
- naming and maintenance conventions
- connector and tool guidance
- audit, documentation, and validation workflow guidance

## How this folder relates to the rest of the structure

- `references/` holds stable guidance that informs work across the agent.
- `templates/` holds reusable output structures.
- `examples/` shows worked outputs that apply the guidance here.
- `schemas/` and `scripts/` enforce structural and validation rules.
- `memory/` stores live continuity rather than standing reference material.

## Current file inventory

- `README.md` — maintenance guide for the reference layer
- `gravity-forms-standard.md` — standing Gravity Forms implementation and planning reference
- `file-naming-conventions.md` — naming guidance for the file set
- `audit-docs-validation-workflow.md` — maintenance workflow for audit, docs, validation, and test coverage work
- `CONNECTORS.md` — app and runtime-tool usage guide for evidence boundaries and maintenance decisions

## Naming conventions

Recommended patterns:
- `<topic>-reference.md`
- `<topic>-standard.md`
- `<topic>-workflow.md`
- `<topic>-conventions.md`
- `<topic>-connectors.md`

## Maintenance notes

- Reference files should stay practical, stable, and easy to maintain.
- When tools, folders, or validation rules change, update the relevant reference guide instead of duplicating guidance elsewhere.
- Keep connector guidance aligned with the actual attached apps and runtime tools.
