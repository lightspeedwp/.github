# Acceptance checklist

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

The auditor skill is complete only when:

- [ ] It has clear read-only trigger conditions for WordPress websites running WooCommerce core and relevant WooCommerce extension plugins.
- [ ] It does not perform write operations.
- [ ] It uses progressive loading.
- [ ] It has a clear severity/confidence model.
- [ ] It produces findings registers.
- [ ] It produces client-safe summaries.
- [ ] It produces internal audit reports.
- [ ] It produces handoffs to `woocommerce-gravity-forms-configuration`.
- [ ] It handles WooCommerce Gravity Forms contexts, with product enquiries, quote requests, stock/availability enquiries, B2B/wholesale forms, product option/deposit flows, order support, account support, payment/user-registration feed risks, extension-related form flows, and product page embeds as first-class audit areas.
- [ ] It treats accessibility, spam, security, privacy, notifications, feeds, payments, and user registration as first-class audit areas only within the WooCommerce-scoped form context.
- [ ] It degrades gracefully when MCP evidence is incomplete.
- [ ] It refuses configuration changes and routes them to the WooCommerce configuration skill.
- [ ] It includes test prompts and expected behaviours.
- [ ] It validates and packages as `skill.zip`.

## Stale-reference failure test

The skill fails acceptance if any file contains:

- A generic downstream reference to the non-WooCommerce configuration target slug.
- A generic downstream reference to the non-WooCommerce auditor slug.
- Tourism/operator-sector wording from the disallowed-language list in `scripts/validate_audit_artifacts.py`.
- A generic configuration-agent profile that is not explicitly scoped to WooCommerce websites running WooCommerce core and relevant WooCommerce extension plugins.

Allowed references:

- The current skill name `woocommerce-gravity-forms-auditor`.
- The required target skill `woocommerce-gravity-forms-configuration`.

## Manual QA prompts

Run representative prompts from `tests/test-prompts.md` and check that the model never performs configuration, never invents evidence, always stays WooCommerce-scoped, and always produces a handoff for approved changes.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
