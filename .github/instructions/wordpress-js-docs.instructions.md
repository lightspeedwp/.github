---
applyTo: ['**/*.js', '**/*.jsx', '**/*.mjs', '**/*.cjs']
description: "Enforce WordPress JavaScript inline documentation (JSDoc)."
last_updated: "2025-10-19"
version: "v1.0"
owners: ["LightSpeed Engineering"]
---

# Mission
Document public JavaScript modules, functions and classes using JSDoc so that code is self‑describing and maintainable.

# Language & Frameworks
- JavaScript (ES6+), including React components and modules.

# Coding Standards
- Begin each JSDoc block with a summary describing the purpose of the function or class.
- Use `@param` tags for each argument with its type and description. Describe optional parameters and default values.
- Use `@returns` to describe the return type and meaning. For async functions, specify the resolved value.
- Include `@example` blocks to demonstrate typical usage when helpful.
- Document events, filters and deprecations using `@fires`, `@deprecated` and related tags.

# Testing & Quality
- Run ESLint with the JSDoc plugin to ensure documentation blocks are well formed.
- Validate examples manually or with automated tools like `doctest`.

# Examples
```js
/**
 * Formats a date as DD/MM/YYYY.
 *
 * @param {Date} date The date to format.
 * @returns {string} The formatted date.
 * @example
 * formatDate(new Date('2025-01-01')); // "01/01/2025"
 */
export function formatDate(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}
```

# Checklists
- [ ] JSDoc blocks are present for all exported functions and classes.
- [ ] `@param` and `@returns` tags accurately describe the types and behaviour.
- [ ] Examples compile and demonstrate typical usage.

# References
- https://developer.wordpress.org/coding-standards/inline-documentation-standards/javascript/
