# theme.json Guide (LSX)

## Key Settings

- `"appearanceTools": true` – enable block design controls.
- `"color.defaultPalette": false` – LSX palette only.
- `"typography.fluid": true` – fluid type scale.
- `"spacing.spacingSizes"` – numeric spacing presets.

## Structure

- **settings.color.palette** — colour tokens by slug.
- **settings.typography.fontSizes** — numeric font size presets.
- **settings.spacing.spacingSizes** — numeric spacing presets.
- **styles** — defaults that reference tokens.

## Integration: ai-block-theme-template

- Place `theme.json` at theme root.
- Avoid styles that override `--wp--preset--*` outputs.
- Optionally import `tokens/css-tokens.css` for utilities.
