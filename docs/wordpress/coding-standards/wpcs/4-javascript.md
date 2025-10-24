# 4. JavaScript Coding Standards

## Structure & Refactoring

- Small, single-purpose modules; avoid duplication; prefer ES modules.
- Limit globals; prefer closures or modules.

## Style

- **Indentation**: **Tabs**.
- **Semicolons**: Always.
- **Quotes**: Single quotes; template literals for interpolation.
- **Equality**: `===` / `!==`.
- **Line breaks**: Break long chains one call per line.

## Multi-line & Chaining

```js
return collection.filter(isValid).map(normalize).reduce(toIndex, {});
```

## Assignments & Globals

- Avoid mutating globals; pass dependencies explicitly.
- Use const/let; avoid var.

## Naming

- Functions/vars: camelCase; Classes: UpperCamelCase.
- Events and actions: clear, namespaced where appropriate.

## Switch / Flow

- Default case is mandatory; use break unless there's an explicit, commented fall-through.

## Linting & Tooling

- ESLint with WPCS rules where available; Prettier optional if compatible with rules.
- JSDoc for public APIs.

## References

- [WPCS JS](https://github.com/WordPress/wpcs-docs/blob/master/wordpress-coding-standards/javascript.md)
- [WP JS](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/)
