# INLINE-CSS.md

LightSpeedWP **CSS/SCSS inline documentation** standards.

## Principles

- Prefer **theme.json** for global styles in block themes; CSS for fine-tuning.
- Use **BEM naming** or a consistent utility approach.
- Co-locate comments with complex rules or intent, not obvious declarations.

## Section headers

```css
/* =====================================
   Component: Tour Card
   Purpose: Layout and state styles
   ===================================== */
```

## Rule comments

```css
.tour-card__price {
  /* Align currency glyphs across varying font metrics */
  font-variant-numeric: tabular-nums;
}
```

## Stylelint directives

- Avoid disabling rules. If necessary, **scope narrowly** and explain:

```css
/* stylelint-disable-next-line selector-max-specificity -- needs precise override */
.page-home .hero .cta { … }
```
