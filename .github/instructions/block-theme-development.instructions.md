---
file_type: "instructions"
title: "Block Theme Development Instructions"
description: "Comprehensive best practices and guidance for developing WordPress block themes. This instruction set is designed to be inherited by WordPress block theme repositories across the LightSpeedWP organisation."
applyTo: "**/*.{php,html,json,css,scss,js,jsx,ts,tsx}"
version: "v2.1"
last_updated: "2025-11-27"
owners: ["LightSpeedWP Team"]
tags:
  ["wordpress", "block-theme", "gutenberg", "theme", "development", "standards"]
domain: "block-theme"
stability: "stable"
references:
  - path: "./block-theme/"
    description: "Block theme specific instruction files"
  - path: "./wpcs/"
    description: "WordPress Coding Standards instruction files"
  - path: "./wpcs.instructions.md"
    description: "WordPress Coding Standards index"
  - path: "../custom-instructions.md"
    description: "Organisation-wide Copilot instructions"
---

## Overview

> ⚠️ **Scope Notice**: These instructions are intended for **WordPress block theme
> repositories** within the `lightspeedwp` GitHub organisation. They should **not**
> be applied to the `lightspeedwp/.github` community health repository, as that
> repository does not contain WordPress theme code.

This document provides comprehensive best practices and step-by-step guidance for
developing a modern WordPress block theme with a build process. It is designed for
maintainability, performance, accessibility, and seamless integration with the
WordPress ecosystem.

This instruction file serves as the **main entry point** for all block theme
development standards. It references specialised instruction files in the
`block-theme/` subdirectory and links to the WordPress Coding Standards in the
`wpcs/` subdirectory.

---

## 📂 Related Instruction Files

### Dynamic Reference

All block theme instruction files in this directory:

- [\`block-theme/\*.instructions.md\`](./block-theme/) — All instruction files in the
  \`block-theme/\` folder provide specialised guidance for WordPress block theme
  development.

### Block Theme Instructions Index

The following instruction files provide detailed guidance for specific aspects of block theme development:

| File                                                                                         | Purpose                                    | When to Invoke                                            |
| -------------------------------------------------------------------------------------------- | ------------------------------------------ | --------------------------------------------------------- |
| [accessibility.instructions.md](./block-theme/accessibility.instructions.md)                 | Theme-specific accessibility standards     | When developing patterns, templates, or template parts    |
| [block-theme.instructions.md](./block-theme/block-theme.instructions.md)                     | Core block theme concepts and architecture | When starting a new block theme or reviewing structure    |
| [block-theme-structure.instructions.md](./block-theme/block-theme-structure.instructions.md) | Block theme directory structure            | When setting up theme folder structure                    |
| [html-template.instructions.md](./block-theme/html-template.instructions.md)                 | HTML template syntax and structure         | When creating or editing template files in \`templates/\` |
| [json.instructions.md](./block-theme/json.instructions.md)                                   | JSON configuration standards               | When working with JSON config files                       |
| [pattern-development.instructions.md](./block-theme/pattern-development.instructions.md)     | Block pattern development workflow         | When creating reusable block patterns                     |
| [patterns.instructions.md](./block-theme/patterns.instructions.md)                           | Pattern registration and organisation      | When registering or organising patterns in \`patterns/\`  |
| [php-block.instructions.md](./block-theme/php-block.instructions.md)                         | PHP-based block rendering                  | When creating server-side rendered blocks                 |
| [theme-json-validation.instructions.md](./block-theme/theme-json-validation.instructions.md) | theme.json validation and testing          | When validating theme.json configuration                  |
| [theme-json.instructions.md](./block-theme/theme-json.instructions.md)                       | theme.json configuration standards         | When configuring global styles, settings, and typography  |

### Dynamic Reference

All WordPress Coding Standards instruction files:

- [`wpcs/*.instructions.md`](./wpcs/) — All instruction files in the `wpcs/` folder
  define WordPress-specific coding standards and best practices.

### WPCS Instructions Index

| File                                                                            | Purpose                                                     | When to Invoke                                           |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------- |
| [wpcs.instructions.md](./wpcs.instructions.md)                                  | **Main index** for all WordPress coding standards           | Start here for an overview of all WPCS instruction files |
| [wpcs-php.instructions.md](./wpcs/wpcs-php.instructions.md)                     | PHP coding standards (formatting, naming, security, i18n)   | When writing PHP code in functions.php or patterns       |
| [wpcs-javascript.instructions.md](./wpcs/wpcs-javascript.instructions.md)       | JavaScript coding standards and patterns                    | When writing JavaScript for interactive components       |
| [wpcs-css.instructions.md](./wpcs/wpcs-css.instructions.md)                     | CSS/SCSS coding standards (naming, specificity, formatting) | When styling theme components                            |
| [wpcs-html.instructions.md](./wpcs/wpcs-html.instructions.md)                   | HTML markup standards and semantics                         | When creating templates, parts, or pattern markup        |
| [wpcs-accessibility.instructions.md](./wpcs/wpcs-accessibility.instructions.md) | Accessibility standards (WCAG 2.2 AA)                       | When designing UI or output markup                       |
| [wpcs-php-docs.instructions.md](./wpcs/wpcs-php-docs.instructions.md)           | PHP inline documentation (DocBlocks)                        | When documenting PHP functions and hooks                 |
| [wpcs-js-docs.instructions.md](./wpcs/wpcs-js-docs.instructions.md)             | JavaScript inline documentation (JSDoc)                     | When documenting JavaScript functions and modules        |

---

## 1. Theme Structure

- **Root Files:**
  - `style.css` — Theme header, global styles, and required metadata.
  - `functions.php` — Enqueue assets, add theme support, register menus, and widgets.
  - `theme.json` — Block theme configuration for global styles, settings, and block support.
  - `screenshot.png` — Theme preview image (1200x900px recommended).
- **Directories:**
  - `templates/` — Block-based templates (e.g., `index.html`, `single.html`, `archive.html`, `404.html`).
  - `parts/` — Template parts (e.g., `header.html`, `footer.html`, `sidebar.html`).
  - `patterns/` — Block patterns as PHP files with block markup and metadata.
  - `assets/` — Source files for SCSS, JS, images, fonts, SVGs, etc.
  - `build/` — Compiled CSS/JS output (never edit directly).

---

## 2. Build Process

- **Recommended Tools:** Use Vite, Webpack, or `@wordpress/scripts` for:
  - SCSS/SASS to CSS compilation
  - JS/JSX (React) transpilation and bundling
  - Asset optimization (images, fonts, SVGs)
- **Workflow:**
  - Store all source files in `assets/`, output to `build/`.
  - Add a `package.json` with scripts for `build`, `dev`, `lint`, and `format`.
  - Use `.gitignore` to exclude `node_modules/`, `build/`, and other generated files.
  - Use Prettier, ESLint, and Stylelint for code quality.
  - Document build steps in `README.md`.

---

## 3. theme.json Usage

- Define color palette, typography, spacing, and block settings in `theme.json`.
- Use `theme.json` for global styles and to control editor appearance.
- Avoid hardcoding styles in PHP or CSS; prefer `theme.json` for consistency.
- See [theme-json.instructions.md](./block-theme/theme-json.instructions.md) for detailed guidance.
- Reference: [theme.json Reference](https://developer.wordpress.org/block-themes/theme-json/)

---

## 4. Asset Enqueuing

- Enqueue only built assets (from `build/`) in `functions.php`.
- Use `wp_enqueue_block_style` and `wp_enqueue_block_script` for block-specific assets.
- Version assets using file modification time or build hash for cache busting.
- Only load assets when needed (conditional enqueuing).

---

## 5. Block Patterns & Template Parts

- Store block patterns in `patterns/` as PHP files with block markup and metadata.
  See [pattern-development.instructions.md](./block-theme/pattern-development.instructions.md).
- Use `parts/` for reusable template parts (e.g., header, footer, sidebar).
- Register patterns using `register_block_pattern` and `register_block_pattern_category`.
  See [patterns.instructions.md](./block-theme/patterns.instructions.md).
- Use semantic HTML and ARIA attributes for accessibility.

---

## 6. Accessibility & Performance

- Use semantic HTML in templates and patterns.
- Ensure keyboard navigation and screen reader support.
- Optimize images and use modern formats (WebP, SVG).
- Minimize CSS/JS bundle size; load only what is needed per page.
- Test with accessibility tools (axe, Lighthouse, WAVE).

---

## 7. Coding Standards

All code must follow WordPress coding standards. Reference the dedicated files:

- **PHP**: [wpcs-php.instructions.md](./wpcs/wpcs-php.instructions.md)
- **JavaScript**: [wpcs-javascript.instructions.md](./wpcs/wpcs-javascript.instructions.md)
- **CSS/SCSS**: [wpcs-css.instructions.md](./wpcs/wpcs-css.instructions.md)
- **HTML**: [wpcs-html.instructions.md](./wpcs/wpcs-html.instructions.md)

Use Prettier and ESLint for JS/JSX; Stylelint for CSS/SCSS.
Add `.editorconfig` for consistent indentation and formatting.

---

## 8. Documentation

- Document all custom functions, build steps, and theme features in a `README.md`.
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

- [Block Themes Overview](https://developer.wordpress.org/block-themes/)
- [theme.json Reference](https://developer.wordpress.org/block-themes/theme-json/)
- [@wordpress/scripts](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/)
- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/)

---

## ⚠️ Important Reminders

- **Never edit built files directly.** Always keep source and build output separate.
- **This instruction set is for WordPress repositories only.** Do not apply these
  standards to the `lightspeedwp/.github` community health repository.
- **Always check for updates.** Reference the dynamic file paths above for the
  latest instruction files.

---

## Dynamic Reference for Additional Instructions

> For the latest and any additional instructions, always check all files in:
>
> - `.github/instructions/block-theme/*.instructions.md` — Block theme guidance
> - `.github/instructions/wpcs/*.instructions.md` — WordPress Coding Standards
> - `.github/instructions/` — All organisation instruction files
>
> This ensures you are following the most up-to-date and project-specific guidelines.
