# Governance Rules

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

## Scope

Apply these rules to all LightSpeed Linear issues and to GitHub pull requests linked to or handled through Linear workflows. The rules govern label recommendations and validation; they do not authorize taxonomy cleanup or record mutation.

## Authoritative Sources

Use the `develop` branch:

- Canonical names: <https://github.com/lightspeedwp/.github/blob/develop/.github/labels.yml>
- Automated matching: <https://github.com/lightspeedwp/.github/blob/develop/.github/labeler.yml>
- Issue-type mapping: <https://github.com/lightspeedwp/.github/blob/develop/.github/issue-types.yml>
- Strategy: <https://github.com/lightspeedwp/.github/blob/develop/docs/LABEL_STRATEGY.md>
- Examples: <https://github.com/lightspeedwp/.github/blob/develop/docs/LABELING_EXAMPLES.md>
- FAQ: <https://github.com/lightspeedwp/.github/blob/develop/docs/LABELING_FAQ.md>
- Governance: <https://github.com/lightspeedwp/.github/blob/develop/docs/LABELING_GOVERNANCE.md>
- Colour strategy: <https://github.com/lightspeedwp/.github/blob/develop/docs/LABEL_COLOR_STRATEGY.md>
- Inventory: <https://github.com/lightspeedwp/.github/blob/develop/docs/LABEL_INVENTORY.md>
- Issue triage: <https://github.com/lightspeedwp/.github/blob/develop/docs/ISSUE_TRIAGE_LABELING.md>
- PR labels: <https://github.com/lightspeedwp/.github/blob/develop/docs/PR_LABELS.md>

The live canonical file may change. Do not freeze its full inventory inside this skill.

## Naming Contract

- Use the exact lower-case form `family:value`.
- Require a colon with no surrounding spaces.
- Use hyphens inside multiword family names or values.
- Reject bare, bracketed, slash-form, title-case, and approximate aliases.
- Treat the family prefix as part of the label's identity, even when Linear displays a parent group.
- Use only labels present in the current canonical `.github/labels.yml`.

Core required families are `type:*`, `status:*`, `priority:*`, and either `area:*` or `comp:*`. Other families are allowed only when present in the current canonical file and relevant to the work.

## Required Combinations

### Linear Issue

- Exactly one `type:*`.
- Exactly one `status:*`.
- Exactly one `priority:*`.
- At least one `area:*` or `comp:*`.
- Additional canonical context or meta labels only when useful.

### Linked GitHub Pull Request

- Exactly one `type:*`.
- Exactly one `status:*`.
- Exactly one `priority:*`.
- At least one `area:*` or `comp:*`.
- Exactly one of `meta:needs-changelog` and `meta:no-changelog`.
- Exactly one `release:*` for a user-facing or shipping change.

## Source Precedence

1. Current user instruction controls task scope and explicit exceptions.
2. Current `.github/labels.yml` controls exact label membership and spelling.
3. Live Linear controls whether a canonical label can currently be selected and what is applied.
4. Strategy, examples, FAQ, governance, inventory, triage, PR, and colour documents explain usage.
5. Workspace memory and attached copies provide fallback context only.

When the canonical file and live Linear disagree, do not normalize silently. Report a taxonomy-sync gap with:

- canonical label expected;
- live label found or missing;
- affected target;
- smallest recommended governance action.

## Legacy And Migration Rules

- Do not recommend or apply legacy unprefixed labels.
- Do not translate a grouped Linear label to a canonical label unless exact canonical membership has been verified.
- Do not bulk-remove legacy labels without explicit user authorization.
- If a canonical counterpart exists, recommend the precise replacement as a proposed change.
- If none exists, route the need through label governance so `.github/labels.yml` changes first.

## Current Operational Caveat

The Linear inventory inspected on 2026-09-08 contained grouped, unprefixed labels such as `Bug`, `Feature`, `Improvement`, and `Figma`. Treat this as evidence of a taxonomy-sync gap, not as an exception to the prefix rule. Refresh live Linear on future runs before relying on this observation.

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
