---
name: figma-themejson-shadow
description: Extract WordPress theme.json shadow presets from a Figma variables table. Use when the user provides a Figma node URL or ID for shadow variables and needs normalized shadow preset entries or mapping notes for theme configuration.
---

# Figma ThemeJSON Shadow

## Overview

Extract shadow presets from a Figma variables table and normalize them for WordPress `theme.json` shadow usage.

## Required Input

- Figma node URL or node ID for the shadow variables table

## Workflow

1. Read shadow variables from the provided node.
2. Normalize each shadow preset into a stable label and value.
3. Keep preset ordering coherent from subtle to strong when the source supports it.
4. Flag duplicate shadows, malformed values, and mixed effect types.
5. Return shadow presets plus mapping notes.

## Output Contract

Return:

### Shadow Presets

- normalized preset entries with label, slug, and shadow value

### Notes

- malformed or mixed presets
- duplicates
- manual-review items

## Guardrails

- Do not treat color variables as shadows.
- Do not silently merge distinct shadow presets.
