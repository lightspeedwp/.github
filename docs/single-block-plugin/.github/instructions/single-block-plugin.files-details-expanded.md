---
title: "Single Block Plugin: Expanded File Details & Mustache Placeholders"
version: "v1.3"
last_updated: "2025-10-17"
author: "LightSpeed Block Dev Copilot"
description: "Expanded reference for all files required in a single-block plugin, including dev, test, CI, and automation files. Covers purpose, standards, placeholder usage, and documentation."
type: "documentation"
---

# Expanded File Reference for Single-Block Plugin Scaffold

**Every file should use mustache placeholders** for values like `{{slug}}`, `{{author}}`, `{{namespace}}`, etc.  
**Document all placeholders and their replacements** in both `README.md` and `DEVELOPMENT.md`.

---

## Source & Block Files

### `src/edit.js` & `src/save.js`
- **Purpose:** Block editor and save components.
- **Placeholders:** Use `{{slug}}`/`{{namespace}}` in component name, className, ARIA/i18n attributes.
- **Best Practice:** Use `useBlockProps()` for accessibility; comment on props and escaped output.
- **Document:** How placeholders map to block.json and CSS.

### `src/render.php` (for dynamic blocks)
- **Purpose:** Server-side render callback.
- **Placeholders:** Function name, textdomain, block name, etc. (`create_block_{{slug}}_render`).
- **Best Practice:** Escape all output, use translations, comment business logic.

### `src/style.scss` & `src/editor.scss`
- **Purpose:** Frontend/editor styles scoped to block.
- **Placeholders:** Use `.wp-block-{{namespace}}-{{slug}}` for selector.
- **Best Practice:** Scope styles tightly, document placeholder in the file.

---

## Tests

### `tests/unit/` & `tests/e2e/`
- **Purpose:** Unit and end-to-end tests for block functionality.
- **Placeholders:** Use block name, slug, author in test descriptions.
- **Best Practice:** Use `@wordpress/scripts` for JS tests, Playwright for E2E. Comment why each test exists.

### `jest.config.js` / `playwright.config.js`
- **Purpose:** JS and E2E test runner configs.
- **Placeholders:** Add comments like `// Jest config for {{slug}}`.
- **Best Practice:** Document test patterns and coverage in DEVELOPMENT.md.

### `phpunit.xml`
- **Purpose:** PHP unit test config.
- **Placeholders:** Suite name, directory comments, etc.
- **Best Practice:** Keep exclusions updated. Explain placeholder mapping in DEVELOPMENT.md.

---

## CI & Automation

### `.github/workflows/`
- **Purpose:** GitHub Actions for lint,test,build,release.
- **Placeholders:** Workflow name, referenced plugin slug, author, etc.
- **Best Practice:** Comment on job steps and placeholder usage.

### `.husky/`
- **Purpose:** Git hooks for linting, formatting, tests.
- **Placeholders:** Comments with `# Husky hook for {{slug}}`.
- **Best Practice:** Document hooks in DEVELOPMENT.md.

### `bin/`
- **Purpose:** Shell/scripts for build, test, install.
- **Placeholders:** Script header comments (`# Build script for {{slug}}`).
- **Best Practice:** Explain script purpose and placeholder logic.

---

## VSCode

### `.vscode/settings.json`, `.vscode/extensions.json`
- **Purpose:** Recommended editor settings and extensions.
- **Placeholders:** Add comments: `// VSCode settings for {{slug}}`.
- **Best Practice:** Document recommended extensions for block development.

---

## Documentation & Standards

### `README.md`
- **Purpose:** Project overview, setup, placeholder table.
- **Placeholders:** All meta fields (`{{slug}}`, `{{projectName}}`, etc.).
- **Best Practice:** Include a table mapping placeholders to final values.

### `DEVELOPMENT.md`
- **Purpose:** Dev setup, build/test, placeholder mapping.
- **Placeholders:** All meta fields.
- **Best Practice:** Step-by-step dev environment and placeholder replacement guide.

### `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `SUPPORT.md`, `USAGE.md`
- **Purpose:** Contribution guidelines, community standards, support, usage instructions.
- **Placeholders:** Meta fields in headers and content.
- **Best Practice:** Reference LightSpeed and WP standards.

---

## Example: Mustache Placeholders Table

| Placeholder         | Example Usage               | Description                    |
|---------------------|----------------------------|--------------------------------|
| `{{slug}}`          | Filenames, block.json      | Plugin/block unique identifier |
| `{{namespace}}`     | block.json, CSS selectors  | JS/PHP namespace prefix        |
| `{{author}}`        | Composer/package.json, docs| Author name                    |
| `{{description}}`   | block.json, docs           | Plugin description             |
| `{{license}}`       | Composer/package.json, docs| License type                   |
| `{{textdomain}}`    | block.json, PHP, docs      | WP i18n textdomain             |
| `{{version}}`       | block.json, docs           | Plugin/block version           |
| `{{projectName}}`   | README.md, docs            | Human-readable title           |

---

## How to Document Placeholders

- List all placeholders in `README.md` with sample replacements.
- In `DEVELOPMENT.md`, show how to replace placeholders during scaffolding or release.
- Add comments in each file referencing which placeholders are used.
- For scripts and configs, always add a header comment about placeholder logic.

---

## References

- [LightSpeed Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md)
- [WordPress Block API Reference](https://developer.wordpress.org/block-editor/reference-guides/block-api/)
- [LightSpeed Block Plugin Instructions](https://github.com/lightspeedwp/.github/tree/master/.github/instructions)

---
