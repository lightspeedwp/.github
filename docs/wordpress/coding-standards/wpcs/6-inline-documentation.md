# 6. Inline Documentation Standards (PHP & JS)

Clear, consistent documentation accelerates onboarding and reduces regressions.

## 6.1 PHP Documentation Standards

**Document**: functions, methods, classes, hooks, globals, files.
**DocBlock**: short summary; blank line; details; tags.

```php
/**
 * Short summary.
 *
 * Longer description explaining context and side effects.
 *
 * @since 1.0.0
 * @param string $name User name.
 * @return string Greeting.
 */
function ls_greet( $name ) {
 return "Hi {$name}";
}
```

Tags: @since, @param, @return, @link, @see, @global, @deprecated.

## Refs

- <https://developer.wordpress.org/coding-standards/inline-documentation-standards/php/>
- <https://github.com/WordPress/wpcs-docs/blob/master/inline-documentation-standards/php.md>

# 6.2 JavaScript Documentation Standards

Document: files, modules, functions, classes, public members.

```js
/**
 * Create a greeting.
 *
 * @since 1.0.0
 * @param {string} name - User name.
 * @return {string} Greeting text.
 */
export function greet(name) {
  return `Hi ${name}`;
}
```

## Refs

- <https://developer.wordpress.org/coding-standards/inline-documentation-standards/javascript/>
- <https://github.com/WordPress/wpcs-docs/blob/master/inline-documentation-standards/javascript.md>
- Context: <https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/>
