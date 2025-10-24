# Babel Configuration

This document describes the Babel setup for LightSpeed projects, supporting modern JavaScript, React, and TypeScript with environment-based overrides.

## Configuration File

**File:** `babel.config.js`

```javascript
require('dotenv').config();

module.exports = {
    presets: [
        '@babel/preset-env',
        '@babel/preset-react',
        '@babel/preset-typescript',
    ],
    plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-transform-runtime',
    ],
    ignore: process.env.BABEL_IGNORE
        ? process.env.BABEL_IGNORE.split(',')
        : [
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

- `BABEL_IGNORE`: Comma-separated list of folders/files to ignore (overrides default)

## Usage

Babel is used for transpiling code in tests and build scripts. It is integrated with Jest and other tools.

## Related Docs

- [LINTING.md](../LINTING.md)
- [jest.config.md](./jest.config.md)
- [prettier.config.md](./prettier.config.md)
