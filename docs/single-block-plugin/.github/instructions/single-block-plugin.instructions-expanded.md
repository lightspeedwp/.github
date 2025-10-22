---
title: "Single Block Plugin: Expanded Copilot Instructions"
version: "v1.1"
last_updated: "2025-10-17"
author: "LightSpeed Block Dev Copilot"
description: "Expanded instructions for Copilot to scaffold/maintain a standards-compliant WordPress single-block plugin template. Includes file purposes, placeholders, and standards."
type: "prompt"
---

# File & Folder Structure Requirements

> Every file must use mustache placeholders for project-specific values and document their usage.

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

---

# Mustache Placeholders Used

| Placeholder         | Where to Use                                          |
|---------------------|-------------------------------------------------------|
| `{{slug}}`          | Plugin/block slug, filenames, block.json, PHP, CSS    |
| `{{namespace}}`     | Block namespace, block.json, JS, CSS selectors        |
| `{{author}}`        | Plugin headers, docs, meta fields                     |
| `{{description}}`   | Plugin/block description, block.json, docs            |
| `{{license}}`       | License fields, package.json, composer.json, headers  |
| `{{textdomain}}`    | WP text domain, PHP, block.json                       |
| `{{version}}`       | Version fields, block.json, docs, headers             |
| `{{projectName}}`   | Project name, docs                                    |

---

# Guidance for Contributors & Automation Agents

- **Replace all placeholders** in filenames and contents before distribution.
- **Document all replacements** in `README.md` and `DEVELOPMENT.md`.
- **Keep files organized** per the directory structure above.
- **Reference coding standards** and WP/LightSpeed documentation in all doc files.
- **Explain file purposes** and placeholder usage in documentation for clarity.

---

# Reference Links

- [LightSpeed Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md)
- [WordPress Block API Guide](https://developer.wordpress.org/block-editor/reference-guides/block-api/)

---
