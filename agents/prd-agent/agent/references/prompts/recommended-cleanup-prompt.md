# Recommended cleanup prompt

Use this recurring prompt when the scaffold has advanced and you want a broader consistency pass without reopening already-settled routing or validation decisions.

## Prompt

Run a broader cleanup and consistency pass over the remaining scaffold.

Goals:

- tighten any lingering consistency notes, README inventories, reference docs, tests, examples, fixtures, or validation-oriented files so they align with the current routing language and rebuild model
- preserve the current routing and validation decisions unless a real inconsistency requires a correction
- do not reopen or replace the accepted routing/validation slice unless you find a concrete mismatch
- prioritize trustworthiness, inventory alignment, naming consistency, and test/fixture usefulness

Scope guidance:

- review remaining folder READMEs for file inventory drift
- review examples, fixtures, tests, and validation notes for naming or purpose drift
- review docs and references for stale references to older routing language
- tighten cross-links where discoverability is weak
- improve validation-layer clarity where files imply checks that are not yet clearly documented

Constraints:

- do not invent replacement skills
- do not silently rename parity-tracked skills
- do not claim full parity where exact-name gaps still remain unresolved
- do not undo the accepted distinction between canonical templates, worked examples, fixtures, memory defaults, and memory schemas

Output standard:

- make only high-signal cleanup changes
- keep the scaffold auditable and rebuild-friendly
- summarize exactly what was tightened and why

## When to use it

- after multiple scaffold additions
- after parity or routing updates
- before a handoff or validation-focused review
- whenever README/file inventory alignment may have drifted

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
