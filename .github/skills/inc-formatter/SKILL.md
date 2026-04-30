---
name: inc-formatter
description: >
  Standardize WordPress theme PHP files with namespaces and remove legacy
  function prefixes. Use when migrating theme inc/ files to modern conventions,
  converting prefixed functions to namespaced ones, ensuring consistent PHP
  code structure across themes, removing function_exists wrappers, modernizing
  PHP code, or cleaning up legacy theme functions—even if they just mention
  standardizing or formatting theme PHP files. Auto-detects namespace and prefix
  or accepts explicit values via CLI arguments.
license: MIT
compatibility: Requires Node.js 18+
metadata:
  version: "1.0.0"
  author: lightspeedwp
---

# Inc Folder PHP Formatter

## Purpose

Automate formatting of PHP include files to follow modern WordPress theme conventions:
- Add consistent namespace declarations (auto-detected or specified)
- Remove legacy function prefixes (auto-detected or specified)
- Update WordPress hook callbacks to use `__NAMESPACE__`
- Clean up function_exists wrappers

The script intelligently detects your theme's namespace and function prefix patterns, or you can explicitly specify them.

## Quick Start

```bash
# From theme root

# Auto-detect namespace/prefix and show what would be changed
node scripts/inc-formatter.cjs --scan inc/

# With explicit namespace and prefix
node scripts/inc-formatter.cjs --scan inc/ --namespace="MyTheme\\includes" --prefix="mt_"

# Preview changes (doesn't modify files)
node scripts/inc-formatter.cjs --format inc/ --dry-run

# Format all files in inc folder
node scripts/inc-formatter.cjs --format inc/

# Format a single file
node scripts/inc-formatter.cjs --format inc/block-bindings.php
```

## Formatting Rules

### 1. Add Namespace

Adds the theme namespace after the file docblock (auto-detected or specified via `--namespace`):

```php
// BEFORE
<?php
/**
 * File docblock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function mytheme_my_function() {
```

```php
// AFTER
<?php
/**
 * File docblock
 */
namespace MyTheme\includes;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function my_function() {
```

### 2. Remove Function Prefix

Removes the function prefix from all function declarations (auto-detected or specified via `--prefix`):

```php
// BEFORE
function mytheme_register_blocks() {
	// ...
}

// AFTER
function register_blocks() {
	// ...
}
```

### 3. Update Hook Callbacks

Updates `add_action` and `add_filter` callbacks to use namespace:

```php
// BEFORE
add_action( 'init', 'mytheme_register_blocks' );

// AFTER
add_action( 'init', __NAMESPACE__ . '\register_blocks' );
```

### 4. Clean Orphaned Endif Statements

Removes orphaned `endif;` statements left after function_exists wrapper removal.

## Usage Workflow

1. **Backup your code** (commit to git or create backup copy)
2. **Scan files** to see what will change
3. **Dry-run** to preview changes without modifying files
4. **Format files** to apply changes
5. **Test thoroughly** (run PHP linter, test in browser)

## Common Use Cases

- Migrating legacy themes to namespaced architecture
- Standardizing code style across multiple themes
- Removing deprecated function_exists wrappers
- Preparing theme for modern PHP standards

## Validation

After formatting, validate with:

```bash
# Check PHP syntax
php -l inc/block-bindings.php

# Verify no orphaned endif statements
grep -n "endif" inc/*.php
```

For detailed bugfix documentation and troubleshooting, see [references/BUGFIX-REPORT.md](references/BUGFIX-REPORT.md).
