---
title: "Single Block Plugin: File-by-File Copilot Instructions"
version: "v1.3"
last_updated: "2025-10-17"
author: "LightSpeed Block Dev Copilot"
description: "Expanded Copilot instructions for generating and maintaining each required file in a single-block plugin, including dev, test, CI, and automation files."
type: "prompt"
---

## Placeholders Table

| Placeholder         | Description / Where to Use                                  |
|---------------------|-------------------------------------------------------------|
| `{{slug}}`          | Plugin/block slug, folder names, main files, block.json     |
| `{{namespace}}`     | Block namespace, used in block.json, JS, CSS selectors      |
| `{{author}}`        | Author name(s), plugin headers, docs                        |
| `{{description}}`   | Plugin/block description, block.json, docs                  |
| `{{license}}`       | License field, plugin headers, package.json, composer.json  |
| `{{textdomain}}`    | WP text domain, PHP files, block.json                       |
| `{{version}}`       | Plugin/block version, block.json, headers, docs             |
| `{{projectName}}`   | Project/plugin name, docs                                   |

**Document every placeholder and where it's replaced in `README.md` and `DEVELOPMENT.md`.**

---

# Best Practices

- **Always use mustache placeholders** in all template files and filenames.
- **Add comments** indicating where placeholders should be replaced.
- **Reference coding standards** in doc files and code comments (link to WP/LightSpeed guides).
- **Keep all files organized** in the directory structure shown above.
- **Ensure build, test, and lint scripts work out of the box** after placeholder replacement.

---

# Guidance

- **Replace all placeholders** before distribution.
- **Document all replacements** in README.md and DEVELOPMENT.md.
- **Reference coding standards** and WP/LightSpeed documentation in all doc files.
- **Explain file purposes** and placeholder usage for contributors.

---


# File & Folder Structure Requirements


> Every file must use mustache placeholders for project-specific values and document their usage.

For each file in the block plugin scaffold:

- **Describe its purpose and standards.**
- **Include mustache placeholders for all project/meta values.**
- **Document placeholder usage in README.md and DEVELOPMENT.md.**
- **Reference LightSpeed and WordPress coding standards.**
- All files and folders listed below **must use mustache placeholders** for project-specific values (e.g., `{{slug}}`, `{{author}}`).  
- Refer to [LightSpeed Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md) for implementation details.

---

## Top-Level Project Files

| File                       | Purpose / Standards                                                                                                     | Placeholders           | Notes / Best Practices                                                        |
|----------------------------|------------------------------------------------------------------------------------------------------------------------|------------------------|--------------------------------------------------------------------------------|
| `.editorconfig`            | Ensures editor consistency.                                                                                             | `{{slug}}` in comments | Use WP/LightSpeed defaults.                                                    |
| `.eslintrc.json`/`.cjs`    | JS lint config, extend WP rules.                                                                                        | Project meta, comments | Use `@wordpress/eslint-plugin` as base.                                        |
| `.eslintignore`            | Ignore build/node_modules for linting.                                                                                  |                        |                                                                                 |
| `.babelrc`                 | Babel config for modern JS/React.                                                                                      | Project meta/comments  | Use `@wordpress/babel-preset-default`.                                         |
| `.browserslistrc`          | Target browsers, WP baseline.                                                                                           | `{{slug}}` comment     | Use `@wordpress/browserslist-config`.                                          |
| `.prettierrc.js`           | Code formatting rules.                                                                                                  | Comments/meta          | Use `@wordpress/prettier-config`.                                              |
| `.prettierignore`          | Ignore build, vendor.                                                                                                   |                        |                                                                                 |
| `.npmpackagejsonlintrc.json`| Lint rules for package.json.                                                                                           | Project meta           |                                                                                 |
| `.npmrc`                   | NPM config, enforce engines.                                                                                            | Comments/meta          |                                                                                 |
| `.markdownlint.json`       | Markdown standards config.                                                                                              |                        | Use WP/LightSpeed markdownlint rules.                                          |
| `.markdownlintignore`      | Ignore node_modules, vendor.                                                                                            |                        |                                                                                 |
| `.distignore`              | Ignore files for plugin ZIP.                                                                                            | Comments/meta          |                                                                                 |
| `.gitattributes`           | Git export-ignore, line endings.                                                                                        | Comments/meta          |                                                                                 |
| `.gitignore`               | Ignore build, node_modules, vendor, tests.                                                                              | Comments/meta          |                                                                                 |
| `.shellcheckrc`            | Shell script lint config.                                                                                               | Comments/meta          |                                                                                 |
| `.readthedocs.yaml`        | Docs build config.                                                                                                      | Comments/meta          |                                                                                 |
| `.all-contributorsrc`      | Contributor list, meta.                                                                                                | `{{author}}`, `{{slug}}`|                                                                                 |
| `package.json`             | Node.js dependencies, scripts, meta.                                                                                    | All meta fields        | See [package.json standards](https://github.com/WordPress/gutenberg/blob/trunk/package.json) |
| `composer.json`            | PHP dependencies/scripts.                                                                                               | All meta fields        | Use WP package standards.                                                      |
| `webpack.config.js`        | Build config, entry/output paths.                                                                                       | `{{slug}}`             | Use `@wordpress/scripts` if possible.                                          |
| `postcss.config.js`        | PostCSS plugins, autoprefixer.                                                                                          | `{{slug}}` comment     | Use `@wordpress/postcss-plugins-preset`.                                       |
| `stylelint.config.js`      | SCSS/CSS lint config.                                                                                                   | Comments/meta          | Extend `@wordpress/stylelint-config`.                                          |
| `playwright.config.js`     | E2E test config.                                                                                                        | Comments/meta          |                                                                                 |
| `phpunit.xml`              | PHPUnit test config.                                                                                                    | Comments/meta          |                                                                                 |
| `phpcs-baseline.xml`       | PHP lint baseline (optional).                                                                                           | Comments/meta          |                                                                                 |


---

## Source Code (`src/`)

| File                | Purpose / Standards                                                                                              | Placeholders                  | Notes / Best Practices                                |
|---------------------|------------------------------------------------------------------------------------------------------------------|-------------------------------|-------------------------------------------------------|
| `block.json`        | Block metadata: name, title, description, textdomain, etc.                                                       | All meta fields               | Use WP block.json reference.                          |
| `index.js`          | Block registration, imports metadata, registers block.                                                           | `{{slug}}`, `{{namespace}}`   | Use `registerBlockType` with metadata.                |
| `edit.js`           | Block editor React component.                                                                                    | `{{slug}}`, `{{textdomain}}`  | Use hooks, `useBlockProps`, i18n, ARIA.               |
| `save.js`           | Block save React component.                                                                                      | `{{slug}}`, `{{textdomain}}`  | Use hooks, `useBlockProps`.                           |
| `style.scss`        | Frontend block styles.                                                                                           | `{{namespace}}`, `{{slug}}`   | Scope to `.wp-block-{{namespace}}-{{slug}}`.          |
| `editor.scss`       | Editor-only styles.                                                                                              | `{{namespace}}`, `{{slug}}`   | Scope to block class.                                 |
| `render.php`        | PHP render callback for dynamic blocks.                                                                          | `{{slug}}`, `{{textdomain}}`  | Escape output, add PHPDoc, use i18n.                  |
| `__tests__/`        | Unit tests for block JS.                                                                                         |                               | Use Jest, WP preset.                                  |
| `types/`            | TypeScript type declarations (optional).                                                                         |                               | Use for TS support.                                   |

---

## Plugin Entry & Documentation

| File                   | Purpose / Standards                                                                          | Placeholders                | Notes / Best Practices                                 |
|------------------------|----------------------------------------------------------------------------------------------|-----------------------------|--------------------------------------------------------|
| `{{slug}}.php`         | Main plugin file: header/meta, block registration, hooks.                                    | All meta fields             | Use i18n, proper escaping, PHPDoc.                     |
| `README.md`            | Main docs: overview, features, setup, file structure, placeholder info.                      | All meta fields, links      | Document all placeholders and file purposes.           |
| `DEVELOPMENT.md`       | Dev setup, build/test instructions.                                                          | All meta fields             | Document how to replace placeholders.                  |
| `USAGE.md`             | End-user usage guide, examples.                                                              | All meta fields             | Reference patterns, templates.                         |
| `SUPPORT.md`           | Support channels, paid/free support, license.                                                | All meta fields             | Include contact, GitHub Issues link.                   |
| `SECURITY.md`          | Vulnerability reporting, policies, standards.                                                | All meta fields             | Reference WP security best practices.                  |
| `CONTRIBUTING.md`      | Contribution guidelines, coding standards, checklist for PRs.                                | All meta fields, links      | Reference LightSpeed and WP standards.                 |
| `CODE_OF_CONDUCT.md`   | Community/behavior standards.                                                                | All meta fields             | Use WP/LightSpeed template.                            |

---

## VS Code & Automation

| File                    | Purpose / Standards                                                                 | Placeholders                  | Notes / Best Practices                          |
|-------------------------|-------------------------------------------------------------------------------------|-------------------------------|-------------------------------------------------|
| `vscode-extensions.txt` | List of recommended VS Code extensions.                                             |                               | Include Copilot, WP, PHP, Prettier, ESLint, etc.|
| `.vscode/extensions.json`| Workspace extension recommendations.                                               | Comments/meta                 |                                                  |
| `.vscode/settings.json` | Workspace settings for formatting, linting.                                        | Comments/meta                 |                                                  |
| `.vscode/launch.json`   | Debug configuration (e.g., Xdebug for PHP).                                        | Comments/meta                 |                                                  |
| `.vscode/tasks.json`    | Workspace build/lint/test/format tasks.                                            | Comments/meta                 |                                                  |
| `.husky/`               | Git hooks for linting, formatting, testing.                                        |                               |                                                  |
| `.github/`              | GitHub workflows, PR templates, contributing templates.                            |                               |                                                  |
| `bin/build.sh`          | Build script (mustache placeholders in comments).                                  | Comments/meta                 |                                                  |
| `bin/test.sh`           | Test script (mustache placeholders in comments).                                   | Comments/meta                 |                                                  |
| `bin/install-wp-tests.sh`| Script to install WP test framework.                                              | Comments/meta                 |                                                  |
| `bin/update-version.js` | Version update script (mustache placeholders in comments).                         | Comments/meta                 |                                                  |
`

---

## Required Top-Level Files

- **Configuration:** `.editorconfig`, `.eslintrc.json`/`.cjs`, `.eslintignore`, `.babelrc`, `.browserslistrc`, `.prettierrc.js`, `.prettierignore`, `.npmpackagejsonlintrc.json`, `.npmrc`
- **Lint/Test/Dist:** `.markdownlint.json`, `.markdownlintignore`, `.distignore`, `.gitattributes`, `.gitignore`, `.shellcheckrc`, `.readthedocs.yaml`, `.all-contributorsrc`
- **Package Meta:** `package.json`, `composer.json`, `webpack.config.js`, `postcss.config.js`, `stylelint.config.js`, `playwright.config.js`, `phpunit.xml`, `phpcs-baseline.xml`

## Required Source Files (`src/`)

- `block.json`, `index.js`, `edit.js`, `save.js`, `style.scss`, `editor.scss`, `render.php`, `__tests__/`, `types/`

## Plugin & Docs

- `{{slug}}.php`, `README.md`, `DEVELOPMENT.md`, `USAGE.md`, `SUPPORT.md`, `SECURITY.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`

## VS Code & Automation

- `vscode-extensions.txt`, `.vscode/extensions.json`, `.vscode/settings.json`, `.vscode/launch.json`, `.vscode/tasks.json`
- `.husky/`, `.github/`
- `bin/build.sh`, `bin/test.sh`, `bin/install-wp-tests.sh`, `bin/update-version.js`


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
- [Block Plugin Guide](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/php-block.instructions.md)
- [Theme JSON Guide](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/theme-json.instructions.md)
- [LightSpeed Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md)
- [WordPress Block API Reference](https://developer.wordpress.org/block-editor/reference-guides/block-api/)

---
