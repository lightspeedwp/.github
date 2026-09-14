# Customer Research Input Normalisation Schema

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

Use this schema when the user's request contains messy, partial, or mixed customer identifiers. The goal is to resolve a safe research scope before searching sources, without forcing the user through a long intake flow.

## Normalised Input Record

Create this internal record before searching. Do not include it in the final brief unless it clarifies ambiguity or evidence limitations.

| Field | Required | Notes |
|---|---:|---|
| `customer_name` | when available | Customer, client, account, organisation, or project name supplied by the user or resolved from evidence. |
| `organisation_name` | when available | Zendesk organisation or account name, if distinct from the customer name. |
| `contact_email` | when available | Email address supplied by the user or found in the thread. |
| `domain` | when available | Customer domain or website. Use for search expansion, not as proof of organisation match by itself. |
| `zendesk_ticket_id` | when available | Ticket ID from a URL, pasted export, or user instruction. |
| `zendesk_ticket_url` | when available | Original ticket URL, if supplied. |
| `project_or_product_context` | optional | Project, site, plugin, product area, or affected service when it narrows the support context. |
| `requested_window` | required | The user phrase, such as `recent`, `this week`, `last 30 days`, or explicit dates. |
| `resolved_window` | required | Absolute date range used for research. |
| `research_mode` | required | `support pulse`, `issue background`, `prior commitments`, `escalation signals`, or `pattern check`. |
| `primary_question` | required | The concrete support question the brief must answer. |
| `provided_sources` | required | Pasted notes, exports, URLs, documents, screenshots, or snippets supplied by the user. |
| `intended_sources` | required | Sources worth checking for this request. |
| `unavailable_sources` | as needed | Sources the shared agent cannot access. Do not treat these as no-result searches. |
| `sources_intentionally_skipped` | as needed | Sources not checked because they are unlikely to add evidence or are out of scope. |
| `starting_confidence` | required | `High`, `Medium`, or `Low` before research, based on identifier clarity and available source access. |
| `ambiguity_notes` | as needed | Competing matches, weak identifiers, stale source warnings, or source conflicts. |

## Resolution Order

Prefer direct, support-authoritative identifiers over loose names.

1. Zendesk ticket ID or Zendesk ticket URL.
2. Zendesk organisation, requester email, or customer domain confirmed in Zendesk.
3. Pasted Zendesk export or thread with customer identity.
4. Customer email thread that clearly identifies the account.
5. Shared Drive, Slack, Asana, Linear, or GitHub context that supports but does not replace Zendesk identity.
6. Bare customer name or project name.

When a customer name could match multiple accounts, search by the strongest available identifier first. Ask a follow-up only when the customer cannot be resolved safely or when two plausible matches would materially change the brief.

## Default Inference Rules

Use these defaults unless the user specifies otherwise.

- `recent`, `latest`, or `today`: past 24 hours.
- No window supplied: past 7 days.
- `this week`: current calendar week in the user's locale, stated as absolute dates.
- `last week`: previous calendar week, stated as absolute dates.
- `support pulse`: default mode when the user asks what is going on, what changed, or what to know before replying.
- `prior commitments`: use when the user asks what was promised, agreed, sent, or committed.
- `escalation signals`: use when the user asks whether this needs escalation, whether risk is rising, or whether ownership is unclear.
- `pattern check`: use when the user asks whether issues repeat, look related, or may be duplicates.
- `issue background`: use when the user asks for context on one problem without requesting root-cause proof.

## Starting Confidence

Use starting confidence before research to decide whether to search directly or pause for a focused clarification.

- `High`: Zendesk ticket ID, ticket URL, organisation ID, exact requester email, or clearly pasted ticket export is available.
- `Medium`: customer name plus domain, email thread, project name, or pasted support context is available.
- `Low`: only a vague customer name, ambiguous project label, or unsupported issue description is available.

Low starting confidence does not block the brief. It means the final output must clearly state the ambiguity and avoid strong conclusions unless research resolves it.

## Safe Normalisation Examples

### Ticket URL supplied

User input: `Research ticket 12345 for Safari Partners before I reply.`

Normalise as:

- `zendesk_ticket_id`: `12345`
- `customer_name`: unknown until ticket is read
- `research_mode`: `support pulse`
- `requested_window`: default 7 days plus still-open linked context
- `starting_confidence`: `High`

### Bare customer name supplied

User input: `Give me a recent support pulse for Media24.`

Normalise as:

- `customer_name`: `Media24`
- `research_mode`: `support pulse`
- `requested_window`: default 7 days
- `intended_sources`: Zendesk organisation/customer search first, then supporting email/docs/chat only if relevant
- `starting_confidence`: `Medium` unless multiple Media24-related organisations are likely

### Connector unavailable

User input: `Check prior commitments for VKB Europe.`

If Zendesk is unavailable but Gmail is available:

- mark Zendesk as `unavailable`, not `no result`
- search Gmail for commitments if appropriate
- keep support-health confidence no higher than `Medium` unless pasted Zendesk evidence is also available
- say that live ticket status was not verified

## Final Brief Use

The normalised input record usually remains internal. Surface only the parts that help the teammate trust the brief:

- resolved customer/account
- absolute time window
- research mode
- important ambiguity or source limitation
- connector unavailability that affects confidence

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
