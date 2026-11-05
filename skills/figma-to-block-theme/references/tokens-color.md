# Colour tokens

Covers `settings.color.palette` and semantic tokens in `settings.custom.color`.

## Palette

The mapper builds `{ slug, name, color }` entries from every variable whose code syntax is `--wp--preset--color--<slug>`:

- `slug` comes from the code syntax and nothing else.
- `name` is the slug in title case (`neutral-100` becomes "Neutral 100").
- `color` is the hex value from Figma, with an alpha pair only when the colour is not opaque (`#00000080`). Aliases resolve to their final colour in the same mode.

When reviewing:

- Two slugs sharing a hex value is allowed. List the pairs so the user can confirm them.
- Compare the palette count with the mapper's `counts.color` and with the variables in Figma.
- Replace `settings.color.palette` only. Leave `defaultPalette`, gradients, duotones and every other setting as they are.

### LightSpeed palette convention

For new themes, and themes already using it:

| Slug | Role |
| --- | --- |
| `base` | Page background |
| `contrast` | Default text on `base` |
| `neutral-100` … `neutral-900` | Greys, `100` lightest |
| `primary-100` … `primary-900` | Main brand colour |
| `brand-100` … `brand-900` | Secondary brand colour |
| `cta-100` … `cta-900` | Calls to action and focus |
| `accent-100` … `accent-900` | Only when the design needs a further family |
| status colours | `error`, `warning`, `information` and `success`, each with a `-foreground` and a `-background` slug |

`styles/dark.json`, and any other colour mode, holds the same palette as `theme.json` and replaces only the semantic tokens. See [style-variations.md](style-variations.md).

If the Figma names differ (for example `surface` or `accent-two`), propose a mapping to this convention and let the user decide. Do not rename silently, and keep an existing theme's coherent scheme.

### Contrast check

Before approving, check the new palette in light and dark:

- `contrast` on `base`, and link and button colour pairs: at least 4.5:1.
- Focus outlines and UI borders against their background: at least 3:1.
- Mark ramp steps that fail 4.5:1 on `base` as "not for text" in the plan.

## Semantic custom colours

Variables whose code syntax is `--wp--custom--color--<group>--<role>` become nested keys under `settings.custom.color` (for example `text.default`, `surface.raised`, `border.subtle`, `button.primary.background`).

- An alias to a palette variable becomes `var(--wp--preset--color--<slug>)`. That is the expected shape.
- A raw colour in a semantic token raises a warning. Ask whether it should alias a palette colour instead.
- Prefer role names (`text`, `surface`, `border`, `icon`, `button`, `form`) to appearance names (`blue-dark`). Flag appearance names.
- In a semantic theme, every token path in `theme.json` needs the same path in `styles/dark.json`. The mapper's `Dark` variation provides those values from the semantic collection's Dark mode. List any token without a dark value.
