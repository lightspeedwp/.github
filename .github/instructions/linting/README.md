---
title: "Linting Instructions by Language"
description: "Language-specific linting and formatting standards for all LightSpeedWP projects."
version: "v1.0"
last_updated: "2025-11-24"
file_type: "documentation"
owners: ["lightspeedwp/maintainers"]
tags: ["linting", "code-quality", "formatting"]
---

# Linting Instructions by Language

This folder contains comprehensive linting and formatting instructions for each supported programming language and file type used across LightSpeed projects.

## Language-Specific Instructions

| Language/Format | File | Tools | Coverage |
|---|---|---|---|
| **JavaScript/TypeScript** | `linting-javascript.instructions.md` | ESLint, Prettier | `.js, .jsx, .ts, .tsx` |
| **CSS/SCSS/Sass** | `linting-css.instructions.md` | Stylelint, Prettier | `.css, .scss, .sass` |
| **HTML** | `linting-html.instructions.md` | html-validate, Prettier | `.html, .htm` |
| **JSON** | `linting-json.instructions.md` | Prettier, AJV | `.json` |
| **Markdown** | `linting-markdown.instructions.md` | markdownlint, Prettier | `.md` |
| **YAML** | `linting-yaml.instructions.md` | yamllint, Spectral | `.yml, .yaml` |
| **PHP** | `linting-php.instructions.md` | PHPCS, WordPress standards | `.php` |
| **Python** | `linting-python.instructions.md` | Black, Ruff, mypy | `.py` |
| **Shell** | `linting-shell.instructions.md` | ShellCheck, strict mode | `.sh, .bash` |
| **Tests** | `linting-tests.instructions.md` | Jest, Playwright, Bats, pytest | Multi-language test linting |

## File Structure

Each instruction file contains:

- **Role** - Linter's responsibility and scope
- **Configuration** - Tool setup and configuration files
- **Setup** - Installation and initialization steps
- **Rules & Practices** - Standards and best practices
- **Running & Fixing** - Execution commands and auto-fix procedures
- **References** - Official documentation links

## Quick Setup Commands

```bash
# JavaScript/TypeScript
npm run lint:js

# CSS
npm run lint:css

# HTML
npm run lint:html

# JSON
npm run lint:json

# Markdown
npm run lint:md

# YAML
npm run lint:yaml

# All linting
npm run lint:all
```

## Configuration Files

Core configuration files for all linters:

| Config File | Purpose | Languages |
|---|---|---|
| `.eslintrc.json` / `eslint.config.js` | JavaScript/TypeScript linting | JS, TS, JSX, TSX |
| `.stylelintrc.json` | CSS/SCSS/Sass linting | CSS, SCSS, Sass |
| `.markdownlint.json` | Markdown linting | Markdown |
| `.htmlvalidate.json` | HTML validation | HTML |
| `.yamllint` | YAML linting | YAML |
| `phpcs.xml.dist` | PHP code sniffer | PHP |
| `pyproject.toml` | Python Black/Ruff config | Python |
| `.shellcheckrc` | Shell script linting | Shell/Bash |

## Standards Compliance

All linting configurations align with:

- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/)
- [LightSpeed Coding Standards](../coding-standards.instructions.md)
- [WCAG 2.2 Accessibility Guidelines](https://www.w3.org/TR/WCAG22/)
- Industry best practices and conventions

## Automation

### Pre-commit Hooks

Linting is automatically enforced via Husky pre-commit hooks:

```bash
npm run husky:install
```

Hooks run:

- ESLint for JavaScript changes
- Stylelint for CSS changes
- markdownlint for Markdown changes
- PHPCS for PHP changes
- yamllint for YAML changes

### CI/CD Integration

All linting checks run in GitHub Actions via:

- `.github/workflows/lint.yml` - Main linting workflow
- `.github/workflows/quality-gates.yml` - Quality gate validation

## Best Practices

### Before Committing

```bash
# Check all linting rules
npm run lint:all

# Auto-fix where possible
npm run format

# Check specific language
npm run lint:js
npm run lint:css
npm run lint:md
```

### Editor Integration

Configure your editor for automatic linting:

- VS Code: Install recommended extensions from `.vscode/extensions.json`
- Sublime Text: Install SublimeLinter plugins
- PhpStorm: Built-in linting support

## Troubleshooting

### Common Issues

**ESLint errors?**

- Clear cache: `npx eslint --cache --reset`
- Check node version: `node --version` (should be 20+)

**Stylelint issues?**

- Check CSS syntax carefully
- Run `npm run lint:css -- --fix` to auto-correct

**PHP errors?**

- Run `composer lint` to check PHPCS
- Use `vendor/bin/phpcbf` to auto-fix

**Markdown formatting?**

- Check indent consistency (2 spaces)
- Verify heading hierarchy

## Integration Points

Linting instructions are referenced by:

- `.github/instructions/coding-standards.instructions.md` - Main coding standards
- `.github/workflows/lint.yml` - GitHub Actions workflow
- `.github/custom-instructions.md` - Copilot instructions
- `package.json` - npm scripts for linting commands
- `.vscode/settings.json` - VS Code configuration

## For New Languages

To add linting for a new language:

1. Create `linting-<language>.instructions.md` in this folder
2. Document configuration setup and tools
3. Provide installation and running instructions
4. Add npm script to `package.json`
5. Update `.github/workflows/lint.yml` if needed
6. Add entry to this README

---

For more details, see the [main Linting Index](../linting.instructions.md) or reference [Coding Standards](../coding-standards.instructions.md).
