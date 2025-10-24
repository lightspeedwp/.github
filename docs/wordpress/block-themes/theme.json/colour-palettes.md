# Colour Palettes

Covers how to define and standardize colour palettes in theme.json for consistent theme switching, including best practices and pitfalls.

---

## Best practices

- Standardize slugs: `base`, `contrast`, `primary` to ensure consistent theme switching and user flow.
- Define in `settings.color.palette` to auto-generate CSS variables and `.has-*` classes.
- Treat slug changes as breaking. Blocks and patterns use generated classes (e.g. `.has-primary-color`, `.has-contrast-background-color`) and variables (e.g. `var(--wp--preset--color--primary)`). Renaming slugs to literal colour names like `green` will break styling when switching themes.

---

## Limitations

- Breaking slug names (like `green`) may result in broken styling when switching themes.

---

## Reference Links

- [Rich Tabor: Standardizing theme.json colors](https://rich.blog/standardizing-theme-json-colors/)
- [WordPress Dev Docs: theme.json colours and palettes](https://developer.wordpress.org/block-editor/how-to-guides/themes/theme-json/#colors)

---
