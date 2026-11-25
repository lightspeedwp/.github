# Local site operations

Workarounds for verifying theme changes on a local site, especially WordPress Studio. Check the project's own notes as well.

## Running WP-CLI

- On a WordPress Studio site, prefix every WP-CLI command with `studio` (`studio wp …`), and run `studio --version` first to confirm the CLI is installed.
- Studio uses SQLite, so `wp db query` with raw MySQL can fail. Use `wp eval` or `wp eval-file` through the WordPress and WooCommerce APIs instead.
- On other local setups, WP-CLI can run out of memory on large themes. Raise the limit for the call: `php -d memory_limit=1024M $(which wp) …`.

## Getting new files registered

Theme block patterns are cached in a site transient keyed on the theme version, not on file times. `wp transient delete --all` is not enough. Run:

```bash
studio wp transient delete --all --network
```

Then confirm registration:

```bash
studio wp eval 'var_dump( WP_Block_Patterns_Registry::get_instance()->is_registered( "<theme>/<pattern-slug>" ) );'
studio wp eval 'print_r( array_keys( WP_Block_Styles_Registry::get_instance()->get_registered_styles_for_block( "core/group" ) ) );'
```

## Verify by rendering

Don't judge a pattern by reading its markup. Render it with representative data and check the output:

```php
// wp eval-file render-check.php
$post = get_post( <id> );
setup_postdata( $GLOBALS['post'] = $post );
// For products: wc_setup_product_data( $post );
// Render the registered content, so the pattern's PHP (translations, dynamic values) has run.
$pattern = WP_Block_Patterns_Registry::get_instance()->get_registered( '<theme>/<pattern-slug>' );
$html    = do_blocks( $pattern['content'] );
echo str_contains( $html, '<expected text>' ) ? "ok\n" : "missing\n";
```

Check that the key strings (title, price, attribute value, button, style class) are present and that no PHP notices appear in `wp-content/debug.log`.

## Visual checks

When a browser check is needed, compare the editor and the front end with the Figma screenshot at the 390px and 1440px frame widths. Check hover and focus-visible states with the keyboard.
