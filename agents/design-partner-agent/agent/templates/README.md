# Templates

This folder stores reusable output templates and document scaffolds for Design Partner.

## Folder purpose
- provide repeatable starting structures for recurring deliverables
- keep output shape consistent across briefs, critiques, audits, synthesis work, and handoffs
- support alignment checks against the current package structure

## Naming conventions
- use `*-template.md` for reusable Markdown scaffolds
- use workflow-specific names that match the package vocabulary
- prefer one template per recurring artifact type

## Files
- `design-audit-template.md` — structure for broader design audit outputs
- `design-brief-template.md` — structure for schema-backed design brief outputs
- `design-critique-template.md` — structure for bounded critique outputs
- `implementation-handoff-template.md` — structure for implementation handoffs
- `research-synthesis-template.md` — structure for research synthesis outputs
- `ux-writing-template.md` — structure for UX writing outputs
- `reference-site-analysis-template.md` — structure for reference-site-analysis outputs
- `review-history-entry-template.md` — structure for compact review-history entries

## Relationship to the rest of the package
- `examples/` shows filled-in instances of several template-backed outputs.
- `schemas/` defines structured field expectations for workflows that use schema validation.
- `scripts/` contains package checks and alignment validators.
- `memory/` stores durable working context, not reusable output scaffolds.
- `prompts/` stores reusable maintenance prompts for package upkeep tasks.
