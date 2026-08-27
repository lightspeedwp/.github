---
name: lightspeed-figma-wordpress-parity-auditor
description: audit parity between figma design-system intent and wordpress block-theme implementation for lightspeed projects. use when the user asks to compare figma variables with theme.json, review colour, typography or spacing tokens, map figma components to wordpress blocks, map patterns to figma sections, check light and dark mode parity, mobile states, focus states, accessibility states, or produce a figma-to-wordpress launch qa report.
---

# LightSpeed Figma WordPress Parity Auditor

## Purpose

Compare Figma design-system intent with a WordPress block-theme implementation and produce a practical parity audit for launch readiness.

## Core rule

Do not assume visual or technical parity without evidence. If Figma files, exported variables, screenshots, `theme.json`, block markup, pattern files or staging URLs are missing, mark the area as `Evidence Pending` and list what is needed.

## Inputs to accept

Accept any combination of:

- Figma design-system links
- Figma screenshots or exports
- Figma variables or token exports
- Figma Make prototype links
- `theme.json`
- WordPress theme files
- block pattern files
- screenshots from staging and live sites
- staging URL notes
- accessibility test results
- Lighthouse/PageSpeed notes
- design QA notes

## Audit areas

Check:

1. Figma variables vs `theme.json`.
2. Colour token parity.
3. Typography token parity.
4. Spacing and layout token parity.
5. Components vs WordPress blocks.
6. Block patterns vs Figma sections.
7. Light and dark mode parity.
8. Mobile and responsive states.
9. Focus, hover, active and disabled states.
10. Accessibility states and contrast.
11. Editor experience and pattern usability.
12. Launch blockers and follow-up issues.

## Workflow

1. Confirm the audit scope: whole site, selected pages, selected components, or launch QA.
2. Identify available evidence and missing evidence.
3. Create token parity tables for colour, typography and spacing.
4. Map Figma components to WordPress blocks or custom block patterns.
5. Map Figma page sections to WordPress pattern/template parts.
6. Review light/dark mode and responsive states.
7. Review accessibility states: contrast, focus, keyboard, headings, landmarks, labels, reduced motion.
8. Classify issues by severity.
9. Produce a launch-readiness recommendation.
10. Separate public/client-facing summary from internal LightSpeed implementation notes.

## Required outputs

When producing an audit, include:

- Executive summary
- Evidence reviewed
- Evidence missing
- Token parity table
- Component-to-block map
- Pattern-to-section map
- Light/dark mode QA
- Responsive QA
- Accessibility-state QA
- Issue register
- Launch blockers
- Recommended fixes
- Go/no-go recommendation
- Internal LightSpeed notes

## Status labels

Use:

- Matches
- Minor Difference
- Significant Difference
- Missing in WordPress
- Missing in Figma
- Needs Design Decision
- Needs Dev Fix
- Evidence Pending
- Launch Blocker

## Severity model

Use:

- P0 Launch Blocker: blocks launch, accessibility, legal/privacy, critical navigation, forms or brand integrity.
- P1 High: important user-facing defect that should be fixed before launch.
- P2 Medium: visible mismatch or maintainability issue that can be fixed shortly after launch if accepted.
- P3 Low: polish, documentation or future improvement.

## Reference loading

Use references as needed:

- `references/parity-audit-workflow.md`
- `references/theme-json-token-mapping.md`
- `references/component-block-mapping.md`
- `references/pattern-section-mapping.md`
- `references/light-dark-mode-qa.md`
- `references/responsive-state-qa.md`
- `references/accessibility-state-qa.md`
- `references/issue-severity-model.md`

Use asset templates when the user asks for tables, reports or downloadable outputs.
