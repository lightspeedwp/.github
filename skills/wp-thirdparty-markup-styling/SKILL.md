---
name: wp-thirdparty-markup-styling
description: 'Style WordPress/WooCommerce markup you don''t control — plugin blocks, body-level portals, and render callbacks that drop your classes — from a block theme. Use when a plugin''s UI (mini-cart drawer, search-results dropdown, BNPL widget, etc.) won''t take your CSS: it renders as a body-level portal outside the block wrapper, strips the is-style-* class you set, ships !important-heavy stylesheets, or its styles bleed into (or leak out of) nested core blocks. Covers portal scoping, safe class re-injection, surgical specificity overrides, and defensive selector scoping.'
compatibility: Targets WordPress 6.9+ block themes, typically with WooCommerce and third-party plugins. Uses render_block filters + WP_HTML_Tag_Processor and wp_enqueue_block_style/wp_enqueue_scripts. Plugin internals (class names, markup) are version-specific — re-inspect the live DOM per plugin/version.
---

# WP Third-Party Markup Styling

## Overview

Styling your own blocks is easy; styling markup a **plugin** emits is where a theme fights the DOM. Four problems recur: the plugin renders its UI as a **body-level portal** (outside your block, so block-scoped CSS never matches); its render callback **drops the `is-style-*` class** you added; it ships **`!important`-heavy stylesheets** that out-gun yours; and its styles **bleed into nested core blocks** (or your styles leak into its). This skill is the set of techniques for each — inspect the *real* rendered DOM first, then scope, re-inject, and override deliberately rather than by escalating `!important`.

## When to use

- A plugin's slide-out / dropdown / modal (mini-cart drawer, search results, popup) **ignores CSS** scoped to its block.
- Your `is-style-*` class **disappears** from a plugin block's front-end markup.
- A plugin's `!important` rules **override** your theme styles no matter the load order.
- A **nested `core/navigation`** (or similar) inside a plugin dropdown comes out looking like your main nav, or a plugin's button inherits your theme.json button styles.

## Inputs required

- The **live rendered DOM** of the plugin UI (headless browser or devtools) — not the editor markup, and not an assumption. Portals and dropped classes are only visible at render.
- The plugin's **enqueued stylesheet handle** and priority (to order/depend your sheet correctly).
- Whether **other plugins also filter `render_block`** on the same blocks (e.g. a visibility plugin) — this changes how you must inject classes.

## Procedure

1. **Inspect the real DOM first.** Open the plugin UI in a browser and read where its markup actually lives. If the panel is a direct child of `<body>`, it's a portal — see step 2. Note the plugin's own class hooks.
2. **Scope portal UI to the portal root, not the block.** A body-level portal is not a descendant of the block wrapper, so `.<block> .<x>` never matches. Scope to the portal's own root class. See `references/body-portals.md`.
3. **If your `is-style-*` class is missing, re-inject it safely.** Plugin render callbacks that skip `get_block_wrapper_attributes()` drop the class. Re-attach it with a `render_block` filter using `WP_HTML_Tag_Processor::add_class()` — **not** `str_replace` (which silently fails when another plugin also rewrote the class attr). See `references/class-injection.md`.
4. **Override `!important` surgically.** Depend your sheet on the plugin's handle so it loads after, then use matched specificity / `!important` **only** on the exact declarations the plugin forces — and put each rule on the element the plugin actually targets. See `references/override-and-bleed.md`.
5. **Contain style bleed both ways.** Set nested core blocks to opt out (e.g. `overlayMenu:"never"`), and write your block-style selectors as **direct-child** combinators so they can't descend into nested plugin/core blocks. See `references/override-and-bleed.md`.

## Verification

- **Verify in the live rendered DOM**, driving the actual interaction (open the drawer, focus the search field to spawn the results portal, add a product). Editor markup and CLI renders won't show portals.
- **Test the conflict cases**: a block that *also* has a visibility rule (does your class survive?), and the plugin's `!important` rules (does your override actually win, or just tie?).
- **Re-check after plugin updates** — class names and markup are the plugin's, not yours, and can change.

## Failure modes

- **CSS scoped to the block does nothing** → the UI is a body-level portal; scope to the portal root. → `references/body-portals.md`
- **`is-style-*` class silently absent** → render callback dropped it; re-inject via `render_block` + `WP_HTML_Tag_Processor`. → `references/class-injection.md`
- **Class injection works on most blocks but fails on one** → another `render_block` filter (e.g. a visibility plugin) rewrote the attr and your `str_replace` no longer matches; use `add_class`. → `references/class-injection.md`
- **Your styles load after the plugin's but still lose** → `!important`-heavy plugin CSS; override with matched specificity/`!important` on the right element. A `* { … }` plugin rule hits children, not the parent — put parent "shape" on the parent. → `references/override-and-bleed.md`
- **Nested nav/button looks like your theme's** → style bleed; opt the nested block out and scope your selectors to direct children. → `references/override-and-bleed.md`

## Escalation

- If a plugin UI can only be repositioned by moving a DOM node across a boundary CSS can't cross (e.g. a widget injected *inside* a form), that needs JS — flag it rather than forcing fragile CSS.
- If overriding a plugin requires `!important` sprawl, stop and reconsider whether a targeted enqueue-order/dependency or a single high-specificity scope is cleaner.
- Prefer not to fork/patch the plugin; keep all styling in the theme's own enqueued assets + `render_block` filters so plugin updates don't clobber it.

## Related

- `wp-blockstyle-css-field` — where the theme-side `is-style-*` styling should live, and its specificity limits.
- `wp-mcp-wpcli-ops` — inspecting the live DOM on a slow site; don't mistake lag for a styling bug.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
