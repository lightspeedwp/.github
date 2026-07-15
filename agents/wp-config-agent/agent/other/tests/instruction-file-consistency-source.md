# Instruction File Consistency Source

Use this snapshot to validate that the WordPress instructions still point to the right supporting files.

## Core instruction-linked files

- `references/gravity-forms-standard.md`
- `references/file-naming-conventions.md`
- `templates/pre-launch-summary-template.md`
- `templates/site-discovery-template.md`
- `templates/gravity-forms-plan-template.md`
- `examples/example-pre-launch-summary.md`
- `examples/example-site-discovery.md`
- `schemas/enquiry-form-schema.json`
- `schemas/site-discovery-schema.json`
- `schemas/memory-entry-schema.json`
- `fixtures/README.md`
- `profiles/README.md`
- `scripts/validate-memory-contents.py`
- `scripts/validate-agent-structure.py`
- `tests/agent-structure-validation-source.md`

## Required validation references

- `tests/README.md`
- `tests/master-qa-checklist.md`
- `tests/schema-validation-tests.md`
- `tests/pre-launch-qa-checklist.md`
- `tests/seo-launch-checklist.md`
- `tests/test-plan-gravity-forms.md`
- `scripts/validate-folder-schemas.sh`

## Validation expectations

- the instructions should reference the WordPress file set that supports audits, discovery, Gravity Forms, Yoast SEO, memory, and structure validation
- instruction-linked files should stay WordPress-specific
- validation references should remain stable as the support structure evolves
- stale domain drift such as WooCommerce, tour operator, or unrelated business references should not re-enter the instruction-linked file set

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
