---
file_type: "instructions"
title: "Block Plugin Security Standards"
description: "Security best practices and guidelines for WordPress block plugin development, covering sanitization, escaping, nonces, and capability checks."
applyTo: "**/*.php"
version: "v1.0"
last_updated: "2025-11-27"
owners: ["LightSpeedWP Team"]
tags: ["security", "wordpress", "blocks", "sanitization", "escaping", "nonces"]
domain: "security"
stability: "stable"
references:
  - path: "./block-plugin-development.instructions.md"
    description: "Main block plugin development instructions"
  - path: "../wpcs/wpcs-php.instructions.md"
    description: "WordPress PHP coding standards"
  - path: "../coding-standards.instructions.md"
    description: "General coding standards"
---

# Block Plugin Security Standards

## Principles

- **Sanitize on Input** — Validate and sanitize all user input immediately
- **Escape on Output** — Escape all data before rendering in HTML, attributes, or JavaScript
- **Use Nonces** — Protect state-changing requests with WordPress nonces
- **Check Capabilities** — Verify user permissions before accessing sensitive functionality
- **Keep Secrets Safe** — Never hardcode API keys, tokens, or credentials in source code

## Input Sanitization

### Sanitization Functions

Use appropriate sanitization functions based on data type:

```php
// Text input
$text = sanitize_text_field( $_POST['text'] );

// Email input
$email = sanitize_email( $_POST['email'] );

// URL input
$url = esc_url_raw( $_POST['url'] );

// HTML content (preserving safe tags)
$html = wp_kses_post( $_POST['content'] );

// Restricted HTML (minimal tags allowed)
$html = wp_kses( $_POST['html'], array(
    'b'      => array(),
    'strong' => array(),
    'em'     => array(),
    'i'      => array(),
) );

// For numeric values
$id = absint( $_POST['id'] );
$count = intval( $_POST['count'] );

// For floating point
$price = floatval( $_POST['price'] );

// For arrays
$items = array_map( 'sanitize_text_field', (array) $_POST['items'] );
```

### REST API Sanitization

When registering REST endpoints, always include sanitization callbacks:

```php
register_rest_route( 'my-plugin/v1', '/data', array(
    'methods'  => 'POST',
    'callback' => 'handle_post_request',
    'args'     => array(
        'title' => array(
            'type'              => 'string',
            'sanitize_callback' => 'sanitize_text_field',
            'required'          => true,
        ),
        'content' => array(
            'type'              => 'string',
            'sanitize_callback' => 'wp_kses_post',
            'required'          => true,
        ),
    ),
) );
```

## Output Escaping

### Context-Appropriate Escaping

Always escape output with the correct function for the context:

```php
// HTML content
echo wp_kses_post( $content );

// HTML text (strips tags)
echo esc_html( $text );

// HTML attributes
echo esc_attr( $value );

// URLs
echo esc_url( $url );

// JavaScript strings
echo esc_js( $text );

// For translation + escaping
echo esc_html__( 'Hello World', 'text-domain' );
echo esc_attr__( 'Attribute Text', 'text-domain' );

// For sprintf + escaping
echo wp_kses_post( sprintf(
    'Visit <a href="%s">our site</a>',
    esc_url( home_url() )
) );
```

### Escaping in Block Markup

```php
// In save/render functions
function my_block_render( $attributes ) {
    return sprintf(
        '<div class="%s">%s</div>',
        esc_attr( $attributes['className'] ),
        wp_kses_post( $attributes['content'] )
    );
}

// In JavaScript (for use in PHP)
wp_localize_script( 'script-handle', 'myData', array(
    'siteUrl'  => esc_url_raw( home_url() ),
    'nonce'    => wp_create_nonce( 'my_nonce' ),
    'messages' => array(
        'error'   => esc_html__( 'Error', 'text-domain' ),
        'success' => esc_html__( 'Success', 'text-domain' ),
    ),
) );
```

## Nonces

### Creating Nonces

```php
// Generate nonce for form or AJAX request
$nonce = wp_create_nonce( 'my_action_nonce' );

// Output in form
echo '<input type="hidden" name="my_nonce" value="' . esc_attr( $nonce ) . '">';

// Output in script for AJAX
wp_localize_script( 'script-handle', 'myScript', array(
    'nonce' => wp_create_nonce( 'my_ajax_nonce' ),
) );
```

### Verifying Nonces

```php
// In form handler
if ( ! isset( $_POST['my_nonce'] ) || ! wp_verify_nonce( $_POST['my_nonce'], 'my_action_nonce' ) ) {
    wp_die( 'Security check failed' );
}

// In AJAX handler
add_action( 'wp_ajax_my_action', function() {
    check_ajax_referer( 'my_ajax_nonce', 'nonce' );

    // Process AJAX request
    wp_send_json_success( array( 'message' => 'Success' ) );
} );

// REST API (handled automatically)
// Nonces are checked via wp_rest_nonce_field()
```

## Capability Checks

### Checking User Permissions

```php
// Check if user can edit posts
if ( ! current_user_can( 'edit_posts' ) ) {
    wp_die( 'Unauthorized' );
}

// Check if user can manage options
if ( ! current_user_can( 'manage_options' ) ) {
    wp_die( 'You do not have permission' );
}

// Check capability on a specific post
if ( ! current_user_can( 'edit_post', $post_id ) ) {
    wp_die( 'Cannot edit this post' );
}

// In REST endpoint
register_rest_route( 'my-plugin/v1', '/data', array(
    'callback'            => 'handle_request',
    'permission_callback' => function() {
        return current_user_can( 'edit_posts' );
    },
) );

// Custom capability check
if ( ! current_user_can( 'manage_my_plugin' ) ) {
    return new \WP_Error(
        'unauthorized',
        __( 'You do not have permission to perform this action', 'text-domain' ),
        array( 'status' => 403 )
    );
}
```

## Common Vulnerabilities

### SQL Injection Prevention

```php
// ❌ WRONG - SQL injection vulnerability
$query = "SELECT * FROM {$wpdb->posts} WHERE post_title = '$title'";

// ✅ CORRECT - Use prepared statements
$query = $wpdb->prepare(
    "SELECT * FROM {$wpdb->posts} WHERE post_title = %s",
    $title
);
$results = $wpdb->get_results( $query );
```

### Cross-Site Scripting (XSS) Prevention

```php
// ❌ WRONG - XSS vulnerability
echo "Hello " . $_GET['name'];

// ✅ CORRECT - Escape output
echo 'Hello ' . esc_html( $_GET['name'] );
```

### Cross-Site Request Forgery (CSRF) Prevention

```php
// ❌ WRONG - No CSRF protection
if ( isset( $_POST['action'] ) ) {
    // Process form
}

// ✅ CORRECT - Use nonces
if ( isset( $_POST['action'], $_POST['nonce'] ) ) {
    if ( ! wp_verify_nonce( $_POST['nonce'], 'my_action' ) ) {
        wp_die( 'Security check failed' );
    }
    // Process form
}
```

## File Upload Security

```php
// Validate file upload
function handle_file_upload( $file ) {
    // Check file size
    $max_size = 5 * 1024 * 1024; // 5MB
    if ( $file['size'] > $max_size ) {
        return new \WP_Error( 'file_too_large', __( 'File is too large' ) );
    }

    // Check file type
    $allowed_types = array( 'image/jpeg', 'image/png', 'image/gif' );
    if ( ! in_array( $file['type'], $allowed_types, true ) ) {
        return new \WP_Error( 'invalid_type', __( 'Invalid file type' ) );
    }

    // Use WordPress functions for upload
    require_once( ABSPATH . 'wp-admin/includes/file.php' );
    $upload = wp_upload_bits( $file['name'], null, file_get_contents( $file['tmp_name'] ) );

    if ( $upload['error'] ) {
        return new \WP_Error( 'upload_error', $upload['error'] );
    }

    return $upload['url'];
}
```

## Environment Variables & Secrets

```php
// ✅ CORRECT - Use environment variables
if ( ! defined( 'MY_PLUGIN_API_KEY' ) ) {
    define( 'MY_PLUGIN_API_KEY', getenv( 'MY_PLUGIN_API_KEY' ) );
}

// ❌ WRONG - Never hardcode secrets
define( 'MY_PLUGIN_API_KEY', 'sk_live_abc123xyz789' );

// Use .env files for local development
// Never commit .env to version control
```

## Testing Security

```php
// Unit test for sanitization
public function test_sanitize_user_input() {
    $input = '<script>alert("XSS")</script>';
    $sanitized = sanitize_text_field( $input );
    $this->assertNotContains( '<script>', $sanitized );
}

// Unit test for capability check
public function test_user_capability() {
    $user = self::factory()->user->create( array( 'role' => 'subscriber' ) );
    wp_set_current_user( $user );

    $this->assertFalse( current_user_can( 'manage_options' ) );
}

// Unit test for nonce
public function test_nonce_verification() {
    $nonce = wp_create_nonce( 'test_nonce' );
    $this->assertTrue( wp_verify_nonce( $nonce, 'test_nonce' ) );
    $this->assertFalse( wp_verify_nonce( $nonce, 'wrong_action' ) );
}
```

## References

- [WordPress Security Handbook](https://developer.wordpress.org/plugins/security/)
- [Data Validation](https://developer.wordpress.org/plugins/security/data-validation/)
- [Data Sanitization](https://developer.wordpress.org/plugins/security/sanitizing-input/)
- [Data Escaping](https://developer.wordpress.org/plugins/security/securing-output/)
- [Nonces](https://developer.wordpress.org/plugins/security/nonces/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
