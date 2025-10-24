# Naming Conventions

Outlines naming conventions block themes to ensure portability and prevent layout issues.

---

## Best practices

- **Colour slugs**: Standardise colour slugs to generic names like `base`, `contrast`, `primary` to ensure portability between themes.
- **Font size slugs**: Define consistent font-size slugs such as `small`, `medium`, `large`, `x-large`. Enable fluid typography via `settings.typography.fluid`.
- **Spacing slugs**: Use numeric spacing slugs (e.g., `20`, `30`, `40`), particularly when using scales or custom sizes.

---

## Examples

- Inconsistent naming across themes can break layouts and content formatting when switching themes.

```json
{
  "$schema": "https://schemas.wp.org/wp/6.8/theme.json",
  "name": "My Theme",
  "version": 3,
  "settings": {
    "color": {
      "palette": [
        {
          "slug": "base",
          "color": "#ffffff",
          "name": "Base"
        },
        {
          "slug": "contrast",
          "color": "#000000",
          "name": "Contrast"
        },
        {
          "slug": "primary",
          "color": "#3b82f6",
          "name": "Primary"
        }
      ]
    },
    "typography": {
      "fluid": true,
      "fontSizes": [
        {
          "slug": "small",
          "size": "0.875rem",
          "name": "Small"
        },
        {
          "slug": "medium",
          "size": "1rem",
          "name": "Medium"
        },
        {
          "slug": "large",
          "size": "1.25rem",
          "name": "Large"
        },
        {
          "slug": "x-large",
          "size": "1.5rem",
          "name": "Extra Large"
        }
      ]
    },
    "spacing": {
      "spacingScale": {
        "steps": 0,
        "mediumStep": 1.5,
        "unit": "rem",
        "operator": "*"
      },
      "spacingSizes": [
        {
          "slug": "20",
          "size": "1rem",
          "name": "Small"
        },
        {
          "slug": "30",
          "size": "1.5rem",
          "name": "Medium"
        },
        {
          "slug": "40",
          "size": "2rem",
          "name": "Large"
        }
      ]
    }
  }
}
```

---

## When to use

- Use colour palettes via `settings.color.palette` to auto-generate CSS variables and `.has-*` classes.
- Use font size presets via `settings.custom.typography.scale`.
- Use spacing presets via `settings.spacing.spacingScale`.

## Limitations

- Inconsistent naming leads to layout brokenness when switching themes.
- Inconsistent naming across themes breaks content formatting when switching themes.
- Order of `spacingSizes` matters—UI reflects the insertion order.

---

## Reference Links

- [Rich Tabor: Standardizing theme.json spacing sizes](https://rich.blog/standardizing-theme-json-colors/)

---
