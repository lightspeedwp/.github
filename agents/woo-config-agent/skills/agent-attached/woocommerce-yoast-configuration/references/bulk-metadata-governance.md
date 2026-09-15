# Bulk metadata governance

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

Use this reference when a user wants to update many Yoast titles, meta descriptions, social metadata, product metadata, or AI-assisted metadata suggestions at once.

## Purpose

Bulk metadata work is high-risk because a repeated bad template, unapproved AI wording, or unsupported claim can affect many pages quickly. Treat every bulk edit as a governed change, not a simple copy task.

## Evidence requirements

Classify the input before recommending implementation:

| Evidence type | What it proves | What it does not prove | Safe output |
|---|---|---|---|
| Spreadsheet or pasted list | Proposed metadata values | Source truth, approval, live output | Review pack or approval queue |
| Yoast settings export | Template or stored setting state | Rendered metadata on live pages | Settings review plus rendered QA request |
| Rendered output crawl | Current live metadata | Whether values are approved or intentionally set | QA findings and remediation backlog |
| AI-generated draft | Candidate wording | Accuracy, client approval, claim support | AI metadata review only |
| Approved source copy | Claim/source basis | Final metadata fit or rendered output | Draft pack with approval status |
| WordPress admin access | Ability to change values | Stakeholder approval or post-change validation | Admin change plan with QA |

## Change classes

| Class | Description | Default route |
|---|---|---|
| Template-level change | A title/description/social template changes many pages | Decision record + QA baseline before change |
| Page-level overwrite | Custom metadata for selected posts/pages/products | Approval queue before admin entry |
| Product metadata batch | Product titles/descriptions/social/product snippets | WooCommerce review + product-data QA |
| Social metadata batch | Open Graph/Twitter/X title/image/description changes | Rendered social metadata QA |
| AI-assisted batch | AI-generated suggestions for multiple URLs | AI metadata review + human approval |
| Migration metadata import | Old metadata mapped into new WordPress/Yoast state | State comparison + migration acceptance criteria |
| Cleanup batch | Removing duplicated, empty, stale, or unsupported values | Remediation backlog + rollback notes |

## Bulk-edit safety rules

1. Do not recommend applying bulk metadata directly to production without approval and a rollback route.
2. Separate `candidate`, `approved`, `implemented`, and `verified` states.
3. Flag claims, statistics, prices, guarantees, legal/compliance wording, medical/financial claims, and AI visibility claims for source validation before approval.
4. For product metadata, check product identifiers, stock/price dependency, variation context, category strategy, and schema implications.
5. For templates, test representative URLs from every affected content type and taxonomy before and after the change.
6. For imports, preserve old value, proposed value, source, approval owner, implementation route, and QA evidence.
7. Use `templates/metadata-bulk-edit-plan.md` for implementation planning and `templates/yoast-approval-queue.md` for review queues.

## Review states

| State | Meaning | Next action |
|---|---|---|
| Candidate | Proposed but not checked | Review against source and policy |
| Needs source | Claim or value lacks evidence | Request approved source or revise |
| Needs rewrite | Too long, unclear, duplicated, off-brand, or risky | Rewrite before approval |
| Needs client approval | Suitable but not signed off | Send approval queue |
| Approved for staging | Safe to test in staging/admin | Implement and QA |
| Implemented unverified | Entered but not checked in output | Run rendered-output QA |
| Verified live | Implemented and validated in rendered output | Record decision/result |
| Rejected | Should not be used | Preserve reason and replacement path |

## Minimum QA sample

For any batch, include at least:

- One homepage or top-level page if affected.
- One normal page.
- One post/article if posts are affected.
- One taxonomy archive if templates/taxonomies are affected.
- One product, one variable product, and one product category if WooCommerce is affected.
- One edge case: long title, missing excerpt, no featured image, no product price, no stock, no custom metadata, or translated page when relevant.

## Output rules

- Use concise tables for bulk review; do not bury URL-level decisions in prose.
- Include approval owner, implementation owner, and QA owner separately.
- Make the difference between metadata quality, Yoast configuration, and Google result display explicit.
- Do not promise Google will display the exact title or description.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

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

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
