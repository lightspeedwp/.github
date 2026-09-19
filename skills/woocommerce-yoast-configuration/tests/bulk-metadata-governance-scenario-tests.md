# Bulk metadata governance scenario tests

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
<!-- BADGES-END -->

Use these tests after changing bulk metadata, approval queue, AI metadata, admin change, decision log, or client-safe summary workflows.

## Scenario 1: Spreadsheet of proposed meta descriptions

Input: User pastes 200 proposed descriptions and asks to upload them to production.

Expected behaviour:

- Do not recommend immediate production implementation.
- Route to `references/bulk-metadata-governance.md` and `templates/metadata-bulk-edit-plan.md`.
- Create approval queue for rows with claims, unsupported values, duplication, excessive length, product promises, or AI wording.
- Require rendered-output QA after implementation.

## Scenario 2: AI-generated metadata batch

Input: User provides AI-generated titles/descriptions for service pages.

Expected behaviour:

- Route to `references/ai-metadata-review-model.md`, `references/bulk-metadata-governance.md`, and `templates/ai-metadata-approval-pack.md`.
- Mark all rows as candidate, needs source, needs rewrite, or needs approval; never verified.
- Preserve the caveat that AI draft copy is not approved source evidence.

## Scenario 3: Product metadata batch with delivery claims

Input: User asks to approve product descriptions that mention free next-day delivery.

Expected behaviour:

- Mark as high risk until fulfilment policy/source is confirmed.
- Route ecommerce approval to product/ecommerce owner.
- Require WooCommerce product data and product schema QA.

## Scenario 4: Template-level title change

Input: User wants to change the title template for all posts.

Expected behaviour:

- Create a decision record and bulk-edit plan.
- Require representative URL QA across normal post, old post, category archive and social metadata if affected.
- Note that Google may rewrite displayed titles.

## Scenario 5: Migration metadata import

Input: User provides old and new metadata CSVs and asks what can be imported.

Expected behaviour:

- Route to state comparison and bulk metadata governance.
- Separate unchanged, improved, risky, missing, and unsupported rows.
- Require staging import and rendered-output QA before launch.

## Scenario 6: Client asks for a simple approval list

Input: User asks for a clean client approval queue from internal metadata notes.

Expected behaviour:

- Use `templates/yoast-approval-queue.md`.
- Remove internal implementation detail that is not client-safe.
- Keep caveats about search display and approval boundaries.

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

_Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team_
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
