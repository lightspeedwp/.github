# Data Redaction Rules

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

Use these rules when turning real support context into examples, regression prompts, shared-agent setup notes, QA fixtures, screenshots, documentation, or pasted context that may be reused outside the live ticket.

## Default Rule

Keep live customer facts in the live support source. Do not copy real customer identities, credentials, private URLs, personal contact details, payment details, access tokens, or ticket-specific private evidence into bundled examples, smoke tests, shared instructions, or Memory.

## What to Redact

Always redact or replace:

- customer names, account names, company names, user names, email addresses, phone numbers, and personal addresses
- private domains, staging URLs, admin URLs, invoice links, payment links, and signed file URLs
- ticket IDs, order IDs, invoice IDs, subscription IDs, internal issue IDs, and case numbers when not required for the live task
- API keys, bearer tokens, passwords, auth headers, session IDs, cookies, reset links, and one-time codes
- screenshots or snippets that expose personally identifiable information, billing details, security findings, or private system paths
- internal staff names when the output will be used as synthetic evidence or reusable documentation

## Safe Replacements

Use stable placeholders that preserve the support meaning without leaking identity:

| Sensitive value | Replacement |
| --- | --- |
| real customer name | `Customer A` |
| real company/account | `Example Account` |
| real email | `customer@example.com` |
| real staff member | `Support Agent` |
| real ticket ID | `ZD-000000` |
| real domain | `example.com` |
| real admin/staging URL | `https://example.com/admin-redacted` |
| real invoice/order ID | `ORDER-000000` |
| real API key/token | `[REDACTED_TOKEN]` |

Keep product names, general issue behaviour, dates relative to the support sequence, and confirmed/non-confirmed evidence states when they are necessary to test the reply logic.

## Redaction Workflow

1. Copy only the minimum support context needed for the task.
2. Remove secrets first: tokens, passwords, cookies, auth headers, payment details, reset links, and one-time codes.
3. Replace customer and staff identities with generic placeholders.
4. Replace private URLs, domains, IDs, and contact details.
5. Preserve the support logic: latest customer ask, confirmed facts, uncertain facts, prior promises, risk flags, and safe next step.
6. Run `scripts/redact_context.py` on reusable examples or test prompts when a deterministic pass would help.
7. Review the redacted output manually before adding it to the skill, shared agent files, or regression prompts.

## Live Drafting Exception

When drafting a live customer reply inside Zendesk or Gmail, it is acceptable to use the customer name, product area, ticket details, and other relevant evidence available in that live thread. Do not unnecessarily remove details the customer needs to recognise their own issue.

This exception does not apply to bundled examples, training prompts, smoke tests, reusable templates, shared agent setup notes, public documentation, or Memory.

## Do Not Over-Redact

Avoid replacing every meaningful detail with vague text. A useful redacted support example should still show:

- what the customer asked
- what is confirmed
- what is not confirmed
- what support already promised
- what risk is present
- what the safe next step is

If redaction makes the support scenario impossible to understand, rewrite the scenario as synthetic data instead of preserving the original thread structure.

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
