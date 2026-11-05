# Spacing tokens

Covers `settings.spacing.spacingSizes`.

## Mapping

Variables whose code syntax is `--wp--preset--spacing--<slug>` become `{ slug, name, size }`:

- `slug` comes from the code syntax (`var(--wp--preset--spacing--20)` becomes `20`).
- `name` is the last segment of the Figma variable name (`Padding/XS` becomes "XS"). The name carries only the size; the slug lives in the code syntax. A name that repeats its slug (`Padding/10 XS`) is mapped as "XS" with a warning, so rename it in Figma.

The LightSpeed spacing ladder:

| Name | XXS | XS | S | M | L | XL | XXL | XXXL | XXXXL | Gigantic | Colossal |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Slug | `5` | `10` | `20` | `30` | `40` | `50` | `60` | `70` | `80` | `90` | `100` |

Keep the ramp in this order in Figma, smallest first. The mapper warns when it is not.

`Padding/None` (0) and negative values such as `Padding/Negative 80` are not on the ladder. Negative values go to `custom` through their `--wp--custom--spacing--…` code syntax.
- `size` is a fluid `clamp()` when the collection has `Mobile` and `Desktop` modes, otherwise a plain rem value.

## The clamp formula

`scripts/fluid-clamp.ts` scales a value linearly from the mobile frame (390px) to the desktop frame (1440px):

- slope, in vw: `(max - min) / (1440 - 390) * 100`
- intercept, in px: `min - slope * 390 / 100`, then converted to rem
- result: `clamp(min rem, calc(slope vw + intercept rem), max rem)`, rounded to 3 decimals

The vw term is **not** divided by the root font size. The earlier spacing extractor divided it by 16, which made fluid values grow about 16 times too slowly. Themes whose spacing came from that skill should regenerate it.

Check a single value, or a list of rows:

```bash
npx tsx ${CLAUDE_SKILL_DIR}/scripts/fluid-clamp.ts 16 24
npx tsx ${CLAUDE_SKILL_DIR}/scripts/fluid-clamp.ts --json '[{"slug":"10","name":"XS","min":8,"max":12}]'
```

Use `--min-viewport` and `--max-viewport` only when the design's frames differ from 390px and 1440px, and note it in the plan.

## Review

- Replace `settings.spacing.spacingSizes` only. Keep `units`, `padding`, `margin`, `blockGap` and `defaultSpacingSizes`. Set `defaultSpacingSizes: false` only if the user asks for the theme scale to replace the core one.
- Compare the count with the mapper's `counts.spacing`.
- Slugs used in `styles` and patterns (`var:preset|spacing|<slug>`) must still exist. `theme-orphaned-refs` checks this.

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/.github/graphs/contributors)
