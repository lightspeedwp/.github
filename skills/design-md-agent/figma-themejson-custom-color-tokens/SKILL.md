---
name: figma-themejson-custom-color-tokens
description: Extract semantic custom color tokens for a WordPress theme from a Figma variables table. Use when the user provides a Figma node URL or ID for semantic color variables and needs normalized `settings.custom.color` token paths, likely palette mappings, and notes about dark-mode parity.
---

# Figma ThemeJSON Custom Color Tokens

## Overview

Extract semantic custom color tokens from Figma and prepare them for `settings.custom.color` in a WordPress theme.

Use this skill for semantic usage tokens such as text, surface, border, button, icon, or form roles rather than fixed palette entries.

## Required Input

- Figma node URL or node ID for the custom color tokens variables table

## Workflow

1. Read semantic color variables from the provided node.
2. Separate semantic usage tokens from fixed palette values.
3. Normalize token paths into stable semantic families such as `text.*`, `surface.*`, `border.*`, `button.*`, or `icon.*`.
4. Where possible, suggest likely palette mappings rather than raw color literals.
5. Flag tokens that appear to need dark-mode parity or manual semantic review.
6. Surface ambiguous tokens that look visual rather than semantic.

## Output Contract

Return:

### Custom Color Tokens

- normalized semantic token paths
- source value or likely palette mapping

### Notes

- likely dark-mode parity needs
- ambiguous semantic roles
- conflicts with palette-only naming

## Guardrails

- Do not output raw palette entries as semantic custom tokens.
- Do not keep appearance-based names when a clearer semantic role is available.
- Do not invent final dark mappings when the source does not support them.
