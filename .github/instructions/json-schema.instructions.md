---
file_type: "instructions"
applyTo: ['**/*.json', '**/*.schema.json', '**/*.jsonc']
description: "Create, validate, and document JSON Schemas; wire them into CI."
last_updated: "2025-10-19"
version: "v1.0"
owners: ["LightSpeed Engineering"]
---

# theme.json Instructions

- Use theme.json for all color palettes, typography, spacing, and layout settings
- Follow WordPress documentation for theme.json structure
- Use named tokens for colors, font sizes, and spacing
- Avoid inline styles in block markup; use theme.json variables instead
- Test changes in both light and dark modes
- Document any custom settings or extensions

# Mission

Provide guidelines for authoring JSON Schemas, validating JSON files against them and incorporating these validations into continuous integration.

# Authoring Schemas

- Store schemas under `schemas/<domain>/<name>.schema.json`.
- Include the following top‑level keys:
  - `$id`: unique URI identifying the schema.
  - `$schema`: JSON Schema version (e.g. `"https://json-schema.org/draft/2020-12/schema"`).
  - `title`: human‑readable schema name.
  - `description`: summary of the schema’s purpose.
  - `version`: semantic version of the schema.
- Define `type`, `properties`, `required`, `additionalProperties` and provide examples using the `examples` keyword.

# Validation Workflow

- Use AJV or similar tools to validate JSON files against schemas. Add an NPM script: `"validate:json": "ajv validate -s schemas/**/*.json -d data/**/*.json --all-errors"`.
- Store validation reports in a `reports/` directory and surface them in CI.

# Viewing JSON & Schemas

- For human readability, format JSON files with Prettier or VS Code’s formatter.
- Consider generating human‑friendly documentation from schemas using tools like `json-schema-to-markdown`.

# References

- LightSpeed JSON Validation & Viewing Guide (internal)
- LightSpeed Prompt: JSON Linting & Validation (internal)
- <https://json-schema.org/draft/2020-12/schema>
