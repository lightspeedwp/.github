# Inc Folder PHP Formatter

A code formatting skill for standardizing PHP files in the theme's `inc/` folder.

## Purpose

Automates the formatting of PHP include files to follow Die Papier Tema conventions:
- Consistent namespace usage
- Removes legacy prefixes
- Standardizes WordPress hook callbacks

## Quick Start

```bash
# From theme root

# Show what would be changed
node scripts/inc-formatter.js --scan inc/

# Preview changes (doesn't modify files)
node scripts/inc-formatter.js --format inc/ --dry-run

# Format all files in inc folder
node scripts/inc-formatter.js --format inc/

# Format a single file
node scripts/inc-formatter.js --format inc/block-bindings.php
```

## Formatting Rules

### 1. Add Namespace

Adds the theme namespace after the file docblock:

**Before:**
```php
<?php
/**
 * File docblock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function dp_my_function() {
```

**After:**
```php
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

**Before:**
```php
function dp_register_block_bindings() {
	// ...
}

if ( ! function_exists( 'dp_get_cpt_meta_value' ) ) :
	function dp_get_cpt_meta_value() {
		// ...
	}
endif;
```

**After:**
```php
function register_block_bindings() {
	// ...
}

if ( ! function_exists( 'get_cpt_meta_value' ) ) :
	function get_cpt_meta_value() {
		// ...
	}
endif;
```

### 3. Update Hook Callbacks

Updates `add_action` and `add_filter` callbacks to use namespace:

**Before:**
```php
add_action( 'init', 'dp_register_block_bindings' );
add_filter( 'wp_theme_json_data_theme', 'dp_merge_preset_files' );
```

**After:**
```php
add_action( 'init', __NAMESPACE__ . '\register_block_bindings' );
add_filter( 'wp_theme_json_data_theme', __NAMESPACE__ . '\merge_preset_files' );
```

## Example: block-bindings.php

### Before Formatting
```php
<?php
/**
 * Block Bindings Registration.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'dp_register_block_bindings' ) ) :
	function dp_register_block_bindings() {
		if ( ! function_exists( 'register_block_bindings_source' ) ) {
			return;
		}

		register_block_bindings_source( 'die-papier/cpt-meta', array(
			'label'              => __( 'Die Papier CPT Meta', 'die-papier' ),
			'get_value_callback' => 'dp_get_cpt_meta_value',
			'uses_context'       => array( 'postId', 'postType' ),
		) );
	}
endif;
add_action( 'init', 'dp_register_block_bindings' );

if ( ! function_exists( 'dp_get_cpt_meta_value' ) ) :
	function dp_get_cpt_meta_value( $source_args, $block_instance, $attribute_name ) {
		// Implementation...
	}
endif;
```

### After Formatting
```php
<?php
/**
 * Block Bindings Registration.
 */
namespace DiePapierTema\includes;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'register_block_bindings' ) ) :
	function register_block_bindings() {
		if ( ! function_exists( 'register_block_bindings_source' ) ) {
			return;
		}

		register_block_bindings_source( 'die-papier/cpt-meta', array(
			'label'              => __( 'Die Papier CPT Meta', 'die-papier' ),
			'get_value_callback' => __NAMESPACE__ . '\get_cpt_meta_value',
			'uses_context'       => array( 'postId', 'postType' ),
		) );
	}
endif;
add_action( 'init', __NAMESPACE__ . '\register_block_bindings' );

if ( ! function_exists( 'get_cpt_meta_value' ) ) :
	function get_cpt_meta_value( $source_args, $block_instance, $attribute_name ) {
		// Implementation...
	}
endif;
```

## Usage Examples

### Scan Entire Inc Folder
```bash
node scripts/inc-formatter.js --scan inc/
```

This will show:
- How many files need formatting
- What changes will be made
- Function renames
- Hook callback updates

### Preview Changes (Dry Run)
```bash
node scripts/inc-formatter.js --format inc/ --dry-run
```

Shows what would change without modifying files.

### Format All Files
```bash
node scripts/inc-formatter.js --format inc/
```

⚠️ **IMPORTANT**: Make sure to commit your changes before running this, or create a backup.

### Format Single File
```bash
node scripts/inc-formatter.js --format inc/block-bindings.php
```

### Verbose Output
```bash
node scripts/inc-formatter.js --scan inc/ --verbose
```

Shows detailed scanning progress.

## Benefits

1. **Consistency**: All inc files follow the same namespace pattern
2. **Clean Names**: No more prefix pollution in function names
3. **PSR-4 Ready**: Proper namespace structure for autoloading
4. **Maintainability**: Easier to read and understand code
5. **Best Practices**: Follows WordPress and PHP standards

## Safety Features

- **Dry run mode**: Preview changes before applying
- **Selective formatting**: Format individual files or entire folders
- **Detailed reports**: See exactly what will change
- **Error handling**: Skips files with issues and reports them

## Workflow Recommendation

1. **Commit your work** before running the formatter
2. **Scan first** to see what needs changing:
   ```bash
   node scripts/inc-formatter.js --scan inc/
   ```
3. **Review the report** to ensure changes make sense
4. **Dry run** to preview:
   ```bash
   node scripts/inc-formatter.js --format inc/ --dry-run
   ```
5. **Format** when ready:
   ```bash
   node scripts/inc-formatter.js --format inc/
   ```
6. **Test** your theme to ensure everything works
7. **Commit** the formatted files

## What It Doesn't Do

- Doesn't format code style (indentation, spacing, etc.)
- Doesn't handle class prefixes (focuses on functions)
- Doesn't update function calls in template files
- Doesn't rename meta keys or database values

## Troubleshooting

**Functions not being renamed:**
- Ensure functions start with `dp_` prefix
- Check that function is declared with `function` keyword

**Hook callbacks not updating:**
- Must use single or double quotes around callback name
- Formatter looks for `add_action` and `add_filter` specifically

**Namespace not being added:**
- Check that file starts with `<?php`
- Ensure file has a docblock before code

## Integration with Theme

The formatter is designed to work with:
- **presets.php**: Already formatted ✅
- **block-bindings.php**: Formatted in demo ✅
- Any future inc files you add

## Related Tools

- **[Spacing Mapper](./README.md#spacing-mapper)**: Migrates spacing presets
- **PHP_CodeSniffer**: For code style enforcement
- **PHPStan**: For static analysis

---

**Created**: 2 March 2026  
**Theme**: Die Papier Tema  
**Tool Version**: 1.0.0
