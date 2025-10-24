---
title: "WordPress Coding Standards Quickstart"
description: "How to apply WordPress Coding Standards in your codebase."
last_updated: "2025-10-21"
version: "v0.1.0"
owners:
  - "lightspeedwp/maintainers"
file_type: "guide"
category: "wordpress_guides"
tags: ["wordpress", "coding standards", "phpcs", "linting"]
language: "en"
status: "active"
visibility: "public"
---

# WordPress Coding Standards Quickstart

Get started with WordPress Coding Standards (WPCS) for PHP, JavaScript, CSS, and more.

## Example PHPCS Setup

1. Install PHPCS and WPCS:

   ```
   composer require --dev wp-coding-standards/wpcs
   vendor/bin/phpcs --config-set installed_paths vendor/wp-coding-standards/wpcs
   ```

2. Add a `.phpcs.xml.dist`:

   ```xml
   <ruleset name="WordPress Coding Standards">
     <rule ref="WordPress"/>
   </ruleset>
   ```

3. Run:

   ```
   vendor/bin/phpcs .
   ```

- Follow indentation and escaping conventions
- Document your APIs
