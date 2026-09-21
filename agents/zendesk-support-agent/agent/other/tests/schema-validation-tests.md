# Schema validation tests

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
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
[![workflow-lint](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml)
<!-- BADGES-END -->

Use these validation checks when reviewing file quality in:

- `templates/`
- `examples/`
- `schemas/`
- `memory/`

## Folder coverage

### `templates/`

- required template files exist
- every template starts with the expected H1 heading
- every template includes its required section headings or required placeholder lines
- the backlog report template includes scope, backlog health, issue themes, SLA risk, escalation-ready cases, and recommended next actions sections

### `examples/`

- required example files exist
- every markdown example starts with the expected H1 heading
- every template example includes the same required section headings as its paired template
- every memory example includes its required key lines
- YAML example files are non-empty and schema-checkable
- the backlog report example matches the backlog report template section structure

### `schemas/`

- every schema file parses as valid JSON
- every schema root is an object
- every schema declares `$schema`
- every schema declares `type: object`
- every schema contains object `properties`
- every property definition includes a `type`
- `required` is an array of strings when present

### `memory/`

- only the expected memory files are present
- each markdown memory file starts with the expected H1 heading
- each markdown memory file includes its required structural headings
- `memory/report-defaults.yaml` satisfies `schemas/report-defaults.schema.json`
- `examples/memory/report-defaults.example.yaml` also satisfies the same schema
- `memory/user-preferences.md` satisfies `schemas/user-preferences.schema.json`
- `examples/memory/user-preferences.example.md` also satisfies the same schema
- `memory/drafting-preferences.md` satisfies `schemas/drafting-preferences.schema.json`
- `examples/memory/drafting-preferences.example.md` also satisfies the same schema

## Run order

1. `python scripts/run_agent_file_checks.py`
2. `python scripts/validate_templates.py`
3. `python scripts/validate_memory.py`
4. `python scripts/validate_schema_files.py`
5. `python scripts/validate_template_example_parity.py`
6. `bash scripts/validate-folder-schemas.sh`

## Pass criteria

- all required files exist
- all template and example markdown files have the expected headings
- schema files parse cleanly as JSON and satisfy the stricter structure checks
- memory files remain constrained to the approved set
- report defaults in both `memory/` and `examples/memory/` validate against the report-defaults schema
- user preferences in both `memory/` and `examples/memory/` validate against the user-preferences schema
- drafting preferences in both `memory/` and `examples/memory/` validate against the drafting-preferences schema
- the backlog report template and example pass parity checks

## Common failure points

- missing template or example files
- missing required H1 or H2 headings
- malformed JSON in `schemas/`
- schema properties missing `type`
- invalid or incomplete `report-defaults.yaml`
- invalid or incomplete user-preferences markdown entries
- invalid or incomplete drafting-preferences markdown entries
- mismatched sections between a template and its example
- unexpected files added to `memory/`

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
