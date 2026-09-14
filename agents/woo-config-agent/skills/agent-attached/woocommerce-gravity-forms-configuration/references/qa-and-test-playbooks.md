# QA and test playbooks

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

Use this file for validation after a Gravity Forms change, troubleshooting outcome checks, or test-report creation.

## Baseline validation matrix

| Check | Pass condition | Evidence to record |
|---|---|---|
| Form status | Target form exists, correct status, expected title | Form ID/name/status |
| Field schema | Required fields, labels, choices, IDs, conditional logic match plan | Field table or JSON diff |
| Required fields | Empty required fields trigger useful errors | Test result summary |
| Conditional logic | Hidden/shown fields match scenarios | Scenario list |
| Confirmation | Correct text/page/redirect appears without leaking sensitive data | Confirmation type/result |
| Admin notification | Routed to expected inbox; From and Reply-To are safe | Recipient/subject/result, no secrets |
| User autoresponder | Sent only when expected; no sensitive data overexposed | Recipient condition/result |
| Spam | Honeypot/layered control enabled or justified | Spam setting and false-positive notes |
| Accessibility | Labels, descriptions, errors, keyboard path, focus, contrast basics checked | Findings and blockers |
| Entry | Test entry saved or intentionally blocked as expected | Entry ID/status, redacted |
| Feeds | Add-on feed fires only in expected scenarios | Feed ID/status/result |
| Embed | Correct page/block, no duplicate embed, cache considered | Page URL/ID and block result |

## Test scenarios by form type

### Contact/enquiry

- Valid submission with all required fields.
- Missing email and missing message.
- Invalid email format.
- Spam-like message with URL-heavy content if spam controls are being reviewed.
- Consent unchecked when consent is required.

### Quote/project request

- Budget/timeline choices route to correct notification.
- Optional file upload omitted.
- Optional file upload provided using allowed file type and safe filename.
- Conditional fields hidden until trigger choice is selected.
- Large message or unsupported file type rejected safely.

### WooCommerce product enquiry

- Product context is captured through hidden or dynamic fields.
- Enquiry submits without creating an order unless explicitly scoped.
- Product URL/SKU/name merge tags do not expose private product data.
- Sales notification routes to the approved inbox.
- Stock, tax, subscription, fulfilment, and checkout assumptions are not made.

### WooCommerce product enquiry

- Single-product and multi-product enquiry paths.
- Flexible dates and fixed date paths.
- Product/category interest conditional questions.
- Consent/privacy accepted.
- Long multi-page journey back/next navigation.
- Optional partial-entry behaviour only if installed and approved.

### Payment/deposit

- Test mode only unless live mode is explicitly approved.
- Payment field appears only after earlier required fields pass.
- Failed payment, cancelled payment, and successful test payment paths.
- Notification/feed processing matches gateway result.
- No card data is exposed in entries, notifications, or handoff notes.

### User registration

- Add-on, feed, role, activation flow, and email templates verified.
- Duplicate email path.
- Weak/missing password behaviour if applicable.
- Role assignment matches approved policy.
- No account is created on failed validation/payment unless intended.

## Accessibility spot-check script for agents

When MCP cannot run browser-level tests, still check:

- Every user-visible field has a visible label.
- Placeholders are hints only, not the only instruction.
- Required state is visible and not colour-only.
- Error messages identify the field and needed correction.
- Multi-page forms include clear navigation and progress context.
- Confirmation text tells the user what happens next.
- Custom CSS/classes do not imply hidden labels, low contrast, or removed focus states.

## Reporting rules

- Mark skipped checks explicitly; do not silently omit them.
- Separate connector-verified evidence from user-reported or inferred results.
- Redact names, emails, phone numbers, addresses, message bodies, uploaded filenames, and entry IDs unless the user asked for those specifics and permissions allow it.
- Do not claim email deliverability is fixed until a real or controlled test confirms delivery to the target mailbox.

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
