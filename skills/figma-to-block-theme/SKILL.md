---
name: figma-to-block-theme
description: Build WordPress block theme files from a Figma design. Use when extracting Figma variables into theme.json presets (palette, semantic custom colours, spacing, typography and fonts, radius, shadows) and style variations, when turning a Figma frame into a block pattern with its block and section styles, or when auditing a theme to fill missing theme.json block configuration. Works with the official Figma skills for all Figma access and the WordPress block theme and pattern skills for theme mechanics.
---

# Figma to Block Theme

## Overview

This skill turns a Figma design into WordPress block theme files. It has three modes:

| Mode | Use when | Writes |
| --- | --- | --- |
| **Tokens** | Syncing Figma variables into the theme | `theme.json` presets, `styles/*.json` variations, font files |
| **Pattern** | Importing a Figma frame as a block pattern | `patterns/`, `styles/blocks/`, `styles/sections/`, motion CSS |
| **Complete** | Filling gaps in `theme.json` for the blocks a theme uses (no Figma needed) | `theme.json` or the theme's preset slices |

Every mode starts with the theme profile (step 0) and stops for approval before it writes anything.

## Companion skills

This skill holds only the Figma-to-WordPress mapping and LightSpeed conventions. Load these for everything else:

- `figma-use`: **required before every `use_figma` call**, including the variables export.
- `figma-design-to-code`: **required before every `get_design_context` call** (pattern mode).
- `wp-block-themes`: `theme.json` structure, style hierarchy, style variations and caches.
- `wp-patterns`: pattern registration, block markup and design quality.
- `wpds`: only when building admin or editor UI.
- `theme-orphaned-refs`: run after tokens change, to fix preset references.
- `theme-color-token-enforcer`: run in themes that use semantic colour tokens with dark parity.

If a companion skill is not installed, say so and stop rather than calling Figma tools directly.

## Step 0: Build the theme profile

Never assume paths. Read [references/theme-profile.md](references/theme-profile.md) and record:

- the theme root, text domain, `theme.json` version and `$schema`
- the colour model: preset-direct or semantic with dark parity
- where tokens live: `theme.json` alone, or preset slices merged at runtime
- style variation, pattern and motion file layouts
- WooCommerce and enforcement tooling in use

Every later step reads from this profile.

## Mode: Tokens

Read [references/figma-access.md](references/figma-access.md) first. Prefer the **variables export**: it reads the real variable collections, modes and aliases through `use_figma`. Read a documentation table frame only when the file has no local variables.

1. **Export.** Run the export script from `figma-access.md` through `use_figma` and save the returned JSON to a scratch file outside the theme.
2. **Map.** Run the mapper and read its warnings:

   ```bash
   npx tsx ${CLAUDE_SKILL_DIR}/scripts/figma-variables-to-theme-json.ts export.json --out mapped.json
   ```

3. **Review each family in order**, checking with the user after each one:

   | Order | Family | Reference |
   | --- | --- | --- |
   | 1 | Palette | [tokens-color.md](references/tokens-color.md) |
   | 2 | Semantic custom colours | [tokens-color.md](references/tokens-color.md) |
   | 3 | Spacing | [tokens-spacing.md](references/tokens-spacing.md) |
   | 4 | Typography and fonts | [tokens-typography.md](references/tokens-typography.md) |
   | 5 | Radius and shadows | [tokens-radius-shadow.md](references/tokens-radius-shadow.md) |
   | 6 | Style variations | [style-variations.md](references/style-variations.md) |

4. **Propose** the exact changes per file (JSON path, old value, new value) and ask: `Approve this plan and proceed with implementation?`
5. **Merge** the approved fragments into the files the profile names. Replace only the preset arrays being synced, and keep every other setting.
6. **Fix references.** Run `theme-orphaned-refs`, plus `theme-color-token-enforcer` for semantic themes.
7. **Verify** (see below).

Keep a checklist so an interrupted session can resume:

```text
[ ] 0. Theme profile   [ ] 1. Palette   [ ] 2. Custom colours   [ ] 3. Spacing
[ ] 4. Typography      [ ] 5. Radius and shadows   [ ] 6. Variations   [ ] 7. References
```

The user may skip a family or re-run one with a different Figma node.

## Mode: Pattern

Read [references/patterns.md](references/patterns.md), plus [references/woocommerce.md](references/woocommerce.md) for store designs. In short:

1. Read the Figma node through `figma-design-to-code` (context plus screenshot).
2. Map every value to the closest existing token, and call out off-scale choices.
3. Choose semantic blocks, reuse existing patterns and styles, and route motion to CSS or GSAP.
4. Propose, wait for approval, then implement and verify by rendering.

## Mode: Complete

Read [references/theme-json-completion.md](references/theme-json-completion.md). Inventory the blocks the theme uses, read each block's `block.json` supports, and propose additive `theme.json` configuration backed by evidence. Never overwrite existing configuration.

## Shared rules

- **Sizing ramps are in order.** Spacing and type sizes run smallest first in Figma, and so in `theme.json`. The mapper warns when a ramp is out of order; ask the designer to reorder it.
- **Never invent slugs.** Slugs come from each variable's WEB code syntax. If one is missing, report it and ask for it to be added in Figma.
- **Follow the LightSpeed palette convention** for new themes: `base` and `contrast`, then `neutral`, `primary`, `brand` and `cta` ramps from `100` (lightest) to `900`, plus the status colours. Add `accent` only when the design needs it. A colour mode such as `styles/dark.json` keeps the same palette and replaces only the semantic tokens (see [style-variations.md](references/style-variations.md)). An existing theme keeps its own coherent naming.
- **Keep the theme's schema.** Use the `$schema` and `version` the theme already declares. Raise them only when asked.
- **No raw values in authored UI.** Patterns and styles reference presets or semantic tokens, never hex, pixel radii or font names.
- **Approval first.** Show the plan and wait before writing any theme file.
- **Report gaps** (missing code syntax, library aliases, type mismatches) instead of filling them.
- **Contrast.** Check the WCAG 2.2 ratios of new colour pairs: 4.5:1 for text and 3:1 for focus outlines and UI parts.

## Scripts

Agent tooling in TypeScript, run with `tsx` (`npx tsx <script> --help`). Tests live in `scripts/__tests__/`: run `npm run test:figma-to-block-theme` from the repository root.

| Script | Does |
| --- | --- |
| `scripts/figma-variables-to-theme-json.ts` | Maps a variables export to preset fragments, variation palettes and a warnings report |
| `scripts/fluid-clamp.ts` | Builds rem `clamp()` values between the 390px and 1440px frames |
| `scripts/google-fonts.ts` | Downloads Google Fonts WOFF2 files and prints the `fontFamilies` entry |

## Verification

- `theme.json` and each `styles/*.json` file validate against their `$schema`.
- Every `var:preset|…` and `var(--wp--preset--…)` reference resolves (`theme-orphaned-refs` reports none).
- Palette, spacing and font size counts match the mapper's report.
- Every `fontFace` `src` file exists.
- The site loads in the editor and front end with no PHP notices. For WordPress Studio specifics, see [references/studio-operations.md](references/studio-operations.md).

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/.github/graphs/contributors)
