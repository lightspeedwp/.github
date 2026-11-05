# Target structure

The proposal and the Figma script follow the TSP design system file (The Safari Partners, November 2026), which is the LightSpeed reference for rebuilds. Every variable has WEB code syntax, so `figma-to-block-theme` can map it to `theme.json`.

## Collections

| Collection | Modes | Holds | Code syntax |
| --- | --- | --- | --- |
| Theme - Colour | Value | Primitives: `Theme/base`, `Theme/contrast`, `brand/100` … `900`, `primary/…`, `cta/…`, `neutral/…`, `system/<kind>/<foreground or background>`, `custom/overlay`, `shadow/<alpha>` | `--wp--preset--color--<slug>`; overlay and shadows `--wp--custom--color--…` |
| Theme - Semantic | Value | Aliases of the primitives, by role | `--wp--custom--color--<role>--<name>` |
| Theme - Typography | Max, Min | `Sizes/<Name>`, `Font-Families/Primary` (headings) and `Secondary` (body), `Line-Heights/<Name>`, `Weights/<role>` | `--wp--preset--font-size--<slug>`, `--wp--preset--font-family--heading` and `body`, `--wp--custom--line-height--<slug>`, `--wp--custom--font-weight--<role>` |
| Theme - Spacing | Max, Min | `Padding/None`, `Padding/XXS`, `Padding/XS` … `Padding/Colossal` | `--wp--preset--spacing--<slug>` (`5` … `100`) |
| Theme - Radius | Mode 1 | `Radius None`, `Small`, `Base` … `Round` | `--wp--preset--border-radius--<slug>` |
| Theme - Layout | Mode 1 | `Desktop/Desktop Content Width`, `Desktop/Desktop Wide Width` | `--wp--custom--layout--content-size` and `wide-size` |
| Theme - Breakpoints | Mode 1 | `Desktop`, `Tablet`, `Mobile` | `--wp--custom--breakpoint--<name>` |

Shadows are effect styles named `LSX/<Name>`. Each one's description holds its slug, for example `theme.json shadow preset "small": var(--wp--preset--shadow--small).`

`Max` is the 1440px desktop value and `Min` the 390px mobile value. `figma-to-block-theme` turns the pairs into fluid font sizes and spacing `clamp()` values.

Line-height variables store a percentage of the font size (150 means 1.5). They have no scopes in Figma, because Figma treats bound line heights as pixels.

## Slugs and names

Type sizes, radius and shadows use the TSP size names, and slugs in lower kebab case: `xSmall` becomes `x-small`.

- Type: `Tiny`, `xSmall`, `Small`, `Medium`, `Large`, `xLarge`, `Huge`, `Gigantic`. The body text size is `xSmall`.
- Spacing is the exception. The variable name carries only the size and the code syntax carries the slug, so `Padding/XS` has `var(--wp--preset--spacing--10)`. Never put the slug in the name (`Padding/10 XS`). The ladder is:

  | Name | XXS | XS | S | M | L | XL | XXL | XXXL | XXXXL | Gigantic | Colossal |
  | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
  | Slug | `5` | `10` | `20` | `30` | `40` | `50` | `60` | `70` | `80` | `90` | `100` |

  Sizing ramps are in order. Spacing and type sizes are created in Figma smallest first, with `None` first for spacing, so the Variables panel reads as a ramp. The export JSON and the Figma script both sort by Max value, then slug, whatever order the proposal has.

  Each measured value takes the step nearest its desktop size, so 40px becomes `L`. When that step is taken, the value moves up to the next free step. `None` (0) keeps the slug `none`.
- Radius: `None`, `Small`, `Base`, `Medium`, `Large`, `xLarge`, `Round`.
- Shadows: `xSmall`, `Small`, `Medium`, `Large`, `xLarge`, `Huge`.

## Colour families

| Family | What it is on the live site |
| --- | --- |
| `cta` | The most saturated colour that fills a button |
| `brand` | The colour that dresses buttons and in-text links |
| `primary` | The next most used colour |
| `neutral` | The site's mid grey, or a grey tinted like the site's greys |

Each ramp keeps its live anchor exactly at the step nearest its lightness, and builds the other steps in OKLCH. The reviewer can reassign families with `--assign`.

### Site colours fit into the ramps

Real site colours are preferred over generated ones. A site colour replaces the generated value of the ramp step it is closest to when it fits that ramp:

- **Hue and chroma.** For `brand`, `primary` and `cta`, the hue is within 25 degrees of the anchor's, the chroma is at least 0.025, and the chroma is between 0.4 and 1.6 times the anchor's. For `neutral`, the chroma is 0.04 or less.
- **Lightness.** It is within 0.04 OKLCH lightness of the target of its nearest step.
- **Order.** It is lighter than the next step and darker than the previous one, so lightness still falls from 100 to 900.

The anchor step is never replaced. Colours are handled by weight, heaviest first. Each goes to the family whose step is closest. If a heavier colour already holds a step, the lighter one does not take it. A colour that fits no ramp stays off the ramp and is matched to the nearest token, as before.

Each replacement is listed in the report's decisions, for example `Site colour #374750 replaced neutral-700 (was #3c4448).`

System colours (error, warning, success and information, each with a foreground and a background) use the LightSpeed defaults unless the reviewer changes them.

## Semantic roles and defaults

| Role group | Roles (default primitive) |
| --- | --- |
| `text/*` | `default` (contrast), `muted` (neutral-600), `inverse` (base), `inverse-subtle` (neutral-100), `brand` (brand-600), `link` (brand-600), `link-hover` (primary-500), `disabled` (neutral-500), `placeholder` (neutral-600) |
| `surface/*` | `default` (base), `subtle` (neutral-100), `brand` (brand-100), `inverse` (contrast), `overlay` (custom/overlay), `control-checked` (brand-600), `control-off` (neutral-500), `control-disabled` (neutral-200) |
| `border/*` | `default` (neutral-500), `subtle` (neutral-400), `strong` (neutral-700), `divider` (neutral-200), `focus` (brand-600), `focus-inverse` (brand-500) |
| `action/<primary, secondary or cta>/*` | `background` (primary-500, brand-600, cta-500), `background-hover` (one step darker), `text` (base) |
| `feedback/<error, warning, success or info>/*` | `text` and `border` (system foreground), `background` (system background) |

The proposer replaces a default with the live value's nearest primitive for `text/default`, `text/link`, `action/primary/*`, `border/default`, `surface/subtle` and `surface/inverse` when the site shows them. A text colour that can't reach 3:1 on `base` (usually text on photos) keeps its default, and the report says so.

## Scopes

Primitives have no scopes, so designers bind the semantic tokens. Text roles use `TEXT_FILL`, border roles `STROKE_COLOR`, and surfaces and action backgrounds `FRAME_FILL` and `SHAPE_FILL`. Sizes, families, weights, spacing, radius and layout widths use their matching scopes, and shadow colours `EFFECT_COLOR`.

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/.github/graphs/contributors)
