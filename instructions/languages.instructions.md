---
file_type: "instructions"
title: "Programming Languages Standards"
description: "Unified linting, formatting, and documentation standards for JavaScript, TypeScript, JSON, and YAML across all GitHub repositories"
version: "v1.0"
last_updated: "2025-12-07"
owners: ["GitHub Community Health Team"]
tags:
  ["javascript", "typescript", "json", "yaml", "linting", "formatting", "jsdoc"]
applyTo: ["**/*.{js,jsx,ts,tsx,mjs,cjs}", "**/*.json", "**/*.{yml,yaml}"]
status: "active"
stability: "stable"
domain: "generic"
---

# Programming Languages Standards

You are a languages quality assistant. Follow our JavaScript, TypeScript, JSON, and YAML standards to lint, format, and document code consistently. Avoid custom lint rules, schema drift, or unpinned tool versions outside the documented configurations.

## Overview

Applies to JS/TS, JSON, and YAML across automation, workflows, and configs. Covers linters, formatters, schemas, and documentation standards. Excludes language-specific project rules unless referenced.

## General Rules

- Use pinned ESLint/Prettier/yamllint configs and follow documented scripts.
- Keep schemas and types in sync; avoid ad hoc rule changes.
- Document code with JSDoc where applicable and follow repository standards.
- Align with CI and pre-commit hooks for lint/format enforcement.

## Detailed Guidance

- Follow the language-specific sections below for configuration, documentation, and lint/format commands.
- Use CI/CD integration notes to ensure consistent enforcement.

## Examples

- **Good:** Run `npm run lint:js` with pinned configs, validate JSON against schemas, lint YAML with yamllint/actionlint.
- **Avoid:** Introducing new lint rules without documentation or skipping schema validation.

## Validation

- Execute language-specific lint/format scripts before commit/CI.
- Validate JSON with schemas (e.g., AJV) and run yamllint/actionlint for YAML.
- Ensure JSDoc comments align with types and lint rules.

## Table of Contents

- [JavaScript & TypeScript](#javascript--typescript)
  - [Configuration](#js-configuration)
  - [JSDoc Documentation](#jsdoc-documentation)
  - [Linting & Formatting](#js-linting--formatting)
- [JSON](#json)
  - [Configuration](#json-configuration)
  - [Schema Validation](#json-schema-validation)
  - [Formatting](#json-formatting)
- [YAML](#yaml)
  - [Configuration](#yaml-configuration)
  - [Linting](#yaml-linting)
  - [GitHub Actions](#yaml-github-actions)
- [CI/CD Integration](#cicd-integration)
- [References](#references)

---

## JavaScript & TypeScript

### JS Configuration

**Linters:**

- [ESLint](https://eslint.org/) - Code quality and style enforcement
- [Prettier](https://prettier.io/) - Code formatting

**Config Files:**

- Flat config: [`eslint.config.js`](../eslint.config.js) or [`eslint.config.mjs`](../eslint.config.mjs)
- Classic config: [`.eslintrc.json`](../.eslintrc.json) or [`.eslintrc.cjs`](../.eslintrc.cjs)
- Formatter: [`prettier.config.js`](../prettier.config.js)
- Editor: [`.editorconfig`](../.editorconfig)

**NPM Scripts:**

```json
{
  "scripts": {
    "lint:js": "eslint '**/*.{js,jsx,ts,tsx}' --fix"
  }
}
```

**Setup:**

1. Install dependencies:

   ```bash
   npm install --save-dev eslint prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-prettier eslint-plugin-prettier husky
   ```

2. Configure ESLint (choose flat or classic config)

3. Add NPM script (see above)

4. Optional pre-commit hook:

   ```bash
   npx husky add .husky/pre-commit "npm run lint:js"
   ```

### JSDoc Documentation

Follow JSDoc standards for documenting JavaScript and TypeScript code in GitHub automation scripts, workflows, and community tools.

#### Principles

- Document **public functions, classes, utilities, and GitHub Actions**
- Keep comments **close to the code**
- Prefer **examples over theory**
- Align with **ESLint/TypeScript** types

#### Required Documentation Blocks

**Functions:**

```javascript
/**
 * Get a paginated slice of items.
 * @param {T[]} items - The full list.
 * @param {number} page - Page index (0-based).
 * @param {number} perPage - Items per page.
 * @returns {T[]} The items to render on this page.
 * @template T
 * @example
 * getPage([1,2,3,4], 1, 2) // => [3,4]
 */
export function getPage(items, page, perPage) {
  const start = page * perPage;
  return items.slice(start, start + perPage);
}
```

**Classes:**

```javascript
/**
 * Class for handling GitHub issue labeling.
 *
 * @since 1.0.0
 */
class LabelHandler {
  /**
   * Constructor.
   *
   * @param {Object} options - Configuration options.
   * @param {string} options.repo - Repository name.
   * @param {boolean} [options.dryRun=false] - Whether to run in dry-run mode.
   */
  constructor(options) {
    // Implementation
  }

  /**
   * Apply labels to an issue.
   *
   * @param {number} issueNumber - Issue number.
   * @param {string[]} labels - Labels to apply.
   * @returns {Promise<void>}
   */
  async applyLabels(issueNumber, labels) {
    // Implementation
  }
}
```

**Required Tags:**

- `@param {type} name - description` - For all parameters
- `@returns {type} description` - For return values
- `@throws {ErrorType} description` - For expected errors
- `@example` - For non-trivial functions
- `@deprecated` - For deprecated functions (include replacement)
- `@since` - Version when introduced

### JS Linting & Formatting

**Running:**

- Manual: `npm run lint:js`
- Auto-fix: `eslint '**/*.{js,jsx,ts,tsx}' --fix`
- Format: `npx prettier --write '**/*.{js,jsx,ts,tsx}'`

**Standards:**

- 2-space indentation
- Single quotes
- Strict equality (`===`)
- No unused variables
- Semicolons required

---

## JSON

### JSON Configuration

**Formatter:** [Prettier](https://prettier.io/)
**Validator:** [AJV](https://ajv.js.org/) (optional)

**Config Files:**

- Formatter: [`prettier.config.js`](../prettier.config.js)
- Editor: [`.editorconfig`](../.editorconfig)

**NPM Scripts:**

```json
{
  "scripts": {
    "lint:json": "prettier --check '**/*.json'",
    "validate:json": "ajv validate -s schemas/**/*.json -d data/**/*.json --all-errors"
  }
}
```

### JSON Schema Validation

Store schemas in `schemas/<domain>/<name>.schema.json`

**Required Schema Fields:**

```json
{
  "$id": "https://example.com/schemas/config.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Configuration Schema",
  "description": "Schema for repository configuration files",
  "version": "1.0.0",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Configuration name"
    }
  },
  "required": ["name"],
  "additionalProperties": false,
  "examples": [
    {
      "name": "example-config"
    }
  ]
}
```

**Schema Authoring Guidelines:**

- Include `$id`, `$schema`, `title`, `description`, `version`
- Define `type`, `properties`, `required`, `additionalProperties`
- Provide `examples` for documentation
- Use semantic versioning for schema versions

### JSON Formatting

**Running:**

- Check: `npm run lint:json`
- Fix: `npx prettier --write '**/*.json'`
- Validate (optional): `ajv validate -s schema.json -d data.json`

**Standards:**

- 2-space indentation
- Double quotes for strings
- No trailing commas
- Consistent property ordering

---

## YAML

### YAML Configuration

**Linters:**

- [yamllint](https://yamllint.readthedocs.io/) - YAML syntax validation
- [Spectral](https://github.com/stoplightio/spectral) - Advanced rules
- [actionlint](https://github.com/rhysd/actionlint) - GitHub Actions validation

**Config Files:**

- YAML lint: [`.yamllint`](../.yamllint)
- Spectral: [`.spectral.yaml`](../.spectral.yaml)
- Workflows: [`.spectral-workflows.yaml`](../.spectral-workflows.yaml)
- Editor: [`.editorconfig`](../.editorconfig)

**NPM Scripts:**

```json
{
  "scripts": {
    "lint:yaml": "spectral lint '**/*.{yml,yaml}' --ruleset .spectral.yaml",
    "lint:workflows": "spectral lint '.github/workflows/*.{yml,yaml}' --ruleset .spectral-workflows.yaml"
  }
}
```

**Setup:**

1. Install dependencies:

   ```bash
   pip install yamllint
   npm install --save-dev @stoplight/spectral-cli husky
   ```

2. Configure `.yamllint`, `.spectral.yaml`, and `.spectral-workflows.yaml`

3. Add NPM scripts (see above)

4. Optional pre-commit hook:

   ```bash
   npx husky add .husky/pre-commit "npm run lint:yaml"
   ```

### YAML Linting

**Running:**

- Manual: `npm run lint:yaml`
- System: `yamllint .`
- Workflows: `npm run lint:workflows`
- Actions: `actionlint .github/workflows/*.yml`

**Standards:**

- 2-space indentation
- Consistent key style
- Explicit values (no implicit truthy/falsey)
- Comments with `#` for documentation
- Use anchors/aliases for repeated blocks

### YAML GitHub Actions

**Example Workflow:**

```yaml
name: CI
on:
  pull_request:
    paths: ["**/*.{js,json,yml}"]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
      # Install and run lint
      - run: npm ci && npm run lint:all
```

**Best Practices:**

- Document complex steps with comments
- Use explicit boolean values (`true`/`false`, not `yes`/`no`)
- Validate with `actionlint` before committing
- Group related steps logically
- Use descriptive job and step names

---

## CI/CD Integration

All language standards are enforced through GitHub Actions:

**Workflow Triggers:**

- Pull requests to main/develop branches
- Pushes to protected branches
- Manual workflow dispatch

**Required Checks:**

- JavaScript/TypeScript linting passes
- JSON formatting validated
- YAML syntax validated
- GitHub Actions workflows validated
- All tests pass before merge

**CI Configuration:**

```yaml
name: Lint
on: [pull_request, push]
jobs:
  lint-js:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint:js

  lint-json:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run lint:json

  lint-yaml:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run lint:yaml
      - run: npm run lint:workflows
```

---

## References

- [instructions.instructions.md](instructions.instructions.md)
- [linting.instructions.md](linting.instructions.md)
- [coding-standards.instructions.md](coding-standards.instructions.md)
- [documentation-formats.instructions.md](documentation-formats.instructions.md)
- [workflows.instructions.md](workflows.instructions.md)
- [ESLint Documentation](https://eslint.org/)
- [Prettier Documentation](https://prettier.io/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [JSDoc Documentation](https://jsdoc.app/)
- [JSON Schema Specification](https://json-schema.org/draft/2020-12/schema)
- [AJV Documentation](https://ajv.js.org/)
- [Prettier JSON Support](https://prettier.io/docs/en/options.html)
- [YAML Specification](https://yaml.org/spec/)
- [yamllint Documentation](https://yamllint.readthedocs.io/)
- [Spectral Documentation](https://github.com/stoplightio/spectral)
- [actionlint Documentation](https://github.com/rhysd/actionlint)
