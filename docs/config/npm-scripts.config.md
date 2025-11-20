---
file_type: "documentation"
title: "NPM Scripts Configuration"
description: "Complete reference for all npm scripts and commands defined in package.json"
version: "1.0.0"
last_updated: "2025-11-20"
owner: "LightSpeed Engineering"
tags: ["npm", "scripts", "cli", "automation", "build", "test", "lint"]
---

# NPM Scripts Configuration

## Overview

NPM scripts in `package.json` provide command-line interfaces to build tools, linters, formatters, and test runners. This document catalogs all available scripts and their purposes.

## Available Scripts

### Linting Scripts

#### `npm run lint`

**Purpose**: Run core linters (JS, CSS, YAML, package.json)
**Tools**: ESLint, Stylelint, yamllint, npmPackageJsonLint
**Command**: `npm run lint`
**When to use**: Quick local validation before commit

#### `npm run lint:all`

**Purpose**: Run all linters including Markdown
**Tools**: ESLint, Stylelint, Spectral, yamllint, markdownlint, npmPackageJsonLint
**Command**: `npm run lint:all`
**When to use**: Pre-PR validation, CI/CD pipelines

#### `npm run lint:js`

**Purpose**: Lint JavaScript/TypeScript files with ESLint
**Command**: `eslint '**/*.{js,jsx,ts,tsx}' --fix`
**Config**: `.eslint.config.cjs`
**When to use**: Before committing JS/TS changes

#### `npm run lint:css`

**Purpose**: Lint CSS/SCSS files with Stylelint
**Command**: `stylelint '**/*.{css,scss}' --fix`
**Config**: `.stylelint.config.cjs`
**When to use**: Before committing CSS/SCSS changes

#### `npm run lint:md`

**Purpose**: Lint Markdown files with markdownlint
**Command**: `markdownlint-cli2 '**/*.md' --fix`
**Config**: `.markdownlint-cli2.config.cjs`
**When to use**: Before committing documentation changes

#### `npm run lint:yaml`

**Purpose**: Lint YAML files with Spectral
**Command**: `spectral lint '**/*.{yml,yaml}' --ruleset .spectral.config.js`
**Config**: `.spectral.config.cjs`
**When to use**: Before committing YAML/workflow files

#### `npm run lint:workflows`

**Purpose**: Lint GitHub workflow YAML files specifically
**Command**: `spectral lint '.github/workflows/**/*.{yml,yaml}' --ruleset .spectral.config.js`
**Config**: `.spectral.config.cjs`
**When to use**: Before committing workflow changes

#### `npm run lint:pkg-json`

**Purpose**: Lint package.json files
**Command**: `npmPkgJsonLint`
**Config**: `.npmpackagejsonlint.config.cjs`
**When to use**: After modifying package.json

### Formatting Scripts

#### `npm run format`

**Purpose**: Format all supported files (JS, CSS, YAML, Markdown)
**Tools**: Prettier, ESLint, Stylelint, markdownlint
**Command**: Runs all format:\* scripts
**When to use**: Before committing to ensure consistent formatting

#### `npm run format:js`

**Purpose**: Format JS/TS/JSON files
**Tools**: Prettier, ESLint
**Command**: `prettier --write '**/*.{js,jsx,ts,tsx,json}'`
**When to use**: Format code before commit

#### `npm run format:css`

**Purpose**: Format CSS/SCSS files
**Tools**: Prettier, Stylelint
**Command**: `prettier --write '**/*.{css,scss}'`
**When to use**: Format styles before commit

#### `npm run format:md`

**Purpose**: Format Markdown files
**Tools**: Prettier, markdownlint
**Command**: `prettier --write '**/*.md'`
**When to use**: Format documentation before commit

### Testing Scripts

#### `npm test` / `npm run test`

**Purpose**: Run all tests (Jest unit tests)
**Framework**: Jest
**Command**: `jest`
**Config**: `.jest.config.cjs`
**Coverage**: Generated in `coverage/` directory
**When to use**: Before commit and in CI/CD

#### `npm run test:js`

**Purpose**: Run Jest tests with coverage reporting
**Command**: `jest --coverage --forceExit --detectOpenHandles`
**Config**: `.jest.config.cjs`
**Coverage Target**: 80% for production code
**When to use**: Final validation before PR

#### `npm run test:coverage`

**Purpose**: Alias for test:js - generate coverage report
**When to use**: Coverage analysis and reporting

### Build Scripts

#### `npm run build`

**Purpose**: Build project for production
**When to use**: Creating deployable artifacts

### Utility Scripts

#### `npm run contributors`

**Purpose**: Update contributors list
**Tool**: all-contributors-cli
**Config**: `.all-contributors.config.cjs`
**When to use**: After accepting contributor PR

#### `npm run metrics:ci`

**Purpose**: Collect and report metrics in CI environment
**When to use**: CI/CD pipeline for analysis

#### `npm run validate:frontmatter`

**Purpose**: Validate YAML frontmatter in documentation
**When to use**: Documentation validation

#### `npm run validate:changelog`

**Purpose**: Validate CHANGELOG.md format
**When to use**: Before release

## Common Workflows

### Before Committing

```bash
npm run lint
npm run format
npm run test
```

### Before Creating PR

```bash
npm run lint:all
npm run format
npm run test:js
```

### CI/CD Pipeline

```bash
npm run lint:all
npm run test:js
npm run build
```

### Documentation Update

```bash
npm run lint:md
npm run format:md
npm run validate:frontmatter
```

### Workflow Update

```bash
npm run lint:workflows
npm run format:yaml
```

## Script Organization by Tool

### ESLint-based Scripts

- `npm run lint:js`
- `npm run format:js`

### Prettier Integration

- `npm run format`
- `npm run format:js`
- `npm run format:css`
- `npm run format:md`

### Stylelint-based Scripts

- `npm run lint:css`
- `npm run format:css`

### YAML Validation

- `npm run lint:yaml`
- `npm run lint:workflows`

### Markdown Validation

- `npm run lint:md`
- `npm run format:md`

### Testing

- `npm test`
- `npm run test:js`
- `npm run test:coverage`

## Configuration Files Reference

| Script             | Config File                      | Format   |
| ------------------ | -------------------------------- | -------- |
| ESLint             | `.eslint.config.cjs`             | CommonJS |
| Prettier           | `.prettier.config.cjs`           | CommonJS |
| Stylelint          | `.stylelint.config.cjs`          | CommonJS |
| Jest               | `.jest.config.cjs`               | CommonJS |
| Markdownlint       | `.markdownlint-cli2.config.cjs`  | CommonJS |
| Spectral           | `.spectral.config.cjs`           | CommonJS |
| npmPackageJsonLint | `.npmpackagejsonlint.config.cjs` | CommonJS |
| all-contributors   | `.all-contributors.config.cjs`   | CommonJS |

## Troubleshooting

### "Command not found" errors

- Ensure `npm install` has been run
- Check `node_modules/.bin` contains the tool

### Formatting conflicts

- Run `npm run format` to ensure consistency
- Verify all config files are present and valid

### Test failures

- Check `.jest.config.cjs` for proper test patterns
- Ensure test files match `**/*.test.js` pattern

### YAML validation errors

- Verify workflow files use 2-space indentation
- Check `.spectral.config.cjs` for active rulesets

## Related Documentation

- [ESLint Configuration](./eslint.config.md)
- [Prettier Configuration](./prettier.config.md)
- [Stylelint Configuration](./stylelint.config.md)
- [Jest Configuration](./jest.config.md)
- [Markdownlint Configuration](./markdownlint.config.md)
- [Spectral Configuration](./spectral.config.md)
- [YAML/Workflow Documentation](./workflow-yaml.md)

---

**Last Updated**: 2025-11-20  
**Maintained by**: LightSpeed Engineering  
**Status**: Active
