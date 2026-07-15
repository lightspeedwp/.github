# Playwright Testing Agent Asset Pack

## Purpose
This file set supports the Playwright Testing Agent's recurring work: turning requirements, design evidence, repository context, and QA expectations into traceable human-readable test cases and maintainable Playwright outputs.

## Folder map
- `examples/` — worked examples that show expected shape and quality
- `fixtures/` — sample inputs and test data for validation and scenario work
- `profiles/` — reusable testing profiles and operating defaults
- `prompts/` — recurring maintenance prompts for audits, README refreshes, and validation tightening
- `schemas/` — validation contracts for structured outputs and agent files
- `scripts/` — validation and maintenance scripts
- `tests/` — validation checklists and test guidance

## Recommended maintenance workflow
1. Start from the relevant example, fixture, profile, schema, or prompt for the maintenance slice you are working on.
2. Keep the matching validation guidance in `tests/` and `scripts/` aligned with the current structure.
3. Use `fixtures/` for sample source material and failure payloads.
4. Use `profiles/` when a reusable testing mode or QA posture applies.
5. Use `prompts/` for recurring audit or cleanup passes.
6. Run the validation scripts in `scripts/` before finalising file-quality changes.

## Canonical location rules
- `schemas/` is the canonical home for validation contracts.
- `examples/` provides worked output examples and should not be treated as validation contracts.
- `fixtures/` contains sample inputs and scenario data, not final output examples.
- `profiles/` contains reusable operating guidance for recurring testing contexts.
- `prompts/` contains recurring maintenance prompts, not validator logic.
- `scripts/` and `tests/` define the validation layer and maintainer checks.

## Duplicate handling rule
Remove files only when they are exact duplicates. Similar names across `examples/`, `schemas/`, `fixtures/`, `profiles/`, and `prompts/` usually reflect different roles and should be kept unless content proves otherwise.

## Validation entry points
- Primary folder validation entry point: `bash scripts/validate-folder-schemas.sh`
- Targeted validators live in `scripts/`
- Validation checklist and test guidance: `tests/schema-validation-tests.md`
- Current validation alignment expects example-to-schema references and no `templates/` folder in the pack.
