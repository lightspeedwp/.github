---
title: "Single Block Plugin: Copilot Instructions"
version: "v1.0"
last_updated: "2025-10-17"
author: "LightSpeed"
maintainer: "Ash Shaw"
description: "Instructions for generating a WordPress single-block plugin with mustache placeholders and LightSpeed standards."
tags: ["lightspeed","wordpress","block-plugin","copilot","template"]
type: "prompt"
---

# Directory & File Structure Requirements

> **Every file must use mustache placeholders for project-specific values.**

## Required Top-Level Files
- `.editorconfig`, `.eslintrc.json`/`.cjs`, `.eslintignore`, `.babelrc`, `.browserslistrc`, `.prettierrc.js`, `.prettierignore`, `.npmpackagejsonlintrc.json`, `.npmrc`
- `.markdownlint.json`, `.markdownlintignore`, `.distignore`, `.gitattributes`, `.gitignore`, `.shellcheckrc`, `.readthedocs.yaml`, `.all-contributorsrc`
- `package.json`, `composer.json`, `webpack.config.js`, `postcss.config.js`, `stylelint.config.js`, `playwright.config.js`, `phpunit.xml`, `phpcs-baseline.xml`

## Required Source Files (`src/`)
- `block.json`, `index.js`, `edit.js`, `save.js`, `style.scss`, `editor.scss`, `render.php`

## Plugin & Docs
- `{{slug}}.php`, `README.md`, `DEVELOPMENT.md`, `USAGE.md`, `SUPPORT.md`, `SECURITY.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`

## Miscellaneous
- `vscode-extensions.txt`, `.vscode/extensions.json`, `.vscode/settings.json`, `.vscode/launch.json`, `.vscode/tasks.json`, `.husky/`, `.github/`, `bin/build.sh`, `bin/test.sh`, `bin/install-wp-tests.sh`, `bin/update-version.js`

---

# Mustache Placeholders Used
- `{{slug}}`, `{{namespace}}`, `{{author}}`, `{{description}}`, `{{license}}`, `{{textdomain}}`, `{{version}}`, `{{projectName}}`

**Replace all placeholders in filenames and file contents. Document each replacement in README.md and DEVELOPMENT.md.**

---

# Reference Links
- See [LightSpeed Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md) for details and further explanation for each file.

---
