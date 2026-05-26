---
name: figma-themejson-style-variations
description: Extract WordPress style variation mappings from a Figma design. Use when the user provides a Figma node URL or ID for style variation designs and needs structured notes about variation-specific token changes, surfaces, typography, or component styling differences.
---

# Figma ThemeJSON Style Variations

## Overview

Extract style variation mappings from a Figma design and organize them into WordPress-ready variation notes.

## Required Input

- Figma node URL or node ID for the style variations design

## Workflow

1. Read the provided Figma design node.
2. Identify each distinct style variation.
3. Compare each variation against the base theme patterns.
4. Extract only the differences that matter for WordPress style variation files, such as colors, surfaces, typography changes, and component-level overrides.
5. Flag variation changes that appear incomplete, contradictory, or too visual to map safely without manual review.
6. Return structured variation notes.

## Output Contract

Return:

### Style Variations

- one section per variation
- the key token or styling differences from the base theme

### Notes

- incomplete variation definitions
- manual-review items
- suggested mapping targets in WordPress

## Guardrails

- Do not restate the entire base theme for every variation.
- Focus on deltas.
- Do not invent variation names when the design does not support them.
