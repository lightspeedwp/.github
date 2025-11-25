---
title: "Linting Documentation"
description: "Linting configuration, strategies, and documentation for all supported languages in LightSpeedWP projects."
version: "v1.0"
last_updated: "2025-11-24"
file_type: "documentation"
owners: ["lightspeedwp/maintainers"]
tags: ["linting", "code-quality", "configuration"]
---

# Linting Documentation

This folder contains linting strategy, configuration documentation, and troubleshooting guides for all code quality tools used in LightSpeed projects.

## Contents Overview

This directory documents:

- Linting configuration files and their purposes
- Tool-specific strategies and best practices
- Integration with CI/CD pipelines
- Pre-commit hook setup
- Troubleshooting common linting issues
- Performance optimization for linting

## Quick Reference

### Configuration Files

All main linting configuration is stored at the repository root:

```
.eslintrc.json or eslint.config.js    # JavaScript/TypeScript
.stylelintrc.json                      # CSS/SCSS
.markdownlint.json                     # Markdown
.htmlvalidate.json                     # HTML
.yamllint                              # YAML
phpcs.xml.dist                         # PHP
pyproject.toml                         # Python (Black/Ruff)
.shellcheckrc                          # Shell
prettier.config.js                     # Code formatter
```

### npm Scripts

```bash
npm run lint          # Run core linters (JS, CSS, YAML, pkg-json)
npm run lint:all      # All linters including markdown
npm run lint:js       # JavaScript/TypeScript only
npm run lint:css      # CSS/SCSS only
npm run lint:md       # Markdown only
npm run lint:yaml     # YAML only
npm run lint:workflows # GitHub workflows

npm run format        # Auto-format all files
npm run format:js     # Format JS files
npm run format:css    # Format CSS files
npm run format:md     # Format Markdown files
```

## Linting by Language

| Language | Linter | Config | Status | Notes |
|---|---|---|---|---|
| JavaScript | ESLint | `.eslintrc.json` or `eslint.config.js` | ✅ Active | Supports JS, TS, JSX, TSX |
| CSS/SCSS | Stylelint | `.stylelintrc.json` | ✅ Active | WordPress CSS standards |
| Markdown | markdownlint | `.markdownlint.json` | ✅ Active | Documentation consistency |
| YAML | yamllint | `.yamllint` | ✅ Active | GitHub workflows, config files |
| JSON | Prettier | `prettier.config.js` | ✅ Active | Schema validation via AJV |
| HTML | html-validate | `.htmlvalidate.json` | ✅ Active | Accessibility-first validation |
| PHP | PHPCS | `phpcs.xml.dist` | ✅ Active | WordPress Coding Standards |
| Python | Black/Ruff | `pyproject.toml` | ✅ Active | PEP8 compliance |
| Shell | ShellCheck | `.shellcheckrc` | ✅ Active | Bash/sh script linting |

## Features

### Automatic Fixing

Most linters support auto-fixing common issues:

```bash
npm run format              # Fix all supported files
npx eslint --fix src/      # Fix specific ESLint issues
npx stylelint --fix src/   # Fix CSS issues
composer lint:fix          # Fix PHP issues with phpcbf
```

### Integration with Tools

- **VS Code**: Install extensions from `.vscode/extensions.json`
- **Pre-commit**: Husky hooks run on `git commit`
- **CI/CD**: GitHub Actions validate all PRs
- **IDE**: Real-time feedback in most editors

### Performance Optimization

- Caching enabled for faster subsequent runs
- Parallel execution where possible
- Incremental checking on file changes
- Only-changed-files checking in CI

## Pre-commit Hooks

Linting runs automatically before commits:

```bash
# Install hooks
npm run husky:install

# Skip linting (if necessary)
git commit --no-verify
```

Hooks verify:

- ESLint for JavaScript changes
- Stylelint for CSS changes
- Prettier formatting
- PHPCS for PHP changes
- markdownlint for Markdown

## CI/CD Integration

All linting is validated in GitHub Actions:

```yaml
# Main linting workflow
.github/workflows/lint.yml

# Quality gates that include linting
.github/workflows/quality-gates.yml
```

### CI Rules

- ❌ PRs fail if linting errors detected
- ✅ Auto-fixable issues can be auto-fixed in PR
- 📋 Reports generated for review
- 🔒 Required checks must pass before merge

## Troubleshooting

### ESLint Issues

```bash
# Clear cache
npx eslint --cache --reset

# Check specific file
npx eslint file.js --debug

# Show all rules
npx eslint --print-config file.js
```

### Stylelint Issues

```bash
# Check syntax
npx stylelint src/ --aei

# Get specific rules
npx stylelint src/ --print-config
```

### PHP Issues

```bash
# Check PHPCS
composer lint src/

# Auto-fix
vendor/bin/phpcbf src/

# Show standard
phpcs --standard=WordPress
```

### Markdown Issues

```bash
# Check specific file
npx markdownlint path/to/file.md

# Fix common issues
npx markdownlint --fix path/to/file.md
```

## Performance Tips

✅ **Optimize Linting**:

- Use `npm run lint` (fast) instead of `npm run lint:all` unless needed
- Enable caching: already configured
- Use VSCode for real-time feedback
- Skip verify only when necessary

❌ **Avoid**:

- Running `npm run lint:all` multiple times
- Linting without caching
- Committing files that fail linting
- Ignoring pre-commit hook errors

## Configuration Philosophy

All configuration prioritizes:

1. **WordPress Standards** - Follow official WordPress conventions
2. **Consistency** - Unified style across all projects
3. **Accessibility** - WCAG 2.2 compliance
4. **Performance** - Minimal overhead
5. **Developer Experience** - Clear errors, easy fixing

## Related Documentation

- [Coding Standards](../CODING-STYLE.md)
- [VS Code Setup](../config/vscode-settings.md)
- [Quality Gates](../QUALITY-GATES.md)
- [GitHub Workflows](../WORKFLOWS.md)

---

For complete linting instructions by language, see `.github/instructions/linting/`.
