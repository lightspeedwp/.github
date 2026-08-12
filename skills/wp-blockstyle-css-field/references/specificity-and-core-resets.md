# Specificity & beating core block resets

Two different reasons a block-style rule loses the cascade — don't confuse them.

## 1. The css field is zero-specificity (a sanitisation artefact)

Rules in the `css` field compile to `:root :where(...)` = `(0,1,0)`. Fix: `!important`, or move to enqueued CSS. Covered in `css-field-limits.md`.

## 2. Structured `:hover`/colour that parses fine but still loses (a cascade problem)

Even when a variation's structured `:hover`/colour compiles correctly, it can still be out-specified by a core block's own stylesheet. The canonical case is **`core/navigation`**.

Core ships an always-on reset in `wp-includes/blocks/navigation/style(.min).css`:

```css
.wp-block-navigation .wp-block-navigation-item__content.wp-block-navigation-item__content {
  color: inherit;
}
```

The **doubled class** is a deliberate specificity hack → **`(0,3,0)`**, no `:hover`. A block-style variation's `elements.link[:hover]` / `blocks.core/navigation-link[:hover]` colour is emitted wrapped in `:root :where(...)` → only **`(0,1,0)`**. So the variation **can never beat the core reset** — nav link colour stays `inherit`. This is *not* the css-field-strips-hover issue; the `:hover` parses fine, it just loses.

### The rule

Hover/colour for nav links must live in **enqueued CSS at `≥ (0,4,0)`**, not in the block-style JSON:

```css
.wp-block-navigation.is-style-footer-navigation .wp-block-navigation-item__content:hover {
  color: var(--wp--preset--color--brand-500);
}
```

3 classes + `:hover` = `(0,4,0)` > core's `(0,3,0)`. This is a sanctioned CSS-only exception to the JSON-first rule.

## Diagnosing which one you have

- Rule **absent** from compiled CSS → sanitisation (stripped pseudo / `content` / comma) → `css-field-limits.md`.
- Rule **present** but overridden → specificity. Inspect the winning selector in devtools; if a core block stylesheet with a doubled-class or high-specificity selector is winning, move your rule to enqueued CSS at higher specificity.

> Example (labelled): a footer-nav hover only failed on **dev**, because dev rendered the footer from a DB template part with real `core/navigation` blocks (hit by the core reset), while the theme file used plain `<p><a>` links (which the reset never touches). Same styling, different DOM — see `wp-db-override-reconciliation`.
