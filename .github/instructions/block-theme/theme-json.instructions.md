---
file_type: "instructions"
applyTo: "**/theme.json"
description: "Theme.json configuration standards for WordPress block themes - design systems, tokens, and global styles"
license: "GPL-3.0-or-later"
---

> ⚠️ **Scope Notice**: These instructions are intended for **WordPress block theme repositories** within the `lightspeedwp` GitHub organisation. They should **not** be applied to the `lightspeedwp/.github` community health repository, as that repository does not contain WordPress code.

# Theme.json Configuration Guidelines

## Overview

The `theme.json` file is the foundation of WordPress block themes, providing a centralized configuration for design tokens, global styles, and block settings. This document provides comprehensive guidance following WordPress best practices.

## Structure & Organization

### Version and Core Settings

```json
{
  "$schema": "https://schemas.wp.org/trunk/theme.json",
  "version": 3,
  "title": "Theme Name",
  "description": "A brief description of the theme's design approach",
  "settings": {
    "appearanceTools": true,
    "useRootPaddingAwareAlignments": true,
    "layout": {
      "contentSize": "620px",
      "wideSize": "1200px"
    }
  }
}
```

### Key Top-Level Properties

- **`$schema`**: Points to WordPress theme.json schema for validation
- **`version`**: Schema version (use 3 for WordPress 6.6+)
- **`title`**: Optional theme title override
- **`description`**: Brief theme description
- **`settings`**: Global and block-specific settings
- **`styles`**: Global and block-specific styles
- **`customTemplates`**: Custom template definitions
- **`templateParts`**: Template part definitions
- **`patterns`**: Pattern categories

## Typography System

### Font Families

```json
{
  "settings": {
    "typography": {
      "dropCap": false,
      "fluid": true,
      "fontStyle": true,
      "fontWeight": true,
      "letterSpacing": true,
      "lineHeight": true,
      "textDecoration": true,
      "textTransform": true,
      "writingMode": false,
      "fontFamilies": [
        {
          "fontFamily": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif",
          "name": "System Font",
          "slug": "system"
        },
        {
          "fontFamily": "Georgia, serif",
          "name": "Serif",
          "slug": "serif"
        },
        {
          "fontFamily": "'Courier New', Courier, monospace",
          "name": "Monospace",
          "slug": "monospace"
        }
      ]
    }
  }
}
```

### Font Sizes with Fluid Typography

```json
{
  "settings": {
    "typography": {
      "fontSizes": [
        {
          "name": "Small",
          "size": "0.875rem",
          "slug": "small",
          "fluid": {
            "min": "0.875rem",
            "max": "1rem"
          }
        },
        {
          "name": "Medium",
          "size": "1rem",
          "slug": "medium",
          "fluid": false
        },
        {
          "name": "Large",
          "size": "1.25rem",
          "slug": "large",
          "fluid": {
            "min": "1.125rem",
            "max": "1.5rem"
          }
        },
        {
          "name": "Extra Large",
          "size": "2rem",
          "slug": "x-large",
          "fluid": {
            "min": "1.75rem",
            "max": "2.5rem"
          }
        },
        {
          "name": "Huge",
          "size": "3rem",
          "slug": "xx-large",
          "fluid": {
            "min": "2.25rem",
            "max": "4rem"
          }
        }
      ]
    }
  }
}
```

### Typography Best Practices

- Enable fluid typography for responsive sizing
- Provide 5-7 font sizes for flexibility
- Use rem units for accessibility
- Include system fonts as fallback
- Test across different screen sizes

## Color System

### Color Palette

```json
{
  "settings": {
    "color": {
      "custom": false,
      "customDuotone": false,
      "customGradient": false,
      "defaultDuotones": false,
      "defaultGradients": false,
      "defaultPalette": false,
      "palette": [
        {
          "name": "Base",
          "slug": "base",
          "color": "#ffffff"
        },
        {
          "name": "Contrast",
          "slug": "contrast",
          "color": "#000000"
        },
        {
          "name": "Primary",
          "slug": "primary",
          "color": "#007cba"
        },
        {
          "name": "Secondary",
          "slug": "secondary",
          "color": "#006ba1"
        },
        {
          "name": "Tertiary",
          "slug": "tertiary",
          "color": "#f0f0f0"
        }
      ]
    }
  }
}
```

### Gradients

```json
{
  "settings": {
    "color": {
      "gradients": [
        {
          "gradient": "linear-gradient(135deg, var(--wp--preset--color--primary) 0%, var(--wp--preset--color--secondary) 100%)",
          "name": "Primary to Secondary",
          "slug": "primary-to-secondary"
        }
      ]
    }
  }
}
```

### Duotone Filters

```json
{
  "settings": {
    "color": {
      "duotone": [
        {
          "colors": ["#000000", "#ffffff"],
          "name": "Black and White",
          "slug": "black-and-white"
        }
      ]
    }
  }
}
```

### Color System Best Practices

- Disable default palettes to avoid confusion
- Use CSS custom properties for consistency
- Provide sufficient color contrast (WCAG AA minimum)
- Include accessible text/background combinations
- Test in light and dark modes

## Spacing System

### Spacing Scale

```json
{
  "settings": {
    "spacing": {
      "customSpacingSize": false,
      "spacingScale": {
        "operator": "*",
        "increment": 1.5,
        "steps": 7,
        "mediumStep": 1.5,
        "unit": "rem"
      },
      "spacingSizes": [
        {
          "name": "2X-Small",
          "size": "0.25rem",
          "slug": "20"
        },
        {
          "name": "X-Small",
          "size": "0.5rem",
          "slug": "30"
        },
        {
          "name": "Small",
          "size": "0.75rem",
          "slug": "40"
        },
        {
          "name": "Medium",
          "size": "1rem",
          "slug": "50"
        },
        {
          "name": "Large",
          "size": "1.5rem",
          "slug": "60"
        },
        {
          "name": "X-Large",
          "size": "2rem",
          "slug": "70"
        },
        {
          "name": "2X-Large",
          "size": "3rem",
          "slug": "80"
        }
      ],
      "units": ["px", "em", "rem", "vh", "vw", "%"]
    }
  }
}
```

### Spacing Best Practices

- Use consistent spacing scale
- Prefer rem units for accessibility
- Limit custom spacing options
- Use spacing scale for margin/padding
- Consider vertical rhythm

## Layout Settings

### Content Width and Alignments

```json
{
  "settings": {
    "layout": {
      "contentSize": "620px",
      "wideSize": "1200px"
    },
    "useRootPaddingAwareAlignments": true
  }
}
```

### Layout Types

```json
{
  "settings": {
    "layout": {
      "definitions": {
        "default": {
          "name": "default",
          "slug": "flow",
          "className": "is-layout-flow",
          "baseStyles": {
            "blockGap": "1.5rem"
          }
        }
      }
    }
  }
}
```

## Global Styles

### Element Styles

```json
{
  "styles": {
    "elements": {
      "link": {
        "color": {
          "text": "var(--wp--preset--color--primary)"
        },
        ":hover": {
          "color": {
            "text": "var(--wp--preset--color--secondary)"
          }
        }
      },
      "h1": {
        "typography": {
          "fontSize": "var(--wp--preset--font-size--xx-large)",
          "lineHeight": "1.2"
        }
      },
      "button": {
        "color": {
          "background": "var(--wp--preset--color--primary)",
          "text": "var(--wp--preset--color--base)"
        },
        "border": {
          "radius": "4px"
        },
        "spacing": {
          "padding": {
            "top": "0.75rem",
            "right": "1.5rem",
            "bottom": "0.75rem",
            "left": "1.5rem"
          }
        }
      }
    }
  }
}
```

### Block Styles

```json
{
  "styles": {
    "blocks": {
      "core/paragraph": {
        "typography": {
          "lineHeight": "1.6"
        },
        "spacing": {
          "margin": {
            "bottom": "1.5rem"
          }
        }
      },
      "core/heading": {
        "spacing": {
          "margin": {
            "top": "2rem",
            "bottom": "1rem"
          }
        }
      }
    }
  }
}
```

## Block-Level Settings

### Per-Block Configuration

```json
{
  "settings": {
    "blocks": {
      "core/paragraph": {
        "color": {
          "palette": [
            {
              "name": "Custom Paragraph Color",
              "slug": "custom-paragraph",
              "color": "#123456"
            }
          ]
        },
        "typography": {
          "fontSizes": [
            {
              "name": "Small Paragraph",
              "slug": "small-paragraph",
              "size": "0.875rem"
            }
          ]
        }
      }
    }
  }
}
```

## Custom Templates

### Template Definitions

```json
{
  "customTemplates": [
    {
      "name": "page-hero",
      "title": "Page with Hero",
      "postTypes": ["page"]
    },
    {
      "name": "single-portfolio",
      "title": "Portfolio Item",
      "postTypes": ["portfolio"]
    }
  ]
}
```

## Template Parts

### Template Part Definitions

```json
{
  "templateParts": [
    {
      "name": "header",
      "title": "Header",
      "area": "header"
    },
    {
      "name": "footer",
      "title": "Footer",
      "area": "footer"
    }
  ]
}
```

## Patterns

### Pattern Categories

```json
{
  "patterns": ["hero", "testimonials", "call-to-action", "portfolio"]
}
```

## Best Practices

### Design System Approach

1. Start with design tokens (colors, typography, spacing)
2. Define global styles before block-specific styles
3. Use CSS custom properties for consistency
4. Minimize use of custom CSS
5. Leverage block supports over custom code

### Performance Considerations

- Keep theme.json file size reasonable (<100KB)
- Use CSS custom properties efficiently
- Avoid excessive block-specific settings
- Test with performance profiling tools
- Minimize custom styles in favor of supports

### Accessibility

- Ensure sufficient color contrast ratios
- Provide focus styles for interactive elements
- Use semantic HTML through block patterns
- Test with keyboard navigation
- Validate with accessibility tools

### Maintainability

- Document custom decisions
- Use consistent naming conventions
- Group related settings logically
- Comment complex configurations
- Version control all changes

## Validation

### Schema Validation

Use the official WordPress schema for validation:

```json
{
  "$schema": "https://schemas.wp.org/trunk/theme.json"
}
```

### Validation Tools

- [WordPress Theme JSON Schema](https://schemas.wp.org/trunk/theme.json)
- VS Code JSON schema validation
- [Theme Check Plugin](https://wordpress.org/plugins/theme-check/)
- Custom validation scripts

### Validation Checklist

- [ ] Valid JSON syntax
- [ ] Correct schema version
- [ ] All color slugs unique
- [ ] All font size slugs unique
- [ ] Valid CSS custom properties
- [ ] Accessible color combinations
- [ ] Proper spacing scale
- [ ] Valid layout definitions

## Migration from Earlier Versions

### From Version 1 to Version 2

- Update `"version": 2`
- Migrate preset naming from camelCase to kebab-case
- Update custom property references

### From Version 2 to Version 3

- Update `"version": 3`
- Review new features (shadow, dimensions, etc.)
- Update block supports syntax if needed

## References

- [WordPress Theme JSON Schema](https://developer.wordpress.org/block-themes/theme-json/)
- [Theme JSON Reference](https://developer.wordpress.org/block-editor/reference-guides/theme-json-reference/)
- [Global Settings and Styles](https://developer.wordpress.org/block-editor/how-to-guides/themes/global-settings-and-styles/)
- [Theme JSON Validation](./theme-json-validation.instructions.md)
- [Block Theme Development](./block-theme.instructions.md)
