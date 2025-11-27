---
file_type: "instructions"
title: "Inline Documentation Standards"
description: "Canonical index for all inline documentation standards across languages and file types in LightSpeedWP projects."
version: "v2.0"
last_updated: "2025-11-27"
applyTo: "**/*"
owners: ["lightspeedwp/maintainers"]
tags:
  [
    "documentation",
    "inline-docs",
    "jsdoc",
    "phpdoc",
    "comments",
    "coding-standards",
  ]
domain: "generic"
stability: "stable"
references:
  - path: "./inline-docs/README.md"
    description: "Detailed inline documentation directory README"
  - path: "./coding-standards.instructions.md"
    description: "Unified coding standards"
  - path: "./docs.instructions.md"
    description: "Documentation standards"
  - path: "../prompts/audit-jsdoc.prompt.md"
    description: "JSDoc audit prompt"
  - path: "../prompts/audit-phpdoc.prompt.md"
    description: "PHPDoc audit prompt"
---

# 📝 Inline Documentation Standards

![Documentation Badge](https://img.shields.io/badge/inline--docs-comprehensive-blue?style=flat-square)
![Standards Badge](https://img.shields.io/badge/standards-enforced-brightgreen?style=flat-square)

This is the canonical index for all inline documentation standards in LightSpeedWP projects. Inline documentation includes comments, docblocks, annotations, and embedded documentation within source code files.

## 📖 Overview

Inline documentation serves multiple purposes:

- **Developer Understanding** — Explains intent, context, and non-obvious logic
- **API Documentation** — Generates reference docs from code comments
- **IDE Support** — Provides intellisense, autocomplete, and hover information
- **Maintenance** — Helps future developers understand and modify code safely
- **Accessibility** — Supports screen readers and assistive technologies

### Core Principles

1. **Explain "why", not "what"** — Code shows what happens; docs explain why
2. **Keep docs close to code** — Minimise drift between implementation and documentation
3. **Use standard formats** — Follow language-specific conventions (JSDoc, PHPDoc, etc.)
4. **Be accurate** — Update documentation when code changes
5. **Be concise** — Avoid over-commenting trivial code

---

## 📋 Inline Documentation Files Index

The following table lists all inline documentation instruction files in the [`inline-docs/`](./inline-docs/) folder:

| File                                                                             | Language/Format       | File Types                   | Purpose                                             | Key Tags                                     |
| -------------------------------------------------------------------------------- | --------------------- | ---------------------------- | --------------------------------------------------- | -------------------------------------------- |
| [inline-jsdoc.instructions.md](./inline-docs/inline-jsdoc.instructions.md)       | JavaScript/TypeScript | `.js`, `.jsx`, `.ts`, `.tsx` | JSDoc blocks for functions, classes, and components | `@param`, `@returns`, `@example`, `@since`   |
| [inline-phpdoc.instructions.md](./inline-docs/inline-phpdoc.instructions.md)     | PHP                   | `.php`                       | PHPDoc blocks following WordPress standards         | `@param`, `@return`, `@since`, `@throws`     |
| [inline-css.instructions.md](./inline-docs/inline-css.instructions.md)           | CSS/SCSS/Sass         | `.css`, `.scss`, `.sass`     | Section headers and rule comments                   | BEM naming, Stylelint directives             |
| [inline-markdown.instructions.md](./inline-docs/inline-markdown.instructions.md) | Markdown              | `.md`                        | Documentation file standards                        | Frontmatter, headings, code blocks           |
| [inline-yaml.instructions.md](./inline-docs/Inline-yaml.instructions.md)         | YAML                  | `.yml`, `.yaml`              | Workflow and config documentation                   | GitHub Actions, anchors/aliases              |
| [inline-i18n.instructions.md](./inline-docs/inline-i18n.instructions.md)         | Internationalisation  | All languages                | Translation strings and comments                    | `translators:`, text domains, `.pot/.po/.mo` |
| [inline-xml.instructions.md](./inline-docs/inline-xml.instructions.md)           | XML                   | `.xml`                       | XML comments and schema validation                  | RSS, Android, config files                   |
| [inline-txt.instructions.md](./inline-docs/inline-txt.instructions.md)           | Plain Text            | `.txt`                       | WordPress readme.txt and plain text                 | Plugin headers, changelog sections           |

---

## 🎯 What to Document

### Must Document ✅

- **Public APIs** — Functions, methods, and classes exposed for external use
- **Complex Logic** — Algorithms, business rules, or non-obvious implementations
- **Parameters & Returns** — Types, constraints, and expected values
- **Side Effects** — Database writes, API calls, state mutations
- **Breaking Changes** — Deprecations and migration paths
- **WordPress Hooks** — Actions and filters with parameters
- **Security Considerations** — Sanitisation, escaping, capability checks

### Usually Don't Document ❌

- **Trivial Code** — Self-explanatory getters, setters, or simple operations
- **Language Features** — Standard patterns that any developer would recognise
- **Redundant Information** — Don't repeat what the code already clearly shows

---

## 📊 Documentation Coverage by Language

### JavaScript/TypeScript (JSDoc)

```javascript
/**
 * Calculate total price with tax.
 *
 * @param {number} amount    - Base amount before tax.
 * @param {number} [rate=0.15] - Tax rate as decimal.
 * @returns {number} Total amount including tax.
 * @since 1.0.0
 *
 * @example
 * calculateTotal(100, 0.15); // Returns 115
 */
function calculateTotal(amount, rate = 0.15) {
  return amount * (1 + rate);
}
```

See [inline-jsdoc.instructions.md](./inline-docs/inline-jsdoc.instructions.md) for comprehensive JSDoc standards.

### PHP (PHPDoc)

```php
/**
 * Calculate total price with VAT.
 *
 * @since 1.0.0
 *
 * @param float $amount Base amount before VAT.
 * @param float $rate   VAT rate as decimal. Default 0.15.
 * @return float Total amount including VAT.
 */
function lswp_calculate_total( $amount, $rate = 0.15 ) {
    return round( $amount * ( 1 + $rate ), 2 );
}
```

See [inline-phpdoc.instructions.md](./inline-docs/inline-phpdoc.instructions.md) for WordPress PHPDoc standards.

### CSS (Section Headers)

```css
/* =====================================
   Component: Tour Card
   Purpose: Layout and state styles
   ===================================== */

.tour-card__price {
  /* Align currency glyphs across varying font metrics */
  font-variant-numeric: tabular-nums;
}
```

See [inline-css.instructions.md](./inline-docs/inline-css.instructions.md) for CSS documentation standards.

---

## 🔧 Required Tags by Language

| Tag                    | JavaScript         | PHP                | Purpose                 |
| ---------------------- | ------------------ | ------------------ | ----------------------- |
| `@param`               | ✅ Required        | ✅ Required        | Document each parameter |
| `@returns` / `@return` | ✅ Required        | ✅ Required        | Document return value   |
| `@since`               | ✅ Recommended     | ✅ Required        | Version introduced      |
| `@throws`              | ✅ When applicable | ✅ When applicable | Document exceptions     |
| `@deprecated`          | ✅ When applicable | ✅ When applicable | Mark deprecated APIs    |
| `@example`             | ✅ Recommended     | Optional           | Usage examples          |
| `@see`                 | Optional           | Optional           | Cross-references        |

---

## 🌍 Internationalisation (i18n)

All user-facing strings must be wrapped in translation functions with translator comments:

```php
/* translators: %s: Tour name */
printf( esc_html__( 'Book %s now', 'text-domain' ), $tour_name );
```

```javascript
// translators: %s is the destination city
const label = sprintf(__("Tours to %s", "text-domain"), city);
```

See [inline-i18n.instructions.md](./inline-docs/inline-i18n.instructions.md) for complete i18n documentation standards.

---

## 🔄 Integration with Tooling

### Linting & Validation

Inline documentation is validated through:

- **ESLint** — JSDoc validation with `eslint-plugin-jsdoc`
- **PHPCS** — PHPDoc validation with WordPress coding standards
- **Pre-commit hooks** — Documentation checks before commit

### Automation

```bash
# Audit JSDoc coverage
npm run prompt:audit-jsdoc

# Audit PHPDoc coverage
composer run audit:phpdoc

# Add inline documentation
npm run prompt:inline-documentation
```

### CI/CD Integration

- `.github/workflows/lint.yml` — Validates documentation in PRs
- `.github/workflows/quality-gates.yml` — Enforces documentation coverage

---

## 📚 Related Documentation

- [Coding Standards](./coding-standards.instructions.md) — Unified coding standards
- [Documentation Standards](./docs.instructions.md) — General documentation guidelines
- [Markdown Standards](./markdown.instructions.md) — Markdown formatting rules
- [WordPress PHP Standards](./php-wordpress.instructions.md) — WordPress-specific PHP guidelines
- [JavaScript/React Standards](./javascript-react.instructions.md) — JavaScript development standards

---

## 🔗 External References

- [WordPress PHP Documentation Standards](https://developer.wordpress.org/coding-standards/inline-documentation-standards/php/)
- [WordPress JavaScript Documentation Standards](https://developer.wordpress.org/coding-standards/inline-documentation-standards/javascript/)
- [JSDoc Reference](https://jsdoc.app/)
- [PHPDoc Reference](https://docs.phpdoc.org/)

---

*This file is the canonical index for all inline documentation standards in LightSpeedWP projects. For detailed guidance on a specific language or format, refer to the corresponding file in the [`inline-docs/`](./inline-docs/) folder.*
