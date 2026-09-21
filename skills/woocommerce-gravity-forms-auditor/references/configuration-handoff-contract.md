# WooCommerce configuration handoff contract

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

Use this contract when preparing WooCommerce Gravity Forms findings for `woocommerce-gravity-forms-configuration`. The auditor must not apply the changes.

## Required handoff fields

- Source audit report: title/date/site/environment/report path or summary.
- Finding ID: stable ID from findings register.
- Affected site: canonical WooCommerce site URL and environment.
- WooCommerce context: product enquiry, quote request, stock/availability, B2B/wholesale, order support, account support, customer onboarding, payment/deposit, user registration, product page embed, or extension-related flow.
- Affected form/page/product/order/account/add-on: form ID/title, page URL, product context, feed/add-on/notification/confirmation if known.
- Evidence: concise confirmed evidence, redacted where needed.
- Recommended fix: what should change and why.
- Risk level: Blocker, High, Medium, Low, or Info.
- Required MCP capability: e.g. update form schema, update notification, update confirmation, update feed, update page embed, update personal data setting.
- Required add-ons/extensions: installed/active/licence evidence or missing dependency.
- Approval needed: yes/no plus reason.
- Suggested validation steps: post-change checks, approved test submission requirements, logs, page checks, notification checks, product/order context checks.
- Rollback consideration: what to revert or preserve if the change causes issues.
- Suggested prompt for `woocommerce-gravity-forms-configuration`: direct prompt with enough context and no hidden assumptions.

## Handoff quality bar

- Include only actionable WooCommerce Gravity Forms findings.
- Keep personal data, order data, account data, payment data, and secrets out of the handoff unless absolutely required and permitted.
- Mark missing evidence instead of inventing details.
- Separate official Gravity Forms/WooCommerce guidance from LightSpeed recommendations.
- Include acceptance/retest criteria so configuration work can close cleanly.

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
