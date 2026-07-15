# Validation-pack tightening prompt

Use this recurring prompt when the scaffold has evolved and you want the validation layer tightened around the current files, fixtures, examples, memory model, and routing language.

## Prompt

Run a focused validation-pack tightening pass over the current scaffold.

Goals:

- verify that validation docs, fixtures, and scripts still match the current scaffold
- verify that README coverage, schema alignment, template/example separation, and memory hygiene checks are documented clearly
- identify missing validation scripts, missing test definitions, or stale fixture assumptions

Check:

- scripts/
- tests/
- fixtures/
- memory/defaults/
- memory/schemas/
- templates/
- examples/
- references/validation-related docs when present
- rollout and rebuild docs that reference validation behaviour

Priority validation concerns:

- required folder and file presence
- nested-folder README coverage
- README/file inventory alignment
- markdown structure checks
- naming-convention checks
- memory hygiene
- schema presence and schema/file alignment
- starter-prompt documentation coverage
- template consistency
- example/template separation
- examples/memory alignment with memory defaults and schemas
- test coverage visibility

Constraints:

- do not claim automated checks that do not exist
- do not invent validators without documenting them clearly as pending
- keep negative fixtures distinct from worked examples

Output:

- list validation-layer mismatches
- list stale validation assumptions
- list missing or weak validation assets
- apply only high-signal tightening changes

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
