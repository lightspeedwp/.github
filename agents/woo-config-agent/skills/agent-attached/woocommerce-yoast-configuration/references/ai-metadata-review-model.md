# AI metadata review model

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

Use this model to classify AI-assisted Yoast metadata proposals before they are approved, applied or shared with a client.

## Review states

| State | Meaning | Next action |
|---|---|---|
| Draft | Generated or proposed but not reviewed | Review against evidence and claim checks |
| Needs source evidence | Copy depends on an unsupported claim or missing page/product evidence | Request approved source or remove claim |
| Needs content edit | Copy is accurate but unclear, too generic, duplicated, too long, too short or off-brand | Revise before approval |
| Needs client approval | Copy is technically acceptable but requires client/business approval | Send approval pack |
| Approved for admin entry | Copy has enough evidence and approval for WordPress/Yoast entry | Apply through admin or handoff |
| Approved as template pattern | Copy pattern can be reused at content-type/taxonomy level | Record decision and QA examples |
| Rejected | Copy is unsupported, risky, misleading or not useful | Do not apply; explain reason |
| Live verified | Copy has been applied and checked in rendered output | Record evidence and review trigger |

## Risk levels

| Risk | Use when | Handling |
|---|---|---|
| Low | Simple descriptive metadata from approved page copy | Can be approved with routine QA |
| Medium | Copy affects important service/category/product pages or archive templates | Require reviewer approval and rendered-output QA |
| High | Copy includes claims, regulated content, prices, offers, product availability, reviews, AI visibility, health/legal/financial language, migration-critical pages or site-wide templates | Require explicit approval and decision record |
| Blocked | Claim is unsupported, source is unavailable, page is noindexed, canonical target differs, product data is missing, or copy would mislead users | Do not apply until resolved |

## Required fields for each item

- `page_or_object`
- `wordpress_scope`
- `metadata_type`
- `current_value`
- `proposed_value`
- `source_evidence`
- `evidence_state`
- `risk_level`
- `review_state`
- `reasoning`
- `required_approval`
- `qa_checks`
- `decision_record_needed`

## Common rejection reasons

- Unsupported outcome or ranking claim.
- Unsupported product, stock, price, discount, review or delivery claim.
- Metadata describes a different page or canonical target.
- Page is noindexed or excluded from sitemap without an approved reason.
- Duplicate metadata across important pages.
- Keyword-stuffed or unnatural phrasing.
- AI visibility or AI Plus claim has not been verified against current Yoast sources.
- Metadata relies on internal notes that are not approved website copy.

## Safe approval language

Use language like:

- `Draft metadata is ready for review based on the supplied page copy.`
- `This item needs source evidence before it can be approved.`
- `This is suitable for admin entry after approval and rendered-output QA.`
- `This is not a search performance promise; it is a metadata quality recommendation.`

Avoid language like:

- `This will improve rankings.`
- `This guarantees rich snippets.`
- `This will improve AI visibility.`
- `Yoast AI Plus includes this feature` unless current product packaging has been verified.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
