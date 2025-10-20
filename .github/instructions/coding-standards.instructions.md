---
applyTo: '**/*'
title: "LightSpeed Coding Standards"
description: "Unified coding standards and best practices for all LightSpeed projects across languages and platforms."
author: "LightSpeedWP Team"
contributors:
  - name: "Ash Shaw"
    github: "ashleyshaw"
  - name: "LightSpeedWP"
    github: "lightspeedwp"
version: "1.1.0"
permalink: "/instructions/coding-standards"
license: "GPL-3.0"
type: "instructions"
mode: "agent"
tags:
  - coding-standards
  - php
  - javascript
  - html
  - css
  - python
  - yaml
  - markdown
  - accessibility
  - best-practices
categories:
  - documentation
  - instructions
  - guides
---

# LightSpeed Coding Standards

LightSpeed’s coding standards provide a consistent baseline for all projects, regardless of language, framework, or platform. These standards optimise for clarity, maintainability, scalability, accessibility and high‑quality outcomes. While we reference WordPress Coding Standards as a default foundation, these instructions are designed to be extensible to all languages in which we work.

> For WordPress-specific guidance, see the dedicated links below. For other languages, use these standards as a base and extend as needed.

---

## Core Principles

- **Clarity:** Write code that is self-explanatory, modular, and easy to review or extend.
- **Consistency:** Follow agreed formatting, naming and structure guidelines for each language.
- **Accessibility:** Ensure all user-facing code meets WCAG AA or better. [See our accessibility standards.](./wordpress-accessibility.instructions.md)
- **Security:** Never trust user input; escape and sanitise all dynamic output. Follow the [OWASP Top 10](https://owasp.org/www-project-top-ten/) for web security.
- **Performance:** Avoid premature optimisation, but never introduce known bottlenecks. Test for performance regressions.
- **Documentation:** All public APIs, functions, and complex logic must be documented inline using the appropriate docblock standard for the language.
- **Testing:** All code changes must include relevant tests and pass all linters before merging.
- **Linter Compliance:** Code must pass the designated linter(s) for the language and file type before review.

---

## How to Use These Standards

1. **Start here for general rules.**
2. **See the [Language & File-Type Specific Standards](#language--file-type-specific-standards)** section for more detail.
3. **Refer to linked instructions for deep dives, examples, and checklists.**
4. **When unsure:** Propose a safe, minimal solution and ask for clarification in review.

---

## Why Have Coding Standards?

- Avoid common coding errors and anti-patterns.
- Improve readability and maintainability.
- Enable faster onboarding and easier collaboration.
- Ensure that code appears as if written by a single, experienced engineer.
- Facilitate automated testing, linting, and code review.

---

## Language & File-Type Specific Standards

LightSpeed provides detailed instructions for common languages and artefacts. Use the links below for specifics, including formatting, naming, documentation, testing, and linting guidance.

### PHP

- [General PHP & WordPress PHP Standards](./wordpress-php.instructions.md)
- [PHP Inline Documentation Standards](./wordpress-php-docs.instructions.md)
- [Linting: PHP_CodeSniffer](./linting-php.instructions.md)

### JavaScript

- [JavaScript Coding Standards](./wordpress-javascript.instructions.md)
- [JavaScript Inline Documentation (JSDoc)](./wordpress-js-docs.instructions.md)
- [Linting: ESLint, Prettier](./linting-javascript.instructions.md)

### HTML

- [HTML Coding Standards](./wordpress-html.instructions.md)
- [Accessibility Standards](./wordpress-accessibility.instructions.md)
- [Linting: HTML Validator, pa11y, axe-core](./linting-html.instructions.md)

### CSS / SCSS

- [CSS Coding Standards](./wordpress-css.instructions.md)
- [Linting: stylelint](./linting-css.instructions.md)

### Markdown

- [Markdown Style Guide](./markdown-style-guide.instructions.md)
- [Linting: markdownlint](./linting-markdown.instructions.md)

### YAML

- [Linting: yamllint, actionlint](./linting-yaml.instructions.md)

### Python

- [Linting: Black, Ruff](./linting-python.instructions.md)

### Shell Scripts

- [Linting: shellcheck, bats](./linting-shell.instructions.md)

### JSON & Schemas

- [JSON Schema Authoring & Validation](./json-schema.instructions.md)
- [Linting: AJV, Prettier](./linting-json.instructions.md)

### Tests

- [General Testing Standards](./tests.instructions.md)
- [Playwright Testing (E2E/Browser)](./playwright-tests.instructions.md)
- [Linting Tests](./linting-tests.instructions.md)

### Frontmatter

- [YAML Frontmatter Standards](./frontmatter.instructions.md)

---

## General Coding Rules

- **Naming:** Use meaningful, descriptive names for all variables, functions, classes, and files.
- **Modularity:** Break functionality into logically separated, reusable modules. Avoid monolithic files.
- **Comments:** Use inline comments to clarify non-obvious logic. Always document public APIs and complex functions with docblocks.
- **Formatting:** Follow indentation and brace rules for the language (see linked language standards).
- **Accessibility:** All output must be accessible (keyboard, ARIA, sufficient contrast, etc.).
- **Testing:** All new code must be accompanied by relevant tests. Expand coverage incrementally.
- **Security:** Always validate and sanitise user input. Escape output appropriately.
- **Performance:** Write efficient code but do not prematurely optimise. Profile and test edge cases.
- **Review:** All code must pass linting, tests, and review before merging.

---

## Accessibility

Accessibility is a non-negotiable requirement. Reference our [accessibility instructions](./wordpress-accessibility.instructions.md) and always test for keyboard, screen reader, and colour contrast compliance.

---

## References and Further Reading

- [WordPress PHP Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/)
- [WordPress JavaScript Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/)
- [WordPress CSS Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/css/)
- [WordPress HTML Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/html/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [LightSpeed .github instructions directory](https://github.com/lightspeedwp/.github/tree/master/.github/instructions)

---

## Checklists

- [ ] Code is clear, modular, and well-documented.
- [ ] All output is secure and accessible.
- [ ] Linting and tests pass for all touched files.
- [ ] Code follows file-type and language-specific standards.
- [ ] No secrets or sensitive data exposed.
- [ ] Rationale for changes is included in PRs.

---

> For the most up-to-date standards and examples for each language and file type, see the `.github/instructions/` directory in this repository and the links above. If guidance is missing for a language, propose a draft or request clarification.
