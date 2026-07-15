# Scripts folder

## Purpose
This folder stores executable validators and helper runners for canonical agent files.

## Naming conventions
- Use lowercase kebab-case names.
- Use `validate-*.py` for validator scripts.
- Use `run-*.py` for runner scripts.
- Use `.sh` only for thin shell helpers that call the Python runner layer.

## File outline
- `validate-folder-schemas.sh` — shell helper for running the validator suite.
- `validate-schemas.py` — JSON schema parsing checks.
- `validate-markdown-structure.py` — template and example structure checks.
- `validate-memory.py` — memory structure and hygiene checks.
- `run-all-validators.py` — unified validator runner.
- `validate-links.py` — file-reference checks.
- `validate-starter-prompts.py` — presentation-spec checks for starter prompts.
- `validate-business-context.py` — business-context completeness checks.
- `validate-source-priority-consistency.py` — cross-file consistency checks.
