# examples/

## Purpose
Store realistic worked examples that show how the agent should process evidence, draft planning artefacts, and maintain durable memory in practice.

## Current files and subfolders in this folder
- `templates/` — filled example outputs that map to the canonical templates.
- `memory/` — realistic durable memory examples that should align with `memory/defaults/` and `memory/schemas/`.

## Naming conventions
- Use lowercase kebab-case.
- Name examples by the output type or scenario they demonstrate, such as `example-prd.md` or `strong-prd-example.md`.
- Keep worked examples realistic and traceable to an actual planning situation.

## Important distinctions
- `templates/` contains filled examples of canonical templates.
- `memory/` contains realistic durable-memory examples.
- Canonical output templates belong in `templates/`, not in `examples/`.
- Validation or negative test inputs belong in `fixtures/`, not in `examples/`.
