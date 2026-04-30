---
name: wordpress-theme-json-mapper
description: >
  Map design system tokens (colors, typography, spacing, layouts) to WordPress
  theme.json configuration. Use when translating design tokens to theme.json,
  converting style guides to WordPress presets, generating block styles from
  design systems, creating theme.json from existing documentation, or automating
  the process of extracting design tokens into WordPress-compatible format.
license: MIT
compatibility: Requires access to design system documentation
metadata:
  version: "1.0.0"
  author: lightspeedwp
---

# WordPress Theme.json Mapper

## Purpose

Map design system tokens (colors, typography, spacing, layouts) to WordPress theme.json configuration, including block styles and section styles.

## Core Capabilities

1. **Color Palette Mapping** - Transform hex colors and gradients into WordPress color presets
2. **Typography System** - Map font families, sizes, weights, and fluid scales
3. **Spacing Scale** - Convert design tokens to WordPress spacing presets
4. **Layout System** - Configure content width, wide width, responsive containers
5. **Block Styles** - Generate block style variations with `blockTypes` declarations
6. **Section Styles** - Create reusable section style presets
7. **Custom CSS** - Extract tokens that don't fit theme.json into CSS variables

## Input Requirements

Design tokens should be organized in:

```
guidelines/
└── design-tokens/
    ├── DESIGN-SYSTEM-GUIDE.md
    ├── colors.md
    ├── typography.md
    ├── spacing.md
    ├── layout.md
    └── dark-mode.md (optional)
```

### Token Categories

- **Colors**: Brand, UI, semantic, gradients, dark mode variants
- **Typography**: Font families, sizes, weights, line heights, letter spacing
- **Spacing**: Scale increments, semantic names, section spacing
- **Layout**: Content width, wide width, container padding, grid system

## Quick Workflow

1. **Scan Design System** - Locate and read token files
2. **Extract Tokens** - Parse color, typography, spacing, layout values
3. **Map to theme.json** - Convert to WordPress preset format
4. **Generate Styles** - Create block and section styles
5. **Validate** - Check JSON syntax and structure

## Output Structure

### Theme.json
- `settings.color` - Color palette and gradients
- `settings.typography` - Font families, sizes, weights
- `settings.spacing` - Spacing scale presets
- `settings.layout` - Content/wide widths
- `styles.elements` - Default heading, link, button styles
- `styles.blocks` - Block-specific styles

### Block Styles
- Individual files in `styles/blocks/`
- Must include `blockTypes` array
- Follows theme.json schema

### Section Styles
- Individual files in `styles/sections/`
- Must include `blockTypes` array
- Reusable section presets

## Mapping Examples

### Color Preset
```json
{
  "slug": "primary",
  "color": "#0073aa",
  "name": "Primary"
}
```

### Typography Preset
```json
{
  "slug": "heading",
  "fontFamily": "Inter, sans-serif",
  "name": "Heading Font"
}
```

### Spacing Preset
```json
{
  "slug": "medium",
  "size": "1rem",
  "name": "Medium"
}
```

## Common Use Cases

- Migrating design system to WordPress theme
- Standardizing design tokens across themes
- Converting Figma/Sketch tokens to theme.json
- Generating theme.json from documentation
- Creating modular preset architecture

## Validation

After mapping:

```bash
# Validate JSON syntax
php -r 'json_decode(file_get_contents("theme.json"));'

# Check schema compliance
# Ensure $schema points to correct theme.json version
```

For detailed mapping process, schema reference, and examples, see [Schema Reference](references/SCHEMA-REFERENCE.md).
