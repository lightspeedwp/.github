---
name: linear-memory-maintenance
description: Use when the current Linear-focused task may require reading, updating, or skipping durable Memory so future runs benefit from stable preferences, decisions, routing logic, taxonomy mappings, or ongoing work.
---

# Linear Memory Maintenance

Use this skill when a Linear-focused request depends on durable continuity across future runs, or when the current task reveals reusable information that should be saved into {{label:Memory,id:file_persistence,type:file_persistence}}.

Do not use this skill for ordinary one-off analysis, temporary reasoning, disposable notes, or output polish.

## What This Skill Is For

Use this skill to help the agent:

- decide whether the current task needs Memory at all
- read the minimum relevant Memory file before acting
- identify what information is truly durable
- route each durable update to the correct Memory file
- keep Memory entries concise, structured, and easy to reuse later
- avoid saving one-off chatter, scratch analysis, or duplicate entries

## Request Shapes

This skill is especially useful for requests like:

- "Remember this routing rule and use it next time."
- "Continue the Linear workflow work we started earlier."
- "Use my usual naming and triage defaults for this audit."
- "Capture this durable operating decision so future runs stay consistent."
- "Review whether this result should update any standing Memory files."

## Workflow

1. Decide whether the current task is a Memory-read task, a Memory-write task, both, or neither.
2. If Memory is relevant, read only the file or files that materially affect the current task.
3. Extract candidate durable facts from the current task or user instruction.
4. Classify each candidate as one of: user preference, ongoing todo, workspace default, operating decision, skill-routing rule, source-of-truth rule, unresolved assumption, or canonical taxonomy mapping.
5. Drop anything that is one-off, stale, speculative, redundant, or better left in the current response only.
6. Route each retained item to the correct Memory file using the routing guide in `references/memory-routing-guide.md`.
7. When updating a Memory file, preserve the existing file structure and keep entries compact, reviewable, and dated when the structure supports it.
8. After writing, use the updated Memory only as a standing input for future relevant runs; do not over-apply a saved rule to unrelated requests.

## Read Rules

Before reading Memory, decide what kind of continuity is actually needed:

- For user-specific defaults, read `user-preferences.md`.
- For continuing unfinished work, read `todos.md`.
- For workspace-level Linear conventions, read `workspace-personalization.yaml`.
- For durable operating decisions and reusable rules, read `decisions-log.yaml`.
- For repeatable skill-selection behavior, read `skill-routing-notes.yaml`.
- For source precedence or conflict handling, read `source-of-truth-register.yaml`.
- For unresolved ambiguity that may still matter, read `assumptions-open-questions.yaml`.
- For classification, naming, and routing mappings, read `canonical-taxonomy-cache.yaml`.

Do not read all Memory files by default. Read the smallest set that materially sharpens the current task.

## Write Rules

Save only information that should improve future Linear-focused runs.

Good candidates for Memory:

- stable user preferences the user wants reused
- ongoing work that must be continued later
- durable workspace defaults and conventions
- approved naming, routing, or prioritization rules
- repeatable skill-routing decisions
- stable source-of-truth precedence
- unresolved assumptions worth revisiting later
- repeated canonical mappings for issue types, labels, or routing patterns

Do not save:

- one-off summaries of the current request
- temporary analysis or brainstorming
- speculative ideas not confirmed by the user or evidence
- transient status that will quickly go stale unless it is explicitly tracked as ongoing work
- duplicate entries that restate an existing Memory rule without adding a meaningful change

When unsure whether something is durable enough to save, prefer not saving it unless the user asked to remember it or the task clearly depends on future reuse.

## Update Discipline

When updating a file:

- preserve the file's existing top-level structure
- update the smallest relevant section instead of rewriting unrelated sections
- keep wording concrete and reusable
- include dates or last-updated fields where the file structure expects them
- avoid stacking near-duplicate entries; merge with the standing rule when appropriate
- distinguish confirmed facts from assumptions still awaiting confirmation
- keep unresolved items clearly marked so later runs know whether to trust or revisit them

If the current task changes a standing rule, update the existing rule rather than appending a conflicting new version.

## Conflict Handling

If two Memory files appear relevant, choose the one that best matches the item's long-term purpose:

- personal preference -> `user-preferences.md`
- workspace-wide default -> `workspace-personalization.yaml`
- explicit durable decision with rationale -> `decisions-log.yaml`
- unresolved ambiguity -> `assumptions-open-questions.yaml`
- repeated taxonomy or routing mapping -> `canonical-taxonomy-cache.yaml`

If a saved rule conflicts with live evidence or the user's latest instruction, prefer the newer grounded source and update Memory to reflect that change.

## Output Contract

When this skill materially changes Memory, the final response should:

1. say which durable items were read or updated
2. briefly note what was intentionally not saved when that distinction matters
3. keep the explanation short and practical

When no Memory update is warranted, say so briefly and continue with the main task without forcing a save.

## Supporting Files

- `references/memory-routing-guide.md` — use this routing guide when deciding which Memory file should receive a durable update and what each file should contain.

## Quality Bar

A good use of this skill leaves Memory:

- smaller, not noisier
- easier to trust
- easier to scan on later runs
- aligned to real Linear workflow continuity
- explicit about what is confirmed versus still open

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
