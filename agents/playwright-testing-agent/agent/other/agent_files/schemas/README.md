# schemas

## Purpose
This folder contains validation contracts for structured outputs and agent-file quality rules.

## Naming conventions
- Use descriptive kebab-case names.
- Use the `.schema.json` suffix for JSON schema files.
- Keep schema names aligned with the example or artifact they validate.

## Current file inventory
- `test-case.schema.json`
- `test-suite-plan.schema.json`
- `bugherd-failure.schema.json`
- `repo-analysis.schema.json`
- `figma-context.schema.json`
- `requirements-traceability.schema.json`
- `agent-file.schema.json`
- `memory-file.schema.json`

## Maintenance rules
- Treat schemas as validation assets, not starter content.
- Keep each schema aligned with the corresponding example or validated artifact shape.
- Use schema updates to tighten validation deliberately, not to mask drift elsewhere.
