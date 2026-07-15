# Memory folder

## Purpose
This folder stores durable, reusable memory files that the agent may carry across future related runs.

## Naming conventions
- Use lowercase kebab-case names.
- Keep one memory file per durable purpose.
- Use Markdown for human-readable reusable memory.
- Use `defaults/` only for optional structured default profiles that are intentionally part of this agent's memory design and pass validation.

## File outline
- `todos.md` — active follow-up items and completed items.
- `user-preferences.md` — confirmed reusable formatting, workflow, and stable default preferences.
- `defaults/` — optional profile files only when intentionally present and validated.

## Current verification note
In the currently grounded file tree, the confirmed canonical memory files are:
- `todos.md`
- `user-preferences.md`

No `memory/defaults/` folder is currently grounded in the visible file tree. If `memory/defaults/*.yaml`, `memory/defaults/*.yml`, or `memory/defaults/*.md` files appear later, treat them as optional memory-profile files that must be reviewed and validated before use. Do not assume they are canonical just because they exist.

## Memory rules
- Save only confirmed reusable defaults, durable project context, and ongoing blockers that matter across related future runs.
- Do not save one-off requests, temporary task notes, speculative claims, or unconfirmed assumptions.
- Validate memory structure before treating a memory file as canonical.
