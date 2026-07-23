---
name: figma-themejson-shadow
description: Extract WordPress theme.json shadow presets from a Figma variables table. Use when the user provides a Figma node URL or ID for shadow variables and needs normalized shadow preset entries or mapping notes for theme configuration.
---

# Figma Themejson Shadow

## Overview

Extract shadow variables (x, y, blur, spread, color) from a Figma Variables documentation node and map them into WordPress theme.json shadow presets. Slugs come from the code syntax column (var(--wp--preset--shadow--{slug})) and titles remain unchanged.

## Workflow

1. Collect shadow variables per preset from the Figma node (x, y, blur, spread, color) plus the code syntax value.
2. Derive the slug from code syntax: var(--wp--preset--shadow--100) → slug "100".
3. Build the shadow string: "x y blur spread color" using px for numeric values (unless units are already specified).
4. Create/update theme.json settings.shadow:
   - defaultPresets: false (unless explicitly requested otherwise)
   - presets: array of { name, slug, shadow }
5. Preserve preset titles exactly as shown in the Figma table (e.g., Tiny, Base, Small, Medium, Large, X-Large).

## Output pattern

Each preset entry should follow this shape:

- name: "Tiny"
- slug: "100"
- shadow: "0.5px 2px 3px 0.5px rgba(17, 17, 17, 0.2)"

If the Figma color is shown as "#111111 @20%", convert to rgba(17, 17, 17, 0.2).
If the Figma color is already rgba(), keep it as-is.

## Resources

- scripts/example.py: CLI helper to format shadow strings and extract slugs
- references/api_reference.md: schema notes and conversion rules

## Resources

This skill includes example resource directories that demonstrate how to organize different types of bundled resources:

### scripts/

Executable code (Python/Bash/etc.) that can be run directly to perform specific operations.

### references/

Documentation and reference material intended to be loaded into context to inform the model's process and reasoning.

### assets/

Files not intended to be loaded into context, but rather used within the output the model produces.

---

**Any unneeded directories can be deleted.** Not every skill requires all three types of resources.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
