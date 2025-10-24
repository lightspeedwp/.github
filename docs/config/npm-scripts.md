# NPM Scripts Configuration

## 🛠️ Build Automation & Development Commands

## Table of Contents

- [Overview](#overview)
- [Standard Scripts](#standard-scripts)
- [WordPress Integration](#wordpress-integration)
- [Script Categories](#script-categories)
- [Usage](#usage)
- [Integration](#integration)

## Overview

**NPM Scripts** provide standardized commands for building, testing, linting, and developing WordPress themes and plugins. Our configuration follows WordPress best practices and LightSpeed standards.

> **💡 Key Benefits:** Consistent commands across projects, automated workflows, team collaboration, CI/CD integration

## Standard Scripts

### **Core Development Scripts**

```json
{
    "scripts": {
        "build": "wp-scripts build",
        "start": "wp-scripts start",
        "dev": "npm run start",
        "watch": "npm run start",
        "build:production": "wp-scripts build --mode=production",
        "sync-version": "node scripts/sync-version.js"
    }
}
```

### **Quality Assurance Scripts**

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
        "lint:pkg-json": "npmPkgJsonLint .",
        "format": "npm run format:js && npm run format:css",
        "format:js": "prettier '**/*.{js,jsx,ts,tsx}' --write && prettier '**/*.json' --write && eslint '**/*.{js,jsx,ts,tsx}' --fix --format",
        "format:css": "prettier '**/*.{css,scss}' --write && stylelint '**/*.{css,scss}' --fix",
        "format:md": "prettier '**/*.md' --write"
    }
}
```

### **Testing Scripts**

```json
{
    "scripts": {
        "test": "npm run test:js",
        "test:js": "jest --coverage --forceExit --detectOpenHandles",
        "test:e2e": "playwright test",
        "test:watch": "jest --watch",
        "test:coverage": "jest --coverage"
    }
}

### **Core & Utility Scripts (from package.json)**

```json
{
    "scripts": {
        "lint:pkg-json": "npmPkgJsonLint .",
        "lint:yaml": "spectral lint '**/*.{yml,yaml}' --ruleset .spectral.yaml",
        "lint:workflows": "spectral lint '.github/workflows/*.{yml,yaml}' --ruleset .spectral-workflows.yaml",
        "lint": "npm run lint:js && npm run lint:css && npm run lint:yaml && npm run lint:pkg-json",
        "lint:all": "npm run lint && npm run lint:workflows && npm run lint:md",
        "lint:js": "eslint '**/*.{js,jsx,ts,tsx}' --fix",
        "lint:css": "stylelint '**/*.{css,scss}' --fix",
        "lint:md": "markdownlint '**/*.md' --fix",
        "format:js": "prettier '**/*.{js,jsx,ts,tsx}' --write && prettier '**/*.json' --write && eslint '**/*.{js,jsx,ts,tsx}' --fix --format && eslint '**/*.json' --fix --format",
        "format:css": "prettier '**/*.{css,scss}' --write && stylelint '**/*.{css,scss}' --fix && stylelint-config-prettier '**/*.{css,scss}' --write && stylelint-config-prettier '**/*.json' --write &&lint-style --fix --format",
        "format:md": "prettier '**/*.md' --write && wp-scripts lint-md --fix --format",
        "format": "npm run format:js && npm run format:css",
        "sync-version": "node scripts/sync-version.js",
        "test:js": "jest --coverage --forceExit --detectOpenHandles",
        "test": "npm run test:js",
        "contributors:add": "all-contributors add",
        "contributors:generate": "all-contributors generate",
        "contributors:check": "all-contributors check"
    }
}
```
```

## WordPress Integration

### **WordPress Scripts Commands**

| Script     | WordPress Command         | Purpose            |
| ---------- | ------------------------- | ------------------ |
| `build`    | `wp-scripts build`        | Production build   |
| `start`    | `wp-scripts start`        | Development server |
| `lint:js`  | `wp-scripts lint-js`      | JavaScript linting |
| `lint:css` | `wp-scripts lint-style`   | CSS linting        |
| `format`   | `wp-scripts format`       | Code formatting    |
| `test:js`  | `wp-scripts test-unit-js` | JavaScript testing |

### **Package.json Example**

```json
{

### **Linting & Formatting Scripts**

See above for the full list. These scripts run ESLint, Stylelint, markdownlint, Spectral, and npmPkgJsonLint for code quality and formatting. Use `npm run lint` for core checks, `npm run lint:all` for comprehensive checks, and `npm run format` to auto-format code.
    "name": "lightspeed-block-theme",
    "scripts": {
        "build": "wp-scripts build",
        "build:production": "NODE_ENV=production wp-scripts build",
        "start": "wp-scripts start",
        "dev": "npm run start",
        "watch": "npm run start",

        "lint": "run-p lint:*",
        "lint:js": "wp-scripts lint-js",
        "lint:css": "wp-scripts lint-style",
        "lint:php": "composer run lint",

### **Testing Scripts**

```json
{
    "scripts": {
        "test:js": "jest --coverage --forceExit --detectOpenHandles",
        "test": "npm run test:js"
    }
}
```

For Playwright E2E tests, use the VS Code task or run `npx playwright test`.
        "lint:md": "markdownlint '**/*.md' --ignore node_modules",

        "format": "run-p format:*",
        "format:js": "wp-scripts format",
        "format:css": "wp-scripts lint-style --fix",
        "format:md": "markdownlint '**/*.md' --ignore node_modules --fix",

        "test": "run-s test:js test:php test:e2e",
        "test:js": "wp-scripts test-unit-js",
        "test:php": "composer run test",

### **Contributors Scripts**

```json
{
    "scripts": {
        "contributors:add": "all-contributors add",
        "contributors:generate": "all-contributors generate",
        "contributors:check": "all-contributors check"
    }
}
```
        "test:e2e": "playwright test",
        "test:watch": "wp-scripts test-unit-js --watch",

        "env:start": "wp-env start",
        "env:stop": "wp-env stop",
        "contributors:add": "all-contributors add",
        "contributors:generate": "all-contributors generate"
    }
}
```

### **Contributors Scripts**

```json
{
    "scripts": {
        "contributors:add": "all-contributors add",
        "contributors:generate": "all-contributors generate",
        "contributors:check": "all-contributors check"
    }
}
```

## Script Categories

### **Build & Development**

```json
{
    "scripts": {
        "build": "wp-scripts build",
        "build:production": "NODE_ENV=production wp-scripts build --mode=production",
        "build:analyze": "wp-scripts build --analyze",
        "start": "wp-scripts start",
        "dev": "npm run start",
        "watch": "npm run start",
        "clean": "rimraf build dist"
    }
}
```

### **Code Quality**

```json
{
    "scripts": {
        "lint": "run-p lint:*",
        "lint:js": "eslint 'src/**/*.{js,jsx,ts,tsx}'",
        "lint:css": "stylelint 'src/**/*.{css,scss}'",
        "lint:php": "./vendor/bin/phpcs",
        "lint:md": "markdownlint '**/*.md'",
        "lint:fix": "run-p lint:*:fix",
        "lint:js:fix": "eslint 'src/**/*.{js,jsx,ts,tsx}' --fix",
        "lint:css:fix": "stylelint 'src/**/*.{css,scss}' --fix"
    }
}
```

### **Testing & Quality Assurance**

```json
{
    "scripts": {
        "test": "run-s test:lint test:unit test:e2e",
        "test:unit": "jest",
        "test:unit:watch": "jest --watch",
        "test:unit:coverage": "jest --coverage",
        "test:e2e": "playwright test",
        "test:e2e:headed": "playwright test --headed",
        "test:e2e:debug": "playwright test --debug",
        "test:lint": "npm run lint"
    }
}
```

### **WordPress Environment**

```json
{
    "scripts": {
        "env:start": "wp-env start",
        "env:stop": "wp-env stop",
        "env:destroy": "wp-env destroy",
        "env:clean": "wp-env clean",
        "env:reset": "run-s env:destroy env:start",
        "wp:cli": "wp-env run cli wp"
    }
}
```

## Usage

### **Development Workflow**

```bash
# Start development
npm run start


# Fix linting issues
npm run lint:fix

# Run all tests
npm test
```

### **CI/CD Integration**

```json
{
    "scripts": {
        "ci": "run-s install:clean build lint test",
        "ci:build": "npm run build:production",
        "ci:test": "run-s test:lint test:unit test:e2e:ci",
        "install:clean": "npm ci",
        "test:e2e:ci": "playwright test --reporter=github"
    }
}
```

### **Parallel Script Execution**

```bash
# Install npm-run-all for parallel execution
npm install --save-dev npm-run-all

# Run scripts in parallel
"lint": "run-p lint:js lint:css lint:php"

# Run scripts in sequence
"test": "run-s test:lint test:unit test:e2e"
```

## Integration

**Related Configuration:**

- **[Package.json Configuration](./npm-package-json.md)** - Main package configuration
- **[Husky Configuration](./workflow-husky.md)** - Git hooks using npm scripts
- **[Jest Configuration](./project-jest.md)** - Testing script integration
- **[ESLint Configuration](./lint-eslint.md)** - Linting script setup

---

> **Next Steps:** Set up npm dependencies management → [npm-dependencies.md](./npm-dependencies.md)
