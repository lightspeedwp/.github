# Validation README

Use this file as the central guide for the agent's validation assets, checks, source snapshots, routing snapshots, and runner order.

## Primary validation runner

Run the full validation chain with:

`bash scripts/run-master-validation.sh`

Use the master runner after meaningful changes to:

- README files or validation docs
- schemas and validation rules
- validation scripts or helper scripts
- instructions or instruction-linked files
- instruction-linked routing posture or specialist handoff notes
- app-related guidance snapshots
- starter prompts or short description snapshots
- file moves or renames

## Current validation chain

`run-master-validation.sh` currently runs these checks in order:

1. `bash scripts/validate-folder-schemas.sh`
2. `python3 scripts/validate-file-naming.py`
3. `python3 scripts/validate-reference-links.py`
4. `python3 scripts/validate-app-usage-consistency.py`
5. `python3 scripts/validate-starter-prompts.py`
6. `python3 scripts/validate-short-description-consistency.py`
7. `python3 scripts/validate-instruction-file-consistency.py`
8. `python3 scripts/validate-agent-structure.py`
9. `python3 scripts/validate-memory-files.py`
10. `python3 scripts/file-schema-validator.py`

## What the current validators cover

### File-tree and reference checks
- file naming
- reference-link integrity
- instruction-to-file consistency
- instruction-linked routing consistency via the current routing snapshot
- required file presence for the current validation pack

### Agent presentation checks
- app-usage consistency
- starter-prompt consistency
- short-description consistency

### File-quality checks
- folder schema validation
- memory file validation
- reusable file schema validation

## Source snapshots used by validators

These snapshot files in `tests/` support specific consistency checks:

- `instruction-file-consistency-source.md`
- `skill-routing-snapshot.md`
- `app-usage-consistency-source.md`
- `starter-prompt-consistency-source.md`
- `short-description-consistency-source.md`
- `schema-validation-tests.md`

Keep these files aligned with the current agent configuration when the linked behaviour changes.

Routing and consistency snapshots confirm current attached routing ownership only. They do not by themselves prove that any attached skill package was readable, package-verified, or successfully updated in the current session.

## Companion QA documents

Use these files alongside the automated validators:

- `tests/regression-checklist-master-validation.md`
- `tests/master-qa-checklist.md`
- `tests/test-plan-file-schema-validation.md`
- `tests/qa-checklist-file-schema-validation.md`

## Scope note

The current visible file view clearly includes `tests/`, `scripts/`, and `schemas/`.

The current visible README-style validation docs are:

- `tests/README.md`
- `tests/validation-readme.md`
- `scripts/README.md`

Reference files are used by the validation layer, but the visible file list in this draft view is truncated, so `references/` should be treated as partially visible rather than assumed fully visible from this snapshot alone.

The current validation pack treats `templates/`, `examples/`, and `memory/` as conditional scope only. When those folders are absent from the current attached file tree, the current validators skip or narrow those checks instead of treating the folders as required.

This conditional-scope behaviour now applies consistently across the folder-schema, memory, and file-naming validation steps.

## Maintenance rules

- Prefer the master runner for broad checks.
- Treat validation failures as drift signals, not just script errors.
- When the runner order changes, update this file and `scripts/README.md` together.
- When validation scope changes, update this file, `tests/README.md`, and the relevant test plans together.
- When instruction routing changes, update `tests/skill-routing-snapshot.md` and any linked validation notes together.
