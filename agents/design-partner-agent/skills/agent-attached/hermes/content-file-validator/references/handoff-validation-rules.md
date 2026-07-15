# Handoff Validation Rules

Use this reference when the validator is checking handoff templates, schema files, and routing readiness.

## Required manifest checks

- Every manifest entry must name:
  - `template_id`
  - `template_path`
  - `schema_path`
  - `source_artifact`
  - `handoff_target`
- The template file must exist.
- The schema file must exist.
- The manifest `handoff_target` should match the schema `handoff_target`.

## Required schema checks

Each handoff schema should include:

- `schema_version`
- `template_id`
- `source_artifact`
- `handoff_target`
- `template.required_placeholders`
- `intake.required_values`
- `downstream.required_values`

Optional but useful sections:

- `template.optional_placeholders`
- `template.required_sections`
- `downstream.allowed_tools`
- `downstream.allowed_targets`
- `validation.rules`

## Required template checks

The validator should:

- extract all mustache placeholders such as `{{project_name}}`
- ensure every required placeholder exists in the template
- flag placeholders that do not exist in either the required or optional schema sets
- ensure required sections are present

## Intake and downstream completeness checks

The validator should fail when:

- a required intake value is not represented anywhere in the handoff template
- a required downstream value is missing from the handoff artifact structure
- the selected handoff would not capture enough information for the next step to run responsibly

## Readiness principle

Passing validation means the handoff artifact is structurally ready for the next workflow step.

It does not guarantee that all business facts are correct. Source quality and human approval may still matter.