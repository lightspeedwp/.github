# Pattern PHP runs at registration, not per render

Raw PHP in a theme `patterns/*.php` file executes **once, at pattern registration (`init`)**, and its output is baked into the pattern's stored `content` string. It does **not** re-run per page render. At `init`, `get_queried_object()` and any main-query context are **null**.

## What's safe inline vs what isn't

- **Query-INDEPENDENT lookups are fine inline** — e.g. resolving an attachment by a fixed slug (`shop-hero.php`) returns the same value at `init` as at render.
- **Per-request / queried-object data must NOT be computed inline** — it will resolve against `null` at `init` and bake in a fallback.

> Symptom (labelled): a per-term banner hero always showed the fallback image, never the term's banner, even though the term meta was saved correctly — because the pattern PHP ran at `init`, before the term was queried, so the lookup returned empty.

## The fix: block bindings (or a dynamic block)

Per-request data must come from something that runs **at render**:

- A **dynamic block** (e.g. `wp:query-title` for the queried object's title), or
- A **block binding source** registered with `register_block_bindings_source()`, whose `get_value_callback` runs at render time.

House pattern: keep the binding-source registration in an `inc/` file (this is the legitimate exception to "patterns stay in `patterns/`" — it's plugin-like logic, not rendering markup). The pattern file references the binding; the callback supplies the value per request.

## Binding tips

- A `get_value_callback` that returns **`null`** makes core **skip the binding and keep the block's baked attribute value** — perfect for a static fallback with a per-request override (e.g. an image `url` binding with a baked fallback `src`).
- **Image `url` is bindable; `id` is not.** So `srcset` falls back to the baked `id` even when the `url` is overridden — a known limitation to flag, not fight.

## Verify across objects

Test the pattern on **more than one** post/term. A value that's actually still baked will appear correct on whichever object was current at `init` and wrong on all others.
