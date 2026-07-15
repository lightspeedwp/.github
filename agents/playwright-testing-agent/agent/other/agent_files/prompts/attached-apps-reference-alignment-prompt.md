# Attached Apps Reference Alignment Prompt

## Purpose

Use this recurring prompt to align app and tool references across instructions, starter prompts, README files, and validation-facing docs.

## Prompt

Audit this agent's attached app and tool references so the current instructions, docs, and prompts describe the real attached apps accurately.

Primary goal:

- verify that app labels, app purposes, and usage guidance match the real attached tool setup
- remove stale app references, stale connector wording, or misleading capability claims
- leave no blocking app-reference drift across the pack

Scope priorities:

1. instructions and starter prompts
2. validation-facing docs and README files
3. prompt-library docs where they materially affect app-reference truthfulness

Validation expectation:

- Run the documented validation entry point when validation-facing docs or file-quality assets change.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
