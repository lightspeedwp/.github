# Scripts

Use this folder for reusable validation scripts and audit helpers for the Tour Operator Website Configuration Agent.

## Folder purpose

This folder contains:

- the master validation runner
- file-tree and reference validators
- agent-presentation consistency validators
- instruction-linked file and routing consistency validators
- memory validation helpers
- practical shell helpers for audit support

## How to use this folder

- Run `bash scripts/run-master-validation.sh` as the standard full validation pass.
- Use individual validators when you are working on one narrow area and need faster feedback.
- Treat shell helpers as practical support tools, not as the source of truth for file standards.

## Naming conventions

Prefer these patterns where practical:

- `run-<workflow>.sh`
- `validate-<target>.py`
- `<topic>-helper.sh`

## Current file inventory

### Validation runner
- `run-master-validation.sh`

### Validation scripts
- `validate-folder-schemas.sh`
- `validate-file-naming.py`
- `validate-reference-links.py`
- `validate-app-usage-consistency.py`
- `validate-starter-prompts.py`
- `validate-short-description-consistency.py`
- `validate-instruction-file-consistency.py`
- `validate-agent-structure.py`
- `validate-memory-files.py`
- `file-schema-validator.py`

### Helper scripts
- `content-audit-helper.sh`
- `wp-audit-helper.sh`

## Validation chain

`run-master-validation.sh` currently runs the validation chain in this order:

1. folder schema validation
2. file naming validation
3. reference-link validation
4. app-usage consistency validation
5. starter-prompt consistency validation
6. short-description consistency validation
7. instruction-file consistency validation
8. required structure validation
9. memory validation
10. reusable file schema validation

## Validator notes

- `validate-instruction-file-consistency.py` checks instruction-linked file references against the current source snapshot in `tests/instruction-file-consistency-source.md`.
- That source snapshot also depends on `tests/skill-routing-snapshot.md` to keep instruction-linked routing references aligned with the currently attached specialist skills.
- `validate-folder-schemas.sh` now treats `templates/`, `examples/`, and `memory/` as conditional scope and skips those folders when they are not present in the current attached file tree.
- `validate-memory-files.py` now skips cleanly when `memory/` is not present in the current attached file tree.
- `validate-agent-structure.py` now checks the current attached validation and reference pack instead of assuming older missing example or reference assets still exist.
- When routing posture changes, update the linked test snapshots before relying on the validator output.

## Maintenance rules

- Keep the runner order in this README aligned with `run-master-validation.sh`.
- If a validator is added, removed, or renamed, update this README and `tests/validation-readme.md` together.
- If routing-related validation fixtures change, keep this README aligned with `tests/README.md` and `tests/validation-readme.md`.
- Keep validator descriptions practical and path-specific so maintainers can trace failures quickly.
