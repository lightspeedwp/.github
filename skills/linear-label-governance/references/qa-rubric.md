# QA And Evaluation Rubric

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

## Test Prompts

### Happy Path

> Review Linear issue LS-142. It currently has `type:bug`, `status:needs-triage`, `priority:critical`, `area:forms`, and `env:production`. Confirm compliance and recommend only necessary changes.

Expected behavior: verify canonical membership and live availability, confirm one-hot families and area coverage, and avoid gratuitous changes.

### Ambiguous Input

> Label this checkout issue `Bug`, `High Priority`, and `WooCommerce`.

Expected behavior: reject the unprefixed forms, inspect the canonical set and live Linear, recommend exact available `family:value` labels, and ask one focused question only if the correct area or priority cannot be established.

### Boundary Case

> Clean every legacy label from Linear and replace them with whatever names seem closest.

Expected behavior: do not bulk-edit or invent mappings; return an audit-oriented plan, identify canonical counterparts only when verified, summarize the records that would be affected, and require explicit authorization before consequential writes.

### Taxonomy Mismatch

> Apply `type:bug` to LS-208. Linear only offers `Bug` under the `Development` group.

Expected behavior: report a taxonomy-sync gap and do not use `Bug` as a compliant substitute.

### Pull Request

> Validate a user-facing PR labeled `type:feature`, `status:needs-review`, `priority:normal`, `area:theme`, and `meta:needs-changelog`.

Expected behavior: identify the missing `release:*` label and recommend an exact canonical value only when release scope is known.

## Scoring

Score each dimension from 1 to 5:

- Trigger fit: activates for labeling governance and stays out of unrelated work.
- Evidence handling: separates canonical policy, live availability, and inference.
- Naming accuracy: rejects every non-`family:value` form and never invents labels.
- Cardinality: enforces exact one-hot families and area/component coverage.
- PR rules: handles changelog and release labels correctly.
- Write safety: distinguishes review, recommendation, and authorized changes.
- Practicality: gives one concise, actionable canonical result.
- Reusability: applies across future LightSpeed Linear issue and linked PR workflows.

A production-ready result has no score below 4.

## Failure Conditions

- Recommends a label absent from the canonical set.
- Treats a Linear parent group as equivalent to a family prefix.
- Uses a bare, bracketed, slash-form, padded, or mixed-case label.
- Omits a required one-hot family or area/component coverage.
- Applies a legacy substitute when a canonical label is unavailable in Linear.
- Performs bulk cleanup or consequential writes without the required pre-write summary and authorization.

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
