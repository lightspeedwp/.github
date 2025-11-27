# theme.json Instructions

## Overview

This document provides guidance for creating and maintaining `theme.json` files for WordPress block themes.

---

## 1. Structure

- Follow the [WordPress theme.json schema](https://developer.wordpress.org/block-themes/theme-json/).
- Required sections: `version`, `settings`, `styles`, `customTemplates`, `templateParts`.
- Use consistent naming and structure for settings and styles.

---

## 2. Best Practices

- Use global styles and settings for color, typography, spacing, and layout.
- Avoid hardcoding styles in CSS or PHP; prefer `theme.json` for consistency.
- Validate with [theme-json-validation.instructions.md](./theme-json-validation.instructions.md).

---

## 3. References

- [theme-json.instructions.md](https://github.com/lightspeedwp/ai-block-theme-template/blob/develop/.github/instructions/theme-json.instructions.md)
- [theme-json-validation.instructions.md](https://github.com/lightspeedwp/ai-block-theme-template/blob/develop/.github/instructions/theme-json-validation.instructions.md)
