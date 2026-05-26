---
name: wordpress-theme-validation
description: Validate WordPress block-theme implementation surfaces against the approved design system. Use when the user asks to validate or review theme.json, block styles, section styles, style variations, theme-utils conventions, or Figma traceability for a WordPress project.
---

# WordPress Theme Validation

## Overview

Use this skill when the task is to validate a WordPress block theme against its design-system sources of truth.

This skill is for implementation validation, not for broad package drafting. It checks whether `theme.json`, block styles, section styles, style variations, CSS custom properties, and theme utility conventions stay aligned with approved design evidence such as `DESIGN.md`, `AGENTS.md`, Figma variables, Figma styles, parent-theme inheritance, and project-specific rules.

## When To Use This Skill

Use `$wordpress-theme-validation` when the user asks to:

- validate `theme.json`
- validate a block theme against Figma
- check block styles, section styles, or style variations for drift
- inspect `theme-utils.mjs` or equivalent theme utility conventions
- identify unverifiable token values, legacy overrides, or hardcoded implementation drift
- produce implementation findings for a package-wide validation report

Do not use this skill for first-pass `DESIGN.md` creation, broad evidence gathering, or general Figma-to-code implementation. Use the broader package and Figma skills for those tasks first, then use this skill to validate the implementation layer.

## Required Inputs

Use the strongest available sources in this order:

1. current project implementation files
2. `DESIGN.md`
3. `AGENTS.md`
4. Figma variables, styles, patterns, and component context
5. parent-theme files and inheritance context
6. `theme-utils.mjs` or equivalent theme utility files
7. plugin extension rules that affect the theme surface

If the needed implementation files are missing, say exactly which file or surface is missing before making strong validation claims.

## Workflow

1. Identify which implementation surfaces are in scope: `theme.json`, block styles, section styles, style variations, CSS custom properties, `theme-utils.mjs`, or related theme helper files.
2. Identify the validation baseline: `DESIGN.md`, `AGENTS.md`, Figma evidence, parent-theme inheritance, plugin extension rules, or approved project conventions.
3. Inspect `theme-utils.mjs` or equivalent utility files before judging generated or transformed theme outputs. Treat them as implementation conventions, not as the canonical design source.
4. Run the helper script in `scripts/inventory_theme_surfaces.mjs` when a fast inventory of theme surfaces, token-like values, or likely validation targets will improve consistency.
5. Compare implementation values against approved sources and classify findings as:
   - **Verified**: directly supported by implementation plus approved design evidence
   - **Inferred**: likely correct but not fully traceable
   - **Drift**: conflicts with approved design-system evidence or introduces undeclared values
   - **Legacy**: pre-existing values or structures that do not match current rules but may still be intentionally retained
   - **Conflict**: two or more sources disagree and the winner is not yet settled
6. Validate all relevant implementation surfaces together rather than checking `theme.json` in isolation.
7. Call out which Figma variables, styles, or patterns appear to map to each implementation surface whenever that traceability is available.
8. If a value cannot be traced back to Figma, `DESIGN.md`, parent-theme inheritance, or an approved project rule, do not present it as verified.
9. When block styles, section styles, or style variations duplicate logic that belongs in shared tokens or `theme.json`, flag that as maintainability risk.
10. When `theme-utils.mjs` conventions imply generated output, note whether the implementation appears to respect those conventions.

## Validation Targets

Check these when present:

- `theme.json`
- `styles/*.json`
- block style registrations and block-style files
- section styles and section-specific style files
- style variations and variation-specific theme files
- CSS custom properties and token aliases
- theme helper files such as `theme-utils.mjs`
- parent-theme presets and inherited values
- plugin-driven theme surfaces that introduce styling requirements

## Output Contract

Return a structured validation result with these sections when relevant:

1. **Validation Scope**
2. **Sources Checked**
3. **Implementation Surfaces Checked**
4. **Verified Mappings**
5. **Inferred Mappings**
6. **Drift And Legacy Findings**
7. **Block Style / Section Style / Variation Findings**
8. **theme-utils Convention Findings**
9. **Figma Traceability Findings**
10. **Open Conflicts Or Missing Evidence**
11. **Recommended Fixes**
12. **Validation Status**

For each meaningful finding, include:

- the affected file or surface
- the value, token, or rule at issue
- the strongest source that supports the finding
- the classification: Verified, Inferred, Drift, Legacy, or Conflict
- the practical impact on maintainability, parity, or correctness

## Decision Rules

- Prefer approved semantic tokens over raw values.
- Prefer `theme.json` settings and shared presets over one-off overrides.
- Prefer inherited parent-theme values over duplicated child-theme definitions when inheritance is intentional.
- Prefer reusable block or variation patterns over isolated style fragments when the design intent is shared.
- Do not silently normalize unverifiable values into the approved system; flag them first.
- Treat plugin-specific styling as an extension surface that still needs token discipline.

## Supporting Files

- `references/validation-checklist.md` — use for the ordered validation checklist and classification rules.
- `references/figma-traceability.md` — use when relating theme implementation values back to Figma variables, styles, and patterns.
- `scripts/inventory_theme_surfaces.mjs` — run when you need a quick inventory of theme files, style files, and token-like values before writing findings.

## Example Request Shapes

- "Use $wordpress-theme-validation to validate this theme.json and its style variations against the approved Figma variables and DESIGN.md."
- "Use $wordpress-theme-validation to find block-style drift and unverifiable values in this block theme."
- "Use $wordpress-theme-validation to inspect theme-utils conventions and tell me whether the generated theme surfaces still match the design system."
