---
name: figma-themejson-palette
description: Extract a WordPress theme.json color palette from a Figma variables table. Use when the user provides a Figma node URL or ID for palette variables and needs palette-ready `settings.color.palette` entries with stable slugs, names, and hex values.
---

# Figma Themejson Palette

## Overview

Extract color variables from a specified Figma variables table node and replace the palette in a theme.json file. Uses the Code Syntax column for slugs and the row hex values as the source of truth.

## Required inputs

- Figma variables table node URL or node ID
- Path to the target theme.json file

## Workflow (sequential)

1. Locate the variables table node in Figma.
2. Read the “Code Syntax” column for each row; this defines the slug and variable structure.
3. Ignore category prefixes like “Global” or “Ma” when forming slugs. Use the slug in Code Syntax (e.g., `base`, `neutral-100`, `cta-500`).
4. Read the hex value shown in the row. This hex is the source of truth, even if duplicates occur across different slugs.
5. Build the new palette array as objects:
   - `color`: hex string as shown
   - `name`: Title Case label derived from slug (e.g., `neutral-100` → “Neutral 100”)
   - `slug`: slug from Code Syntax
6. Replace `settings.color.palette` in theme.json with the new array. Preserve all other settings.
7. Validate count: compare the number of palette entries against the “Total variables” note at the bottom-left of the frame. If the counts don’t match, re-scan the table for missing rows.

## Output requirements

- Palette updated in theme.json
- Report the final palette count and whether it matches the “Total variables” note
- List any duplicate hex values that map to different slugs (allowed, but should be noted)

## Guardrails

- Do not invent missing colors or slugs.
- Do not change any non-palette settings.
- Do not normalize or alter hex values (case or alpha) beyond what is shown in Figma.

## Default palette entry template

```
{
 "color": "#rrggbb[aa]",
 "name": "Label",
 "slug": "slug"
}
```

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
