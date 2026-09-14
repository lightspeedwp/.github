# Privacy and Redaction Review

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

Use this reference when a support output includes, quotes, or may expose customer data, internal notes, logs, attachments, screenshots, billing context, commercial details, security-sensitive details, or other information that should not be shared broadly.

This reference is not legal advice. It is a support-safety checklist for reducing unnecessary exposure in customer replies, internal handoffs, escalations, knowledge drafts, backlog reports, and shared-agent outputs.

## Core Rule

Review whether the output uses the minimum sensitive detail needed for the support purpose. Preserve facts that are required to act, but remove or generalise unnecessary personal, customer, operational, commercial, or security-sensitive detail.

## Sensitive Detail Categories

Flag and minimise these details unless they are essential and appropriate for the audience:

- Personal data: names, email addresses, phone numbers, addresses, user IDs, IP addresses, exact timestamps tied to a person, or account identifiers.
- Customer-sensitive data: company names, account names, subscription levels, billing status, renewal dates, contract terms, discounts, or commercial negotiations.
- Security-sensitive data: authentication tokens, API keys, session IDs, password reset links, internal URLs, stack traces with secrets, exploit details, access-control weaknesses, or infrastructure identifiers.
- Operationally sensitive data: internal queue names, staff comments, internal blame, unapproved RCA, staffing limitations, vendor disputes, roadmap decisions, or escalation politics.
- Attachment or log data: screenshots, exports, debug logs, headers, request payloads, CSV rows, or file names that may include private content.
- Cross-customer data: counts, examples, or comparisons that could reveal another customer's activity, issue, configuration, or commercial arrangement.

## Audience Rules

### Customer-facing reply

- Do not expose private comments, internal notes, internal owner names, internal labels, queue status, speculation, exact logs, or other customers' information.
- Summarise the confirmed finding in plain language.
- Ask for sensitive data only when required, and request the smallest safe extract.
- Do not ask the customer to paste secrets, full credentials, full database exports, payment data, or unrestricted logs into the ticket.

### Internal handoff or escalation

- Include enough evidence for the receiver to act.
- Redact secrets, tokens, credentials, and unrelated personal data even internally.
- Mark anything that should not be shared with the customer.
- Separate confirmed facts from sensitive hypotheses or internal reasoning.

### Backlog or trend report

- Aggregate data where possible.
- Avoid naming individual customers unless the report explicitly requires named account risk.
- Use anonymised examples for broad team reports.
- Do not include ticket excerpts that reveal personal or commercial data unless needed for an authorised audience.

### Knowledge draft

- Remove ticket IDs, customer names, account-specific paths, internal debugging notes, private comments, and one-off workarounds.
- Convert private case evidence into reusable, general guidance.
- Keep unstable or sensitive workaround details internal.

## Redaction Patterns

Use bracketed placeholders when the exact value is not needed:

- `[customer name]`
- `[account ID]`
- `[email address]`
- `[ticket ID]`
- `[internal URL]`
- `[API token redacted]`
- `[log excerpt redacted]`
- `[exact timestamp removed]`
- `[other customer name removed]`

Prefer paraphrase over heavy redaction when a sentence can be made safer and clearer.

## Safe Replacement Examples

### Exact personal data

Avoid:

> Jane Smith at <jane@example.com> saw this error from IP 203.0.113.10 at 14:03.

Use:

> The affected user reported the error during their latest login attempt. The exact user and IP details should stay in the ticket evidence, not the customer-facing summary.

### Internal cause speculation

Avoid:

> This is probably because Engineering rushed the release and broke the billing sync.

Use:

> The cause is not confirmed. The timing overlaps with the recent release, so release-related changes should be checked during investigation.

### Secret or token exposure

Avoid:

> Ask the customer to send the full API key and debug export.

Use:

> Ask the customer for a redacted debug export and the final four characters of the affected key, not the full secret.

### Cross-customer exposure

Avoid:

> Three other customers, including [named account], have the same problem.

Use:

> Similar reports exist, but customer-specific comparisons should stay internal unless explicitly approved.

## Review Questions

Before marking an artefact safe to share, check:

1. Does the output include personal data that is not needed for the audience?
2. Does it include secrets, tokens, internal URLs, or unrestricted logs?
3. Does it reveal internal comments, blame, staffing issues, or unapproved product decisions?
4. Does it expose another customer, another account, or commercial terms?
5. Does it ask the customer to provide more sensitive data than needed?
6. Does a safer paraphrase preserve the support value?
7. Are customer-facing and internal-only statements clearly separated?

## How to Report Privacy Issues

Classify privacy findings as:

- `high`: secrets, credentials, payment data, security exposure details, cross-customer disclosure, or private internal notes in customer-facing text.
- `medium`: unnecessary personal or account data, avoidable commercial details, excessive logs, or unclear customer/internal boundary.
- `low`: minor over-specificity, unnecessary ticket IDs, redundant personal references, or wording that could be safely generalised.

If a high-risk privacy issue appears in customer-facing text, the artefact is not safe to send as-is.

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)
