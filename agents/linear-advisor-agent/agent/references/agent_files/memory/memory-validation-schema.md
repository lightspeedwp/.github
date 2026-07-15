# Memory Validation Schema

Use this schema to validate the structure and value constraints for the agent's Memory files.

## `skill-intake-state.yaml`

```yaml
schema:
  type: object
  additionalProperties: false
  required:
    - default_workflow_type
    - last_confirmed_at
  properties:
    default_workflow_type:
      type: string
      enum:
        - triage
        - planning
        - customer-analysis
        - status-updates
        - documentation
        - handoffs
        - workflow-audit
        - custom
    last_confirmed_at:
      type: string
      pattern: '^\\d{4}-\\d{2}-\\d{2}$'
    notes:
      type: string
      maxLength: 240
```

## `skill-factory-preferences.yaml`

```yaml
schema:
  type: object
  additionalProperties: false
  required:
    - default_package_shape
    - preferred_validation_level
    - markdown_output_profile
    - last_updated_at
  properties:
    default_package_shape:
      type: string
      enum:
        - full skill package
        - draft SKILL.md
        - structured audit
    preferred_validation_level:
      type: string
      enum:
        - lightweight
        - standard
        - production-ready
    markdown_output_profile:
      type: string
      enum:
        - standard factory layout
        - compact audit layout
        - copy-paste heavy layout
        - custom
    include_copy_paste_sections:
      type: boolean
    prefer_reference_files:
      type: boolean
    last_updated_at:
      type: string
      pattern: '^\\d{4}-\\d{2}-\\d{2}$'
```

## `skill-factory-todos.md`

```yaml
schema:
  type: markdown_checklist
  rules:
    title_must_equal: '# Skill factory follow-up'
    item_prefix: '- [ ] '
    max_items: 50
    max_item_length: 160
```

## `lightspeed-conventions.md`

```yaml
schema:
  type: markdown_sections
  rules:
    required_top_heading: '# LightSpeed conventions'
    allowed_h2_sections:
      - Naming
      - Packaging
      - Validation
      - Output
      - Workflow rules
      - Source usage
    max_section_count: 8
    max_line_length: 240
```

## Validation rules

- Reject unknown keys in YAML files unless the user explicitly asks to extend the schema.
- Prefer enums for stable defaults where possible.
- Keep free-text notes short and durable.
- Use ISO-style `YYYY-MM-DD` dates for confirmation and update fields.
- Remove outdated values instead of keeping competing defaults.
- Treat this schema as the validation reference for Memory hygiene, not as user-facing output requirements.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
