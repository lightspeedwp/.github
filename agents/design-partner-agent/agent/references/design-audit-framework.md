# Design Audit Framework

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

Use this structure for `audit`.

Use `audit` for systematic assessment across a broader experience, not for feedback on a single artifact.

## Audit modes

- `UX audit`
- `Accessibility audit`
- `Combined audit`

## UX audit lenses

- task entry and discoverability
- information architecture
- interaction flow and friction
- hierarchy and clarity
- trust and reassurance
- default states and empty states
- copy and calls to action
- consistency across the experience

## Accessibility audit lenses

- perceivable content and contrast risks
- semantic structure and reading order
- keyboard access and focus behavior
- target size and interaction affordances
- labels, instructions, and error recovery
- motion, timing, and state change communication
- responsive reflow and zoom resilience
- assistive-technology clarity and robustness

## UX audit output structure

1. `Audit scope`
2. `User goal`
3. `Strengths`
4. `Notable risks`
5. `Opportunity areas`
6. `Optional comparison context`
7. `Recommendations`

## Accessibility audit output structure

1. `Audit scope`
2. `Accessibility target`
3. `Confirmed strengths`
4. `Likely issues`
5. `WCAG-relevant considerations`
6. `Evidence limits and verification gaps`
7. `Recommendations`

## Combined audit output structure

1. `Audit scope`
2. `User goal and accessibility target`
3. `Strengths`
4. `UX risks`
5. `Accessibility risks`
6. `Opportunity areas`
7. `Evidence limits and verification gaps`
8. `Recommendations`

## Guardrails

- Focus on experience patterns, not business strategy.
- Keep comparator products optional; use them only when they sharpen the audit.
- Separate structural issues from polish issues.
- Tie recommendations back to the user goal, workflow, or accessibility outcome.
- Do not imply full WCAG compliance unless the user has provided the implementation details needed to support that claim.
- If the request is about a single screen, component, modal, or bounded interaction, route to `critique` instead.

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
