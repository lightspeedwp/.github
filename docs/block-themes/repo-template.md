# {{theme_name}} Block Theme: Developer & Contributor Documentation

**Last Updated:** 2025-10-17  
**Version:** v1.0

---

This document provides a complete reference for building, developing, and contributing to the {{theme_name}} WordPress block theme.  
It links to every supporting file and guideline in this repository and community health folders.

---

## 📁 Theme Structure & Guidelines

- **Project Standards:**  
  See [WordPress Block Theme – Structure & Development Guidelines.md](../WordPress%20Block%20Theme%20%E2%80%93%20Structure%20&%20Development%20Guidelines.md):  
  Covers required files, template hierarchy, coding standards, asset pipeline, global styles, and best practices for block themes.

- **Repository Patterns:**  
  [repo-structure-patterns.md](../repo-structure-patterns.md):  
  Typical layouts for WordPress themes, plugins, scripts, and documentation.

---

## 🚀 Development Setup

- **Development Workflow:**  
  [DEVELOPMENT.block-theme.md](../DEVELOPMENT.block-theme.md):  
  Prerequisites, install commands, build/lint/test scripts, using GitHub Copilot and contributing.

- **README Example:**  
  [README.block-theme.md](../README.block-theme.md):  
  Template for theme repo README, setup, structure, and quickstart.

---

## 🔧 Tooling & Build Pipeline

- **Build Process:**  
  See `webpack.config.js`, `postcss.config.js`, `stylelint.config.js`, `eslint.config.mjs`, `composer.json`, `tsconfig.json`, `phpcs-baseline.xml`, `playwright.config.ts` for configuration of asset pipeline, linting, static analysis, and end-to-end testing.

- **Build Standards:**  
  [build-process.md](../build-process.md) and [build-process-block-themes.md](../build-process-block-themes.md):  
  Official workflow for JS/CSS asset compilation and recommended npm/composer packages.

- **Dev Tools & Extensions:**  
  [dev-tools.md](../dev-tools.md):  
  Covers global and project-specific tools, VSCode extensions, and quick setup commands.

---

## 🧩 Theme Files & Structure

- Required:  
  `style.css`, `theme.json`, `templates/index.html`, `functions.php`
- Recommended:  
  `screenshot.png`, `README.txt`/`README.md`, `CHANGELOG.md`, `LICENSE.md`
- Directories:  
  `templates/`, `parts/`, `patterns/`, `styles/`, `assets/`, `inc/`, `.github/`

---

## 🛡️ Community Health & Contribution

- **Contribution Guidelines:**  
  [CONTRIBUTING.md](../CONTRIBUTING.md), [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md), [SUPPORT.md](../SUPPORT.md), [SECURITY.md](../SECURITY.md)

- **Changelog:**  
  [CHANGELOG.md](../CHANGELOG.md)

- **License:**  
  [LICENSE.md](../LICENSE.md)

---

## 🤖 Copilot Integration & Prompts

- Copilot Instructions:  
  `.github/block-theme-template.instructions.md`
- Copilot Prompt:  
  `.github/block-theme-template.prompt.md`
- Copilot Chatmode:  
  `.github/block-theme-template.chatmode.md`

---

## 📝 Referencing Pattern & Health Files

- Patterns:  
  [repo-structure-patterns.md](../repo-structure-patterns.md)
- Community health:  
  [06-community-health-repo](../06-community-health-repo/), [07-documentation-repo](../07-documentation-repo/)

---

## 🔗 Quick Reference Index of All Files

| File/Doc Name                                         | Purpose                                                    |
|-------------------------------------------------------|------------------------------------------------------------|
| WordPress Block Theme – Structure & Development Guidelines.md   | Theme architecture, coding standards, structure             |
| DEVELOPMENT.block-theme.md                            | Local setup, workflow, build/test/lint commands             |
| README.block-theme.md                                 | Example README/setup/structure for repo                     |
| repo-structure-patterns.md                            | Folder structure for themes, plugins, docs                  |
| build-process.md / build-process-block-themes.md       | Asset pipeline, build scripts, release workflow             |
| dev-tools.md                                          | Dev environment, tools, VSCode extensions                   |
| eslint.config.mjs, stylelint.config.js, postcss.config.js, webpack.config.js, composer.json, tsconfig.json, phpcs-baseline.xml, playwright.config.ts | Tooling & configuration files                               |
| CHANGELOG.md, CODE_OF_CONDUCT.md, CONTRIBUTING.md, LICENSE.md, SUPPORT.md, SECURITY.md | Community health, contribution, license, support            |
| .github/block-theme-template.instructions.md           | Copilot agent instructions                                  |
| .github/block-theme-template.prompt.md                 | Copilot build prompt template                               |
| .github/block-theme-template.chatmode.md               | Chatmode agent for theme support and automation             |

---

## 🧑‍💻 Getting Started

1. Read [DEVELOPMENT.block-theme.md](../DEVELOPMENT.block-theme.md) for local setup.
2. Review [WordPress Block Theme – Structure & Development Guidelines.md](../WordPress%20Block%20Theme%20%E2%80%93%20Structure%20&%20Development%20Guidelines.md) for structure and standards.
3. Use [README.block-theme.md](../README.block-theme.md) to scaffold your repo README.
4. Reference all configuration and health files for contribution and maintenance.

---

## 📚 Further Information

For in-depth details, see the direct links above and reference all included files in this documentation.  
If you need additional help, contact maintainers or use the support and contribution docs provided.

---

{{theme_name}} | v{{version}} | [GPL v3](https://www.gnu.org/licenses/gpl-3.0)