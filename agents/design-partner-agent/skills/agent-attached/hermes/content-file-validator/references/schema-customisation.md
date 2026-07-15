# Schema customisation guide

Use `references/frontmatter.schema.yaml` as the default schema and modify only the rules your project needs.

## You can customise

- required fields
- optional fields
- enum values
- type checks
- property count limits
- unknown-field handling
- per-file-type overrides
- the semantic version pattern for `version`

## Example: add another required field

```yaml
required:
  - title
  - status
  - type
  - version
  - owner
```

## Example: allow additional document types

```yaml
properties:
  type:
    type: string
    enum:
      - template
      - guide
      - checklist
      - reference
      - prompt
      - spec
      - issue
      - qa-plan
      - runbook
      - changelog
```

## Example: loosen unknown fields temporarily

```yaml
additionalProperties: true
```

Prefer `false` for steady-state validation.

## Example: override Markdown files only

```yaml
overrides:
  "**/*.md":
    required:
      - title
      - type
      - status
      - version
      - last_reviewed
```

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
