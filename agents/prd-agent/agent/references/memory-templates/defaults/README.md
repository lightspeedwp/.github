# memory/defaults/

## Purpose
Store the canonical starter files for durable planning continuity.

## Current files in this folder
- `activeContext.md` — active planning context that should persist across future runs.
- `projectbrief.md` — stable project summary and planning baseline.
- `progress.md` — durable milestone and status continuity.
- `productContext.md` — reusable product-level planning context.
- `systemPatterns.md` — repeatable system and delivery patterns.
- `techContext.md` — durable technical context and implementation constraints.
- `todos.md` — follow-up tasks that should persist across runs.
- `user-preferences.md` — reusable requester preferences and output defaults.

## Naming conventions
- Use stable, human-readable filenames tied to durable planning concepts.
- Keep starter files in Markdown so they are easy to inspect and update over time.
- Prefer one durable memory concept per file.

## Important distinction
This folder is the canonical starter layer for durable planning continuity. These files define what the agent should remember over time. Validation rules for those memory records belong in `memory/schemas/`, not here.
