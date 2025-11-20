---
title: "ESLint Configuration"
description: "JavaScript/TypeScript linting with ESLint flat config format"
version: "v2.0"
last_updated: "2025-11-20"
file_type: "documentation"
category: "configuration"
tags: ["eslint", "javascript", "typescript", "linting"]
references:
  - path: ".eslint.config.cjs"
    description: "ESLint configuration file"
  - path: ".github/instructions/linting/linting-javascript.instructions.md"
    description: "JavaScript linting instructions"
  - path: "package.json"
    description: "npm scripts for linting"
---

# ESLint Configuration

## Overview

ESLint enforces consistent code style and catches potential errors in JavaScript and TypeScript files across the LightSpeed organization. This configuration uses the flat config format (ESLint 9+) for improved performance and clarity.

## Configuration File

- **Location**: `.eslint.config.cjs`
- **Format**: CommonJS (`.cjs` extension)
- **Applies to**: `**/*.{js,jsx,ts,tsx,mjs,cjs}`

## Running ESLint

### Via npm

```bash
# Lint all JavaScript/TypeScript files
npm run lint:js

# Fix auto-fixable issues
npm run format:js

# Lint specific file or directory
npx eslint src/file.js
```

### With options

```bash
# Show detailed output
npx eslint . --format detailed

# Fix and report
npx eslint . --fix

# Check specific pattern
npx eslint src/**/*.test.js
```

## Configuration Details

### Extends

The configuration extends:

- WordPress JavaScript Coding Standards
- Prettier integration (no style conflicts)
- TypeScript support via `@typescript-eslint`

### Key Rules

- **Indentation**: 2 spaces
- **Quotes**: Single quotes (`'`) for strings
- **Semicolons**: Required
- **Trailing commas**: ES5 compatible
- **Equality**: Strict (`===`, `!==`)
- **Variable naming**: camelCase for variables/functions, PascalCase for classes

### Ignored Files

Files and directories to ignore are defined via:

- `.eslintignore`
- `ignores` array in flat config

Common ignores:

- `node_modules/`
- `dist/`
- `build/`
- `.git/`
- Coverage reports

## WordPress JavaScript Standards

This configuration enforces [WordPress JavaScript Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/):

- Functions and variables use `camelCase`
- Classes use `PascalCase`
- Constants use `CONSTANT_CASE`
- Use `const` by default, `let` when reassignment needed, avoid `var`
- Use strict mode in all files
- Document functions with JSDoc

## TypeScript Support

TypeScript files (`.ts`, `.tsx`) are supported with additional rules:

- Type annotations required for public APIs
- Use types, not interfaces (when possible)
- Strict null checks
- No implicitly any types

## Integration with Other Tools

### Prettier

ESLint config includes Prettier integration to prevent conflicts:

- ESLint handles logic/security rules
- Prettier handles formatting

Run both in sequence:

```bash
npm run lint:js && npm run format:js
```

### VS Code

Configuration for VS Code integration in `.vscode/settings.json`:

```json
{
  "eslint.validate": ["javascript", "typescript"],
  "eslint.format.enable": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Pre-commit Hook

Husky pre-commit hook runs ESLint on staged files:

```bash
npm run lint:js -- --staged
```

## CI/CD Integration

ESLint runs in GitHub Actions workflows:

- **On**: `push` and `pull_request` events
- **Blocks**: Merge if linting fails
- **Reports**: Issues as PR annotations

## Troubleshooting

### Common Issues

**Error: "Cannot find module '@typescript-eslint/parser'"**

- Solution: `npm install`

**Rule conflicts with Prettier**

- Solution: Ensure `.eslintignore` and Prettier config align
- Check: `npm run format:js` then `npm run lint:js`

**Performance issues**

- Check for large ignore patterns
- Use `eslint-cache` option
- Profile with: `TIMING=1 npx eslint .`

### Debug Mode

```bash
# Show which configs/plugins are loaded
eslint --debug .

# Show timing information
TIMING=1 eslint .
```

## Updating the Configuration

### Adding a New Rule

1. Edit `.eslint.config.cjs`
2. Add rule to appropriate config object
3. Test: `npm run lint:js`
4. Document the change in CHANGELOG.md

### Testing Configuration Changes

```bash
# Test on single file
npx eslint test-file.js

# Test on directory
npx eslint src/

# Show which rules apply
eslint --print-config test-file.js | grep -A2 '"rule-name"'
```

## References

- [ESLint Documentation](https://eslint.org/docs/latest/)
- [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files-new)
- [WordPress JS Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [Prettier + ESLint](https://prettier.io/docs/en/integrating-with-linters.html)

---

*Last updated: 2025-11-20 | Maintained by: LightSpeed Engineering*
