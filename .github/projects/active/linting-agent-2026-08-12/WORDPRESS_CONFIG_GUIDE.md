# WordPress Configuration Guide — Linting Agent

Comprehensive guide to configuring and using the Linting Agent with WordPress plugins, themes, and block-based projects.

## Table of Contents

- [Overview](#overview)
- [Project Type Detection](#project-type-detection)
- [WordPress Plugin Configuration](#wordpress-plugin-configuration)
- [WordPress Theme Configuration](#wordpress-theme-configuration)
- [Block Plugin & Block Theme Configuration](#block-plugin--block-theme-configuration)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)
- [Examples & Reference](#examples--reference)

## Overview

The Linting Agent automatically detects your WordPress project type and applies appropriate linting standards:

- **WordPress Plugins** — PHPCS with WordPress-Core & WordPress-Docs standards, plus ESLint for JavaScript
- **WordPress Themes** — PHPCS with WordPress standard, stylelint for CSS/SCSS, ESLint for JavaScript
- **Block Plugins** — ESLint (WordPress rules), PHPCS (WordPress-Core), stylelint for CSS
- **Block Themes** — ESLint, stylelint, PHPCS (WordPress standard)

All configurations enforce:

- Security best practices (escaping, sanitization, prepared statements)
- Code style consistency (naming conventions, formatting)
- Accessibility standards (WCAG 2.2 AA minimum)
- Performance and maintainability

## Project Type Detection

The agent uses file markers to detect your project type automatically:

| Project Type | Detection Markers | Return Value |
|---|---|---|
| **Control Plane** | `.github/CLAUDE.md` + `.github/agents/` exist | `control-plane` |
| **WordPress Plugin** | `plugin.php` with "Plugin Name:" header | `wordpress-plugin` |
| **WordPress Theme** | `style.css` with "Theme Name:" header | `wordpress-theme` |
| **Block Plugin** | `src/plugin.php` or `block.json` | `wordpress-block-plugin` |
| **Generic** | No WordPress markers found | `generic` |

### Detection Function

```javascript
const { detectRepositoryType } = require('./scripts/agents/linting.agent.js');

const type = detectRepositoryType('/path/to/project');
// Returns: 'wordpress-plugin' | 'wordpress-theme' | 'wordpress-block-plugin' | 'control-plane' | 'generic'
```

## WordPress Plugin Configuration

### Setup

Create a `phpcs.xml` file in your plugin root:

```xml
<?xml version="1.0"?>
<ruleset name="My Plugin">
  <description>PHPCS configuration for WordPress plugin</description>

  <!-- Base standard: WordPress -->
  <rule ref="WordPress-Core" />
  <rule ref="WordPress-Docs" />

  <!-- File extensions -->
  <arg name="extensions" value="php" />

  <!-- Exclude patterns -->
  <exclude-pattern>/vendor/</exclude-pattern>
  <exclude-pattern>/node_modules/</exclude-pattern>
  <exclude-pattern>/tests/</exclude-pattern>
  <exclude-pattern>/dist/</exclude-pattern>

  <!-- Security: enforce escaping -->
  <rule ref="WordPress.Security.EscapeOutput">
    <severity>5</severity>
  </rule>

  <!-- Security: enforce prepared statements -->
  <rule ref="WordPress.DB.PreparedSQL">
    <severity>5</severity>
  </rule>

  <!-- Security: warn on nonce verification -->
  <rule ref="WordPress.Security.NonceVerification">
    <severity>4</severity>
  </rule>

  <!-- Warn on variable constants -->
  <rule ref="WordPress.NamingConventions.ValidVariableName">
    <severity>3</severity>
  </rule>
</ruleset>
```

### ESLint Configuration for Plugin JavaScript

Create `.eslintrc.json` in your plugin root:

```json
{
  "extends": ["eslint:recommended"],
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module"
  },
  "env": {
    "browser": true,
    "es2020": true,
    "node": true
  },
  "globals": {
    "wp": true,
    "wpApiSettings": true
  },
  "rules": {
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "no-var": "error",
    "prefer-const": "error"
  }
}
```

### Plugin Header (plugin.php)

Ensure your `plugin.php` has proper headers:

```php
<?php
/**
 * Plugin Name: My Awesome Plugin
 * Plugin URI: https://example.com/my-plugin
 * Description: Does amazing things
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: https://example.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: my-plugin
 * Domain Path: /languages
 * Requires PHP: 7.4
 * Requires WP: 5.0
 *
 * @package MyPlugin
 */

// Your plugin code here
```

### Running the Linting Agent

```bash
# Lint all PHP files in plugin
node scripts/agents/linting.agent.js --files "*.php"

# Lint specific file
node scripts/agents/linting.agent.js --files "includes/class-settings.php"

# Lint with custom timeout (5 seconds)
node scripts/agents/linting.agent.js --files "*.php" --timeout 5000
```

## WordPress Theme Configuration

### Setup

Create a `phpcs.xml` for your theme:

```xml
<?xml version="1.0"?>
<ruleset name="My Theme">
  <description>PHPCS configuration for WordPress theme</description>

  <!-- Base standard: WordPress (theme-specific) -->
  <rule ref="WordPress" />

  <!-- File extensions -->
  <arg name="extensions" value="php" />

  <!-- Exclude patterns -->
  <exclude-pattern>/vendor/</exclude-pattern>
  <exclude-pattern>/node_modules/</exclude-pattern>

  <!-- Strict security rules for themes -->
  <rule ref="WordPress.Security.EscapeOutput">
    <severity>5</severity>
  </rule>

  <!-- Warn on hard-coded output -->
  <rule ref="WordPress.Theme.NoScriptTags">
    <severity>5</severity>
  </rule>

  <!-- Warn on direct database queries in themes -->
  <rule ref="WordPress.DB.DirectDatabaseQuery">
    <severity>4</severity>
  </rule>
</ruleset>
```

### stylelint Configuration for Theme CSS

Create `.stylelintrc.json`:

```json
{
  "extends": "stylelint-config-standard",
  "rules": {
    "no-missing-end-of-source-newline": null,
    "at-rule-allowed-list": ["media", "supports", "keyframes", "font-face"],
    "declaration-property-unit-allowed-list": {
      "font-size": ["px", "rem", "em", "%"],
      "line-height": ["", "px", "rem", "em"],
      "letter-spacing": ["px", "em", "rem"]
    }
  }
}
```

### Theme Header (style.css)

Proper theme header in `style.css`:

```css
/*
Theme Name: My Awesome Theme
Theme URI: https://example.com/my-theme
Author: Your Name
Author URI: https://example.com
Description: A beautifully designed WordPress theme
Version: 1.0.0
License: GPL v2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Text Domain: my-theme
Domain Path: /languages
Tags: blog, custom-logo, full-site-editing

Your theme CSS below...
*/
```

### Running the Linting Agent

```bash
# Lint all PHP files
node scripts/agents/linting.agent.js --files "*.php"

# Lint theme CSS
node scripts/agents/linting.agent.js --files "style.css, assets/css/*.css"

# Lint with custom config
node scripts/agents/linting.agent.js --files "*.php" --config phpcs.xml
```

## Block Plugin & Block Theme Configuration

### Block Plugin Setup

For projects with `block.json` or `src/plugin.php`:

#### .eslintrc.json

```json
{
  "extends": ["plugin:@wordpress/eslint-plugin/recommended"],
  "env": {
    "browser": true,
    "es2020": true
  },
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module"
  },
  "rules": {
    "no-unused-vars": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "@wordpress/no-unsafe-wp-apis": "warn"
  }
}
```

#### .stylelintrc.json

```json
{
  "extends": ["stylelint-config-standard"],
  "rules": {
    "no-missing-end-of-source-newline": null,
    "unit-allowed-list": ["em", "rem", "px", "%", "deg", "s", "ms"],
    "selector-pseudo-element-no-unknown": [
      true,
      {
        "ignorePseudoElements": ["v-deep"]
      }
    ]
  }
}
```

#### package.json Scripts

```json
{
  "scripts": {
    "lint:js": "eslint src --ext .js,.jsx,.ts,.tsx",
    "lint:css": "stylelint 'src/**/*.{css,scss}'",
    "lint:php": "phpcs --standard=WordPress src",
    "lint": "npm run lint:js && npm run lint:css && npm run lint:php",
    "format": "prettier --write 'src/**/*.{js,jsx,ts,tsx,css}'"
  }
}
```

### Block Theme Setup

For projects with `style.css` and block-first approach:

#### .eslintrc.json (simplified)

```json
{
  "extends": ["eslint:recommended"],
  "rules": {
    "no-unused-vars": "error"
  }
}
```

#### .stylelintrc.json (block-focused)

```json
{
  "extends": "stylelint-config-standard",
  "rules": {
    "unit-allowed-list": ["em", "rem", "px", "%", "deg", "s", "ms", "vh", "vw"]
  }
}
```

## CI/CD Integration

### GitHub Actions Workflow

Add to `.github/workflows/lint.yml`:

```yaml
name: Lint & Test

on:
  pull_request:
    paths:
      - "**.php"
      - "**.js"
      - "**.css"
      - ".eslintrc.json"
      - "phpcs.xml"
      - ".stylelintrc.json"

jobs:
  php:
    runs-on: ubuntu-latest
    name: PHP Linting
    steps:
      - uses: actions/checkout@v4
      - uses: shivammathur/setup-php@v2
        with:
          php-version: "8.1"
          tools: composer, phpcs
      - run: composer install
      - run: phpcs --standard=phpcs.xml

  js:
    runs-on: ubuntu-latest
    name: JavaScript Linting
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint:js

  css:
    runs-on: ubuntu-latest
    name: CSS Linting
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint:css || true  # Warning only
```

### Local Pre-commit Hook

Add to `.git/hooks/pre-commit` or use husky:

```bash
#!/bin/bash
set -e

echo "Running linting checks..."

# PHP linting
if command -v phpcs &> /dev/null; then
  phpcs --standard=phpcs.xml --colors
fi

# JavaScript linting
if [ -f .eslintrc.json ]; then
  npx eslint . --max-warnings 0
fi

# CSS linting
if [ -f .stylelintrc.json ]; then
  npx stylelint '**/*.{css,scss}' || true
fi

echo "✅ Linting checks passed"
```

## Troubleshooting

### PHPCS Not Found

**Problem:** `Error: phpcs not found`

**Solution:**

```bash
# Install globally
composer global require squizlabs/php_codesniffer

# Or install locally
composer require --dev squizlabs/php_codesniffer
```

### WordPress Coding Standards Not Found

**Problem:** `PHP_CodeSniffer error: The standard is not installed`

**Solution:**

```bash
# Install WordPress Coding Standards
composer require --dev wp-coding-standards/wpcs

# Link the standard
phpcs --config-set installed_paths $(composer config vendor-dir)/wp-coding-standards/wpcs
```

### ESLint Configuration Issues

**Problem:** `Error: failed to load .eslintrc.json`

**Solution:**

```bash
# Validate JSON syntax
npx eslint --debug .

# Install missing dependencies
npm install --save-dev eslint @wordpress/eslint-plugin

# Clear cache
npx eslint --cache --fix .
```

### Timeout Issues

**Problem:** `Operation timed out after 30000ms`

**Solution:**

```javascript
// Increase timeout in options
const result = await lintCodebase(rootDir, {
  timeout: 60000, // 60 seconds
  files: ["path/to/file.php"]
});
```

### Permission Denied (Windows)

**Problem:** `Error: EACCES: permission denied`

**Solution:**

```bash
# Run as administrator (Windows)
# Or use WSL (Windows Subsystem for Linux)
wsl npx eslint .
```

### Plugin Not Detected

**Problem:** Agent reports `generic` type instead of `wordpress-plugin`

**Solution:**
Ensure `plugin.php` exists and contains `Plugin Name:` header:

```php
<?php
/**
 * Plugin Name: My Plugin  ← Required for detection
 */
```

### Theme Not Detected

**Problem:** Agent reports `generic` type instead of `wordpress-theme`

**Solution:**
Ensure `style.css` exists and contains `Theme Name:` header:

```css
/*
Theme Name: My Theme  ← Required for detection
*/
```

## Examples & Reference

### Example 1: Lint a Plugin File

```bash
cd /path/to/my-plugin
node ../../scripts/agents/linting.agent.js \
  --files "includes/class-settings.php" \
  --config "phpcs.xml"
```

**Output:**

```
# Lint Report

## Summary

- Files scanned: 1
- Files with findings: 1
- Total findings: 2
- Errors: 1 | Warnings: 1

## Findings

### includes/class-settings.php

- [error] WordPress.DB.PreparedSQL: Use $wpdb->prepare() for database queries
  **Fix:** Wrap database query in $wpdb->prepare()
  
- [warning] WordPress.Security.EscapeOutput: Missing esc_html() on line 42
  **Fix:** Add esc_html() or esc_attr() around output

## Next Steps

- [ ] Prepare database query with $wpdb->prepare()
- [ ] Add escaping function to output
- [ ] Run `phpcs --standard=phpcs.xml --colors` to verify fixes
```

### Example 2: Check Theme CSS

```bash
cd /path/to/my-theme
node ../../scripts/agents/linting.agent.js \
  --files "style.css, assets/css/*.css" \
  --config ".stylelintrc.json"
```

### Example 3: Full Project Lint

```bash
# Lint all PHP files
node scripts/agents/linting.agent.js --files "*.php"

# Lint JavaScript
node scripts/agents/linting.agent.js --files "src/**/*.js"

# Lint both
node scripts/agents/linting.agent.js \
  --files "*.php, src/**/*.{js,jsx}, assets/**/*.css"
```

## Standards & References

All linting enforces these organisation-wide standards:

- **[WordPress Coding Standards](https://developer.wordpress.org/coding-standards/)** — Official WordPress project standards
- **[Coding Standards Instructions](../../../instructions/coding-standards.instructions.md)** — LightSpeed coding guidelines
- **[Linting Instructions](../../../instructions/linting.instructions.md)** — Linting tool configuration
- **[WPCS GitHub](https://github.com/WordPress/WordPress-Coding-Standards)** — WordPress Coding Standards repository
- **[ESLint Recommended](https://eslint.org/docs/latest/rules/)** — ESLint recommended rules
- **[stylelint Standard](https://stylelint.io/)** — stylelint configuration

## Getting Help

- **Phase 1 Specification:** See `SPECIFICATION.md` for full agent design
- **Implementation Plan:** See `IMPLEMENTATION_PLAN.md` for roadmap
- **Test Plan:** See `TEST_PLAN.md` for comprehensive test coverage
- **Related Issues:** [#1819](../../../issues/1819), [#1821](../../../issues/1821), [#1822](../../../issues/1822)

---

**Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!**
