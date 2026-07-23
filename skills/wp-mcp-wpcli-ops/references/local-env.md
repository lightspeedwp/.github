# Local environment realities

Common local/dev traps. Re-check per machine — these are patterns, not constants.

## The repo may be a source checkout, not a runnable site

A working directory can be a **source checkout**, not a bootable WordPress install: `wp-config.php` may hold placeholder DB creds (`DB_NAME = database_name_here`), so WP-CLI and PHP can't bootstrap WordPress there, and there may be no `vendor/` / phpcs. **Offline you can only run `php -l` / `node --check`.** Real end-to-end verification needs a running local site or a deploy to a dev site (via MCP theme/plugin file tools + a browser).

## The local site may be very slow

A local WP (e.g. a Studio install) can take **tens of seconds per page load**. Consequences:

- Use long browser timeouts (`setDefaultTimeout(120000)`, `setDefaultNavigationTimeout`) and `waitUntil: 'domcontentloaded'` — **not** `'networkidle'`, which times out.
- Store API interactions are correspondingly slow (a cart stepper `+`/`−` may take several seconds for the `POST /wc/store/v1/batch` to land and the subtotal to re-render).
- **Don't conclude a feature is broken from one quick interaction** — wait/poll before judging. Lag reads like a bug but isn't.

## WP-CLI gotchas

- **OOM under the default PHP memory limit** → run `php -d memory_limit=1024M $(which wp) ...`.
- **`wp db query` fails** with `env: mysql: No such file or directory` when the MySQL client isn't on PATH → use `wp eval` / `wp eval-file` through the WP/WC data layer instead of raw `wp db query`.
- **Newly-added theme pattern/style files don't register until the cache clears.** Block patterns are cached in a site transient keyed on **theme Version** (not file mtimes), so `wp transient delete --all` is insufficient — run **`wp transient delete --all --network`**. Style variations under `styles/**` auto-register via core once cache is clear; confirm via `WP_Block_Styles_Registry`.

## `get_page_by_path()` matches attachments

`get_page_by_path()` always matches `attachment` in addition to the requested post type, so a CPT slug that collides with an image attachment name resolves to the attachment — and a follow-up `wp_update_post` can silently convert the attachment into a CPT post. Look CPT posts up explicitly:

```php
get_posts( [ 'post_type' => 'kwv_team', 'name' => $slug ] ); // not get_page_by_path()
```
