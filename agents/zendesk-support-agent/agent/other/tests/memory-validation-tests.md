# Memory validation tests

## Required checks

- only approved files exist in `memory/`
- each markdown memory file starts with the required H1
- each markdown memory file keeps one durable preference per bullet line where applicable
- `memory/report-defaults.yaml` satisfies `schemas/report-defaults.schema.json`
- `memory/user-preferences.md` satisfies `schemas/user-preferences.schema.json`
- `memory/drafting-preferences.md` satisfies `schemas/drafting-preferences.schema.json`
- `memory/todos.md` satisfies `schemas/todos.schema.json`
- memory files contain durable defaults, reusable preferences, or cross-run follow-up items only
- no ticket transcripts, URLs, raw payloads, one-off case evidence, private customer details, undocumented policy claims, or speculative root-cause notes appear in memory files
- report defaults, user preferences, drafting preferences, todo examples, and memory examples stay aligned with their schemas

## Suggested run order

1. `python scripts/validate_memory.py`
2. `python scripts/validate_memory_content.py`
3. `python scripts/validate_schema_files.py`
4. `python scripts/validate_report_defaults_keys.py`

## Policy source

Use `references/agent-memory-policy.md` as the source of truth for what memory may store, what it must not store, how memory supports future runs, and when related schemas or examples must be updated together.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
