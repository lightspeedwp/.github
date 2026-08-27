# theme.json Token Mapping

## Map token groups

| Figma variable group | WordPress target |
|---|---|
| colours | `settings.color.palette`, custom CSS vars, style presets |
| typography families | `settings.typography.fontFamilies` |
| font sizes | `settings.typography.fontSizes` |
| line heights | custom styles or block supports |
| spacing scale | `settings.spacing.spacingSizes` and layout presets |
| radius | custom CSS vars or block styles |
| shadows | custom CSS vars or styles |
| layout widths | `settings.layout.contentSize` and `wideSize` |
| modes | style variations, CSS variables, dark mode strategy |

## Requirements

- Preserve semantic token names where possible.
- Avoid one-off hardcoded values when a token exists.
- Document missing tokens and token collisions.
- Separate primitive tokens from semantic tokens where possible.
- Identify which tokens must be editor-visible.

## Output table

| Figma token | WordPress/theme.json target | Status | Notes |
|---|---|---|---|
