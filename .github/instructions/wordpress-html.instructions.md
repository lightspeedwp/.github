---
applyTo: ['**/*.html', '**/*.htm', '**/*.php']
description: "Enforce WordPress HTML standards and semantic markup."
last_updated: "2025-10-19"
version: "v1.0"
owners: ["LightSpeed Engineering"]
---

# Mission
Guide developers to write semantic, accessible HTML templates and PHP files that embed HTML.

# Language & Frameworks
- HTML5. When working within WordPress, leverage template parts, block patterns and `theme.json` to structure content.

# Project Structure
- Place template files under `templates/` or `partials/`.
- Use descriptive file names (e.g. `header.php`, `footer.php`, `archive.html`).

# Coding Standards
- Use valid, semantic markup; avoid presentational attributes (`align`, `bgcolor`).
- Ensure headings (`<h1>`–`<h6>`) follow a hierarchical order and reflect document structure.
- Wrap form controls with `<label>` elements and associate them using the `for` attribute.
- Provide `alt` attributes for images and only use ARIA attributes when native semantics are insufficient.
- Avoid inline styles and JavaScript; separate structure, presentation and behaviour.

# Testing & Quality
- Validate markup with tools such as the W3C HTML validator.
- Use accessibility testing tools (e.g. axe‑core) to catch missing labels and ARIA misuse.

# Performance & Security
- Escape dynamic content using appropriate PHP functions (`esc_html`, `esc_attr`, etc.).
- Avoid client‑side injection vulnerabilities; never trust user input directly.

# Documentation
- Comment complex template logic and describe the purpose of custom wrappers or ARIA landmarks.

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
version: "1.0.0"
permalink: "/instructions/html-template"
license: "MIT"
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
---

# HTML Template Instructions

## Block Template Structure
  related_links:
    - "https://developer.wordpress.org/themes/block-themes/templates/"
    - "https://developer.wordpress.org/themes/block-themes/template-parts/"
    - "https://developer.wordpress.org/block-editor/reference-guides/template-structure/"
    - "https://github.com/lightspeedwp/.github"
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

# Examples
```html
<!-- Good: semantic section and labelled form field -->
<section role="region" aria-labelledby="contact-heading">
  <h2 id="contact-heading">Contact Us</h2>
  <form action="/contact" method="post">
    <label for="email">Email address</label>
    <input id="email" type="email" name="email" required />
    <button type="submit">Submit</button>
  </form>
</section>
```

# Checklists
- [ ] Headings are used in order and never skipped.
- [ ] All form controls have associated labels.
- [ ] Dynamic content is properly escaped in PHP files.

# References
- https://developer.wordpress.org/coding-standards/wordpress-coding-standards/html/
