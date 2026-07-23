---
name: wp-pattern-runtime-pitfalls
description: "Avoid the runtime traps of WordPress block patterns (patterns/*.php) that look like static markup but aren't. Use when a pattern renders nothing, shows stale/fallback data, or behaves differently on the live page than in a WP-CLI test: nested wp:pattern references silently dropping on front-end render, raw pattern PHP running once at registration (init) instead of per-request, injecting queried-object data via block bindings, keeping hover-reveal panels editable in the editor, and the pattern/OPcache resets needed to see edits. Complements pattern-extractor (which generates patterns) with the behaviour to design around."
compatibility: "Targets WordPress 6.9+ block themes with file-based patterns in patterns/*.php. Some techniques use register_block_bindings_source() (WP 6.5+) and wp_enqueue_block_style. Runtime behaviour verified empirically — re-test after core upgrades."
---

# WP Pattern Runtime Pitfalls

## Overview

A file in `patterns/*.php` looks like static block markup, but it has a runtime model that trips people repeatedly: its **PHP runs once at registration, not per render**; a **`wp:pattern` reference nested inside another pattern is silently dropped** on the front end (while resolving fine in a WP-CLI `do_blocks()` test, so CLI lies to you); and per-request data has to arrive through **block bindings**, not inline PHP. This skill is the set of behaviours to design around, plus the cache resets and verification that keep you from chasing ghosts. It pairs with `pattern-extractor` (which *generates* production patterns) by documenting the traps that generation must respect.

## When to use

- A pattern **renders nothing** on the live page (no markup, no leftover comment).
- A pattern shows the **fallback / stale value** instead of the current post/term's data.
- A pattern behaves **differently on the live page than in a `do_blocks()` CLI test**.
- You need to **embed one pattern inside another**, inject **per-request data**, or keep a **hover-reveal** panel editable in the editor.

## Inputs required

- The theme's `patterns/` directory and how patterns are registered (theme auto-registration vs explicit).
- For dynamic data: where the theme keeps **block binding sources** (typically an `inc/` file calling `register_block_bindings_source()`).
- Access to reset the **pattern transient cache** and **OPcache** on the running site (note the CLI PHP and the web/php-fpm OPcache are usually separate).

## Procedure

1. **Keep each pattern self-contained in `patterns/<slug>.php`.** Don't relocate a pattern's rendering logic into an `inc/` helper — patterns should stay discoverable and editable in the standard location. (Binding *source* registration is different — that legitimately lives in `inc/`; see step 3.)
2. **Embed one pattern in another with `require`, not a nested `wp:pattern`.** A `<!-- wp:pattern {"slug":"…"} /-->` nested inside another pattern's content is silently dropped on front-end render. Use `require __DIR__ . '/<other-pattern>.php';` (plain `require`, not `require_once`) to inline its output; the required file stays an independently registered pattern. See `references/nesting-and-embedding.md`.
3. **Get per-request data from a block binding or dynamic block — never from inline pattern PHP.** Pattern PHP runs at `init`, when `get_queried_object()` is null, so its output is baked into the stored content string. Query-*independent* lookups (an attachment by slug) are fine inline; anything that depends on the current post/term must come from a `register_block_bindings_source()` callback or a dynamic block (`wp:query-title`). See `references/registration-vs-render.md`.
4. **For hover-reveal styles, make the hidden panel visible in the editor** with an `.editor-styles-wrapper`-scoped rule in the block's enqueued style. See `references/editor-visibility.md`.
5. **After editing pattern files, reset caches before testing** — the theme pattern transient *and* the web-SAPI OPcache. See `references/nesting-and-embedding.md`.

## Verification

- **Test on the actual rendered front-end page, not a WP-CLI `do_blocks()` call.** The nested-pattern drop does **not** reproduce under CLI — a green CLI test can mask a broken live page.
- **After a pattern-file edit, confirm the cache is cleared** (pattern transient + OPcache) or you'll be testing stale output.
- **For dynamic data, verify with more than one post/term** — a binding that's actually still baked will "work" on whichever object happened to be current at init and fail on the rest.
- If the page is a **DB template/part override**, remember your file edit may not be what renders at all — see `wp-db-override-reconciliation`.

## Failure modes

- **Inner pattern renders nothing on the front end** → it was referenced via nested `wp:pattern`; inline it with `require`. → `references/nesting-and-embedding.md`
- **CLI says it works, live page doesn't** → the nested-pattern bug is front-end-only; stop trusting `do_blocks()` for it. → `references/nesting-and-embedding.md`
- **Always shows the fallback / one object's data** → inline PHP ran at `init` before the query; move it to a binding source. → `references/registration-vs-render.md`
- **Edited the pattern, page unchanged** → stale pattern transient / OPcache (or a DB override is shadowing the file). → `references/nesting-and-embedding.md`, `wp-db-override-reconciliation`
- **Hover-reveal text uneditable in the editor** → the panel is collapsed in the editor too; add an editor-only reveal. → `references/editor-visibility.md`

## Escalation

- If a pattern needs dynamic data that has no bindable attribute (e.g. image `id` for srcset isn't bindable, only `url`), flag the limitation — the baked fallback `id` will drive srcset even when the `url` is overridden per request.
- If the house rule "patterns stay in `patterns/`" conflicts with a genuinely reusable helper, raise it rather than silently relocating rendering logic to `inc/`.

## Related

- `pattern-extractor` — generate a production pattern from a Figma design; this skill is the runtime behaviour that generation must respect.
- `wp-blockstyle-css-field` — where a pattern's styling belongs and why the css field drops `:hover`.
- `wp-db-override-reconciliation` — when the live page renders from a DB copy, not your pattern file.
- `wp-mcp-wpcli-ops` — the exact pattern-transient/OPcache reset commands.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
