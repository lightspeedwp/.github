# Memory policy

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

Use this reference before saving, suggesting, or relying on durable memory from a Zendesk bug report package workflow.

## Default stance

Do not store case-specific facts by default. Most support-ticket evidence is temporary, customer-specific, sensitive, or likely to change.

## Do not save by default

Do not store these as memory unless the user explicitly asks and it is safe to do so:

- Customer names, account names, requester names, emails, phone numbers, domains, private URLs, or organisation-specific identifiers.
- Ticket IDs, side conversation IDs, attachment names, screenshots, logs, stack traces, request payloads, auth headers, API keys, cookies, tokens, credentials, or raw error dumps.
- Payment, billing, refund, invoice, subscription, legal, compliance, security, HR, abuse, safeguarding, or complaint details.
- One-off impact claims, timelines, severity decisions, workarounds, routing outcomes, or internal ownership decisions.
- Unverified root-cause guesses, suspected defects, product limitations, or temporary incident observations.
- Personal teammate preferences, private saved views, or assumptions tied to one logged-in user.

## Safe memory candidates

Only consider saving durable information when it is stable, non-sensitive, broadly reusable, and approved by the user. Examples:

- A team-wide bug package template change.
- A stable routing rule between Zendesk bug packages and adjacent Zendesk skills.
- A reusable evidence minimum, such as required browser/device/version fields for a product surface.
- A redaction convention for engineering handoffs.
- An approved severity rubric or destination mapping.
- A durable wording preference for internal handoffs.

## How to propose memory safely

When a reusable pattern appears, ask or state the narrow candidate before saving. Keep it generic.

Good:

```markdown
Reusable pattern candidate: for checkout bugs, require browser, device, payment method, redacted order reference, exact timestamp, and screenshot/video before engineering handoff.
```

Bad:

```markdown
Remember that a named customer had a checkout bug on a specific ticket caused by a specific plugin and should go to a named engineer.
```

## Relying on memory

If durable memory exists, treat it as a starting convention, not case evidence. Case facts must still come from Zendesk or supplied evidence during the current run.

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
