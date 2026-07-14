# fixtures/

## Purpose
Store fixed input fixtures used by workflow tests and validation checks, including strong, weak, conflicting, and intentionally failing cases.

## Current files in this folder
- `mixed-input-intake.fixture.md` — mixed-source intake input for intake routing and gap-finding.
- `weak-brief.fixture.md` — weak planning brief for review and escalation tests.
- `strong-brief.fixture.md` — strong planning brief for progression tests.
- `weak-prd.fixture.md` — weak PRD for estimate-readiness refusal tests.
- `strong-prd.fixture.md` — strong PRD for PRD-quality and downstream-planning tests.
- `estimate-ready.fixture.md` — planning pack that is strong enough for estimate generation.
- `not-estimate-ready.fixture.md` — planning pack that should not proceed to estimation.
- `handoff-ready.fixture.md` — planning pack suitable for handoff-pack generation.
- `weak-handoff.fixture.md` — planning pack that looks handoff-ready too early.
- `conflicting-source.fixture.md` — conflicting-source evidence pack for fact-discipline and contradiction handling.
- `conflicting-estimate-readiness.fixture.md` — mixed estimate-readiness signals for readiness review.
- `validator-failure-readme-coverage.fixture.md` — negative fixture for README coverage and inventory-alignment failures.
- `validator-failure-schema-alignment.fixture.md` — negative fixture for schema presence and schema/file alignment failures.

## Naming conventions
- Use lowercase kebab-case.
- End fixture files with `.fixture.md`.
- Use prefixes like `strong-`, `weak-`, `conflicting-`, or `validator-failure-` to make the fixture intent obvious.
- Keep each fixture focused on one testable workflow or validation condition.

## Important distinction
Fixtures are test and validation inputs. They are not canonical templates and they are not polished worked examples. If a file exists to demonstrate output quality, it belongs in `examples/`; if it exists to exercise workflow or validation behaviour, it belongs here.
