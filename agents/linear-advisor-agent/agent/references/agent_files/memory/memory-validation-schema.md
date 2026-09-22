# Memory Validation Schema

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main Branch Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate PR Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges: Documentation Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges: Health Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges: Workflow Inventory Audit-OK-success.svg)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![labeling-unified](https://github.com/lightspeedwp/.github/actions/workflows/labeling-unified.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling-unified.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
[![workflow-lint](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml)
<!-- BADGES-END -->

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

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
