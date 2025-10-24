# 9. Fluid Spacing & Typography

## Goals

- Scale type and spacing smoothly across viewports.
- Reduce brittle breakpoint stacks; prefer fluid curves with sensible clamps.

## Typography

- Use `clamp(min, preferred, max)` to scale font sizes.
- Base on `rem`; define a typographic scale (e.g., 1.125 or 1.2 ratio).
- Maintain readable line length (45–85 chars) and line height (≈1.4–1.7).

```css
:root {
  /* Example scale */
  --step--1: clamp(0.875rem, 0.85rem + 0.2vw, 1rem);
  --step-0: clamp(1rem, 0.95rem + 0.5vw, 1.125rem);
  --step-1: clamp(1.125rem, 1rem + 1vw, 1.5rem);
}
h1 {
  font-size: var(--step-1);
}
```

## Spacing

- Prefer rem for space tokens; define a scale and expose via CSS vars or theme.json custom properties.
- Use fluid clamp for key blocks when helpful; otherwise scale via responsive presets in theme.json.

```css
:root {
  --space-2xs: clamp(0.25rem, 0.2rem + 0.3vw, 0.5rem);
  --space-xs: clamp(0.5rem, 0.4rem + 0.4vw, 0.75rem);
  --space-s: clamp(0.75rem, 0.6rem + 0.6vw, 1rem);
}
.section {
  padding-block: var(--space-s);
}
```

## Gutenberg / theme.json

- Use Theme JSON typography and spacing presets for consistent tokens.
- Avoid pixel-locked values; use presets + fluid scaling where appropriate.

## References

- LightSpeed: fluid spacing → <https://github.com/lightspeedwp/ls-handbooks/blob/main/docs/block-themes/fluid-spacing.md>
- LightSpeed: fluid typography → <https://github.com/lightspeedwp/ls-handbooks/blob/main/docs/block-themes/fluid-typography.md>
- CSS clamp intro: <https://css-tricks.com/linearly-scale-font-size-with-css-clamp-based-on-the-viewport/>
- MDN clamp: <https://developer.mozilla.org/en-US/docs/Web/CSS/clamp>
- 10up Gutenberg best practices: <https://gutenberg.10up.com/guides/handeling-block-spacing/>
