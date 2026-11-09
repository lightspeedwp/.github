# Target structure

The proposal and the Figma script follow the TSP design system file (The Safari Partners, November 2026), which is the LightSpeed reference for rebuilds. Every variable has WEB code syntax, so `figma-to-block-theme` can map it to `theme.json`.

## Collections

| Collection          | Modes    | Holds                                                                                                                                                                              | Code syntax                                                                                                                                                                  |
| ------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Theme - Colour      | Value    | Primitives: `Theme/base`, `Theme/contrast`, `brand/100` … `900`, `primary/…`, `cta/…`, `neutral/…`, `system/<kind>/<foreground or background>`, `custom/overlay`, `shadow/<alpha>` | `--wp--preset--color--<slug>`; overlay and shadows `--wp--custom--color--…`                                                                                                  |
| Theme - Semantic    | Value    | Aliases of the primitives, by role                                                                                                                                                 | `--wp--custom--color--<role>--<name>`                                                                                                                                        |
| Theme - Typography  | Max, Min | `Sizes/<Name>`, `Font-Families/Primary` (headings) and `Secondary` (body), `Line-Heights/<Name>`, `Weights/<role>`                                                                 | `--wp--preset--font-size--<slug>` (`100` … `900`), `--wp--preset--font-family--heading` and `body`, `--wp--custom--line-height--<slug>`, `--wp--custom--font-weight--<role>` |
| Theme - Spacing     | Max, Min | `Padding/None`, `Padding/XXS`, `Padding/XS` … `Padding/Colossal`                                                                                                                   | `--wp--preset--spacing--<slug>` (`5` … `100`)                                                                                                                                |
| Theme - Radius      | Mode 1   | `None`, `Small`, `Base` … `Round` (bare sizes, never `Radius Small`)                                                                                                               | `--wp--preset--border-radius--<slug>`                                                                                                                                        |
| Theme - Layout      | Mode 1   | `Desktop/Desktop Content Width`, `Desktop/Desktop Wide Width`                                                                                                                      | `--wp--custom--layout--content-size` and `wide-size`                                                                                                                         |
| Theme - Breakpoints | Mode 1   | `Desktop`, `Tablet`, `Mobile`                                                                                                                                                      | `--wp--custom--breakpoint--<name>`                                                                                                                                           |

Shadows are effect styles named `LSX/<Name>`. Each one's description holds its slug, for example `theme.json shadow preset "200": var(--wp--preset--shadow--200).`

`Max` is the 1440px desktop value and `Min` the 390px mobile value. `figma-to-block-theme` turns the pairs into fluid font sizes and spacing `clamp()` values.

Line-height variables store a percentage of the font size (150 means 1.5). They have no scopes in Figma, because Figma treats bound line heights as pixels.

## Slugs and names

Type sizes, radius and shadows use numeric slugs, the same as the block theme scaffold and `tsp-theme`. The size names (Small, Base, Large and so on) are display names only. The slug lives in the code syntax and the effect style description, never in the variable name, and the export carries the slug straight through to `theme.json` with no renaming.

- Type, slugs `100` to `900`: `Tiny` (100), `Base` (200), `Small`, `Medium`, `Large`, `X-Large`, `Huge`, `Gigantic`, `Colossal` (900). Body text is always `Base` at `200`. When the site has no size below body text, `100` stays empty.
- Spacing is the exception. The variable name carries only the size and the code syntax carries the slug, so `Padding/XS` has `var(--wp--preset--spacing--10)`. Never put the slug in the name (`Padding/10 XS`). The ladder is:

  | Name | XXS | XS   | S    | M    | L    | XL   | XXL  | XXXL | XXXXL | Gigantic | Colossal |
  | ---- | --- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ----- | -------- | -------- |
  | Slug | `5` | `10` | `20` | `30` | `40` | `50` | `60` | `70` | `80`  | `90`     | `100`    |

  Sizing ramps are in order. Spacing and type sizes are created in Figma smallest first, with `None` first for spacing, so the Variables panel reads as a ramp. The export JSON and the Figma script both sort by Max value, then slug, whatever order the proposal has.

  Each measured value takes the step nearest its desktop size, so 40px becomes `L`. When that step is taken, the value moves up to the next free step. If that runs off the top of the ladder, values shift down into free lower steps, starting at `5`, so nothing is dropped. A value is only left out when more than 11 distinct values are in use, and then the least used go. `Padding/None` (0) is for Figma only. It has no code syntax, because WordPress already offers a 0 spacing and importing one adds a duplicate in the editor.

- Radius, slugs `0` to `700`: `None` (0), `Small` (100), `Base`, `Medium`, `Large`, `X-Large`, `Huge` (600), `Round` (700, 9999px). Measured values fill 100 upward in order.
- Shadows, slugs `100` to `600`: `X-Small`, `Small`, `Medium`, `Large`, `X-Large`, `Huge`, ordered by strength (blur radius), so `100` is the softest.

## Colour families

| Family    | What it is on the live site                                 |
| --------- | ----------------------------------------------------------- |
| `cta`     | The most saturated colour that fills a button               |
| `brand`   | The colour that dresses buttons and in-text links           |
| `primary` | The next most used colour                                   |
| `neutral` | The site's mid grey, or a grey tinted like the site's greys |

Each ramp keeps its live anchor exactly at the step nearest its lightness, and builds the other steps in OKLCH. The reviewer can reassign families with `--assign`.

### Site colours fit into the ramps

Real site colours are preferred over generated ones. A site colour replaces the generated value of the ramp step it is closest to when it fits that ramp:

- **Hue and chroma.** For `brand`, `primary` and `cta`, the hue is within 25 degrees of the anchor's, the chroma is at least 0.025, and the chroma is between 0.4 and 1.6 times the anchor's. For `neutral`, the chroma is 0.04 or less, whatever the tint. The whole neutral ramp should match the site's own greys as closely as possible, so a slate grey takes its step even in a warm ramp.
- **Lightness.** It is within 0.04 OKLCH lightness of the target of its nearest step.
- **Order.** It is lighter than the next step and darker than the previous one, so lightness still falls from 100 to 900.

The anchor step is never replaced. Colours are handled by weight, heaviest first. Each goes to the family whose step is closest. If a heavier colour already holds a step, the lighter one does not take it. A colour that fits no ramp stays off the ramp and is matched to the nearest token, as before.

Each replacement is listed in the report's decisions, for example `Site colour #4a4641 replaced neutral-700 (was #48443f).`

System colours (error, warning, success and information, each with a foreground and a background) use the LightSpeed defaults unless the reviewer changes them.

## Semantic roles and defaults

| Role group                                     | Roles (default primitive)                                                                                                                                                                                                 |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `text/*`                                       | `default` (contrast), `muted` (neutral-600), `inverse` (base), `inverse-subtle` (neutral-100), `brand` (brand-600), `link` (brand-600), `link-hover` (primary-500), `disabled` (neutral-500), `placeholder` (neutral-600) |
| `surface/*`                                    | `default` (base), `subtle` (neutral-100), `brand` (brand-100), `inverse` (contrast), `overlay` (custom/overlay), `control-checked` (brand-600), `control-off` (neutral-500), `control-disabled` (neutral-200)             |
| `border/*`                                     | `default` (neutral-500), `subtle` (neutral-400), `strong` (neutral-700), `divider` (neutral-200), `focus` (brand-600), `focus-inverse` (brand-500)                                                                        |
| `action/<primary, secondary or cta>/*`         | `background` (primary-500, brand-600, cta-500), `background-hover` (one step darker), `text` (base)                                                                                                                       |
| `feedback/<error, warning, success or info>/*` | `text` and `border` (system foreground), `background` (system background)                                                                                                                                                 |

The proposer replaces a default with the live value's nearest primitive for `text/default`, `text/link`, `action/primary/*`, `border/default`, `surface/subtle` and `surface/inverse` when the site shows them. A text colour that can't reach 3:1 on `base` (usually text on photos) keeps its default, and the report says so.

## Scopes

Primitives have no scopes, so designers bind the semantic tokens. Text roles use `TEXT_FILL`, border roles `STROKE_COLOR`, and surfaces and action backgrounds `FRAME_FILL` and `SHAPE_FILL`. Sizes, families, weights, spacing, radius and layout widths use their matching scopes, and shadow colours `EFFECT_COLOR`.
