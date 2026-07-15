# Validation documentation

## Purpose

Explain what the current validation layer is intended to check, what is already scaffolded, and what is still pending implementation.

## Validation intent

The current scaffold is intended to validate:

- required folder and file presence
- nested-folder README coverage
- README/file inventory alignment
- schema presence and schema/file alignment
- markdown structure
- naming conventions
- memory hygiene
- starter-prompt documentation coverage
- template consistency
- example/template separation
- examples/memory alignment with memory defaults and schemas
- test coverage visibility

## What is currently scaffolded

### Validation docs

- `scripts/validation-pack/checklist.md`
- `scripts/validation-pack/README.md`
- `tests/validation-pack/test-matrix.md`
- `tests/validation-pack/README.md`

### Validation fixtures

- `fixtures/validator-failure-readme-coverage.fixture.md`
- `fixtures/validator-failure-schema-alignment.fixture.md`
- `fixtures/mixed-input-intake.fixture.md`
- `fixtures/weak-brief.fixture.md`
- `fixtures/strong-brief.fixture.md`
- `fixtures/weak-prd.fixture.md`
- `fixtures/strong-prd.fixture.md`
- `fixtures/estimate-ready.fixture.md`
- `fixtures/not-estimate-ready.fixture.md`
- `fixtures/handoff-ready.fixture.md`
- `fixtures/weak-handoff.fixture.md`
- `fixtures/conflicting-source.fixture.md`
- `fixtures/conflicting-estimate-readiness.fixture.md`

### Current supporting scaffold

- canonical templates under `templates/`
- filled examples under `examples/templates/`
- starter memory files under `memory/defaults/`
- validation schemas under `memory/schemas/`

## What is still pending

The scaffold still expects executable validation assets such as:

- `scripts/validate_all.py`
- `scripts/validate-folder-schemas.sh`
- `scripts/validate-markdown-structure.py`
- `scripts/validate-readme-inventory.py`
- `scripts/validate-memory-hygiene.py`

The scaffold also still lacks:

- explicit standalone validation test definition files under `tests/validation-pack/`
- richer `examples/memory/` records for direct memory-alignment checks
- script-to-test linking once executable validation scripts exist

## Implementation rule

Do not claim automated validation where only documentation and fixtures exist. When a check is still documentary or planned rather than executable, say so clearly.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
