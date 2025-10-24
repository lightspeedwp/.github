# 1. Accessibility Coding Standards (WCAG 2.2)

LightSpeed targets **WCAG 2.2 Level AA** across products and content.

## WCAG 2.2 Layers

- **Principles**: Perceivable, Operable, Understandable, Robust.
- **Guidelines**: Human-centered rules that map to Success Criteria.
- **Success Criteria**: Testable checkpoints at A/AA/AAA.
- **Techniques**: Sufficient & advisory patterns to implement criteria.

## Practical Requirements

- **Semantics**: Use proper headings, lists, landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`).
- **Focus**: Visible focus states; logical tab order; no keyboard traps.
- **Forms**: Labels, descriptions, errors, required state; associate help text via `aria-describedby`.
- **Media**: Captions/transcripts for time-based media.
- **Colour**: Maintain contrast ratios; don’t rely on colour alone.
- **ARIA**: Only when native HTML cannot express semantics.
- **Motion**: Respect `prefers-reduced-motion`; avoid parallax/auto-play that can trigger vestibular issues.
- **Blocks/UI** (Gutenberg): follow block editor a11y guidance and test with screen readers.

## References

- [WordPress Coding Standards – Accessibility](https://github.com/WordPress/wpcs-docs/blob/master/wordpress-coding-standards/accessibility.md)
- [MDN: What is accessibility?](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/What_is_accessibility)
- [MDN: Accessibility — CSS and JavaScript](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/CSS_and_JavaScript)
- [WordPress Block Editor: Accessibility](https://developer.wordpress.org/block-editor/how-to-guides/accessibility/)
- [Gutenberg: Accessibility guide](https://github.com/WordPress/gutenberg/blob/trunk/docs/how-to-guides/accessibility.md)
