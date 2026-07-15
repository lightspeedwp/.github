# Validation test coverage

## Purpose

Describe how the current fixture set maps to the validation layer and workflow-test expectations.

## Current fixture-backed coverage

- `fixtures/mixed-input-intake.fixture.md` -> intake workflow and gap-finding
- `fixtures/weak-brief.fixture.md` -> weak brief review and escalation
- `fixtures/strong-brief.fixture.md` -> strong brief progression
- `fixtures/weak-prd.fixture.md` -> PRD quality failure and estimate-readiness refusal
- `fixtures/strong-prd.fixture.md` -> PRD quality success and downstream progression
- `fixtures/estimate-ready.fixture.md` -> estimate-pack generation
- `fixtures/not-estimate-ready.fixture.md` -> estimate-readiness refusal
- `fixtures/handoff-ready.fixture.md` -> handoff-readiness success
- `fixtures/weak-handoff.fixture.md` -> handoff-readiness refusal or caution
- `fixtures/conflicting-source.fixture.md` -> contradiction handling and evidence discipline
- `fixtures/conflicting-estimate-readiness.fixture.md` -> estimate-readiness conflict handling
- `fixtures/validator-failure-readme-coverage.fixture.md` -> README coverage and inventory-alignment failures
- `fixtures/validator-failure-schema-alignment.fixture.md` -> schema presence and schema/file alignment failures

## Coverage strengths

- strong vs weak planning artefact pairs now exist for briefs, PRDs, estimates, and handoff readiness
- explicit negative fixtures exist for README coverage and schema-alignment validation
- contradiction and conflict handling now have dedicated fixtures

## Coverage gaps still open

- no fixture-backed examples/memory validation yet
- no explicit executable test files that bind fixtures to script outputs yet
- no documented pass/fail matrix per executable validator yet

## Expected next tightening steps

- add executable validation scripts
- add explicit validation test definition files under `tests/validation-pack/`
- extend the fixture layer once `examples/memory/` is populated
- link each executable validator to the fixtures it should pass or fail against

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
