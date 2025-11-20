# NPM Package JSON Linting Configuration (npmpackagejsonlint)

Documentation for package.json linting and validation used in LightSpeed projects to ensure consistent npm configuration and metadata.

## Table of Contents

- [Configuration Files](#configuration-files)
- [Setup](#setup)
- [Rules & Standards](#rules--standards)
- [Usage](#usage)
- [Integration](#integration)
- [Troubleshooting](#troubleshooting)

## Configuration Files

### `.npmpackagejsonlint.config.cjs` (Main Configuration)

**File:** `.npmpackagejsonlint.config.cjs`

Controls all package.json validation rules.

```javascript
module.exports = {
  rules: {
    // Required fields
    "require-name": "error",
    "require-version": "error",
    "require-description": "warning",
    "require-author": "warning",
    "require-license": "error",

    // Valid values
    "valid-values-license": [
      "error",
      ["GPL-2.0-or-later", "GPL-3.0", "MIT", "Apache-2.0"],
    ],

    // Alphabetical ordering
    "alphabetized-keys": "warning",

    // Dependencies validation
    "valid-values-engines-node": ["warning", [">=18.0.0", ">=20.0.0"]],

    // Scripts consistency
    "no-repeated-dependencies": "error",

    // Version format
    "valid-values-publishConfig": [
      "warning",
      {
        access: ["public", "restricted"],
      },
    ],
  },
};
```

## Setup

### Installation

```bash
# Install npmpackagejsonlint via npm
npm install --save-dev npmpackagejsonlint

# Install globally for CLI access
npm install -g npmpackagejsonlint
```

### npm Script

```json
{
  "scripts": {
    "lint:pkg-json": "npmpackagejsonlint --configFile .npmpackagejsonlint.config.cjs"
  }
}
```

## Rules & Standards

### Required Fields

| Field           | Required     | Purpose             |
| --------------- | ------------ | ------------------- |
| **name**        | Yes (error)  | Package identifier  |
| **version**     | Yes (error)  | Semantic versioning |
| **description** | No (warning) | Package description |
| **author**      | No (warning) | Author information  |
| **license**     | Yes (error)  | Licensing info      |

### LightSpeed Standard Fields

```json
{
  "name": "lightspeed-project",
  "version": "1.0.0",
  "description": "LightSpeed WordPress project",
  "author": "LightSpeedWP",
  "license": "GPL-2.0-or-later",
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/lightspeedwp/project.git"
  },
  "keywords": ["wordpress", "lightspeed", "block-theme"],
  "scripts": {},
  "dependencies": {},
  "devDependencies": {}
}
```

### Validation Rules

**Allowed Licenses:**

- GPL-2.0-or-later (WordPress themes/plugins)
- GPL-3.0 (Tools and utilities)
- MIT (Optional dependencies)
- Apache-2.0 (Specific projects)

**Required Node Version:**

- Minimum: `>=18.0.0`
- Recommended: `>=20.0.0`

**Required npm Version:**

- Minimum: `>=9.0.0`

## Usage

### Run Linting

```bash
# Lint package.json
npm run lint:pkg-json

# Or directly with npmpackagejsonlint
npmpackagejsonlint

# Verbose output
npmpackagejsonlint --verbose

# With specific config file
npmpackagejsonlint --configFile .npmpackagejsonlint.config.cjs
```

### Fix Issues

```bash
# Format package.json (basic fix)
npm run format:json

# Manual fixes:
# 1. Add missing required fields
# 2. Correct version number (semver format)
# 3. Ensure license is in approved list
# 4. Alphabetize keys for consistency
```

## Integration

### GitHub Actions Workflow

Add package.json linting to CI:

```yaml
name: Lint • Package.json

on:
  push:
    paths:
      - "package.json"
      - ".npmpackagejsonlint.config.cjs"
  pull_request:
    paths:
      - "package.json"
      - ".npmpackagejsonlint.config.cjs"

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm install
      - run: npm run lint:pkg-json
```

### Husky Pre-commit Hook

```bash
npx husky add .husky/pre-commit "npm run lint:pkg-json"
```

### All Linting Scripts

```json
{
  "scripts": {
    "lint": "npm run lint:js && npm run lint:css && npm run lint:yaml && npm run lint:pkg-json",
    "lint:all": "npm run lint && npm run lint:md && npm run lint:workflows"
  }
}
```

## Troubleshooting

### Common Issues

#### "name is required"

**Cause:** Missing `name` field in package.json

**Solution:** Add project name:

```json
{
  "name": "my-lightspeed-project"
}
```

#### "version is required"

**Cause:** Missing or invalid version

**Solution:** Use semantic versioning:

```json
{
  "version": "1.0.0"
}
```

#### "invalid license"

**Cause:** License not in approved list

**Solution:** Use approved license:

```json
{
  "license": "GPL-2.0-or-later"
}
```

#### "unknown property"

**Cause:** Invalid or misspelled field

**Solution:** Check npm package.json documentation and verify spelling

#### "invalid values-engines-node"

**Cause:** Invalid Node version requirement

**Solution:** Use valid semver:

```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### Validation

Validate package.json online:

- [npm Package.json Validator](https://package-json-validator.com/)
- [JSON Schema Validator](https://www.jsonschemavalidator.org/)

## Related Documentation

- [NPM - Scripts](./npm-scripts.md) - npm scripts documentation
- [NPM - Dependencies](./npm-dependencies.md) - Dependency management
- [Linting Overview](../LINTING.md) - All linting tools
- [npm Documentation](https://docs.npmjs.com/cli/v9/configuring-npm/package-json) - Official reference
