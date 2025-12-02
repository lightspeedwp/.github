---
file_type: "instructions"
title: "WordPress Security Standards"
description: "Security best practices for all WordPress development in LightSpeed projects"
version: "2.0"
last_updated: "2025-11-27"
author: "LightSpeedWP Team"
maintainer: "LightSpeedWP Team"
applyTo: "**/*.php"
domain: "security"
stability: "stable"
license: "GPL-3.0"
tags: ["security", "wordpress", "sanitization", "escaping", "nonces"]
references:
  - path: "coding-standards.instructions.md"
    description: "General coding standards"
  - path: "inline-docs/inline-phpdoc.instructions.md"
    description: "PHP inline documentation"
---

# WordPress Security Standards

Security is paramount in WordPress development. All user input must be sanitized, all output must be escaped, and all privileged actions must be verified through nonces and capabilities checks.

## Core Security Rules

1. **Always sanitize input** immediately on receipt
2. **Always escape output** before display
3. **Always verify nonces** for state-changing actions
4. **Always check capabilities** before admin actions
5. **Never trust client data** - validate server-side

## Input Sanitization

### Sanitize Functions by Type

```php
// Text fields
$clean_text = sanitize_text_field( $_POST['name'] ); // Strips tags, trims

// Multiline text
$clean_textarea = sanitize_textarea_field( $_POST['description'] );

// Email
$clean_email = sanitize_email( $_POST['email'] ); // Validates email format

// URL/File paths
$clean_url = esc_url_raw( $_POST['website'] ); // Returns safe URL
$clean_path = sanitize_file_name( $_POST['filename'] ); // Valid filename

// Numeric
$clean_int = intval( $_POST['quantity'] ); // Cast to integer
$clean_float = floatval( $_POST['price'] ); // Cast to float
$clean_id = absint( $_REQUEST['post_id'] ); // Absolute integer (positive)

// Hex colors
$clean_color = sanitize_hex_color( $_POST['color'] ); // Hex color only

// Arrays
$clean_array = array_map( 'sanitize_text_field', $_POST['tags'] );

// Custom callback
$clean_custom = sanitize_text_field( wp_unslash( $_POST['data'] ) );
```

### Sanitization Pattern

```php
// CORRECT: Immediate sanitization
$user_input = sanitize_text_field( $_POST['user_name'] );
$clean_data = trim( $user_input );
// Now $clean_data is safe to use

// WRONG: Using unsanitized input
$data = $_POST['user_name']; // Unsanitized!
if ( strlen( $data ) > 10 ) { // Potential issue
    echo $data; // Security risk!
}

// WRONG: Sanitizing after use
$data = $_POST['user_name'];
$clean = sanitize_text_field( $data );
// Too late if $data was used before sanitization
```

### Array Sanitization

```php
// Sanitize all values in array
$colors = array_map( 'sanitize_hex_color', $_POST['colors'] );

// Sanitize specific keys
$product_data = array_map( function( $item ) {
    return array(
        'name'  => sanitize_text_field( $item['name'] ?? '' ),
        'price' => floatval( $item['price'] ?? 0 ),
        'sku'   => sanitize_text_field( $item['sku'] ?? '' ),
    );
}, $_POST['products'] ?? [] );

// Sanitize and validate
$options = array(
    'category' => absint( $_POST['category'] ?? 0 ),
    'limit'    => max( 1, min( 100, absint( $_POST['limit'] ?? 10 ) ) ),
    'sort'     => in_array( $_POST['sort'] ?? 'date', ['date', 'title'], true ) ? $_POST['sort'] : 'date',
);
```

## Output Escaping

### Escape Functions by Context

```php
// HTML context (most common)
echo esc_html( $text ); // Escapes <, >, ", ', &

// HTML attributes
echo '<input value="' . esc_attr( $value ) . '">';

// URLs
echo '<a href="' . esc_url( $url ) . '">Link</a>';

// JavaScript strings
echo '<script>var name = "' . esc_js( $text ) . '";</script>';

// Rich text (allows some HTML)
echo wp_kses_post( $user_content );

// Specific allowed HTML tags
$allowed = array(
    'strong' => array(),
    'em'     => array(),
    'a'      => array( 'href' => array() ),
);
echo wp_kses( $user_content, $allowed );

// SQL (for database queries)
$query = $wpdb->prepare( "SELECT * FROM {$wpdb->posts} WHERE post_title = %s", $title );
$results = $wpdb->get_results( $query );
```

### Escaping Patterns

```php
// CORRECT: Escape immediately before output
$user_name = sanitize_text_field( $_POST['name'] );
echo '<h1>' . esc_html( $user_name ) . '</h1>';

// WRONG: Storing unescaped, escaping later
$this->user_name = $_POST['name']; // Stored unescaped
echo esc_html( $this->user_name ); // Escaped only at output time
// Better to sanitize when storing, escape when outputting

// CORRECT: Properly structured
$message = sanitize_text_field( $user_input );
// Use $message safely throughout...
echo esc_html( $message ); // Escape only at output

// WRONG: Escaping HTML that's meant to be HTML
$content = wp_kses_post( $user_html );
echo esc_html( $content ); // Double-escaping! esc_html unnecessary
// Use wp_kses_post directly

// CORRECT: Rich content
echo wp_kses_post( $user_html ); // Allows safe HTML tags
```

### Context-Aware Escaping

```php
// HTML content
<div><?php echo wp_kses_post( $description ); ?></div>

// Attributes
<button data-id="<?php echo esc_attr( $id ); ?>">Click</button>

// JavaScript
<script>
var productId = <?php echo esc_js( $id ); ?>;
var productTitle = "<?php echo esc_js( $title ); ?>"; 
</script>

// CSS (data attribute with CSS values)
<div style="color: <?php echo esc_attr( sanitize_hex_color( $color ) ); ?>">
    Content
</div>

// URL in href
<a href="<?php echo esc_url( wp_nonce_url( $url, 'action_name' ) ); ?>">
    <?php echo esc_html( $link_text ); ?>
</a>
```

## Nonces & Capability Checks

### Nonces for State-Changing Actions

```php
// CREATE nonce (output in form)
<form method="POST">
    <?php wp_nonce_field( 'save_product', 'product_nonce' ); ?>
    <input type="text" name="title" />
    <button type="submit">Save</button>
</form>

// VERIFY nonce (process form)
if ( $_SERVER['REQUEST_METHOD'] === 'POST' ) {
    // Check nonce first
    if ( ! isset( $_POST['product_nonce'] ) || 
         ! wp_verify_nonce( $_POST['product_nonce'], 'save_product' ) ) {
        wp_die( 'Nonce verification failed' );
    }

    // Then sanitize and process
    $title = sanitize_text_field( $_POST['title'] );
    // Save to database...
}

// AJAX nonce
wp_enqueue_script( 'my-script', 'js/script.js', ['jquery'], '1.0', true );
wp_localize_script( 'my-script', 'myAjax', [
    'nonce' => wp_create_nonce( 'my_action_nonce' ),
] );

// JavaScript file
jQuery.post( ajaxurl, {
    action: 'my_action',
    nonce: myAjax.nonce,
    data: formData,
}, function( response ) {
    console.log( response );
});

// AJAX handler
add_action( 'wp_ajax_my_action', 'handle_my_action' );
function handle_my_action() {
    check_ajax_referer( 'my_action_nonce', 'nonce' );
    // Process request...
    wp_send_json_success( $data );
}
```

### Capability Checks

```php
// Check user can edit posts
if ( ! current_user_can( 'edit_posts' ) ) {
    wp_die( 'Insufficient permissions' );
}

// Check user can edit specific post
if ( ! current_user_can( 'edit_post', $post_id ) ) {
    wp_die( 'Cannot edit this post' );
}

// Check user is admin
if ( ! current_user_can( 'manage_options' ) ) {
    wp_die( 'Admin access required' );
}

// Check for custom capability
if ( ! current_user_can( 'manage_products' ) ) {
    wp_die( 'Cannot manage products' );
}

// Combine nonce + capability check
if ( ! current_user_can( 'edit_post', $post_id ) ||
     ! wp_verify_nonce( $_POST['edit_nonce'], 'edit_post_' . $post_id ) ) {
    wp_die( 'Unauthorized' );
}
```

## Database Security

### Prepared Statements

```php
global $wpdb;

// CORRECT: Use $wpdb->prepare() for all user input
$query = $wpdb->prepare(
    "SELECT * FROM {$wpdb->posts} WHERE post_author = %d AND post_title = %s",
    $author_id,
    $title
);
$results = $wpdb->get_results( $query );

// CORRECT: Placeholder types
$wpdb->prepare(
    "WHERE id = %d",           // %d for integers
    intval( $id )
);
$wpdb->prepare(
    "WHERE title = %s",        // %s for strings
    sanitize_text_field( $title )
);
$wpdb->prepare(
    "WHERE count > %f",        // %f for floats
    floatval( $count )
);

// WRONG: String concatenation (SQL injection!)
$results = $wpdb->get_results( "SELECT * FROM {$wpdb->posts} WHERE id = $id" );
// ^ NEVER DO THIS!

// WRONG: sprintf() is not a prepared statement
$query = sprintf( "SELECT * FROM {$wpdb->posts} WHERE id = %d", $id );
// ^ Not escaped properly for MySQL!
```

### Custom Table Creation

```php
// Create custom table with proper escaping
global $wpdb;

$table_name = $wpdb->prefix . 'my_custom_table';
$charset_collate = $wpdb->get_charset_collate();

$sql = "CREATE TABLE $table_name (
    id BIGINT(20) NOT NULL AUTO_INCREMENT,
    user_id BIGINT(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description LONGTEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY user_id (user_id)
) $charset_collate;";

require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
dbDelta( $sql );
```

## File Operations

```php
// CORRECT: Use WordPress filesystem API
$file_content = $this->read_file( 'path/to/file.txt' );
if ( is_wp_error( $file_content ) ) {
    return false;
}

// Use WP_Filesystem
require_once( ABSPATH . 'wp-admin/includes/file.php' );
WP_Filesystem();
global $wp_filesystem;

$file = wp_upload_dir()['basedir'] . '/my-file.txt';
if ( ! $wp_filesystem->put_contents( $file, $content ) ) {
    wp_die( 'Could not write file' );
}

// CORRECT: Sanitize file paths
$file_path = wp_upload_dir()['basedir'] . '/' . sanitize_file_name( $_POST['filename'] );
if ( ! $wp_filesystem->exists( $file_path ) ) {
    wp_die( 'File not found' );
}

// WRONG: Direct file operations
file_put_contents( $_POST['path'], $content ); // NO! Unsanitized path
```

## REST API Security

```php
// Register secure REST endpoint
register_rest_route( 'my-plugin/v1', '/products/(?P<id>\d+)', [
    'methods'             => WP_REST_Server::EDITABLE,
    'callback'           => [ $this, 'update_product' ],
    'permission_callback' => [ $this, 'check_admin_permission' ],
    'args'                => [
        'id'    => [ 'type' => 'integer', 'required' => true ],
        'title' => [ 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field' ],
        'price' => [ 'type' => 'number', 'sanitize_callback' => 'floatval' ],
    ],
] );

// Permission callback
public function check_admin_permission() {
    return current_user_can( 'manage_options' );
}

// Route callback with validation
public function update_product( $request ) {
    $params = $request->get_json_params();
    
    // Validate (sanitization already done by register_rest_route)
    if ( empty( $params['title'] ) ) {
        return new WP_Error(
            'invalid_title',
            'Product title is required',
            [ 'status' => 400 ]
        );
    }

    // Update product...
    return rest_ensure_response( $updated_product );
}
```

## Security Checklist

- [ ] All `$_POST`, `$_GET`, `$_REQUEST` input sanitized immediately
- [ ] All output escaped with appropriate function (`esc_html`, `esc_attr`, `esc_url`)
- [ ] All state-changing actions protected by nonces
- [ ] All admin actions check `current_user_can()`
- [ ] All database queries use `$wpdb->prepare()`
- [ ] No hardcoded secrets or API keys
- [ ] File operations use WP_Filesystem or `wp_safe_remote_*`
- [ ] REST endpoints have `permission_callback`
- [ ] No direct file path usage from user input
- [ ] HTML sanitized with `wp_kses_post` or `wp_kses`
- [ ] CSRF tokens (nonces) verified before processing

## Security Resources

- [WordPress Plugin Security](https://developer.wordpress.org/plugins/security/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [WordPress Escaping Reference](https://developer.wordpress.org/plugins/security/securing-output/)
- [WordPress Sanitizing Reference](https://developer.wordpress.org/plugins/security/sanitizing-input/)
