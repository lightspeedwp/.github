---
file_type: instructions
title: WordPress Project Planning Standards
description: Guidelines for planning, structuring, and executing WordPress plugin and theme projects within LightSpeedWP repositories.
scope: organization-wide
applyTo: 'wp-plugins/**,wp-themes/**'
version: v1.0
last_updated: '2026-05-29'
owners:
- LightSpeedWP Team
tags:
- wordpress
- project-planning
- governance
- standards
status: active
---

# WordPress Project Planning Standards

You are a LightSpeedWP WordPress architect. Follow our project planning standards to structure WordPress projects for maintainability, scalability, and team collaboration. Apply WordPress-specific conventions while integrating with LightSpeedWP governance and automation standards.

## Overview

Defines planning, organisation, and execution standards specific to WordPress plugin and theme projects. Covers project structure, dependencies, versioning, feature planning, and WordPress-specific quality gates. Ensures WordPress projects follow both WordPress conventions and LightSpeedWP standards.

**What this covers:**

- WordPress project directory structure and conventions
- Plugin and theme metadata standards
- WordPress-specific coding and standards compliance
- Feature planning for WordPress projects
- Backwards compatibility and upgrade strategies
- WordPress-specific testing and quality gates

**What this does not cover:**

- Organisation-wide coding standards (see coding-standards.instructions.md)
- PHP language-specific patterns (see PHP section in coding-standards.instructions.md)

## General Rules

- **Follow WordPress standards:** Use WordPress Coding Standards for PHP, use WordPress conventions for hooks, filters, and capabilities
- **Backwards compatibility:** Maintain support for at least 2 major WordPress versions; document version requirements clearly
- **Minimal dependencies:** Avoid unnecessary external libraries; WordPress provides most functionality through built-in APIs
- **Semantic versioning:** Use major.minor.patch; increment based on feature additions and breaking changes
- **Proper namespace isolation:** Use unique prefixes for functions, classes, and database tables to avoid conflicts
- **Security first:** Validate all input, escape all output, use nonces, verify capabilities, never trust user data
- **Accessibility compliance:** WCAG 2.2 AA minimum; semantic HTML, keyboard support, sufficient contrast
- **Performance budgets:** Admin pages < 1s, frontend < 2s on 3G; measure and document improvements

## Detailed Guidance

### Project Structure

WordPress projects follow this structure:

```
wp-plugin-name/
├── wp-plugin-name.php              # Main plugin file with plugin header
├── readme.txt                       # WordPress plugin directory readme
├── composer.json / package.json     # Dependencies (minimal)
├── CHANGELOG.md                     # Version history
├── CONTRIBUTING.md                  # Contribution guidelines
├── README.md                        # Developer documentation
│
├── src/
│   ├── Hooks/                       # Hook registration and callbacks
│   ├── Admin/                       # Admin page classes
│   ├── Frontend/                    # Public-facing functionality
│   ├── Settings/                    # Configuration and options
│   ├── Database/                    # Custom tables and queries
│   └── Utilities/                   # Helper functions and classes
│
├── includes/
│   ├── functions.php                # Global utility functions
│   ├── deprecated.php               # Deprecated functions (for backwards compat)
│   └── compatibility.php            # Compatibility layer for older WP versions
│
├── assets/
│   ├── js/                          # JavaScript (frontend and admin)
│   ├── css/                         # Stylesheets
│   └── images/                      # Icons, illustrations
│
├── templates/                       # Template files for display
├── tests/                           # WordPress unit tests
└── .github/
    ├── workflows/                   # CI/CD workflows
    └── instructions/                # Plugin-local instructions
```

### Plugin/Theme Header Standards

Main plugin file must include proper plugin header:

```php
<?php
/**
 * Plugin Name: Human-Readable Plugin Name
 * Description: What this plugin does, in plain language
 * Version: 1.0.0
 * Author: LightSpeedWP
 * Author URI: https://lightspeedwp.com
 * License: GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: unique-plugin-slug
 * Domain Path: /languages
 * Requires at least: 5.0
 * Requires PHP: 7.4
 * WC Requires at least: 4.0  (if WooCommerce dependent)
 * WC Tested up to: 7.0        (if WooCommerce dependent)
 */
```

Theme header (style.css):

```css
/*
Theme Name: Human-Readable Theme Name
Theme URI: https://github.com/lightspeedwp/theme-name
Author: LightSpeedWP
Author URI: https://lightspeedwp.com
Description: What this theme is designed for
Version: 1.0.0
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Text Domain: unique-theme-slug
Domain Path: /languages
Requires at least: 5.9
Requires PHP: 7.4
*/
```

### WordPress-Specific Code Practices

#### Hooks and Actions

Register hooks early (in `plugins_loaded` or theme `after_setup_theme`):

```php
add_action( 'plugins_loaded', function() {
  // Register hooks and initialise functionality
  add_filter( 'the_content', [ new ContentFilter(), 'filter_content' ] );
  add_action( 'wp_enqueue_scripts', [ new AssetEnqueuer(), 'enqueue_frontend' ] );
} );
```

Use action and filter names that are descriptive and unique:

```php
// Good: unique prefix + descriptive action
do_action( 'lightspeedwp_after_custom_post_type_saved', $post_id );

// Bad: too generic or no prefix
do_action( 'after_save' );
```

#### Capabilities and Permissions

Always check capabilities before performing privileged actions:

```php
// Good: verify capability
if ( ! current_user_can( 'manage_options' ) ) {
  wp_die( 'Insufficient permissions' );
}

// Bad: no capability check
if ( is_admin() ) {
  // Process form
}
```

#### Database Queries

Use WordPress APIs for queries:

```php
// Good: use WP_Query for posts
$posts = new WP_Query( [
  'post_type' => 'post',
  'posts_per_page' => 10,
  'orderby' => 'date',
  'order' => 'DESC',
] );

// OK: use wpdb for custom queries (with prepared statements)
global $wpdb;
$results = $wpdb->get_results( $wpdb->prepare(
  "SELECT * FROM {$wpdb->postmeta} WHERE meta_key = %s",
  'my_key'
) );

// Bad: no prepared statements (SQL injection vulnerability)
$results = $wpdb->get_results( "SELECT * FROM $wpdb->posts WHERE ID = $_GET[id]" );
```

#### Enqueuing Scripts and Styles

Always enqueue assets with proper dependencies and versions:

```php
wp_enqueue_style(
  'my-plugin-styles',
  plugin_dir_url( __FILE__ ) . 'assets/css/style.css',
  [ 'wp-components' ],  // Dependencies
  PLUGIN_VERSION
);

wp_enqueue_script(
  'my-plugin-script',
  plugin_dir_url( __FILE__ ) . 'assets/js/script.js',
  [ 'jquery', 'wp-api' ],  // Dependencies
  PLUGIN_VERSION,
  true  // Load in footer
);
```

### Backwards Compatibility

Maintain backwards compatibility:

- Support at least 2 major WordPress versions back from current stable
- Use `if ( function_exists() )` guards for newer WordPress functions
- Create compatibility layer for deprecated functions
- Document version requirements clearly in plugin header
- Test against minimum supported versions in CI

```php
// Compatibility function for WordPress < 5.9
if ( ! function_exists( 'wp_is_block_theme' ) ) {
  function wp_is_block_theme() {
    return function_exists( 'get_block_templates' );
  }
}
```

### Version Management

Use semantic versioning (major.minor.patch):

- **Major version:** Breaking changes, significant features (4.0.0)
- **Minor version:** New features, backwards-compatible enhancements (3.5.0)
- **Patch version:** Bug fixes, security updates (3.4.2)

Maintain changelog documenting all versions and changes.

### Testing Strategy for WordPress

Required test coverage:

- **Unit tests:** Test PHP classes and functions in isolation (PHPUnit)
- **Integration tests:** Test WordPress hooks and filters; verify admin pages load
- **Browser tests:** For frontend features and admin interfaces (E2E testing)
- **Backwards compatibility:** Test against minimum supported WordPress version
- **Security scanning:** Automated checks for common vulnerabilities

### WordPress-Specific CI Checks

Automated checks for WordPress projects:

- **PHPCS/WPCS:** WordPress Coding Standards compliance
- **PHPUnit:** Unit test suite execution
- **Security scanning:** Check for common WordPress vulnerabilities
- **Changelog validation:** Verify changelog follows format and includes all versions
- **Plugin header validation:** Verify required header fields are present and valid
- **Readme.txt validation:** Verify readme follows WordPress directory standards

## Examples

**Good:** WordPress plugin project structure:

```
wc-discount-codes/
├── wc-discount-codes.php           # Main plugin with proper header
├── composer.json                    # Minimal dependencies
├── CHANGELOG.md                     # Version history
├── README.md                        # Developer guide
├── src/
│   ├── Admin/DiscountCodeList.php   # Admin list table
│   ├── Hooks/DiscountCodeHooks.php  # Hook registration
│   └── Database/DiscountTable.php   # Custom table class
├── templates/
│   └── customer-discount-codes.php  # Frontend template
├── assets/
│   ├── js/discount-code.js          # Frontend JavaScript
│   └── css/admin.css                # Admin styles
├── tests/
│   └── Unit/DiscountCodeTest.php    # Unit tests
└── .github/workflows/
    └── test.yml                     # CI testing
```

**Bad:** Unstructured plugin:

```
discount-plugin/
├── discount-plugin.php              # Everything in one file
├── functions.php                    # Global functions mixed in
├── css/
│   └── style.css
├── js/
│   └── script.js
└── README.txt
```

## Validation

- ✅ Plugin/theme header includes all required metadata
- ✅ Project structure follows WordPress conventions
- ✅ All user input validated; all output escaped
- ✅ Proper capabilities checked before privileged operations
- ✅ Database queries use prepared statements
- ✅ Assets enqueued with proper dependencies
- ✅ Minimum WordPress version documented and tested
- ✅ Changelog maintained and current
- ✅ CI includes PHPCS, PHPUnit, security scanning
- ✅ Code follows WordPress Coding Standards

## References

- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/)
- [WordPress Plugin Handbook](https://developer.wordpress.org/plugins/)
- [WordPress Theme Handbook](https://developer.wordpress.org/themes/)
- [Coding Standards](./coding-standards.instructions.md)
- [Quality Assurance](./quality-assurance.instructions.md)

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
