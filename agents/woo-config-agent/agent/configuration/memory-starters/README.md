# Memory

Use this folder for durable project continuity across WooCommerce delivery work.

## Included files
- `todos.md` for active work, blockers, follow-ups, and pending decisions
- `user-preferences.md` for durable store defaults, plugin preferences, SEO priorities, and QA expectations
- `project-history.md` for short milestone notes that matter in future work

## Recommended file naming
- `<scope>-notes.md`
- `<client>-preferences.md`
- `<project>-history.md`
- `<project>-handoff.md`

## Memory rules
- store only durable, scoped information that will matter in future runs
- keep active work separate from stable preferences
- do not store bulky evidence, copied source material, or one-off scratch notes
- correct stale memory when new evidence contradicts it
- keep entries clearly scoped when multiple stores or environments are in play

## Validation note
Memory files in this folder should be checked with `schemas/memory-file-validation-schema.json` and the validation scripts in `scripts/` so stable preferences, active work, and history remain clearly separated.
