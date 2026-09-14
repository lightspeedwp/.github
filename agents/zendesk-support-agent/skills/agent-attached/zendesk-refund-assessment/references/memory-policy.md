# Memory Policy

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

Use Memory conservatively. Refund, compensation, billing, contractual, and customer-specific details are sensitive operational context and should not be stored by default.

## Default rule

Do not save case-specific refund or compensation details to Memory.

This includes:

- customer names, account names, ticket IDs, order IDs, subscription IDs, invoice IDs, transaction IDs, payment amounts, currency values, refund amounts, credit amounts, chargebacks, compensation offers, contract terms, legal concerns, account health, or prior commitments in a specific case
- internal approval decisions for a specific customer
- sensitive financial, legal, contractual, or relationship-risk details
- screenshots, logs, pasted ticket content, or private support notes

## Safe to save only when explicitly useful and non-sensitive

Reusable patterns may be saved only when they are durable, non-customer-specific, and helpful across future runs, for example:

- `For refund assessments, prefer policy-grounded internal assessments before customer-facing replies.`
- `Route compensation requests needing approval to the formal escalation workflow before drafting.`
- `The workspace uses a conservative refund-assessment template with evidence, policy basis, approval needs, and safe next step.`

Even then, save only if the user explicitly asks to remember it or if it is clearly a durable workflow preference.

## Never save by default

Do not save:

- customer-specific financial facts
- refund amounts or compensation offers
- approval decisions tied to named customers
- legal, contractual, compliance, payment, billing, or chargeback details
- inferred customer sentiment or relationship risk for a named account
- one-off policy interpretations that have not been approved as reusable guidance

## If the user asks to remember something

If the user explicitly asks to save a policy-handling rule, first check whether it is reusable and non-sensitive. Save the general rule, not the customer-specific case details.

Prefer:

`remember that refund assessments should require policy basis, billing evidence, prior commitment review, and approval needs before drafting customer replies.`

Avoid:

`remember that customer x received a refund of y because teammate z approved it.`

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
