---
title: "Single Block Plugin: File Details & Mustache Placeholders"
version: "v1.2"
last_updated: "2025-10-17"
author: "LightSpeed Block Dev Copilot"
description: "Detailed reference for each required file in a single-block WordPress plugin, including purpose, standards, mustache placeholder usage, and sample structure."
type: "documentation"
---

# Per-File Reference for Single-Block Plugin Scaffold

All files below **must use mustache placeholders** for project-specific values like `{{slug}}`, `{{author}}`, etc.  
**Document every placeholder and its replacement in your README.md and DEVELOPMENT.md.**

---

## Config & Meta Files

### `.editorconfig`
- **Purpose:** Editor settings for consistent indenting, newline, charset, etc.
- **Placeholders:** Add `# For {{slug}} plugin` in comments.
- **Best Practice:** Use 2-space for JS/SCSS, tabs for PHP per WP standards.

### `.babelrc`
- **Purpose:** Babel presets for ESNext, TypeScript, React.
- **Placeholders:** Add `// {{slug}} plugin Babel config` in comments if using JSON with comments.
- **Contents:** Use `@babel/preset-env`, `@babel/preset-typescript`, `@babel/preset-react`.

### `.browserslistrc`
- **Purpose:** Target browser configuration.
- **Placeholders:** Add `# Target browsers for {{slug}}` in comments.
- **Contents:** Start with `extends @wordpress/browserslist-config`.

### `.gitattributes`
- **Purpose:** Set export-ignore for distribution, enforce line endings.
- **Placeholders:** Add `# {{slug}}` in comments.
- **Best Practice:** Ignore config/docs/test folders from plugin ZIP.

### `.gitignore`, `.eslintignore`, `.prettierignore`, `.markdownlintignore`
- **Purpose:** Ignore files/folders for Git, linting, formatting, markdown.
- **Placeholders:** Add comment at top: `# Ignore rules for {{slug}}` as appropriate.

### `.prettierrc.js`
- **Purpose:** Prettier config, inherit WP config.
- **Placeholders:** Add comment: `// Prettier config for {{slug}}`
- **Contents:** `...require('@wordpress/prettier-config')`

### `.npmpackagejsonlintrc.json`
- **Purpose:** Enforce package.json hygiene (author, license, name).
- **Placeholders:** `"require-author": "warning", "require-license": "error", "name-format": "error"`, etc.

---

## Package & Build Files

### `package.json`
- **Purpose:** Node.js dependencies, build scripts, metadata.
- **Placeholders:** `"name": "{{slug}}"`, `"author": "{{author}}"`, `"description": "{{description}}"`, `"license": "{{license}}"`, `"version": "{{version}}"`.
- **Best Practice:** Use `wp-scripts build`, `plugin-zip`, and test/lint scripts.

### `composer.json`
- **Purpose:** PHP dependencies, scripts, metadata.
- **Placeholders:** `"name": "{{slug}}"`, `"authors": [{ "name": "{{author}}" }]`, `"description": "{{description}}"`, `"license": "{{license}}"`.
- **Best Practice:** Use `"scripts"` for `phpcs`, `phpcbf`.

### `webpack.config.js`
- **Purpose:** JS build config; fallback if not using `@wordpress/scripts`.
- **Placeholders:** Add comment: `// For {{slug}} plugin`
- **Contents:** Entry: `'./src/index.js'`, Output path: `'build'`.

### `postcss.config.js`
- **Purpose:** PostCSS plugins config.
- **Placeholders:** Add comment: `// For {{slug}} plugin`
- **Contents:** Use `@wordpress/postcss-plugins-preset`, `autoprefixer`.

### `stylelint.config.js`
- **Purpose:** CSS/SCSS linting config.
- **Placeholders:** Add comment: `// Stylelint config for {{slug}}`
- **Contents:** Extend `@wordpress/stylelint-config`.

### `playwright.config.js`
- **Purpose:** E2E test config.
- **Placeholders:** Add comment: `// Playwright config for {{slug}}`
- **Contents:** Test directory, baseURL, projects.

---

## Source Files (`src/`)

### `block.json`
- **Purpose:** Block metadata.
- **Placeholders:** `"name": "{{namespace}}/{{slug}}"`, `"title": "{{projectName}}"`, `"description": "{{description}}"`, `"category": "{{category}}"`, `"textdomain": "{{textdomain}}"`, `"version": "{{version}}"`.
- **Best Practice:** Use WP block.json schema.

### `index.js`
- **Purpose:** Block registration.
- **Placeholders:** Use `import metadata from './block.json';` and `registerBlockType(metadata.name, { ... })`
- **Best Practice:** Use functional components, hooks.

### `edit.js`, `save.js`
- **Purpose:** Block editor/save components.
- **Placeholders:** Use `{{slug}}`, `{{textdomain}}` for ARIA, i18n, CSS classes.
- **Best Practice:** Use `useBlockProps()`, accessibility, escape output.

### `style.scss`, `editor.scss`
- **Purpose:** Styles for frontend/editor.
- **Placeholders:** Use `.wp-block-{{namespace}}-{{slug}}`.
- **Best Practice:** Scope styles for block only.

### `render.php`
- **Purpose:** Dynamic block server-side render.
- **Placeholders:** Use `{{slug}}`, `{{textdomain}}` in function names, i18n.
- **Best Practice:** Escape output, document function.

---

## Documentation Files

### `README.md`
- **Purpose:** Project overview, setup, features, file structure.
- **Placeholders:** `{{projectName}}`, `{{slug}}`, `{{author}}`, `{{license}}`, `{{description}}`, `{{version}}`.
- **Best Practice:** Document all placeholders and their replacements.

### `DEVELOPMENT.md`
- **Purpose:** Dev setup, build/test instructions, placeholder replacement guide.
- **Placeholders:** All meta fields.
- **Best Practice:** Step-by-step dev environment setup and placeholder explanation.

### `USAGE.md`
- **Purpose:** End-user usage guide, block insertion/configuration.
- **Placeholders:** All meta fields.
- **Best Practice:** Include examples and troubleshooting.

### `SUPPORT.md`
- **Purpose:** How to get support, paid/free, contact info, license.
- **Placeholders:** All meta fields.

### `SECURITY.md`
- **Purpose:** Vulnerability reporting, policy, license.
- **Placeholders:** All meta fields.
- **Best Practice:** Reference WP security best practices.

### `CONTRIBUTING.md`
- **Purpose:** How to contribute, standards, PR checklist.
- **Placeholders:** All meta fields.
- **Best Practice:** Reference LightSpeed/WP standards.

### `CODE_OF_CONDUCT.md`
- **Purpose:** Community standards, enforcement guidelines.
- **Placeholders:** All meta fields.
- **Best Practice:** Adapt from WP and LightSpeed templates.

---

## VS Code & Automation

### `.vscode/extensions.json`, `.vscode/settings.json`, `.vscode/launch.json`, `.vscode/tasks.json`
- **Purpose:** Recommended extensions, workspace settings, launch/debug, and tasks.
- **Placeholders:** Add comments: `// Workspace settings for {{slug}}`
- **Best Practice:** Recommend Copilot, WP, PHP, Prettier, ESLint, Playwright, etc.

### `.husky/`, `.github/`
- **Purpose:** Git hooks for lint/test/format; GitHub workflows, PR templates.
- **Placeholders:** Comments in scripts: `# Husky hook for {{slug}}`, etc.

### `bin/build.sh`, `bin/test.sh`, `bin/install-wp-tests.sh`, `bin/update-version.js`
- **Purpose:** Build/test, WP test install, version bump scripts.
- **Placeholders:** Comments: `# Build script for {{slug}}`, etc.

---

# Mustache Placeholders Reference

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

**Always document each placeholder and its replacement.**

---

# Example: Block Metadata with Placeholders

```json
{
  "name": "{{namespace}}/{{slug}}",
  "title": "{{projectName}}",
  "category": "widgets",
  "description": "{{description}}",
  "textdomain": "{{textdomain}}",
  "version": "{{version}}",
  "editorScript": "file:./build/index.js",
  "style": "file:./build/style.css"
}
```

---

# References

- [LightSpeed Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md)
- [WordPress Block API Reference](https://developer.wordpress.org/block-editor/reference-guides/block-api/)

---
