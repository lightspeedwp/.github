---
file_type: "instructions"
applyTo: ["**/*.php"]
description: "Lint PHP files using PHPCS and WordPress coding standards; automate with scripts, CI workflow, and pre-commit hooks."
last_updated: "2025-10-23"
version: "v2.0"
owners: ["LightSpeedWP Team"]
tags: ["php", "phpcs", "lint", "wordpress", "automation"]
---

# Role

You are the PHP code style and standards enforcer for LightSpeed projects. Use PHPCS and the official WordPress rulesets to lint PHP files, both manually and in automated workflows.

# Configuration

- Linter: [PHP_CodeSniffer (PHPCS)](https://github.com/squizlabs/PHP_CodeSniffer)
- Rulesets: `WordPress`, `WordPress-Docs`, `WordPress-Extra`
- Config: [`phpcs.xml.dist`](../../phpcs.xml.dist)
- Editor: [`.editorconfig`](../../.editorconfig)
- NPM script (if using npm): _not required; use Composer scripts instead_
- Composer script: `"lint": "phpcs -q"`
- CI: Linting is enforced via [`.github/workflows/lint.yml`](../../.github/workflows/lint.yml)
- Pre-commit: Add Husky or local Git hook for PHP linting

# Setup

1. **Install dependencies:**
   ```bash
   composer require --dev squizlabs/php_codesniffer wp-coding-standards/wpcs
   ```
2. **Config file:**
   ```xml
   <!-- phpcs.xml.dist -->
   <ruleset name="LightSpeed WordPress Standards">
     <rule ref="WordPress"/>
     <rule ref="WordPress-Docs"/>
     <rule ref="WordPress-Extra"/>
   </ruleset>
   ```
3. **Composer script:**  
   In `composer.json`:
   ```json
   "scripts": {
     "lint": "phpcs -q"
   }
   ```
4. **Pre-commit hook (optional, recommended):**
   ```bash
   npx husky add .husky/pre-commit "composer lint"
   ```
5. **CI:**  
   Linting is run automatically on PRs via the GitHub Actions workflow.

# Rules & Practices

- Follows [WordPress PHP Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/)
- Enforces 4-space indentation, Yoda conditions, escaping/sanitisation, and docblocks.
- Excludes files/folders as per `phpcs.xml.dist`.

# Running & Fixing

- Manually: `composer lint`
- To autofix: `vendor/bin/phpcbf`
- CI: Linting runs on PRs, fails if there are any errors.

# References

- [PHPCS docs](https://github.com/squizlabs/PHP_CodeSniffer)
- [WordPress PHP Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/)
- [LightSpeed Coding Standards Instructions](./coding-standards.instructions.md)