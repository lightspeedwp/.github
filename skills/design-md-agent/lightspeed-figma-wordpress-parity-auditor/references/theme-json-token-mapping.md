# theme.json Token Mapping

## Token groups

Compare Figma variables to `theme.json` settings for:

- `settings.color.palette`
- `settings.color.gradients`
- `settings.typography.fontFamilies`
- `settings.typography.fontSizes`
- `settings.spacing.spacingScale`
- `settings.spacing.spacingSizes`
- `settings.layout.contentSize`
- `settings.layout.wideSize`
- `styles.color`
- `styles.typography`
- `styles.spacing`
- block-level styles

## Audit questions

1. Are token names consistent and predictable?
2. Are semantic tokens separated from raw values?
3. Do light and dark modes use clear token overrides?
4. Are WordPress presets available in the editor where editors need them?
5. Are private/internal tokens hidden from editor controls where appropriate?
6. Are deprecated tokens still present?

## Output columns

- Token category
- Figma token name
- Figma value
- WordPress token name
- WordPress value
- Status
- Issue
- Owner
- Fix recommendation
