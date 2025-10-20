---
title: "{{theme_name}} Block Theme: Developer & Contributor Documentation"
version: "{{version}}"
last_updated: "{{last_updated}}"
author: "{{author}}"
theme_slug: "{{slug}}"
description: "Reference guide for scaffolding, customizing, and maintaining the {{theme_name}} WordPress block theme, with links to all supporting files, templates, and automation."
copilot_ready: true
type: "documentation"
tags: ["block-theme", "wordpress", "copilot", "scaffold", "automation"]
---

# {{theme_name}} Block Theme: Developer & Contributor Documentation

**Last Updated:** {{last_updated}}  
**Version:** v{{version}}  
**Author:** {{author}}  
**Theme Slug:** `{{slug}}`  
**Repo:** [{{repo_url}}]({{repo_url}})

---

This documentation is the authoritative reference for scaffolding, customizing, and maintaining the {{theme_name}} WordPress block theme.
It links to all files, guides, and automation scripts in this repository, following the LightSpeed and WordPress block theme standards.

---

## 📁 Theme Structure & Guidelines

- **Project Standards:**  
  See [WordPress Block Theme – Structure & Development Guidelines.md](./WordPress%20Block%20Theme%20%E2%80%93%20Structure%20&%20Development%20Guidelines.md) for file conventions, coding standards, theme architecture, and best practices.

- **Repository Patterns:**  
  [repo-structure-patterns.md](./repo-structure-patterns.md):  
  Example layouts for block themes, plugins, and documentation.

---

## 🚀 Getting Started & Scaffolding

- **Getting Started:**  
  [GETTING-STARTED-SCAFFOLD.md](./GETTING-STARTED-SCAFFOLD.md):  
  Quick setup, cloning, and initializing your theme with mustache templates.

- **Scaffold Usage:**  
  [SCAFFOLD-USAGE.md](./SCAFFOLD-USAGE.md):  
  How to fill out mapping files, run the template replacement script, and activate your theme.

---

## 🧩 Theme Files & Structure

- **Mustache Placeholder Reference:**  
  [placeholder-schema-and-usage.md](./placeholder-schema-and-usage.md):  
  Canonical list of all mustache placeholders, their meaning, and usage locations.

- **Adding New Variations:**  
  [ADDING-THEME-VARIATIONS.md](./ADDING-THEME-VARIATIONS.md):  
  How to add new style variations, templates, and extend the scaffold.

- **Conventions & Best Practices:**  
  [CONVENTIONS.md](./CONVENTIONS.md):  
  File naming, structure, coding and documentation conventions.

---

## 🔧 Tooling & Build Pipeline

- **Build Process:**  
  See `webpack.config.js.mustache`, `postcss.config.js.mustache`, `stylelint.config.js.mustache`, `eslint.config.mjs.mustache`, `composer.json.mustache`, `tsconfig.json.mustache`, `phpcs-baseline.xml.mustache`, `playwright.config.ts.mustache`.

- **Testing and Linting:**  
  [TESTING-AND-LINTING.md](./TESTING-AND-LINTING.md):  
  How to run tests and linting for JS, PHP, CSS, and Markdown.

---

## 🛡️ Community Health & Contribution

- **Contribution Guidelines:**  
  [CONTRIBUTING.md](./CONTRIBUTING.md.mustache), [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md.mustache), [SUPPORT.md](./SUPPORT.md.mustache), [SECURITY.md](./SECURITY.md.mustache)

- **Changelog:**  
  [CHANGELOG.md](./CHANGELOG.md.mustache)

- **License:**  
  [LICENSE.md](./LICENSE.md)

- **All Contributors:**  
  [.all-contributorsrc](./.all-contributorsrc.mustache), [.all-contributorsrc-docs.md](./.all-contributorsrc-docs.md.mustache)

---

## 🤖 Copilot & Automation

- **Copilot Guide:**  
  [COPILOT-INTEGRATION.md](./COPILOT-INTEGRATION.md):  
  Guide for Copilot and automation agents on how to consume and generate the scaffold.

- **Prompts, Instructions, Chatmodes:**  
  See `.github/` for all agent instructions, prompts, and chatmodes used in automation.

---

## 📚 Documentation Index

- [Getting Started with the Theme Scaffold](./GETTING-STARTED-SCAFFOLD.md)
- [Mustache Placeholder Reference](./placeholder-schema-and-usage.md)
- [Adding a New Theme Variation](./ADDING-THEME-VARIATIONS.md)
- [Testing and Linting](./TESTING-AND-LINTING.md)
- [Copilot & Automation Agent Guide](./COPILOT-INTEGRATION.md)
- [Conventions & Best Practices](./CONVENTIONS.md)

---

## 🏷️ Front Matter & Automation

All documentation, configuration, and theme files should include a YAML front matter block at the top with key metadata and mustache placeholders.
Recommended fields: `title`, `description`, `version`, `last_updated`, `author`, `slug`, `type`, `copilot_ready`.

---

## 🧑‍💻 Contributing & Support

- For contribution, see [CONTRIBUTING.md](./CONTRIBUTING.md.mustache)
- For questions, see [SUPPORT.md](./SUPPORT.md.mustache)
- For security, see [SECURITY.md](./SECURITY.md.mustache)
- For changelog, see [CHANGELOG.md](./CHANGELOG.md.mustache)

---

## 📚 Further Information

See links above or contact maintainers for more help.
{{theme_name}} | v{{version}} | [GPL v3]({{license_url}})
