# Memory

Use this folder for durable working-memory files that help the agent carry forward stable context across future WordPress sessions.

## Folder purpose

This folder is the canonical active memory layer.

Use it for:
- stable client and project defaults
- open work that needs continuity
- concise milestone history
- short session-to-session handoff notes

Do not use this folder as a generic scratch space or a dumping ground for copied source material.

## How this folder relates to the rest of the structure

- `memory/` stores durable working state.
- `templates/` stores reusable output structures.
- `examples/` stores worked examples of those structures.
- `references/` stores standing guidance and conventions.
- `schemas/` and `scripts/` provide the validation layer used to check this folder.
- `business-context.md` stays at the root as agent-wide context, not active memory.

## Current file inventory

- `README.md` — maintenance guide for the memory layer
- `user-preferences.md` — durable client, brand, site, form, SEO, QA, and compliance defaults
- `todos.md` — active work, blockers, follow-ups, pending decisions, and short done history
- `project-history.md` — milestone and change history
- `session-handoff.md` — short continuation note for the next session

## Naming conventions

Prefer descriptive, role-based names for durable memory files.

Recommended patterns:
- `<scope>-preferences.md`
- `<scope>-todos.md`
- `<project>-history.md`
- `<session>-handoff.md`

Keep names practical and explicit about the file’s purpose.

## Duplicate-handling rule

- Remove a memory file only when it is an exact duplicate of another file.
- Keep files that serve different roles, even if their names or topics overlap.
- When consolidating content, preserve the canonical file for that role and move only the duplicated content.

## Maintenance notes

- Save only durable defaults, live continuity, short milestone history, and useful handoff notes.
- Keep one-off scratch work out of `user-preferences.md`.
- Keep stale or completed work from accumulating in `todos.md`.
- Use validation and consistency checks from `schemas/` and `scripts/` to keep this folder aligned with the instructions and reference guides.
