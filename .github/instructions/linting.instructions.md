---
applyTo: '**/*'
title: "LightSpeed Linting Instructions Index"
description: "Primary index and guidance for all linting rules, tools, and file-type-specific standards at LightSpeed."
author: "LightSpeedWP Team"
contributors:
  - name: "Ash Shaw"
    github: "ashleyshaw"
  - name: "LightSpeedWP"
    github: "lightspeedwp"
version: "0.1.0"
permalink: "/instructions/linting"
license: "GPL-3.0"
type: "instructions"
mode: "agent"
tags:
  - linting
  - coding-standards
  - php
  - javascript
  - html
  - css
  - python
  - yaml
  - markdown
  - json
  - shell
categories:
  - documentation
  - instructions
  - guides
---

## Role (required)

You are a linting standards index and guide. Follow our [coding standards](./coding-standards.instructions.md) and reference the specific linting instructions for each language or file type. Avoid enforcing custom or project-specific rules unless they are documented in the linked instructions.

## Style (required)

- Guidance:
  - Structure linting guidance by language and file type.
  - Reference only official, maintained linting tools and configurations approved by LightSpeed.
  - Clearly distinguish between required, recommended, and optional rules.
- Checklist:
  - All referenced linting instruction files are up-to-date.
  - Each language/file type has a direct link to its linting guide.
  - Cross-reference the main [Coding Standards Instructions](./coding-standards.instructions.md).

## Purpose (required)

- Guidance:
  - Provide a single source of truth for all linting setups and rules used at LightSpeed.
  - Direct contributors to the appropriate configuration, tool, and style guide for their language or file type.
  - Ensure all code submitted passes the relevant linter checks before review.
- Checklist:
  - Linting rules and tools are consistent across projects.
  - Contributors know where to find and how to apply linting instructions.
  - This file references the main coding standards index.

## Mission (required)

- Assist all contributors in finding and applying required linting rules for their code.
- Ensure code quality, consistency, and maintainability in all LightSpeed projects.
- Serve as the main entry point for linting guidance, always referencing the overarching [Coding Standards Instructions](./coding-standards.instructions.md).

---

# LightSpeed Linting Instructions Index

This document serves as the main index for all linting-related instructions across LightSpeed projects. Linting enforces code quality, consistency, and helps catch errors early—across all supported languages and file types.

> **See also:** our unified [Coding Standards Instructions](./coding-standards.instructions.md) for overarching best practices and language-specific standards.

## Linting Instructions by Language/File Type

- [CSS Linting](./linting-css.instructions.md)
- [HTML Linting](./linting-html.instructions.md)
- [JavaScript Linting](./linting-javascript.instructions.md)
- [JSON Linting](./linting-json.instructions.md)
- [Markdown Linting](./linting-markdown.instructions.md)
- [PHP Linting](./linting-php.instructions.md)
- [Python Linting](./linting-python.instructions.md)
- [Shell Script Linting](./linting-shell.instructions.md)
- [Test Linting](./linting-tests.instructions.md)
- [YAML Linting](./linting-yaml.instructions.md)

Each file contains:
- Tooling and configuration details
- Sample commands and configs
- Exceptions or project-specific rules

> For languages or file types not listed, refer to our [Coding Standards Instructions](./coding-standards.instructions.md) and propose additions as needed.
