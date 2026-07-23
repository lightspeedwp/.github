# Caching — why a correct write stays invisible

On sites with a **persistent object cache** (Redis/Memcached drop-in) and/or a **page cache** (WP Rocket, etc.), a write the DB accepts can stay invisible in cached reads. The root cause, again, is topology: the MCP server's PHP process may have a **different cache backend than the web/REST workers**.

## What is and isn't visible

- **Raw SQL writes** hit MySQL and *are* visible to code that reads the DB.
- **Cache-eviction calls made from the MCP process** (`clean_term_cache`, etc.) **may not evict the web/REST workers' cache** — separate backend. Stale term counts, option values, and badges persist.
- A **no-op mutation** (e.g. re-adding a term relationship the object already has) fires nothing and busts nothing.

## Levers that actually bust the shared cache

- A **genuine model mutation that fires the right hooks.** Example: a real `set_object_terms` relationship change fires WooCommerce's term recount, which writes the new `count` to the DB and busts the shared cache. (Note: `add_post_terms`-style tools typically reject an empty `terms` array, so you can't "clear then re-add" to force a change.)
- After a **raw-SQL content edit**, trigger a `save_post` (e.g. a REST update that re-sets a field) to fire cache purges, including page-cache purge.
- For **page caches**, verify the front end with a **cache-busting query string** (`/path/?v=1`) since anonymous hits are served from cache.
- When in doubt, ask the user to run **`wp cache flush`**, or do a real save.

## Verification corollary

The DB is the source of truth. Verify counts and content with a **direct DB query**, not a cached read tool — a cached `wp_get_terms`/`get_option` can report a stale value even when the DB row is already correct.

> Example (labelled): on a dev site with a Redis drop-in, setting `wp_term_taxonomy.count` in SQL left brand count badges stale on the REST workers; only a genuine new product↔term relationship (firing `_wc_term_recount`) refreshed them. The migration pattern that worked: do the bulk relationship work in SQL, set counts in SQL, then have the user `wp cache flush`.
