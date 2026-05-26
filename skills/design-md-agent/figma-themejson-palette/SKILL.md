---
name: figma-themejson-palette
description: Extract a WordPress theme.json color palette from a Figma variables table. Use when the user provides a Figma node URL or ID for palette variables and needs palette-ready `settings.color.palette` entries with stable slugs, names, and hex values.
---

# Figma ThemeJSON Palette

## Overview

Extract a WordPress `theme.json` palette from a Figma variables table.

Use this skill when the input is a Figma node containing color variables that should become `settings.color.palette` entries.

## Required Input

- Figma node URL or node ID for the palette variables table

If the node is missing, ask for it before continuing.

## Workflow

1. Read the Figma variables from the provided node.
2. Identify palette candidates only. Exclude semantic usage tokens that belong in `settings.custom.color`.
3. Normalize each palette entry into:
   - `name`
   - `slug`
   - `color`
4. Prefer broad family scales such as `neutral-100`, `brand-500`, or `accent-700` when the Figma naming supports them.
5. Preserve coherent existing naming systems instead of forcing a new one.
6. Convert colors to normalized hex values.
7. Flag duplicate colors, naming collisions, missing scale steps, and ambiguous palette families.
8. Output only palette-ready entries plus concise notes.

## Output Contract

Return:

### Palette Entries

- one bullet or code block entry per palette token with `name`, `slug`, and `color`

### Notes

- ambiguous mappings
- duplicate or conflicting palette entries
- naming cleanup recommendations

## Guardrails

- Do not invent semantic custom color tokens here.
- Do not emit raw Figma metadata unless it helps explain a mapping issue.
- Do not guess missing colors.
- Keep output focused on `settings.color.palette`.
