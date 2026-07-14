# scripts/validation-pack/

## Purpose
Store validation-pack script definitions and the documentation that explains what the validation layer is expected to check.

## Current files in this folder
- `README.md` — explains the validation-pack script layer and current implementation status.
- `checklist.md` — records the current validation intent, fixture support, and pending executable checks.

## Naming conventions
- Use lowercase kebab-case.
- Name executable scripts after the exact check they perform, such as `validate-readme-inventory.py`.
- Keep each validation script focused on one clear responsibility when implemented.

## Current implementation note
This folder currently documents the validation layer but does not yet contain the planned executable validation scripts. Those scripts remain pending and should be added before the validation pack is treated as fully implemented.
