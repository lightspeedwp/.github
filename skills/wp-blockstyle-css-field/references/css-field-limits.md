# The css field: what it can and can't do

A block style variation's `styles.css` field is **not** raw CSS. WP sanitises it and compiles each selector wrapped in `:root :where(...)`. The following were verified empirically (re-test after core upgrades — this is version-sensitive behaviour).

## The limits

- **Zero specificity.** Every compiled selector becomes `:root :where(.is-style-X--N …)` → specificity **`(0,1,0)`**. It ties with or loses to core, theme.json, and plugin rules. **To win, put `!important` on each declaration** that something else also sets.
- **`:hover` and `:first-child` are stripped entirely.** They don't compile — the rule is dropped. (`:focus-within`, `:not(.class)`, `::after`, `::before`, and `@media` **survive**.)
- **`content:""` mangles the whole rule.** It breaks selector expansion, so the entire rule is dropped — not just the `content` line.
- **Comma-separated `&` selectors lose all but one.** Only the *last* selector in a comma list survives compilation. Write each selector as its own rule.

## The safe subset

Use the `css` field only for:

> **A single selector, no `:hover`/`:first-child`, no `content:""`, with `!important` on anything core/theme.json/plugin also sets.**

Everything outside that subset belongs in an enqueued `.css` file scoped to the `is-style-*` class (see `specificity-and-core-resets.md`).

## Blocks you cannot style via JSON at all

Blocks whose `block.json` declares `__experimentalSelector` **and** `__experimentalSkipSerialization` (e.g. `woocommerce/product-button`) **cannot** be driven by a block-style JSON. Adding them to a variation's `blockTypes` makes WP:

- compile `&` against the inner experimental selector, so a descendant like `& .wp-block-button__link` **mis-targets**;
- emit at `:where()` **zero specificity**; and
- serialize a **stray inline** style (e.g. a border) onto the block.

And `var:preset|color|x !important` in the css field compiles to invalid `var(--…--x !important)` (→ the value is dropped, e.g. a grey plate instead of the token colour).

**Do:** style these blocks in **enqueued CSS scoped to the `is-style-*` class**, where natural specificity wins without `!important`. Keep JSON styles for serializable blocks (`core/button`, `add-to-cart-with-options`, etc.).

> Example (labelled): `styles/blocks/button/add-to-cart.json` holds the serializable card treatment; the `:hover` flip and `::after` icon remainder live in `assets/styles/woocommerce.css`, each commented with the limit that forced it.
