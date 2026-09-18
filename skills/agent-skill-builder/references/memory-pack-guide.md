# Memory Pack Guide

Use this guide when a generated skill needs durable local context.

## What belongs in memory

Save only information that should shape future runs:

- Stable user or team preferences.
- Approved project defaults.
- Durable routing rules.
- Reusable terminology and naming decisions.
- Active open loops that still need attention.
- Decisions with date, rationale, and source.

## What must not be saved

Do not save:

- One-off requests.
- Temporary notes.
- Completed tasks that no longer matter.
- Sensitive personal, financial, credential, or private client information unless the user explicitly asks and the workflow permits it.
- Guesses or unapproved assumptions.
- Raw connector excerpts that should remain source-bound.

## Recommended structure

```text
memory/
├── README.md
├── defaults/
│   ├── user-preferences.md
│   ├── project-context.md
│   ├── decisions.md
│   └── todos.md
└── schemas/
    ├── memory.schema.json
    ├── user-preferences.schema.json
    ├── project-context.schema.json
    ├── decisions.schema.json
    └── todos.schema.json
```

## File roles

| File | Use for |
| --- | --- |
| `user-preferences.md` | Durable tone, formatting, workflow, naming, or delivery preferences |
| `project-context.md` | Stable project facts and approved defaults |
| `decisions.md` | Dated decisions with rationale and source |
| `todos.md` | Open loops that are still active |

## Good entry

```markdown
- 2026-07-03: Use advanced validation packs for shared LightSpeed workflow skills because template, memory, and schema drift is likely.
```

## Bad entry

```markdown
- Remember to check the file later.
```

The bad entry is vague, temporary, and not tied to a durable workflow.

## Empty sections

If a section is intentionally empty, write:

```markdown
_Currently empty by design._
```

This prevents validators from treating the empty section as unfinished.

## Cleanup rules

- Move completed todos to decisions only if they create durable policy.
- Delete stale or one-off entries.
- Merge duplicates.
- Date decisions.
- Keep memory short enough to scan.
