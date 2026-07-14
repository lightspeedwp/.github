# tests/validation-pack/

## Purpose
Store validation-pack test definitions and coverage notes for the scaffold’s validation and workflow layer.

## Current files in this folder
- `README.md` — explains the validation-test layer and current implementation status.
- `test-matrix.md` — maps intended workflow and validation coverage to the fixtures that currently support that coverage.

## Naming conventions
- Use lowercase kebab-case.
- Name tests by the workflow or validation concern they cover, such as `validation-pack-required-files.md` or `estimate-readiness-test.md`.
- Keep each future test file aligned to one clear behaviour or validation condition.

## Current implementation status
- The fixture layer now covers strong, weak, conflicting, and validator-failure cases across intake, PRD quality, estimate readiness, handoff readiness, README coverage, and schema alignment.
- This folder currently documents the validation-test layer, but explicit standalone test definition files are still pending.
- Script-linked pass/fail expectations remain pending until the executable validation scripts exist.

## Important distinction
- `test-matrix.md` is the coverage map.
- Future standalone test files in this folder should define executable or reviewable pass/fail expectations against specific fixtures.
- Validation fixtures live in `fixtures/`; canonical templates live in `templates/`; worked examples live in `examples/`.
