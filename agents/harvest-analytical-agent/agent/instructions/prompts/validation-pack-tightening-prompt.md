# Validation-Pack Tightening Prompt

Use this recurring prompt when the validation pack needs a broader tightening pass so validators, tests, notes, and related references stay aligned with the current instructions and file tree.

## Prompt

Audit and tighten this agent's validation pack so the validators, validation notes, tests, and related references remain consistent with the current instructions, attached files, and folder structure.

Scope:

- validator scripts and validation notes
- validation-oriented tests and fixtures
- validation templates, schemas, examples, and references where they materially support the validation layer
- nearby maintenance files that define validation order, severity, or reporting expectations

Primary goal:

- reduce drift across the validation pack without widening into unrelated product, reporting, or feature changes

Working rules:

1. Use the current attached file tree as the source of truth.
2. Tighten the validation pack conservatively: prefer targeted fixes over large rewrites.
3. Keep validator names, file references, test sources, templates, schemas, and severity wording aligned.
4. Update nearby maintenance notes when they materially affect validation correctness.
5. Do not invent missing validators, files, folders, templates, schemas, examples, or runtime behaviour.
6. Preserve existing behaviour unless an update is needed to remove contradiction, stale wording, or misleading validation guidance.
7. Keep all audit and maintenance language in plain UK English.

Specific checks:

- confirm validator documentation matches the validator scripts that actually exist
- confirm validation tests still match the current instruction language and current file references
- remove stale references to old folders, memory paths, renamed references, or outdated examples
- align validation severity wording, validation order, and report-format notes across the pack
- tighten any test or note that would leave the validation layer misleading, incomplete, or harder to maintain
- flag out-of-scope issues rather than folding unrelated cleanup into this pass

Deliverables:

1. A short validation-pack audit summary.
2. The exact files updated.
3. A concise list of the main validation inconsistencies corrected.
4. A short note on anything left out because it was outside validation-pack scope.

Success condition:

- the validation pack is coherent, current, and aligned with the agent's present instructions and attached file tree

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
