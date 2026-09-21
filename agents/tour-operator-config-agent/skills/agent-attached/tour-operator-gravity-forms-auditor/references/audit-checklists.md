# Audit checklists

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

## Global Gravity Forms setup

- Gravity Forms installed, active, current enough for support.
- WordPress/PHP environment meets current support expectations.
- Licence/update visibility is known or marked missing.
- SMTP/transactional email plugin present where notifications matter.
- Cache/CDN/script optimisation plugins identified.
- Security/spam plugins identified.
- Add-ons inventoried and mapped to forms/feeds.
- Ownership, monitoring, unread/spam counts, and retainer responsibility known.

## Individual form structure

- Form status active/inactive matches expected use.
- Purpose is clear from title, description, embed location, and fields.
- Required fields are justified.
- Field order follows the user journey.
- Long forms use sections/pages where useful.
- Submit button text sets expectation.

## Field quality

- Use specific field types for email, phone, date, number, URL, consent, file upload, choice, and pricing data.
- Avoid placeholder-only labels.
- Descriptions/instructions are clear and not excessive.
- Choices are concise, non-duplicated, and support reporting.
- Hidden fields and dynamic values are documented.

## Conditional logic

- Branches are understandable and testable.
- Required fields are not unreachable.
- Page/section/button logic has branch coverage.
- Conditional notifications/feeds/confirmations match submitted values.

## Confirmations

- Confirmation type is appropriate: text, page, or redirect.
- Message aligns with notification/user expectations.
- Redirects avoid leaking personal data in query strings.
- Spam confirmation behaviour is understood.

## Notifications

- Admin notification exists and is enabled where needed.
- User autoresponder exists where expected.
- Recipients/routing are valid.
- From uses a domain-authorised address; Reply-To uses submitter email when appropriate.
- Sensitive data and file URLs are limited.

## Feeds

- Active/disabled feeds are inventoried.
- Field mappings are complete.
- Conditions are explicit and testable.
- External service connection evidence is available without exposing secrets.
- Payment/User Registration feeds get high-risk handling.

## Embeds

- Form appears on the expected page(s).
- Duplicate same-form embeds are flagged.
- Block/shortcode settings are reviewed.
- AJAX, theme, field values, and dynamic population are documented.
- Cache/minification compatibility is considered.

## Spam controls

- Honeypot status known.
- Turnstile/reCAPTCHA/Akismet/Zero Spam status known where installed.
- Spam counts and false-positive signals reviewed without exposing personal data.
- Save and Continue/Partial Entries limitations reviewed.

## File uploads

- File upload fields are necessary.
- Allowed extensions are restrictive.
- File size/count limits are appropriate.
- Uploaded file links are not exposed to non-admin recipients unless approved.
- Storage/retention/off-server handling is known.

## Privacy/data handling

- Personal data fields are justified.
- Consent exists where needed.
- IP storage stance known.
- Entry retention/export/erase settings known or marked missing.
- Sensitive data is not sent unnecessarily to email/external services.

## Performance/front-end behaviour

- Dynamic fields and conditional logic are cache-aware.
- CAPTCHA/Turnstile/reCAPTCHA scripts are not blocked.
- Multi-page/payment forms avoid unnecessary front-end conflicts.

## Maintenance readiness

- Form owner known.
- Active forms have purpose and page mapping.
- Stale/orphaned forms flagged.
- Critical forms have notification/feed retest steps.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

_Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team_
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
