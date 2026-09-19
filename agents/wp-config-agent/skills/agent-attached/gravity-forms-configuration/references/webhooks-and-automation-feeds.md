# Webhooks and Automation Feeds

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

Use this reference when a Gravity Forms workflow sends data to external systems through Webhooks, Zapier, Slack, CRM, marketing, Help Scout, Salesforce, HubSpot, custom APIs, or other automation feeds.

## Operating stance

Treat outbound automation as data disclosure and integration behaviour. Do not assume an external service, credential, endpoint, or field mapping exists. Do not expose secrets. Prefer read-only feed audit, draft mapping, sandbox test, and explicit approval before live writes.

## Capability and add-on checks

Before creating or editing automation feeds, confirm:

- The required add-on is installed, active, licensed, and connected.
- The active MCP connector can read existing feed settings.
- The current form fields and entry meta are available for mapping.
- Existing conditional logic and spam-handling behaviour.
- Whether the feed sends all fields or selected fields.
- Whether the external endpoint or integration is production, staging, or sandbox.
- Whether logs can be enabled temporarily and redacted after troubleshooting.

## Webhook feed rules

For Webhooks specifically, review:

- Request URL and whether it passes WordPress HTTP URL validation.
- Request method: GET, POST, PUT, PATCH, or DELETE.
- Request format: form encoded or JSON.
- Headers, without exposing API keys or bearer tokens.
- Body mode: All Fields vs selected field mapping.
- Merge tags in URL, headers, or body.
- Conditional logic that decides when the webhook runs.
- Retry/error handling expectations if the target service is unavailable.

Safe defaults:

- Prefer selected field mappings over All Fields.
- Avoid sending file URLs, notes, IP addresses, hidden routing fields, or consent text unless needed.
- Avoid DELETE webhooks unless a senior developer explicitly approves.
- Prefer POST JSON for structured lead handoff when supported by the target service.
- Use staging or test endpoints before production endpoints.

## Marketing and CRM feed rules

For marketing and CRM feeds:

- Confirm consent and lawful basis before adding contacts to lists.
- Map only required fields and approved segmentation fields.
- Keep competition entry, service enquiry, and newsletter opt-in consent separate.
- Document double opt-in or external confirmation behaviour when available.
- Do not assume HubSpot, Mailchimp, Salesforce, Zapier, or Slack is connected because the add-on is installed.

## Approval triggers

Require explicit approval before:

- Creating or changing live webhook, CRM, marketing, Slack, or Zapier feeds.
- Sending all fields to an external service.
- Sending uploaded-file URLs, IP addresses, hidden metadata, or sensitive text fields.
- Adding users to marketing lists.
- Changing production endpoints, authentication headers, request method, or request body.
- Enabling logs that may capture personal data or secrets.

## Validation checklist

Run or recommend:

- Test submission with non-sensitive test data.
- Confirm feed condition matched or deliberately skipped.
- Confirm outbound request success in logs or integration dashboard.
- Confirm only approved fields were sent.
- Confirm external system received expected values in the right record/list/channel.
- Confirm notification and confirmation still match the same routing logic.
- Disable temporary logging and redact evidence before handoff.

## Handoff notes

Record:

- Feed name and add-on type.
- External system and environment.
- Mapped fields, excluded fields, and reason.
- Consent source for marketing feeds.
- Conditional logic.
- Test entry ID if permitted, with personal data redacted.
- Remaining risks and owner for external-system verification.

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
