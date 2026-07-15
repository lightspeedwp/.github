# Schemas Schema Validation Test

Use this test when checking whether files in `schemas/` remain internally consistent and still describe the output structures the agent depends on.

## Scope

- `schemas/design-critique.schema.json`
- `schemas/implementation-handoff.schema.json`
- `schemas/design-brief.schema.json`
- `schemas/design-audit.schema.json`
- `schemas/memory-triage.schema.json`
- `schemas/review-history-entry.schema.json`
- Any future schema file added to `schemas/`

## Validation rules

### Structural checks

- Each schema file must declare a top-level JSON object.
- Each schema must identify required fields for the output it governs.
- Property names should match the vocabulary used by the corresponding template or example.
- Optional fields should support useful extensions rather than duplicating required fields.

### Cross-file consistency

- If a schema describes a critique, audit, brief, handoff, memory entry, or review history entry, the matching template or example should use compatible section names and concepts.
- Schema titles should clearly state the output they validate.
- Schemas should avoid fields that the current agent never produces or references.

## Failure signals

- Invalid JSON structure
- Required fields missing from the schema
- Property names that do not map cleanly to related templates or examples
- Schemas that have drifted away from the agent's current workflow assets
