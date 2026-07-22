# Schema Customisation

Use `frontmatter.schema.yaml` to control validation without changing the script.

## What can be customised

- required fields
- optional properties
- enum values
- string patterns
- date checks
- property count limits
- unknown-field behaviour
- per-file-type overrides
- suggested defaults used in fix suggestions

## Suggested defaults

Use `suggestedDefaults` when you want the validator to generate more helpful repair suggestions.

```yaml
suggestedDefaults:
  title: Example
  status: draft
  type: guide
  version: 1.0.0
  owner: LightSpeed
```

Property-level `default` values are also supported.

## Example: tighten statuses and document types

```yaml
properties:
  status:
    type: string
    enum:
      - draft
      - review
      - approved
      - archived
  type:
    type: string
    enum:
      - guide
      - reference
      - checklist
```

## Example: merge file-type property overrides

```yaml
properties:
  tags:
    type: array
    maxItems: 20
    items:
      type: string

fileTypeOverrides:
  ".php":
    properties:
      tags:
        maxItems: 10
```

Nested `properties` overrides are merged instead of replacing the whole `properties` block.

## Example: stricter document pack with required SemVer

```yaml
required:
  - title
  - type
  - status
  - version

properties:
  version:
    type: string
    pattern: "^[0-9]+\\.[0-9]+\\.[0-9]+$"
```

## Guidance

- keep metadata rules in the schema, not in the validator code
- use per-file-type overrides only when different file classes really need different rules
- use `--fail-on-empty` when an empty scan should fail CI instead of only surfacing a warning

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
