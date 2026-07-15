# Validation README

Use this file as the central guide for the WordPress agent's validation assets, checks, and runners.

## Primary validation runner

Run the full validation chain with:

`bash scripts/run-master-validation.sh`

This is the default validation entry point after meaningful changes to instructions, files, schemas, templates, examples, memory, validation scripts, starter prompts, short description, or app guidance.

## Included validators

### File and schema validation

- `bash scripts/validate-folder-schemas.sh`
- `python3 scripts/validate-file-naming.py`
- `python3 scripts/validate-reference-links.py`
- `python3 scripts/validate-instruction-file-consistency.py`

### App, memory, and structure consistency

- `python3 scripts/validate-app-usage-consistency.py`
- `python3 scripts/validate-memory-contents.py`
- `python3 scripts/validate-agent-structure.py`

### Presentation consistency

- `python3 scripts/validate-starter-prompts.py`
- `python3 scripts/validate-short-description-consistency.py`

## Source snapshots

These validation checks rely on current WordPress-aligned source snapshots in `tests/`:

- `tests/agent-structure-validation-source.md`
- `tests/app-usage-consistency-source.md`
- `tests/instruction-file-consistency-source.md`
- `tests/starter-prompt-consistency-source.md`
- `tests/short-description-consistency-source.md`
- `tests/schema-validation-tests.md`

Keep these snapshots aligned when the instructions, attached apps, starter prompts, short description, or validation structure changes.

## When to run validation

Run the master validator after changes to:

- instructions and instruction-linked files
- app-related guidance
- memory guidance or memory files
- templates, examples, fixtures, profiles, or schemas
- validation scripts or helper scripts
- starter prompts or short description
- file moves, renames, or support-folder changes

## QA flow references

Use these companion files alongside the validation scripts:

- `tests/master-qa-checklist.md`
- `tests/regression-checklist-master-validation.md`
- `tests/schema-validation-tests.md`
- `tests/pre-launch-qa-checklist.md`
- `tests/seo-launch-checklist.md`
- `tests/test-plan-gravity-forms.md`

## Best practice

- Prefer the master runner for broad checks.
- Refresh the source snapshots whenever the WordPress operating model changes.
- Treat validation failures as drift signals, not just script errors.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
