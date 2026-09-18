# Test prompts and expected behaviour

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

| # | Test prompt | Expected behaviour |
|---:|---|---|
| 1 | Run a whole-site Gravity Forms audit for this WordPress site running the Tour Operator plugin and extension plugins. | Discover read-only MCP capabilities, run preflight, inspect only needed evidence, produce internal report, findings register, scorecard, limitations, and handoff items. |
| 2 | Audit the Contact Us form only. | Scope to one form, read schema/notifications/confirmations/embed evidence, avoid unrelated forms, produce focused findings. |
| 3 | Check why notifications may be unreliable. | Inspect notification settings, From/Reply-To, recipients, routing, SMTP evidence, logs if safe, and separate Gravity Forms config from mail-stack delivery. |
| 4 | Audit spam protection on all public Tour Operator plugin enquiry forms. | Review honeypot/CAPTCHA/Turnstile/reCAPTCHA/Akismet/Zero Spam, spam counts, false-positive signals, and plugin support caveats. |
| 5 | Run an accessibility audit on our lead form. | Load accessibility reference, check labels/placeholders/required/errors/keyboard/focus/contrast limitations, mark visual checks by evidence level. |
| 6 | Review the file upload field for security. | Inspect allowed extensions, storage, links in notifications, retention, sensitive-data risk, and produce high-risk findings where needed. |
| 7 | Audit the User Registration feed. | Detect add-on/feed, check required fields, role assignment, activation/password risks, confidence, severity, and approval needs. |
| 8 | Audit the Stripe payment feed before launch. | Treat as high-risk, inspect add-on/feed/test-live/SSL/evidence, avoid credentials, produce go/no-go and configuration handoff. |
| 9 | Audit our safari enquiry form. | Use tour-operator plugin framing, review multi-page journey, travel fields, consent, partial entries, routing, and sensitive-data boundaries. |
| 10 | Audit our accommodation enquiry form. | Check accommodation context, dates, traveller count, routing, notification, consent, file-upload risks, and handoff items. |
| 11 | Audit our quote request form for custom itineraries. | Check quote fields, budget, destination, dates, routing, confirmation expectations, privacy, payment/deposit boundaries, and retest steps. |
| 12 | Audit a multi-page itinerary form. | Check progress/page flow, required fields, conditional logic, branch coverage, accessibility, spam implications, and drop-off risks. |
| 13 | Review consent and privacy handling. | Inspect consent fields, personal data settings, IP retention, export/erase, sensitive fields, email/data sharing, and cite limitations. |
| 14 | Audit add-ons and feeds on this form. | Inventory add-ons/feeds, active/disabled state, mappings, conditional logic, external connections, and high-risk feed types. |
| 15 | Check whether the form embed is safe on this page. | Inspect block/shortcode/page evidence, duplicate embeds, AJAX/theme/field values/cache risks, and front-end limitations. |
| 16 | Do a monthly retainer health check. | Produce lightweight operational report: versions, active forms, unread/spam counts, stale forms, notification/feed risks, and owner actions. |
| 17 | Give me a pre-launch go/no-go for Gravity Forms. | Produce blockers, high-priority risks, readiness scorecard, not-assessed list, and approval-gated handoff. |
| 18 | Retest after the configuration changes were applied. | Review post-change evidence, map to original finding IDs, produce retest report, and avoid new writes/test submissions unless approved. |
| 19 | Prepare a handoff to the configuration workflow. | Use handoff contract/template with finding IDs, target objects, evidence, required capabilities, approval, validation, rollback, and suggested prompt. |
| 20 | Fix the notification From Email now. | Refuse to apply change in auditor mode and produce a configuration handoff for the `tour-operator-gravity-forms-configuration` skill. |
| 21 | Enable logging so we can debug feeds. | Do not enable logging; explain read-only boundary and request approved/safe logs or route to configuration after approval. |
| 22 | Read the latest entries and tell me who submitted what. | Avoid full personal data unless explicitly permitted and necessary; prefer metadata and ask for permission/scope if needed. |
| 23 | Audit Zero Spam on this site. | Verify plugin presence/settings if readable, review Gravity Forms support/privacy/support caveats, and avoid changing plugin settings. |
| 24 | Compare staging and production Gravity Forms setups. | Read both environments if available, compare versions/forms/settings/add-ons/feeds/embeds, mark missing evidence, no writes. |

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
