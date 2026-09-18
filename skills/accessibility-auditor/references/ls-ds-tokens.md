# LightSpeed Design System — Token Reference

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
<!-- BADGES-END -->

**Version:** 0.1.0 · **For use by:** accessibility-auditor agent

> **Optional LightSpeed shortcut** — this file is loaded only when DS mode is `lightspeed`.
> It is not loaded automatically. To activate it, confirm "LightSpeed DS" at the Skill 01 design system prompt.
> For non-LightSpeed audits, Skill 04 uses user-provided tokens or generic WCAG-compliant patterns instead.

This file is the agent's reference for LightSpeed design-system-aligned fix recommendations.
When DS mode is `lightspeed`, always use token names from this file for fix suggestions.

## Color ramps

### Brand (blue)

| Stop | Hex | Token |
|------|-----|-------|
| 500 | #1E6AFF | --wp--preset--color--brand-500 |
| 400 | #5C90FF | --wp--preset--color--brand-400 |
| 300 | #85ACFF | --wp--preset--color--brand-300 |

### CTA (cyan)

| Stop | Hex | Token |
|------|-----|-------|
| 500 | #00FCFC | --wp--preset--color--cta-500 |
| 400 | #5AE3F5 | --wp--preset--color--cta-400 |
| 300 | #8DEEFF | --wp--preset--color--cta-300 |

### Accent (green)

| Stop | Hex | Token |
|------|-----|-------|
| 500 | #22C78A | --wp--preset--color--accent-500 |
| 400 | #4FDEAA | --wp--preset--color--accent-400 |
| 600 | #17A974 | --wp--preset--color--accent-600 |

### Neutral

| Stop | Hex | Token |
|------|-----|-------|
| 100 | #F4F4F4 | --wp--preset--color--neutral-100 |
| 200 | #E8E8E8 | --wp--preset--color--neutral-200 |
| 300 | #D8D8D8 | --wp--preset--color--neutral-300 |
| 500 | #909090 | --wp--preset--color--neutral-500 |
| 700 | #505050 | --wp--preset--color--neutral-700 |

### Surface (dark)

| Stop | Hex | Token |
|------|-----|-------|
| 100 | #2A2A30 | --wp--preset--color--surface-100 |
| 200 | #202028 | --wp--preset--color--surface-200 |
| 600 | #0C0C14 | --wp--preset--color--surface-600 |

### Foundation

| Token | Hex |
|-------|-----|
| Base | #FAFAFA |
| Contrast | #080808 |

## Semantic text tokens

| Token | Role |
|-------|------|
| --wp--custom--color--text--default | Primary text |
| --wp--custom--color--text--muted | Secondary/muted text |
| --wp--custom--color--text--inverse | Text on dark surfaces |
| --wp--custom--color--text--brand | Brand-coloured text |
| --wp--custom--color--text--brand-strong | Strong brand text |

## Semantic surface tokens

| Token | Role |
|-------|------|
| --wp--custom--color--surface--canvas | Page background |
| --wp--custom--color--surface--card | Card background |
| --wp--custom--color--surface--card-raised | Elevated card |

## Semantic border tokens

| Token | Role |
|-------|------|
| --wp--custom--color--border--card | Default card border |

## Interactive shadow tokens

| Token | Use |
|-------|-----|
| --wp--custom--shadow--interactive--accent | Focus ring (use on :focus-visible) |
| --wp--custom--shadow--card--hover | Hovered card |

## Typography

| Token | Value |
|-------|-------|
| --wp--preset--font-family--heading | Lexend |
| --wp--preset--font-family--body | Manrope |
| --wp--preset--font-family--monospace | monospace |
| --wp--preset--font-size--100 | 0.75rem (eyebrow/caption) |
| --wp--preset--font-size--200 | 1rem (body) |
| --wp--preset--font-size--300 | 1.25rem (h5) |
| --wp--preset--font-size--500 | 2rem (h3) |
| --wp--preset--font-size--700 | 3rem (h2) |
| --wp--preset--font-size--900 | 5rem (h1) |

## Border radii

| Token | Value | Use |
|-------|-------|-----|
| --wp--preset--border-radius--200 | 8px | Buttons, inputs |
| --wp--preset--border-radius--300 | 16px | Cards |
| --wp--preset--border-radius--500 | 9999px | Pills |

## Component classes (ls-theme)

| Class | Component |
|-------|-----------|
| .ls-btn--fill | Primary filled button |
| .ls-btn--glass | Ghost/glass button |
| .ls-btn--arrow | Icon-only arrow button (scaffold aria-label="") |
| .ls-link-arrow | Arrow link with underline |
| .ls-card | Base card |
| .ls-card--services | Services card variant |
| .ls-card--solutions | Solutions card variant |
| .ls-icon-shell | Icon container |
| .ls-eyebrow | Eyebrow label (use <p> not heading) |
| .ls-faq__trigger | FAQ accordion trigger |
| .ls-faq__panel | FAQ accordion panel |
| .screen-reader-text | Visually hidden but screen-reader accessible |

## Status colours (from DS)

> ⚠️ **Verify before use:** These token names follow the `--wp--custom--color--[group]--[name]` convention established by the other semantic tokens in this file. They have not been confirmed against the actual `theme.json`. Before referencing these in any recommendation, verify the exact names in the LightSpeed DS source. If the names differ, update this file.

| Token | Hex | Use |
|-------|-----|-----|
| --wp--custom--color--status--error | #EF4444 | Error state |
| --wp--custom--color--status--warning | #F59E0B | Warning state |
| --wp--custom--color--status--information | #3B82F6 | Information state |
| --wp--custom--color--status--success | #10B981 | Success state |

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
