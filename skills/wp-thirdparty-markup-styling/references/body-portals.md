# Body-level portals

Many plugin UIs — slide-out drawers, autocomplete/results dropdowns, modals — are rendered as **direct children of `<body>`**, positioned absolutely, not nested inside the block that triggers them. So CSS scoped as `.<trigger-block> .<inner>` **never matches** the panel. Scope to the **portal's own root class** instead.

## How to find the portal root

Open the UI in a browser, then in devtools find the panel element and walk up — if its parent chain ends at `<body>` rather than at the block wrapper, it's a portal. Style from its root class down.

## Example: WooCommerce mini-cart drawer

The slide-out drawer's root is `.wc-block-mini-cart__drawer.wc-block-components-drawer` — a **body-level** element, **not** a descendant of `.wc-block-mini-cart` (that class is only the header button/icon wrapper). So `.wc-block-mini-cart .<x>` never reaches drawer internals.

- Scope drawer internals under **`.wc-block-mini-cart__drawer`**.
- Some element classes are globally unique and match on their own: `.wc-block-mini-cart__title`, `.wc-block-mini-cart__footer`, `.wc-block-mini-cart__footer-checkout` / `-cart` / `-subtotal`, `.wc-block-mini-cart__badge`.
- Gotchas: the title `h2` is `display:flex` with a scroll-fade `mask-image` + negative bottom margin — centre with `justify-content:center` (not `text-align`) and reset `mask-image`/margin for a clean divider. The subtotal value updates via the Interactivity API after a debounced `POST /wc/store/v1/batch`, which can take several seconds on a slow site (that's lag, not a bug).

## Example: search-results dropdown

A search plugin's results panel is appended to `<body>` as e.g. `<div id="…-result-N" class="…-search-result">` and positioned under the field. Style the **`.…-search-result`** class globally, not scoped to the search block.

## Inspecting a portal

Drive a headless browser: trigger the UI (add a product and open the cart; focus the search field), wait for the portal element to appear, then screenshot / read its computed styles. The portal doesn't exist until the interaction fires, so a static page fetch won't show it.
