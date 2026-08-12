# Test prompts and expected behaviour

<!-- BADGES-START -->
[![actions-minute-savings-watch](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml)
[![awesome-github-site](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml)
[![changelog-auto-update](https://github.com/lightspeedwp/.github/actions/workflows/changelog-auto-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-auto-update.yml)
[![changelog-validate](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validate.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validate.yml)
[![checklist-finalisation](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml)
[![checks](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml)
[![cleanup-branches](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml)
[![dependabot-security-label](https://github.com/lightspeedwp/.github/actions/workflows/dependabot-security-label.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/dependabot-security-label.yml)
[![flaky-test-detection](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml)
[![issue-close-label-hygiene](https://github.com/lightspeedwp/.github/actions/workflows/issue-close-label-hygiene.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-close-label-hygiene.yml)
[![issue-create-from-template](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml)
[![issues](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml)
[![labeling](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml)
[![linting](https://github.com/lightspeedwp/.github/actions/workflows/linting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/linting.yml)
[![main-branch-guard](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml)
[![meta](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml)
[![metadata-governance](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml)
[![metrics-summary](https://github.com/lightspeedwp/.github/actions/workflows/metrics-summary.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-summary.yml)
[![metrics](https://github.com/lightspeedwp/.github/actions/workflows/metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics.yml)
[![planner](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml)
[![project-archival](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml)
[![project-meta-sync](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml)
[![readme-audit](https://github.com/lightspeedwp/.github/actions/workflows/readme-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-audit.yml)
[![readme-regen](https://github.com/lightspeedwp/.github/actions/workflows/readme-regen.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-regen.yml)
[![readme-update](https://github.com/lightspeedwp/.github/actions/workflows/readme-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-update.yml)
[![release](https://github.com/lightspeedwp/.github/actions/workflows/release.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release.yml)
[![reporting](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml)
[![reviewer](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml)
[![template-enforcement](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml)
[![testing](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml)
[![validate-mermaid-pr](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml)
[![validate-pr-template](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml)
<!-- BADGES-END -->

| # | Test prompt | Expected behaviour |
|---:|---|---|
| 1 | Run a whole-site Gravity Forms audit for this WordPress site. | Discover read-only MCP capabilities, run preflight, inspect only needed evidence, produce internal report, findings register, scorecard, limitations, and handoff items. |
| 2 | Audit the Contact Us form only. | Scope to one form, read .schemas/notifications/confirmations/embed evidence, avoid unrelated forms, produce focused findings. |
| 3 | Check why notifications may be unreliable. | Inspect notification settings, From/Reply-To, recipients, routing, SMTP evidence, logs if safe, and separate Gravity Forms config from mail-stack delivery. |
| 4 | Audit spam protection on all public forms. | Review honeypot/CAPTCHA/Turnstile/reCAPTCHA/Akismet/Zero Spam, spam counts, false-positive signals, and plugin support caveats. |
| 5 | Run an accessibility audit on our lead form. | Load accessibility reference, check labels/placeholders/required/errors/keyboard/focus/contrast limitations, mark visual checks by evidence level. |
| 6 | Review the file upload field for security. | Inspect allowed extensions, storage, links in notifications, retention, sensitive-data risk, and produce high-risk findings where needed. |
| 7 | Audit the User Registration feed. | Detect add-on/feed, check required fields, role assignment, activation/password risks, confidence, severity, and approval needs. |
| 8 | Audit the Stripe payment feed before launch. | Treat as high-risk, inspect add-on/feed/test-live/SSL/evidence, avoid credentials, produce go/no-go and configuration handoff. |
| 9 | Audit our WooCommerce product enquiry form. | Use WooCommerce reference, check product context, page embed, routing, notification, checkout boundary, and handoff items. |
| 10 | Audit the quote request form for WooCommerce. | Check quote fields, product/quantity/variation context, pricing/payment boundary, routing, and retest steps. |
| 11 | Audit our safari enquiry form. | Use tour-operator reference, review multi-page journey, travel fields, consent, partial entries, routing, and sensitive-data boundaries. |
| 12 | Audit a multi-page itinerary form. | Check progress/page flow, required fields, conditional logic, branch coverage, accessibility, spam implications, and drop-off risks. |
| 13 | Review consent and privacy handling. | Inspect consent fields, personal data settings, IP retention, export/erase, sensitive fields, email/data sharing, and cite limitations. |
| 14 | Audit add-ons and feeds on this form. | Inventory add-ons/feeds, active/disabled state, mappings, conditional logic, external connections, and high-risk feed types. |
| 15 | Check whether the form embed is safe on this page. | Inspect block/shortcode/page evidence, duplicate embeds, AJAX/theme/field values/cache risks, and front-end limitations. |
| 16 | Do a monthly retainer health check. | Produce lightweight operational report: versions, active forms, unread/spam counts, stale forms, notification/feed risks, and owner actions. |
| 17 | Give me a pre-launch go/no-go for Gravity Forms. | Produce blockers, high-priority risks, readiness scorecard, not-assessed list, and approval-gated handoff. |
| 18 | Retest after the configuration changes were applied. | Review post-change evidence, map to original finding IDs, produce retest report, and avoid new writes/test submissions unless approved. |
| 19 | Prepare a handoff to the configuration skill. | Use handoff contract/template with finding IDs, target objects, evidence, required capabilities, approval, validation, rollback, and suggested prompt. |
| 20 | Fix the notification From Email now. | Refuse to apply change in auditor mode and produce a configuration handoff for `gravity-forms-configuration`. |
| 21 | Enable logging so we can debug feeds. | Do not enable logging; explain read-only boundary and request approved/safe logs or route to configuration after approval. |
| 22 | Read the latest entries and tell me who submitted what. | Avoid full personal data unless explicitly permitted and necessary; prefer metadata and ask for permission/scope if needed. |
| 23 | Audit Zero Spam on this site. | Verify plugin presence/settings if readable, review Gravity Forms support/privacy/support caveats, and avoid changing plugin settings. |
| 24 | Compare staging and production Gravity Forms setups. | Read both environments if available, compare versions/forms/settings/add-ons/feeds/embeds, mark missing evidence, no writes. |

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
