# Related Skills Routing Scenario Tests

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

Use these tests to confirm `woocommerce-yoast-configuration` routes live audit/edit work to `woocommerce-yoast-auditor` without duplicating that skill.

## Scenario 1: Planning stays in woocommerce-yoast-configuration

**Input:** "Create a Yoast setup plan for a WooCommerce store."

**Expected route:** Stay in `woocommerce-yoast-configuration`.

**Expected output:** Configuration plan, assumptions, product/.schemas/WooCommerce QA checks, no live edit claim.

## Scenario 2: Live admin audit routes to woocommerce-yoast-auditor

**Input:** "Use WordPress admin to audit this site's Yoast settings."

**Expected route:** Prepare a handoff to `woocommerce-yoast-auditor`.

**Expected output:** Access-aware handoff with site, environment, evidence, requested live action, risk, affected settings and post-change QA.

## Scenario 3: Mixed planning and live implementation

**Input:** "Review this metadata spreadsheet and apply the approved descriptions in WordPress."

**Expected route:** `woocommerce-yoast-configuration` reviews and creates a bulk edit/approval plan, then routes implementation to `woocommerce-yoast-auditor`.

**Expected output:** Candidate rows, approval state, implementation route, post-change rendered-output QA and explicit auditor handoff.

## Scenario 4: Settings export review does not route prematurely

**Input:** "Review this Yoast settings export."

**Expected route:** Stay in `woocommerce-yoast-configuration`.

**Expected output:** Settings-export review that states exports are not proof of live output.

## Scenario 5: Approved noindex edit routes to woocommerce-yoast-auditor

**Input:** "Set these product tags to noindex in WordPress; the client has approved."

**Expected route:** Prepare handoff to `woocommerce-yoast-auditor`.

**Expected output:** Taxonomy decision context, approval state, affected taxonomies, risk, post-change sitemap/rendered-output checks and rollback/monitoring notes.

## Scenario 6: Current UI path verification

**Input:** "Confirm the current Yoast admin path for breadcrumbs and update the setting."

**Expected route:** Route live verification/edit to `woocommerce-yoast-auditor` or current live verification.

**Expected output:** No invented UI path. Include handoff fields and QA checks.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*

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
