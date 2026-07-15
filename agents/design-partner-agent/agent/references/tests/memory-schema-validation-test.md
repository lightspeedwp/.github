# Memory Schema Validation Test

Use this test when checking whether files in `memory/` still follow the intended separation of concerns.

## Scope

- `memory/user-preferences.md`
- `memory/project-defaults.md`
- `memory/todos.md`
- `memory/review-history.md`
- `memory/client-engagement-template.md`
- Any future file added to `memory/`

## Validation rules

### Separation of concerns

- `user-preferences.md` must contain standing working preferences, not client-specific active tasks.
- `project-defaults.md` must contain stable LightSpeed defaults and reusable client patterns, not unfinished work.
- `todos.md` must contain active follow-ups only, not reusable defaults or completed review summaries.
- `review-history.md` must contain completed review summaries only, not open tasks or raw notes.
- `client-engagement-template.md` must remain a reusable starter rather than turning into a permanent default record.

### Content quality checks

- Memory files must prefer concise summaries over raw note dumps.
- Stable facts should be explicit; uncertain items should be marked as gaps or unconfirmed.
- Entries should be written so future runs can reuse them without reinterpreting vague notes.

## Failure signals

- Open tasks saved in review history
- Completed findings saved in todos
- Reusable client patterns mixed into user preferences
- Raw research pasted into memory without summarization
- Client engagement templates turned into catch-all notes
