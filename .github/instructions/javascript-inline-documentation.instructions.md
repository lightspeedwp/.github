---
description: "WordPress JavaScript inline documentation standards using JSDoc format following WordPress core guidelines."
applyTo: "**/*.js"
---

# JavaScript Inline Documentation Instructions

These guidelines follow the [WordPress JavaScript Inline Documentation Standards](https://github.com/WordPress/wpcs-docs/blob/master/inline-documentation-standards/javascript.md) for consistent, comprehensive code documentation.

## File Headers

### JavaScript Files

```javascript
/**
 * File description
 *
 * Brief description of the file's purpose and functionality.
 *
 * @package Package_Name
 * @since   1.0.0
 * @author  Author Name
 */
```

### Module Files

```javascript
/**
 * Module Name
 *
 * Description of the module's functionality.
 *
 * @package Package_Name
 * @since   1.0.0
 */
```

## Function Documentation

### Basic Function

```javascript
/**
 * Brief description of the function.
 *
 * Longer description if needed, explaining the function's purpose,
 * behavior, and any important notes.
 *
 * @since 1.0.0
 *
 * @param {string}   param1           Description of parameter.
 * @param {number}   [param2=0]       Optional parameter with default value.
 * @param {Object}   [param3={}]      Optional object parameter.
 * @param {string}   param3.key1      Description of object property.
 * @param {number}   param3.key2      Description of another property.
 * @return {boolean} True on success, false on failure.
 */
function myFunction( param1, param2 = 0, param3 = {} ) {
```

### Arrow Functions

```javascript
/**
 * Arrow function description.
 *
 * @since 1.0.0
 *
 * @param {string} value Input value to process.
 * @return {string} Processed value.
 */
const processValue = ( value ) => {
```

### Async Functions

```javascript
/**
 * Async function description.
 *
 * @since 1.0.0
 * @async
 *
 * @param {string} url API endpoint URL.
 * @return {Promise<Object>} Promise resolving to response data.
 * @throws {Error} When request fails.
 */
async function fetchData( url ) {
```

## Class Documentation

### Class Definition

```javascript
/**
 * Class for handling example functionality.
 *
 * @since 1.0.0
 */
class ExampleHandler {

    /**
     * Constructor.
     *
     * @since 1.0.0
     *
     * @param {Object} options Configuration options.
     * @param {string} options.selector CSS selector for target elements.
     * @param {boolean} [options.autoInit=true] Whether to auto-initialize.
     */
    constructor( options ) {
```

### Method Documentation

```javascript
/**
 * Method description.
 *
 * @since 1.0.0
 *
 * @param {string} param Method parameter.
 * @return {string} Method return value.
 */
exampleMethod( param ) {
```

### Static Methods

```javascript
/**
 * Static method description.
 *
 * @since 1.0.0
 * @static
 *
 * @param {number} value Input value.
 * @return {number} Calculated result.
 */
static calculate( value ) {
```

## WordPress Specific Documentation

### WordPress Hooks (JavaScript)

```javascript
/**
 * Hook into WordPress block editor.
 *
 * @since 1.0.0
 */
wp.hooks.addFilter(
    'blocks.registerBlockType',
    'my-plugin/modify-block',
    /**
     * Modify block registration.
     *
     * @since 1.0.0
     *
     * @param {Object} settings Block settings.
     * @param {string} name     Block name.
     * @return {Object} Modified block settings.
     */
    function( settings, name ) {
```

### WordPress Components

```javascript
/**
 * Custom WordPress block component.
 *
 * @since 1.0.0
 *
 * @param {Object}   props            Component props.
 * @param {string}   props.title      Block title.
 * @param {Function} props.onChange   Change handler function.
 * @return {Element} React element.
 */
const MyBlockComponent = ( { title, onChange } ) => {
```

### WordPress API Calls

```javascript
/**
 * Fetch posts from WordPress REST API.
 *
 * @since 1.0.0
 * @async
 *
 * @param {Object}  args              Query arguments.
 * @param {number}  [args.per_page=10] Posts per page.
 * @param {string}  [args.status='publish'] Post status.
 * @return {Promise<Array>} Promise resolving to array of posts.
 */
async function fetchPosts( args = {} ) {
```

## Required Tags

### @since
- **Required** for all functions, classes, methods, and properties
- Indicates the version when the element was introduced
- Use semantic versioning (e.g., 1.0.0)

### @param
- **Required** for all function/method parameters
- Format: `@param {type} [name=default] Description.`
- Use square brackets for optional parameters
- Include default values when applicable

### @return
- **Required** for functions that return values
- Omit for void functions
- Include type and description
- Use `@return {void}` only when explicitly needed

## Type Definitions

### Primitive Types
- `{string}` - String values
- `{number}` - Numeric values
- `{boolean}` - Boolean values
- `{null}` - Null values
- `{undefined}` - Undefined values
- `{*}` - Any type (avoid when possible)

### Complex Types
- `{Array}` - Array of any type
- `{Array<string>}` - Array of strings
- `{Object}` - Plain object
- `{Function}` - Function reference
- `{Promise}` - Promise object
- `{Promise<string>}` - Promise resolving to string

### WordPress Types
- `{Element}` - React element (WordPress blocks)
- `{WP_Block_Type}` - WordPress block type object
- `{WP_Post}` - WordPress post object (from API)

### Union Types
```javascript
/**
 * @param {string|number} value String or number value.
 * @param {Element|null} element React element or null.
 */
```

## Optional Tags

### @throws
```javascript
/**
 * Function that might throw an error.
 *
 * @since 1.0.0
 *
 * @throws {Error} When parameter is invalid.
 * @throws {TypeError} When parameter type is wrong.
 */
```

### @deprecated
```javascript
/**
 * Deprecated function.
 *
 * @since 1.0.0
 * @deprecated 2.0.0 Use newFunction() instead.
 *
 * @see newFunction
 */
```

### @todo
```javascript
/**
 * Function with future improvements planned.
 *
 * @since 1.0.0
 *
 * @todo Add error handling.
 * @todo Optimize performance.
 */
```

### @example
```javascript
/**
 * Format a price value.
 *
 * @since 1.0.0
 *
 * @param {number} price Price value.
 * @param {string} [currency='$'] Currency symbol.
 * @return {string} Formatted price string.
 *
 * @example
 * formatPrice( 19.99 );
 * // Returns: '$19.99'
 *
 * @example
 * formatPrice( 29.50, '€' );
 * // Returns: '€29.50'
 */
```

## Object Documentation

### Simple Objects
```javascript
/**
 * @param {Object} config Configuration object.
 */
```

### Detailed Objects
```javascript
/**
 * @param {Object}  options               Configuration options.
 * @param {string}  options.selector      CSS selector.
 * @param {boolean} [options.autoInit=true] Auto-initialize flag.
 * @param {Object}  [options.callbacks={}] Callback functions.
 * @param {Function} options.callbacks.onInit Initialization callback.
 * @param {Function} options.callbacks.onError Error callback.
 */
```

## Event Documentation

### Event Handlers
```javascript
/**
 * Handle click events.
 *
 * @since 1.0.0
 *
 * @param {Event} event DOM event object.
 * @param {Element} event.target Event target element.
 */
function handleClick( event ) {
```

### Custom Events
```javascript
/**
 * Dispatch custom event.
 *
 * @since 1.0.0
 *
 * @fires CustomEvent#my-custom-event
 * @param {string} message Event message.
 */
function dispatchCustomEvent( message ) {
    /**
     * My custom event.
     *
     * @event CustomEvent#my-custom-event
     * @type {Object}
     * @property {string} message Event message.
     */
```

## Best Practices

### Formatting
- Use tabs for indentation in line with the WordPress JavaScript coding standards
- Align parameter descriptions when helpful
- Keep line lengths reasonable (under 80-120 characters)
- Use sentence case for descriptions
- End descriptions with periods

### Content
- Write clear, concise descriptions
- Explain the "why" not just the "what"
- Include examples for complex functions
- Document side effects and important behavior
- Cross-reference related functions with `@see`

### WordPress Block Editor
- Document block attributes clearly
- Explain block render behavior
- Document component props thoroughly
- Include accessibility considerations
- Reference WordPress APIs appropriately

## Common Patterns

### WordPress Block Registration
```javascript
/**
 * Register a custom WordPress block.
 *
 * @since 1.0.0
 *
 * @see registerBlockType
 */
registerBlockType( 'my-plugin/my-block', {
    /**
     * Block edit component.
     *
     * @since 1.0.0
     *
     * @param {Object}   props              Block props.
     * @param {Object}   props.attributes   Block attributes.
     * @param {Function} props.setAttributes Attribute setter function.
     * @return {Element} Block edit element.
     */
    edit: ( { attributes, setAttributes } ) => {
```

### WordPress API Integration
```javascript
/**
 * WordPress API client wrapper.
 *
 * @since 1.0.0
 */
class WPAPIClient {
    /**
     * Make API request.
     *
     * @since 1.0.0
     * @async
     *
     * @param {string} endpoint API endpoint path.
     * @param {Object} [options={}] Request options.
     * @return {Promise<Object>} API response data.
     * @throws {Error} When request fails.
     */
    async request( endpoint, options = {} ) {
```

### Event Handling
```javascript
/**
 * Initialize event handlers.
 *
 * @since 1.0.0
 */
function initEventHandlers() {
    document.addEventListener( 'DOMContentLoaded', 
        /**
         * Handle DOM content loaded.
         *
         * @since 1.0.0
         */
        function() {
```
