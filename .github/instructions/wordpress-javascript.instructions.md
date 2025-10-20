---
applyTo: ['**/*.js', '**/*.jsx', '**/*.mjs', '**/*.cjs']
description: "Apply WordPress JavaScript coding standards (formatting, naming, patterns)."
last_updated: "2025-10-19"
version: "v1.0"
owners: ["LightSpeed Engineering"]
---

# Mission
Define how to write and structure JavaScript code that aligns with the WordPress coding standards and LightSpeed’s engineering practices.

# Language & Frameworks
- Modern ECMAScript (ES6+) syntax. Use modules rather than global scripts.
- WordPress packages (e.g. `@wordpress/scripts`, `@wordpress/data`) and React for block development.

# Project Structure
- Organise scripts under `src/js/` or `assets/js/` with a clear folder hierarchy per feature or component.
- Name files using `lowercase-hyphenated.js` for modules and `UpperCamelCase.jsx` for React components.

# Coding Standards
- Use **2‑space indentation**, single quotes and semicolons.
- Prefer `const` and `let` over `var` and always use strict equality (`===`/`!==`).
- Avoid polluting the global scope; wrap scripts in modules or IIFEs.
- Name variables and functions descriptively using `lowerCamelCase`; classes should use `UpperCamelCase`.
- Document public functions, classes and modules using JSDoc with `@param` and `@returns` tags.
- Avoid complex nested callbacks; favour promises or async/await for asynchronous code.

# Testing & Quality
- Use **ESLint** with the WordPress ruleset or LightSpeed’s custom config. Fix lint errors before committing.
- Format code with Prettier (following ESLint rules). Use Jest for unit tests and Playwright for integration tests.

# Performance & Security
- Prefer modern browser APIs; avoid heavy polyfills unless necessary.
- Escape user‑generated content when injecting into the DOM.
- Internationalise strings using WordPress i18n APIs (e.g. `wp.i18n.__`).

# Documentation
- Include JSDoc blocks for exported functions and classes. Provide `@since` for new APIs and `@deprecated` where applicable.

# Examples
```js
// Good: module scope and JSDoc
/**
 * Filters an array of posts by author ID.
 * @param {Array} posts    Array of post objects.
 * @param {number} author  The author ID.
 * @returns {Array}        Filtered array of posts.
 */
export function filterPostsByAuthor(posts, author) {
  return posts.filter((post) => post.author === author);
}
```

# Checklists
- [ ] ESLint passes without errors.
- [ ] All exported functions/classes are documented with JSDoc.
- [ ] Asynchronous code uses Promises or async/await instead of callbacks.

# References
- https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/
