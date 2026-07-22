# Schema Validation Tests

Use this file as the canonical validation checklist for reusable files that are currently attached and in scope for the active validation pack.

## Current baseline scope

Always treat `schemas/` as in scope.

Treat these folders as in scope only when they are present in the attached file tree:

- `templates/`
- `examples/`
- `memory/`

Run the helper script first:

`bash scripts/validate-folder-schemas.sh`

The helper script now skips `templates/`, `examples/`, or `memory/` when those folders are not present in the current attached file tree.

## Validation goals

- keep reusable files in the correct folders
- enforce filename and structure conventions
- require expected headings for each known template and example file when those files are attached
- confirm schema files parse as valid JSON
- catch drift between templates, examples, schemas, and memory files when those assets are part of the current file tree

## Folder coverage

### `templates/`

Validate:

- filename follows the template naming convention
- file starts with a level-1 title
- required headings are present for each template file
- template content remains reusable and does not become a filled worked example

Use this section only when template files are attached.

### `examples/`

Validate:

- filename follows the example naming convention
- file starts with a level-1 example title
- required headings are present for each example file
- files contain filled example content instead of blank placeholders

Use this section only when example files are attached.

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
- `schemas/tour-operator-plugin-audit-schema.json`
- `schemas/gravity-forms-plan-schema.json`
- `schemas/yoast-seo-audit-schema.json`
- `schemas/template-file-validation-schema.json`
- `schemas/example-file-validation-schema.json`
- `schemas/schema-file-validation-schema.json`
- `schemas/memory-file-validation-schema.json`

### `memory/`

Validate:

- filename is lowercase markdown
- file starts with a level-1 title
- required headings are present for each known memory file
- durable preferences stay separate from active working notes

Use this section only when memory files are attached.

## Pass criteria

- The helper script exits successfully.
- No required heading is missing for the attached files currently in scope.
- No schema file fails JSON parsing.
- No attached template or example file drifts from its expected structure.
- No attached memory file mixes durable preferences with active task-tracking structure.

## Failure handling

If a check fails:

- restore or add missing headings
- move example content out of templates
- fix invalid JSON in schema files
- split mixed memory content into the correct memory files when those files are attached
- rerun `bash scripts/validate-folder-schemas.sh` until it passes

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
