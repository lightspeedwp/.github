# 2. PHP Coding Standards

## General

- **Indentation**: **Tabs** for indentation; spaces for alignment.
- **Encoding**: UTF-8; Unix line endings.
- **Errors**: No PHP notices/warnings in normal operation and tests.

## Naming

- Functions/vars: `snake_case`
- Classes/traits/interfaces: `UpperCamelCase`
- Constants: `UPPER_SNAKE_CASE`
- Files: lowercase hyphenated (e.g., `class-cart-service.php`, `helpers.php`)

## Spacing & Formatting

- One space around binary operators (`=`, `===`, `+`, `.`), after commas, and after control keywords.
- Braces on the same line; always use braces even for single statements.
- One blank line before `return` when it aids clarity.

## Declare / Namespace / Imports

- `declare(strict_types=1);` **not used** in WordPress core code; avoid unless project-scoped.
- Namespaces and `use` go at the top; group logically.

## OOP & Singletons

- Prefer dependency injection and small, composable objects.
- Avoid global state and singletons (testability and lifecycle pains).

## Control Structures

```php
if ( $condition ) {
 // …
} elseif ( $other_condition ) {
 // …
} else {
 // …
}
switch with default and break; avoid fall-through unless commented.
```

## Operators & Strings

- Concatenate with spaces: `$greeting = 'Hi ' . $name;`
- Prefer strict comparisons (`===` / `!==`) when safe.
- Prefer strict comparisons (`===` / `!==`) by default.
- Avoid loose equality with mixed types (`0`, `'0'`, `''`, `false`, `null`).
- Example:

```php
if ( $count === 0 ) { /* … */ }
if ( $value === '' )  { /* … */ }
if ( $maybe === null ) { /* … */ }
// Arrays/lists:
if ( in_array( $role, [ 'editor', 'admin' ], true ) ) { /* … */ } // third arg enforces strict
```

## Database

- Always prepare: `$wpdb->prepare( 'SELECT … WHERE id = %d', $id )`
- Escape output with `esc_html()`, `esc_attr()`, `wp_kses_post()`, etc.

## Comments & DocBlocks

File header where appropriate; DocBlocks for public functions/classes.

Tags: @since, @param, @return, @link, @see, @deprecated.

## Recommendations

- Hooks: descriptive names; document args; avoid doing heavy work in hooks.
- i18n: wrap user-facing strings in translation functions, with contexts where needed.
- Testing: unit/integration where meaningful; avoid logic in templates.

## References

- WP PHP: <https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/>
- WPCS PHP: <https://github.com/WordPress/wpcs-docs/blob/master/wordpress-coding-standards/php.md>
