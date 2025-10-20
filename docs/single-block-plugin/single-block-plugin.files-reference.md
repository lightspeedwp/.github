---
title: "Single Block Plugin: Required Files Reference"
version: "v1.1"
last_updated: "2025-10-17"
author: "LightSpeed Block Dev Copilot"
maintainer: "Ash Shaw"
description: "Expanded reference and instructions for all required files in a standards-compliant single-block plugin, using mustache placeholders."
type: "documentation"
---

# Required Files & Folders — Expanded Reference

All files and folders listed below **must use mustache placeholders** for project-specific values (e.g., `{{slug}}`, `{{author}}`).  
Refer to [LightSpeed Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md) for implementation details.

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

# References

- [LightSpeed Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md)
- [WordPress Block API Reference](https://developer.wordpress.org/block-editor/reference-guides/block-api/)
- [Block Plugin Guide](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/php-block.instructions.md)
- [Theme JSON Guide](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/theme-json.instructions.md)

---
