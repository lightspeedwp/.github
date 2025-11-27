# Block Theme Instructions

## Overview

This document provides best practices and technical guidance for developing WordPress block themes, including theme.json usage, template structure, and validation.

---

## 1. theme.json

- Use [theme-json.instructions.md](https://github.com/lightspeedwp/ai-block-theme-template/blob/develop/.github/instructions/theme-json.instructions.md) for theme.json structure and best practices.
- Validate with [theme-json-validation.instructions.md](./theme-json-validation.instructions.md).

---

## 2. Templates & Parts

- Store block-based templates in `templates/` (e.g., `index.html`, `single.html`).
- Use `parts/` for reusable template parts (header, footer, sidebar).
- Use semantic HTML and ARIA attributes for accessibility.

---

## 3. Validation

- Use [theme-json-validation.instructions.md](https://github.com/lightspeedwp/ai-block-theme-template/blob/develop/.github/instructions/theme-json-validation.instructions.md) for validation steps and tools.
- Add Playwright tests for theme.json and template validation.

---

## 4. Additional Resources

- [block-theme.instructions.md](https://github.com/lightspeedwp/ai-block-theme-template/blob/develop/.github/instructions/block-theme.instructions.md)
- [theme-json.instructions.md](https://github.com/lightspeedwp/ai-block-theme-template/blob/develop/.github/instructions/theme-json.instructions.md)
- [theme-json-validation.instructions.md](https://github.com/lightspeedwp/ai-block-theme-template/blob/develop/.github/instructions/theme-json-validation.instructions.md)
