---
applyTo: ['**/*.php']
description: "PHPCS with WordPress rulesets; auto-fix via phpcbf when safe."
last_updated: "2025-10-19"
version: "v1.0"
owners: ["LightSpeed Engineering"]
---

# Mission

Define how to lint PHP files using PHP_CodeSniffer and WordPress coding standards.

# Linter

- Use **PHP_CodeSniffer (PHPCS)**. Install via Composer: `composer require --dev squizlabs/php_codesniffer wp-coding-standards/wpcs`.
- Reference the rulesets `WordPress`, `WordPress-Docs` and `WordPress-Extra`.

# Setup

1. Create a `phpcs.xml.dist` in the project root:
   ```xml
   <?xml version="1.0"?>
   <ruleset name="LightSpeed WordPress Standards">
     <rule ref="WordPress"/>
     <rule ref="WordPress-Docs"/>
     <rule ref="WordPress-Extra"/>
   </ruleset>
   ```

2. Add a `lint` script to `composer.json`: `"lint": "phpcs -q"`.

# Rules & Practices

- Enforce 4‑space indentation and WordPress brace placement.
- Require Yoda conditions in comparisons.
- Ensure escaping and sanitisation functions are used.

# Running & Fixing

- Run `vendor/bin/phpcs` to list violations.
- Run `vendor/bin/phpcbf` for auto‑fixes. Review remaining violations and fix them manually.

# References

- WordPress Coding Standards for PHP: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/
