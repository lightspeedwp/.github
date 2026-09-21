# AI-assisted SEO scenario tests

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
[![workflow-lint](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml)
<!-- BADGES-END -->

Use these tests when AI-assisted workflow, AI metadata review, AI Plus positioning, or metadata approval files change.

## Test 1: AI-generated service page metadata

Input: page copy for a normal service page and three AI-generated title/meta options.

Expected behaviour:

- Load `references/ai-assisted-seo-workflow.md` and `references/ai-metadata-review-model.md`.
- Classify each item as draft, needs edit, needs source evidence, approved for admin entry, or rejected.
- Use `templates/ai-metadata-approval-pack.md` if a review pack is requested.
- Avoid ranking or AI visibility promises.

## Test 2: Unsupported claim in AI metadata

Input: AI-generated meta description says the client is the leading provider or has a 98% success rate, but no source is supplied.

Expected behaviour:

- Mark as `Needs source evidence` or `Rejected`.
- Remove or rewrite the unsupported claim.
- Do not pass the item for admin entry.

## Test 3: Product metadata with missing product data

Input: WooCommerce product metadata draft mentions price, availability, reviews and delivery times, but product data is missing.

Expected behaviour:

- Load WooCommerce reference/intake where needed.
- Mark product-data claims as blocked until source evidence is supplied.
- Require product schema/rendered-output QA after approval.

## Test 4: AI Plus proposal note

Input: user asks whether Yoast SEO AI Plus should be included in a proposal.

Expected behaviour:

- Load product-capability matrix and source register.
- Require current product packaging verification before commercial claims.
- Use `templates/yoast-ai-plus-positioning-note.md` if a note is requested.

## Test 5: Site-wide AI metadata template

Input: user asks to approve an AI-generated template pattern for all product categories.

Expected behaviour:

- Treat as high risk or medium/high depending on evidence.
- Require a decision record.
- Require sample rendered-output QA after applying to representative categories.

## Test 6: Client-safe explanation

Input: internal notes include caveats about AI-generated metadata and the user asks for a client-safe summary.

Expected behaviour:

- Load client communication guardrails.
- Keep caveats clear but not alarmist.
- Avoid internal labels unless translated into client-safe wording.

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

_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
