---
title: "Single Block Plugin: Repo Scaffold & Documentation"
version: "v1.4"
last_updated: "2025-10-17"
author: "{{author}}"
description: "Reference for scaffolding, configuring, and extending a single-block WordPress plugin. Includes all required files, standards, prompts, chat modes, and Copilot guidance. Use mustache placeholders throughout."
type: "documentation"
---

# Single Block Plugin Repo Template

This file is the **authoritative reference** for scaffolding, configuring, and maintaining a WordPress single-block plugin.
It is used by Copilot and contributors as the primary guide for:

- Required files and folder structure
- Mustache (`{{ }}`) placeholder usage across all templates
- Standards compliance (WordPress + LightSpeed)
- GitHub health and docs files
- NPM/Composer package setup and build/test scripts
- All instructions, agent prompts, and chat modes (see below)

---

## 📚 How to Use This Template

- All documentation, instructions, prompts, and chat modes are located in `/docs/single-block-plugin/`.
- Always start by reading `repo-template.md`.
- All repo files, docs, and automation scripts should follow the standards, structure, and placeholder conventions described here.
- Use mustache-style placeholders (e.g., `{{slug}}`, `{{author}}`) in all template and instruction files. Document mappings in README and DEVELOPMENT.md.
- Reference this file in your README and internal docs so Copilot and contributors know where to find the full scaffold instructions and developer guidance.

---

## 🧩 Key Files & Structure

Your plugin should follow this structure (all docs/instructions/prompts together):

```
/
├── src/
│   ├── {{slug}}/
│   │   ├── block.json
│   │   ├── edit.js
│   │   ├── save.js
│   │   ├── index.js
│   │   ├── render.php
│   ├── scss/
│   │   ├── style.scss
│   │   └── editor.scss
│   └── index.js
├── bin/
│   ├── build.sh
│   ├── test.sh
│   ├── install-wp-tests.sh
│   └── update-version.js
├── tests/
│   ├── date.js
│   └── date.test.js
├── .github/
│   ├── workflows/
├── .vscode/
│   ├── extensions.json
│   ├── settings.json
│   ├── launch.json
│   └── tasks.json
├── .husky/
│   └── pre-commit
├── .wp-env.json
├── {{slug}}.php
├── package.json
├── composer.json
├── LICENSE
├── CODEOWNERS
├── docs/
│   └── single-block-plugin/
│       ├── repo-template.md
│       ├── README.md
│       ├── DEVELOPMENT.md
│       ├── USAGE.md
│       ├── SUPPORT.md
│       ├── SECURITY.md
│       ├── CONTRIBUTING.md
│       ├── CODE_OF_CONDUCT.md
│       ├── instructions.md
│       ├── chat-modes.md
│       ├── agent-prompts.md
│       └── ...other config/template files
└── ...other config files
```

---

## 📝 Mustache Placeholders

| Placeholder         | Usage                                        |
|---------------------|----------------------------------------------|
| `{{slug}}`          | Filenames, block.json, PHP                   |
| `{{namespace}}`     | block.json, CSS selectors                    |
| `{{author}}`        | Composer/package.json, docs                  |
| `{{description}}`   | block.json, docs                             |
| `{{license}}`       | Composer/package.json, docs                  |
| `{{textdomain}}`    | block.json, PHP, docs                        |
| `{{version}}`       | block.json, docs                             |
| `{{projectName}}`   | README.md, docs                              |

Define all placeholder mappings in README.md and DEVELOPMENT.md.

---

## 🌍 Internationalisation (i18n) Readiness

This theme and all block templates are **prepared for i18n**:

- All required WordPress packages for i18n are installed (`@wordpress/i18n` for JS, proper text domain for PHP).
- Use mustache placeholders for `textdomain` and other i18n values.
- Always wrap strings for translation in JS (`__`, `_x`) and PHP (`esc_html_e`, `__`).
- Document i18n conventions in DEVELOPMENT.md.

---

## ⚙️ Required Packages

### **NPM/Node**
- `@wordpress/scripts`, `@wordpress/block-editor`, `@wordpress/blocks`, `@wordpress/env`, `@wordpress/jest-preset-default`, `@wordpress/e2e-test-utils-playwright`, `@wordpress/stylelint-config`, `@wordpress/prettier-config`, `@wordpress/i18n`, `@wordpress/postcss-plugins-preset`, `playwright`

### **Composer/PHP**
- `"php": ">=8.0"`, `10up/phpcs-composer`, `phpstan/phpstan`, `phpunit/phpunit`

See actual package.json and composer.json templates for usage.

---

## 🛠️ Automation

- Use provided NPM and Composer scripts for build, test, lint, zip, and environment setup.
- Place all hooks/scripts in the appropriate folders (`bin/`, `.husky/`, etc.).
- Reference all Copilot health files and instructions in `/docs/single-block-plugin/`.

---

## 📑 Instructions, Chat Modes, Agent Prompts

All custom instructions, chat modes, agent prompts, and contribution guidelines are located in `/docs/single-block-plugin/`:

- [`instructions.md`](./instructions.md)
- [`chat-modes.md`](./chat-modes.md)
- [`agent-prompts.md`](./agent-prompts.md)
- [`CONTRIBUTING.md`](./CONTRIBUTING.md)
- [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md)
- [`SECURITY.md`](./SECURITY.md)
- [`SUPPORT.md`](./SUPPORT.md)

Each uses mustache placeholders for values as appropriate.

---


# Newly Added & Context-Specific Files: Purpose, Usage, Mustache Template Application

This section documents files recently added to your repo or newly referenced in context.  
If the file is already described in your main repo template documentation, a cross-reference is provided.

---

## `src/copyright-block/block.json`
**Already Documented.**
- See the main template documentation for `block.json`.
- **Purpose:** Block metadata.
- **Mustache Usage:** `"name": "{{namespace}}/{{slug}}"`, `"title": "{{projectName}}"`, `"description": "{{description}}"`, `"textdomain": "{{textdomain}}"`, `"version": "{{version}}"`, etc.
- **Usage:** Required for registering the block and for tooling.  
- **Best Practice:** List all placeholders in README.md and DEVELOPMENT.md.

---

## `src/copyright-block/edit.js`, `src/copyright-block/save.js`, `src/copyright-block/index.js`, `src/copyright-block/render.php`
**Already Documented.**
- See main documentation for:  
  - Editor/saver components (`edit.js`, `save.js`)
  - Block registration (`index.js`)
  - PHP render callback (`render.php`)
- **Mustache Usage:**  
  - Use `{{slug}}`, `{{namespace}}`, `{{textdomain}}` in function/class names, exports, ARIA, and i18n strings.
  - Document placeholder mapping in README.md.

---

## `src/scss/editor.scss` & `src/scss/style.scss`
**Already Documented.**
- See documentation for frontend/editor styles.
- **Mustache Usage:**  
  - Use `.wp-block-{{namespace}}-{{slug}}` for selector (if you prefer scoping).
  - Document actual selectors if generated dynamically.
- **Usage:** Styles for block display in editor/frontend.

---

## `src/index.js`
**Already Documented.**
- See documentation for plugin JS entry point.
- **Mustache Usage:**  
  - Import path: `./{{slug}}-block` or similar if templated.
- **Usage:** Entry to register/init plugin blocks.

---

## `tests/date.js` & `tests/date.test.js`
**New/Expanded Documentation.**

### `tests/date.js`
- **Purpose:** Utility functions for date logic (e.g., current year, formatting ranges, validation).
- **Mustache Usage:**  
  - If templating, add a comment header: `// Utilities for {{slug}} plugin`.
  - Function names and exports can use `{{slug}}` in comments or naming if desired.
- **Usage:** Shared logic used by block JS or tests.
- **Best Practice:** Keep utilities decoupled and simple. Document function purpose.

### `tests/date.test.js`
- **Purpose:** Unit tests for date utilities.
- **Mustache Usage:**  
  - If templated, add a comment header: `// Tests for {{slug}} plugin date utilities`.
  - Use `{{slug}}` in test suite names or test descriptions if desired.
- **Usage:** Ensures reliability of date logic (e.g., in copyright block).
- **Best Practice:** Mock dates for stable tests. Document edge cases tested.

---

## `.vscode/extensions.json`
- **Purpose:** Lists recommended VS Code extensions for the repo.
- **Mustache Usage:**  
  - Add a comment header: `// Recommended extensions for {{slug}} plugin`.
- **Usage:** Helps contributors set up their dev environment for WordPress, JS, PHP, CSS, etc.
- **Best Practice:** Document why each extension is recommended in DEVELOPMENT.md.

---

## `.vscode/launch.json`
- **Purpose:** Configures launch/debug settings, e.g., Xdebug for PHP.
- **Mustache Usage:**  
  - Add a comment header: `// Debug configuration for {{slug}} plugin`.
- **Usage:** Allows contributors to debug PHP in local/dev environments.
- **Best Practice:** Document usage in DEVELOPMENT.md.

---

## `.vscode/settings.json`
- **Purpose:** Editor settings for formatting, linting, file associations, etc.
- **Mustache Usage:**  
  - Add a comment header: `// VSCode settings for {{slug}} plugin`.
- **Usage:** Ensures consistent coding style and tool config across contributors.
- **Best Practice:** Document any key settings (e.g., tab size, formatter) in DEVELOPMENT.md.

---

## `.vscode/tasks.json`
- **Purpose:** Defines build/test/lint tasks for VS Code's task runner.
- **Mustache Usage:**  
  - Add a comment header: `// VSCode tasks for {{slug}} plugin`.
- **Usage:** Simplifies running scripts for build, test, lint, package, etc.
- **Best Practice:** Document task usage in DEVELOPMENT.md.

---

## `.husky/pre-commit`
- **Purpose:** Pre-commit git hook to run linter and prevent bad code commits.
- **Mustache Usage:**  
  - Add a comment header: `# Pre-commit hook for {{slug}} plugin`.
- **Usage:** Runs `npm run lint` before git commits, ensuring code quality.
- **Best Practice:** Document hook setup and behavior in DEVELOPMENT.md.

---

## `bin/build.sh`
- **Purpose:** Shell script to build plugin assets.
- **Mustache Usage:**  
  - Add comment header: `# Build script for {{slug}} plugin`.
- **Usage:** Installs dependencies and runs the build process.
- **Best Practice:** Document script usage and any required environment setup.

---

## `bin/install-wp-tests.sh`
- **Purpose:** Installs WP test environment for PHPUnit.
- **Mustache Usage:**  
  - Add comment header: `# Install WP test framework for {{slug}} plugin`.
- **Usage:** Sets up WordPress tests for PHP unit testing.
- **Best Practice:** Document arguments and usage in DEVELOPMENT.md.

---

## `bin/test.sh`
- **Purpose:** Shell script to run all plugin tests (JS, PHP, E2E).
- **Mustache Usage:**  
  - Add comment header: `# Test script for {{slug}} plugin`.
- **Usage:** Calls test runners and reports results.
- **Best Practice:** Document what tests are run and how to interpret output.

---

## `bin/update-version.js`
- **Purpose:** Node.js script to update version numbers in key plugin files.
- **Mustache Usage:**  
  - Add comment header: `// Update version script for {{slug}} plugin`.
  - Paths and regexes can include `{{slug}}` if templated.
- **Usage:** Keeps version numbers in sync across package.json, block.json, PHP, readme.
- **Best Practice:** Document how to use the script and any files it affects.

---

# How To Apply These Files in a New Plugin Scaffold

- **Use mustache placeholders in all comments, filenames, and key fields.**  
  For example, in `block.json`: `"name": "{{namespace}}/{{slug}}"`, in script headers: `# Build script for {{slug}}`.
- **Document placeholder mapping and replacement in your README.md and DEVELOPMENT.md.**
- **Keep scripts and configs up-to-date with repo structure and standards.**
  - For each new plugin, replace placeholders with actual values (slug, namespace, author, etc.).
- **Explain usage of each file in your documentation** so contributors know their purpose.

---

# References

- Main documentation files:  
  - `single-block-plugin-repo-template.documentation.md`
  - `single-block-plugin.files-details.md`
  - `single-block-plugin.instructions-files.md`
  - `single-block-plugin.chatmode-files.md`
  - (and their expanded versions)

- [LightSpeed Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md)
- [WordPress Block API Reference](https://developer.wordpress.org/block-editor/reference-guides/block-api/)

---


## 📚 References

- **Main template file:**  
  [`repo-template.md`](./repo-template.md)
- **LightSpeed Coding Standards:**  
  [`instructions.md`](./instructions.md)
- **WordPress Block API:**  
  [Block API](https://developer.wordpress.org/block-editor/reference-guides/block-api/)
- **GitHub Health Files:**  
  [`CONTRIBUTING.md`](./CONTRIBUTING.md), [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md), [`SECURITY.md`](./SECURITY.md), [`SUPPORT.md`](./SUPPORT.md)
- **All prompts and instructions:**  
  [`chat-modes.md`](./chat-modes.md), [`agent-prompts.md`](./agent-prompts.md)

---

## 🚦 For Copilot & Contributors

- Always reference `/docs/single-block-plugin/repo-template.md` when scaffolding, updating, or reviewing the repo.
- Ensure all generated files comply with the standards and placeholder usage described here.
- Use the README.md as the quickstart, but rely on `repo-template.md` for deep references and standards.

---

**Ready to scaffold your next block plugin? Start here, and build with WordPress + LightSpeed best practices.**
