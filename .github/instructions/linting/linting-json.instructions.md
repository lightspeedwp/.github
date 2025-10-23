---
file_type: "instructions"
applyTo: ["**/*.json"]
description: "Validate and format JSON files with Prettier, json schema, and automation."
last_updated: "2025-10-23"
version: "v2.0"
owners: ["LightSpeedWP Team"]
tags: ["json", "prettier", "lint", "automation"]
---

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