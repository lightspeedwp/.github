---
title: "Single Block Plugin: File-by-File Copilot Instructions"
version: "v1.2"
last_updated: "2025-10-17"
author: "LightSpeed Block Dev Copilot"
description: "Expanded Copilot instructions for generating and maintaining each required file in a single-block plugin, using mustache placeholders and standards."
type: "prompt"
---

# File-by-File Requirements

For each file in the block plugin scaffold:

- **Describe its purpose and standards.**
- **Include mustache placeholders for all project/meta values.**
- **Document placeholder usage in README.md and DEVELOPMENT.md.**

## Example: `block.json`
- Purpose: Block metadata (name, title, description, textdomain, etc.).
- Placeholders: `"name": "{{namespace}}/{{slug}}"`, `"title": "{{projectName}}"`, etc.

## Example: `index.js`
- Purpose: Block registration.
- Placeholders: Use `{{slug}}`, `{{namespace}}` for block name and imports.

## Example: `README.md`
- Purpose: Project documentation, setup, placeholder reference.
- Placeholders: All meta fields.

## Example: `style.scss`
- Purpose: Frontend block styles.
- Placeholders: Block selector `.wp-block-{{namespace}}-{{slug}}`.

## Example: `bin/build.sh`
- Purpose: Build script, referenced in package.json/npm.
- Placeholders: `# Build script for {{slug}}` in comments.

Continue this approach for all files in your scaffold.

---

# Placeholder Table

| Placeholder         | Example Usage               |
|---------------------|----------------------------|
| `{{slug}}`          | Filenames, block.json, PHP  |
| `{{namespace}}`     | block.json, CSS selectors   |
| `{{author}}`        | Composer/package.json, docs |
| `{{description}}`   | block.json, docs            |
| `{{license}}`       | Composer/package.json, docs |
| `{{textdomain}}`    | block.json, PHP, docs       |
| `{{version}}`       | block.json, docs            |
| `{{projectName}}`   | README.md, docs             |

---

# Guidance

- **Replace all placeholders** before distribution.
- **Document all replacements** in README.md and DEVELOPMENT.md.
- **Reference coding standards** and WP/LightSpeed documentation in all doc files.
- **Explain file purposes** and placeholder usage for contributors.

---
