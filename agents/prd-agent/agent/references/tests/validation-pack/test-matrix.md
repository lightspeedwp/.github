# Validation and workflow test matrix

## Current planned coverage

- intake workflow
- mixed-source evidence synthesis
- gap detection
- PRD generation
- PRD quality review
- estimation readiness
- estimate generation
- handoff pack readiness
- memory update logic
- validation-pack execution

## Current fixture-backed coverage signals

- `fixtures/mixed-input-intake.fixture.md` supports intake workflow coverage.
- `fixtures/weak-brief.fixture.md` and `fixtures/strong-brief.fixture.md` support planning-brief quality and readiness checks.
- `fixtures/weak-prd.fixture.md` and `fixtures/strong-prd.fixture.md` support PRD-quality and downstream-readiness checks.
- `fixtures/estimate-ready.fixture.md`, `fixtures/not-estimate-ready.fixture.md`, and `fixtures/conflicting-estimate-readiness.fixture.md` support estimate-readiness and estimation-decision checks.
- `fixtures/handoff-ready.fixture.md` and `fixtures/weak-handoff.fixture.md` support handoff-readiness checks.
- `fixtures/conflicting-source.fixture.md` supports evidence-discipline and contradiction handling.
- `fixtures/validator-failure-readme-coverage.fixture.md` and `fixtures/validator-failure-schema-alignment.fixture.md` support validation-pack negative coverage.

## Current implementation status

- The fixture layer now covers several strong, weak, conflicting, and validator-failure cases.
- The explicit executable test definitions and validation scripts are still incomplete.
- Memory-example-backed tests remain pending until the examples/memory layer is built out further.

## Next implementation steps

- add one explicit test definition for each workflow and validation concern
- define pass and fail expectations for each fixture-backed case
- link each test case to the relevant validation script once the executable scripts exist
- extend coverage to examples/memory once that example layer is populated
