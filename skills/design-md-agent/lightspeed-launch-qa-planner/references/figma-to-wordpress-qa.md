# Figma to WordPress QA

## Scope

Check whether Figma design-system intent is implemented correctly in WordPress.

## Required checks

| Area | Check |
|---|---|
| Variables | Figma variables exist and are mapped to WordPress tokens |
| theme.json | Colours, typography, spacing, layout and custom settings align with Figma |
| Colour tokens | Light and dark palettes match intended values and contrast requirements |
| Typography | Font families, sizes, line heights, weights and responsive scale match design intent |
| Spacing | Spacing presets, block gaps, margins and paddings map correctly |
| Layout | Content widths, wide widths, grid behaviour and alignments match Figma |
| Components | Figma components map to WordPress blocks, block variations or patterns |
| Patterns | Figma sections map to registered WordPress patterns |
| Light/dark mode | Modes are complete, accessible and consistent across templates |
| States | Hover, focus, active, disabled, error and selected states are covered |
| Mobile | Mobile layouts match Figma and remain usable |
| Accessibility | Contrast, focus, headings, landmarks and touch targets are checked |

## Evidence to request

- Figma file URL and node IDs
- Figma variable export or screenshot
- `theme.json`
- pattern registration files
- screenshots of staging implementation
- WordPress editor screenshots
- frontend screenshots at desktop, tablet and mobile
