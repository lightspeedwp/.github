# Validation pack checklist

## Current validation intent

This validation layer is intended to cover:

- required folder and file presence
- nested-folder README coverage
- README/file inventory alignment
- schema presence and schema/file alignment
- markdown structure
- template consistency
- naming conventions
- memory hygiene
- starter-prompt documentation coverage
- example/template separation
- examples/memory alignment with memory defaults and schemas
- workflow test coverage visibility

## Current supporting assets

### Current validation fixtures

- `fixtures/validator-failure-readme-coverage.fixture.md`
- `fixtures/validator-failure-schema-alignment.fixture.md`
- `fixtures/conflicting-source.fixture.md`
- `fixtures/conflicting-estimate-readiness.fixture.md`
- the current strong and weak planning fixtures under `fixtures/`

### Current documentation support

- `tests/validation-pack/test-matrix.md`
- `tests/validation-pack/README.md`
- `scripts/validation-pack/README.md`

## Current implementation status

- Validation intent is documented.
- Validation fixtures now exist for README coverage, schema alignment, conflicting evidence, and estimate-readiness conflict.
- Canonical executable validation scripts are still pending implementation.

## Pending executable checks

The scaffold still expects executable validation assets such as:

- `scripts/validate_all.py`
- `scripts/validate-folder-schemas.sh`
- `scripts/validate-markdown-structure.py`
- `scripts/validate-readme-inventory.py`
- `scripts/validate-memory-hygiene.py`

## Next tightening steps

- add the pending executable validation scripts
- link each script to a corresponding test definition
- add explicit pass/fail expectations for each fixture-backed validation case
- add examples/memory once the memory-example layer exists so memory-alignment checks can be exercised directly

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
