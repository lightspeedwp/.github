---
applyTo: "**/*.{php,html,json,css,scss,js,jsx,ts,tsx}"
description: "WordPress-specific development guidelines and best practices"
---

# WordPress Instructions

## Block Theme Development

### Theme.json Configuration
- Use `theme.json` as the single source of truth for design tokens
- Define color palettes, typography scales, and spacing units
- Configure block supports and custom CSS properties
- Version the schema appropriately (currently version 2)

### Full Site Editing (FSE)
- Embrace block-based template creation
- Use template parts for reusable components (header, footer, sidebar)
- Create block patterns for common content layouts
- Ensure all templates work with the Site Editor

### Block Patterns
- Create semantic and accessible block patterns
- Use proper pattern headers with title, slug, categories, and keywords
- Place patterns in logical category folders
- Include usage documentation in pattern comments

### Template Hierarchy
- Follow WordPress template hierarchy
- Use HTML templates for block themes
- Implement proper fallbacks for missing templates
- Test template inheritance and overrides

## WordPress Standards

### Accessibility
- Follow WCAG 2.1 AA guidelines
- Use semantic HTML elements
- Provide proper alt text for images
- Ensure keyboard navigation works
- Test with screen readers

### Internationalization (i18n)
- Use proper text domain: `ai-block-theme-template`
- Wrap all user-facing strings in translation functions
- Use `wp_enqueue_script()` with proper text domain for JavaScript
- Generate and include `.pot` files for translators

### Performance Optimization
- Optimize images and assets
- Minimize HTTP requests
- Use proper caching strategies
- Implement lazy loading where appropriate
- Monitor Core Web Vitals

### Security
- Sanitize and validate all user inputs
- Escape all output properly
- Use WordPress nonces for form security
- Follow WordPress security best practices
- Keep WordPress and dependencies updated

### SEO Best Practices
- Use semantic HTML structure
- Implement proper heading hierarchy
- Add structured data where appropriate
- Optimize meta descriptions and titles
- Ensure mobile responsiveness

### Testing Strategy
- Test across different WordPress versions
- Verify compatibility with popular plugins
- Test on various devices and screen sizes
- Validate HTML and CSS
- Check accessibility compliance
- Test performance metrics