---
"title": "WordPress Development Guides"
"description": "Quick reference guides and checklists for WordPress development at LightSpeed"
"version": "1.0"
"last_updated": "2025-11-12"
"maintainer": "LightSpeed Team"
"tags":
  - "wordpress"
  - "guides"
  - "checklists"
  - "coding-standards"
  - "security"
"file_type": "documentation"
---

# WordPress Development Guides

This directory contains quick reference guides and checklists for WordPress development best practices at LightSpeed.

## Purpose

Provides concise, actionable checklists and guides for common WordPress development tasks:

- Block development checklists
- WordPress coding standards quick reference
- Security best practices and vulnerability prevention

## Contents

### Core Documentation Files

- **block-dev-checklist.md** – Comprehensive checklist for WordPress block development
- **wp-coding-standards.md** – Quick reference for WordPress coding standards (PHP, JS, CSS)
- **wp-security-checklist.md** – Security checklist for WordPress development

## Inputs

- WordPress block development projects
- Custom theme and plugin development
- Security audits and code reviews

## Outputs

- Blocks developed following WordPress best practices
- Code adhering to WordPress coding standards
- Secure, validated, and sanitized WordPress code
- Accessible, performant WordPress components

## Usage Examples

### Example 1: Block Development Checklist

```markdown
- [ ] Block registered with proper metadata
- [ ] Editor and frontend styles separated
- [ ] Block attributes properly typed
- [ ] Save/edit functions handle validation
- [ ] Accessibility attributes included (ARIA, roles)
- [ ] Block tested in editor and frontend
- [ ] Block variations defined (if applicable)
```

### Example 2: Security Checklist

```markdown
- [ ] All user inputs sanitized (sanitize_text_field, esc_html, etc.)
- [ ] All outputs escaped (esc_html, esc_url, wp_kses)
- [ ] Nonces used for form submissions
- [ ] Capability checks for privileged operations
- [ ] SQL queries use prepared statements
- [ ] File uploads validated and restricted
```

### Example 3: Coding Standards Reference

```php
// WordPress coding standards
function lightspeed_get_post_title( $post_id ) {
    // Use proper spacing, braces, and naming conventions
    if ( ! $post_id ) {
        return '';
    }

    $title = get_the_title( $post_id );
    return esc_html( $title );
}
```

## Related Documentation

- [WordPress Development](../wordpress/README.md) – Comprehensive WordPress documentation
- [Coding Standards](../../.github/instructions/coding-standards.instructions.md) – LightSpeed coding standards
- [Security Policy](../../SECURITY.md) – Organization-wide security practices
- [WordPress Block Instructions](../../.github/instructions/php-block.instructions.md) – Detailed block development guide

---

**Maintained by LightSpeed Team** • For updates or questions, see [CONTRIBUTING.md](../../CONTRIBUTING.md)
