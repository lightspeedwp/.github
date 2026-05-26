---
name: figma-themejson-spacing
description: Extract WordPress theme.json spacing tokens from a Figma variables table. Use when the user provides a Figma node URL or ID for spacing variables and needs normalized spacing scale entries suitable for `settings.spacing.spacingSizes` or related token documentation.
---

# Figma ThemeJSON Spacing

## Overview

Extract a normalized spacing scale from a Figma variables table for WordPress `theme.json` usage.

## Required Input

- Figma node URL or node ID for the spacing variables table

## Workflow

1. Read spacing variables from the provided node.
2. Normalize names into stable scale labels or slugs.
3. Convert values into WordPress-safe spacing values.
4. Preserve a coherent ascending scale.
5. Flag inconsistent units, duplicates, or missing intermediate scale steps.
6. Output spacing entries ready for `theme.json` mapping.

## Output Contract

Return:

### Spacing Tokens

- normalized spacing entries with label, slug, and value

### Notes

- unit normalization issues
- duplicate values
- inconsistent spacing scale patterns

## Guardrails

- Do not mix radius or typography values into spacing.
- Do not invent missing steps unless the user explicitly asks for interpolation.
- Keep the result focused on spacing-token extraction.
