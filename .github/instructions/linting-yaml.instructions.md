---
applyTo: ['**/*.yml', '**/*.yaml']
description: "YAML schema-aware linting; prefer 2-space indent."
last_updated: "2025-10-19"
version: "v1.0"
owners: ["LightSpeed Engineering"]
---

# Mission
Ensure YAML files (including GitHub workflow files) are valid and follow consistent indentation and naming conventions.

# Linter
- Use **yamllint** and **JSON Schema** where applicable. Install with `pip install yamllint` or via package managers.
- For GitHub Actions workflows, use **actionlint** for deeper validation.

# Setup
1. Create a `.yamllint` configuration specifying 2‑space indentation and lower‑case keys.
2. For workflows, define JSON Schemas (if available) and validate using `ajv` or built‑in schema validators.

# Rules & Practices
- Use 2 spaces for indentation; never use tabs.
- Use kebab-case or snake_case consistently for keys.
- Quote values only when necessary (e.g. strings containing special characters).

# Running & Fixing
- Run `yamllint .github/workflows/*.yml` to check workflow files.
- Use `actionlint` (install via Homebrew or as a GitHub Action) to validate workflows and detect common mistakes.

# References
- LightSpeed YAML Frontmatter Schemas (internal)
