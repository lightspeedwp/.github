# Scripts README

## Purpose
This folder stores the validator scripts and supporting maintenance notes that keep the Harvest Analytical Agent consistent, safe, and maintainable.

The attached agent file tree is the source of truth for validator names, test fixtures, examples, templates, schemas, prompts, and reference paths. Do not rely on workspace-only example files or outdated local filenames when documenting or running this validation pack.

In this folder:
- validator scripts define the validation checks
- maintenance notes such as `report-generation-flow.md`, `tool-inventory.md`, and `mcp-gap-log.md` support audit and upkeep work
- this README explains how the validation pack fits together

## Recommended Validation Order
1. `validate-memory-hygiene.py`
2. `validate-source-priority-consistency.py`
3. `validate-template-schema-alignment.py`
4. `validate-markdown-structure.py`
5. `validate-links-and-references.py`
6. `validate-business-context.py`
7. `validate-starter-prompts.py`
8. `validate-all.py`

## When to Run Validators
- After instruction changes that affect routing, source priority, or report rules.
- After adding, renaming, or deleting attached files.
- After changing templates, examples, schemas, prompts, or tests.
- Before major release or handoff.

## What Each Validator Checks
Each validator focuses on a specific drift risk: memory hygiene, source-priority consistency, template-schema alignment, markdown structure, links and references, business-context completeness, starter prompts, and combined reporting.

## Related Structure
- Validation tests live in the `tests/` folder.
- Validation templates live in `templates/`.
- Validation schemas live in `schemas/`.
- Validation examples live in `examples/`.
- Recurring maintenance prompts live in `prompts/`.

## Severity Levels
Use Error, Warning, Notice, and Pass.

## Validation Output Format
Validation output should align with `schemas/validation-report.schema.json` and `templates/validation-report.template.md`.

## Common Fixes
- Restore missing references.
- Re-align source-priority wording with the current instructions and attached files.
- Re-align template fields and examples.
- Remove one-off preferences from durable preference files.
- Fix heading order and placeholders.
- Replace outdated file paths with the current attached file-tree paths.

## Future Script Ideas
- Report consistency scorecard
- Permission-aware output linting
- Starter prompt regression checks
