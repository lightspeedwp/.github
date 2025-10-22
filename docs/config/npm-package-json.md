# Package.json Configuration

Documentation for Node.js project configuration, dependencies, and npm scripts used across LightSpeed projects.

## Table of Contents

- [Structure](#structure)
- [Dependencies Categories](#dependencies-categories)
- [npm Scripts](#npm-scripts)
- [Best Practices](#best-practices)
- [Integration](#integration)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)

## Structure

### Basic Configuration

```json
{
  "name": "lightspeed-project",
  "version": "1.0.0", 
  "description": "LightSpeed WordPress project",
  "author": "LightspeedWP",
  "license": "GPL-2.0-or-later",
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

### Dependencies Categories

#### WordPress Core Dependencies

```json
{
  "dependencies": {
    "@wordpress/a11y": "^3.0.0",
    "@wordpress/i18n": "^4.0.0",
    "@wordpress/style-engine": "^1.0.0"
  }
}
```

#### Development Tools

```json
{
  "devDependencies": {
    "@wordpress/scripts": "^26.0.0",
    "eslint": "^8.0.0",
    "stylelint": "^14.16.0",
    "markdownlint": "^0.28.1",
    "@stoplight/spectral-cli": "^6.11.0"
  }
}
```

#### Testing Framework

```json
{
  "devDependencies": {
    "jest": "^30.0.1",
    "playwright": "^1.40.0",
    "@playwright/test": "^1.40.0",
    "bats": "^1.8.0"
  }
}
```

## npm Scripts

### Linting Scripts

```json
{
  "scripts": {
    "lint": "npm run lint:js && npm run lint:css && npm run lint:yaml",
    "lint:js": "eslint '**/*.{js,jsx,ts,tsx}' --fix",
    "lint:css": "stylelint '**/*.{css,scss}' --fix",
    "lint:yaml": "spectral lint '**/*.{yml,yaml}' --ruleset .spectral.yaml",
    "lint:md": "markdownlint '**/*.md' --fix"
  }
}
```

### Formatting Scripts

```json
{
  "scripts": {
    "format": "npm run format:js && npm run format:css",
    "format:js": "prettier '**/*.{js,jsx,ts,tsx}' --write",
    "format:css": "prettier '**/*.{css,scss}' --write"
  }
}
```

### Testing Scripts

```json
{
  "scripts": {
    "test": "npm run test:js",
    "test:js": "jest --coverage",
    "test:e2e": "playwright test",
    "test:shell": "bats tests/*.bats"
  }
}
```

### WordPress-Specific Scripts

```json
{
  "scripts": {
    "build": "wp-scripts build",
    "start": "wp-scripts start", 
    "env:start": "wp-env start",
    "env:stop": "wp-env stop"
  }
}
```

## Best Practices

### Version Management

- Use exact versions for critical dependencies
- Pin WordPress packages to compatible versions
- Regular dependency updates with testing

### Script Organization

- Group scripts by purpose (lint, format, test, build)
- Use consistent naming conventions
- Include both individual and combined scripts

### Performance Optimization

```json
{
  "scripts": {
    "lint:staged": "lint-staged",
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,scss}": ["stylelint --fix", "prettier --write"],
    "*.md": ["markdownlint --fix"]
  }
}
```

## Integration

### Husky Configuration

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
}
```

### WordPress Environment

```json
{
  ".wp-env": {
    "core": "WordPress/WordPress#6.4",
    "plugins": [".", "./plugins/additional-plugin"],
    "themes": ["./themes/custom-theme"]
  }
}
```

## Usage

### Project Setup

```bash
# Initialize new project
npm init -y

# Install WordPress scripts (includes most dependencies)
npm install --save-dev @wordpress/scripts

# Install additional linting tools
npm install --save-dev spectral markdownlint
```

### Development Workflow

```bash
# Install dependencies
npm install

# Start development
npm start

# Run linting
npm run lint

# Run tests
npm test

# Build for production  
npm run build
```

## Troubleshooting

### Common Issues

#### "Cannot find module" errors
- Run `npm install` to ensure all dependencies are installed
- Check for peer dependency warnings
- Verify Node.js version compatibility

#### Script execution errors
- Check script syntax in package.json
- Ensure all referenced tools are installed
- Verify file paths in glob patterns

#### WordPress environment issues
- Update `.wp-env.json` configuration
- Check WordPress version compatibility
- Verify plugin/theme paths

## Related Documentation

This configuration integrates with:

- [VS Code Configuration](./vscode.md) for editor integration
- [ESLint Configuration](./eslint.md) for JavaScript linting
- [Spectral Configuration](./spectral.md) for YAML validation
- [WordPress Standards](./wordpress-standards.md) for coding standards
