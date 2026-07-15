# Tests folder

## Purpose
This folder stores human-readable validation expectations and regression checks that explain what the validator scripts are enforcing.

## Naming conventions
- Use lowercase kebab-case names ending in `-tests.md`, `-checklist.md`, or another clearly scoped test-oriented name.
- Keep one test file per validation concern where practical.
- Use the tests folder for rule descriptions, not executable logic.

## File outline
- `schema-validation-tests.md` — human-readable checks for schemas, templates, examples, memory, and related validation rules.
- `agent-validation-regression-checklist.md` — regression checklist for prompt, routing, template, memory, and presentation changes.
