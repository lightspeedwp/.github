# Fields and form objects

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
<!-- BADGES-END -->

## Field categories

- **Standard fields**: Single Line Text, Paragraph Text, Drop Down, Multi Choice/Radio, Checkboxes, Number, Hidden, HTML, Section Break, Page Break, Image Choice, Multiple Choice.
- **Advanced fields**: Name, Email, Phone, International Phone where available, Address, Date, Time, Website, File Upload, List, Consent, CAPTCHA, Turnstile, Signature, Survey, Quiz, Poll, Username, Password, Repeater beta, add-on fields.
- **Post fields**: Post Title, Body, Excerpt, Tags, Category, Image, Custom Field. Treat content creation as high-risk.
- **Pricing fields**: Product, Option, Quantity, Shipping, Total, Coupon, gateway fields such as Stripe, PayPal, Square, Mollie, approved card gateway. Treat payment flows as high-risk.

## Common field settings to model

For every field draft include: `id` when modifying, `type`, `label`, `adminLabel` if needed, `description`, `placeholder` only as a hint, `required`, `visibility`, `choices`, `inputs`, `defaultValue`, `allowsPrepopulate`, `inputName`, `noDuplicates`, `conditionalLogic`, validation constraints, layout/CSS class, autocomplete, and privacy notes.

## Accessibility defaults

Use visible labels. Do not rely on placeholders. Keep descriptions concise and attached to the relevant field. Make required state clear. Ensure choice groups have clear legends and labels. Avoid custom HTML that breaks semantic structure. For multi-page forms, use clear page titles and meaningful progress indicators.

## Conditional logic

Use conditional logic only where it reduces friction or prevents irrelevant inputs. Keep values plain text where possible. Avoid self-referencing rules and excessive nested/looping logic. Hidden fields are ignored on submission, so do not depend on hidden conditional fields for calculations, notifications, or feeds unless tested.

## Dynamic population

Dynamic population can use query strings, shortcodes/blocks, hooks, or REST/MCP-fed values depending on site implementation. Treat it as security-sensitive: validate allowed values, avoid passing personal data through URLs, document state validation implications, and test direct URL tampering.

## File Upload

Use only when required. Restrict extensions to the narrowest list, set reasonable max file size and count, avoid executable/archive types, do not send sensitive upload URLs to non-admins, and confirm secure download location. Prefer authenticated uploads or off-server processing for sensitive documents.

## Product/pricing fields

For quote/enquiry forms, prefer non-payment fields such as budget range and service interest. For actual payment/deposit forms, verify gateway add-on, SSL, feed, test mode, currency, tax/recurring billing implications, notification wording, and reconciliation process before write operations.

## Safe defaults by use case

- **Contact**: Name, Email, Phone optional, Message, Consent, honeypot/layered spam, admin notification, user confirmation.
- **Quote**: Contact details, service interest, budget range, timeline, optional upload, conditional routing, admin lead notification, confirmation with next step.
- **Tour enquiry**: Destination or tour context hidden/admin field, page URL/name, traveller contact, travel-date and group-size questions, message, consent.
- **Tour enquiry**: Multi-page layout with traveller details, destination, dates, group size, accommodation, budget, interests, consent, optional partial entries if available.
- **Membership registration**: User details, account fields only if User Registration add-on confirmed, consent, membership type, optional payment, activation/security cautions.

## No-duplicate and identity cautions

Use No Duplicates only where it matches the process, such as unique email registration or contest entries. Do not use it on shared family/company emails without warning. For user registration, plan activation, duplicate email handling, role assignment, and failure notifications.

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
