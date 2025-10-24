---
applyTo: "**/*.php"
description: "WordPress PHP coding standards and theme conventions"
---

# PHP / WordPress Instructions

## WordPress Coding Standards

- Follow WordPress Coding Standards (PHPCS) strictly
- Use proper WordPress naming conventions
- All functions must be prefixed with `ai_block_theme_` or use the theme's text domain
- Use WordPress hooks and filters appropriately

## Theme Development Guidelines

### Function Naming
- Prefix all custom functions with `ai_block_theme_`
- Use descriptive function names that explain their purpose
- Follow snake_case naming convention for functions

### File Organization
- Use `inc/` directory for modular includes
- Require includes in `functions.php` with proper path handling
- Group related functionality in separate files

### WordPress APIs
- No direct database queries; always use WordPress APIs
- Use `get_theme_mod()` for customizer options
- Use `wp_enqueue_script()` and `wp_enqueue_style()` for assets
- Utilize WordPress hooks: `wp_head`, `wp_footer`, `init`, etc.

### Security Best Practices
- Escape all output with appropriate functions (`esc_html()`, `esc_attr()`, `esc_url()`)
- Sanitize all input data
- Use nonces for form submissions
- Validate and sanitize user inputs

### Performance
- Minimize database queries
- Use transients for expensive operations
- Optimize asset loading with conditional enqueuing
- Implement proper caching strategies

### Block Theme Specific
- Use `theme.json` for theme configuration
- Implement block patterns with proper headers
- Follow FSE (Full Site Editing) best practices
- Ensure compatibility with the block editor

### Code Documentation
- Use PHPDoc for all functions and classes
- Include @since tags for version tracking
- Document complex logic with inline comments
- Follow WordPress documentation standards