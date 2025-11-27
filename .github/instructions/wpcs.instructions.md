---
file_type: "instructions"
title: "WordPress Coding Standards Index"
description: "Index of all LightSpeed WordPress coding standards, inline documentation, linting, and Copilot frontmatter rules. This instruction set is designed to be inherited by WordPress repositories across the LightSpeedWP organisation."
applyTo: "**/*.{php,js,jsx,ts,tsx,css,scss,html}"
last_updated: "2025-11-26"
version: "v2.1"
owners: ["LightSpeedWP Team"]
tags:
  [
    "wordpress",
    "coding-standards",
    "wpcs",
    "php",
    "javascript",
    "css",
    "accessibility",
  ]
domain: "wp-core"
stability: "stable"
references:
  - path: "./wpcs/"
    description: "WordPress Coding Standards instruction files"
  - path: "./coding-standards.instructions.md"
    description: "Organisation-wide coding standards"
  - path: "../custom-instructions.md"
    description: "Organisation-wide Copilot instructions"
---

## Overview

> ⚠️ **Scope Notice**: These instructions are intended for **WordPress repositories**
> within the `lightspeedwp` GitHub organisation. They should **not** be applied to
> the `lightspeedwp/.github` community health repository, as that repository does
> not contain WordPress code.

This is the canonical index for all LightSpeed WordPress coding standards and best practices.

> **See also:**
>
> - [LightSpeed Coding Standards Index](./coding-standards.instructions.md) for org-wide rules
> - [LightSpeed Custom Copilot Instructions](../custom-instructions.md) for Copilot/AI conventions
> - [Block Plugin Development Instructions](./block-plugin-development.instructions.md) for block plugin development

---

## 📂 Dynamic Reference

All WordPress Coding Standards instruction files in this directory:

- [`wpcs/*.instructions.md`](./wpcs/) — All instruction files in the `wpcs/` folder
  define WordPress-specific coding standards and best practices.

---

## WordPress Coding Standards

| File                                                                            | Purpose                                  | When to Invoke                                  |
| ------------------------------------------------------------------------------- | ---------------------------------------- | ----------------------------------------------- |
| [wpcs-accessibility.instructions.md](./wpcs/wpcs-accessibility.instructions.md) | Accessibility rules (WCAG 2.2 AA)        | When designing UI, markup, or components        |
| [wpcs-css.instructions.md](./wpcs/wpcs-css.instructions.md)                     | CSS/SCSS naming, formatting, specificity | When writing stylesheets for themes or plugins  |
| [wpcs-html.instructions.md](./wpcs/wpcs-html.instructions.md)                   | Semantic markup and structure            | When creating HTML templates or block output    |
| [wpcs-javascript.instructions.md](./wpcs/wpcs-javascript.instructions.md)       | JavaScript style, naming, patterns       | When writing JavaScript for WordPress           |
| [wpcs-php.instructions.md](./wpcs/wpcs-php.instructions.md)                     | PHP conventions, security, i18n          | When writing PHP for themes, plugins, or blocks |

---

## WordPress Inline Documentation Standards

| File                                                                  | Purpose                                | When to Invoke                                     |
| --------------------------------------------------------------------- | -------------------------------------- | -------------------------------------------------- |
| [wpcs-php-docs.instructions.md](./wpcs/wpcs-php-docs.instructions.md) | PHP DocBlocks and inline documentation | When documenting PHP functions, classes, and hooks |
| [wpcs-js-docs.instructions.md](./wpcs/wpcs-js-docs.instructions.md)   | JavaScript JSDoc documentation         | When documenting JavaScript functions and modules  |

---

## Additional Resources

For linting and automation, see:

- [Linting Instructions Index](./linting.instructions.md) — Automated linting standards and tooling
- [Frontmatter Instructions](./frontmatter.instructions.md) — YAML frontmatter rules for `.instructions.md` files

---

**Always reference this index for the latest standards, documentation formats, and
automation practices in WordPress projects at LightSpeed.**
