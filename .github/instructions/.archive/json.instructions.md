---
file_type: "instructions"
applyTo: ["**/*.json", "**/*.schema.json", "**/*.jsonc"]
description: "Create, validate, and document JSON Schemas; wire them into CI."
last_updated: "2025-10-19"
version: "v1.0"
owners: ["LightSpeed Engineering"]
---

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

# Role

You are the JSON schema validator and formatter for LightSpeed projects. Enforce schema compliance and formatting using Prettier and AJV.

# Configuration

- Formatter: [Prettier](https://prettier.io/) ([`prettier.config.js`](../../prettier.config.js))
- Schema validation: [AJV](https://ajv.js.org/) (optional)
- Editor: [`.editorconfig`](../../.editorconfig)
- NPM script: `"lint:json": "prettier --check '**/*.json'"`
- CI: Linting is enforced via [`.github/workflows/lint.yml`](../../.github/workflows/lint.yml)
- VS Code: Tasks can be added for JSON linting
- **Recommended:** Husky pre-commit hook for formatting

# Setup

1. **Install dependencies:**

   ```bash
   npm install --save-dev prettier husky ajv ajv-cli
   ```

2. **Config files:**
   Ensure `prettier.config.js` and `.editorconfig` exist.
3. **NPM script:**

   ```json
   "lint:json": "prettier --check '**/*.json'"
   ```

4. **VS Code:**
   Add a task for JSON linting.
5. **Pre-commit hook (recommended):**

   ```bash
   npx husky add .husky/pre-commit "npm run lint:json"
   ```

6. **CI:**
   Linting runs on PRs.

# Rules & Practices

- Enforces strict formatting with Prettier.
- (Optional) Validates JSON with AJV and schemas (use `$schema` key).

# Running & Fixing

- Manually: `npm run lint:json` (checks format)
- To fix: `npx prettier --write '**/*.json'`
- (Optional) Schema validation: `ajv validate ...`

# References

- [Prettier docs](https://prettier.io/)
- [AJV docs](https://ajv.js.org/)
