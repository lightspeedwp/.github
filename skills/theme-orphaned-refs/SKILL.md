---
name: theme-orphaned-refs
description: Fix WordPress theme preset references by scanning the theme sequentially, detecting orphaned var:preset and --wp--preset tokens, and replacing them with the closest matching slugs defined in theme.json. Use when theme.json variable names change and existing patterns/styles/templates still reference old slugs.
---

# Theme Orphaned Refs

## Overview

This skill guides an agent to walk a WordPress block theme sequentially, detect preset references that no longer exist in theme.json, and replace them with the closest matching presets from theme.json.

## Workflow (sequential)

1. Load theme.json and build the preset registry for `color`, `font-family`, `font-size`, `spacing`, `shadow`, `gradient`, `duotone`.
2. Scan the theme in path order (root → subfolders) for:
   - `var:preset|<type>|<slug>`
   - `--wp--preset--<type>--<slug>`
3. For each reference whose slug is not defined in theme.json, replace it with the closest match.
4. If the reference is a block attribute or class (`textColor`, `backgroundColor`, `has-*-color`), update the class/slug to match the new slug.
5. If a style variation defines its own palette, rename its palette slugs to the closest theme.json slugs and update all usage inside that file.
6. Re-scan until no orphaned references remain.

## Closest-match rules

- **Exact match**: keep as-is.
- **Numeric slugs** (e.g., `accent-4`): choose the nearest numeric slug with the same prefix from theme.json.
- **Accent/CTA/Brand 1–9**: map to `*-100`, `*-200`, etc. when present.
- **Font sizes by name**:
  - `small` → `300`, `medium` → `400`, `large` → `500`, `x-large` → `600`, `xx-large` → `700` (fallback to nearest numeric).
- **Font families**: if specific font slugs are gone and only `heading`/`body` remain, map:
  - headings/site-title/pullquote → `heading`
  - paragraphs/body defaults → `body`
- Otherwise, use best string similarity against the available slugs.

## Suggested tooling

Use the bundled script to find orphaned references and suggested replacements:

```
python scripts/find_orphaned_presets.py --root <theme-root>
```

Then apply replacements with minimal, localized edits.

## Notes

- Update both the preset token and any generated class names (e.g., `has-accent-4-color` → `has-accent-400-color`).
- Keep edits minimal; avoid reformatting unrelated code.

## Resources

This skill includes a scanning script and optional references directory.

### scripts/

Executable code for scanning orphaned preset references and suggesting replacements.

### references/

Optional reference material for mapping conventions.

### assets/

Unused in this skill.

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
