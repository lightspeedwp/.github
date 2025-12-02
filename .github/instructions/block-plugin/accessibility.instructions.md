---
file_type: "instructions"
title: "Block Plugin Accessibility Instructions"
description: "Accessibility standards and practices for WordPress block plugin development."
version: "1.0.0"
last_updated: "2025-11-27"
author: "LightSpeedWP Team"
maintainer: "LightSpeedWP Team"
tags:
  - accessibility
  - a11y
  - block-plugin
  - wordpress
  - gutenberg
applyTo: "**/src/**/*.{js,jsx,tsx},**/blocks/**/*.php"
license: "GPL-3.0"
references:
  - path: ".github/instructions/wpcs/wpcs-accessibility.instructions.md"
    description: "WordPress accessibility coding standards"
  - path: ".github/instructions/block-plugin/blocks.instructions.md"
    description: "Block development guidelines"
---

# Block Plugin Accessibility Instructions

> ⚠️ **Scope Notice**: These instructions are intended for **WordPress block plugin repositories** within the `lightspeedwp` GitHub organisation. They should **not** be applied to the `lightspeedwp/.github` community health repository, as that repository does not contain WordPress code.

## Overview

These instructions focus on accessibility considerations specific to WordPress block plugins, including custom blocks, block controls, and editor UX.

## Block Editor Accessibility

### Block Controls

- Provide clear labels for all controls
- Use appropriate control types (TextControl, SelectControl, etc.)
- Include help text for complex controls
- Ensure keyboard navigation works in block toolbar
- Test with screen readers

### Block Toolbar

- Use IconButton components with aria-labels
- Group related controls logically
- Provide tooltips for icon-only buttons
- Test keyboard shortcuts
- Ensure focus management

### Inspector Controls

- Use PanelBody for logical grouping
- Provide clear section headings
- Include help text for settings
- Ensure all controls are keyboard accessible
- Test with screen readers

## Block Output Accessibility

### Semantic HTML

- Use appropriate HTML elements
- Don't use div when a semantic element exists
- Include proper ARIA roles when needed
- Test with HTML validators

### Dynamic Content

- Manage focus on content changes
- Provide loading states with ARIA live regions
- Ensure error messages are announced
- Test with screen readers

### Interactive Elements

- Use button element for buttons
- Include visible focus indicators
- Ensure keyboard accessibility
- Provide clear hover/focus states
- Test with keyboard-only navigation

## Form Blocks

### Labels and Instructions

- Associate labels with inputs properly
- Include required field indicators
- Provide clear error messages
- Use fieldset and legend for groups
- Test with screen readers

### Validation

- Provide inline validation feedback
- Announce errors to screen readers
- Ensure error messages are descriptive
- Allow users to fix errors easily
- Test error handling

## Media Blocks

### Images

- Provide alt text input in block controls
- Include guidance for writing alt text
- Support decorative image option
- Ensure image captions are accessible
- Test with screen readers

### Video/Audio

- Support captions and transcripts
- Include media controls
- Prevent autoplay by default
- Provide accessible player controls
- Test with assistive technologies

## Testing Requirements

### Editor Testing

- Test block insertion and configuration
- Test with keyboard-only navigation
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Test in different editor views (visual, code)
- Test block variations and transforms

### Frontend Testing

- Run automated accessibility tests
- Test with keyboard navigation
- Test with screen readers
- Test at different zoom levels
- Test in high-contrast mode

## Common Issues to Avoid

- Missing labels on form controls
- Icon-only buttons without aria-labels
- Poor focus management
- Non-keyboard-accessible controls
- Missing ARIA live regions for dynamic content
- Unclear error messages
- Non-semantic markup
- Poor color contrast
- Missing alt text inputs
- Inaccessible custom components

## WordPress Block API Considerations

### useBlockProps

- Always spread blockProps in save function
- Include proper className handling
- Ensure ARIA attributes are preserved
- Test with block variations

### InnerBlocks

- Provide accessible templates
- Ensure proper nesting
- Test with screen readers
- Maintain heading hierarchy

## References

- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [WordPress Accessibility Handbook](https://make.wordpress.org/accessibility/handbook/)
- [Gutenberg Accessibility](https://developer.wordpress.org/block-editor/how-to-guides/accessibility/)
- [WordPress Accessibility Coding Standards](.github/instructions/wpcs/wpcs-accessibility.instructions.md)
- [Block Development](.github/instructions/block-plugin/blocks.instructions.md)
