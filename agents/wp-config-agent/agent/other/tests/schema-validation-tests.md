# Schema Validation Tests

Use this file as the human-readable checklist for schema and structure validation across the WordPress agent support files.

## Covered schema files

- `schemas/enquiry-form-schema.json`
- `schemas/site-discovery-schema.json`
- `schemas/template-file-validation-schema.json`
- `schemas/example-file-validation-schema.json`
- `schemas/schema-file-validation-schema.json`
- `schemas/memory-file-validation-schema.json`
- `schemas/memory-entry-schema.json`

## Covered folders

- `templates/`
- `examples/`
- `schemas/`
- `memory/`
- `fixtures/`
- `profiles/`

## Required checks

- filenames match the expected conventions
- required headings remain present in reusable Markdown files
- example files stay populated, not blank templates
- JSON schema files parse correctly and expose object properties
- memory files remain separated by purpose
- support folders needed by the WordPress operating model still exist

## Validation runners

- `bash scripts/validate-folder-schemas.sh`
- `python3 scripts/file-schema-validator.py`
- `python3 scripts/validate-memory-contents.py`
- `python3 scripts/validate-agent-structure.py`

## WordPress-specific drift checks

- no WooCommerce-only or tour-operator language should appear unless the agent scope is intentionally expanded later
- Gravity Forms and Yoast SEO support assets should remain represented in the validation model
- memory validation should stay aligned with WordPress project continuity rather than generic task storage

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
