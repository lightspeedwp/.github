---
title: "Inline Documentation Standards"
description: "Code documentation standards for comments, docstrings, and inline docs across all programming languages."
version: "v1.0"
last_updated: "2025-11-24"
file_type: "documentation"
owners: ["lightspeedwp/maintainers"]
tags: ["documentation", "inline-docs", "coding-standards"]
---

# Inline Documentation Standards Directory

This folder contains guidelines and standards for inline code documentation, comments, docstrings, and inline documentation across all programming languages used in LightSpeed projects.

## Documentation by Language/Format

| Language/Format | File                              | Format                       | Coverage             |
| --------------- | --------------------------------- | ---------------------------- | -------------------- |
| **JavaScript**  | `inline-jsdoc.instructions.md`    | JSDoc blocks                 | `.js, .jsx`          |
| **TypeScript**  | `inline-jsdoc.instructions.md`    | JSDoc blocks                 | `.ts, .tsx`          |
| **PHP**         | `inline-phpdoc.instructions.md`   | DocBlocks                    | `.php`               |
| **Markdown**    | `inline-markdown.instructions.md` | Markdown comments            | `.md`                |
| **YAML**        | `inline-yaml.instructions.md`     | YAML comments                | `.yml, .yaml`        |
| **CSS**         | `inline-css.instructions.md`      | CSS comments                 | `.css, .scss, .sass` |
| **i18n**        | `inline-i18n.instructions.md`     | Internationalization strings | All languages        |
| **XML**         | `inline-xml.instructions.md`      | XML comments                 | `.xml`               |
| **Text**        | `inline-txt.instructions.md`      | Plain text notes             | `.txt`               |

## Key Principles

All inline documentation should:

- **Explain the "why"**, not the "what" (code already shows what)
- **Be maintainable** - Keep docs close to the code they document
- **Follow standards** - Use language-specific conventions (JSDoc, DocBlocks, etc.)
- **Be accurate** - Update docs when code changes
- **Be concise** - Avoid over-commenting trivial code
- **Support accessibility** - Clear, plain language for screen readers

## Standards Compliance

All inline documentation must comply with:

- [WordPress PHP Documentation Standards](https://developer.wordpress.org/coding-standards/inline-documentation-standards/php/)
- [WordPress JavaScript Documentation Standards](https://developer.wordpress.org/coding-standards/inline-documentation-standards/javascript/)
- [LightSpeed Coding Standards](../coding-standards.instructions.md)
- [Accessibility Guidelines](../a11y.instructions.md)

## Common Documentation Patterns

### Function/Method Documentation

```javascript
/**
 * Processes user data and returns filtered results
 *
 * @param {string} userId - The unique user identifier
 * @param {Object} options - Configuration options
 * @param {boolean} options.includeArchived - Include archived records
 * @returns {Promise<Array>} Array of filtered user records
 * @throws {Error} When user ID is invalid
 *
 * @example
 * const results = await processUserData('user-123', { includeArchived: true });
 */
async function processUserData(userId, options = {}) {
  // implementation
}
```

### Class Documentation

```php
/**
 * Manages user authentication and session handling
 *
 * Handles login/logout, token management, and session persistence.
 * Integrates with WordPress user system and custom token store.
 *
 * @see \WP_User WordPress user class
 * @package LightSpeed\Auth
 * @since 1.0.0
 */
class AuthenticationManager {
  // implementation
}
```

### Inline Comments

```javascript
// ❌ Bad - Explains what the code already shows
count = count + 1; // increment count

// ✅ Good - Explains why we're doing this
// Skip incrementing counter for archived items per feature #1234
if (!item.archived) {
  count = count + 1;
}
```

## Documentation Coverage

### Must Document

- ✅ Public functions, methods, and classes
- ✅ Complex algorithms or business logic
- ✅ Non-obvious parameters or return types
- ✅ Breaking changes or deprecations
- ✅ Integration points with external systems
- ✅ Security or performance considerations

### Usually Don't Document

- ❌ Trivial getters/setters (if self-explanatory)
- ❌ Loop iterations doing obvious things
- ❌ Standard language features
- ❌ Well-known algorithms

## Tools & Validation

### JSDoc Validation

```bash
npm run audit:jsdoc
```

### PHP DocBlock Validation

```bash
composer lint
```

### CI/CD Integration

Documentation coverage is checked via:

- `.github/workflows/lint.yml` - Linting checks
- `.github/workflows/quality-gates.yml` - Quality gates
- Pre-commit hooks validate documentation

## Best Practices

### Do's ✅

- Keep docs near the code
- Use standard formats (JSDoc, DocBlocks)
- Include examples for complex functions
- Document error conditions
- Link to related documentation
- Update docs when code changes

### Don'ts ❌

- Don't comment obvious code
- Don't use vague language
- Don't duplicate information
- Don't leave outdated docs
- Don't mix multiple languages in comments

## Integration

Inline documentation standards are integrated with:

- `.github/instructions/coding-standards.instructions.md` - Main coding standards
- `.github/instructions/linting.instructions.md` - Code quality
- `.github/prompts/audit-jsdoc.prompt.md` - JSDoc audit prompts
- `.github/prompts/audit-phpdoc.prompt.md` - PHP documentation audit

## Automation

### Auto-fix Documentation

```bash
# Add JSDoc to JavaScript files
npm run prompt:audit-jsdoc

# Add DocBlocks to PHP files
npm run prompt:audit-phpdoc

# Add inline docs generally
npm run prompt:inline-documentation
```

## For New Languages

To add inline documentation standards for a new language:

1. Create `inline-<language>.instructions.md` in this folder
2. Document required format and conventions
3. Provide examples of well-documented code
4. Link to official standards documentation
5. Add entry to the table above
6. Update `.github/instructions/coding-standards.instructions.md`

---

For more information, see the [Coding Standards](../coding-standards.instructions.md) or reference [WordPress Inline Documentation](https://developer.wordpress.org/coding-standards/inline-documentation-standards/).
