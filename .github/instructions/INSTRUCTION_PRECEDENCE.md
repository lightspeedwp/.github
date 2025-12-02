---
file_type: "instructions"
title: "Instruction File Precedence Guide"
description: "Documentation of how instruction files are resolved when multiple files have overlapping applyTo patterns."
version: "v1.0"
last_updated: "2025-11-27"
author: "LightSpeedWP"
maintainer: "Ash Shaw"
owners: ["lightspeedwp/maintainers"]
tags: ["instructions", "precedence", "governance", "copilot"]
domain: "governance"
stability: "stable"
references:
  - path: ".github/instructions/coding-standards.instructions.md"
    description: "Unified coding standards index"
  - path: ".github/custom-instructions.md"
    description: "Organisation-wide custom instructions"
---

## Overview

When multiple instruction files have overlapping `applyTo` patterns, GitHub Copilot
applies them all, which can lead to conflicting guidance. This document clarifies the
intended precedence and purpose of each instruction category.

## Precedence Hierarchy

Instructions are organised in layers, with more specific instructions taking precedence over general ones:

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 4: Context-Specific (Highest Precedence)             │
│  block-plugin/*.instructions.md                             │
│  block-theme/*.instructions.md                              │
├─────────────────────────────────────────────────────────────┤
│  Layer 3: Domain-Specific                                   │
│  wpcs/*.instructions.md (WordPress Coding Standards)        │
├─────────────────────────────────────────────────────────────┤
│  Layer 2: Language-Specific                                 │
│  wordpress-js-react.instructions.md                         │
│  javascript-wordpress.instructions.md                       │
├─────────────────────────────────────────────────────────────┤
│  Layer 1: Organisation-Wide (Lowest Precedence)             │
│  coding-standards.instructions.md                           │
│  custom-instructions.md                                     │
└─────────────────────────────────────────────────────────────┘
```

## JavaScript/React File Precedence

For JavaScript and React files (`*.js`, `*.jsx`, `*.ts`, `*.tsx`), the following precedence applies:

### For Block Plugin Repositories

| Priority | File | Purpose |
|----------|------|---------|
| 1 (Highest) | `block-plugin/javascript-react.instructions.md` | Block-specific React patterns, WordPress block APIs |
| 2 | `wpcs/js-react.instructions.md` | WordPress-specific JS/React coding standards |
| 3 | `wordpress-js-react.instructions.md` | General WordPress JS development |
| 4 (Lowest) | `coding-standards.instructions.md` | Organisation-wide standards |

### For Block Theme Repositories

| Priority | File | Purpose |
|----------|------|---------|
| 1 (Highest) | `block-theme/*.instructions.md` | Theme-specific patterns and templates |
| 2 | `wpcs/js-react.instructions.md` | WordPress-specific JS/React coding standards |
| 3 | `wordpress-js-react.instructions.md` | General WordPress JS development |
| 4 (Lowest) | `coding-standards.instructions.md` | Organisation-wide standards |

### For Non-WordPress Repositories

| Priority | File | Purpose |
|----------|------|---------|
| 1 (Highest) | Context-specific instructions | Project-specific guidance |
| 2 (Lowest) | `coding-standards.instructions.md` | Organisation-wide standards |

## PHP File Precedence

For PHP files (`*.php`), the following precedence applies:

| Priority | File | Purpose |
|----------|------|---------|
| 1 (Highest) | `block-plugin/security.instructions.md` or `block-theme/php-block.instructions.md` | Context-specific PHP patterns |
| 2 | `wpcs/wpcs-php.instructions.md` | WordPress PHP coding standards |
| 3 | `wpcs/wpcs-php-docs.instructions.md` | PHP documentation standards |
| 4 (Lowest) | `coding-standards.instructions.md` | Organisation-wide standards |

## CSS/SCSS File Precedence

| Priority | File | Purpose |
|----------|------|---------|
| 1 (Highest) | `block-theme/theme-json.instructions.md` | theme.json design tokens |
| 2 | `wpcs/wpcs-css.instructions.md` | WordPress CSS standards |
| 3 (Lowest) | `coding-standards.instructions.md` | Organisation-wide standards |

## Resolving Conflicts

When instructions conflict:

1. **More specific wins** — Context-specific instructions override general ones
2. **WordPress standards prevail** — When in doubt, follow WordPress coding standards
3. **Security takes priority** — Security-related instructions always take precedence
4. **Accessibility is non-negotiable** — A11y requirements apply regardless of precedence

## Best Practices for Instruction Authors

1. **Avoid duplication** — Don't repeat content from lower-priority files
2. **Reference, don't copy** — Link to shared standards instead of duplicating
3. **Be explicit about scope** — Use clear `applyTo` patterns
4. **Document overrides** — When overriding a lower-level instruction, note why
5. **Keep files focused** — Each instruction file should have a single clear purpose

## File Naming Convention

```
{scope}-{topic}.instructions.md

Examples:
- block-plugin-development.instructions.md  (scope: block-plugin, topic: development)
- wpcs-php.instructions.md                   (scope: wpcs, topic: php)
- wordpress-js-react.instructions.md         (scope: wordpress, topic: js-react)
```

## Scope Markers in applyTo

The `applyTo` field determines which files an instruction applies to:

| Pattern | Scope | Notes |
|---------|-------|-------|
| `**` | All files | Use sparingly for org-wide rules |
| `**/*.{php,js}` | All PHP and JS files | Language-specific |
| `**/*.{js,jsx,ts,tsx}` | All JavaScript files | React/TypeScript included |
| `src/**/*.js` | Source JavaScript only | Excludes build/tests |
| `patterns/**/*.php` | Pattern PHP files only | Very specific scope |

## When to Use Each Layer

### Layer 4 (Context-Specific)

Use for:

- Block-specific APIs and patterns
- Context-specific file structures
- Overrides that only apply in that context

### Layer 3 (Domain-Specific)

Use for:

- WordPress-specific coding standards
- WordPress API usage patterns
- Shared across all WordPress projects

### Layer 2 (Language-Specific)

Use for:

- Language-specific patterns not tied to WordPress
- Modern JavaScript/TypeScript features
- Framework-agnostic best practices

### Layer 1 (Organisation-Wide)

Use for:

- Universal coding standards
- Security requirements
- Accessibility requirements
- Documentation standards

---

## References

- [GitHub Copilot Custom Instructions](https://docs.github.com/en/copilot/customizing-copilot)
- [LightSpeed Coding Standards](./coding-standards.instructions.md)
- [LightSpeed Custom Instructions](../custom-instructions.md)
