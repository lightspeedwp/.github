# Troubleshooting

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

## First checks

1. Run system/site preflight.
2. Confirm Gravity Forms version, WordPress version, PHP version, licence visibility, and add-on status.
3. Read the target form, notifications, confirmations, feeds, and page embed.
4. Check logs if available, enabling temporary logging only when needed.
5. Reproduce with safe test data.
6. Separate form configuration issues from WordPress/server/email/cache/theme/plugin issues.

## Common issues

### Not receiving notifications

Check notification enabled state, recipient typos/spaces, valid domain-aligned From Email, Reply-To, routing conditions, spam folder, SMTP/transactional email plugin, DNS/SPF/DMARC, and Gravity Forms logs. Remember Gravity Forms passes mail to WordPress `wp_mail()`; delivery occurs after that handoff.

### Form not submitting

Check required fields, validation messages, spam controls, JavaScript errors, optimisation/defer plugins, cached pages, nonce/state validation, hidden UI rendering, and theme/plugin conflicts.

### Duplicate submissions

Check double-click behaviour, slow confirmation, browser refresh, gateway callbacks, No Duplicates settings, custom JS, and retries. Add clearer submit state or duplicate controls only after evidence.

### JavaScript conflicts

Check browser console, no-conflict mode where appropriate, theme scripts, page builders, popups/hidden tabs, delayed scripts, and cache/minification exclusions.

### Feed debugging

Read feed settings, conditions, logs, add-on status, external API credentials/connection, background processing, and error notifications. Do not retry high-risk feeds blindly.

### Payment feed issues

Use gateway test mode, check product/pricing fields, payment field, feed condition, webhook/callback, currency, SSL, and gateway logs. Escalate before live payment changes.

### REST API errors

Check REST API setting, authentication method, API keys/application passwords, permissions, route availability, content type, and whether the MCP app wraps REST or PHP API.

### PHP compatibility / memory / execution time

Check system requirements, PHP version, memory limit, max upload size, execution time, and host logs. Escalate hosting-level remediation outside this skill.

### File upload errors

Check allowed extensions, file size, upload directory permissions, server upload limits, `.htaccess`, secure download rules, off-server feed status, and antivirus/security plugins.

### Spam false positives

Review spam entries/logs, active anti-spam plugins, Turnstile/reCAPTCHA keys, honeypot conflicts, caching/JS optimisation, IP reputation services, and false-positive patterns. Do not disable all spam controls without approval.

### Accessibility warnings

Identify the exact field and warning. Fix labels, placeholders, descriptions, field grouping, hidden labels, contrast, focus, or custom HTML. Document if a warning is accepted rather than fixed.

## Escalation path

Escalate to WordPress configuration for site/plugin/capability issues, WooCommerce for checkout/order/payment architecture, hosting for server/email/cache/PHP issues, legal/privacy for policy wording, accessibility specialists for whole-site or audited compliance issues, and custom development for unsupported behaviours requiring code.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
