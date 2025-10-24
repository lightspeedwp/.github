# 8. JSON Standards (theme.json / block.json)

## Formatting

- Indentation: **2 spaces**; no tabs.
- Trailing commas: not allowed.
- Keys: follow the official schema casing. Top‑level `theme.json` keys are lowercase (e.g., `settings`, `styles`, `custom`); many nested keys are camelCase per the schema (e.g., `appearanceTools`, `fontSizes`, `apiVersion`). Use kebab‑case only for CSS custom properties and for slugs that become part of CSS variables (e.g., `--wp--preset--font-size--sm`), not for JSON keys.

## theme.json

- Use `settings`, `styles`, and `custom` thoughtfully; prefer core settings over ad-hoc custom keys.
- Respect versions in `styles` (see “styles-versions” doc).
- Co-ordinate tokens with CSS custom properties and design system.

## block.json

- Minimum (required): `name`, `title`. Recommended: `apiVersion` (use the latest, currently `3`) and `category`. Add `attributes` and `supports` only as needed.
- Localize `title`/`description`/`keywords`; include `textdomain` to enable automatic string discovery and translations.

## Best Practices

- Keep files small and readable; split per block where appropriate.
- Validate schemas in CI.
- Document rationale in repository docs rather than JSON comments.

## References

- Theme JSON guide: <https://developer.wordpress.org/block-editor/how-to-guides/themes/global-settings-and-styles/>
- theme.json ref: <https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/theme-json-reference/theme-json-living.md>
- styles versions: <https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/theme-json-reference/styles-versions.md>
- Schemas:
  - block: <https://github.com/WordPress/gutenberg/blob/trunk/schemas/json/block.json>
  - theme: <https://github.com/WordPress/gutenberg/blob/trunk/schemas/json/theme.json>
  - font collection: <https://github.com/WordPress/gutenberg/blob/trunk/schemas/json/font-collection.json>
