# Fluid Typography

Introduces fluid typography techniques for responsive type scaling in block themes, using clamp() and custom properties in theme.json.

---

## Best practices

- Combine **typographic scale** with `clamp()` in `theme.json` for scalable, responsive typography.
- Define CSS custom properties in `settings.custom.typography.scale`.
- Generate a dual `scale` and font-size system using `settings.custom.typography.scale`, e.g.:

```json
  "settings": {
    "custom": {
      "typography": {
        "scale": 1.25,
        "normal": "1rem",
        "small": "calc(var(--wp--custom--typography--normal) / var(--wp--custom--typography--scale))",
        /* … */
      }
    }
  }
```

Apply clamp() in settings.typography.fontSizes for responsive scaling:

```json
{
  "name": "Large",
  "size": "clamp(var(--wp--custom--typography--small), calc(var(--wp--custom--typography--normal) + 3vw), var(--wp--custom--typography--large))",
  "slug": "large"
}
```

Or use WordPress's built-in fluid support:

```json
 "settings": { "typography": { "fluid": true } }
```

…and define min/max ranges in fontSizes entries.

## When to use

- You want type to scale smoothly between breakpoints without multiple media queries.
- Your design system defines a base size with proportional steps (e.g. minor third 1.2–1.25).
- You need consistent, predictable min/max sizes across blocks and patterns.
- You are targeting modern browsers where clamp() is supported.

## When to use

- You want type to scale smoothly between breakpoints without multiple media queries.
- Your design system defines a base size with proportional steps (e.g. minor third 1.2–1.25).
- You need consistent, predictable min/max sizes across blocks and patterns.
- You are targeting modern browsers where clamp() is supported.

---

## Limitations

- Requires well-defined scale; overcomplex logic could hinder maintainability.
- Only px, em, and rem units are supported in fluid typography.

---

## Reference Links

- [Rich Tabor: Fluid Type Scale in Block Themes](https://rich.blog/fluid-type-scale-theme-json/)
- [Rich Tabor: Fluid Typography and Block Themes](https://rich.blog/fluid-typography-block-themes/)

---
