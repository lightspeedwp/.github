---
title: "Single Block Plugin: Expanded File-by-File Copilot Instructions"
version: "v1.3"
last_updated: "2025-10-17"
author: "LightSpeed Block Dev Copilot"
description: "Expanded Copilot instructions for generating and maintaining each required file in a single-block plugin, including dev, test, CI, and automation files."
type: "prompt"
---

# Expanded File-by-File Requirements

For each file in the block plugin scaffold:

- **Describe its purpose and standards.**
- **Include mustache placeholders for all project/meta values.**
- **Document placeholder usage in README.md and DEVELOPMENT.md.**
- **Reference LightSpeed and WordPress coding standards.**

## Examples

### `src/edit.js`
- Purpose: Editor component for the block.
- Placeholders: Use `{{slug}}` in function names, classes, ARIA labels, i18n.
- Document: Add code comments and reference in README.md.

### `src/save.js`
- Purpose: Save component for static block output.
- Placeholders: Use block name, textdomain, etc.

### `src/render.php`
- Purpose: Render callback for dynamic blocks.
- Placeholders: Prefix function with plugin slug, use textdomain.

### `tests/unit/block.test.js`
- Purpose: Unit test for block logic.
- Placeholders: Use block name, slug, author in test names.

### `.github/workflows/lint.yml`
- Purpose: CI for linting code.
- Placeholders: Workflow name, slug, author in comments.

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
