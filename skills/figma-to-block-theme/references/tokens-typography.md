# Typography tokens and fonts

Covers `settings.typography.fontSizes`, `settings.typography.fontFamilies` (with `fontFace`) and line heights in `settings.custom`.

## Font sizes

Variables whose code syntax is `--wp--preset--font-size--<slug>` become `{ slug, name, size, fluid }`:

- `slug` comes from the code syntax (`--font-size--100` becomes `100`).
- `name` is the last segment of the Figma name (`fontSize/Tiny` becomes "Tiny").
- `size` is the desktop value in rem.
- `fluid: { min, max }` is added when the `Mobile` and `Desktop` values differ. WordPress then builds the clamp itself, so no `clamp()` string is needed.

Keep the sizes in order in Figma, smallest first. The mapper warns when the ramp is out of order.

If the Figma variable descriptions give explicit rem values, prefer those, and say so in the plan.

After replacing the sizes, update every reference in `styles`, `styles.blocks`, `styles.elements`, block style JSON and `css` strings (`var:preset|font-size|…` and `var(--wp--preset--font-size--…)`). Do not leave old named slugs (`small`, `medium`, `x-large`) behind when the new slugs are numeric.

## Font families

Variables whose code syntax is `--wp--preset--font-family--<slug>` (usually `heading` and `body`) become `{ slug, name, fontFamily }`:

- `name` is the font name (for example "Nunito Sans"), not the slug.
- `fontFamily` quotes names that contain spaces and adds a fallback: `sans-serif` by default, or `--font-fallback serif` for serif families. Confirm the fallback with the user.

### Font files

Each family needs a `fontFace` array that points at WOFF2 files in the theme. For Google Fonts:

```bash
npx tsx ${CLAUDE_SKILL_DIR}/scripts/google-fonts.ts --family "Nunito Sans" --slug body \
  --weights 200..1000 --styles normal,italic --out <theme>/assets/fonts --theme-root <theme>
```

- A weight range (`200..1000`) asks for a variable font: one file per style. If Google Fonts returns 400, the font is not variable. Pass the static weights instead (`--weights 400,700`).
- `--subsets` defaults to `latin`. Add `latin-ext` or others only when the content needs them. Each extra subset adds a file and a `unicodeRange`.
- The script prints the full `fontFamilies` entry with `src` paths relative to the theme root (`file:./assets/fonts/…`). Merge it into the family entry.
- For fonts not on Google Fonts, ask the user for licensed WOFF2 files. If only TTF or OTF files exist, ask for WOFF2 versions rather than converting them without a licence check.
- Check the licence before committing font files to a theme repository.

## Line heights and other custom values

Variables whose code syntax is `--wp--custom--line-height--<role>` go to `settings.custom["line-height"].<role>` as strings. Figma line heights over 10 are treated as percentages (`150` becomes `"1.5"`). Other custom numbers (for example font weights) are kept as strings.

If the theme stores line heights under another key (for example `settings.custom.lineHeight`), follow the theme and note the mapping.

## Review

- Every slug referenced in the theme exists in `settings.typography`.
- Each family has `fontFace` entries whose `src` files exist.
- The mapper counts for `font-size` and `font-family` match the Figma variables.

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/.github/graphs/contributors)
