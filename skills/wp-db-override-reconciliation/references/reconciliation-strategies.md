# Fix strategies & faithful-vs-portable import

## Choosing how to fix something on a DB-driven page

| Strategy | When | How | Cost |
|---|---|---|---|
| **CSS** | Visual/layout issue; you don't need to change block markup | Class-based rule in the theme stylesheet — applies whether markup comes from DB **or** file | Lowest; survives resets and re-imports |
| **Edit the DB copy** | Block-markup attributes must change and you can't reset the override yet | `wp eval` + `str_replace` on `post_content`; back up first | Medium; the edit lives only in the DB, must be re-done or imported later |
| **Reset the override** | The theme file should own this page going forward | Delete the `wp_template` post (back up `post_content` — it can be tens of KB) so the theme file takes over | Highest; changes source of truth — confirm with the user |

**Default to CSS** for visual fixes: it's robust to whether the page is DB- or file-driven, and it doesn't commit you to a source-of-truth decision.

> Example (labelled): a transparent-header cart badge and My Account icon on a DB-driven homepage were fixed purely with class-based CSS (`.wc-block-mini-cart__badge`, `.wp-block-woocommerce-customer-account .icon`) — no need to touch DB post 254 at all.

## Importing DB customizations back into theme files: faithful vs portable

When you pull an editor-customized template into a theme file, decide the mode **up front** and keep the two modes on **separate branches** — they have opposite rules:

**Faithful** — reproduce the DB copy byte-for-byte, keeping environment-specific values:

- Real image URLs/IDs, real nav `"ref"` IDs, real `theme` attributes, real form IDs.
- Use when the goal is "the theme file exactly reproduces what's live right now."
- Consequence: the theme is **not portable** — those refs only resolve in the environment they came from, so deploy needs a re-wiring step.

**Portable** — strip the environment out so the theme works anywhere:

- Placeholder images, nav `ref`s removed, `theme` attributes omitted, reusable-block refs inlined.
- Use when the file must work across environments (the normal theme-shipping case).

**Never mix them in one pass.** A portable import that leaks a `localhost` image URL, or a faithful import overwritten with placeholders, corrupts the result. If different templates need different modes, split them across branches.

> Example (labelled): on one project, `front-page` was imported **faithfully** (kept real hero image + nav refs) while the Woo templates (`single-product`, product archive) were synced **portably** (placeholders, nav refs stripped, reusable blocks inlined) — deliberately kept on separate branches for exactly this reason.

## After importing

- `php -l` every touched PHP pattern file; confirm byte-exactness against the source if faithful.
- Record the DB overrides you imported *from* in the deploy-cleanup register (`deploy-cleanup.md`) — they must be deleted on deploy or they'll keep shadowing the new theme files.
