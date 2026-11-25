# WooCommerce patterns

Lessons learned from building product cards and loops from Figma designs.

## Product buttons

A `core/button` style variation does **not** style `woocommerce/product-button`. They are different blocks, and file-based variations output low-specificity `:where()` selectors that WooCommerce's own button rules override.

To style the add-to-cart button in a product loop:

1. Add the same `is-style-<name>` class to the `woocommerce/product-button` block.
2. Re-apply the look in the theme's store stylesheet with enough specificity, scoped to the card, for example `.wc-block-components-product-button.is-style-<name> .wp-block-button__link`.
3. Keep the `core/button` variation in JSON for general use.

## Product collection cards

- Build cards from `woocommerce/product-image`, `core/post-title` (with `__woocommerceNamespace`), `woocommerce/product-price` and `woocommerce/product-button`.
- Set `isDescendentOfQueryLoop: true` on the WooCommerce blocks.
- Mark loop-only cards `Inserter: false`.

## Product attributes in a card

A global attribute is a taxonomy named `pa_<slug>`, so show it with `core/post-terms` and `"term": "pa_<slug>"` (for example a "750 ml" volume).

`core/post-terms` renders nothing unless the taxonomy is publicly queryable. For an attribute, that means **Enable archives** must be on. Confirm the attribute slug against the live store.

## Stateful controls

Controls with two states, such as add to cart changing into a quantity stepper, depend on the Store API and Interactivity API, and generally can't be reproduced in a collection loop card with block markup alone. Build the first state, and log the second as follow-up work unless the user asks for it.

## Long selectors

Keep verbose WooCommerce selectors in the theme's store stylesheet (for example `assets/css/woocommerce.css`), not in block-style JSON `css` strings.
