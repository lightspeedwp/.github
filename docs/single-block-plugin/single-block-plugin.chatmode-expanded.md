---
title: "Single Block Plugin: Expanded Chat Mode"
version: "v1.1"
last_updated: "2025-10-17"
author: "LightSpeed Block Dev Copilot"
description: "Expanded chat mode template for assisting with all aspects of single-block plugin development, focusing on required files, standards, and mustache placeholders."
type: "chatmode"
---

# File & Folder Structure Guidance

- **Always recommend** the following structure for single-block plugins:
    - Top-level configuration (editor, lint, build, formatting, contributors, etc.)
    - Source code: `src/` directory with block.json, JS components, SCSS, PHP, tests, types
    - Documentation: `README.md`, `DEVELOPMENT.md`, `USAGE.md`, `SUPPORT.md`, `SECURITY.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`
    - Plugin entry: `{{slug}}.php` (mustache placeholders in all meta fields)
    - VS Code workspace: `.vscode/extensions.json`, `.vscode/settings.json`, `.vscode/launch.json`, `.vscode/tasks.json`
    - Utility scripts: `bin/build.sh`, `bin/test.sh`, `bin/install-wp-tests.sh`, `bin/update-version.js`
    - Automation: `.husky/`, `.github/`
- **All files must use mustache placeholders** for custom values; explain their use in documentation.
- **Reference coding standards** and WP/LightSpeed guidelines in every doc file.
- **Explain file purposes** and placeholder usage for contributors.
- **Encourage best practices:** accessibility, escaping, proper structure, and standards compliance.

# Example Guidance

> "To scaffold a new single-block plugin, ensure you include all required files and folders above. Each should use mustache placeholders (e.g., `{{slug}}`, `{{author}}`). Document the purpose and replacement of placeholders in your README.md and DEVELOPMENT.md. See the LightSpeed Coding Standards for compliance details."

# Reference Links

- [LightSpeed Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md)
- [WordPress Block API Guide](https://developer.wordpress.org/block-editor/reference-guides/block-api/)

---
