# ESLint Configuration (Flat Config)

This document explains the ESLint setup and JavaScript/TypeScript linting standards for LightSpeed projects. It uses the modern ESLint flat config format for maximum flexibility and future compatibility.

## Table of Contents

- [Configuration Files](#configuration-files)
- [WordPress Integration](#wordpress-integration)
- [npm Scripts](#npm-scripts)
- [VS Code Integration](#vs-code-integration)
- [Rules Reference](#rules-reference)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)
- [Integration](#integration)

## Configuration Files

### `eslint.config.js` (Flat Config)

We use the [ESLint flat config format](https://eslint.org/docs/latest/use/configure/configuration-files-new) (ESLint 9+), which allows for more modular and environment-aware configuration. This enables:

- TypeScript and JavaScript linting in one config
- Prettier integration for formatting
- Environment variable support for ignore patterns

### Example: Current Configuration

```javascript
import "dotenv/config";
import js from "@eslint/js";
import ts from "typescript-eslint";
import prettier from "eslint-plugin-prettier";

const ignoreFolders = process.env.ESLINT_IGNORE
  ? process.env.ESLINT_IGNORE.split(",")
  : [
      "node_modules/**",
      "build/**",
      "dist/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
      "vendor/**",
      ".next/**",
      "logs/**",
      "scripts/utility/__tests__/**",
    ];

export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx,cjs,mjs}"],
    ignores: ignoreFolders,
    plugins: { prettier },
    rules: {
      "prettier/prettier": "warn",
    },
  },
];
```

### Environment Variables

The configuration supports environment-based ignore patterns for flexibility across CI, local, and custom environments:

```bash
# .env file
ESLINT_IGNORE=node_modules/**,build/**,custom-folder/**
```

## WordPress Integration

### Recommended Packages

```json
{
  "devDependencies": {
    "eslint": "^8.0.0",
    "eslint-plugin-prettier": "^5.0.0",
    "eslint-config-prettier": "^9.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "typescript-eslint": "^6.0.0",
    "@eslint/js": "^8.0.0",
    "prettier": "^3.0.0",
    "dotenv": "^16.4.5"
  }
}
```

### Coding Standards

- Follows [WordPress JavaScript Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/)
- 2-space indentation
- Single quotes for strings
- Semicolons required
- camelCase naming convention

## npm Scripts

### Package.json Integration

```json
{
  "scripts": {
    "lint:js": "eslint '**/*.{js,jsx,ts,tsx}' --fix",
    "format:js": "prettier '**/*.{js,jsx,ts,tsx}' --write && prettier '**/*.json' --write && eslint '**/*.{js,jsx,ts,tsx}' --fix --format"
  }
}
```

## VS Code Integration

### Settings Configuration

```json
{
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Rules Reference

### Code Quality

- `no-unused-vars` - Prevent unused variables
- `no-console` - Warn on console statements
- `prefer-const` - Prefer const over let when possible

### WordPress/General Rules

- `no-unused-vars` - Prevent unused variables
- `no-console` - Warn on console statements
- `prefer-const` - Prefer const over let when possible

## Usage

### Local Development

```bash
# Run linting
npm run lint:js

# Fix auto-fixable issues
eslint --fix **/*.js

# Check specific file
eslint src/blocks/example/index.js
```

### CI/CD Integration

```yaml
# GitHub Actions
- name: Lint JavaScript
    run: npm run lint:js
```

## Troubleshooting

### Common Issues

#### "Parsing error: The keyword 'import' is reserved"

- Update `languageOptions.sourceType` to `'module'`
- Ensure `ecmaVersion` is set to `'latest'`

#### VS Code not showing ESLint errors

1. Install ESLint extension
2. Check output panel for ESLint errors
3. Verify workspace settings include ESLint validation

#### WordPress blocks not linting correctly

- Ensure your block code is included in the linted file globs
- Use the flat config and TypeScript support as above

## Integration

## Workflow & Related Docs

- [LINTING.md](../LINTING.md) — Main linting strategy
- [HUSKY-PRECOMMITS.md](../HUSKY-PRECOMMITS.md) — Pre-commit automation
- [vscode-settings.md](./vscode-settings.md) — Editor integration
- [npm-scripts.md](./npm-scripts.md) — NPM automation
- [lint-prettier.md](./lint-prettier.md) — Prettier config
- [workflow-husky.md](./workflow-husky.md) — Husky setup
- [workflow-lint-staged.md](./workflow-lint-staged.md) — Lint-staged setup
- [frontmatter.schema.json](../../schemas/frontmatter.schema.json) — Frontmatter schema

> See [docs/CHECKLIST_CROSSLINKING.md](../CHECKLIST_CROSSLINKING.md) for cross-linking best practices.
