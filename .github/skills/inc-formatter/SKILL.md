---
name: inc-formatter
description: >
  Standardize WordPress theme PHP files with namespaces and remove legacy
  function prefixes. Use when migrating theme inc/ files to modern conventions,
  converting prefixed functions to namespaced ones, ensuring consistent PHP
  code structure across themes, removing function_exists wrappers, modernizing
  PHP code, or cleaning up legacy theme functions—even if they just mention
  standardizing or formatting theme PHP files. Works on themes using the dp_
  prefix convention.
license: MIT
compatibility: Requires Node.js 18+
metadata:
  version: "1.0.0"
  author: lightspeedwp
---

# Inc Folder PHP Formatter

## Purpose

Automate formatting of PHP include files to follow modern WordPress theme conventions:
- Add consistent namespace declarations
- Remove legacy function prefixes (e.g., `dp_`)
- Update WordPress hook callbacks to use `__NAMESPACE__`
- Clean up function_exists wrappers

## Quick Start

```bash
# From theme root

# Show what would be changed
node scripts/inc-formatter.cjs --scan inc/

# Preview changes (doesn't modify files)
node scripts/inc-formatter.cjs --format inc/ --dry-run

# Format all files in inc folder
node scripts/inc-formatter.cjs --format inc/

# Format a single file
node scripts/inc-formatter.cjs --format inc/block-bindings.php
```

## Formatting Rules

### 1. Add Namespace

Adds the theme namespace after the file docblock:

```php
// BEFORE
<?php
/**
 * File docblock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function dp_my_function() {
```

```php
// AFTER
<?php
/**
 * File docblock
 */
namespace DiePapierTema\includes;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function my_function() {
```

### 2. Remove Function Prefix

Removes the `dp_` prefix from all function declarations:

```php
// BEFORE
function dp_register_block_bindings() {
	// ...
}

// AFTER
function register_block_bindings() {
	// ...
}
```

### 3. Update Hook Callbacks

Updates `add_action` and `add_filter` callbacks to use namespace:

```php
// BEFORE
add_action( 'init', 'dp_register_block_bindings' );

// AFTER
add_action( 'init', __NAMESPACE__ . '\register_block_bindings' );
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
