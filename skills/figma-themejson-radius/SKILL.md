---
name: figma-themejson-radius
description: Extract WordPress theme.json border radius tokens from a Figma variables table. Use when the user provides a Figma node URL or ID for radius variables and needs normalized rounded-value tokens for WordPress theme configuration.
---

# Figma Themejson Radius

## Overview

Pull border radius tokens from a Figma variables table and write them into a theme.json `settings.border.radiusSizes` array using WordPress 6.9 schema rules.

## Required inputs

- Figma variables table node URL or node ID for radius
- Path to the target theme.json file

## Workflow (sequential)

1. Open the Figma node and call get_design_context + get_screenshot.
2. For each row, capture:
   - Label (name column)
   - Value (Mode 1 column)
   - Code Syntax (e.g., `var(--wp--preset--border-radius--300)`)
3. Extract the slug from Code Syntax:
   - `var(--wp--preset--border-radius--300)` → `300`
4. Convert value to CSS size:
   - If the value is `0`, use "0".
   - If the value is numeric without units, append `px`.
   - If the value already has a unit (px, rem, %, etc.), keep as-is.
5. Update theme.json:
   - Add or update `settings.border.radiusSizes` with `{ name, slug, size }` entries.
   - Set `settings.border.radius` to `true` if missing.
6. Place `settings.border` at the bottom of the `settings` object, just before `styles`.
7. Validate count: match the number of rows to the Figma “Total variables” line.

## Output requirements

- Use the 6.9 schema (`$schema: https://schemas.wp.org/wp/6.9/theme.json`).
- Labels (`name`) must match the Figma table exactly.
- Slugs must come from the Code Syntax column.
- `settings.border` must appear at the bottom of `settings`, directly before `styles`.

## Guardrails

- Do not invent slugs or labels.
- Do not modify unrelated settings or styles.
- Always call get_design_context and get_screenshot for the node.
- If Code Syntax is missing, leave existing slugs unchanged and report the gap.

## Template

```
"border": {
 "radius": true,
 "radiusSizes": [
  {
   "name": "small",
   "slug": "100",
   "size": "4px"
  }
 ]
}
```

## Example

**Figma row**

- Label: medium
- Value: 8
- Code Syntax: `var(--wp--preset--border-radius--200)`

**theme.json entry**

```
{
 "name": "medium",
 "slug": "200",
 "size": "8px"
}
```

## Bundled resources

- scripts/example.py: helper to format size and extract slugs
- references/api_reference.md: 6.9 schema notes for radius presets

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
