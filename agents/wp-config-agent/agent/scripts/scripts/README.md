# Scripts

Use this folder for validation runners and helper scripts that check the agent’s file structure, maintenance rules, and documentation consistency.

## Folder purpose

This folder is the canonical script and validation-runner layer.

Use it for:
- repeatable validation entrypoints
- focused consistency checks for agent files and wording
- helper scripts that support maintenance and documentation hygiene

## How this folder relates to the rest of the structure

- `scripts/` runs checks against the current agent file tree and documentation layer.
- `schemas/` provides the structural rules many scripts validate against.
- `templates/`, `examples/`, and `memory/` are common validation targets.
- `references/` and `prompts/` may also be checked for wording and maintenance consistency.
- `fixtures/` can hold compact test inputs for these scripts when needed.

## Current file inventory

- `README.md` — maintenance guide for validation runners and helper scripts
- `validate-agent-structure.py` — checks required core folders, docs, prompts, and validator paths
- `validate-memory-contents.py` — checks memory-file content expectations
- `validate-markdown-structure.py` — checks Markdown structure conventions and required section order
- `validate-template-schema-alignment.py` — checks alignment between templates, examples, and schemas
- `validate-memory-hygiene.py` — checks memory hygiene and consistency
- `validate-source-priority-consistency.py` — checks source-priority wording consistency
- `validate-business-context.py` — checks business-context completeness and consistency
- `validate-short-description-consistency.py` — checks short-description consistency
- `validate-inventory-consistency.py` — checks folder README inventories against the current attached file tree

## Naming conventions

Recommended patterns:
- `validate-<scope>.py`
- `run-<workflow>.sh`
- `<workflow>-helper.py`

Keep names explicit about what the script validates or runs.

## Recommended usage order

For a broad maintenance pass:
1. run `validate-agent-structure.py` first
2. run `validate-inventory-consistency.py` to catch README inventory drift
3. use the narrower `validate-*.py` scripts to inspect specific structural, wording, schema, or memory issues
4. review related files in `schemas/`, `templates/`, `examples/`, `memory/`, `references/`, `fixtures/`, or `prompts/` when a script surfaces a mismatch

## Maintenance notes

- Keep scripts deterministic and narrowly named.
- Update this inventory when scripts are added, renamed, or removed.
- Keep script purpose aligned with the current routing language, validation layer, and attached file structure.
