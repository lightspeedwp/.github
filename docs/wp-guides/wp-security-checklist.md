---
title: "WordPress Security Checklist"
description: "Checklist of security best practices for WordPress development."
last_updated: "2025-10-21"
version: "v0.1.0"
owners:
  - "lightspeedwp/maintainers"
file_type: "guide"
category: "wordpress_guides"
tags: ["wordpress", "security", "best practices", "checklist"]
language: "en"
status: "active"
visibility: "public"
---

# WordPress Security Checklist

A practical checklist for keeping your WordPress plugins, themes, and custom code secure.

## Example Secure Code

```php
if ( isset( $_POST['my_field'] ) && check_admin_referer( 'my_action', 'my_nonce' ) ) {
    $my_value = sanitize_text_field( $_POST['my_field'] );
    update_option( 'my_option', $my_value );
}
```

- Sanitize and validate all input
- Escape all output
- Use nonces for state-changing actions
- Limit user capabilities