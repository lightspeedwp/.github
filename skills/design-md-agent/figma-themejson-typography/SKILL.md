---
name: figma-themejson-typography
description: Extract WordPress theme.json typography tokens from a Figma variables table. Use when the user provides a Figma node URL or ID for typography variables and needs normalized font families, font sizes, line heights, font weights, or related typography token mappings.
---

# Figma ThemeJSON Typography

## Overview

Extract typography tokens from a Figma variables table and map them into WordPress `theme.json`-ready structures.

## Required Input

- Figma node URL or node ID for the typography variables table

## Workflow

1. Read typography variables from the provided node.
2. Group tokens by family such as font sizes, line heights, font weights, families, or letter spacing.
3. Normalize token names into stable WordPress-friendly slugs.
4. Preserve semantic naming when the Figma system already uses coherent labels.
5. Flag ambiguous typography groups, duplicate values, and mixed naming systems.
6. Separate clearly extractable tokens from items that need manual review.

## Output Contract

Return:

### Typography Tokens

- grouped typography tokens with normalized names and values

### Notes

- ambiguous groupings
- likely manual-review items
- mapping recommendations for `theme.json`

## Guardrails

- Do not flatten all typography into one undifferentiated list.
- Do not invent unsupported font families or weights.
- Keep token families distinct.
