---
title: "Single Block Plugin: File-by-File Chat Mode"
version: "v1.2"
last_updated: "2025-10-17"
author: "LightSpeed Block Dev Copilot"
description: "Expanded chat mode template for assisting with each file in single-block plugin development, focusing on purpose, standards, and placeholder usage."
type: "chatmode"
---

# File-by-File Guidance

- **For each file**, explain its purpose, standards, and what placeholders (e.g. `{{slug}}`, `{{author}}`) must be used in both content and comments.
- **Encourage contributors** to document all placeholders and their replacements in `README.md` and `DEVELOPMENT.md`.
- **Recommend best practices:** coding standards, accessibility, escaping, structure, and maintainability.
- **Reference** [LightSpeed Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md) and WordPress Block API documentation for detail.

# Example Guidance

> "`block.json` defines your block's metadata. Use mustache placeholders for all meta fields (`{{namespace}}/{{slug}}`, `{{projectName}}`, etc.). Document each placeholder in your README.md, explaining how and where it's replaced."

> "For SCSS files, scope your selectors to `.wp-block-{{namespace}}-{{slug}}` and document the placeholder usage."

---
