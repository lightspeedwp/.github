# Code Review Instructions

## Goals

Catch defects early, improve maintainability, and uphold accessibility and security standards.

## Reviewer Checklist

### Scope & Structure

- Focused PR with clear description
- Linked issues referenced
- Naming and headers follow convention

### Accessibility

- Keyboard navigation paths verified
- Semantic HTML used correctly
- Alt text present for images
- Colour contrast meets WCAG AA

### Security

- Output escaping applied (`esc_html`, `esc_attr`, etc.)
- Input sanitisation present
- Capabilities and nonce checks in place
- i18n functions wrap user-facing strings

### Performance

- No heavy re-renders or unnecessary JS
- Minimal CSS/JS footprint
- Lazy-load applied where appropriate
- No inline CSS; `theme.json` tokens only

### WordPress Standards

- Block locking applied appropriately
- WooCommerce patterns respect constraints
- Theme.json design tokens used

### Tests & Documentation

- Playwright/Jest/PHPUnit tests updated or added
- axe accessibility checks included
- README or pattern docs updated
- CHANGELOG entry prepared

### Release Readiness

- CI green
- No TODOs or FIXMEs left
- Before/after visuals included (for UI changes)

## Author Checklist (Pre-PR)

- [ ] Self-review completed
- [ ] Linters and tests pass locally
- [ ] Before/after screenshots included (if applicable)
- [ ] PR description explains the "why"
- [ ] Related issues linked
