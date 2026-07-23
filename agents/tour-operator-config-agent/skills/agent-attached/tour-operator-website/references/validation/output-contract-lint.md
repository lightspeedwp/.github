# Output contract linting

Use this checklist when changing output templates, acceptance criteria, issue templates, or client-facing language.

## Markdown structure checks

- No duplicated headings caused by pasted template blocks.
- Code fences are balanced.
- Template placeholders are clear and not accidentally filled with invented facts.
- Client-safe wording is separate from internal notes.
- Acceptance criteria use observable results, not vague intentions.
- Issue drafts include evidence, risk, acceptance criteria and verification.

## Safety checks

- No template claims that JSON-LD is implemented by default.
- No template treats extension-facing references as core ownership.
- No template promises rich results, rankings, availability, bookings, prices, ratings or compliance outcomes.
- No template asks agents to expose credentials, raw dumps or private customer data.

## Recommended local check

Run:

```bash
python3 scripts/validate_output_contracts.py .
```

This catches common packaging mistakes. It does not replace human review or the platform skill validator.
