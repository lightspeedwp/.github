# Overriding !important CSS & containing style bleed

## Beating `!important`-heavy plugin stylesheets

Some plugins ship stylesheets saturated with `!important` (e.g. `display:flex !important` on the form, `border-radius:0 !important` on every descendant). Loading your sheet *after* theirs is **not enough** — you must match or beat each forced declaration.

Rules:

- **Override only where the plugin forces it.** Add `!important` / matched specificity to the *specific* declarations the plugin `!important`s, not everywhere — keep the blast radius small.
- **Target the element the plugin actually targets.** A `* { border-radius:0 !important }` rule hits **descendants**, not their parent. So to round the *field*, put the radius on the form/field element itself (the wildcard rule reaches its children, not it).
- **Depend your sheet on the plugin handle** (see `class-injection.md`) so your non-`!important` rules at least start from a fair position.

> Example (labelled): a search plugin forced `border-radius:0 !important` on all form descendants **and** the results panel, and `display:flex !important` on the form. The field "shape" (radius/border/bg) had to go on the `.aws-search-form` element itself, with `!important` only on the properties the plugin forced.

## Containing style bleed into nested core blocks

A `core/navigation` (or other core block) nested inside a plugin dropdown (e.g. an Ollie mega-menu) can **inherit your main-nav block style** — links come out centred/uppercase/underlined — because WP renders it with the same `.wp-block-navigation__responsive-container` your styles target.

Two-layer defence:

1. **Opt the nested block out** where possible — e.g. set `overlayMenu:"never"` on a nested nav so it doesn't render the responsive container your styles hook.
2. **Scope your block-style selectors to direct children**, not descendants, so they *cannot* descend into a nested block even if someone forgets step 1:

   ```css
   /* was: .is-style-main-navigation .wp-block-navigation__responsive-container  (descends) */
   .is-style-main-navigation > .wp-block-navigation__responsive-container { … }  /* direct child only */
   ```

> Example (labelled): a nested About-menu nav shipped without `overlayMenu:"never"` and inherited the main-nav style; the fix was both adding `overlayMenu:"never"` and switching the main-nav selectors to a direct-child combinator.

## Watch inherited element classes

A plugin's button rendered as `.wp-element-button` inherits your theme.json button border and `:hover{background:contrast}` unless explicitly neutralised across `:hover`/`:focus`/`:active`. If a plugin button suddenly has your brand button treatment, that's why — neutralise it in the relevant enqueued CSS.
