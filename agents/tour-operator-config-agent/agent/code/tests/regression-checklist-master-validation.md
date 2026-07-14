# Regression Checklist: Master Validation

Use this checklist to decide when to run `bash scripts/run-master-validation.sh` after changes to docs, schemas, scripts, or instructions.

## Run master validation after doc changes
Run the master validator when you change:
- `README.md` files in any project folder
- QA checklists, test plans, or validation guides in `tests/`
- standards, policies, or naming guidance in `references/`
- examples or templates that are referenced by docs or instructions

Reason:
- doc edits can break file references, expected paths, and QA flow consistency

## Run master validation after schema changes
Run the master validator when you change:
- any `*-schema.json` file in `schemas/`
- validation schema files such as:
  - `schemas/template-file-validation-schema.json`
  - `schemas/example-file-validation-schema.json`
  - `schemas/schema-file-validation-schema.json`
  - `schemas/memory-file-validation-schema.json`
- required fields, object shape, or validation conventions used by templates or examples

Reason:
- schema changes can break JSON parsing, structural assumptions, and file-quality checks

## Run master validation after script changes
Run the master validator when you change:
- `scripts/run-master-validation.sh`
- `scripts/validate-folder-schemas.sh`
- `scripts/validate-file-naming.py`
- `scripts/validate-reference-links.py`
- `scripts/validate-app-usage-consistency.py`
- `scripts/validate-starter-prompts.py`
- `scripts/validate-short-description-consistency.py`
- `scripts/validate-instruction-file-consistency.py`
- any helper script that affects validation behavior or referenced file paths

Reason:
- script changes can break the validation chain or make results misleading

## Run master validation after instruction changes
Run the master validator when you change:
- the main agent instructions
- file references mentioned in the instructions
- app-related instruction guidance for attached tools
- QA workflow references in the instructions
- default validation or launch-review behavior in the instructions

Reason:
- instruction changes can drift away from attached files, test assets, app usage, and QA workflows

## Run master validation after ChatGPT presentation changes
Run the master validator when you change:
- the short description
- starter prompts
- starter prompt titles, descriptions, or prompt text
- presentation guidance snapshots in `tests/`

Reason:
- presentation changes can drift away from the agent's current role and core workflows

## Run master validation after structural file moves or renames
Run the master validator when you:
- rename files used by docs, tests, scripts, or instructions
- move files between `templates/`, `examples/`, `schemas/`, `memory/`, `tests/`, `references/`, or `scripts/`
- add a new reusable validation asset that should be included in the existing checks

Reason:
- renames and moves commonly break reference-link and instruction-file consistency checks

## Quick decision rule
Run `bash scripts/run-master-validation.sh` if a change affects any of these:
- file paths
- validation logic
- schema structure
- documented QA flow
- app guidance for attached tools
- ChatGPT presentation fields
- instruction-linked files

## Sign-off
- [ ] I changed docs, schemas, scripts, instructions, or file structure
- [ ] I ran `bash scripts/run-master-validation.sh`
- [ ] I reviewed any failures and fixed them
- [ ] I reran the validator until the full chain passed
