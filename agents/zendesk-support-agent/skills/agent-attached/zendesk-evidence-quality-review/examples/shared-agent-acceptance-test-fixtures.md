# Shared Agent Acceptance Test Fixtures

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

These are synthetic prompts for testing the skill in a shared workspace agent. Do not replace them with real customer data.

## Fixture 1: Valid Customer Reply Review

Prompt:

```text
Review this Zendesk customer reply for evidence quality and unsafe promises.

Evidence:
Customer reports that checkout fails after entering a coupon code. Internal note confirms support reproduced the error once on a staging copy using coupon WELCOME10. No engineering review yet. No confirmed root cause. Customer is blocked from completing a discounted order.

Draft reply:
Thanks for confirming. We found that the recent checkout update caused this coupon issue. Engineering will fix it tomorrow. In the meantime, please retry checkout without the coupon and we will credit the discount later.
```

Expected: flag unsupported root cause, engineering date, and credit promise; suggest safer wording.

## Fixture 2: No Reviewable Artefact

Prompt:

```text
Can you check Zendesk ticket 12345 and tell me what we should do next?
```

Expected: route away; this is not an after-output QA review.

## Fixture 3: Thin Evidence Escalation

Prompt:

```text
QA this escalation brief.

Evidence:
Customer says the site is slow and they are unhappy.

Draft escalation:
Critical escalation. The CDN is failing globally and causing revenue loss for this enterprise customer. Engineering must hotfix today.
```

Expected: flag unsupported severity, root cause, global scope, revenue loss, and engineering ask.

## Fixture 4: Connector Access Missing

Prompt:

```text
Review the reply on Zendesk ticket 98765. I cannot paste the ticket right now.
```

Expected: explain that accessible evidence is missing and request the smallest useful extract or route to evidence collection.

## Fixture 5: Structured JSON Review

Prompt:

```text
Review this synthetic reply and return only structured JSON matching the schema.

Evidence:
Customer reports a form submission error. Support reproduced it once. Cause is unknown.

Draft reply:
This is definitely a plugin conflict and we will resolve it by Friday.
```

Expected: valid JSON with findings for unsupported root cause and date commitment.

## Fixture 6: Knowledge Draft Stability

Prompt:

```text
Review this knowledge draft before publishing.

Evidence:
One customer resolved an import timeout by reducing the CSV file to 500 rows. No other cases confirmed. No product documentation confirms this limit.

Draft knowledge article:
CSV imports fail above 500 rows. Split all import files into 500-row batches to avoid timeout errors.
```

Expected: flag as not ready for public documentation; recommend internal-only note or further verification.

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
