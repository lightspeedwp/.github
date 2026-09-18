# Audit scope and boundaries

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

## Covered scopes

- WooCommerce Gravity Forms setup audit: inventory forms used by the store, product/order/customer context, plugin/add-on posture, embeddings, notifications, spam/privacy/security posture, maintainability, and owner readiness.
- Single WooCommerce form audit: review one named product enquiry, quote request, stock/availability, B2B/wholesale, order-support, account-support, deposit/payment, customer onboarding, or product-page form plus related embeds, confirmations, notifications, feeds, spam/privacy controls, and retest requirements.
- WooCommerce pre-launch audit: identify blockers before production use and produce go/no-go notes for store-related form journeys.
- Retainer health check: light recurring check for stale WooCommerce-related forms, unread/spam counts, broken notification risks, outdated versions, and ownership gaps.
- Troubleshooting audit: review evidence around a specific WooCommerce form failure, such as lost enquiries, missing order-support emails, product-context loss, feed failures, cache conflicts, or spam false positives.
- Accessibility-focused audit: review labels, required states, validation, keyboard path, field choices, and page evidence where available for WooCommerce form journeys.
- Spam/security-focused audit: review honeypot, CAPTCHA/Turnstile/reCAPTCHA/Akismet/Zero Spam, file uploads, logs, permissions, and data exposure for WooCommerce form use.
- WooCommerce enquiry audit: product enquiry forms, quote request forms, stock or availability enquiry forms, B2B or wholesale forms, customer onboarding forms, customer account support forms, order-related contact forms, product context capture, routing, payment/deposit boundaries, extension-related form flows, and product page embeds.

## Exclusions and route-away rules

- Do not configure or change Gravity Forms; route approved WooCommerce form remediation to `woocommerce-gravity-forms-configuration` with a handoff.
- Do not use this skill for non-WooCommerce WordPress sites or generic forms that have no WooCommerce product, order, customer, account, quote, stock, payment, wholesale, or extension context.
- Do not draft legal privacy policies; route to legal/privacy review or the appropriate LightSpeed policy skill.
- Do not run whole-site accessibility, performance, security, or SEO audits unless WooCommerce Gravity Forms is the scoped subset.
- Do not design custom plugin code; route to WordPress/plugin development.
- Do not redesign WooCommerce checkout, tax, subscription, order, stock, shipping, refund, fulfilment, or account architecture unless the form flow is explicitly scoped and approved.
- Do not inspect full entry personal data unless the user confirms permission and it is necessary for the audit.
- Do not rely on generic blogs for audit criteria. Use official documentation or label LightSpeed recommendations.

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
