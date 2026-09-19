# LSX Mapping: Figma → theme.json → CSS Variables

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main Branch Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate PR Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges: Documentation Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges: Health Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges: Workflow Inventory Audit-OK-success.svg)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
<!-- BADGES-END -->

This maps LSX **Figma variables** to **WordPress theme.json** presets and the resulting **CSS custom properties**.

> Slugs are identical across layers to keep the pipeline predictable.

## Colour

| Figma Variable | theme.json `palette.slug` | CSS Variable |
|---|---|---|
| `base` | `base` | `--wp--preset--color--base` |
| `contrast` | `contrast` | `--wp--preset--color--contrast` |
| `primary` | `primary` | `--wp--preset--color--primary` |
| `neutral-0` | `neutral-0` | `--wp--preset--color--neutral-0` |
| `neutral-100` | `neutral-100` | `--wp--preset--color--neutral-100` |
| `…` | `…` | `…` |
| `accent-100` | `accent-100` | `--wp--preset--color--accent-100` |
| `…` | `…` | `…` |

## Typography (Font Sizes)

| Figma Variable | Label | theme.json `fontSizes.slug` | CSS Variable |
|---|---|---|---|
| `font-size-100` | Tiny | `font-size-100` | `--wp--preset--font-size--font-size-100` |
| `font-size-200` | Base | `font-size-200` | `--wp--preset--font-size--font-size-200` |
| `font-size-300` | Small | `font-size-300` | `--wp--preset--font-size--font-size-300` |
| `font-size-400` | Medium | `font-size-400` | `--wp--preset--font-size--font-size-400` |
| `font-size-500` | Large | `font-size-500` | `--wp--preset--font-size--font-size-500` |
| `font-size-600` | X-Large | `font-size-600` | `--wp--preset--font-size--font-size-600` |
| `font-size-700` | Huge | `font-size-700` | `--wp--preset--font-size--font-size-700` |
| `font-size-800` | Gigantic | `font-size-800` | `--wp--preset--font-size--font-size-800` |
| `font-size-900` | Colossal | `font-size-900` | `--wp--preset--font-size--font-size-900` |

> With `settings.typography.fluid: true`, WordPress emits fluid `clamp()` values for these presets in the compiled CSS.

## Spacing

| Figma Variable | theme.json `spacingSizes.slug` | CSS Variable |
|---|---|---|
| `spacing-10` | `spacing-10` | `--wp--preset--spacing--spacing-10` |
| `spacing-20` | `spacing-20` | `--wp--preset--spacing--spacing-20` |
| `spacing-30` | `spacing-30` | `--wp--preset--spacing--spacing-30` |
| `spacing-40` | `spacing-40` | `--wp--preset--spacing--spacing-40` |
| `spacing-50` | `spacing-50` | `--wp--preset--spacing--spacing-50` |
| `spacing-60` | `spacing-60` | `--wp--preset--spacing--spacing-60` |
| `spacing-70` | `spacing-70` | `--wp--preset--spacing--spacing-70` |
| `spacing-80` | `spacing-80` | `--wp--preset--spacing--spacing-80` |
| `spacing-90` | `spacing-90` | `--wp--preset--spacing--spacing-90` |
| `spacing-100` | `spacing-100` | `--wp--preset--spacing--spacing-100` |

## Usage Examples

```css
/* Global */
body {
  background: var(--wp--preset--color--base);
  color: var(--wp--preset--color--contrast);
  font-size: var(--wp--preset--font-size--font-size-200); /* Base */
}

/* Utility */
.wp-block-group.is-style-section-padding {
  padding-block: var(--wp--preset--spacing--spacing-80);
}
```

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

_Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!_
