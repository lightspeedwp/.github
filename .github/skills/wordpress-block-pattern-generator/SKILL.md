---
name: wordpress-block-pattern-generator
description: >
  Generate production-ready WordPress block patterns with accessibility (WCAG 2.1 AA),
  proper spacing presets, BEM naming, and integration with WooCommerce, LifterLMS,
  and ACF custom fields. Use when creating block patterns, building query loops
  for custom post types, designing hero sections, implementing taxonomy filters,
  or building accessible card components with custom field integration.
license: MIT
compatibility: Requires understanding of WordPress block theme structure
metadata:
  version: "1.0.0"
  author: lightspeedwp
  tags: wordpress, blocks, patterns, accessibility
---

# WordPress Block Pattern Generator

## Purpose

Generate production-ready WordPress block patterns following specification-driven development with accessibility (WCAG 2.1 AA), proper spacing using WordPress presets, BEM naming conventions, and seamless integration with WooCommerce, LifterLMS, and custom post types via ACF.

## Core Capabilities

- Generate WordPress block patterns with proper block markup
- Integrate ACF custom fields using display field blocks
- Create responsive query loops for custom post types
- Build accessible card components (WCAG 2.1 AA compliance)
- Implement WooCommerce product displays with ratings
- Design LifterLMS course cards with enrollment CTAs
- Apply WordPress spacing preset system
- Follow BEM CSS naming conventions
- Optimize for performance (lazy loading, responsive images)

## Quick Start Workflow

1. **Gather Context** - Identify companion plugin, custom post types, design tokens
2. **Review Guidelines** - Access spacing system, color palette, typography
3. **Generate Pattern** - Create block markup with proper attributes
4. **Validate Output** - Check block syntax, PHP syntax, accessibility
5. **Test Integration** - Verify in WordPress block editor

## Information Needed

Before generating patterns, gather:

### Plugin & Content Details
- Theme companion plugin name and purpose
- Custom post types and slugs
- Custom taxonomies and hierarchies
- ACF field groups and field names

### Design System
- Guidelines directory path (e.g., `guidelines/`, `.github/guidelines/`)
- Spacing preset system (numeric or semantic)
- Color palette and contrast requirements
- Typography scale and font families
- Component naming conventions (BEM, ITCSS)
- Breakpoint values

For detailed setup guidance, see [Setup Guide](references/SETUP-GUIDE.md).

## Common Pattern Types

### Hero Sections
- Full-width backgrounds with overlay text
- Call-to-action buttons
- Responsive spacing and typography

### Query Loops
- Custom post type archives
- Taxonomy filtering
- ACF field display

### Card Components
- Product cards (WooCommerce)
- Course cards (LifterLMS)
- Custom post type cards with ACF fields

### Navigation & CTAs
- Social media links
- Newsletter signup forms
- Taxonomy filters

## Validation Checklist

After generating a pattern:

- [ ] Block comments properly closed (`-->` not `>`)
- [ ] All blocks have matching closing tags
- [ ] JSON attributes valid (no trailing commas)
- [ ] PHP syntax correct (`php -l pattern-file.php`)
- [ ] Pattern loads in WordPress editor without errors
- [ ] Accessibility: proper headings, alt text, ARIA labels
- [ ] Responsive: works on mobile, tablet, desktop
- [ ] Performance: images lazy-loaded, scripts conditional

For detailed validation rules and testing procedures, see [Validation Guide](references/VALIDATION.md).

## Code Conversion Guides

When converting from React/TSX to WordPress blocks:

- **Background Images**: See [Conversion Guides](references/CONVERSION-GUIDES.md#background-images)
- **Drop Shadows**: See [Conversion Guides](references/CONVERSION-GUIDES.md#drop-shadows)
- **Advanced Effects**: See [Conversion Guides](references/CONVERSION-GUIDES.md#advanced-effects)

## Best Practices

- Use WordPress spacing presets, not hardcoded values
- Follow BEM naming for custom CSS classes
- Ensure 4.5:1 contrast ratio minimum (WCAG 2.1 AA)
- Implement proper heading hierarchy (h1 → h2 → h3)
- Add descriptive alt text for all images
- Use semantic HTML elements
- Enable keyboard navigation for interactive elements

## Examples

For complete pattern examples and code samples, see:
- [Setup Guide](references/SETUP-GUIDE.md) - Information gathering workflow
- [Validation Guide](references/VALIDATION.md) - Testing procedures
- [Conversion Guides](references/CONVERSION-GUIDES.md) - TSX to WordPress conversions
