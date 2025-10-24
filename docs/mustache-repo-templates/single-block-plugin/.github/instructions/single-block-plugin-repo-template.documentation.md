---
title: "Single Block Plugin Repo Template: Complete Documentation & Setup"
version: "v1.1"
last_updated: "2025-10-17"
author: "LightSpeed Block Dev Copilot"
description: "Comprehensive guide for setting up, maintaining, and extending a WordPress single-block plugin repository using Copilot templates, LightSpeed, and WordPress coding standards. Includes full references, README guidance, and integration with GitHub health files."
type: "documentation"
---

# Single Block Plugin Repo Template: Complete Documentation & Setup Guide

This documentation is your authoritative source for **scaffolding, configuring, and developing** a standards-compliant WordPress single-block plugin using LightSpeed’s practices, WordPress core guidelines, and Copilot automation.  
It references all relevant files, internal documentation, and best practices—ensuring your repo is both healthy and developer-friendly.

---

## 🚀 Getting Started: Scaffold Your Plugin

### **Recommended Tools**
- Use [`@wordpress/create-block`](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-create-block/) to scaffold a new plugin:
  ```bash
  npx @wordpress/create-block {{slug}}
  ```
  This will prompt for all key plugin values and generate a full starter structure—including block.json, PHP, assets, tests, npm/composer config, and more.

### **Mustache Placeholders**
- Throughout the repo, use mustache placeholders for project-specific fields (e.g. `{{slug}}`, `{{author}}`, `{{namespace}}`, etc.).
- All scaffolding and templated files **must document their placeholders** in both `README.md` and `DEVELOPMENT.md`.

---

## 📋 Repo Structure & File Reference

Your plugin should follow this structure (files in `src/` are for the block, root files for plugin, config, and automation):

```
/
├── src/
│   ├── copyright-block/
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
│   ├── agents/
│   └── prompts/
├── .vscode/
│   ├── extensions.json
│   ├── settings.json
│   ├── launch.json
│   └── tasks.json
├── .husky/
│   └── pre-commit
├── .wp-env.json
├── copyright-date-block.php
├── package.json
├── composer.json
├── jest.config.js
├── playwright.config.js
├── eslint.config.js
├── phpcs.xml
├── phpstan.neon
├── phpunit.xml
├── README.md
├── DEVELOPMENT.md
├── USAGE.md
├── SUPPORT.md
├── SECURITY.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── LICENSE
├── CODEOWNERS
└── ...other config files
```

---

## 🧩 Copilot Documentation & Health Files

The following files (within `.github` or as standalone markdown) provide key **documentation, instructions, and prompts** to guide Copilot and contributors:

- `single-block-plugin.files-details.md`  
  *File-by-file scaffold reference; mustache placeholder usage; standards.*
- `single-block-plugin.instructions-files.md`  
  *Copilot instructions for generating/maintaining files; placeholder documentation.*
- `single-block-plugin.chatmode-files.md`  
  *Chat mode template for file-by-file purpose, standards, placeholder mapping.*
- `single-block-plugin.files-details-expanded.md`  
  *Expanded reference for dev, test, CI, automation files.*
- `single-block-plugin.instructions-files-expanded.md`  
  *Expanded Copilot instructions for automation, CI, and test files.*
- `single-block-plugin.chatmode-files-expanded.md`  
  *Expanded chat mode for all files and placeholder mapping.*
- `README.md`  
  *Getting started, placeholder table, repo overview, file structure.*
- `DEVELOPMENT.md`  
  *Dev setup, build/test, placeholder guide, contribution workflow.*

**Also reference all relevant files in the [LightSpeed GitHub Health repository](https://github.com/lightspeedwp/.github):**
- `.github/custom-instructions.md` – General team and Copilot instructions.
- `.github/instructions/coding-standards.instructions.md` – Coding standards (JS, PHP, CSS, HTML).
- `.github/instructions/php-block.instructions.md` – PHP block instructions.
- `.github/instructions/pattern-development.instructions.md` – Block pattern standards.
- `.github/instructions/theme-json.instructions.md` – Theme JSON best practices.
- `.github/instructions/html-template.instructions.md` – HTML templates.
- `.github/PULL_REQUEST_TEMPLATE.md` – PR summary and review checklist.
- `.github/CONTRIBUTING.md` – Contribution workflow.
- `.github/CODE_OF_CONDUCT.md` – Community standards.

---

## 🛠️ Required Packages

### **NPM / Node Packages**
You need these in `package.json`:
- `@wordpress/scripts` (build, lint, test, zip, etc.)
- `@wordpress/block-editor`, `@wordpress/blocks`, `@wordpress/components`, `@wordpress/data`, etc.
- `@wordpress/env` (local WP environment)
- `@wordpress/jest-preset-default`, `@wordpress/e2e-test-utils-playwright`, `@playwright/test` (testing)
- `@wordpress/stylelint-config`, `@wordpress/prettier-config` (lint/format)
- `@wordpress/i18n` (translations)
- `@wordpress/postcss-plugins-preset` (styles)
- Optionally: Babel presets, TypeScript, and other tooling.

### **Composer / PHP Packages**
You need these in `composer.json`:
- `"php": ">=8.0"`
- `10up/phpcs-composer` (WordPress/VIP coding standards)
- `phpstan/phpstan` (static analysis)
- `phpunit/phpunit` (unit testing)
- Optionally: `johnbillion/wp-compat` for compatibility.

---

## ⚙️ Automation: NPM & Composer Scripts

**In `package.json`:**
- `"build"`: Compiles assets for production.
- `"start"`: Runs dev server.
- `"lint"`: Runs JS, CSS, PHP linters.
- `"test"`: Runs JS/TS tests, E2E, coverage.
- `"plugin-zip"`: Creates distributable ZIP.
- `"env:start"`: Starts WP local environment.
- `"update-version"`: Updates version numbers in all files.

**In `composer.json`:**
- `"phpcs"`: Runs PHP_CodeSniffer.
- `"phpstan"`: Runs PHPStan.
- `"test"`: Runs PHP tests.

---

## 📝 Mustache Placeholder Table

| Placeholder         | Typical Replacement/Source      | Usage                                       |
|---------------------|--------------------------------|---------------------------------------------|
| `{{slug}}`          | Plugin/block slug (e.g. copyright-date-block) | Filenames, config, PHP, JS, CSS            |
| `{{namespace}}`     | JS/PHP namespace (e.g. lightspeedwp)          | JS imports, PHP prefixes, CSS selectors     |
| `{{author}}`        | Author name (e.g. LightSpeedWP)               | Composer/package.json, docs                 |
| `{{description}}`   | Plugin description                             | block.json, docs                            |
| `{{license}}`       | License type (e.g. GPL-2.0-or-later)           | Composer/package.json, docs                 |
| `{{textdomain}}`    | WP textdomain (usually matches slug)           | i18n in PHP/JS, block.json                  |
| `{{version}}`       | Plugin/block version                           | block.json, docs                            |
| `{{projectName}}`   | Human-readable project name                    | Docs, block.json                            |

**Document all placeholders and their replacements in `README.md` and `DEVELOPMENT.md`.**

---

## 👩‍💻 Development & Contribution Workflow

- Scaffold with `@wordpress/create-block` (or your own template).
- Replace all placeholders and document mapping.
- Use and reference all Copilot health and standards files.
- Run provided scripts for build, test, lint, and release.
- Follow coding standards in all code and documentation.
- Contribute via the workflow in `CONTRIBUTING.md`.
- Reference coding standards, block API, and internal docs as needed.

---

## ✅ Final Checklist for Copilot/Repo Setup

- [ ] All required files present and referenced in documentation.
- [ ] Mustache placeholders used and mapped in docs.
- [ ] NPM and Composer packages installed and scripts configured.
- [ ] Coding standards files referenced.
- [ ] README.md and DEVELOPMENT.md guide contributors.
- [ ] Health files in `.github` are referenced and maintained.
- [ ] Copilot aware of all required files, standards, and workflow.

---

**For any questions, consult the referenced documentation files, LightSpeed standards, or ask LightSpeed Block Dev Copilot!**
