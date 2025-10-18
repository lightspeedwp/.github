---
title: "Single Block Plugin: Copilot Prompt"
version: "v1.0"
last_updated: "2025-10-17"
author: "LightSpeed"
maintainer: "Ash Shaw"
description: "Prompt for Copilot to scaffold and maintain a standards-compliant WordPress single-block plugin template."
tags: ["lightspeed","templates","copilot","prompts","wordpress","block-plugin"]
type: "prompt"
---

# Purpose
Scaffold a WordPress single-block plugin template using mustache placeholders in **all required files and folders**.

# File & Folder Structure Requirements

- Top-level config files: `.editorconfig`, `.eslintrc.json`/`.cjs`, `.eslintignore`, `.babelrc`, `.browserslistrc`, `.prettierrc.js`, `.prettierignore`, `.npmpackagejsonlintrc.json`, `.npmrc`, `.markdownlint.json`, `.markdownlintignore`, `.distignore`, `.gitattributes`, `.gitignore`, `.shellcheckrc`, `.readthedocs.yaml`, `.all-contributorsrc`
- Build/test/package: `package.json`, `composer.json`, `webpack.config.js`, `postcss.config.js`, `stylelint.config.js`, `playwright.config.js`, `phpunit.xml`, `phpcs-baseline.xml`
- **src/**: `block.json`, `index.js`, `edit.js`, `save.js`, `style.scss`, `editor.scss`, `render.php`
- Plugin entry: `{{slug}}.php`
- Documentation: `README.md`, `DEVELOPMENT.md`, `USAGE.md`, `SUPPORT.md`, `SECURITY.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`
- VS Code: `vscode-extensions.txt`, `.vscode/extensions.json`, `.vscode/settings.json`, `.vscode/launch.json`, `.vscode/tasks.json`
- Utility/scripts: `.husky/`, `.github/`, `bin/build.sh`, `bin/test.sh`, `bin/install-wp-tests.sh`, `bin/update-version.js`

---

# Mustache Placeholders
- Use `{{slug}}`, `{{namespace}}`, `{{author}}`, `{{description}}`, `{{license}}`, `{{textdomain}}`, `{{version}}`, `{{projectName}}` where relevant.

---

# Verification steps
- All files/folders above present, using mustache placeholders.
- Directory organized per LightSpeed and WordPress standards.
- Documentation explains structure, customization, and references standards.

---
