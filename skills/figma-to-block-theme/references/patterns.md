# Pattern mode

Turns a Figma frame into a block pattern for the current theme. `wp-patterns` covers pattern files, registration, markup and design quality; this file covers getting there from Figma. Build the [theme profile](theme-profile.md) first.

The mode is approval-gated: analyse, propose, wait for approval, then implement.

## 1. Read the design

Load `figma-design-to-code` and read the node with its screenshot. Capture every styled value:

- colours: background, text, border, icon, overlay and focus
- spacing: padding, margin, gap
- typography: family, size, weight, line height, letter spacing, case
- border width, style and radius; shadows
- layout: alignment, content width, columns, media ratios
- states: base, hover, focus-visible and active, recorded as differences from base
- motion

The screenshot is the visual target. Never use it as an asset in the theme.

## 2. Map values to tokens

Map every value to the closest token that already exists in the theme:

- **Colour.** Semantic theme: reuse a semantic token by role. If none fits, propose a new token path for both `theme.json` and `styles/dark.json`. Preset-direct theme: reference the matching preset slug. Never hand-write hex.
- **Spacing, type, radius, shadow and layout.** Use preset slugs. When a value is off the scale, choose the nearest preset and say so in the plan, for example: "Figma 14px → `font-size|200` (16px), chosen for legibility."
- **Fonts.** Reference `heading` and `body` slugs, never font names. If the design uses a font the theme hasn't licensed, map to the nearest slug and note that changing the preset updates it everywhere.
- Never invent preset slugs, and never carry a design system's own token names into theme files.

## 3. Choose blocks

Pick the most semantic core or WooCommerce block for each element, with a confidence level: high (exact), medium (close) or low (generic fallback). For example: branding uses `core/site-logo` or `core/site-title`; navigation uses `core/navigation`; calls to action use `core/buttons`; post and product grids use `core/query` or `woocommerce/product-collection` with `core/post-template`; generic sections use `core/group`, `core/columns` and `core/cover`.

## 4. Reuse before creating

Search for patterns, block styles (`styles/blocks/**`), section styles (`styles/sections/**`), motion rules and tokens that already do the job. Reuse beats create.

## 5. Motion

- **CSS** for state-driven motion: hover, focus-visible and active transitions, underline draws, fades and simple keyframes. Put it in the theme's motion stylesheet. When a card is one interactive surface, the whole card owns hover and focus-visible.
- **GSAP** only when the interaction needs JavaScript state (pointer tracking, coordinated timelines) **and** the theme already has a GSAP layer.
- Always honour `prefers-reduced-motion`, and keep timings close to the theme's existing range.

## 6. Styles to create

Create the narrowest reusable piece:

- block style: `styles/blocks/<block-family>/<slug>.json` (`blockTypes`, `slug`, `title`, `styles`)
- section style: `styles/sections/<subfolder>/<slug>.json`
- advanced selectors and motion: the theme's stylesheet

Keep JSON `css` strings short (a few child selectors). Move larger rules to the stylesheet and leave a pointer. Prefer native block options to a new style.

## 7. Icons

Match icons to the closest [Phosphor](https://phosphoricons.com/) glyph by shape and meaning. Model an icon tile as a `core/group` that contains the theme's icon block. Use a bespoke SVG in `assets/icons/` only with approval. Report each match and its confidence.

## 8. The plan

Show this, then ask `Approve this plan and proceed with implementation?`:

1. Pattern file, slug, title and target path (matching the theme's layout)
2. Theme profile summary
3. What is reused: patterns, styles, motion and tokens
4. What is created: styles (path, slug, title, intent)
5. Motion per interactive element (CSS or GSAP, and where)
6. Colour tokens reused or added
7. Other token mappings, with off-scale choices called out
8. Block map with confidence levels
9. WooCommerce decisions, if any ([woocommerce.md](woocommerce.md))
10. Icon matches
11. Assumptions and open questions

## 9. Implement after approval

1. Add new colour token paths first (`theme.json`, plus `styles/dark.json` for semantic themes).
2. Create or update the block and section style JSON.
3. Add motion and advanced selectors to the stylesheet.
4. Create the pattern with full header metadata (`wp-patterns` lists the fields), escaped output and the theme's text domain.
5. Run the enforcement pass the profile names.
6. Seed any local test data with WP-CLI, labelled as local data rather than theme code.
7. Verify by rendering, as in [studio-operations.md](studio-operations.md). Update `CHANGELOG.md`.

## Checklist

- Paths, colour model and motion layer come from the real repository.
- The pattern slug matches its file name, and the markup is valid.
- No raw hex, pixel radius or font name in authored files.
- Off-scale choices are documented.
- Hover, focus-visible and active states have keyboard parity, and reduced motion is respected.
- The pattern and styles are registered, and the pattern renders without errors.
