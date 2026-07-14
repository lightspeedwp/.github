# Fixtures

Use this folder for compact validation and regression fixtures that support WordPress-specific maintenance checks.

## Folder purpose

This folder is the canonical fixture layer for validation support.

Use it for:
- compact synthetic inputs for validator testing
- regression fixtures for templates, memory, reporting, or routing-language checks
- small structured examples that support repeatable maintenance work

## How this folder relates to the rest of the structure

- `fixtures/` stores compact test inputs used to support validation and maintenance work.
- `scripts/` runs validation and helper checks that may consume fixtures from this folder.
- `schemas/` defines structural rules that fixtures may help test.
- `examples/` stores worked sample outputs, not compact regression fixtures.
- `memory/` stores active continuity rather than test inputs.

## Current file inventory

- `README.md` — local guidance for fixture scope and maintenance

## Naming conventions

Recommended patterns:
- `<workflow>-fixture.json`
- `<workflow>-fixture.md`
- `<validator>-fixture.json`

## Maintenance notes

- Keep fixtures compact, synthetic, and safe to store.
- Do not place client secrets, production credentials, or copied private content here.
- When new fixture files are added, update this inventory and align names with the validator or workflow they support.
