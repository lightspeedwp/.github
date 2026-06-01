---
name: wordpress-plugin-extension-audit
description: Use when the user asks to audit, validate, or improve a WordPress plugin's styling system as a design-system extension, especially for token drift, duplicated styling logic, editor/frontend mismatch, accessibility risks, or inheritance conflicts with theme.json and shared package rules.
---

# WordPress Plugin Extension Audit

Use this skill when the task is specifically about a WordPress plugin or plugin-controlled UI surface that should extend an existing design system instead of inventing its own parallel styling rules.

This skill is for plugin-extension analysis, not general theme validation. If the request is primarily about the theme itself, broader package consistency, or full `theme.json` validation, use the narrower existing workflow instead.

## Use This Skill For

- auditing a plugin's CSS, block styling, editor UI, or rendered frontend output against a shared design system
- checking whether a plugin duplicates tokens, spacing scales, color systems, or component rules that should come from `DESIGN.md`, `theme.json`, shared utilities, or package guidance
- reviewing plugin-specific implementation files before proposing updates to canonical package files
- identifying whether a plugin needs a documented extension map, adapter note, or explicit compatibility guidance

## Do Not Use This Skill For

- pure Figma extraction work
- direct Figma editing
- broad package intake and triage
- full-theme validation when the plugin is only a minor detail

## Required Inputs

Gather the strongest available evidence before making conclusions:

1. the relevant plugin source files or attached plugin artifacts
2. the current package guidance, especially `DESIGN.md`, `AGENTS.md`, `SKILL.md`, and WordPress implementation guidance when available
3. `theme.json`, style variations, utility files, or parent-theme evidence when the plugin depends on them
4. any user-stated expectations about which plugin surfaces are in scope

If a required plugin surface is missing, say exactly what evidence is still needed instead of guessing.

## Audit Workflow

1. Identify the plugin surface under review.
   - Name the plugin, feature area, or UI surface.
   - Determine whether it affects frontend output, editor UI, shared blocks, settings pages, dynamic rendering, or all of these.

2. Map the plugin's styling sources.
   - Inspect CSS, inline styles, block registration data, render callbacks, PHP templates, JS component styles, utility helpers, and any token-like constants.
   - Separate direct evidence from assumptions.

3. Compare against the shared design-system contract.
   - Check whether the plugin reuses or bypasses canonical tokens, semantic color aliases, spacing ladders, typography scales, radius, shadows, and interaction states.
   - Check whether plugin conventions match the current package's portability and inheritance rules.

4. Check WordPress integration quality.
   - Determine whether the plugin relies on `theme.json`, CSS variables, style variations, block supports, or theme utilities correctly.
   - Flag hardcoded values, preset misuse, duplicated token systems, fragile selectors, or parent/child inheritance conflicts.

5. Check parity and accessibility.
   - Look for editor/frontend mismatch, missing dark-mode parity when relevant, hover/focus/active state drift, insufficient contrast, and inaccessible custom controls.

6. Decide the right level of recommendation.
   - Prefer implementation-level fixes first.
   - Recommend canonical file changes only when the plugin reveals a true shared-rule gap.
   - Recommend a `plugin-styling-map.md` only when the plugin has enough styling breadth or complexity to justify a focused extension document.

## Output Contract

Respond with these sections in order:

### Verified Findings

- Include only findings supported by inspected evidence.
- Cite the relevant file or source surface for each finding.

### Inferred or Provisional Findings

- Include likely issues that still need confirmation.
- State exactly what evidence would confirm or disprove each one.

### Drift and Risks

- Highlight duplicated token systems, hardcoded values, inheritance hazards, accessibility gaps, or editor/frontend mismatch.
- Call out whether the risk is local to the plugin or indicates a broader package problem.

### Recommendations

- Separate immediate implementation fixes from broader package or documentation updates.
- Prefer the smallest viable correction that restores alignment.

### Next Step

- Name the single highest-value next action.
- If evidence is incomplete, the next step should be the smallest missing source to inspect.

## Decision Rules

- Do not silently normalize plugin behavior into the shared system if the evidence does not justify it.
- Do not recommend moving plugin-specific rules into canonical package files unless the same rule clearly belongs across multiple surfaces.
- Treat plugins as design-system extensions, not as exceptions that are exempt from token discipline.
- When a plugin intentionally diverges, verify whether that divergence is documented and justified before flagging it as drift.
- When a numeric spacing ladder is expected, preserve the ladder and flag missing required spacing keys as implementation drift rather than inventing replacements.

## Supporting Files

- `references/plugin-audit-checklist.md` — Use this checklist when you need a quick structured pass over plugin token usage, WordPress integration, accessibility, parity, and recommendation scope.

## Example Request Shapes

- "Audit this plugin's styling system against the design package and tell me where it drifts."
- "Check whether this plugin duplicates theme tokens or breaks inheritance."
- "Review this WooCommerce extension UI and tell me whether it should extend the shared design system or keep its own adapter rules."
