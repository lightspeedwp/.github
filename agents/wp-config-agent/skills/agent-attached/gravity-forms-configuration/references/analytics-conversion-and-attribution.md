# Analytics, conversion tracking, and attribution

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
<!-- BADGES-END -->

Use this reference when Gravity Forms work involves GA4, Google Tag Manager, Gravity Forms Google Analytics Add-On, UTM capture, hidden attribution fields, thank-you page tracking, lead-source routing, conversion QA, or tracking mismatch investigation.

## Operating stance

Keep this skill focused on Gravity Forms configuration. Do not become a full analytics implementation skill unless the user explicitly asks for a wider GA4/GTM plan. For LightSpeed workflows, produce the form-side tracking plan and hand off broader analytics architecture to the GA4/conversion tracking workflow when needed.

Separate four concerns:

1. **Form submission truth**: whether Gravity Forms saved a valid entry.
2. **Browser tracking truth**: whether browser-side tags fired on click, successful AJAX confirmation, or thank-you page load.
3. **Server/add-on tracking truth**: whether the Gravity Forms Google Analytics Add-On or another feed sent an event after a valid submission.
4. **Attribution truth**: which fields, cookies, query strings, hidden values, or CRM mappings preserve campaign/source data.

Never treat a browser-side tracking event as proof that Gravity Forms accepted or stored an entry. Browser tracking can fire before server-side validation completes.

## Capability discovery

Before recommending or applying analytics changes, inspect or ask for:

- Whether the Gravity Forms Google Analytics Add-On is installed, active, licensed, and connected.
- Whether GA4, GTM, Measurement Protocol, or manual configuration is already used.
- Whether another plugin or theme already outputs the Google tag, GA4 script, or GTM container.
- Whether a cookie/consent platform controls analytics tags.
- Whether the form uses AJAX, page confirmation, redirect confirmation, multi-page pagination, Save and Continue, payment feeds, or conditional confirmations.
- Whether tracking should happen on successful entry creation, qualified lead routing, payment success, or thank-you page view.
- Whether hidden attribution fields already exist and whether they are populated by query string, block Field Values, shortcode field_values, JavaScript, or a server-side hook.

## Gravity Forms Google Analytics Add-On

Use the official add-on only when it is detected and connected. It can track form submission events and pagination events and supports multiple connection approaches, including Google Measurement Protocol, Google Analytics, Google Tag Manager, and manual configuration.

Guardrails:

- Do not add a second GA/GTM script if another plugin, theme, or tag manager already outputs it.
- Do not store Measurement Protocol API secrets or GTM credentials in skill files, examples, handoffs, or chat output.
- Treat connection changes, measurement IDs, GTM container IDs, workspace IDs, and script insertion as approval-sensitive.
- Prefer test/staging validation before production tracking changes.
- For multi-page forms, document whether pagination tracking is desired or excluded.
- For AJAX forms, confirm how the selected method detects a successful submission.

## Event naming defaults

Use GA4 recommended event names where they fit:

- `generate_lead` for successful lead/contact/quote/tour enquiry submissions.
- `sign_up` for account or membership registration flows where an account is actually created.
- `purchase` only for completed payment/order outcomes, not generic quote requests or deposit intent.

For internal-friendly reporting, add parameters rather than inventing many one-off event names:

- `form_id`
- `form_name`
- `form_type`
- `lead_type`
- `service_interest`
- `destination_interest`
- `page_path`
- `confirmation_type`

Do not send personal data such as name, email, phone, message content, address, uploaded-file URL, or free-text notes to analytics tools unless a separate privacy/legal review explicitly approves the data flow. Default to no personal data in analytics events.

## UTM and attribution capture

Use hidden fields for campaign attribution only when there is a clear reporting or CRM need.

Recommended hidden fields:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `gclid` or `gbraid` / `wbraid` only when advertising governance allows it
- `referrer`
- `landing_page`
- `current_page`

Safe defaults:

- Prefix dynamic population parameter names to avoid WordPress reserved terms, such as `ls_utm_source` rather than `source`.
- Do not mark attribution fields as required.
- Keep attribution fields hidden or administrative, but do not use hidden fields for security-sensitive decisions because users can manipulate client-side values.
- Treat query-string and block Field Values population as cache-sensitive.
- Record whether attribution values are allowed into notifications, CRM feeds, or exports.
- Avoid passing submitted personal data in confirmation redirect query strings.

## Confirmation and thank-you page tracking

Choose the tracking method based on the user journey:

- **Text confirmation**: best for simple UX; requires AJAX/event-aware tracking if tracking must happen without a page load.
- **Page confirmation**: useful when a dedicated thank-you page is needed for tracking, content, next-step instructions, or ad-platform conversions.
- **Redirect confirmation**: use only when there is a clear destination and approved query-string policy.

Guardrails:

- Do not use the submit-button click as the sole conversion signal.
- Do not pass personal data or sensitive merge tags in redirect URLs.
- For conditional confirmations, map each branch to its expected event or exclusion.
- For payment forms, distinguish form submitted from payment completed.

## Tracking QA checklist

For every conversion-tracking plan, include:

1. Form preview submission.
2. Live/staging embedded page submission.
3. Required-field validation failure test.
4. Spam/honeypot rejection or suspected spam test where safe.
5. AJAX and non-AJAX behaviour if both are possible.
6. Confirmation branch test.
7. Entry existence check.
8. Notification/feed result check.
9. GA4 Realtime or DebugView check, if GA4 is in scope.
10. GTM Preview/Tag Assistant check, if GTM is in scope.
11. Consent accepted/refused checks where a consent platform controls analytics.
12. Duplicate submission prevention check where multiple tracking scripts may fire.

## Mismatch investigation

When analytics shows more submissions than Gravity Forms entries:

- Check whether tracking fires on submit-button click rather than successful entry creation.
- Check spam entries and trashed entries.
- Check validation failures, especially hidden required fields, file upload errors, CAPTCHA, payment errors, and required conditional fields.
- Check AJAX errors and JavaScript conflicts.
- Check whether browser-side scripts capture attempted submissions directly.
- Check whether duplicate scripts or both add-on and GTM tracking fire events.

When Gravity Forms has entries but analytics does not:

- Check consent refusal, ad blockers, script optimisation, cache/CDN, AJAX event handling, confirmation type, missing tag/container, wrong GA4 property, and GTM unpublished workspace.
- Check whether server-side add-on feeds failed or are queued.

## Route-away boundaries

Route away or hand off when the user needs:

- Full GA4 property architecture.
- Cookie banner legal review.
- Consent Mode implementation outside the form context.
- Ad-platform conversion API/server-side tagging design.
- Looker Studio dashboard build.
- Whole-site tracking audit.

Provide a Gravity Forms handoff with confirmed form IDs, confirmation types, hidden fields, feed state, and recommended event names.

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
