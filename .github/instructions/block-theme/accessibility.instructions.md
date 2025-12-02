---
file_type: "instructions"
title: "Block Theme Accessibility Instructions"
description: "Accessibility standards and practices for WordPress block theme development."
version: "1.0.0"
last_updated: "2025-11-27"
author: "LightSpeedWP Team"
maintainer: "LightSpeedWP Team"
tags:
  - accessibility
  - a11y
  - block-theme
  - wordpress
  - wcag
applyTo: "**/patterns/**/*.php,**/templates/**/*.html,**/parts/**/*.html"
license: "GPL-3.0"
references:
  - path: ".github/instructions/wpcs/wpcs-accessibility.instructions.md"
    description: "WordPress accessibility coding standards"
  - path: ".github/instructions/block-theme/pattern-development.instructions.md"
    description: "Pattern development guidelines"
---

# Block Theme Accessibility Instructions

> ⚠️ **Scope Notice**: These instructions are intended for **WordPress block theme repositories** within the `lightspeedwp` GitHub organisation. They should **not** be applied to the `lightspeedwp/.github` community health repository, as that repository does not contain WordPress code.

## Overview

These instructions focus on accessibility considerations specific to WordPress block themes, including patterns, templates, and template parts.

## Patterns Accessibility

### Heading Hierarchy

- Maintain proper heading hierarchy within patterns (h2, h3, h4)
- Never skip heading levels
- Document expected heading level in pattern comments
- Test patterns in various template contexts

### Image Accessibility

- Provide meaningful alt text placeholders
- Use empty alt="" for decorative images
- Include guidance for editors in pattern comments
- Test with screen readers

### Color Contrast

- Ensure text meets WCAG AA contrast requirements (4.5:1)
- Test all color combinations from theme.json
- Provide high-contrast alternatives when needed
- Consider both light and dark mode

### Keyboard Navigation

- Ensure all interactive elements are keyboard accessible
- Test tab order makes logical sense
- Provide visible focus indicators
- Avoid keyboard traps

## Template Accessibility

### Landmark Regions

- Use proper HTML5 semantic elements
- Include skip links for main content
- Ensure single main landmark per page
- Use nav elements for navigation menus

### Focus Management

- Manage focus on dynamic content changes
- Provide focus indicators on all interactive elements
- Test with keyboard-only navigation
- Ensure logical tab order

### ARIA Labels

- Use ARIA landmarks appropriately
- Provide aria-labels for navigation regions
- Don't override native semantics unnecessarily
- Test with screen readers (NVDA, JAWS, VoiceOver)

## Template Parts Accessibility

### Navigation Menus

- Use nav element with aria-label
- Provide current page indicators
- Ensure submenu accessibility
- Test with keyboard and screen readers

### Headers and Footers

- Use proper header and footer elements
- Include site title and description
- Ensure social media links have descriptive text
- Test with assistive technologies

## Testing Requirements

### Automated Testing

- Run axe DevTools on all templates
- Use WAVE browser extension
- Check with Lighthouse accessibility audit
- Validate HTML for semantic correctness

### Manual Testing

- Test with keyboard-only navigation
- Test with screen readers (multiple browsers)
- Test with browser zoom (200%, 400%)
- Test in high-contrast mode

## Common Issues to Avoid

- Missing alt text on images
- Poor color contrast
- Skipped heading levels
- Missing form labels
- Unclear link text ("click here")
- Non-semantic markup
- Missing ARIA labels on navigation
- Keyboard traps
- Hidden content not properly marked
- Autoplay media without controls

## References

- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [WordPress Accessibility Handbook](https://make.wordpress.org/accessibility/handbook/)
- [WordPress Accessibility Coding Standards](.github/instructions/wpcs/wpcs-accessibility.instructions.md)
- [Pattern Development](.github/instructions/block-theme/pattern-development.instructions.md)
