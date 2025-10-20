---
applyTo: ['**/*.php']
description: "Apply WordPress PHP standards (formatting, naming, security, I18N)."
last_updated: "2025-10-19"
version: "v1.0"
owners: ["LightSpeed Engineering"]
---

# Mission
Ensure PHP code follows WordPress conventions for style, security and internationalisation while delivering high performance.

# Language & Frameworks
- PHP 7.4+ (WordPress currently supports up to 8.2). Use WordPress core functions and APIs wherever possible.

# Project Structure
- Organise code under `includes/`, `src/` or `plugins/` with autoloadable namespaces.
- Name classes and files consistently (e.g. `class-plugin-name.php`).

# Coding Standards
- Use **4‑space indentation**; brace styles follow the WordPress guidelines (K&R).
- Prefer **Yoda conditions** when performing comparisons that may involve assignments.
- Escape data on output (`esc_html`, `esc_attr`, `wp_kses_post`) and sanitise data on input (`sanitize_text_field`, `intval`, etc.).
- Protect against CSRF by using WordPress nonces for forms and actions.
- Wrap translatable strings in `__()`, `_e()` or similar functions with a text domain.
- Avoid direct database queries; use `$wpdb->prepare()` and helper functions.

# Testing & Quality
- Run **PHPCS** with the `WordPress`, `WordPress-Docs` and `WordPress-Extra` rulesets. Use `phpcbf` for safe automatic fixes and review residual warnings.
- Write unit tests with PHPUnit and integration tests with the WordPress testing suite.

# Performance & Security
- Cache expensive operations; use transients or object caching APIs.
- Validate and sanitise all user inputs; never trust `$_GET`, `$_POST` or `$_REQUEST` without sanitisation.
- Use prepared statements to prevent SQL injection.

# Documentation
- Provide comprehensive DocBlocks for all classes, methods and hooks, including `@since`, `@param`, `@return`, and examples where applicable.

# PHP Block & Theme Setup Instructions
- Follow WordPress coding standards: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/
- Use 4 spaces for indentation, no tabs

## Pattern Registration

- Register block patterns using `register_block_pattern()` in `patterns/` directory.
- Use consistent naming convention: `lsx/[category]-[name]` (e.g., `lsx/cta-newsletter`).
- Include proper pattern categories and keywords for discoverability.
- Provide a descriptive viewportWidth value appropriate for the pattern's design.

## Translation & Internationalization

- Use correct text domain for all translations: `__('text', 'lsx-theme')`.
- Ensure all user-visible strings are translatable.
- Use proper escaping functions with translations: `esc_html__()`, `esc_attr__()`.
- For HTML with translations, use `esc_html_e()` or appropriate alternatives.

## Security & Data Handling

- Sanitize all dynamic output using appropriate escaping functions:
-`esc_html()` for regular text
-`esc_url()` for URLs
-`esc_attr()` for HTML attributes
-`wp_kses_post()` for allowed HTML content
- Validate and sanitize all input data before use.
- Use nonces for form submissions and AJAX requests.

## Asset Management

- Do not enqueue scripts/styles inline—use WordPress enqueue functions:
-`wp_enqueue_script()` for JavaScript files
-`wp_enqueue_style()` for CSS files
- Properly handle dependencies in enqueue functions.
- Use versioning for cache busting when files are updated.
- Localize JavaScript data using `wp_localize_script()`.

## Block Pattern Best Practices

- Keep pattern names unique and descriptive (e.g., `lsx/pricing-table`).
- Use meaningful comments to document pattern sections.
- Maintain proper block structure and nesting.
- Ensure blocks use theme.json variables for styling consistency.
- Test patterns across different viewport sizes.

## Performance Considerations

- Avoid unnecessary database queries in pattern rendering.
- Optimize image usage in patterns (use appropriate sizes and formats).
- Consider render blocking when adding custom scripts.
- Use WordPress core blocks whenever possible instead of custom solutions.

# Examples

```php
/**
 * Gets the current user’s display name.
 *
 * @since 1.0.0
 *
 * @return string The display name of the current user.
 */
function ls_get_current_user_display_name() {
    $user = wp_get_current_user();
    return isset( $user->display_name ) ? esc_html( $user->display_name ) : '';
}
```

# Checklists
- [ ] All database queries use prepared statements.
- [ ] Data is sanitised on input and escaped on output.
- [ ] Functions and classes include full DocBlocks.

# References
- https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/
