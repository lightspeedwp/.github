# Re-injecting a dropped `is-style-*` class

To style a plugin block with a theme block style, the block needs your `is-style-<slug>` class on its front-end markup. Many plugin render callbacks return **raw markup without `get_block_wrapper_attributes()`**, so the class the editor set is **dropped on render** — your style never applies.

Re-attach it with a `render_block` filter.

## Do it with `WP_HTML_Tag_Processor`, not `str_replace`

```php
add_filter( 'render_block', function ( $content, $block ) {
    if ( 'plugin/search-block' !== ( $block['blockName'] ?? '' ) ) {
        return $content;
    }
    $style = $block['attrs']['className'] ?? '';           // e.g. "is-style-kwv-header-search"
    if ( ! str_contains( $style, 'is-style-' ) ) {
        return $content;
    }
    $p = new WP_HTML_Tag_Processor( $content );
    if ( $p->next_tag( [ 'class_name' => 'aws-container' ] ) ) {
        $p->add_class( trim( $style ) );
    }
    return $p->get_updated_html();
}, 10, 2 );
```

### Why not `str_replace('class="aws-container"', …)`

If **another plugin** also filters `render_block` on the same block (a common one: a block-visibility plugin) and rewrites the class attribute with `WP_HTML_Tag_Processor`, the attribute is no longer the exact string `class="aws-container"` — so your `str_replace` **silently fails** on exactly those blocks (e.g. a header search hidden on mobile via visibility rules). `add_class()` merges regardless of attribute order or other classes.

> Example (labelled): this exact conflict — Block Visibility filtering `render_block` at priority 10 and rewriting `.aws-container` — cost a debug cycle before switching from `str_replace` to `WP_HTML_Tag_Processor::add_class()`.

## Enqueue ordering

If your stylesheet must beat the plugin's, **depend it on the plugin's handle** so it loads after:

```php
wp_enqueue_style( 'kwv-aws', …, [ 'aws-style' ], … ); // plugin enqueues 'aws-style' @10; ours @20
```

Load order alone won't beat `!important` — see `override-and-bleed.md`.
