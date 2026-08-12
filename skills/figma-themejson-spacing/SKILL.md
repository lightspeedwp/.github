---
name: figma-themejson-spacing
description: Extract WordPress theme.json spacing tokens from a Figma variables table. Use when the user provides a Figma node URL or ID for spacing variables and needs normalized spacing scale entries suitable for `settings.spacing.spacingSizes` or related token documentation.
---

# Figma Themejson Spacing

## Overview

Extract spacing tokens (name, min, max, slug) from a Figma spacing variables table and rebuild the theme.json spacing scale using rem-based clamp values derived from a 1440px desktop and 390px mobile viewport.

## Required inputs

- Figma variables table node URL or node ID for spacing
- Path to the target theme.json file

## Workflow (sequential)

1. Open the Figma node and read each spacing row.
2. For each row, capture:
   - Token name (e.g., XXS, XS, S, M, L, XL, XXL, XXXL, XXXXL, Giant, Colossal)
   - Min (px)
   - Max (px)
   - Code Syntax slug (e.g., `var(--wp--preset--spacing--20)` → slug `20`)
3. Calculate clamp values using 1440px desktop and 390px mobile:
   - Let $min$ and $max$ be px values.
   - Compute slope (px per vw): $s = (max - min) / (1440 - 390) * 100$
   - Compute intercept (px): $b = min - s * (390 / 100)$
   - Convert to rem: $min\_rem = min / 16$, $max\_rem = max / 16$, $s\_rem = s / 16$, $b\_rem = b / 16$
   - Clamp format: `clamp(min_rem, calc(b_rem + s_rem vw), max_rem)`
4. Round all rem and vw values to 3 decimals for readability.
5. Replace `settings.spacing.spacingSizes` with the new list of objects:
   - `name`: token name as shown
   - `size`: computed clamp string in rem/vw
   - `slug`: slug from Code Syntax
6. Validate count: compare the number of spacing entries with the “Total variables” note in the bottom-left of the Figma frame. If mismatch, re-scan for missing rows.

## Output requirements

- Updated `settings.spacing.spacingSizes` in theme.json
- All spacing sizes in rem-based clamps
- 3-decimal precision for all rem/vw numbers
- Report whether the spacing count matches the “Total variables” note

## Guardrails

- Do not modify any other theme.json sections.
- Do not invent tokens; all names and slugs must come from the Figma table.
- Always use 1440px (desktop) and 390px (mobile) for calculations.

## Template for spacing entry

```
{
  "name": "Token",
  "size": "clamp(minrem, calc(interceptrem + slopevw), maxrem)",
  "slug": "slug"
}
```

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
