# Nesting patterns & cache resets

## Nested `wp:pattern` is silently dropped on the front end

A `<!-- wp:pattern {"slug":"…"} /-->` reference placed **inside another pattern's content** is **not resolved on front-end template render** — the inner pattern renders nothing: no markup, no leftover comment.

Crucially, it **does** resolve via `do_blocks()` in WP-CLI. So the bug shows only on the live page, and **a passing CLI `do_blocks()` test will mask it.** Always verify on the actual rendered page.

### What resolves fine

- **Template-level** `wp:pattern` refs placed directly in a `templates/*.html` file.
- **`wp:template-part`** refs nested inside patterns (e.g. a product-card part inside a product-collection loop).

It's specifically **pattern-inside-pattern** that fails.

### The fix: inline with `require`

To embed one pattern inside another, inline its output:

```php
require __DIR__ . '/shop-hero.php'; // plain require, NOT require_once
```

The required file remains an independently registered pattern; you're just inlining its rendered output into the host pattern's content.

> Example (labelled): `kwv/shop-hero` embedded inside `kwv/woo-product-archive` via `require`, because the nested `wp:pattern` ref rendered nothing on the live archive.

## Cache resets after editing pattern files

Pattern edits are cached in two independent layers — clear both before re-testing:

1. **Theme pattern transient.** Patterns are cached in a site transient keyed on the **theme Version** (not file mtimes). `wp transient delete --all` is insufficient — use `wp transient delete --all --network` (or `$theme->delete_pattern_cache()`).
2. **OPcache.** The web server's php-fpm OPcache is **separate** from the CLI PHP's — a `wp eval 'opcache_reset()'` only clears the CLI process. To pick up pattern/PHP edits on the web SAPI, hit an `opcache_reset()` script over HTTP (drop it in the docroot, curl it, delete it). See `wp-mcp-wpcli-ops` → `references/local-env.md`.

If edits *still* don't show after both resets, suspect a **DB template/part override** shadowing the file — see `wp-db-override-reconciliation`.
