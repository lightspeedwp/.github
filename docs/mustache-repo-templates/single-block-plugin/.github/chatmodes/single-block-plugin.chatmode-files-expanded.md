---
title: "Single Block Plugin: Expanded File-by-File Chat Mode"
version: "v1.3"
last_updated: "2025-10-17"
author: "LightSpeed Block Dev Copilot"
description: "Expanded chat mode template for assisting with each file in single-block plugin development, focusing on purpose, standards, and placeholder usage."
type: "chatmode"
---

# Expanded File-by-File Guidance

- **For each file**, explain its purpose, standards, and what placeholders (e.g. `{{slug}}`, `{{author}}`) must be used in both content and comments.
- **Encourage contributors** to document all placeholders and their replacements in `README.md` and `DEVELOPMENT.md`.
- **Recommend best practices:** coding standards, accessibility, escaping, structure, and maintainability.
- **Reference** [LightSpeed Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md) and WordPress Block API documentation for detail.
- **For tests and automation**, explain how placeholder mapping ensures maintainability across environments.

# Example Guidance

> "`src/edit.js` provides the block's editor UI. Use mustache placeholders for block class names, ARIA, and i18n calls, like `{{slug}}`, `{{namespace}}`. Document their usage and replacement in README.md and DEVELOPMENT.md."

> "`tests/unit/block.test.js` should use the block name and slug in test descriptions and imports, ensuring maintainable tests when scaffolding new blocks."

---
