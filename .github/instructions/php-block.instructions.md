---
description: 'Instructions for PHP files related to block patterns or theme setup in any LightSpeed WordPress project'
applyTo: '**/*.php'
license: 'GPL-3.0'
---

    - "inc/blocks/register-patterns.php"

tags:

-   php
-   wordpress
-   block
-   theme
-   pattern
-   instructions
    categories:
-   documentation
-   instructions
-   guides
    applyTo: "\*_/_.php"

---

# PHP Block & Theme Setup Instructions

-   Follow WordPress coding standards: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/
-   Use 4 spaces for indentation, no tabs

## Pattern Registration

-   Register block patterns using `register_block_pattern()` in `patterns/` directory.
-   Use consistent naming convention: `lsx/[category]-[name]` (e.g., `lsx/cta-newsletter`).
-   Include proper pattern categories and keywords for discoverability.
-   Provide a descriptive viewportWidth value appropriate for the pattern's design.

## Translation & Internationalization

-   Use correct text domain for all translations: `__('text', 'lsx-theme')`.
-   Ensure all user-visible strings are translatable.
-   Use proper escaping functions with translations: `esc_html__()`, `esc_attr__()`.
-   For HTML with translations, use `esc_html_e()` or appropriate alternatives.

## Security & Data Handling

-   Sanitize all dynamic output using appropriate escaping functions: -`esc_html()` for regular text -`esc_url()` for URLs -`esc_attr()` for HTML attributes -`wp_kses_post()` for allowed HTML content
-   Validate and sanitize all input data before use.
-   Use nonces for form submissions and AJAX requests.

## Asset Management

-   Do not enqueue scripts/styles inline—use WordPress enqueue functions: -`wp_enqueue_script()` for JavaScript files -`wp_enqueue_style()` for CSS files
-   Properly handle dependencies in enqueue functions.
-   Use versioning for cache busting when files are updated.
-   Localize JavaScript data using `wp_localize_script()`.

## Block Pattern Best Practices

-   Keep pattern names unique and descriptive (e.g., `lsx/pricing-table`).
-   Use meaningful comments to document pattern sections.
-   Maintain proper block structure and nesting.
-   Ensure blocks use theme.json variables for styling consistency.
-   Test patterns across different viewport sizes.

## Performance Considerations

-   Avoid unnecessary database queries in pattern rendering.
-   Optimize image usage in patterns (use appropriate sizes and formats).
-   Consider render blocking when adding custom scripts.
-   Use WordPress core blocks whenever possible instead of custom solutions.
