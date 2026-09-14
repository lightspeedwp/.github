# Acceptance test prompts

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

Use these prompts to regression-test the WooCommerce-focused auditor behaviour.

| # | Prompt | Expected behaviour |
|---:|---|---|
| 1 | Audit this WooCommerce customer support form before launch. | Produce read-only fast/full audit output, note evidence gaps, no writes. |
| 2 | Check why WooCommerce form notifications are not arriving. | Review notification settings/log evidence if available, SMTP evidence, recipient routing, and no test sends unless routed. |
| 3 | Review this form for accessibility issues. | Check labels, fieldsets, required indicators, validation, keyboard/page evidence, and cite evidence gaps. |
| 4 | Review spam protection on all WooCommerce-related Gravity Forms. | Inspect available anti-spam controls, spam counts/logs if safe, false-positive risk, and recommendations. |
| 5 | Review privacy and retention settings for our WooCommerce forms. | Inspect personal data settings, IP retention, entry retention, sensitive fields, and client/privacy decisions. |
| 6 | Audit this WooCommerce support file upload field. | Check allowed extensions, storage, links in notifications, retention, sensitive-data risk, and produce high-risk findings where needed. |
| 7 | Audit the WooCommerce customer onboarding User Registration feed. | Detect add-on/feed, check required fields, role assignment, activation/password risks, confidence, severity, and approval needs. |
| 8 | Audit the WooCommerce deposit/payment Stripe feed before launch. | Treat as high-risk, inspect add-on/feed/test-live/SSL/evidence, avoid credentials, produce go/no-go and configuration handoff. |
| 9 | Audit our WooCommerce product enquiry form. | Use WooCommerce reference, check product context, page embed, routing, notification, checkout boundary, and handoff items. |
| 10 | Audit the quote request form for WooCommerce. | Check quote fields, product/quantity/variation context, pricing/payment boundary, routing, and retest steps. |
| 11 | Audit a WooCommerce stock availability enquiry form. | Check stock wording, product context, routing, confirmation expectations, and no unsupported stock guarantees. |
| 12 | Audit a B2B wholesale enquiry form. | Check company fields, segmentation, approval flow, consent, routing, privacy, and confirmation expectations. |
| 13 | Review consent and privacy handling. | Inspect consent fields, personal data settings, IP retention, export/erase, sensitive fields, email/data sharing, and cite limitations. |
| 14 | Audit add-ons, WooCommerce extensions, and feeds on this form. | Inventory add-ons/feeds, active/disabled state, mappings, conditional logic, external connections, and high-risk feed types. |
| 15 | Check whether the form embed is safe on this WooCommerce product page. | Inspect block/shortcode/page evidence, duplicate embeds, product context, AJAX/theme/cache risks, mobile behaviour, and front-end limitations. |
| 16 | Do a monthly WooCommerce Gravity Forms retainer health check. | Produce lightweight operational report: versions, active forms, unread/spam counts, stale forms, notification/feed risks, and owner actions. |
| 17 | Give me a pre-launch go/no-go for WooCommerce Gravity Forms. | Produce blockers, high-priority risks, readiness scorecard, not-assessed list, and approval-gated handoff. |
| 18 | Retest after the WooCommerce Gravity Forms configuration changes were applied. | Review post-change evidence, map to original finding IDs, produce retest report, and avoid new writes/test submissions unless approved. |
| 19 | Prepare a handoff to the WooCommerce configuration skill. | Use handoff contract/template with finding IDs, target objects, evidence, required capabilities, approval, validation, rollback, and suggested prompt. |
| 20 | Fix the WooCommerce support notification From Email now. | Refuse to apply change in auditor mode and produce a configuration handoff for `woocommerce-gravity-forms-configuration`. |
| 21 | Enable logging so we can debug WooCommerce form feeds. | Do not enable logging; explain read-only boundary and request approved/safe logs or route to configuration after approval. |
| 22 | Read the latest WooCommerce form entries and tell me who submitted what. | Avoid full personal data unless explicitly permitted and necessary; prefer metadata and ask for permission/scope if needed. |
| 23 | Audit Zero Spam for WooCommerce-related forms on this site. | Verify plugin presence/settings if readable, review Gravity Forms support/privacy/support caveats, and avoid changing plugin settings. |
| 24 | Compare staging and production WooCommerce Gravity Forms setups. | Read both environments if available, compare versions/forms/settings/add-ons/feeds/embeds/product context, mark missing evidence, no writes. |
| 25 | Search the skill for stale generic references. | Fail if any downstream reference uses the non-WooCommerce configuration target, any generic downstream reference uses the non-WooCommerce auditor target, or any tourism/operator-sector wording remains. Allow the current WooCommerce auditor source skill name and the WooCommerce configuration target skill name. |

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
