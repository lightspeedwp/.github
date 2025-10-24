---
title: 'Linting Strategy & Implementation Guide'
version: 'v1.0'
last_updated: '2024-10-24'
author: 'LightSpeed Team'
description: 'Comprehensive guide to linting setup, configuration, and automation across LightSpeed WordPress projects'
tags:
    [
        'linting',
        'quality',
        'automation',
        'eslint',
        'stylelint',
        'prettier',
        'markdownlint',
    ]
---

# Linting Strategy & Implementation Guide

This document provides a comprehensive overview of the linting strategy, tools, and automation used across LightSpeed WordPress projects to maintain code quality, consistency, and standards compliance.

## Table of Contents

- [Overview](#overview)
- [Linting Tools](#linting-tools)
- [Configuration Files](#configuration-files)
- [NPM Scripts Integration](#npm-scripts-integration)
- [VS Code Integration](#vs-code-integration)
- [Automation & Git Hooks](#automation--git-hooks)
- [File Type Specific Linting](#file-type-specific-linting)
- [Quality Assurance Workflow](#quality-assurance-workflow)
- [Troubleshooting](#troubleshooting)
- [Related Documentation](#related-documentation)

## Overview

### Philosophy

Our linting strategy follows these core principles:

- **Consistency**: Unified coding standards across all projects
- **Automation**: Lint checks run automatically during development and CI/CD
- **Progressive Enhancement**: Start with basics, add complexity as needed
- **Developer Experience**: Fast feedback with helpful error messages
- **WordPress Standards**: Align with official WordPress coding standards

### Benefits

- 🚀 **Faster Development**: Catch issues early in the development cycle
- 🔒 **Quality Assurance**: Enforce coding standards automatically
- 🤝 **Team Consistency**: Same standards for all team members
- 📚 **Documentation**: Self-documenting code through consistent patterns
- 🔄 **CI/CD Integration**: Prevent bad code from reaching production

## Linting Tools

### Core Linting Tools

| Tool               | Purpose                       | Configuration                | Auto-fix |
| ------------------ | ----------------------------- | ---------------------------- | -------- |
| **ESLint**         | JavaScript/TypeScript linting | `eslint.config.js`           | ✅       |
| **Stylelint**      | CSS/SCSS linting              | `stylelint.config.js`        | ✅       |
| **Prettier**       | Code formatting               | `prettier.config.js`         | ✅       |
| **markdownlint**   | Markdown linting              | `.markdownlint.json`         | ✅       |
| **Spectral**       | YAML/JSON linting             | `.spectral.yaml`             | ❌       |
| **npmPkgJsonLint** | package.json validation       | `.npmpackagejsonlintrc.json` | ❌       |

### Tool Selection Rationale

#### ESLint for JavaScript/TypeScript

- **Modern flat config** (`eslint.config.js`) for ESLint 9+
- **TypeScript support** with `typescript-eslint`
- **Prettier integration** to avoid formatting conflicts
- **Environment-based configuration** via `.env` variables

#### Stylelint for CSS/SCSS

- **WordPress CSS standards** alignment
- **SCSS syntax support** for modern CSS workflows
- **Auto-fixing** for spacing, formatting, and ordering

#### Prettier for Code Formatting

- **Consistent formatting** across all supported file types
- **Integration** with ESLint and Stylelint to avoid conflicts
- **Configurable** via environment variables

## Configuration Files

### Modern ESLint Configuration (Flat Config)

```javascript
// eslint.config.js
import 'dotenv/config';
import js from '@eslint/js';
import ts from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';

const ignoreFolders = process.env.ESLINT_IGNORE
    ? process.env.ESLINT_IGNORE.split(',')
    : [
          'node_modules/**',
          'build/**',
          'dist/**',
          'coverage/**',
          'playwright-report/**',
          'test-results/**',
          'vendor/**',
          '.next/**',
          'logs/**',
      ];

export default [
    js.configs.recommended,
    ...ts.configs.recommended,
    {
        files: ['**/*.{js,jsx,ts,tsx,cjs,mjs}'],
        ignores: ignoreFolders,
        plugins: { prettier },
        rules: {
            'prettier/prettier': 'warn',
        },
    },
];
```

### Environment Configuration

```bash
# .env - Customize linting behaviour
ESLINT_IGNORE=node_modules/**,build/**,custom-folder/**
PRETTIER_TAB_WIDTH=4
PRETTIER_USE_TABS=false
PRETTIER_PRINT_WIDTH=80
```

### Key Configuration Files

| File                       | Purpose                            | Environment Support  |
| -------------------------- | ---------------------------------- | -------------------- |
| `eslint.config.js`         | ESLint flat configuration          | ✅ `ESLINT_IGNORE`   |
| `prettier.config.js`       | Prettier formatting rules          | ✅ Multiple env vars |
| `.markdownlint.json`       | Markdown linting rules             | ❌                   |
| `.spectral.yaml`           | YAML/JSON schema validation        | ❌                   |
| `.spectral-workflows.yaml` | GitHub Actions workflow validation | ❌                   |

## NPM Scripts Integration

### Core Linting Scripts

```json
{
    "scripts": {
        "lint": "npm run lint:js && npm run lint:css && npm run lint:yaml && npm run lint:pkg-json",
        "lint:all": "npm run lint && npm run lint:workflows && npm run lint:md",
        "lint:js": "eslint '**/*.{js,jsx,ts,tsx}' --fix",
        "lint:css": "stylelint '**/*.{css,scss}' --fix",
        "lint:md": "markdownlint '**/*.md' --fix",
        "lint:yaml": "spectral lint '**/*.{yml,yaml}' --ruleset .spectral.yaml",
        "lint:workflows": "spectral lint '.github/workflows/*.{yml,yaml}' --ruleset .spectral-workflows.yaml",
        "lint:pkg-json": "npmPkgJsonLint ."
    }
}
```

### Formatting Scripts

```json
{
    "scripts": {
        "format": "npm run format:js && npm run format:css",
        "format:js": "prettier '**/*.{js,jsx,ts,tsx}' --write && prettier '**/*.json' --write && eslint '**/*.{js,jsx,ts,tsx}' --fix --format",
        "format:css": "prettier '**/*.{css,scss}' --write && stylelint '**/*.{css,scss}' --fix",
        "format:md": "prettier '**/*.md' --write"
    }
}
```

### Usage Examples

```bash
# Run all linting (core tools)
npm run lint

# Run comprehensive linting (includes workflows and markdown)
npm run lint:all

# Fix specific file types
npm run lint:js
npm run lint:css

# Format code
npm run format
```

## VS Code Integration

### Recommended Extensions

```json
{
    "recommendations": [
        "esbenp.prettier-vscode",
        "dbaeumer.vscode-eslint",
        "stylelint.vscode-stylelint",
        "DavidAnson.vscode-markdownlint",
        "stoplight.spectral"
    ]
}
```

### Settings Configuration

The `.vscode/settings.json` file provides:

- **Format on save** for all supported file types
- **ESLint integration** with auto-fix on save
- **Stylelint validation** for CSS/SCSS files
- **File associations** for custom file types
- **Problem matchers** for terminal integration

### Key VS Code Settings

```jsonc
{
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true,
        "source.fixAll.stylelint": true,
    },
    "eslint.validate": [
        "javascript",
        "javascriptreact",
        "typescript",
        "typescriptreact",
    ],
    "stylelint.validate": ["css", "scss", "sass"],
}
```

## Automation & Git Hooks

### Pre-commit Integration

Linting is automated through Git hooks managed by [Husky](./config/workflow-husky.md) and [lint-staged](./config/workflow-lint-staged.md):

```json
{
    "husky": {
        "hooks": {
            "pre-commit": "lint-staged"
        }
    },
    "lint-staged": {
        "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
        "*.{css,scss}": ["stylelint --fix", "prettier --write"],
        "*.md": ["markdownlint --fix", "prettier --write"]
    }
}
```

### CI/CD Integration

```yaml
# .github/workflows/lint.yml
name: Lint
on: [push, pull_request]
jobs:
    lint:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
            - uses: actions/setup-node@v4
              with:
                  node-version: '20'
                  cache: 'npm'
            - run: npm ci
            - run: npm run lint:all
```

## File Type Specific Linting

### JavaScript/TypeScript

- **ESLint** with TypeScript support
- **Prettier** integration for formatting
- **WordPress coding standards** alignment
- **Auto-fix** for most issues

**Key Rules:**

- 2-space indentation
- Single quotes for strings
- Semicolons required
- No unused variables
- Consistent naming conventions

### CSS/SCSS

- **Stylelint** with WordPress CSS standards
- **Auto-fix** for property ordering and formatting
- **SCSS syntax support** for modern workflows

**Key Rules:**

- Alphabetical property ordering
- Consistent indentation
- No duplicate selectors
- Valid CSS properties

### Markdown

- **markdownlint** for consistent documentation
- **Auto-fix** for formatting issues
- **Custom rules** for project-specific needs

**Key Rules:**

- Consistent heading styles
- Proper list formatting
- No trailing whitespace
- Consistent link formatting

### YAML

- **Spectral** for schema validation
- **Separate configs** for workflows vs general YAML
- **GitHub Actions** specific validation

### JSON

- **Prettier** for formatting
- **npmPkgJsonLint** for package.json validation
- **Schema validation** where applicable

## Quality Assurance Workflow

### Development Workflow

1. **Write Code** - Focus on functionality
2. **Save File** - Auto-format and lint on save (VS Code)
3. **Pre-commit** - Automated linting of staged files
4. **Push** - Optional pre-push hooks for comprehensive checks
5. **CI/CD** - Automated linting in GitHub Actions

### Quality Gates

| Stage          | Tools                       | Action on Failure           |
| -------------- | --------------------------- | --------------------------- |
| **Editor**     | ESLint, Stylelint, Prettier | Visual indicators, auto-fix |
| **Pre-commit** | lint-staged + all linters   | Block commit                |
| **CI/CD**      | All linting tools           | Block merge                 |

### Manual Quality Checks

```bash
# Quick quality check
npm run lint

# Comprehensive check (includes all file types)
npm run lint:all

# Check specific issues
eslint src/components/Button.js
stylelint src/styles/main.scss
markdownlint README.md
```

## Troubleshooting

### Common Issues

#### ESLint Configuration Errors

```bash
# Check ESLint configuration
npx eslint --print-config src/index.js

# Test specific files
npx eslint src/components/Button.js --debug
```

#### Prettier Conflicts

```bash
# Check for conflicting rules
npx eslint-config-prettier src/index.js
```

#### VS Code Integration Issues

1. **Restart ESLint Server**: Command Palette → "ESLint: Restart ESLint Server"
2. **Check Output Panel**: View → Output → ESLint
3. **Verify Extensions**: Ensure recommended extensions are installed

#### Performance Issues

```bash
# Check ignored patterns
echo $ESLINT_IGNORE

# Verify .gitignore patterns are working
npx eslint --debug
```

### Debugging Steps

1. **Check configuration files** exist and are valid
2. **Verify npm scripts** match current tooling setup
3. **Test individual tools** before combined scripts
4. **Check environment variables** if using custom configs
5. **Review VS Code settings** for editor integration

## Related Documentation

### Configuration Files

- **[ESLint Configuration](./config/lint-eslint.md)** - Detailed ESLint setup
- **[Stylelint Configuration](./config/lint-stylelint.md)** - CSS linting configuration
- **[Prettier Configuration](./config/lint-prettier.md)** - Code formatting setup
- **[Markdownlint Configuration](./config/lint-markdownlint.md)** - Markdown linting rules

### Automation & Workflows

- **[Husky Configuration](./config/workflow-husky.md)** - Git hooks setup
- **[Lint-staged Configuration](./config/workflow-lint-staged.md)** - Pre-commit automation
- **[NPM Scripts Configuration](./config/npm-scripts.md)** - Scripts and automation

### VS Code Integration

- **[VS Code Settings](./config/vscode-settings.md)** - Editor configuration
- **[VS Code MCP](./config/vscode-mcp.md)** - MCP server integration

### Standards & Guidelines

- **[Coding Standards](../.github/instructions/coding-standards.instructions.md)** - Organization-wide standards
- **[WordPress Standards](../.github/instructions/wordpress.instructions.md)** - WordPress-specific guidelines

---

> 💡 **Next Steps:** Configure pre-commit hooks → [HUSKY-PRECOMMITS.md](./HUSKY-PRECOMMITS.md)

---

## Husky Pre-Commit Integration

For details on how linting is enforced before commits, see [HUSKY-PRECOMMITS.md](./HUSKY-PRECOMMITS.md). This document explains how Husky is configured to run linting and other checks automatically, and how to manage or bypass hooks if needed.
