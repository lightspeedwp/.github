# Configuration Documentation

This directory contains documentation for all configuration files and setup procedures used in the LightSpeed organization.

## Table of Contents

- [Configuration Categories](#configuration-categories)
- [Quick Reference](#quick-reference)
- [File Naming Convention](#file-naming-convention)
- [Organization Standards](#organization-standards)
- [Contributing](#contributing)

## Configuration Categories

### 🚀 **MCP Servers** (`mcp-server-*.md`)

- [MCP Server - GitHub](./mcp-server-github.md) - GitHub integration & Copilot Spaces
- [MCP Server - Playwright](./mcp-server-playwright.md) - Browser automation & testing

### ⚙️ **VS Code Configuration** (`vscode-*.md`)

- [VS Code - Settings](./vscode-settings.md) - Editor settings and extensions
- [VS Code - MCP](./vscode-mcp.md) - Model Context Protocol setup overview

### 📦 **NPM & Node.js** (`npm-*.md`)

- [NPM - Package.json](./npm-package-json.md) - Node.js project setup & dependencies

### � **NPM & Node.js** (`npm-*.md`)

- [NPM - Package.json](./npm-package-json.md) - Node.js project configuration & metadata
- [NPM - Scripts](./npm-scripts.md) - Build automation & development commands
- [NPM - Dependencies](./npm-dependencies.md) - Package management & version strategy

### �🔍 **Linting & Code Quality** (`lint-*.md`)

- [Lint - ESLint](./lint-eslint.md) - JavaScript/TypeScript linting standards
- [Lint - Stylelint](./lint-stylelint.md) - CSS/SCSS linting for WordPress
- [Lint - Markdownlint](./lint-markdownlint.md) - Documentation formatting standards
- [Lint - Prettier](./lint-prettier.md) - Automated code formatting

### 🔄 **Workflow & Automation** (`workflow-*.md`)

- [Workflow - Spectral](./workflow-spectral.md) - YAML and GitHub workflow validation
- [Workflow - Husky](./workflow-husky.md) - Git hooks for quality automation
- [Workflow - Lint-staged](./workflow-lint-staged.md) - Pre-commit file processing

### 🎯 **Project Tools** (`project-*.md`)

- [Project - Contributors](./project-contributors.md) - Contributor recognition & management
- [Project - Jest](./project-jest.md) - JavaScript testing framework setup
- [Project - Babel](./project-babel.md) - JavaScript compilation & transformation
- [Project - PostCSS](./project-postcss.md) - CSS processing & optimization pipeline

### 🔮 **WordPress-Specific** (`wp-*.md`) *(Planned)*

- [WP - Coding Standards](./wp-coding-standards.md) - PHP, JS, CSS standards (planned)
- [WP - Theme.json](./wp-theme-json.md) - Block theme configuration (planned)
- [WP - Block Development](./wp-block-development.md) - WordPress block tooling (planned)

## Quick Reference

| Configuration File | Purpose | Documentation |
| --- | --- | --- |
| `.vscode/mcp.json` | MCP server configuration | [VS Code MCP](./vscode-mcp.md) |
| `@modelcontextprotocol/server-github` | GitHub integration | [MCP Server GitHub](./mcp-server-github.md) |
| `@modelcontextprotocol/server-playwright` | Browser automation | [MCP Server Playwright](./mcp-server-playwright.md) |
| `.vscode/settings.json` | VS Code editor settings | [VS Code Settings](./vscode-settings.md) |
| `package.json` | Node.js project configuration | [NPM Package.json](./npm-package-json.md) |
| `eslint.config.js` | JavaScript linting | [Lint ESLint](./lint-eslint.md) |
| `stylelint.config.js` | CSS/SCSS linting | [Lint Stylelint](./lint-stylelint.md) |
| `.markdownlint.json` | Markdown formatting | [Lint Markdownlint](./lint-markdownlint.md) |
| `.prettierrc.js` | Code formatting | [Lint Prettier](./lint-prettier.md) |
| `.spectral.yaml` | YAML workflow validation | [Workflow Spectral](./workflow-spectral.md) |
| `.husky/` | Git hooks automation | [Workflow Husky](./workflow-husky.md) |
| `jest.config.js` | JavaScript testing | [Project Jest](./project-jest.md) |
| `.babelrc.js` | JavaScript compilation | [Project Babel](./project-babel.md) |
| `postcss.config.js` | CSS processing | [Project PostCSS](./project-postcss.md) |
| `.all-contributorsrc` | Contributor recognition | [Project Contributors](./project-contributors.md) |

## File Naming Convention

Our configuration files follow a **hierarchical naming system** for better organization:

### **Naming Pattern:** `{category}-{tool}.md`

| Category | Pattern | Examples | Purpose |
|----------|---------|----------|---------|
| **MCP Servers** | `mcp-server-{name}.md` | `mcp-server-github.md`, `mcp-server-playwright.md` | Model Context Protocol servers |
| **VS Code** | `vscode-{feature}.md` | `vscode-settings.md`, `vscode-mcp.md` | Editor configuration & setup |
| **NPM/Node.js** | `npm-{tool}.md` | `npm-package-json.md`, `npm-scripts.md` | Node.js ecosystem & tooling |
| **Linting Tools** | `lint-{tool}.md` | `lint-eslint.md`, `lint-stylelint.md` | Code quality & formatting |
| **Workflow Tools** | `workflow-{tool}.md` | `workflow-husky.md`, `workflow-spectral.md` | CI/CD & automation tools |
| **Project Tools** | `project-{tool}.md` | `project-jest.md`, `project-babel.md` | Development & build tools |
| **WordPress** | `wp-{feature}.md` | `wp-theme-json.md` *(planned)* | WordPress-specific configs |

### **Benefits of This System:**

- ✅ **Grouped Browsing:** Related configurations appear together
- ✅ **Quick Identification:** Category is immediately obvious  
- ✅ **Scalable:** Easy to add new configurations in existing categories
- ✅ **Searchable:** Find all configs for a specific tool type instantly

## Organization Standards

All configuration documentation in this directory follows these standards:

- **Consistent Structure**: Each file includes purpose, setup, usage, and integration
- **Examples**: Real configuration examples from LightSpeed projects
- **Best Practices**: Recommended settings and common patterns
- **Troubleshooting**: Common issues and solutions
- **Cross-References**: Links to related configurations and documentation

### Documentation Template

All configuration documentation follows the standardized template defined in:

- **[Tool Configuration Documentation Template](./tools.instructions.md)** - Blueprint for all config documentation

This template ensures consistency across all tool configuration files and includes:
- Purpose and scope
- When and how the tool runs
- Exact scripts and commands
- Severity and failure modes
- Suppression and ignoring strategies
- Version pinning and reproducibility
- Maintenance ownership and review cadence
- ROI vs cost analysis
- References and further reading

## Contributing

When adding new configuration documentation:

1. Follow the **[Tool Configuration Documentation Template](./tools.instructions.md)**
2. Include practical examples and use cases
3. Document integration with other tools
4. Update this index file with the new configuration
5. Cross-reference in related documentation
6. Ensure all npm script references are validated by `scripts/verify-docs-commands.js`

See [Contributing Guidelines](../../CONTRIBUTING.md) for more details.
