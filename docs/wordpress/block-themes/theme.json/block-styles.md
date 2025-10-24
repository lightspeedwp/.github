# Block Styles

Explains section styles and block style variations for WordPress container blocks, including best practices, limitations, and key updates in WordPress 6.6+.

---

## Best practices

- Use section styles via **block style variations** in `theme.json` (e.g. `/styles/block/section-*.json`) for grouped container looks.
- Ideal for reusable “mini-themes” applied to `core/group`, `core/columns`, etc.

---

## When to use

---

## Limitations

- Requires WordPress 6.6+ and correct `theme.json` structure.
- Inner block styling is limited; reuse through `blocks.*` or `elements.*` only.

---

## Gutenberg PR #57908 — _“Block Styles: Extend block style variations as mechanism for achieving section styling”_ (Merged 29 May 2024)

**What it is:** The foundational PR that lands “section styles” by extending block style variations so they can style **containers and their inner elements/blocks**, and crucially **nest** reliably.
**Key points**

- New `blockTypes` in JSON partials flags a variation as a **block style variation** (section style).
- Variations can be defined **in `/styles`** partials, or via **`styles.blocks.variations`** in `theme.json`, or **programmatically** with `gutenberg_register_block_style`.
- Introduces **per-instance class** + **per-application partial stylesheets** so **parent > child > grandchild** cascade orders correctly (solves nesting).
- **Specificity lowered** as far as possible to make JSON win without heavy CSS.
- Lists **testing instructions** and examples for partial files and programmatic registration. [GitHub](https://github.com/WordPress/gutenberg/pull/57908)

**Why it matters for us**

- Confirms the **/styles** directory approach for our library, the **nesting guarantee**, and the **order of application** we rely on when composing sections.

---

## Block Editor Handbook — _Block Styles (reference guide)_

**What it is:** The API reference for block style variations (the underlying mechanism).
**Key points**

- Explains **registering block styles**, how they appear in the UI, and the distinction between **block styles vs block variations** vs **style variations**.
- Useful for cross-checking **naming, availability, and registration** behaviour that section styles build on. ([WordPress Developer Resources][4])

**Why it matters**

- Ground truth for **registration semantics** and how the UI picks up styles. Good for Copilot answers around **“why doesn’t my style show?”**

---

## Reference links

- [Rich Tabor: WordPress 6.6 Section Styles](https://rich.blog/wordpress-6-6/)
