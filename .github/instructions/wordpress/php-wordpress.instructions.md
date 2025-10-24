---
applyTo: "**/*.php"
description: "PHP coding standards for WordPress development - security, performance, and WordPress API best practices"
license: "GPL-3.0-or-later"
---

# PHP Development Guidelines for WordPress

## WordPress Coding Standards (WPCS)

### File Structure & Organization
- Use proper WordPress file headers with plugin/theme information
- Organize code into logical directories (`/inc`, `/lib`, `/admin`, `/public`)
- Follow WordPress naming conventions for files and directories
- Use kebab-case for file names, snake_case for function names
- Prefix all functions, classes, and constants to avoid conflicts

### Security First
```php
// Always escape output
echo esc_html( $user_input );
echo esc_attr( $attribute_value );
echo esc_url( $url );
echo wp_kses_post( $rich_content );

// Sanitize input immediately
$clean_text = sanitize_text_field( $_POST['user_text'] );
$clean_email = sanitize_email( $_POST['user_email'] );
$clean_url = esc_url_raw( $_POST['user_url'] );

// Use nonces for all forms and AJAX
wp_nonce_field( 'my_action_nonce', 'my_nonce' );
if ( ! wp_verify_nonce( $_POST['my_nonce'], 'my_action_nonce' ) ) {
    wp_die( 'Security check failed' );
}

// Check user capabilities
if ( ! current_user_can( 'edit_posts' ) ) {
    wp_die( 'Insufficient permissions' );
}
```

### Database Operations
```php
// Always use $wpdb->prepare() for custom queries
global $wpdb;
$results = $wpdb->get_results( $wpdb->prepare(
    "SELECT * FROM {$wpdb->prefix}custom_table WHERE user_id = %d AND status = %s",
    $user_id,
    $status
) );

// Prefer WordPress functions over direct queries
$posts = get_posts( array(
    'post_type' => 'custom_type',
    'meta_query' => array(
        array(
            'key' => 'custom_field',
            'value' => $value,
            'compare' => '='
        )
    )
) );
```

### Internationalization (i18n)
```php
// Use proper text domain consistently
__( 'Text to translate', 'textdomain' );
_e( 'Text to echo', 'textdomain' );
_x( 'Text', 'Context for translators', 'textdomain' );
_n( 'Singular', 'Plural', $count, 'textdomain' );

// For JavaScript strings
wp_localize_script( 'my-script', 'myL10n', array(
    'ajaxurl' => admin_url( 'admin-ajax.php' ),
    'nonce' => wp_create_nonce( 'my_ajax_nonce' ),
    'strings' => array(
        'loading' => __( 'Loading...', 'textdomain' ),
        'error' => __( 'An error occurred', 'textdomain' ),
    )
) );
```

### Error Handling & Logging
```php
// Use WordPress error handling
if ( is_wp_error( $result ) ) {
    error_log( 'Custom plugin error: ' . $result->get_error_message() );
    return false;
}

// Debug logging (only when WP_DEBUG is true)
if ( WP_DEBUG ) {
    error_log( 'Debug info: ' . print_r( $debug_data, true ) );
}

// User-friendly error messages
wp_die( 
    __( 'Something went wrong. Please try again later.', 'textdomain' ),
    __( 'Error', 'textdomain' ),
    array( 'response' => 500 )
);
```

### Performance Best Practices
```php
// Cache expensive operations
$cache_key = 'my_plugin_data_' . md5( serialize( $args ) );
$data = get_transient( $cache_key );

if ( false === $data ) {
    $data = expensive_operation( $args );
    set_transient( $cache_key, $data, HOUR_IN_SECONDS );
}

// Use WordPress object cache
$data = wp_cache_get( $cache_key, 'my_plugin_group' );
if ( false === $data ) {
    $data = expensive_operation();
    wp_cache_set( $cache_key, $data, 'my_plugin_group', 3600 );
}

// Minimize database queries
// Bad: N+1 query problem
foreach ( $posts as $post ) {
    $meta = get_post_meta( $post->ID, 'custom_field', true );
}

// Good: Single query with meta_query or get_posts with meta
$posts = get_posts( array(
    'meta_key' => 'custom_field',
    'meta_value' => $value
) );
```

### WordPress Hooks & Filters
```php
// Use appropriate hook priorities
add_action( 'init', 'my_plugin_init', 10 );
add_filter( 'the_content', 'my_content_filter', 20 );

// Remove hooks safely
remove_action( 'wp_head', 'wp_generator' );
remove_filter( 'the_content', 'wpautop' );

// Conditional hook registration
if ( is_admin() ) {
    add_action( 'admin_init', 'my_admin_init' );
} else {
    add_action( 'wp_enqueue_scripts', 'my_frontend_scripts' );
}

// Hook into plugin activation/deactivation
register_activation_hook( __FILE__, 'my_plugin_activate' );
register_deactivation_hook( __FILE__, 'my_plugin_deactivate' );
```

### Class Structure & OOP
```php
/**
 * Main plugin class
 */
class My_Plugin {
    
    /**
     * Plugin instance
     */
    private static $instance = null;
    
    /**
     * Get plugin instance (singleton pattern)
     */
    public static function get_instance() {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    /**
     * Constructor - private for singleton
     */
    private function __construct() {
        add_action( 'init', array( $this, 'init' ) );
    }
    
    /**
     * Initialize plugin
     */
    public function init() {
        // Plugin initialization code
        if ( is_admin() ) {
            $this->init_admin();
        } else {
            $this->init_frontend();
        }
    }
    
    /**
     * Initialize admin functionality
     */
    private function init_admin() {
        // Admin-specific code
    }
    
    /**
     * Initialize frontend functionality  
     */
    private function init_frontend() {
        // Frontend-specific code
    }
}

// Initialize plugin
My_Plugin::get_instance();
```

### Block Development (PHP)
```php
/**
 * Register custom block type
 */
function my_plugin_register_blocks() {
    // Register block from block.json
    register_block_type( __DIR__ . '/build/blocks/custom-block' );
    
    // Register block with PHP configuration
    register_block_type( 'my-plugin/custom-block', array(
        'render_callback' => 'my_plugin_render_custom_block',
        'attributes' => array(
            'content' => array(
                'type' => 'string',
                'default' => ''
            ),
            'alignment' => array(
                'type' => 'string',
                'default' => 'left'
            )
        ),
        'supports' => array(
            'anchor' => true,
            'spacing' => array(
                'margin' => true,
                'padding' => true
            )
        )
    ) );
}
add_action( 'init', 'my_plugin_register_blocks' );

/**
 * Render callback for custom block
 */
function my_plugin_render_custom_block( $attributes, $content, $block ) {
    $wrapper_attributes = get_block_wrapper_attributes( array(
        'class' => 'my-custom-block align' . esc_attr( $attributes['alignment'] )
    ) );
    
    return sprintf(
        '<div %1$s><p>%2$s</p></div>',
        $wrapper_attributes,
        esc_html( $attributes['content'] )
    );
}
```

### REST API Integration
```php
/**
 * Register custom REST API endpoint
 */
function my_plugin_register_rest_routes() {
    register_rest_route( 'my-plugin/v1', '/custom-endpoint', array(
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'my_plugin_rest_callback',
        'permission_callback' => 'my_plugin_rest_permission_check',
        'args' => array(
            'id' => array(
                'required' => true,
                'validate_callback' => function( $param, $request, $key ) {
                    return is_numeric( $param );
                },
                'sanitize_callback' => 'absint'
            )
        )
    ) );
}
add_action( 'rest_api_init', 'my_plugin_register_rest_routes' );

/**
 * REST API callback
 */
function my_plugin_rest_callback( $request ) {
    $id = $request->get_param( 'id' );
    
    // Process request
    $data = my_plugin_get_data( $id );
    
    if ( empty( $data ) ) {
        return new WP_Error( 'no_data', 'No data found', array( 'status' => 404 ) );
    }
    
    return rest_ensure_response( $data );
}

/**
 * Permission check for REST API
 */
function my_plugin_rest_permission_check() {
    return current_user_can( 'read' );
}
```

## Code Quality Standards

### Documentation
- Use proper PHPDoc blocks for all functions, classes, and methods
- Document parameter types, return values, and exceptions
- Include @since tags for version tracking
- Provide clear descriptions and examples where helpful

### Testing
- Write unit tests for all public methods using PHPUnit
- Test edge cases and error conditions
- Mock WordPress functions in tests
- Aim for high code coverage

### Performance
- Use appropriate WordPress caching mechanisms
- Minimize database queries and optimize existing ones
- Load scripts and styles conditionally
- Use WordPress coding standards for better performance

### Compatibility
- Support the minimum required WordPress version
- Test with PHP versions from minimum to latest
- Ensure compatibility with common plugins and themes
- Follow semantic versioning for releases

Always prioritize security, performance, and maintainability over convenience. When in doubt, follow WordPress Core's implementation patterns and coding standards.