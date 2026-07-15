# Schema Validation Tests

Use this file as the canonical validation checklist for reusable files in:

- `examples/` when example files are attached
- `schemas/`
- `memory/` when memory files are attached

Run the helper script first:

`bash scripts/validate-folder-schemas.sh`

## Validation goals

- keep reusable files in the correct folders
- enforce filename and structure conventions
- require expected headings for attached example files when examples are present
- confirm schema files parse as valid JSON
- catch drift between schemas, examples, memory guidance, prompt-library guidance, and the validation documentation
- avoid overclaiming schema coverage for routed skills that do not currently have an attached schema file

## Folder coverage

This section describes the folder families the current schema validator is responsible for checking.

### `examples/`

Validate:

- filename follows the example naming convention when example files are attached
- file starts with a level-1 example title
- required headings are present for attached example files
- files contain filled example content instead of blank example stubs

### `schemas/`

Validate:

- filename ends with `-schema.json`
- file parses as valid JSON
- schema has a non-empty `title`
- root `type` is `object`
- `properties` exists and is not empty

Schema files currently in scope:

- `schemas/enquiry-form-schema.json`
- `schemas/site-discovery-schema.json`
- `schemas/template-file-validation-schema.json`
- `schemas/example-file-validation-schema.json`
- `schemas/schema-file-validation-schema.json`
- `schemas/memory-file-validation-schema.json`
- `schemas/gravity-forms-plan-schema.json`
- `schemas/yoast-audit-output-schema.json`

Current route-to-schema notes:

- `woocommerce-site-discovery` currently has `schemas/site-discovery-schema.json`
- `gravity-forms-configuration` currently has `schemas/gravity-forms-plan-schema.json`
- `yoast-auditor` currently has `schemas/yoast-audit-output-schema.json`
- other routed local skills may still be validated through documentation, prompts, tests, and instructions even when they do not currently have a dedicated attached schema file
- do not treat the absence of a dedicated accessibility schema as drift unless such a schema is later attached or explicitly added

### `memory/`

Validate:

- filename is lowercase markdown when memory files are attached
- file starts with a level-1 title
- required headings are present for attached memory files
- durable preferences stay separate from active working notes

## Pass criteria

- The helper script exits successfully.
- No required heading is missing from attached example or memory files.
- No schema file fails JSON parsing.
- No example or schema file drifts from its expected structure.
- No memory file mixes durable preferences with active task-tracking structure.
- Validation docs do not imply schema coverage that the current attached file tree does not provide.

## Failure handling

If a check fails:

- restore or add missing headings
- fix stale or mismatched example structure
- fix invalid JSON in schema files
- split mixed memory content into the correct memory files
- correct validation wording that overstates current schema coverage
- rerun `bash scripts/validate-folder-schemas.sh` until it passes

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
