---
file_type: "tool-config"
title: "Stylelint Configuration"
description: "CSS/SCSS linting configuration for WordPress coding standards"
version: "v1.0"
last_updated: "2025-11-20"
maintainer: "LightSpeed Team"
tags: ["stylelint", "css", "scss", "linting", "wordpress"]
---

# Stylelint Configuration

## Overview

**Stylelint** enforces CSS/SCSS coding standards aligned with [WordPress CSS Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/css/).

- **Config File:** `.stylelintrc.json` or `stylelint.config.js`
- **Ignores:** `.stylelintignore`
- **When It Runs:** Pre-commit hooks (Husky), CI/CD pipelines, IDE integration
- **Severity:** Fails CI if violations found

## Configuration

### Config Location

```bash
# Primary (recommended)
.stylelintrc.json          # JSON format
stylelint.config.js        # ES module format
```

### Example Configuration

```json
{
  "extends": ["stylelint-config-standard", "stylelint-config-wordpress"],
  "rules": {
    "length-zero-no-unit": true,
    "color-named": "never",
    "declaration-no-important": true,
    "selector-class-pattern": "^[a-z][a-z0-9]*(-[a-z0-9]+)*$",
    "selector-id-pattern": "^[a-z][a-z0-9]*(-[a-z0-9]+)*$"
  }
}
```

## Running Stylelint

### Via npm

```bash
# Lint all CSS/SCSS files
npm run lint:css

# Fix auto-fixable errors
npm run lint:css -- --fix
```

### Via CLI

```bash
# Check files
npx stylelint "**/*.{css,scss}"

# Fix files
npx stylelint "**/*.{css,scss}" --fix
```

## Key Rules

| Rule | Purpose | Default |
|------|---------|---------|
| `length-zero-no-unit` | Disallow units for zero lengths | `true` |
| `color-named` | Disallow named colors | `"never"` |
| `selector-class-pattern` | Enforce class naming convention | BEM pattern |
| `declaration-no-important` | Disallow `!important` | `true` |
| `selector-no-qualifying-type` | Avoid overqualified selectors | `true` |

## Ignoring Files

Create `.stylelintignore` file:

```bash
# Dependencies
node_modules/

# Build outputs
dist/
build/

# Third-party
vendor/

# Specific files
*.min.css
```

Or use CLI option:

```bash
npx stylelint "**/*.css" --ignore-path .stylelintignore
```

## IDE Integration

### VS Code

Install extension: [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)

Add to `.vscode/settings.json`:

```json
{
  "stylelint.enable": true,
  "stylelint.autoFixOnSave": true,
  "stylelint.autoFixOnFormat": true,
  "css.lint.enabled": false
}
```

## WordPress Standards Alignment

Stylelint is configured with:

- **`stylelint-config-wordpress`**: Official WordPress standards
- **`stylelint-config-standard`**: Base best practices

These enforce:

- Lowercase selectors and properties
- Single quotes
- BEM naming conventions
- Proper spacing and indentation
- No vendor prefixes (handled by PostCSS)

## Troubleshooting

### Issue: Rules conflict with Prettier

**Solution:** Use `stylelint-config-prettier` to disable conflicting rules.

```json
{
  "extends": [
    "stylelint-config-standard",
    "stylelint-config-wordpress",
    "stylelint-config-prettier"
  ]
}
```

### Issue: Custom property names fail validation

**Solution:** Relax the property name pattern for custom properties:

```json
{
  "rules": {
    "custom-property-pattern": "^([a-z][a-z0-9]*(--[a-z0-9]+)*|--[a-zA-Z0-9_-]+)$"
  }
}
```

### Issue: Performance degradation with large projects

**Solution:** Use `.stylelintignore` or `ignoreFiles` option to exclude:

- `node_modules/`
- `vendor/`
- Build outputs (`dist/`, `build/`)
- Third-party CSS

## Integration Points

- **Pre-commit:** Husky `pre-commit` hook
- **CI/CD:** `.github/workflows/lint.yml`
- **IDE:** VS Code with Stylelint extension
- **Format Pipeline:** Runs after Prettier

## References

- [Stylelint Documentation](https://stylelint.io/)
- [WordPress CSS Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/css/)
- [stylelint-config-wordpress](https://github.com/WordPress/stylelint-config-wordpress)
- [Related: Prettier Configuration](./lint-prettier.md)
- [Related: Linting Workflow](./linting.instructions.md)

---

**Last Updated:** 2025-11-20 | **Maintainer:** LightSpeed Team
