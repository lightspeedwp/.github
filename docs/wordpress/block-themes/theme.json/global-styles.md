# Global Styles and theme.json

Describes how to use theme.json for global styles, design tokens, and editor/front-end parity in block themes.

---

## Best Practices

- Use `theme.json` as the single source of truth for **site-wide styles** and editor/front-end consistency.
- Treat it as a **design system definition file** (colours, typography, spacing, layout, etc.).
- Define **design tokens** in `settings` (e.g., font sizes, spacing presets, custom line-heights).
- Use `styles` to apply global defaults, ensuring authors see the same result in both the Site Editor and front end.
- Leverage `style variations` within `theme.json` to offer alternate themes/skins without extra CSS files.
- Combine with **patterns** and **style variations** for modular theme composition.

```json
  "settings": {
    "custom": {
      "lineHeight": { "sm": 1.625, "md": 1.6875, "lg": 1.5 }
    }
  }
```

## When to use

- You want editor/front-end parity without bespoke CSS.
- You’re defining design tokens (colour, spacing, typography scales, line-height presets) for reuse across blocks.
- You need variables available to both theme CSS and block styles.
- You want sane defaults that site owners can override in the Site Editor.
- You’re migrating from classic themes and want to reduce reliance on the Customizer and ad-hoc CSS.

## When to use

- To establish **editor/front-end parity** without bespoke CSS.
- When defining **global variables** (colour, spacing, typography scales, line-height presets) for use across blocks.
- When migrating from **classic themes** and aiming to reduce reliance on the Customizer or ad-hoc CSS.
- To set **sane defaults** that site owners can override in the Site Editor.
- For building **leaner block themes** with fewer template files and minimal CSS.

---

## Limitations

- Deep customization may still require block-level overrides or PHP-based fallbacks.
- You’ll still need to use CSS (via `.has‑slug‑font‑size`) to apply some conditional logic like matching line height with font size. Class helpers like `.has-slug-font-size` may still be required (e.g. coupling font size and line height).
- Define `custom` variables for use in CSS, such as:

```json
  "settings": {
    "custom": {
      "lineHeight": { "sm": 1.625, "md": 1.6875, "lg": 1.5 }
    }
  }
```

- Not all core/third-party blocks respect every `theme.json` setting — test critical blocks carefully.
- Conditional logic is not supported; use CSS, variations, or block-specific styles for advanced cases.
- Per-breakpoint control is limited; prefer **fluid typography/spacing** over rigid breakpoints.
- Features vary by WP/Gutenberg version; confirm the **minimum supported version** for your theme.

---

## Tips for Full Site Editing

- **\*Shift from Templates to Tokens**: Instead of hardcoding layouts, block themes lean on `theme.json` + patterns.
- **Global Styles as the Backbone**: They serve as the connective tissue between tokens (colours, spacing, typography) and blocks/patterns.
- **Theme.json + Patterns = The Theme**: Rich emphasises that the modern WordPress theme is a combination of `theme.json` (rules/tokens) and block patterns (structure/layout).
- **Style Variations = Skins**: Entirely different looks can be shipped in one theme using variations defined in `theme.json`.
- **Lean, Composable Themes**: Avoid bloated CSS. Define reusable rules in JSON, use patterns to compose layouts, and let site owners customise via Global Styles UI.
- **Future-facing**: Themes are less about delivering static designs and more about providing a **system** users can adapt.

---

## Reference Links

- [WordPress Developer Resources](https://developer.wordpress.org/block-editor/how-to-guides/themes/global-settings-and-styles/)
- [Rich Tabor: Full Site Editing](https://rich.blog/full-site-editing/)
- [WordPress Developer Resources — Global Settings & Styles](https://developer.wordpress.org/block-editor/how-to-guides/themes/global-settings-and-styles/)
- [Mastering theme.json: You might not need CSS](https://developer.wordpress.org/news/2024/10/mastering-theme-json-you-might-not-need-css/)
- [Rich Tabor: WordPress 6.6 Section Styles](https://rich.blog/wordpress-6-6/)
- [Rich Tabor: Fluid Typography and Block Themes](https://rich.blog/fluid-typography-block-themes/)

---
