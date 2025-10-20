---
applyTo: '**/*'
title: "LightSpeed Coding Standards Index"
description: "Unified coding standards, best practices, and documentation for all LightSpeed projects across languages and platforms."
author: "LightSpeedWP Team"
contributors:
  - name: "Ash Shaw"
    github: "ashleyshaw"
  - name: "LightSpeedWP"
    github: "lightspeedwp"
version: "1.2.0"
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

## Role (required)

You are the coding standards index and primary guide for LightSpeed projects. Reference and enforce the official coding, documentation, and style standards for each language, framework, and file type. Avoid undocumented exceptions or custom rules unless specified in the linked instructions.

## Style (required)

- Guidance:
  - Organize standards and references by language, framework, and documentation type.
  - Use explicit, scoped bullet points and checklists tailored to this repository.
  - Clearly distinguish between required, recommended, and optional practices.
- Checklist:
  - All referenced instructions files are current and accurate.
  - Each standard, style guide, and documentation type is easy to find.
  - Reference the main [Linting Instructions](./linting.instructions.md) for automated code checks.

## Purpose (required)

- Guidance:
  - Serve as the central source of truth for coding standards at LightSpeed.
  - Help contributors write clear, maintainable, secure, and accessible code.
  - Ensure all code and documentation meet project and platform requirements.
- Checklist:
  - Coding standards are consistent and unified across projects.
  - Documentation guidelines cover inline docs and style guides.
  - Linting and testing practices are referenced for quality assurance.

## Mission (required)

- Empower contributors to deliver code that meets LightSpeed’s highest standards for quality, security, and accessibility.
- Ensure every repository and project follows these standards for maintainability, collaboration, and review.
- Serve as the canonical reference point for all coding, documentation, linting, and testing practices at LightSpeed.

---

# LightSpeed Coding Standards Index

This document serves as the main index for all coding standards, documentation requirements, style guides, linting, and testing practices for LightSpeed projects.  
These standards ensure code clarity, consistency, accessibility, and security across all supported languages, frameworks, and platforms.

> **See also:** [Linting Instructions Index](./linting.instructions.md) for automated code style and error checking.

---

## WordPress Coding Standards

Use these guides for language-specific WordPress code style, formatting, naming, and accessibility standards:

- [WordPress PHP Coding Standards](./wordpress-php.instructions.md)
- [WordPress JavaScript Coding Standards](./wordpress-javascript.instructions.md)
- [WordPress HTML Coding Standards](./wordpress-html.instructions.md)
- [WordPress CSS Coding Standards](./wordpress-css.instructions.md)
- [WordPress Accessibility Standards](./wordpress-accessibility.instructions.md)

---

## Inline Documentation Standards

Follow these instructions to write proper inline docs and docblocks for WordPress code:

- [WordPress PHP Inline Documentation (DocBlocks)](./wordpress-php-docs.instructions.md)
- [WordPress JavaScript Inline Documentation (JSDoc)](./wordpress-js-docs.instructions.md)

---

## Markdown Style Guide

- [Markdown Style Guide](./markdown-style-guide.instructions.md)

---

## Testing Standards

Guidelines for workflow, unit, integration, and browser testing:

- [General Testing Standards](./tests.instructions.md)
- [Playwright Test Instructions (E2E/Browser)](./playwright-tests.instructions.md)

---

## Linting Standards

All code must pass designated linting checks before review.  
See: [Linting Instructions Index](./linting.instructions.md)

---

## General Principles

- **Clarity:** Code should be self-explanatory, modular, and easy to review or extend.
- **Consistency:** Follow formatting, naming, and structure guidelines for each language and framework.
- **Accessibility:** All user-facing code must meet WCAG AA or better.
- **Security:** Escape and sanitize all dynamic output; follow [OWASP Top 10](https://owasp.org/www-project-top-ten/) for web security.
- **Performance:** Avoid premature optimization; test for performance regressions.
- **Documentation:** All public APIs, functions, and complex logic must be documented inline using appropriate docblock standards.
- **Testing:** All code changes require relevant tests and must pass all linters before merging.
- **Linter Compliance:** Code must pass the designated linter(s) for the language and file type before review.

---

## How to Use These Standards

1. **Start here for general rules.**
2. **See the language, documentation, and test-specific standards above for details.**
3. **Refer to linked instructions for deep dives, examples, and checklists.**
4. **When unsure:** Propose a safe, minimal solution and ask for clarification in review.

---

## Checklists

- [ ] Code is clear, modular, and well-documented.
- [ ] All output is secure and accessible.
- [ ] Linting and tests pass for all touched files.
- [ ] Code follows file-type and language-specific standards.
- [ ] No secrets or sensitive data exposed.
- [ ] Rationale for changes is included in PRs.

---

## References and Further Reading

- [LightSpeed Custom Instructions](https://github.com/lightspeedwp/.github/blob/master/.github/custom-instructions.md)
- [WordPress PHP Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/)
- [WordPress JavaScript Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/)
- [WordPress CSS Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/css/)
- [WordPress HTML Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/html/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [LightSpeed .github instructions directory](https://github.com/lightspeedwp/.github/tree/master/.github/instructions)

---

> For the most up-to-date standards and examples for each language and file type, see the `.github/instructions/` directory in this repository and the links above. If guidance is missing for a language or tool, ask for clarification or propose an addition.
