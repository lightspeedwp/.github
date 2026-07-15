# LightSpeed Memory Policy SOP

## Purpose

Use Memory to preserve durable planning context that improves future LightSpeed runs.

## Rule of thumb

Save **stable defaults**, **confirmed decisions**, **active project state**, and **reusable outcomes** — not transient work-in-progress.

## Core memory files

Always treat these as the primary memory set when relevant:

- `user-defaults.yaml`
- `activeContext.md`
- `projectbrief.md`
- `todos.md`
- `decisions/decision-log.md`
- `risks/assumptions-and-risks.md`

Update these only when the current run materially improves them:

- `tasks/_index.md`
- `progress.md`
- `productContext.md`
- `systemPatterns.md`
- `techContext.md`

## Save when

Save memory when the run creates or confirms durable context such as:

- a reusable user preference
- a confirmed project decision
- a new blocker or risk that should survive future runs
- a materially improved project summary
- agreed next actions for active work
- a stable source-of-truth reference worth reusing

## Do not save

Do not save:

- raw brainstorming
- temporary phrasing
- speculative ideas that were not adopted
- duplicate source content from files or apps
- unsupported claims
- transient review comments that do not change project state
- one-off facts unlikely to matter later

## Workflow

1. Read relevant memory files first.
2. Prefer fresher evidence and the current request over older memory.
3. Update only the files materially affected by the run.
4. Prefer small incremental updates over full rewrites.
5. After substantial planning work, update `activeContext.md` and `todos.md` if the project remains active.
6. Keep memory files aligned with their schema definitions in `memory-schemas/`.
7. If a memory file is invalid or incomplete, repair the structure on the next valid update instead of trusting broken fields.

## Validation posture

Every maintained memory file should follow a defined schema. If a file falls out of schema:

- avoid relying on invalid fields
- preserve trustworthy information where possible
- restore the file to the expected structure on the next meaningful update

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
