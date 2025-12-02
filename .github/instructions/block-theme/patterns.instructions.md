---
file_type: "instructions"
title: "Block Pattern Development Instructions"
description: "Comprehensive guide for developing reusable block patterns in LightSpeed WordPress projects."
version: "1.0.0"
last_updated: "2025-11-27"
author: "LightSpeedWP Team"
maintainer: "LightSpeedWP Team"
tags:
  - pattern
  - wordpress
  - block
  - template
  - instructions
applyTo: "**/patterns/**/*.php"
license: "GPL-3.0"
---

# Block Pattern Development Instructions

> ⚠️ **Scope Notice**: These instructions are intended for **WordPress block theme repositories** within the `lightspeedwp` GitHub organisation. They should **not** be applied to the `lightspeedwp/.github` community health repository, as that repository does not contain WordPress code.

## Pattern Structure

- Use descriptive comments to document each section of the pattern.
- Follow a logical structure with clear parent-child relationships.
- Group related blocks using the Group block where appropriate.
- Use appropriate block variations based on content needs.
- Test pattern across different viewport sizes.

## Registration

- Register patterns using the `register_block_pattern()` function.
- Use consistent naming with the format: `lsx/[category]-[name]`.
- Provide meaningful category and keywords for pattern discovery.
- Set appropriate viewportWidth based on the pattern's design.
- Include a descriptive title and description for the pattern library.

### Advanced Pattern Assignment

You can assign patterns to specific templates, post types, and block types using pattern file headers:

- **Assign to Post Types:**
  - Add a `Post Types:` header (comma-separated) to make a pattern available for specific post types (e.g., `Post Types: page, post`).
- **Assign to Block Types:**
  - Add a `Block Types:` header (e.g., `Block Types: core/post-content`) to make a pattern available for a specific block context (such as starter page patterns).
- **Assign to Template Types:**
  - Add a `Template Types:` header (comma-separated) to associate a pattern with specific templates (e.g., `Template Types: front-page, home`).
  - Optionally, add `Inserter: no` to hide the pattern from the inserter and only show it in the template creation modal.

#### Example: Starter Page Pattern

```php
/**
 * Title: Example Page
 * Slug: yourtheme/example-page
 * Categories: page
 * Block Types: core/post-content
 * Post Types: page
 * Viewport width: 1376
 */
```

#### Example: Template Pattern

```php
/**
 * Title: Home Template
 * Slug: yourtheme/home-template
 * Template Types: front-page, home
 * Viewport width: 1376
 * Inserter: no
 */
```

#### Supported Template Types

Common values for `Template Types:` include: `index`, `home`, `front-page`, `singular`, `single`, `page`, `archive`, `author`, `category`, `taxonomy`, `date`, `tag`, `attachment`, `search`, `privacy-policy`, `404`.

### Usage in Templates and Template Parts

- You can include a pattern directly in a template or template part using the `wp:pattern` block:

```html
<!-- wp:pattern {"slug":"yourtheme/home-template"} /-->
```

- This allows you to reuse patterns across templates and template parts, reducing duplication and improving maintainability.

For more, see:

- [WordPress Patterns Documentation](https://developer.wordpress.org/themes/patterns/)
- [Starter Patterns](https://developer.wordpress.org/themes/patterns/starter-patterns/)
- [Usage in Templates](https://developer.wordpress.org/themes/patterns/usage-in-templates/)

## Authoring Best Practices

- Define **use case** and **user value** first.
- Provide **keywords**, **categories**, **viewport**-aware layouts.
- Prefer **synced patterns** for reusable UX; provide good defaults.
- Use design tokens via `theme.json`; avoid inline styles when possible.

## Content Strategy

- Create patterns with placeholder content that makes sense.
- Use realistic example text rather than lorem ipsum where possible.
- Provide guidance for customization in pattern comments.
- Consider different use cases and content variations.
- Ensure patterns maintain their design integrity when content changes.
- Placeholder copy that instructs editors; no lorem ipsum.
- Ensure headings order, lists, and image alt texts.
- Provide mobile-first responsive behaviour.

## Styling

- Use theme.json variables exclusively for colors, typography, and spacing.
- Avoid inline styles or custom CSS within patterns.
- Apply consistent spacing throughout the pattern.
- Use predefined block styles rather than custom styles when available.
- Test patterns with different color schemes (light/dark).

## Accessibility

- Maintain proper heading hierarchy within patterns.
- Provide alt text placeholders for all images.
- Ensure sufficient color contrast for text elements.
- Make interactive elements keyboard accessible.
- Test patterns with screen readers.

## Performance

- Optimize image usage within patterns.
- Avoid unnecessary nesting of blocks.
- Keep markup clean and minimal.
- Consider the performance impact of complex patterns.
- Test rendering performance on various devices.

## Reusability

- Design patterns to be reusable across different contexts.
- Create variations of patterns for different use cases when appropriate.
- Document pattern dependencies or requirements.
- Consider how patterns will work with different themes.
- Test patterns in various page templates and contexts.

## Delivery

- Add pattern previews in docs; include screenshot.
- Provide transforms or variations if applicable.
- Include teardown instructions (how to remove/replace safely).

## References

- [WordPress Patterns Documentation](https://developer.wordpress.org/themes/patterns/)
- [Block Pattern Development](.github/instructions/block-theme/pattern-development.instructions.md)
- [WordPress Coding Standards](.github/instructions/wpcs.instructions.md)
