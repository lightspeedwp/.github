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

## From a component manifest

A rebuild that ran `site-to-figma-components` hands over `manifest.json`. Use it instead of choosing nodes, names and targets by hand:

1. Run Variables mode first if the Figma variables changed during the build. The design context names presets such as a new font family, and they must exist in `theme.json` before a pattern uses them.
2. Work through `entries` in order: components, template parts, patterns, then templates, so styles exist before the patterns that use them. Skip `skipped` entries, and read `warnings` into the plan.
3. For each entry, read `figma.nodeId` (and `figma.mobileNodeId` for the 390px layout) through `figma-design-to-code`, then follow steps 2 to 9 above. If the Figma server asks whether to set up Code Connect, put the question to the user once for the whole manifest; don't stop at each entry.
4. Use the targets as given: `wordpress.file` as the path, `wordpress.slug` as the pattern or part slug, `wordpress.block` as the main block, and `wordpress.styles` as the block styles to create. The plan can question a target, but don't rename silently.
5. When `wordpress.existsInTheme` is set, the file already holds something else (often a scaffold pattern with the same slug). The plan says whether to replace it or rename the new one. Never leave the old file in place and reference it from a template.
6. Write templates last, from `composition`:
   - `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->` for the header part
   - `<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->` for the footer part; use each part's matching landmark tag
   - `<!-- wp:pattern {"slug":"<theme>/<slug>"} /-->` for patterns without `overrides`
   - the pattern's blocks inline, with every override value applied to its matching text, for an instance with `overrides` (a pattern reference can't change its content, so four card grids would otherwise share one heading)
   - inline blocks for `local` entries
   - everything between the header and footer parts wrapped in `<!-- wp:group {"tagName":"main"} -->`, so the template has a main landmark

## Checklist

- Paths, colour model and motion layer come from the real repository.
- The pattern slug matches its file name, and the markup is valid.
- No raw hex, pixel radius or font name in authored files.
- Off-scale choices are documented.
- Hover, focus-visible and active states have keyboard parity, and reduced motion is respected.
- The pattern and styles are registered, and the pattern renders without errors.
