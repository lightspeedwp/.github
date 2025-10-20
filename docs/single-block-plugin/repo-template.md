---
title: "{{projectName}} Block Plugin Repo Template"
version: "{{version}}"
last_updated: "{{lastUpdated}}"
author: "{{author}}"
description: "Authoritative documentation and scaffold for a single-block plugin. All links and standards for Copilot/AI-guided automation. Uses mustache placeholders throughout."
type: "documentation"
---

# {{projectName}} Block Plugin Repo Template

**This is the definitive reference for scaffolding, configuring, and maintaining a WordPress single-block plugin using LightSpeed and WordPress standards.**

---

## 📚 How to Use This Template

- All documentation, prompts, workflow, and agent instructions are in `/docs/single-block-plugin/`.
- Start here and follow the links for standards, file templates, and agent prompts.
- Use mustache-style placeholders (e.g., `{{slug}}`, `{{author}}`) in all files and front matter.
- Reference this file in your README and internal docs.
- **All markdown, YAML, and config files with project metadata MUST start with proper front-matter**, see [FRONTMATTER.md](./FRONTMATTER.md).

---

## 🗂️ Quicklinks Index

- [Getting Started with the Theme Scaffold](./GETTING-STARTED-SCAFFOLD.md)
- [Scaffolding & Templating Guide](./SCAFFOLDING.md)
- [Mustache Placeholder Reference](./PLACEHOLDERS.md)
- [Placeholder Schema & Usage](./placeholder-schema-and-usage.md)
- [Front Matter Reference](./FRONTMATTER.md)
- [Adding a New Theme Variation](./ADDING-THEME-VARIATIONS.md)
- [Testing and Linting](./TESTING-AND-LINTING.md)
- [Copilot & Automation Agent Guide](./COPILOT-INTEGRATION.md)
- [Conventions & Best Practices](./CONVENTIONS.md)
- [Development Workflow](./DEVELOPMENT.md)
- [Usage Guide](./USAGE.md)
- [Support](./SUPPORT.md)
- [Security Policy](./SECURITY.md)
- [Contributing Guide](./CONTRIBUTING.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Agent Prompts](./agent-prompts.md)
- [Chat Modes](./chat-modes.md)
- [Health Files](./README.md)

---

## 🧩 Key Files & Structure

Your plugin should follow this structure:

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
│   ├── update-version.js
│   └── validate-templates.js
├── tests/
│   ├── date.js
│   └── date.test.js
├── .github/
│   ├── workflows/
│   │   ├── validate-placeholders.yml
│   │   └── ai-lint.yml
│   ├── AGENT_GUIDE.md
│   ├── PLACEHOLDER_CHECKLIST.md
│   └── AGENT_PROMPTS/
│       ├── scaffold-block-plugin.md
│       ├── update-placeholder.md
│       ├── validate-front-matter.md
│       └── add-new-block.md
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
│       ├── repo-name-description-prompt.md
│       ├── GETTING-STARTED-SCAFFOLD.md
│       ├── SCAFFOLDING.md
│       ├── PLACEHOLDERS.md
│       ├── placeholder-schema-and-usage.md
│       ├── FRONTMATTER.md
│       ├── ADDING-THEME-VARIATIONS.md
│       ├── TESTING-AND-LINTING.md
│       ├── COPILOT-INTEGRATION.md
│       ├── CONVENTIONS.md
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

| Placeholder         | Usage (in files & front matter)              |
|---------------------|----------------------------------------------|
| `{{slug}}`          | Filenames, block.json, PHP, front matter     |
| `{{namespace}}`     | block.json, CSS selectors, front matter      |
| `{{author}}`        | Composer/package.json, docs, front matter    |
| `{{description}}`   | block.json, docs, front matter               |
| `{{license}}`       | Composer/package.json, docs, front matter    |
| `{{textdomain}}`    | block.json, PHP, docs, front matter          |
| `{{version}}`       | block.json, docs, front matter               |
| `{{projectName}}`   | README.md, docs, front matter                |
| `{{lastUpdated}}`   | All docs, front matter                       |
| ...                 | Extend as needed for your plugin metadata    |

See [PLACEHOLDERS.md](./PLACEHOLDERS.md) and [placeholder-schema-and-usage.md](./placeholder-schema-and-usage.md).

---

## 🏷️ Front Matter: Definition & Mustache Usage

All relevant files must start with YAML front matter using mustache placeholders. See [FRONTMATTER.md](./FRONTMATTER.md).

---

## 🌍 Internationalisation (i18n)

- Use mustache placeholders for `textdomain` and i18n values.
- Wrap translatable strings in JS (`__`, `_x`) and PHP (`esc_html_e`, `__`).
- See [DEVELOPMENT.md](./DEVELOPMENT.md).

---

## ⚙️ Required Packages

- **NPM:** `@wordpress/scripts`, `@wordpress/block-editor`, `@wordpress/blocks`, `@wordpress/env`, `@wordpress/jest-preset-default`, `@wordpress/e2e-test-utils-playwright`, `@wordpress/stylelint-config`, etc.
- **Composer:** `"php": ">=8.0"`, `10up/phpcs-composer`, `phpstan/phpstan`, `phpunit/phpunit`

---

## 🛠️ Automation & Linting

- Validate and lint using `/bin/validate-templates.js` and workflows in `.github/workflows/`.
- See [TESTING-AND-LINTING.md](./TESTING-AND-LINTING.md).

---

## 🔗 Key References

- [Getting Started with the Theme Scaffold](./GETTING-STARTED-SCAFFOLD.md)
- [Scaffolding & Templating Guide](./SCAFFOLDING.md)
- [Mustache Placeholder Reference](./PLACEHOLDERS.md)
- [Placeholder Schema & Usage](./placeholder-schema-and-usage.md)
- [Front Matter Reference](./FRONTMATTER.md)
- [Adding a New Theme Variation](./ADDING-THEME-VARIATIONS.md)
- [Testing and Linting](./TESTING-AND-LINTING.md)
- [Copilot & Automation Agent Guide](./COPILOT-INTEGRATION.md)
- [Conventions & Best Practices](./CONVENTIONS.md)
- [WordPress Block Example Conventions](https://github.com/WordPress/block-development-examples/wiki/Conventions-for-examples)
- [WordPress Block API Reference](https://developer.wordpress.org/block-editor/reference-guides/block-api/)
- [LightSpeed Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md)

---

## 🚦 For Copilot & Contributors

- Start here. Reference internal links for standards, templates, and instructions.
- Ensure all files use correct mustache front matter and metadata.
- See [COPILOT-INTEGRATION.md](./COPILOT-INTEGRATION.md) and [AGENT_GUIDE.md](../../.github/AGENT_GUIDE.md).

---

**Ready to scaffold your next block plugin? Start here, and build with WordPress + LightSpeed best practices.**
