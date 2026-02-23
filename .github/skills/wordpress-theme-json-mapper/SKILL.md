# WordPress Theme.json Mapper Skill

**Purpose**: Map design tokens from a design system to WordPress theme.json configuration, including colors, typography, spacing, and block styles.

**Version**: 1.0.0  
**Last Updated**: 2026-02-23

---

## Overview

This skill automates the process of translating design system tokens (colors, typography, spacing, layouts) into WordPress-compatible theme.json structure, along with generating block styles, section styles, and CSS custom properties.

## Key Capabilities

1. **Color Palette Mapping**: Transform hex colors and gradients into WordPress color presets
2. **Typography System**: Map font families, sizes, weights, and fluid scales to WordPress font presets
3. **Spacing Scale**: Convert design tokens to WordPress spacing presets
4. **Layout System**: Configure content width, wide width, and responsive containers
5. **Block Styles**: Generate individual block style variations in JSON format
6. **Section Styles**: Create reusable section style presets
7. **Custom CSS**: Extract design tokens that don't fit theme.json into CSS custom properties

## Input Requirements

### Design System Structure

The skill expects design tokens organized as:

```
guidelines/
├── design-tokens/
│   ├── DESIGN-SYSTEM-GUIDE.md    # Master reference
│   ├── colors.md                  # Color palette
│   ├── typography.md              # Font families, sizes, weights
│   ├── spacing.md                 # Spacing scale
│   ├── layout.md                  # Container widths, grid system
│   └── dark-mode.md              # Dark mode variants (optional)
```

### Key Token Categories

#### 1. Colors
- **Brand colors**: Primary, secondary, accent
- **UI colors**: Background, foreground, border, muted
- **Semantic colors**: Success, warning, error, info
- **Gradients**: Complex multi-stop gradients
- **Dark mode variants**: Alternative colors for dark theme

#### 2. Typography
- **Font families**: Heading font, body font, mono font
- **Font sizes**: Static and fluid (clamp) values
- **Font weights**: Numeric values (400, 600, 700)
- **Line heights**: Relative or absolute values
- **Letter spacing**: Tight, normal, wide
- **Variable font settings**: For variable fonts (optional)

#### 3. Spacing
- **Scale**: Consistent spacing increments (4px, 8px, 16px, etc.)
- **Semantic names**: Small, medium, large, etc.
- **Section spacing**: Vertical rhythm (py-12, py-16)
- **Container padding**: Responsive padding (clamp values)

#### 4. Layout
- **Content width**: Max width for regular content
- **Wide width**: Max width for wide-aligned blocks
- **Container padding**: Responsive horizontal padding
- **Grid system**: Column counts, gaps

## Output Structure

### Theme.json Schema

```json
{
  "$schema": ".github/schemas/theme.6.9.json",
  "version": 3,
  "settings": {
    "color": { /* Color presets */ },
    "typography": { /* Typography settings */ },
    "spacing": { /* Spacing presets */ },
    "layout": { /* Content/wide widths */ }
  },
  "styles": {
    "color": { /* Default colors */ },
    "typography": { /* Default typography */ },
    "elements": {
      "h1": { /* Heading styles */ },
      "link": { /* Link styles */ },
      "button": { /* Button styles */ }
    },
    "blocks": {
      "core/button": { /* Block-specific styles */ }
    }
  }
}
```

### Block Styles Structure

Individual block style variations go in `styles/blocks/`:

```json
{
  "$schema": "https://schemas.wp.org/wp/6.9/theme.json",
  "version": 3,
  "title": "Button Outline",
  "styles": {
    "blocks": {
      "core/button": {
        "color": { /* Colors */ },
        "border": { /* Border */ },
        "typography": { /* Typography */ }
      }
    }
  }
}
```

### Section Styles Structure

Reusable section presets go in `styles/sections/`:

```json
{
  "$schema": "https://schemas.wp.org/wp/6.9/theme.json",
  "version": 3,
  "title": "Navy Background Section",
  "styles": {
    "blocks": {
      "core/group": {
        "color": {
          "background": "var(--wp--preset--color--secondary)",
          "text": "var(--wp--preset--color--base)"
        }
      }
    }
  }
}
```

## Mapping Process

### Step 1: Color Palette

**Input**: `colors.md`

```markdown
| Token | Value | Description |
|:---|:---|:---|
| Brand Red | #E82C27 | Primary brand color |
| Brand Navy | #172134 | Deep navy for backgrounds |
```

**Output**: theme.json

```json
{
  "settings": {
    "color": {
      "palette": [
        {
          "slug": "primary",
          "color": "#E82C27",
          "name": "Brand Red"
        },
        {
          "slug": "secondary",
          "color": "#172134",
          "name": "Brand Navy"
        }
      ]
    }
  }
}
```

### Step 2: Typography Scale

**Input**: `typography.md`

```markdown
| Level | Mobile Size | Desktop Size | Font | Weight |
|:---|:---|:---|:---|:---|
| H1 | 36px | 48px | Roboto Serif | 400 |
| H2 | 28px | 30px | Roboto Serif | 400 |
| P1 | 18px | 18px | Inter | 400 |
```

**Output**: theme.json

```json
{
  "settings": {
    "typography": {
      "fontFamilies": [
        {
          "slug": "heading",
          "fontFamily": "\"Roboto Serif\", serif",
          "name": "Roboto Serif"
        },
        {
          "slug": "body",
          "fontFamily": "\"Inter\", sans-serif",
          "name": "Inter"
        }
      ],
      "fontSizes": [
        {
          "slug": "h1",
          "size": "2.25rem",
          "name": "H1",
          "fluid": {
            "min": "2.25rem",
            "max": "3rem"
          }
        },
        {
          "slug": "h2",
          "size": "1.875rem",
          "name": "H2",
          "fluid": {
            "min": "1.75rem",
            "max": "1.875rem"
          }
        },
        {
          "slug": "base",
          "size": "1.125rem",
          "name": "Body (18px)",
          "fluid": false
        }
      ]
    }
  },
  "styles": {
    "elements": {
      "h1": {
        "typography": {
          "fontFamily": "var(--wp--preset--font-family--heading)",
          "fontSize": "var(--wp--preset--font-size--h1)",
          "fontWeight": "400",
          "lineHeight": "1.2"
        }
      }
    }
  }
}
```

### Step 3: Spacing Scale

**Input**: `spacing.md`

```markdown
| Token | Value | Usage |
|:---|:---|:---|
| --space-40 | 1rem (16px) | Standard padding |
| --space-60 | 1.5rem (24px) | Medium separation |
| --space-80 | 2rem (32px) | Section separation |
```

**Output**: theme.json

```json
{
  "settings": {
    "spacing": {
      "spacingSizes": [
        {
          "slug": "40",
          "size": "1rem",
          "name": "16px"
        },
        {
          "slug": "60",
          "size": "1.5rem",
          "name": "24px"
        },
        {
          "slug": "80",
          "size": "2rem",
          "name": "32px"
        }
      ]
    }
  }
}
```

### Step 4: Layout Configuration

**Input**: `layout.md`

```markdown
Container: max-width: 1440px
Padding: clamp(1rem, 4vw, 2rem)
```

**Output**: theme.json

```json
{
  "settings": {
    "layout": {
      "contentSize": "900px",
      "wideSize": "1440px"
    }
  }
}
```

### Step 5: Variable Font Settings

**Input**: `typography.md`

```markdown
| Level | font-variation-settings |
|:---|:---|
| H1 | 'GRAD' -50, 'wdth' 64, 'opsz' 48 |
```

**Output**: Custom CSS in theme.json

```json
{
  "styles": {
    "css": "h1 { font-variation-settings: 'GRAD' -50, 'wdth' 64, 'opsz' 48; }"
  }
}
```

## Block Styles Generation

### Common Block Styles

#### Buttons
- Primary (filled)
- Outline
- Ghost (transparent)
- Secondary
- Destructive

#### Groups
- Card (shadow + border)
- Shadow only
- Border only
- Navy background
- Red background
- Gradient background

#### Images
- Rounded corners
- Circle (avatar)
- Featured (larger)

## Section Styles Catalog

### Background Variants
- `section-white.json`: White background
- `section-navy.json`: Navy background with white text
- `section-red.json`: Red background with white text
- `section-gradient-red.json`: Red gradient background
- `section-gradient-navy.json`: Navy gradient background

### Layout Variants
- `section-hero.json`: Large padding, center aligned
- `section-hero-tall.json`: Extra large padding
- `section-cta.json`: Call-to-action optimized
- `section-feature.json`: Feature section layout

### Content Variants
- `section-card.json`: Card-based layout
- `section-newsletter.json`: Newsletter signup optimized
- `section-faq.json`: FAQ section layout
- `section-pricing.json`: Pricing table layout

## Validation Checklist

Before finalizing theme.json:

- [ ] All colors from design system are mapped
- [ ] Font families are correctly declared and loaded
- [ ] Fluid typography uses correct min/max viewport widths
- [ ] Spacing scale is complete and consistent
- [ ] Layout widths match design specifications
- [ ] Variable font settings are applied (if applicable)
- [ ] Dark mode variants exist (if required)
- [ ] All block styles are registered in `inc/block-styles.php`
- [ ] Section styles have meaningful titles
- [ ] CSS custom properties don't conflict with theme.json

## Common Pitfalls

### 1. **Color Slug Naming**
❌ Bad: `brand-red-#e82c27`  
✅ Good: `primary`

### 2. **Font Size Units**
❌ Bad: Mixing px and rem inconsistently  
✅ Good: Use rem for all font sizes

### 3. **Fluid Typography**
❌ Bad: Making all sizes fluid  
✅ Good: Only headings and large text should be fluid

### 4. **Spacing Gaps**
❌ Bad: Random spacing values (13px, 27px)  
✅ Good: Consistent scale (4, 8, 12, 16, 24, 32, 40, 48)

### 5. **Layout Widths**
❌ Bad: `wideSize` smaller than `contentSize`  
✅ Good: `contentSize: 900px`, `wideSize: 1440px`

## Usage Example

### Input Design System

```
Primary Red: #E82C27
Heading Font: Roboto Serif
Body Font: Inter
H1 Mobile: 36px → Desktop: 48px
Container: 1440px max-width
```

### Generated theme.json (excerpt)

```json
{
  "settings": {
    "color": {
      "palette": [
        { "slug": "primary", "color": "#E82C27", "name": "Brand Red" }
      ]
    },
    "typography": {
      "fontFamilies": [
        { "slug": "heading", "fontFamily": "\"Roboto Serif\", serif" },
        { "slug": "body", "fontFamily": "\"Inter\", sans-serif" }
      ],
      "fontSizes": [
        {
          "slug": "h1",
          "size": "2.25rem",
          "fluid": { "min": "2.25rem", "max": "3rem" }
        }
      ]
    },
    "layout": {
      "wideSize": "1440px"
    }
  },
  "styles": {
    "typography": {
      "fontFamily": "var(--wp--preset--font-family--body)"
    },
    "elements": {
      "h1": {
        "typography": {
          "fontFamily": "var(--wp--preset--font-family--heading)",
          "fontSize": "var(--wp--preset--font-size--h1)",
          "fontWeight": "400"
        }
      }
    }
  }
}
```

## Related Files

- [theme.json](/path/to/theme.json) - Main theme configuration
- [inc/block-styles.php](/path/to/inc/block-styles.php) - Block style registration
- [styles/blocks/](/path/to/styles/blocks/) - Block style variations
- [styles/sections/](/path/to/styles/sections/) - Section style presets

## Maintenance Notes

- Update theme.json when design tokens change
- Regenerate block styles if new variants are added
- Keep section styles in sync with pattern library
- Test fluid typography on multiple viewport sizes
- Verify accessibility (contrast, focus states)

---

**Next Steps After Running This Skill:**

1. Load updated theme.json in WordPress admin
2. Clear WordPress object cache
3. Test all block variations in the editor
4. Verify section styles render correctly
5. Run accessibility audit on generated styles
6. Update documentation with new presets
