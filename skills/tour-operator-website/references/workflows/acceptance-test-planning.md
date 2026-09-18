# Acceptance test planning

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

Use this workflow when turning a Tour Operator audit, implementation plan, launch checklist, bug fix, content-model change, Gravity Forms change, Yoast/schema change, Wetu import change, or block-theme handoff into testable acceptance coverage.

## Principles

- Start from confirmed scope and evidence, not ideal feature wishes.
- Test core before extensions: `tour`, `destination`, and `accommodation` first.
- Keep extension coverage separate unless the extension is confirmed active or explicitly in scope.
- Treat prices, sale prices, ratings, reviews, availability, schema, and enquiry routing as high-risk evidence-sensitive areas.
- Include editor experience checks when templates, patterns, query loops, field output, or admin workflows are affected.

## Test-plan sequence

1. Identify the change, audit finding, or launch area being tested.
2. Confirm environment: local, staging, production, or documentation-only.
3. List source evidence and unresolved assumptions.
4. Map affected content types: `tour`, `destination`, `accommodation`, extension-owned, Wetu-synced, or unknown.
5. Define acceptance criteria before test steps.
6. Add positive tests, negative tests, regression tests, and editor-experience checks.
7. Add responsive, accessibility, SEO/schema, form-routing, and performance checks only where relevant.
8. Define pass/fail evidence required: screenshot, URL, admin setting, form entry, email notification, schema output, log entry, or code reference.
9. Mark any test blocked by missing access or missing source data.

## Acceptance criteria format

Use this format for each criterion:

```markdown
- [ ] Given [confirmed context], when [user/editor/system action], then [observable result].
  - Evidence required:
  - Risk covered:
  - Scope: core | extension | integration | theme | form | schema | launch
```

## Required coverage by area

### Core content model

- CPT appears only when confirmed registered.
- Source-backed fields render where expected and do not imply structured data that does not exist.
- Hierarchical behaviour is tested for `destination` only unless source evidence changes.
- Archive behaviour is tested for `destination` and `accommodation` where source-backed; `tour` archive must not be assumed unless confirmed.

### Relationships and FacetWP

- Destination relationship facet sources are tested as indexing/filter sources, not entity ownership proof.
- Extension-facing references remain disabled, hidden, or marked blocked unless the relevant extension is active and confirmed.
- Parent/child destination behaviour is tested when hierarchical destination filters are in scope.

### Gravity Forms enquiries

- Tour/accommodation/destination context is captured in the submitted entry.
- Notifications reach the correct recipient or are explicitly marked unverified.
- Confirmation wording is user-safe and does not promise availability, pricing, or booking confirmation unless supported.
- Spam and consent checks are included where form changes are in scope.

### Yoast/schema

- Existing Yoast output is inspected before proposing additions.
- JSON-LD is treated as readiness/planning unless implementation is verified.
- Candidate schema mappings do not claim Google rich-result eligibility unless Google documents that result type.
- Duplicate graph nodes and unsupported aggregate ratings are flagged.

### Block theme and editor UX

- Single and archive templates resolve correctly.
- Query loops show the intended content type and order.
- Empty states are usable.
- Editor can update relevant fields without developer intervention.
- Mobile and keyboard/focus behaviour are checked when visual templates are touched.

## Output

Use `references/outputs/output-contracts.md` for the acceptance test plan and QA matrix formats, and `references/outputs/acceptance-criteria-library.md` for reusable criteria.

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
