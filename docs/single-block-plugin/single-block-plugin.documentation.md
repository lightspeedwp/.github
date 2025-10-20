---
title: "LightSpeed Single Block Plugin: Documentation & Instructions"
version: "v1.0"
last_updated: "2025-10-17"
author: "LightSpeed Block Dev Copilot"
maintainer: "Ash Shaw"
description: "Canonical documentation for scaffolding and customizing a standards-compliant single-block WordPress plugin. All files must use mustache placeholders."
tags: ["lightspeed","wordpress","block-plugin","documentation","template"]
type: "documentation"
---

# Directory & File Structure — Requirements and Guidance

Every single-block plugin must use the following structure. **All files and folders should use mustache placeholders for project-specific values (e.g., `{{slug}}`, `{{namespace}}`, `{{author}}`).**

## Top-Level Files

| File                      | Purpose / Guidance                                                                                             | Mustache Placeholders                 |
|---------------------------|---------------------------------------------------------------------------------------------------------------|---------------------------------------|
| `.editorconfig`           | Editor settings, enforce consistent coding style across contributors.                                          | Comments referencing `{{slug}}`       |
| `.eslintrc.json`/`.cjs`   | JavaScript linting configuration. Extend WP/LightSpeed rules.                                                  | Project name, slug in comments        |
| `.eslintignore`           | List of files/folders to ignore for linting.                                                                  |                                       |
| `.babelrc`                | Babel config, ensure modern JS/React syntax.                                                                  | Comments with `{{author}}`/`{{slug}}` |
| `.browserslistrc`         | Target browser config, must extend WP config.                                                                 | Comments with `{{slug}}`              |
| `.prettierrc.js`          | Code formatting config, based on WP defaults.                                                                 | Comments with `{{slug}}`              |
| `.prettierignore`         | Ignore files for Prettier formatting.                                                                         |                                       |
| `.npmpackagejsonlintrc.json` | NPM package.json lint rules for repo hygiene.                                                             | Project name, author, license         |
| `.npmrc`                  | NPM settings, enforce strict engines and exact versions.                                                      | Comments with `{{slug}}`              |
| `.markdownlint.json`      | Markdown standards config.                                                                                    |                                       |
| `.markdownlintignore`     | Ignore rules for markdown linting.                                                                            |                                       |
| `.distignore`             | Exclude files from plugin/theme ZIP distributions.                                                            | Comments with `{{slug}}`              |
| `.gitattributes`          | Set git file handling and export-ignore.                                                                      | Comments with `{{slug}}`              |
| `.gitignore`              | Ignore build, dependency, and local dev artifacts.                                                            | Comments with `{{slug}}`              |
| `.shellcheckrc`           | Shell script linting config.                                                                                  | Comments with `{{slug}}`              |
| `.readthedocs.yaml`       | Read the Docs build config.                                                                                   | Comments with `{{slug}}`              |
| `.all-contributorsrc`     | Contributors config. List contributors, project meta.                                                         | `{{projectName}}`, `{{author}}`       |
| `package.json`            | JS scripts, dependencies, and project metadata.                                                               | All meta fields are mustache          |
| `composer.json`           | PHP dependencies and scripts.                                                                                 | All meta fields are mustache          |
| `webpack.config.js`       | JS build configuration, entry/output paths reference `{{slug}}`.                                              | `{{slug}}`, comments                  |
| `postcss.config.js`       | PostCSS plugins, block slug in comments.                                                                      | `{{slug}}`                            |
| `stylelint.config.js`     | CSS/SCSS linting configuration, extend WP stylelint config.                                                   | Comments with `{{slug}}`              |
| `playwright.config.js`    | E2E testing config, block slug in comments.                                                                   | `{{slug}}`                            |
| `phpunit.xml`             | PHPUnit test config.                                                                                          | Comments with `{{slug}}`              |
| `phpcs-baseline.xml`      | PHP linting baseline (optional).                                                                              | Comments with `{{slug}}`              |

## Source Files (`src/`)

| File              | Purpose / Guidance                                                           | Mustache Placeholders                 |
|-------------------|-----------------------------------------------------------------------------|---------------------------------------|
| `block.json`      | Block metadata: name, title, description, category, textdomain, etc.         | All block meta values                 |
| `index.js`        | Block registration, imports metadata, uses slug and namespace.                | `{{slug}}`, `{{namespace}}`           |
| `edit.js`         | Block editor component, uses textdomain, slug, ARIA, i18n.                   | `{{slug}}`, `{{textdomain}}`          |
| `save.js`         | Block save component, uses textdomain, slug.                                 | `{{slug}}`, `{{textdomain}}`          |
| `style.scss`      | Frontend styles, selectors use `.wp-block-{{namespace}}-{{slug}}`.           | `{{namespace}}`, `{{slug}}`           |
| `editor.scss`     | Editor styles.                                                               | `{{namespace}}`, `{{slug}}`           |
| `render.php`      | Dynamic block PHP render callback.                                           | `{{slug}}`, `{{textdomain}}`          |

## Plugin & Documentation

| File                | Purpose / Guidance                                                           | Mustache Placeholders                 |
|---------------------|-----------------------------------------------------------------------------|---------------------------------------|
| `{{slug}}.php`      | Main plugin file, header and meta info, block registration.                  | All meta fields                       |
| `README.md`         | Setup, usage, placeholder documentation, references to standards.            | All meta fields, links                |
| `DEVELOPMENT.md`    | Dev setup, build/test, placeholder usage instructions.                       | All meta fields                       |
| `USAGE.md`          | Usage guide for the block.                                                   | All meta fields                       |
| `SUPPORT.md`        | Support process, LightSpeed/WP channels.                                     | All meta fields                       |
| `SECURITY.md`       | Security policy, references WP standards.                                    | All meta fields                       |
| `CONTRIBUTING.md`   | Contribution guidelines, coding standards, instruction file references.      | All meta fields, links                |
| `CODE_OF_CONDUCT.md`| Community standards, adapted from WP/LightSpeed.                             | All meta fields                       |

## Miscellaneous

| File                              | Purpose / Guidance                                                           | Mustache Placeholders   |
|------------------------------------|-----------------------------------------------------------------------------|------------------------|
| `vscode-extensions.txt`            | List of recommended VS Code extensions for block dev.                        |                        |
| `.vscode/extensions.json`          | Extension recommendations (must include Copilot, WP, PHP, etc.)              | Comments with `{{slug}}`|
| `.vscode/settings.json`            | Workspace settings, enforce formatting, linting, language standards.         | Comments with `{{slug}}`|
| `.vscode/launch.json`              | Debug configuration (e.g., Xdebug for PHP).                                  | Comments with `{{slug}}`|
| `.vscode/tasks.json`               | Workspace build/lint/test tasks.                                             | Comments with `{{slug}}`|
| `.husky/`                          | Git hooks for linting, testing, formatting.                                  |                        |
| `.github/`                         | Workflows, automation agents, contributing templates.                        |                        |
| `bin/build.sh`                     | Build script (mustache placeholders in comments).                            | Comments with `{{slug}}`|
| `bin/test.sh`                      | Test script (mustache placeholders in comments).                             | Comments with `{{slug}}`|
| `bin/install-wp-tests.sh`           | Install WP test framework for PHP unit tests.                                | Comments with `{{slug}}`|
| `bin/update-version.js`             | Script to update version numbers across plugin files.                        | Comments with `{{slug}}`|

---

## Mustache Placeholder Usage

All project-specific values (plugin slug, author, description, etc.) should be represented in files as `{{slug}}`, `{{author}}`, etc.  
When generating or customizing a plugin, **replace these placeholders in all files and filenames**.  
Document the replacements in your `README.md` and `DEVELOPMENT.md`.

---

## Reference Links

- [LightSpeed Contribution Guidelines](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md)
- [HTML Templates](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/html-template.instructions.md)
- [Pattern Development](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/pattern-development.instructions.md)
- [PHP Block Instructions](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/php-block.instructions.md)
- [Theme JSON](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/theme-json.instructions.md)
- [WordPress Block Editor Reference](https://developer.wordpress.org/block-editor/reference-guides/block-api/)

---

# Verification & Outputs

- All files/folders above present, using mustache placeholders.
- Directory organized per LightSpeed and WordPress standards.
- Linting, build, and test scripts work out of the box.
- Documentation explains structure, customization, and references standards.

---
