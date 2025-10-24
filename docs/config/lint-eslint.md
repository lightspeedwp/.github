# ESLint Configuration

Documentation for ESLint setup and JavaScript/TypeScript linting standards used across LightSpeed projects.

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

### `eslint.config.js`

Modern ESLint flat configuration format (ESLint 9+).

### Current Configuration

```javascript
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
          'scripts/utility/__tests__/**',
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

### Environment Variables

The configuration supports environment-based ignore patterns:

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

### WordPress-Specific Rules

- Follow [WordPress JavaScript Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/)
- Use 2-space indentation
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

### WordPress Specific

- `@wordpress/no-unused-vars-before-return` - WordPress-specific unused vars
- `@wordpress/valid-sprintf` - Validate sprintf usage
- `@wordpress/i18n-text-domain` - Ensure correct text domain

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

- Install `@wordpress/eslint-plugin`
- Add WordPress-specific rules to configuration
- Use `@wordpress/scripts` for complete setup

## Integration

This configuration works with:

- [VS Code Configuration](./vscode.md) for editor integration
- [Package.json Configuration](./package-json.md) for scripts and dependencies
- [WordPress Standards](./wordpress-standards.md) for coding standards
- [Prettier Configuration](./prettier.md) for code formatting
