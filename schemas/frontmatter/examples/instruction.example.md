---
$schema: "../frontmatter.schema.json"
file_type: "instructions"
title: "WordPress REST API Security Instructions"
description: "Security guidelines for WordPress REST API development including authentication, authorization, input validation, and output sanitization"
version: "v1.0.0"
last_updated: "2025-11-12"
author: "LightSpeed Security Team"
maintainer: "Ash Shaw"
applyTo:
  - "includes/api/**/*.php"
  - "includes/rest/**/*.php"
mode: "agent"
domain: "security"
stability: "stable"
tags: ["security", "rest-api", "validation", "wordpress"]
references:
  - path: "../../docs/SECURITY.md"
    description: "Main security documentation"
  - path: "./coding-standards.instructions.md"
    description: "WordPress coding standards"
  - path: "../frontmatter.schema.json"
    description: "Frontmatter schema definition"
---

# WordPress REST API Security Instructions

This is an example instructions file showing proper frontmatter structure for applying security guidelines to specific file patterns.

## Purpose

Ensure all WordPress REST API endpoints follow security best practices.

## Required Security Measures

### 1. Authentication

All custom REST API endpoints MUST implement proper authentication:

```php
register_rest_route('myplugin/v1', '/secure-endpoint', [
    'methods' => 'POST',
    'callback' => 'my_secure_callback',
    'permission_callback' => 'my_permission_check', // Required!
]);
```

### 2. Authorization

Check user capabilities before processing:

```php
function my_permission_check() {
    return current_user_can('edit_posts');
}
```

### 3. Input Validation

Validate all input parameters:

```php
'args' => [
    'id' => [
        'required' => true,
        'validate_callback' => function($param) {
            return is_numeric($param);
        },
        'sanitize_callback' => 'absint',
    ],
],
```

### 4. Nonce Verification

For sensitive operations, verify nonces:

```php
if (!wp_verify_nonce($_REQUEST['_wpnonce'], 'my_action')) {
    return new WP_Error('invalid_nonce', 'Security check failed', ['status' => 403]);
}
```

## Checklist

- [ ] Permission callback defined (not `__return_true`)
- [ ] User capabilities checked
- [ ] Input validated and sanitized
- [ ] Output escaped if returning HTML
- [ ] Nonces verified for state-changing operations
- [ ] Rate limiting considered for public endpoints
- [ ] Error messages don't leak sensitive information

## References

- [REST API Handbook](https://developer.wordpress.org/rest-api/)
- [WordPress Security](https://developer.wordpress.org/apis/security/)
- [OWASP API Security](https://owasp.org/www-project-api-security/)
