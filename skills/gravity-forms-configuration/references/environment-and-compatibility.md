# Environment and compatibility checks

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
[![labeling-unified](https://github.com/lightspeedwp/.github/actions/workflows/labeling-unified.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling-unified.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
[![workflow-lint](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml)
<!-- BADGES-END -->

Use this reference when a Gravity Forms request depends on host compatibility, WordPress/PHP versions, caching, script optimisation, logging, email delivery, uploads, or production page behaviour.

## Preflight additions

Before recommending live changes, capture:

- WordPress version and whether it is current or previous major release.
- PHP version and whether it is supported by WordPress and Gravity Forms guidance.
- MySQL/MariaDB version when exposed by system status.
- Required PHP extensions where exposed, especially `ctype`, `curl`, `dom`, and `openssl`.
- Gravity Forms version, add-on versions, and any add-on minimum-core-version blockers.
- Active theme, block theme status, and whether form templates rely on theme styles.
- Cache, page optimisation, script optimisation, CDN, WAF, security, and SMTP/email plugins.
- Whether form pages are cached or optimised.
- Whether Gravity Forms logging is currently enabled.

## Environment classification

| Finding | Risk | Recommended handling |
|---|---:|---|
| Unsupported PHP or very old WordPress | High | Stop live changes; recommend upgrade/sandbox validation first. |
| Add-on requires newer Gravity Forms core | High | Do not configure dependent feeds until version blocker is resolved. |
| Production page cached with dynamic form, conditional logic, AJAX, payments, or Save and Continue | High | Recommend cache exclusion and re-test before debugging form logic. |
| Script minify/combine/defer touches Gravity Forms assets | Medium to High | Recommend excluding Gravity Forms scripts and retesting. |
| No SMTP/deliverability plugin and notifications are business-critical | Medium | Recommend SMTP/DNS validation before treating Gravity Forms as the cause. |
| Logging enabled outside an active investigation | Medium | Recommend disabling/deleting logs after review because logs can contain personal data. |
| File uploads requested with broad extensions | High | Require explicit extension list, max size, storage/retention stance, and secure access review. |

## Cache and optimisation stance

Gravity Forms pages are often dynamic. Treat caching and script optimisation as likely suspects when:

- Conditional logic does not show/hide fields correctly.
- AJAX submissions fail intermittently.
- Multi-page forms lose state.
- Payment forms, Save and Continue, or Partial Entries behave inconsistently.
- Submit buttons spin without completion.
- Validation errors appear on valid submissions.
- One browser/session works but another fails.

Recommended sequence:

1. Confirm whether the affected page is cached via page source, response headers, hosting/CDN indicators, or plugin settings.
2. Exclude the exact form page and any staging/test page from full-page cache.
3. Exclude Gravity Forms assets from script combine/minify/defer/async tools.
4. Clear page cache, CDN cache, server cache, and browser cache.
5. Re-test with the same test data.
6. Only then move to theme/plugin conflict testing.

## Logging stance

Use logging as an investigation tool, not a permanent state.

- Enable logging only when troubleshooting requires it and the active user has permission.
- Prefer enabling logs only for the affected Gravity Forms component or add-on.
- Record that logs may contain personal data or sensitive operational details.
- Turn logging off after the investigation.
- Delete logs after handoff where the retention policy allows.
- Never paste raw personal log data into a customer-facing reply or reusable skill file.

## Notification environment stance

If entries exist but emails do not arrive, do not assume the form is broken.

Check:

- Notification is active and attached to the correct form.
- Conditional notification rules match the test entry.
- From address uses the website domain rather than a free mailbox provider.
- Reply-To uses the submitter email where appropriate.
- SMTP plugin is installed/configured if delivery matters.
- SPF, DKIM, and DMARC are aligned for the sending domain.
- Spam/junk folders and mailbox rules have been checked.
- Entry notes, Gravity Forms logs, SMTP logs, or host mail logs show send attempts or failures.

## File upload compatibility stance

For file uploads:

- Gravity Forms is constrained by WordPress upload validation and MIME checks.
- The form-level allowed extensions setting should narrow, not broaden, permitted uploads.
- Do not recommend MIME-type overrides unless the user explicitly requests a developer route and accepts risk.
- Prefer common low-risk business document types only when operationally required.
- Never accept executables, scripts, archives, or broad wildcard file types as a default.

## Output requirements

When compatibility risk is relevant, include:

- Confirmed environment facts.
- Compatibility risks.
- Cache/optimisation findings.
- Email/logging findings.
- Whether the issue is likely Gravity Forms config, environment, delivery, or unknown.
- The smallest safe next test.

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

_Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!_
