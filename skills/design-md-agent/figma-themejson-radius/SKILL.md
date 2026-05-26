---
name: figma-themejson-radius
description: Extract WordPress theme.json border radius tokens from a Figma variables table. Use when the user provides a Figma node URL or ID for radius variables and needs normalized rounded-value tokens for WordPress theme configuration.
---

# Figma ThemeJSON Radius

## Overview

Extract border radius tokens from a Figma variables table and normalize them for WordPress `theme.json` usage.

## Required Input

- Figma node URL or node ID for the border radius variables table

## Workflow

1. Read radius variables from the provided node.
2. Normalize names into a stable rounded scale.
3. Normalize values and units.
4. Flag duplicates, inconsistent labels, and outlier values.
5. Return a compact radius token set suitable for WordPress mapping.

## Output Contract

Return:

### Radius Tokens

- normalized radius entries with label, slug, and value

### Notes

- duplicate values
- naming inconsistencies
- manual-review items

## Guardrails

- Do not mix spacing or shadow values into radius output.
- Do not invent intermediate radius sizes.
