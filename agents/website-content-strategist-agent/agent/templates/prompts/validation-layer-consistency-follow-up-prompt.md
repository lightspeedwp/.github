# Recurring prompt: validation-layer consistency follow-up

## Prompt

Run a broader consistency pass across this agent’s remaining validation-layer materials.

Focus on:

- other consistency notes
- test sources
- related validation references
- any supporting maintenance assets that may still reflect older routing language

Goals:

- tighten the rest of the validation layer around the current routing language
- keep all references grounded in the current attached file tree and current instructions
- identify anything stale, inconsistent, weakly evidenced, or no longer aligned with the current routing and validation model
- repair drift conservatively rather than expanding the file system unnecessarily

Requirements:

- treat the current grounded draft as the source of truth
- review attached files before relying on them
- do not invent missing files, tests, notes, validators, or reference content
- prefer updating existing files over creating overlapping new ones
- clearly separate confirmed issues from unresolved verification gaps
- if the visible file list is incomplete, say what could not be fully verified

Output expectations:

- start with a short audit summary
- list what is confirmed, what is inconsistent, and what is still unresolved
- state whether anything in the validation layer is still blocking
- if fixes are needed and are in scope, update the relevant attached files directly in the current draft

Current expectation:

- nothing in the requested routing and validation slice should be treated as blocking unless the broader pass finds new grounded issues

Language standard:

- use UK English throughout

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
