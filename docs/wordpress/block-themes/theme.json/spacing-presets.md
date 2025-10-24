# Spacing Presets

Spacing presets are reusable design tokens for margins, paddings, and gaps. They are defined in `theme.json` and exposed to the block editor, allowing designers and developers to apply consistent, scalable spacing across blocks and patterns.

---

## Purpose of Spacing Presets

- Establish a **consistent vertical rhythm**.
- Reduce design drift by reusing the same spacing tokens.
- Make spacing easy to adjust globally without editing individual blocks.
- Ensure themes remain **interchangeable** and predictable.

---

## Defining Presets in `theme.json`

Spacing presets are created using the `spacingSizes` property:

```json
"settings": {
  "spacing": {
    "spacingSizes": [
      {
        "slug": "20",
        "size": "0.75rem",
        "name": "Small"
      },
      {
        "slug": "30",
        "size": "1.5rem",
        "name": "Medium"
      },
      {
        "slug": "40",
        "size": "3rem",
        "name": "Large"
      }
    ]
  }
}
```

### Output CSS Variables

```css
--wp--preset--spacing--20: 0.75rem;
--wp--preset--spacing--30: 1.5rem;
--wp--preset--spacing--40: 3rem;
```

---

## Using Spacing Presets

Apply presets in `theme.json` styles:

```json
"styles": {
  "blocks": {
    "core/heading": {
      "spacing": {
        "margin": {
          "bottom": "var(--wp--preset--spacing--30)"
        }
      }
    }
  }
}
```

Apply within block patterns:

```html
<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|40"}}}} -->
<div class="wp-block-group">
  <!-- pattern content -->
</div>
<!-- /wp:group -->
```

---

## Best Practices

- **Slug naming**: use numeric slugs (`20`, `30`, `40`) for predictable ordering in the editor.
- **Editor clarity**: provide clear `name` labels ("Small", "Medium", "Large").
- **Token-first**: reference presets (`var:preset|spacing|30`) instead of hardcoding values.
- **Consistency**: define the **full range** of values, even if not all are used immediately.
- **Scalability**: align preset sizes with typography and layout scales.

---

## Limitations

- Presets must be **fully declared**; missing steps hide defaults unintentionally.
- `spacingSizes` and `spacingScale` can conflict if both are defined — control with `defaultSpacingSizes`.
- Not all core blocks support spacing presets yet; some still rely on hardcoded margins.

---

## Example: Combined Scale & Presets

```json
"settings": {
  "spacing": {
    "spacingScale": {
      "operator": "*",
      "increment": 1.5,
      "steps": 6,
      "unit": "rem"
    },
    "spacingSizes": [
      {
        "slug": "auto",
        "size": "auto",
        "name": "Auto"
      }
    ]
  }
}
```

This generates a system scale, with an additional “Auto” option for specific layouts.

---

## Key Takeaways

- **Presets = design tokens** for spacing.
- Use **numeric slugs** for consistent editor ordering.
- Apply spacing via **variables**, not hardcoded units.
- Pair with `blockGap` for section styles and layout consistency.

---

## References

- [Rich Tabor — Standardizing Spacing in theme.json](https://rich.blog/standardizing-theme-json-spacing/)
- [WordPress Developer Docs — Block Spacing](https://developer.wordpress.org/block-editor/how-to-guides/themes/theme-json/#spacing)
- [Make Core: Theme.json v3](https://make.wordpress.org/core/2024/06/19/theme-json-version-3/)

```

```
