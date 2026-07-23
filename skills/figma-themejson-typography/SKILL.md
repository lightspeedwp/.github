---
name: figma-themejson-typography
description: Extract WordPress theme.json typography tokens from a Figma variables table. Use when the user provides a Figma node URL or ID for typography variables and needs normalized font families, font sizes, line heights, font weights, or related typography token mappings.
---

# Figma Themejson Typography

## Overview

Extract typography tokens from a Figma variables table (fontSize, fontFamilies, lineHeight) and rebuild the theme.json typography presets with correct names, slugs, values, and font files.

## Required inputs

- Figma variables table node URL or node ID for typography
- Path to target theme.json file

## Workflow (sequential)

1. Open the Figma node and capture all rows for:
   - fontSize
   - fontFamilies
   - lineHeight
2. For each font size row, capture:
   - Token name (e.g., Tiny, Base, Small, Medium, Large, X-Large, Huge, Gigantic, Colossal)
   - Size (px)
   - Min (px)
   - Max (px)
   - Code Syntax (e.g., `var(--wp--preset--font-size--100)`)
3. For font families, capture:
   - Token name (e.g., fontFamilies/heading, fontFamilies/body)
   - Font name (e.g., Montserrat, Ubuntu)
   - Code Syntax (e.g., `var(--wp--preset--font-family--heading)`)
4. For line height, capture:
   - Token name (e.g., lineHeight/heading, lineHeight/body)
   - Value (e.g., 125, 150)
5. Convert sizes:
   - `rem = px / 16`
   - `size` should use the “Size” column value.
   - `fluid.min` and `fluid.max` should use Min/Max values.
   - If the Figma description includes explicit rem values, prefer those.
   - Otherwise, round to 2–3 decimals for readability (e.g., 0.6875 → 0.69 or 0.7).
6. Replace these in theme.json:
   - `settings.typography.fontSizes`
   - `settings.typography.fontFamilies`
   - `settings.custom.lineHeight`
7. Update all preset references in `styles`, `blocks`, `elements`, and any `css` strings:
   - `var:preset|font-size|...`
   - `var:preset|font-family|...`
8. Download fonts, prefer variable WOFF2 if available:
   - If variable font exists, use a single `fontFace` with a weight range.
   - If not variable, include all weight/style files.
9. Validate:
   - Figma “Total variables” count matches the number of rows parsed.
   - All slugs used in theme.json exist in `settings.typography`.

## Output requirements

- Must use theme.json schema 6.9 (`$schema: https://schemas.wp.org/wp/6.9/theme.json`)
- Font size slugs come from Code Syntax (e.g., `--100` → `100`)
- Font family slugs come from Code Syntax (e.g., `--heading` → `heading`)
- Font family `name` must be the font name (e.g., Montserrat), not the slug
- Line heights stored in `settings.custom.lineHeight` as strings
- WOFF2 font files referenced in `fontFace`

## Guardrails (critical)

- Do not guess tokens or slugs; use only values in the Figma table.
- Always call get_design_context and get_screenshot for the node.
- If Code Syntax is missing or “Not defined,” do not invent it; keep the slug in theme.json unchanged and report the gap.
- Validate that every `var:preset|font-size|...` and `var:preset|font-family|...` reference matches a defined preset.
- Do not leave old font-size slugs (small/medium/large/x-large/xx-large) in theme.json when the new slugs are numeric.
- For fonts:
  - Prefer variable WOFF2.
  - If only TTF/OTF is available, convert to WOFF2 and delete source files.
  - Avoid `fonts.google.com/download` (returns HTML); use the Google Fonts CSS2 endpoint.
  - Use a Python venv if system Python blocks installs (PEP 668).

## Templates

### Font size entry

```
{
  "name": "Tiny",
  "slug": "100",
  "size": "0.75rem",
  "fluid": {
  "min": "0.7rem",
  "max": "0.75rem"
  }
}
```

### Font family entry (non-variable)

```
{
  "name": "Montserrat",
  "slug": "heading",
  "fontFamily": "Montserrat, sans-serif",
  "fontFace": [
  {
  "fontFamily": "Montserrat",
  "fontStyle": "normal",
  "fontWeight": "400",
  "src": ["file:./assets/fonts/montserrat/Montserrat-400-normal.woff2"]
  }
  ]
}
```

### Custom line height

```
"custom": {
  "lineHeight": {
  "heading": "1.25",
  "body": "1.5"
  }
}
```

## Examples

**Figma row:**

- Token name: fontSize/Tiny
- Size: 12
- Min: 11
- Max: 12
- Code Syntax: `var(--wp--preset--font-size--100)`

**theme.json output:**

```
{
 "name": "Tiny",
 "slug": "100",
 "size": "0.75rem",
 "fluid": {
  "min": "0.7rem",
  "max": "0.75rem"
 }
}
```

## Bundled resources

- scripts/download_google_fonts.py
- scripts/convert_to_woff2.py
- scripts/generate_fontface_json.py
- references/api_reference.md

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
