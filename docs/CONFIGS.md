---
file_type: "documentation"
title: "Configurations"
description: "Configuration management and environment setup guide for LightSpeedWP projects"
version: "1.0.0"
last_updated: "2025-12-04"
owners: ["LightSpeed Team"]
tags: ["configuration", "environment", "setup", "settings", "tooling"]
references:
  - path: "ORGANIZATION.md"
    description: "Documentation organization and navigation guide"
  - path: "VERSIONING.md"
    description: "Versioning conventions and standards"
  - path: "config/README.md"
    description: "Detailed configuration files index"
---

# Configuration Files & Environment Setup

This guide provides an overview of configuration management for LightSpeedWP projects, including tooling setup, build configuration, linting rules, and development environment initialization.

## Overview

Configuration files define how LightSpeedWP projects behave across development, testing, and production environments. This document serves as a high-level guide to configuration management strategies and patterns.

For detailed configuration file documentation, see [Configuration Files Index](./config/README.md).

## Configuration Categories

### Build & Compilation

Configuration files that control how code is built and compiled:

- `babel.config.md` — Babel transpilation configuration
- `webpack.config.md` — Module bundling (if applicable)
- `tsconfig.json` — TypeScript compilation settings

### Linting & Code Quality

Tools that enforce code standards:

- `eslint.config.md` — JavaScript/TypeScript linting rules
- `prettier.config.md` — Code formatting standards
- `stylelint.config.md` — CSS/SCSS linting (if applicable)
- `yamllint.config.md` — YAML validation

### Testing & Coverage

Configuration for automated testing:

- `jest.config.md` — JavaScript testing framework
- `playwright.config.md` — End-to-end browser testing

### Environment & Runtime

Files that configure runtime behavior:

- `.editorconfig` — Editor standardization
- `.env.example` — Environment variable templates
- `.npmrc` / `.yarnrc` — Package manager settings

### Package & Dependencies

Dependency and package configuration:

- `package.json` — NPM package definition and scripts
- `package-lock.json` — Locked dependency versions
- `composer.json` — PHP dependency management (if applicable)

### Validation & Standards

Configuration for schema and compliance:

- `frontmatter.schema.json` — Documentation frontmatter validation
- `.prettier.config.js` — Formatting consistency

## Environment Setup

### Local Development

1. **Install Dependencies**

   ```bash
   npm install    # JavaScript/Node.js dependencies
   composer install  # PHP dependencies (if applicable)
   ```

2. **Configure Environment Variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with local settings
   ```

3. **Initialize Pre-commit Hooks**

   ```bash
   npm run prepare  # Install Husky pre-commit hooks
   ```

### Build & Compilation

```bash
npm run build     # Production build
npm run dev       # Development build with watch mode
npm run lint      # Run linters (ESLint, Prettier, etc.)
```

### Testing

```bash
npm test          # Run all tests
npm run test:e2e  # Run end-to-end tests
npm run coverage  # Generate coverage reports
```

## Common Configuration Tasks

### Adding a New Environment Variable

1. Add to `.env.example` with explanation
2. Document in `CONFIGURATIONS.md`
3. Update deployment/CI configuration
4. Test in all environments

### Updating Linting Rules

1. Modify rule in `.eslintrc.json` or `eslint.config.cjs`
2. Run linter across codebase: `npm run lint:fix`
3. Document change in PR description
4. Update this guide if needed

### Changing Build Output

1. Update build config (`tsconfig.json`, `babel.config.js`, etc.)
2. Test build locally: `npm run build`
3. Verify output in build artifacts
4. Update CI configuration if needed

## Quick Reference

| Config File            | Purpose         | Status |
| ---------------------- | --------------- | ------ |
| `eslint.config.cjs`    | JS/TS linting   | Active |
| `prettier.config.js`   | Code formatting | Active |
| `.editorconfig`        | Editor settings | Active |
| `jest.config.js`       | Testing         | Active |
| `package.json`         | Dependencies    | Active |
| `tsconfig.json`        | TypeScript      | Active |
| `playwright.config.js` | E2E testing     | Active |

## Configuration Standards

### Naming Conventions

- Use lowercase for filenames: `.eslintrc.json`, `prettier.config.js`
- Use camelCase for configuration keys: `ignorePattern`, `arrowParens`
- Use kebab-case for CLI flags: `--no-cache`, `--max-workers`

### File Format

- Prefer JSON for static configuration (validate against schema)
- Use JavaScript files for dynamic configuration logic
- YAML for Docker and CI/CD configuration
- Comments in configuration files (where supported)

### Documentation

- Every configuration file should have a `.md` guide in `docs/config/`
- Include purpose, structure, and common customizations
- Provide examples and troubleshooting tips

## Related Documentation

- [Linting Standards](./LINTING.md)
- [Testing Guide](./TESTING.md)
- [Organization Structure](./ORGANIZATION.md)
- [Configuration Files](./config/README.md)

## Troubleshooting

**Issue: Configuration changes not taking effect**

- Clear build cache: `npm run clean` or `rm -rf dist/`
- Verify file syntax: Run config validation
- Check for duplicate configuration files
- Restart development server

**Issue: Linting failures after update**

- Review linting rule changes in `.eslintrc.json`
- Run fixer: `npm run lint:fix`
- Check for conflicting rules (ESLint ↔ Prettier)

**Issue: Environment variables not available**

- Verify `.env.local` contains required variables
- Check environment variable loading in build config
- Ensure variables are exported in shell environment

## Next Steps

- Review [Linting Standards](./LINTING.md) for code quality configuration
- See [Configuration Files Index](./config/README.md) for detailed file documentation
- Check [Testing Guide](./TESTING.md) for test configuration details

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
