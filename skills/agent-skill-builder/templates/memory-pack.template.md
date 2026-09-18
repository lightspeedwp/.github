# Memory Pack Template

Use this template when a generated skill needs durable local context.

## Structure

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

## Rules

- Save only durable context.
- Date decisions.
- Keep active todos separate from completed history.
- Mark intentionally empty sections with `_Currently empty by design._`.
