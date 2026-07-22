# Test Plan: File Schema Validation

Use this test plan to validate reusable file structure for folders that are currently attached to the agent and covered by the active validation scripts.

## Goal

Confirm that schema-backed and reusable files follow a predictable structure so the agent can create, review, and extend them consistently.

## Validation scope

Always validate these currently attached schema assets:

- `schemas/`

Also validate these folders when they are present in the attached file tree and included in the active validation pack:

- `templates/`
- `examples/`
- `memory/`

## Schemas to use

- `schemas/template-file-validation-schema.json`
- `schemas/example-file-validation-schema.json`
- `schemas/schema-file-validation-schema.json`
- `schemas/memory-file-validation-schema.json`

## Test cases

### 1. Template files

Validate each template file against the template validation schema using file metadata extracted from the markdown file.

Required checks:

- filename ends with `-template.md`
- file starts with a level-1 title
- file contains the expected reusable section headings
- placeholders are left as blanks or reusable prompts, not filled example content

Use this test only when template files are attached.

### 2. Example files

Validate each example file against the example validation schema using file metadata extracted from the markdown file.

Required checks:

- filename starts with `example-`
- file starts with a level-1 title beginning with `# Example`
- file matches a known template family or output type
- file contains filled example content, not blank placeholders
- section headings match the related template where applicable

Use this test only when example files are attached.

### 3. Schema files

Validate each schema file against the schema-file validation schema.

Required checks:

- filename ends with `-schema.json`
- schema has a non-empty `title`
- root `type` is `object`
- `properties` exists and is not empty
- use `required` when a field must always be present

Current attached schema coverage:

- `schemas/enquiry-form-schema.json`
- `schemas/site-discovery-schema.json`
- `schemas/tour-operator-plugin-audit-schema.json`
- `schemas/gravity-forms-plan-schema.json`
- `schemas/yoast-seo-audit-schema.json`
- `schemas/template-file-validation-schema.json`
- `schemas/example-file-validation-schema.json`
- `schemas/schema-file-validation-schema.json`
- `schemas/memory-file-validation-schema.json`

### 4. Memory files

Validate memory files against the memory validation schema using file metadata extracted from the markdown file.

Required checks:

- markdown filename is stable and descriptive
- file starts with a level-1 title
- file contains the required operational sections for its memory role
- file purpose matches its role: stable defaults, active work, handoff, or history

Use this test only when memory files are attached.

## Pass criteria

- Every in-scope file matches its filename convention.
- Every in-scope file includes its required top-level headings.
- Example files contain concrete sample content.
- Template files remain reusable and do not drift into filled examples.
- Schema files keep a valid object-based shape with explicit properties.
- Memory files preserve clear separation between stable preferences and active work.

## Failure guidance

- If a template contains filled example content, move that content into `examples/`.
- If an example is missing a section expected by its template family, update the example or clarify the family mapping.
- If a schema file lacks `properties` or a valid object root, fix the schema before relying on it.
- If a memory file mixes durable defaults with active tasks, split the content between the appropriate memory files once those files are attached and verified.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
