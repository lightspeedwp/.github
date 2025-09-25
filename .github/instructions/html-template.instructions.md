---
name: "HTML Template"
about: "Guidelines for HTML template parts and block templates in any LightSpeed WordPress project."
title: "[Instructions] HTML Template"
description: "Guidelines for HTML template parts and block templates in any LightSpeed WordPress project."
author: "LightSpeedWP Team"
contributors:
  - name: "Ash Shaw"
    github: "ashleyshaw"
  - name: "LightSpeedWP"
    github: "lightspeedwp"
tags:
  - html
  - template
  - wordpress
  - accessibility
  - responsive
  - performance
categories:
  - documentation
  - instructions
  - guides
version: "1.0.0"
permalink: "/instructions/html-template"
license: "GPL-3.0"
type: "instructions"
mode: "agent"
applyTo: "**/*.html"
---

# HTML Template Instructions

## Block Template Structure

- Use semantic HTML elements (header, main, footer, section, article).
- Maintain proper nesting and hierarchy of block elements.
- Follow progressive enhancement principles for markup.
- Keep templates modular and reusable where possible.
- Test templates with both light and dark color schemes.

## Template Parts

- Store reusable components in the `parts/` directory.
- Use descriptive filenames that reflect the component's purpose.
- Keep template parts focused on a single responsibility.
- Use proper comments to document template structure.
- Prefer core blocks over custom HTML when possible.

## Accessibility

- Maintain proper heading hierarchy (h1-h6) in sequential order.
- Include appropriate ARIA roles and landmarks where needed.
- Ensure sufficient color contrast for all text elements.
- Provide alt text placeholders for images.
- Make interactive elements keyboard accessible.

## Responsive Design

- Design for mobile-first, then enhance for larger screens.
- Use fluid layouts rather than fixed pixel dimensions.
- Test templates at various viewport sizes.
- Ensure content readability at all screen sizes.
- Implement appropriate tap targets for touch devices.

## Block Attributes

- Use theme.json variables for spacing, colors, and typography.
- Apply consistent alignment and width attributes.
- Configure appropriate default block settings.
- Use block variations appropriately for different contexts.
- Test with different block attribute combinations.

## Performance

- Keep markup clean and minimal.
- Avoid deep nesting of blocks when possible.
- Optimize for First Contentful Paint (FCP).
- Consider loading strategies for media-heavy templates.
- Test template rendering performance.
