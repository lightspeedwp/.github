---
name: theme-color-token-enforcer
description: Audit or fix semantic colour token usage in a WordPress block theme. Use when checking a file, folder, or glob for raw colours, direct preset-colour references, missing settings.custom.color tokens, missing styles/dark.json token parity, or WCAG AA contrast issues. Reuse an existing semantic custom colour token where possible; otherwise create matching theme.json and styles/dark.json token paths and replace authored usage with semantic custom colour tokens, while preserving existing shared non-colour token families such as custom typography font-weight variables.
---

# Theme Color Token Enforcer

## Overview

Audit or remediate colour usage in a WordPress block theme so authored UI files use semantic custom colour tokens instead of direct palette references or raw visual colour values.

Treat:

- `theme.json` as the default or light semantic token mapping
- `styles/dark.json` as the required dark semantic token mirror
- `settings.color.palette` as fixed palette values only
- `settings.custom.color` as semantic usage tokens only
- In this theme, the dark variation keeps the same preset palette values and changes only the preset references assigned to semantic tokens

Related shared non-colour token families:

- `settings.custom.animation` for repeated motion values such as duration, delay, easing, and scale
- `settings.custom.typography.font-weight` for repeated font-weight values such as `light`, `normal`, `medium`, and `semibold`
- `settings.custom.z-index` for repeated stacking layers
- When a task also changes typography weight in a normal JSON property value, prefer `var:custom|typography|font-weight|...` over raw numeric literals such as `300` or `400`
- Inside raw `css` strings embedded in style JSON, continue using CSS custom property syntax such as `var(--wp--custom--typography--font-weight--...)`
- These families live in `theme.json` only unless a task explicitly asks for mode-specific non-colour overrides
- Only semantic colour tokens require dark-mode parity by default

## Request Shapes

Use `$theme-color-token-enforcer` when the user asks for workflows like these:

- "Audit this block theme for raw colours and direct preset references in `patterns/**/*.php` and `styles/**/*.json`."
- "Apply semantic custom colour tokens across this theme and add any missing `styles/dark.json` mirrors."
- "Check whether our button, icon, and border tokens have dark-mode parity and AA-safe contrast."

Success looks like:

- every visual authored colour usage is classified correctly
- existing semantic colour tokens are reused when they already fit
- new semantic colour tokens are created only when necessary, in both `theme.json` and `styles/dark.json`
- authored UI usage is rewritten to semantic custom colour token references in `apply` mode
- unresolved contrast or parity gaps are surfaced clearly instead of being hidden with invented raw colours

## Required Inputs

Collect or confirm:

- theme root path
- target file, directory, or glob
- mode: `audit` or `apply`
- optional list of approved non-visual exceptions such as masks or compositing helpers

If any required input is missing, ask only for the missing item before proceeding.

## Semantic Naming Defaults

Approved categories:

- `text`
- `surface`
- `border`
- `link`
- `button`
- `form`
- `state`
- `icon`
- `overlay`
- `focus`

Prefer names such as:

- `text.default`
- `text.inverse`
- `surface.canvas`
- `surface.card`
- `border.subtle`
- `button.primary.background`
- `button.primary.text`
- `icon.background`
- `icon.color`
- `form.field.border-focus`

Do not use appearance-based names such as `button-blue`, `dark-text`, or `green-border`.

## Workflow

Follow this sequence in order.

1. Load `theme.json`.
   - Build a registry of `settings.color.palette` slugs and values.
   - Build a registry of `settings.custom.color` token paths and preset mappings.
2. Load `styles/dark.json`.
   - Build the same registry for `settings.custom.color`.
   - Compare token paths against `theme.json` and flag or fix any parity gaps.
3. Scan the target paths in path order for:
   - `var:preset|color|<slug>`
   - `var(--wp--preset--color--<slug>)`
   - raw `#hex`, `rgb()`, `rgba()`, `hsl()`, and `hsla()` values
   - existing `var(--wp--custom--color--...)` references
4. Classify each colour occurrence.
   - Ignore palette definitions in `settings.color.palette`.
   - Ignore approved non-visual technical colours only if they do not control visible UI meaning.
   - For visual UI usage, determine the semantic role: text, surface, border, link, button, form, state, icon, overlay, or focus.
   - Reusable icon wells, icon frames, list-marker glyphs, and icon-only controls should prefer `icon.*` tokens instead of borrowing `link.*` or `text.*` tokens unless the design intent is explicitly link-driven text.
5. Reuse an existing semantic token from the same semantic family when one already fits the role and state.
   - Check `surface.*` before creating a new `surface.*` token.
   - Check `text.*` before creating a new `text.*` token.
   - Keep token reuse within the matching semantic family; do not use a surface token for a text role or vice versa.
6. If a proposed new same-family token would point to the same preset as an existing same-family token in the same mode and state, do not create it. Reuse the existing token instead.
7. If no suitable token exists:
   - Create a new token path in `theme.json` under `settings.custom.color`.
   - Create the exact same token path in `styles/dark.json`.
   - Map both values only to preset colours.
   - Keep names broad-to-specific and mode-stable.
8. Build the dark mapping contextually, not mechanically.
   - Keep the preset palette itself unchanged in `styles/dark.json`; only remap the semantic tokens onto existing preset slugs.
   - Start by testing whether the role is a direct foreground or surface inversion. If it is, a swap such as light `base` to dark `contrast`, light `contrast` to dark `base`, or light surface to dark surface is often correct.
   - For accents, gradients, glows, borders, button fills, and hover states, keep the semantic role and usually keep the same colour family, then move to a nearby palette step that works on the dark surface.
   - In this theme, brand-led interactive and icon accents often remap from `brand-*` in light mode to `cta-*` in dark mode. Treat that as a preferred dark-mode pattern when it improves contrast and emphasis.
   - Review the target background, neighbouring tokens, and interaction states together before choosing the dark value.
   - Use lifted dark surfaces such as `surface-*` when a component needs separation from the dark canvas without becoming a light block.
9. Validate contrast before finalizing any mapping.
   - Normal text requires at least `4.5:1`.
   - Large text, focus indicators, icons, borders, and other non-text UI require at least `3:1`.
   - If no preset pairing meets the threshold, stop and report the gap instead of inventing a raw colour.
10. In `apply` mode:
    - Replace visual authored usage with `var(--wp--custom--color--...)`.
    - Keep non-colour custom tokens, spacing, widths, line-heights, and layout values unchanged unless the task also asks for them.
    - If font-weight changes are in scope and the theme already exposes custom typography weight tokens, use `var:custom|typography|font-weight|...` in normal JSON property values rather than raw numeric literals.
    - Keep `var(--wp--custom--...)` syntax for those tokens inside raw CSS strings.

11. Re-scan until the target no longer contains direct visual preset-colour references or raw visual colours outside approved exceptions.
12. Report:

    - tokens reused
    - tokens created
    - files changed
    - remaining exceptions or manual review items
    - any contrast blockers

## Output Requirements

### Audit Mode

Return findings grouped by file. For each file, include:

- direct colour usages found
- semantic role classification
- token reuse recommendation
- token creation recommendation only when reuse is not sufficient
- dark-mode parity gaps
- contrast blockers or manual-review items

### Apply Mode

Make the smallest file edits that complete the remediation. Then return:

- tokens reused
- tokens created
- light and dark preset mappings for each new token path
- files changed
- remaining exceptions or manual review items
- any contrast blockers that prevented a full fix

Always call out any token path that exists in only one of `theme.json` or `styles/dark.json`.

## Guardrails

- Do not create or rename palette presets unless the task explicitly asks for palette work.
- Do not create separate `light` or `dark` token names for normal semantic roles.
- Do not set `settings.custom.color` values to raw hex, `rgb()`, `rgba()`, `hsl()`, `hsla()`, `color-mix()`, or gradient strings.
- Do not silently keep direct preset-colour references in authored UI files.
- Do not auto-rewrite non-visual masking or compositing colours without an explicit note.
- Do not weaken contrast to preserve a preferred hue.
- Do not mirror `settings.custom.animation` or `settings.custom.z-index` into `styles/dark.json` unless the task explicitly asks for a mode-specific non-colour override.
- Do not introduce raw numeric `font-weight` literals into normal JSON property values when the theme already exposes matching `settings.custom.typography.font-weight` tokens.
- Do not create extra same-family tokens that map to the same preset as an existing same-family token unless a verified mode-specific or state-specific distinction is required.

## Suggested Scan Scope

Check these locations unless the user narrows the target:

- `theme.json`
- `styles/dark.json`
- `styles/**/*.json`
- `patterns/**/*.php`
- `templates/**/*.html`
- `parts/**/*.html`
- `assets/css/*.css`

## Response Format

When you answer, keep the result concise and structured.

For `audit` mode, use:

### Findings by File

- file path
- issues
- recommended token reuse or creation

### Token Parity Gaps

- missing or mismatched token paths

### Contrast and Review Notes

- blockers, exceptions, or manual review items

For `apply` mode, use:

### Changes Made

- files changed
- replacements performed

### Token Decisions

- reused token paths
- created token paths and their preset mappings in light and dark modes

### Remaining Follow-Up

- unresolved blockers, exceptions, or manual review items
