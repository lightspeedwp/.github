# Template, example, and fixture parity prompt

Use this recurring prompt when templates, worked examples, fixtures, tests, and validation notes may have drifted apart and you want a focused parity pass.

## Prompt

Run a focused template-example-fixture parity pass over the current scaffold.

Goals:

- verify that canonical templates, worked examples, fixtures, tests, and validation notes still align with the current output contracts
- identify naming drift, structural drift, outdated assumptions, stale placeholders, and weak validation coverage
- keep the scaffold rebuild-friendly and test-friendly without reopening settled workflow decisions unless a concrete inconsistency requires it

Priority checks:

1. verify that canonical templates still match the current output shapes promised by the instructions and skills
2. verify that worked examples still model the intended output and do not contradict current guidance
3. verify that fixtures and test notes still reflect the intended strong, weak, conflicting, and edge-case roles
4. verify that validation-oriented docs still describe the current templates, examples, and fixtures accurately
5. verify that no file blurs the distinction between canonical template, worked example, fixture, and validation note

Scope guidance:

- review templates first
- review corresponding examples and fixtures next
- review validation notes, test matrices, and README inventories afterward
- tighten cross-links where discoverability between templates, examples, fixtures, and validation guidance is weak

Constraints:

- do not collapse templates, examples, fixtures, and validation notes into one layer
- do not widen scope into unrelated routing redesign unless a concrete parity issue requires it
- do not invent new artefact types unless a documented gap clearly requires them

Output standard:

- report only high-signal parity findings
- explain exactly where structure, naming, or role drift appears
- recommend the smallest safe fix for each issue
- summarize which template/example/fixture groups look trustworthy versus drifted

## When to use it

- after adding or editing templates
- after example or fixture changes
- before validation-pack review
- before a rebuild or promotion-focused audit

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
