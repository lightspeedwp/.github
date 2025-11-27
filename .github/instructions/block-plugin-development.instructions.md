---
file_type: "instructions"
title: "Block Plugin Development Instructions"
description: "Comprehensive best practices and guidance for developing WordPress block plugins. This instruction set is designed to be inherited by WordPress block plugin repositories across the LightSpeedWP organisation."
applyTo: "**/*.{php,js,jsx,ts,tsx,json,css,scss}"
version: "v2.0"
last_updated: "2025-11-26"
owners: ["LightSpeedWP Team"]
tags: ["wordpress", "blocks", "gutenberg", "plugin", "development", "standards"]
domain: "wp-core"
stability: "stable"
references:
  - path: "./block-plugin/"
    description: "Block plugin specific instruction files"
  - path: "./wpcs/"
    description: "WordPress Coding Standards instruction files"
  - path: "./wpcs.instructions.md"
    description: "WordPress Coding Standards index"
  - path: "../custom-instructions.md"
    description: "Organisation-wide Copilot instructions"
---

## Overview

> ⚠️ **Scope Notice**: These instructions are intended for **WordPress block plugin
> repositories** within the `lightspeedwp` GitHub organisation. They should **not**
> be applied to the `lightspeedwp/.github` community health repository, as that
> repository does not contain WordPress plugin code.

This document provides comprehensive best practices and step-by-step guidance for
developing WordPress block plugins with a modern build process. It is designed for
maintainability, performance, accessibility, and seamless integration with the
WordPress block editor (Gutenberg).

This instruction file serves as the **main entry point** for all block plugin
development standards. It references specialised instruction files in the
`block-plugin/` subdirectory and links to the WordPress Coding Standards in the
`wpcs/` subdirectory.

---

## 📂 Related Instruction Files

### Dynamic Reference

All block plugin instruction files in this directory:

- [`block-plugin/*.instructions.md`](./block-plugin/) — All instruction files in the
  `block-plugin/` folder provide specialised guidance for WordPress block plugin
  development.

### Block Plugin Instructions Index

The following instruction files provide detailed guidance for specific aspects of block plugin development:

| File                                                                    | Purpose                                                | When to Invoke                                                  |
| ----------------------------------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------- |
| [block-json.instructions.md](./block-plugin/block-json.instructions.md) | Block metadata, attributes, variations, and transforms | When creating/editing `block.json` files or defining attributes |
| [blocks.instructions.md](./block-plugin/blocks.instructions.md)         | Core block development patterns and best practices     | When developing edit/save components or implementing supports   |
| [playwright.instructions.md](./block-plugin/playwright.instructions.md) | End-to-end testing for blocks using Playwright         | When writing E2E tests for blocks, editor, or frontend          |

---

## 🎨 WordPress Coding Standards

All block plugin development must adhere to the WordPress Coding Standards. The
following instruction files provide comprehensive guidance:

### Dynamic Reference

All WordPress Coding Standards instruction files:

- [`wpcs/*.instructions.md`](./wpcs/) — All instruction files in the `wpcs/` folder
  define WordPress-specific coding standards and best practices.

### WPCS Instructions Index

| File                                                                            | Purpose                                                     | When to Invoke                                                      |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------- |
| [wpcs.instructions.md](./wpcs.instructions.md)                                  | **Main index** for all WordPress coding standards           | Start here for an overview of all WPCS instruction files            |
| [wpcs-php.instructions.md](./wpcs/wpcs-php.instructions.md)                     | PHP coding standards (formatting, naming, security, i18n)   | When writing PHP code or registering blocks                         |
| [wpcs-javascript.instructions.md](./wpcs/wpcs-javascript.instructions.md)       | JavaScript coding standards and patterns                    | When writing edit components or JS utilities                        |
| [wpcs-css.instructions.md](./wpcs/wpcs-css.instructions.md)                     | CSS/SCSS coding standards (naming, specificity, formatting) | When styling blocks for editor or frontend                          |
| [wpcs-html.instructions.md](./wpcs/wpcs-html.instructions.md)                   | HTML markup standards and semantics                         | When creating block markup, save functions, or PHP render callbacks |
| [wpcs-accessibility.instructions.md](./wpcs/wpcs-accessibility.instructions.md) | Accessibility standards (WCAG 2.2 AA)                       | When designing block UI or output markup                            |
| [wpcs-php-docs.instructions.md](./wpcs/wpcs-php-docs.instructions.md)           | PHP inline documentation (DocBlocks)                        | When documenting PHP functions, classes, hooks, and filters         |
| [wpcs-js-docs.instructions.md](./wpcs/wpcs-js-docs.instructions.md)             | JavaScript inline documentation (JSDoc)                     | When documenting JavaScript functions, components, and modules      |

---

## 1. Plugin Structure

- **Root Files:**
  - `plugin-main-file.php` — Main plugin file with header and block registration.
  - `readme.txt` or `README.md` — Plugin documentation, usage, and build instructions.
  - `package.json` — Build scripts and dependencies.
- **Directories:**
  - `src/` — Source JS/JSX, CSS/SCSS, block.json, and other assets.
  - `build/` — Compiled JS/CSS output (never edit directly).
  - `assets/` — Images, icons, SVGs, and other static assets.

---

## 2. Build Process

- **Recommended Tools:** Use `@wordpress/scripts`, Vite, or Webpack for:
  - JS/JSX (React) transpilation and bundling
  - SCSS/SASS to CSS compilation
  - Asset optimisation (images, SVGs, fonts)
- **Workflow:**
  - Store all source files in `src/`, output to `build/`.
  - Add scripts for `build`, `dev`, `lint`, and `format` in `package.json`.
  - Use `.gitignore` to exclude `node_modules/`, `build/`, and other generated files.
  - Use Prettier, ESLint, and Stylelint for code quality.
  - Document build steps in `README.md`.

---

## 3. Block Registration

- Use `block.json` for block metadata and registration.
  See [block-json.instructions.md](./block-plugin/block-json.instructions.md) for detailed guidance.
- Register blocks in PHP using `register_block_type` and point to `build/` assets.
- Enqueue only built assets for both editor and frontend.
- Use `wp_set_script_translations` for i18n if needed.
- Only enqueue assets when the block is present on the page (conditional enqueuing).

---

## 4. Asset Handling

- Version assets using file modification time or build hash for cache busting.
- Optimise images and SVGs for icons and performance.
- Minimise JS/CSS bundle size; avoid unnecessary dependencies.

---

## 5. Coding Standards

All code must follow WordPress coding standards. Reference the dedicated instruction files:

- **PHP**: [wpcs-php.instructions.md](./wpcs/wpcs-php.instructions.md)
- **JavaScript**: [wpcs-javascript.instructions.md](./wpcs/wpcs-javascript.instructions.md)
- **CSS/SCSS**: [wpcs-css.instructions.md](./wpcs/wpcs-css.instructions.md)
- **HTML**: [wpcs-html.instructions.md](./wpcs/wpcs-html.instructions.md)

Use Prettier and ESLint for JS/JSX; Stylelint for CSS/SCSS. Add `.editorconfig` for consistent formatting and indentation.

---

## 6. Accessibility & Performance

- Use semantic HTML and ARIA attributes in block markup. See [wpcs-accessibility.instructions.md](./wpcs/wpcs-accessibility.instructions.md).
- Ensure keyboard navigation and screen reader support.
- Test with accessibility tools (axe, Lighthouse, WAVE).
- Minimise JS/CSS bundle size; avoid unnecessary dependencies.

---

## 7. Testing

- Write end-to-end tests using Playwright. See [playwright.instructions.md](./block-plugin/playwright.instructions.md).
- Test both editor and frontend rendering.
- Validate block attributes, transforms, and variations.
- Include tests for accessibility and keyboard navigation.

---

## 8. Documentation

- Document block usage, attributes, and build steps in `README.md` or `readme.txt`.
- Include instructions for installing dependencies and running the build process.
- Use inline documentation following WordPress standards:
  - PHP: [wpcs-php-docs.instructions.md](./wpcs/wpcs-php-docs.instructions.md)
  - JavaScript: [wpcs-js-docs.instructions.md](./wpcs/wpcs-js-docs.instructions.md)
- Reference the main custom instructions file:
  [custom-instructions.md](../custom-instructions.md) for project-wide standards.

---

## 9. Example Build Scripts (package.json)

```json
"scripts": {
  "dev": "wp-scripts start",
  "build": "wp-scripts build",
  "lint": "wp-scripts lint-js",
  "format": "prettier --write ."
}
```

---

## 10. External References

- [Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [@wordpress/scripts](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/)
- [Block Plugin Example](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/)
- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/)

---

## ⚠️ Important Reminders

- **Never edit built files directly.** Always keep source and build output separate.
- **This instruction set is for WordPress repositories only.** Do not apply these
  standards to the `lightspeedwp/.github` community health repository.
- **Always check for updates.** Reference the dynamic file paths above for the latest instruction files.

---

## Dynamic Reference for Additional Instructions

> For the latest and any additional instructions, always check all files in:
>
> - `.github/instructions/block-plugin/*.instructions.md` — Block plugin specific guidance
> - `.github/instructions/wpcs/*.instructions.md` — WordPress Coding Standards
> - `.github/instructions/` — All organisation instruction files
>
> This ensures you are following the most up-to-date and project-specific guidelines.
