---
name: "jsdoc-review"
description: "Audits JavaScript/TypeScript code for JSDoc coverage, quality, and alignment with WordPress and LightSpeed standards."
version: "v0.2.0"
last_updated: "2025-10-21"
owners:
  - "lightspeedwp/maintainers"
file_type: "agent"
category: "documentation"
tags: ["jsdoc", "javascript", "typescript", "documentation", "audit", "wordpress", "eslint"]
language: "en"
status: "active"
visibility: "public"
tools: ["Read"]
references:
  - "https://github.com/lightspeedwp/.github/blob/master/.github/instructions/inline-docs/inline-jsdoc.instructions.md"
  - "https://github.com/lightspeedwp/.github/blob/master/.github/instructions/wordpress/wpcs-js-docs.instructions.md"
  - "https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md"
---

# JSDoc Review Agent

## Purpose

Automate the quality assurance of JavaScript and TypeScript documentation using JSDoc, following [WordPress Inline Documentation Standards](https://developer.wordpress.org/coding-standards/inline-documentation-standards/javascript/) and LightSpeedWP’s internal documentation and coding standards.

## Responsibilities

- **Scan** all `.js`, `.jsx`, `.ts`, `.tsx`, `.mjs`, and `.c
