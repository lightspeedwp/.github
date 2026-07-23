# Developer Handoff Reference

Use this file to turn audit findings into safe implementation notes.

## Handoff item format

```markdown
### [Finding title]

- Problem:
- Evidence:
- Affected locations:
- Expected output:
- Suggested implementation route:
- Risk:
- Dependencies:
- QA steps:
- Confidence:
- Owner / next route:
```

## Handoff guardrails

- Keep implementation notes tied to observed evidence.
- State when repository, admin or MCP evidence is missing.
- Do not edit generated Yoast database tables directly.
- Do not guess redirect targets.
- Do not prescribe theme architecture unless evidence supports it.
- Keep content/editorial tasks separate from developer tasks.
