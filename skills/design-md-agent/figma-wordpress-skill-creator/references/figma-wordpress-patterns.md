# Figma to WordPress Skill Patterns

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
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

Use this reference when creating skills for Figma design systems, WordPress implementation, or the bridge between them.

## Common Skill Types

### Figma design system skills

Use for skills that audit or structure variables, components, variants, modes, tokens, accessibility states, responsive behaviour and handoff notes.

Expected outputs often include:

- Token naming recommendations.
- Component-to-block mapping tables.
- Design QA notes.
- Accessibility and responsive state checklists.
- Developer handoff summaries.

### WordPress implementation skills

Use for skills that turn requirements into implementation plans for block themes, block plugins, WooCommerce, publishing workflows, tourism content models, migrations or launch QA.

Expected outputs often include:

- GitHub issue drafts.
- Acceptance criteria.
- File and hook references.
- Theme/plugin boundary decisions.
- QA plans and launch gates.

### Bridge skills

Use for skills that translate Figma intent into WordPress implementation instructions.

Expected outputs often include:

- Figma variable to `theme.json` mapping.
- Component to block/pattern/template-part mapping.
- Responsive behaviour notes.
- Editor experience constraints.
- Design parity QA reports.

## Mapping Guidance

| Figma source | WordPress target | Notes |
|---|---|---|
| Colour variables | `theme.json` palette and custom properties | Preserve semantic names where possible. |
| Typography variables | `theme.json` typography presets | Map sizes, line-height, weight and fluid behaviour. |
| Spacing variables | `theme.json` spacing scale | Avoid one-off values unless the design system requires them. |
| Components | Core blocks, patterns, template parts or custom blocks | Prefer native blocks and patterns before custom blocks. |
| Variants | Block styles, pattern variants or editor controls | Document what editors can safely change. |
| Modes | Style variations, CSS custom properties or editor presets | Include dark mode or brand mode notes when relevant. |
| Auto layout | Group, columns, grid, flex or custom CSS | State where WordPress editor constraints differ from Figma. |
| Interactive states | CSS states, block supports or plugin UI | Include focus and keyboard states. |

## WordPress Boundaries

A skill should make the boundary explicit:

- Theme: visual design, templates, patterns, global styles and editor presentation.
- Plugin: content types, taxonomies, fields, business logic, integrations and reusable functionality.
- Must-use/plugin configuration: platform-level behaviour, publishing rules, analytics or security controls.
- Content: copy, media, taxonomy assignments, internal links and editorial workflow.

When unsure, default to putting portable functionality in a plugin and design presentation in the theme.

## Quality Gates

For Figma-to-WordPress skills, check:

- Accessibility: semantic HTML, keyboard support, focus visibility, contrast and reduced-motion considerations.
- Editor usability: editors can update content without breaking layout.
- Maintainability: minimal custom code, clear ownership, reusable patterns and documented exceptions.
- Performance: avoid unnecessary libraries, oversized assets and heavy front-end logic.
- Compatibility: WordPress core, WooCommerce, block editor, PHP versions and build tooling.
- Traceability: every implementation task links back to design intent or business requirement.

## Good Skill Behaviour

A well-written skill should:

1. Ask for missing source material only when it materially affects the output.
2. Use safe defaults for common LightSpeed and WordPress workflows.
3. Separate recommendations from confirmed facts.
4. Produce developer-ready outputs, not generic tutorials.
5. Include risks, assumptions and acceptance criteria.
6. Avoid over-engineering where native WordPress capabilities are sufficient.

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)
