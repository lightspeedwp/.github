---
title: "WordPress Development Instructions"
description: "Comprehensive WordPress development standards, best practices, and technical guidelines for LightSpeedWP projects."
version: "v1.0"
last_updated: "2025-11-24"
file_type: "documentation"
owners: ["lightspeedwp/maintainers"]
tags: ["wordpress", "block-themes", "patterns", "blocks", "wcag"]
---

# WordPress Development Instructions Directory

This folder contains comprehensive guidelines and standards for WordPress development, block theme creation, and WordPress Coding Standards compliance across all LightSpeed projects.

## Instruction Categories

### Core WordPress Development

- **WordPress General** - `wordpress.instructions.md`
  - General WordPress development principles
  - Best practices and conventions

- **WordPress PHP** - `php-wordpress.instructions.md`
  - WordPress-specific PHP coding standards
  - Security, sanitization, and WordPress APIs

- **WordPress PHP Docs** - `wpcs-php-docs.instructions.md`
  - PHP DocBlock documentation standards
  - WordPress documentation conventions

### Block Theme & Pattern Development

- **Block Patterns** - `patterns.instructions.md`
  - Creating reusable block patterns
  - Pattern registration and organization

- **Pattern Development** - `pattern-development.instructions.md`
  - Comprehensive guide for pattern creation
  - Accessibility and performance

- **Blocks General** - `blocks.instructions.md`
  - Block development principles

- **Block JSON** - `block-json.instructions.md`
  - `block.json` configuration standards

- **PHP Blocks** - `php-block.instructions.md`
  - PHP block implementation

- **Single Block Plugin** - `single-block-plugin.instructions.md`
  - Creating standalone block plugins

- **Theme JSON** - `theme-json.instructions.md`
  - `theme.json` configuration for block themes

### WordPress Coding Standards (WPCS)

#### General Standards

- **WPCS Overview** - `index.md`
  - Overview of all WordPress Coding Standards

#### Language-Specific Standards

- **PHP Standards** - `wpcs-php.instructions.md`
  - PHP-specific WPCS rules

- **JavaScript** - `wpcs-javascript.instructions.md`
  - JavaScript coding standards

- **JS Documentation** - `wpcs-js-docs.instructions.md`
  - JavaScript JSDoc standards

- **CSS Standards** - `wpcs-css.instructions.md`
  - CSS coding standards

- **HTML Standards** - `wpcs-html.instructions.md`
  - HTML markup standards

### Specialized Topics

- **Accessibility (WCAG)** - `wpcs-accessibility.instructions.md`
  - WordPress accessibility best practices
  - WCAG compliance for block themes

## Structure Overview

```
.github/instructions/wordpress/
├── README.md                    (this file)
├── index.md                     (WPCS overview)
├── wordpress.instructions.md    (general WP development)
├── php-wordpress.instructions.md
├── wordpress-php-docs.instructions.md
├── blocks.instructions.md
├── block-json.instructions.md
├── php-block.instructions.md
├── single-block-plugin.instructions.md
├── patterns.instructions.md
├── pattern-development.instructions.md
├── theme-json.instructions.md
├── wpcs-accessibility.instructions.md
├── wpcs-css.instructions.md
├── wpcs-html.instructions.md
├── wpcs-javascript.instructions.md
├── wpcs-js-docs.instructions.md
└── wpcs-php.instructions.md
```

## Quick Start Guides

### For Theme Development

1. Start with: `wordpress.instructions.md`
2. Follow: `theme-json.instructions.md`
3. Build patterns: `pattern-development.instructions.md`
4. Create blocks: `php-block.instructions.md` or `blocks.instructions.md`

### For Block Plugins

1. Reference: `single-block-plugin.instructions.md`
2. Use: `block-json.instructions.md`
3. Implement: `php-block.instructions.md`
4. Document: `wpcs-js-docs.instructions.md`

### For Pattern Creation

1. Learn: `patterns.instructions.md`
2. Build: `pattern-development.instructions.md`
3. Test: Reference testing standards
4. Document: Follow documentation standards

### For Code Quality

1. PHP: `php-wordpress.instructions.md`
2. JavaScript: `wpcs-javascript.instructions.md`
3. CSS: `wpcs-css.instructions.md`
4. HTML: `wpcs-html.instructions.md`
5. Accessibility: `wpcs-accessibility.instructions.md`

## WordPress Coding Standards (WPCS)

All WordPress code must comply with official [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/):

### Language Coverage

| Language | Standard File | Coverage |
|---|---|---|
| **PHP** | `wpcs-php.instructions.md` | `.php` files |
| **JavaScript** | `wpcs-javascript.instructions.md` | `.js, .jsx` files |
| **CSS** | `wpcs-css.instructions.md` | `.css, .scss` files |
| **HTML** | `wpcs-html.instructions.md` | `.html` files |

### Key Principles

- **Security**: Always escape output, sanitize input, validate data
- **Performance**: Optimize database queries, use caching appropriately
- **Accessibility**: WCAG 2.2 AA compliance
- **Internationalization**: Use `_e()`, `__()` for translatable strings
- **Best Practices**: Follow WordPress conventions and APIs

## Block Theme Development

### Key Standards

✅ **Must Do**:

- Use native block components
- Leverage `theme.json` for design tokens
- Follow block pattern conventions
- Ensure WCAG compliance
- Test with accessibility tools

❌ **Avoid**:

- Custom CSS when `theme.json` can handle it
- Inline styles
- Non-semantic HTML
- Inaccessible interactions
- Hardcoded strings (not translatable)

## File Types & Standards

| File Type | Standards | Tools |
|---|---|---|
| `*.php` | WPCS PHP, Security | PHPCS, phpstan |
| `*.js` | WPCS JS, ESLint | ESLint, Prettier |
| `*.css` | WPCS CSS, Stylelint | Stylelint, Prettier |
| `*.html` | WPCS HTML, Semantic | html-validate, Prettier |
| `block.json` | JSON Schema | Schema validation |
| `theme.json` | JSON Schema | Schema validation |

## Testing WordPress Code

### Automated Testing

```bash
# PHP Standards
composer lint

# JavaScript
npm run lint:js

# CSS
npm run lint:css

# Accessibility
npm run audit:a11y
```

### Manual Testing

- Browser testing (Chrome, Firefox, Safari)
- Screen reader testing (NVDA, VoiceOver)
- Keyboard navigation testing
- Mobile responsiveness testing

## Integration Points

WordPress instructions are integrated with:

- `.github/instructions/coding-standards.instructions.md` - Main coding standards
- `.github/instructions/a11y.instructions.md` - Accessibility guidelines
- `.github/instructions/linting.instructions.md` - Linting standards
- `.github/workflows/lint.yml` - CI/CD workflow
- GitHub Copilot Chat - AI assistance

## Common Tasks

### Create a Block Theme

1. Create `theme.json` following `theme-json.instructions.md`
2. Set up design tokens (colors, typography, spacing)
3. Create block patterns using `pattern-development.instructions.md`
4. Add custom blocks using `php-block.instructions.md`
5. Test accessibility with `wpcs-accessibility.instructions.md`

### Build a Custom Block

1. Start with `block-json.instructions.md` - Define block.json
2. Follow `php-block.instructions.md` - Server-side rendering
3. Use `wpcs-javascript.instructions.md` - Client-side code
4. Reference `wpcs-accessibility.instructions.md` - Ensure a11y

### Create Block Patterns

1. Use `pattern-development.instructions.md` - Full guide
2. Follow `patterns.instructions.md` - Organization
3. Ensure `wpcs-html.instructions.md` - Semantic markup
4. Test with `wpcs-accessibility.instructions.md`

## Best Practices

### Do's ✅

- Use native WordPress components
- Follow `theme.json` patterns
- Escape and sanitize properly
- Use WordPress hooks and filters
- Test with screen readers
- Use semantic HTML
- Make patterns reusable

### Don'ts ❌

- Don't hardcode styles
- Don't inline styles in templates
- Don't skip sanitization
- Don't use non-semantic HTML
- Don't forget internationalization
- Don't ignore accessibility
- Don't duplicate code

## Resources

### Official WordPress Documentation

- [Coding Standards](https://developer.wordpress.org/coding-standards/)
- [Plugin Handbook](https://developer.wordpress.org/plugins/)
- [Theme Handbook](https://developer.wordpress.org/themes/)
- [Block Editor Handbook](https://developer.wordpress.org/block-editor/)

### External References

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [Web.dev Learning](https://web.dev/)
- [MDN Web Docs](https://developer.mozilla.org/)

---

For questions or updates, see [Coding Standards](../coding-standards.instructions.md) or the official [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/).
