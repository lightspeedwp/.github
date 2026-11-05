# Theme profile

Build this before any mode, every time. Probe the repository; never assume a layout from another theme. Record the answers in the plan you show the user.

## Read first

- Any `AGENTS.md`, `CLAUDE.md` or `DESIGN.md` at the repository and theme roots, and `.github/instructions/*.instructions.md` if present.
- `style.css` (header and text domain) and `theme.json`.
- Two to four existing patterns in the area you are working on.

## Record

1. **Theme root and metadata.** Text domain (use it for every translatable string), `theme.json` `version` and `$schema`.
2. **Colour model.** Look at what the authored patterns and templates reference:
   - **Preset-direct.** UI references presets by slug: `var:preset|color|brand-500` or `var(--wp--preset--color--brand-500)`. Often no `styles/dark.json`.
   - **Semantic with dark parity.** UI references semantic tokens such as `var(--wp--custom--color--text--default)`, defined in `theme.json` and mirrored in `styles/dark.json`.
   - If both appear, follow what the authored patterns use, and confirm with the user if it is unclear.
3. **Where tokens live.**
   - `theme.json` only, or
   - preset slices such as `styles/presets/**/*.json` merged at runtime by PHP (for example `inc/presets.php`). If slices exist, map which file owns which concern (typography, spacing, shadows, blocks) and write to the owner. Never flatten slices back into `theme.json`.
4. **Style variations.** List `styles/*.json` (theme variations), `styles/blocks/**` and `styles/sections/**`, with the subfolder convention in use.
5. **Patterns.** List `patterns/`: flat or in subfolders, and how categories are registered.
6. **Motion.** Where CSS motion lives (`assets/css/*.css` or block JSON `css` fields), and whether a GSAP layer exists. Never add GSAP to a theme that has none without approval.
7. **WooCommerce.** Whether `inc/woocommerce.php` and a dedicated store stylesheet exist.
8. **Enforcement and validation.** Semantic themes use `theme-color-token-enforcer`; preset-direct themes use `theme-orphaned-refs`. Note the theme's own scripts too (for example `npm run schema:validate`, `npm run lint`).
9. **Palette naming.** Whether the theme already follows the LightSpeed convention (`base`, `contrast`, then `neutral`, `primary`, `brand` and `cta` from 100 to 900) or has its own coherent scheme to keep.

## Use the profile

- Write tokens to the files that own them.
- Reference colours the way the authored UI does.
- Match the existing pattern and style layouts.
- Run the enforcement pass that fits the colour model.
