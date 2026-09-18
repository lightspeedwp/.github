# Schema Template Alignment Guide

Use this guide when a skill has schemas, templates, examples, or validation reports.

## Rules

- Every required schema field must have a matching template location.
- Every template placeholder must map to a schema field or a documented free-text section.
- Every example should satisfy the current template and schema.
- Optional schema fields should be clearly marked in templates.
- Repeated sections should use obvious repeat markers.
- Deprecated placeholders should be removed from templates and examples together.

## Placeholder convention

Use double braces for placeholders:

```text
{{client_name}}
{{project_goal}}
{{evidence_summary}}
```

Use this form for optional placeholders:

```text
{{optional:stakeholder_notes}}
```

## Failure examples

| Failure | Why it matters |
| --- | --- |
| Schema requires `risk_level` but template has no risk section | Output cannot satisfy schema |
| Template uses `{{client_budget}}` but schema does not allow it | Drift or unsupported data capture |
| Example uses an old heading | Reviewers copy stale structure |

## Validator expectation

`validate-template-schema-alignment.py` should flag missing required placeholders, unknown placeholders, and examples that do not contain required template sections where the pairing is declared.
