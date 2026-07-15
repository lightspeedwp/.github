# Schemas

This folder stores structured definitions for repeatable Design Partner outputs.

## Folder purpose
- define required fields for structured workflow outputs
- support package validation where schema-backed checks are present
- make output expectations explicit where Markdown structure alone is not enough

## Naming conventions
- use `*.schema.json` for JSON Schemas
- keep schema names aligned with workflow names used in templates, examples, and validators
- prefer one schema per recurring structured output type

## Files
- `design-critique.schema.json`
- `implementation-handoff.schema.json`
- `design-brief.schema.json`
- `design-audit.schema.json`
- `research-synthesis.schema.json`
- `ux-writing.schema.json`
- `reference-site-analysis.schema.json`
- `memory-triage.schema.json`
- `review-history-entry.schema.json`

## Relationship to the rest of the package
- `templates/` provides human-readable scaffolds for several of the same workflows.
- `examples/` shows filled-in outputs that may reflect these structures.
- `scripts/` contains schema and alignment checks for selected workflows and package rules.
- `memory/` uses schemas only where a structured memory contract is helpful; memory files themselves remain human-maintained working context.
