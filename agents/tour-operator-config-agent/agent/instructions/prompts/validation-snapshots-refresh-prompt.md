# Validation snapshots refresh prompt

Refresh this agent’s validation snapshots and source files so the validation layer reflects the current draft state.

This is a maintenance implementation task. Do not just review. Update the stale snapshots and source files where needed.

## Scope

Inspect and update, where relevant:

- `tests/skill-routing-snapshot.md`
- `tests/instruction-file-consistency-source.md`
- `tests/app-usage-consistency-source.md`
- `tests/starter-prompt-consistency-source.md`
- `tests/short-description-consistency-source.md`
- `tests/validation-readme.md`
- any nearby validation note that depends on the current draft state

## Source of truth

Use these as the source of truth:

- the current saved agent instructions
- the current attached apps and skills
- the current starter prompts and short description
- the current attached file tree

## Required checks

- Make sure snapshot files reflect the current routing, app posture, starter prompts, and presentation details.
- Remove stale references to missing files, removed skills, or outdated app posture.
- Keep validation snapshots concise, exact, and aligned with the current draft.
- Avoid claiming a snapshot is current unless it is grounded in the present draft state.

## Editing rules

- Be surgical, not expansive.
- Preserve each file’s current role.
- Do not invent new validation assets.
- Keep exact paths, file names, app names, and skill names accurate.
- Use UK English.

## Validation expectations

After editing, run the relevant validation and consistency checks for the snapshot files you touched.

## Deliverables

1. Update the stale snapshot or source files.
2. Report which files were changed.
3. Report which stale references were removed or refreshed.
4. Report which checks were run and whether they passed or failed.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
