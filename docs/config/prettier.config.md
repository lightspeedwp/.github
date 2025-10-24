# Prettier Configuration

This document describes the Prettier setup for LightSpeed projects, supporting consistent code formatting with environment-based overrides.

## Configuration File

**File:** `prettier.config.js`

```javascript
require('dotenv').config();

module.exports = {
    tabWidth: process.env.PRETTIER_TAB_WIDTH
        ? parseInt(process.env.PRETTIER_TAB_WIDTH, 10)
        : 2,
    useTabs: process.env.PRETTIER_USE_TABS === 'true',
    endOfLine: process.env.PRETTIER_END_OF_LINE || 'lf',
    printWidth: process.env.PRETTIER_PRINT_WIDTH
        ? parseInt(process.env.PRETTIER_PRINT_WIDTH, 10)
        : 120,
    singleQuote: process.env.PRETTIER_SINGLE_QUOTE !== 'false',
    trailingComma: process.env.PRETTIER_TRAILING_COMMA || 'all',
    bracketSpacing: process.env.PRETTIER_BRACKET_SPACING !== 'false',
    arrowParens: process.env.PRETTIER_ARROW_PARENS || 'always',
    ignore: [
        'node_modules',
        'build',
        'dist',
        'coverage',
        'playwright-report',
        'test-results',
        'vendor',
        '.next',
        'logs',
    ],
};
```

## Environment Variables

- `PRETTIER_TAB_WIDTH`: Number of spaces per tab (default: 2)
- `PRETTIER_USE_TABS`: Use tabs instead of spaces (default: false)
- `PRETTIER_END_OF_LINE`: Line ending style (default: 'lf')
- `PRETTIER_PRINT_WIDTH`: Maximum line length (default: 120)
- `PRETTIER_SINGLE_QUOTE`: Use single quotes (default: true)
- `PRETTIER_TRAILING_COMMA`: Trailing comma style (default: 'all')
- `PRETTIER_BRACKET_SPACING`: Print spaces between brackets (default: true)
- `PRETTIER_ARROW_PARENS`: Arrow function parentheses (default: 'always')

## Usage

Prettier is used for formatting all supported file types. It is integrated with ESLint, Stylelint, and markdownlint.

## Related Docs

- [LINTING.md](../LINTING.md)
- [lint-eslint.md](./lint-eslint.md)
- [lint-stylelint.md](./lint-stylelint.md)
