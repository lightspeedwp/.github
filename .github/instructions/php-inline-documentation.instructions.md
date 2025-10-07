---
description: "WordPress PHP inline documentation standards using PHPDoc format following WordPress core guidelines."
applyTo: "**/*.php"
---

# PHP Inline Documentation Instructions

These guidelines follow the [WordPress PHP Inline Documentation Standards](https://github.com/WordPress/wpcs-docs/blob/master/inline-documentation-standards/php.md) for consistent, comprehensive code documentation.

## File Headers

### Plugin/Theme Files
```php
<?php
/**
 * Plugin/Theme Name
 *
 * Brief description of the file's purpose and functionality.
 *
 * @package     Package_Name
 * @subpackage  Subpackage_Name (optional)
 * @since       1.0.0
 * @author      Author Name
 * @copyright   Copyright information
 * @license     License information
 * @link        https://example.com
 */
```

### Class Files
```php
<?php
/**
 * Class description
 *
 * @package Package_Name
 * @since   1.0.0
 */
class My_Class {
```

## Function Documentation

### Basic Function
```php
/**
 * Brief description of the function.
 *
 * Longer description if needed, explaining the function's purpose,
 * behavior, and any important notes.
 *
 * @since 1.0.0
 *
 * @param string $param1 Description of parameter.
 * @param int    $param2 Optional. Description of optional parameter. Default 0.
 * @param array  $param3 {
 *     Optional. Array of arguments.
 *
 *     @type string $key1 Description of array key.
 *     @type int    $key2 Description of another key.
 * }
 * @return bool True on success, false on failure.
 */
function my_function( $param1, $param2 = 0, $param3 = array() ) {
```

### Hook Documentation
```php
/**
 * Filters the example filter.
 *
 * @since 1.0.0
 *
 * @param string $value The filtered value.
 * @param int    $id    The item ID.
 */
$filtered_value = apply_filters( 'example_filter', $value, $id );

/**
 * Fires when an example action occurs.
 *
 * @since 1.0.0
 *
 * @param string $action The action that occurred.
 * @param int    $user_id The user ID.
 */
do_action( 'example_action', $action, $user_id );
```

## Class Documentation

### Class Definition
```php
/**
 * Class for handling example functionality.
 *
 * @since 1.0.0
 */
class Example_Handler {

    /**
     * Class property description.
     *
     * @since 1.0.0
     * @var string
     */
    public $property;

    /**
     * Constructor.
     *
     * @since 1.0.0
     *
     * @param string $param Constructor parameter description.
     */
    public function __construct( $param ) {
```

### Method Documentation
```php
/**
 * Method description.
 *
 * @since 1.0.0
 *
 * @param string $param Method parameter.
 * @return string Method return value.
 */
public function example_method( $param ) {
```

## Required Tags

### @since
- **Required** for all functions, classes, methods, and properties
- Indicates the version when the element was introduced
- Use semantic versioning (e.g., 1.0.0)

### @param
- **Required** for all function/method parameters
- Format: `@param type $name Description.`
- Include default values for optional parameters
- Use array notation for complex array parameters

### @return
- **Required** for functions that return values
- Omit for void functions
- Include type and description
- Use `@return void` only when explicitly needed

## Optional Tags

### @throws
```php
/**
 * Function that might throw an exception.
 *
 * @since 1.0.0
 *
 * @throws InvalidArgumentException If parameter is invalid.
 */
```

### @todo
```php
/**
 * Function with future improvements planned.
 *
 * @since 1.0.0
 *
 * @todo Add caching mechanism.
 * @todo Improve error handling.
 */
```

### @deprecated
```php
/**
 * Deprecated function.
 *
 * @since 1.0.0
 * @deprecated 2.0.0 Use new_function() instead.
 *
 * @see new_function()
 */
```

## Type Definitions

### Scalar Types
- `string` - String values
- `int` - Integer values  
- `float` - Float values
- `bool` - Boolean values
- `array` - Array values
- `object` - Object instances
- `resource` - Resource handles
- `null` - Null values
- `mixed` - Multiple possible types

### WordPress Types
- `WP_Post` - Post objects
- `WP_User` - User objects
- `WP_Query` - Query objects
- `WP_Error` - Error objects

### Union Types
```php
/**
 * @param string|int $value String or integer value.
 * @param WP_Post|int $post Post object or post ID.
 */
```

## Array Documentation

### Simple Arrays
```php
/**
 * @param array $items Array of items.
 */
```

### Detailed Arrays
```php
/**
 * @param array $args {
 *     Optional. Array of arguments.
 *
 *     @type string $title       The title. Default 'Default Title'.
 *     @type int    $count       Number of items. Default 10.
 *     @type bool   $show_all    Whether to show all items. Default false.
 *     @type array  $meta_query  WP_Meta_Query arguments. See WP_Meta_Query.
 * }
 */
```

## Best Practices

### Formatting
- Use tabs for indentation (with spaces reserved for alignment) to follow the WordPress PHP coding standards
- Align parameter descriptions
- Keep line lengths reasonable (typically under 80-120 characters)
- Use sentence case for descriptions
- End descriptions with periods

### Content
- Write clear, concise descriptions
- Explain the "why" not just the "what"
- Include examples for complex functions
- Document side effects and important behavior
- Cross-reference related functions with `@see`

### WordPress Specific
- Follow WordPress coding standards
- Use WordPress-specific types where appropriate
- Document hooks with proper formatting
- Include capability checks in documentation where relevant
- Reference WordPress core functions appropriately

## Common Patterns

### WordPress Hooks
```php
// Action hooks
add_action( 'wp_enqueue_scripts', 'my_enqueue_scripts' );

/**
 * Enqueue scripts and styles.
 *
 * @since 1.0.0
 */
function my_enqueue_scripts() {

// Filter hooks
add_filter( 'the_content', 'my_content_filter' );

/**
 * Filter the content.
 *
 * @since 1.0.0
 *
 * @param string $content The post content.
 * @return string Modified content.
 */
function my_content_filter( $content ) {
```

### WordPress Functions
```php
/**
 * Get post meta with fallback.
 *
 * @since 1.0.0
 *
 * @param int    $post_id Post ID.
 * @param string $key     Meta key.
 * @param mixed  $default Default value if meta doesn't exist.
 * @return mixed Meta value or default.
 */
function get_post_meta_with_fallback( $post_id, $key, $default = '' ) {
```
