---
description: "WordPress block plugin structure conventions for all LightSpeed plugins: directory layout, block.json, asset enqueueing, security, and i18n."
applyTo: "**"
file_type: "instructions"
version: "v1.0"
last_updated: "2026-05-20"
owners: ["LightSpeed Team"]
tags: ["wordpress", "plugin", "blocks", "block-json", "structure", "php", "i18n"]
domain: "plugin-hardening"
stability: "stable"
---

# WordPress Block Plugin Structure

You are a WordPress block plugin architect. Follow our block-first plugin conventions to scaffold, structure, and maintain LightSpeed plugins. Avoid page-builder patterns, direct SQL, and enqueuing assets globally where block-scoped loading suffices.

## Overview

Applies to all LightSpeed WordPress plugins that ship one or more Gutenberg blocks. Covers directory layout, `block.json` conventions, asset enqueueing, PHP organisation, security, and i18n. Excludes theme-only patterns—see the block theme guidance for those.

## General Rules

- Scaffold new blocks with `@wordpress/create-block`; align the output to the conventions below.
- Use `block.json` as the canonical source of block metadata, attributes, and supported features.
- Separate editor assets from front-end assets; never enqueue editor-only code on the front end.
- Register all blocks via `register_block_type()` pointing to the `block.json` file—avoid manual registration of attributes and scripts.
- Follow [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/) for PHP, JS, CSS, and HTML.
- Apply `sanitize_*`, `esc_*`, and `wp_kses_post()` at all input and output boundaries.
- Use a plugin-specific text domain and run `wp-scripts i18n make-pot` as part of the build.

## Detailed Guidance

### Directory Layout

Prefer this layout for a single-block plugin; extend it for multi-block plugins by repeating the `src/<block-name>/` pattern.

```text
my-plugin/
├── my-plugin.php            # Plugin header, bootstrap loader
├── readme.txt               # WordPress.org readme
├── package.json             # wp-scripts, node tooling
├── composer.json            # PHP tooling (PHPCS, PHPStan)
├── block.json               # Root block metadata (single-block plugins only)
├── src/
│   ├── block.json           # Preferred: block metadata lives with source
│   ├── edit.js              # Editor component
│   ├── save.js              # Front-end render (or null for dynamic blocks)
│   ├── index.js             # Block registration entry point
│   ├── editor.scss          # Editor-only styles
│   └── style.scss           # Shared/front-end styles
├── build/                   # wp-scripts output (gitignored)
├── includes/
│   ├── class-my-plugin.php  # Main plugin class
│   └── functions.php        # Utility functions
└── languages/
    └── my-plugin.pot        # Generated POT file
```

For multi-block plugins, place each block under its own subfolder:

```text
src/
├── my-block/
│   ├── block.json
│   ├── edit.js
│   ├── save.js
│   ├── index.js
│   ├── editor.scss
│   └── style.scss
└── another-block/
    └── ...
```

### Plugin File Header

The main PHP file must include the standard WordPress plugin header:

```php
<?php
/**
 * Plugin Name:       My LightSpeed Plugin
 * Plugin URI:        https://lightspeedwp.agency/
 * Description:       A block-first WordPress plugin.
 * Version:           1.0.0
 * Requires at least: 6.4
 * Requires PHP:      8.0
 * Author:            LightSpeed
 * Author URI:        https://lightspeedwp.agency/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       my-plugin
 * Domain Path:       /languages
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}
```

### `block.json` Conventions

- Always include `$schema` pointing to the WordPress block schema for IDE support and validation.
- Set `"apiVersion": 3` unless you explicitly need an older API.
- Declare all supported features under `"supports"` rather than enabling them manually.
- Use `"editorScript"` and `"style"` (or `"editorStyle"`) to reference build artefacts; let `register_block_type()` handle enqueueing automatically.

```json
{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "my-plugin/my-block",
  "version": "1.0.0",
  "title": "My Block",
  "category": "widgets",
  "description": "A short description of the block.",
  "textdomain": "my-plugin",
  "editorScript": "file:./index.js",
  "editorStyle": "file:./index.css",
  "style": "file:./style-index.css",
  "supports": {
    "html": false,
    "color": { "background": true, "text": true },
    "spacing": { "margin": true, "padding": true },
    "typography": { "fontSize": true }
  },
  "attributes": {
    "content": {
      "type": "string",
      "default": ""
    }
  }
}
```

### Asset Enqueueing

- Prefer automatic asset loading via `register_block_type( __DIR__ . '/build/block-name/block.json' )`.
- Only use `wp_enqueue_scripts` / `enqueue_block_editor_assets` for assets that cannot be declared in `block.json`.
- Never enqueue editor JS on the front end; never enqueue front-end-only assets in the editor.

```php
// Preferred: automatic loading via block.json
add_action( 'init', function() {
    register_block_type( __DIR__ . '/build/block-name' );
} );
```

### Security

- Validate all user input with `sanitize_text_field()`, `absint()`, `sanitize_url()`, or appropriate sanitizers.
- Escape all output: `esc_html()`, `esc_attr()`, `esc_url()`, `wp_kses_post()`.
- Use nonces for any form submission or AJAX request that modifies data.
- Never trust client-side attribute values in dynamic block `render_callback`—re-validate server-side.
- Use `current_user_can()` before privileged operations.

```php
// Good: validate, then escape on output
$title = sanitize_text_field( $attributes['title'] ?? '' );
echo '<h2>' . esc_html( $title ) . '</h2>';
```

### i18n

- Declare the text domain in both the plugin header and `block.json` (`"textdomain"` key).
- Wrap all user-facing strings in `__()`, `esc_html__()`, or `_n()` with the plugin text domain.
- In JavaScript, import `{ __ }` from `@wordpress/i18n`.
- Generate the POT file: `wp i18n make-pot . languages/my-plugin.pot --domain=my-plugin`.
- Add `wp-scripts i18n make-json languages/ --no-purge` to the build pipeline to create JSON translation files.

### PHP Class Organisation

- Use a main plugin class to namespace all hooks and methods.
- Register hooks in an `init()` or `run()` method, not in the constructor.
- Keep the constructor lean: set version constants and properties only.

```php
class My_Plugin {
    public function __construct( string $version ) {
        $this->version = $version;
    }

    public function run(): void {
        add_action( 'init', [ $this, 'register_blocks' ] );
    }

    public function register_blocks(): void {
        register_block_type( __DIR__ . '/../build/my-block' );
    }
}
```

## Examples

- **Good:** `register_block_type( __DIR__ . '/build/my-block' )` with a matching `block.json`; editor styles in `editorStyle`, shared styles in `style`; all output wrapped in `esc_html()`.
- **Avoid:** Manually registering block scripts with `wp_register_script` and duplicating metadata already declared in `block.json`; enqueuing editor assets unconditionally via `wp_enqueue_scripts`.

## Validation

- Run `npm run build` to confirm `@wordpress/scripts` compiles without errors.
- Run `composer phpcs` (PHPCS with WPCS) on the `includes/` and plugin root PHP.
- Check `block.json` validates against the schema: `npx @wordpress/scripts check-engines`.
- Confirm no editor styles leak to the front end by inspecting network requests on a published post.

## References

- [coding-standards.instructions.md](./coding-standards.instructions.md)
- [a11y.instructions.md](./a11y.instructions.md)
- [WordPress Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [block.json schema reference](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/)
- [@wordpress/create-block](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-create-block/)
- [WordPress Plugin Handbook](https://developer.wordpress.org/plugins/)
