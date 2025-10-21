---
applyTo: ['**/*.json']
description: "JSON schema validation; sorted keys where helpful."
last_updated: "2025-10-19"
version: "v1.0"
owners: ["LightSpeed Engineering"]
---

# Mission
Validate JSON files against their corresponding schemas and enforce consistent formatting.

# Linter
- Use **AJV** (`npm install --save-dev ajv ajv-cli`) for schema validation.
- Use **prettier** for consistent formatting (no trailing commas, sorted keys when appropriate).

# Setup
1. Place schemas under `schemas/` and reference them via the `$schema` key in your JSON files where supported.
2. Add an `npm` script: `"lint:json": "ajv validate --spec=draft7 --all-errors -s schemas/**/*.json -d data/**/*.json"`.

# Rules & Practices
- Always define `$id`, `$schema`, `title`, `description` and `version` in your schemas.
- Document required fields and provide examples in the schema.
- Disallow trailing commas and keep keys consistently ordered for readability.

# Running & Fixing
- Run `npm run lint:json` to validate JSON files. Review and correct any schema errors.

# References
- LightSpeed JSON Validation & Viewing Guide (internal)
- https://json-schema.org/understanding-json-schema/
