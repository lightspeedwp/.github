---
name: figma-themejson-style-variations
description: Extract WordPress style variation mappings from a Figma design. Use when the user provides a Figma node URL or ID for style variation designs and needs structured notes about variation-specific token changes, surfaces, typography, or component styling differences.
---

# Figma Themejson Style Variations

## Overview

Extract all style variations from a Figma variables table (colors + font families) and write a style variation JSON per variation. Each variation gets a palette + typography fontFamilies plus minimal styles wiring (body + heading). Fonts are downloaded and referenced via fontFace.

## Required inputs

- Figma variables table node URL or node ID
- Path to the target theme.json (for slug alignment)
- Path to the target /styles folder

## Workflow (sequential)

Follow the structure and guardrails in the figma-themejson-palette skill for palette extraction (slug parsing, hex fidelity, and palette entry format).

1. Load the Figma variables table node and identify style variation groups.
   - Group headers indicate variation keys (e.g., colours / `<variation-key>`, typography / font-families / `<variation-key>`).
   - Build a list of variation keys by scanning all groups.
2. Ask the user for the display title for each variation key.
   - Provide a list of detected keys and request titles.
   - Do not assume titles; wait for user input.
3. Read theme.json to get the canonical palette slugs.
   - Color slugs in variation palettes MUST match theme.json slugs.
4. For each variation key:
   - Extract color rows for that variation and build a palette array using the figma-themejson-palette rules.
   - Extract font-family rows for that variation.
     - Create two entries: heading + body.
     - `slug`: `heading` or `body` (always).
     - `name`: font family name from Figma.
     - `fontFamily`: include a fallback (serif/sans-serif) and quote multi-word names.
5. Ensure font files exist locally:
   - Prefer variable fonts.
   - If a variable font is unavailable, use static font files and include each file in `fontFace` with correct `fontWeight` and `fontStyle`.
   - Use scripts/download_google_fonts.py if the font is from Google Fonts.
6. Write one style variation JSON file per variation key into /styles:
   - `$schema` MUST be the latest (currently <https://schemas.wp.org/wp/6.9/theme.json>).
   - `version`: 3.
   - `title`: the user-provided title.
   - `slug`: variation key (lowercase, hyphenated if needed).
   - `settings.color.palette`: variation palette.
   - `settings.typography.fontFamilies`: heading + body entries with `fontFace`.
   - `styles.typography.fontFamily`: `var:preset|font-family|body`.
   - `styles.elements.heading.typography.fontFamily`: `var:preset|font-family|heading`.
7. Validate:
   - All palette slugs exist in theme.json.
   - Each variation has both heading + body font families.
   - All fontFace src files exist.

## Output requirements

- One style variation JSON per variation key in the target /styles folder
- Report each variation’s title + file path
- Report any missing fonts or slug mismatches before finalizing

## Guardrails

- Do not invent colors, slugs, or font families.
- Do not change theme.json directly unless asked.
- Always ask for variation titles before writing files.
- Keep palettes and font names exactly as shown in Figma.

## Default palette entry template

```
{
 "color": "#rrggbb[aa]",
 "name": "Label",
 "slug": "slug"
}
```

## Font download helper

Use scripts/download_google_fonts.py to fetch variable fonts from Google Fonts and output woff2 files into an assets/fonts/`<family-slug>`/ folder.

Example:

```
python3 scripts/download_google_fonts.py --family "Nunito Sans" --out assets/fonts
```

## Example style variation skeleton

```
{
 "$schema": "https://schemas.wp.org/wp/6.9/theme.json",
 "version": 3,
 "title": "<User Provided Title>",
 "slug": "<variation-key>",
 "settings": {
  "color": { "palette": [ /* palette entries */ ] },
  "typography": {
   "fontFamilies": [
    { "name": "<Heading Font>", "slug": "heading", "fontFamily": "<Heading>, sans-serif", "fontFace": [ /* files */ ] },
    { "name": "<Body Font>", "slug": "body", "fontFamily": "<Body>, serif", "fontFace": [ /* files */ ] }
   ]
  }
 },
 "styles": {
  "typography": { "fontFamily": "var:preset|font-family|body" },
  "elements": { "heading": { "typography": { "fontFamily": "var:preset|font-family|heading" } } }
 }
}
```

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
