# Standardising Colours, Spacing, and Typography in Block Themes

A predictable, token-based system for **colours, spacing, and typography** helps ensure consistency across design, WordPress editor UI, and front-end rendering. WordPress provides **default presets**, which can be enabled, overridden, or extended to match your design system.

## Colours & Slugs

### Core Semantic

- `base` → background
- `contrast` → text
- `primary` → brand/CTA

### Neutral Scale

- `neutral-0` → white
- `neutral-100` → lightest grey
- `neutral-200 … neutral-900` → progressively darker greys
- `neutral-900` → pure black

### Accent Scale

- `accent-100 … accent-900` to up to however many brand/utility accents you need.
- These can represent different **hues** or **tones** of your brand colour system.

---

### Example JSON Snippet

```json
{
  "$schema": "https://schemas.wp.org/wp/6.8/block.json",
  "version": 3,
  "settings": {
    "color": {
      "defaultPalette": false,
      "palette": [
        { "slug": "base", "name": "Base", "color": "#FFFFFF" },
        { "slug": "contrast", "name": "Contrast", "color": "#111111" },
        { "slug": "primary", "name": "Primary", "color": "#0A84FF" },

        { "slug": "neutral-0", "name": "Neutral 0", "color": "#FFFFFF" },
        { "slug": "neutral-100", "name": "Neutral 100", "color": "#F9FAFB" },
        { "slug": "neutral-200", "name": "Neutral 200", "color": "#F3F4F6" },
        { "slug": "neutral-300", "name": "Neutral 300", "color": "#E5E7EB" },
        { "slug": "neutral-400", "name": "Neutral 400", "color": "#D1D5DB" },
        { "slug": "neutral-500", "name": "Neutral 500", "color": "#9CA3AF" },
        { "slug": "neutral-600", "name": "Neutral 600", "color": "#6B7280" },
        { "slug": "neutral-700", "name": "Neutral 700", "color": "#4B5563" },
        { "slug": "neutral-800", "name": "Neutral 800", "color": "#1F2937" },
        { "slug": "neutral-900", "name": "Neutral 900", "color": "#111111" },

        { "slug": "accent-100", "name": "Accent 100", "color": "#0A84FF" },
        { "slug": "accent-200", "name": "Accent 200", "color": "#3399FF" },
        { "slug": "accent-300", "name": "Accent 300", "color": "#66B2FF" },
        { "slug": "accent-400", "name": "Accent 400", "color": "#99CCFF" },
        { "slug": "accent-500", "name": "Accent 500", "color": "#CCE5FF" },
        { "slug": "accent-600", "name": "Accent 600", "color": "#FF7A59" },
        { "slug": "accent-700", "name": "Accent 700", "color": "#FF9B80" },
        { "slug": "accent-800", "name": "Accent 800", "color": "#FFBCA6" },
        { "slug": "accent-900", "name": "Accent 900", "color": "#FFDCD2" }
      ]
    }
  }
}
```

---

## Best Practices

- **Extend in 100-steps** for predictable scaling.
- **Group hues into bands** (e.g., `accent-100` → `accent-500` for blues, `accent-600` → `accent-900` for warm tones).
- **Don’t rename slugs** once published — just change values to update brand colours.
- **Use neutrals for UI foundations**, **accents for highlights/brand identity**.

---

## Font Sizes & Slugs

### WordPress Default Font Size Slugs

WordPress ships with four core font sizes:

- `small`
- `medium`
- `large`
- `x-large`

Perfect — let’s extend the **WordPress default font sizes** into a numeric scale (to match spacing & colour). You had earlier asked for **extra sizes** like `x-tiny`, `tiny`, `huge`, `gigantic`. I’ve translated these into a scale using **multiples of 8px** (so they map cleanly to `rem` values, e.g. `16px = 1rem` if base = 16px).

---

### Default WP Font Sizes (approx)

- `small` → 13px
- `medium` → 20px (default body size = 16px)
- `large` → 36px
- `x-large` → 42px

(These are defaults, but the slugs can vary across themes.)

---

### Recommended Extended Scale (multiples of 8px)

| Slug            | Label    | px size | rem (base 16px) |
| --------------- | -------- | ------- | --------------- |
| `font-size-100` | Tiny     | 12px    | 0.75rem         |
| `font-size-200` | Base     | 16px    | 1rem            |
| `font-size-300` | Small    | 20px    | 1.25rem         |
| `font-size-400` | Medium   | 24px    | 1.5rem          |
| `font-size-500` | Large    | 32px    | 2rem            |
| `font-size-600` | X-Large  | 40px    | 2.5rem          |
| `font-size-700` | Huge     | 48px    | 3rem            |
| `font-size-800` | Gigantic | 64px    | 4rem            |
| `font-size-900` | Colossal | 80px    | 5rem            |

👉 You can keep extending in increments of 100 (e.g. `font-size-1000` for 96px) if your design system needs it.

---

### Example theme.json Partial

```json
{
  "$schema": "https://schemas.wp.org/wp/6.8/block.json",
  "version": 3,
  "settings": {
    "typography": {
      "fontSizes": [
        { "slug": "font-size-100", "size": "0.75rem", "name": "Tiny" },
        { "slug": "font-size-200", "size": "1rem", "name": "Base" },
        { "slug": "font-size-300", "size": "1.25rem", "name": "Small" },
        { "slug": "font-size-400", "size": "1.5rem", "name": "Medium" },
        { "slug": "font-size-500", "size": "2rem", "name": "Large" },
        { "slug": "font-size-600", "size": "2.5rem", "name": "X-Large" },
        { "slug": "font-size-700", "size": "3rem", "name": "Huge" },
        { "slug": "font-size-800", "size": "4rem", "name": "Gigantic" },
        { "slug": "font-size-900", "size": "5rem", "name": "Colossal" }
      ]
    }
  }
}
```

---

### Best Practices for Font Size Values

- **Numeric slugs** keep naming scalable and consistent (`font-size-100 … 900`).
- **Multiples of 8px** ensure harmony with spacing scales.
- Always **keep slugs stable** → you can change size values without breaking references.
- Use **semantic naming** in addition to numeric (helps editors know what’s “Huge” vs “Tiny”).
- Pair with **fluid typography** in WP 6.6+ so these sizes scale across devices.

---

## Spacing Sizes & Slugs

### WordPress Default Spacing Slugs

The default spacing scale is numeric and increments by 10:

- `spacing-10`
- `spacing-20`
- `spacing-30`
- `spacing-40`
- `spacing-50`
- `spacing-60`

(These correspond to approximate values from `0.125rem` to `3rem`, though values may vary by theme implementation.)

### Extended Spacing Scale

We extend this with additional slugs to cover larger gaps, while **keeping naming consistent**:

- `spacing-70` → `3.5rem` (56px)
- `spacing-80` → `4rem` (64px)
- `spacing-90` → `4.5rem` (72px)
- `spacing-100` → `5rem` (80px)

## Extended Spacing Scale

We extend this with additional slugs to cover larger gaps, while **keeping naming consistent**:

- `spacing-70` → `3.5rem` (56px)
- `spacing-80` → `4rem` (64px)
- `spacing-90` → `4.5rem` (72px)
- `spacing-100` → `5rem` (80px)

---

### Example JSON

```json
"spacing": {
  "spacingScale": {
    "steps": [
      { "slug": "spacing-10", "size": "0.625rem", "name": "10px" },
      { "slug": "spacing-20", "size": "1.25rem", "name": "20px" },
      { "slug": "spacing-30", "size": "1.875rem", "name": "30px" },
      { "slug": "spacing-40", "size": "2.5rem", "name": "40px" },
      { "slug": "spacing-50", "size": "3.125rem", "name": "50px" },
      { "slug": "spacing-60", "size": "3.5rem", "name": "56px" },
      { "slug": "spacing-70", "size": "3.75rem", "name": "60px" },
      { "slug": "spacing-80", "size": "4rem", "name": "64px" },
      { "slug": "spacing-90", "size": "4.5rem", "name": "72px" },
      { "slug": "spacing-100", "size": "5rem", "name": "80px" }
    ]
  }
}
```

---

## Best Practices for Naming Conventions

### 1. **Spacing**

- Use either:
  - `spacingScale`: system-generated (`20`, `30`, `40`…)
  - `spacingSizes`: manual with fluid units (`s`, `m`, `l`)
- Always keep **numeric slugs in sequence** (`20`, `30`, `40`…), since the editor orders presets by slug.
- If semantic slugs are preferred (`s`, `m`, `l`), use them consistently across all blocks.

✅ Recommendation: Stick with numeric scales (`20–80`) for compatibility with WordPress defaults, but allow semantic naming at the design system layer (e.g. mapping `space.m → spacing-40`).

---

### 2. **Typography**

- WordPress default slugs: `small`, `medium`, `large`, `x-large`.
- Rich Tabor recommends a **numbered scale** (`xs`, `s`, `m`, `l`, `xl`, `xxl`) to create predictable progression.
- FullSiteEditing.com supports both, but stresses aligning naming with design tokens in Figma.

✅ Recommendation: Retain WP defaults for editor familiarity, but override values with your scale (e.g. keep slug `large` but define it as `clamp(1.5rem, 2vw, 2rem)`).

---

### 3. **Colours**

- WordPress defaults (`black`, `white`, `primary`, `secondary`) may not align with brand palettes.
- Use **semantic naming** (`brand-primary`, `brand-accent`, `neutral-100`) instead of hardcoded names (`blue`, `red`).
- This ensures **future-proofing** if brand colours shift.
- Rich Tabor emphasises using **systematic palettes**: base colours + tints/shades.

✅ Recommendation: Keep `base` colours minimal (3–5), then extend with `neutral` and `accent` palettes. Always prefer semantic over literal names.

---

## Strategy: Enable Defaults, Override Values

The **hybrid approach** is currently best practice:

1. **Enable WordPress defaults** for spacing, typography, and colour slugs.
2. **Override the default values** with your design system tokens.
   - e.g. Keep `spacing-30`, but change from `1.25rem` → `clamp(1rem, 2vw, 1.5rem)`.
   - Keep `font-size-large`, but redefine it via a fluid scale.
   - Keep `primary`, but remap it to `brand-primary` (#0047AB).
3. **Document the mapping** between Figma tokens and WordPress slugs so developers/designers stay aligned.

---

## General Advice

- **Consistency over creativity**: don’t reinvent slugs across projects.
- **Keep editor UX predictable**: preserve WP defaults where possible so editors recognise controls.
- **Token-first thinking**: Figma variables → theme.json presets → CSS variables.
- **Avoid mixing too many systems**: pick `spacingScale` OR `spacingSizes` globally, not both.
- **Future-proof**: semantic naming ensures flexibility for rebrands.

---

## References

- Rich Tabor: [Standardizing theme.json spacing](https://rich.blog/standardizing-theme-json-spacing/)
- Rich Tabor: [Standardizing theme.json colours](https://rich.blog/standardizing-theme-json-colors/)
- Rich Tabor: [Standardizing theme.json fonts sizes](https://rich.blog/standardizing-theme-json-font-sizes/)
- Rich Tabor: [Fluid type scale in theme.json](https://rich.blog/fluid-type-scale-theme-json/)
- Rich Tabor: [Standardizing theme.json colours](https://rich.blog/standardizing-theme-json-colors/)
- FullSiteEditing.com: [Global Styles & theme.json](https://fullsiteediting.com/)
- WordPress Developer Docs: [theme.json reference](https://developer.wordpress.org/themes/global-settings-and-styles/)
- <https://developer.wordpress.org/themes/global-settings-and-styles/settings/spacing/>
- <https://developer.wordpress.org/themes/global-settings-and-styles/settings/typography/>
- <https://developer.wordpress.org/themes/global-settings-and-styles/settings/color/>

---
