# WordPress Theme.json Mapper

**Purpose**: Automate the translation of design system tokens into WordPress theme.json configuration, block styles, and section styles.

## Overview

This skill provides a systematic approach to mapping design tokens from a design system (colors, typography, spacing, layout) into WordPress-compatible `theme.json` structure and related style files.

## Key Capabilities

1. **Color Palette Mapping**: Transform hex colors and gradients into WordPress color presets
2. **Typography System**: Map font families, sizes, weights, and fluid scales
3. **Spacing Scale**: Convert design tokens to WordPress spacing presets
4. **Layout Configuration**: Set up content/wide widths and responsive containers
5. **Block Styles**: Generate individual block style variations (JSON files)
6. **Section Styles**: Create reusable section style presets
7. **Custom CSS**: Extract design tokens into CSS custom properties

## Files in This Skill

- **SKILL.md**: Comprehensive documentation of the mapping process
- **README.md**: This file - overview and quick reference

## Usage

1. **Gather Design Tokens**: Ensure design system documentation is organized with:
   - `colors.md`: Color palette definitions
   - `typography.md`: Font families, sizes, weights, scales
   - `spacing.md`: Spacing scale and semantic names
   - `layout.md`: Container widths, grid systems
   - `DESIGN-SYSTEM-GUIDE.md`: Master reference

2. **Run the Mapping Process**:
   - Review current `theme.json`
   - Identify discrepancies with design tokens
   - Update color palette, typography, spacing, and layout settings
   - Generate block styles in `styles/blocks/`
   - Generate section styles in `styles/sections/`
   - Create custom CSS for tokens that don't fit theme.json

3. **Validate Output**:
   - Test fluid typography across viewport sizes
   - Verify color contrast meets WCAG AA
   - Check block styles render correctly in editor
   - Ensure section styles apply properly

## Common Mappings

### Colors
```
Design Token          →  theme.json
Brand Red #E82C27     →  "slug": "primary", "color": "#E82C27"
Brand Navy #172134    →  "slug": "secondary", "color": "#172134"
```

### Typography
```
Design Token                →  theme.json
H1: 36px-48px fluid        →  "slug": "h1", "fluid": {"min": "2.25rem", "max": "3rem"}
Roboto Serif (headings)    →  "slug": "heading", "fontFamily": "\"Roboto Serif\", serif"
Inter (body)               →  "slug": "body", "fontFamily": "\"Inter\", sans-serif"
```

### Spacing
```
Design Token       →  theme.json
16px standard      →  "slug": "40", "size": "1rem"
24px medium        →  "slug": "60", "size": "1.5rem"
32px section       →  "slug": "80", "size": "2rem"
```

### Layout
```
Design Token                     →  theme.json
Max width 1440px                →  "wideSize": "1440px"
Content width 900px             →  "contentSize": "900px"
Padding clamp(1rem, 4vw, 2rem)  →  Custom CSS property
```

## Output Files

### Primary Output
- **theme.json**: Main theme configuration (updated)

### Generated Styles
- **styles/blocks/**: Individual block style variations
  - `button-outline.json`
  - `button-ghost.json`
  - `button-secondary.json`
  - `image-rounded.json`
  - `quote-modern.json`
  - etc.

- **styles/sections/**: Reusable section presets
  - `section-navy.json`
  - `section-red.json`
  - `section-gradient-red.json`
  - `section-cta.json`
  - `section-card.json`
  - etc.

### Custom CSS
- **assets/css/custom-properties.css**: CSS custom properties for tokens that can't be expressed in theme.json (e.g., variable font settings, complex calculations)

## Validation Checklist

Before finalizing:

- [ ] All design system colors are mapped to theme.json palette
- [ ] Font families are correctly declared and loaded
- [ ] Fluid typography uses correct viewport widths (390px-1440px)
- [ ] Spacing scale is complete and consistent
- [ ] Layout widths match design specifications
- [ ] Variable font settings applied via custom CSS
- [ ] Block styles registered in `inc/block-styles.php`
- [ ] Section styles have meaningful titles
- [ ] Accessibility verified (contrast, focus states)
- [ ] Tested in WordPress editor and front-end

## Related Documentation

- [SKILL.md](./SKILL.md) - Full documentation
- [Design System Guide](../../../bin/diepapieralt/guidelines/DESIGN-SYSTEM-GUIDE.md)
- [WordPress Theme Handbook](https://developer.wordpress.org/themes/)
- [theme.json Reference](https://developer.wordpress.org/block-editor/reference-guides/theme-json-reference/)

## Version History

- **1.0.0** (2026-02-23): Initial skill creation with V2 design token mapping

---

**For detailed mapping procedures, examples, and troubleshooting, see [SKILL.md](./SKILL.md)**
