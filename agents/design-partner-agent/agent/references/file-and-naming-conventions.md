# File and Naming Conventions

Use this structure consistently when creating or updating agent files.

## Folder purposes

- `tests/`: regression checks, evaluation prompts, expected-output notes
- `scripts/`: helper utilities and transforms
- `schemas/`: structured output definitions and validation contracts
- `references/`: durable guidance, heuristics, standards, and conventions
- `examples/`: sample inputs and outputs
- `memory/`: durable working files that should persist across runs
- `templates/`: reusable scaffolds and output templates

## General naming rules

- Use lowercase kebab-case for filenames.
- Prefer descriptive names over generic names like `notes.md` or `draft.md`.
- Use suffixes that reveal purpose, such as `-template`, `-example`, `-schema`, `-guide`, or `-checklist`.
- Keep related files grouped by prefix when possible, such as `critique-`, `brief-`, `audit-`, or `handoff-`.

## File creation examples

- `templates/design-brief-template.md`
- `examples/critique-example-prioritized.md`
- `schemas/handoff-output.schema.json`
- `tests/audit-regression-check.md`
- `scripts/normalize-research-notes.py`
- `references/accessibility-review-guide.md`

## Memory file rules

- Use `memory/user-preferences.md` for durable user preferences.
- Use `memory/todos.md` for persistent action items and follow-ups.
- Only save stable, reusable information in `memory/`; do not store one-off scratch notes there.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
