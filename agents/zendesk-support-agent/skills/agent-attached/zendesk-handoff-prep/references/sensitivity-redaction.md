# Sensitivity and redaction guide

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

Use this reference when a Zendesk-first handoff contains, may contain, or links to sensitive support evidence.

The goal is to keep internal recipients able to act without exposing customer data, credentials, private logs, or security details beyond what is necessary.

## When to use this reference

Use this reference when the case involves any of the following:

- security, access, permissions, account takeover, malware, suspicious activity, or exposed data;
- screenshots or attachments that may show customer data, admin screens, payment details, order data, emails, user lists, personal details, or private URLs;
- logs, stack traces, request payloads, webhook payloads, headers, cookies, tokens, API keys, auth details, or environment variables;
- billing, payment, refunds, invoices, bank details, subscriptions, account ownership, or commercially sensitive details;
- HR, legal, compliance, abuse, privacy, safeguarding, or complaints;
- sharing outside Zendesk, especially Slack, email, project tools, GitHub, Linear, Asana, BugHerd, or broad internal channels;
- uncertainty about whether the receiving audience is authorised to see the raw evidence.

## Default redaction principle

Include the least sensitive evidence that still lets the recipient act.

Prefer:

- ticket IDs, timestamps, event summaries, and evidence locations;
- short excerpts over full logs;
- problem summaries over raw customer data;
- masked identifiers over full identifiers;
- links back to Zendesk for authorised users instead of copying sensitive content into Slack or downstream tools.

Do not include secrets, credentials, tokens, passwords, private keys, session cookies, recovery codes, full auth headers, unnecessary personal data, or raw database exports in the handoff.

## Audience handling

Before sharing sensitive evidence, decide the audience:

- **Zendesk private note:** acceptable for support-only evidence when the Zendesk audience is appropriate.
- **Small specialist/internal channel:** acceptable for concise evidence summaries and links when the group is authorised.
- **Broad Slack channel:** avoid raw sensitive data; summarise and link to Zendesk instead.
- **GitHub, Linear, Asana, BugHerd, or roadmap tools:** avoid customer personal data, secrets, billing details, and raw logs. Use support-safe summaries and link back to Zendesk if needed.
- **Customer-facing reply:** never include internal notes, private logs, teammate names unless approved, or speculation presented as fact.

If the approved audience is unclear, state the uncertainty and keep the handoff narrow.

## Redaction patterns

Use clear placeholders so recipients understand what was removed.

| Sensitive item | Safer form |
|---|---|
| password, token, private key, cookie | `[secret omitted]` |
| full email address when not needed | `[customer email omitted]` or `a customer email address` |
| personal phone number | `[phone number omitted]` |
| payment card, bank detail, invoice detail | `[payment detail omitted]` |
| full raw log | `Log excerpt available in Zendesk attachment; relevant error: [short error summary]` |
| private admin URL | `[private admin URL omitted]` or link to Zendesk evidence if authorised |
| API key in error | `API key was present in the log and has been omitted` |
| customer data table/export | `Customer data export omitted; affected record IDs are available in Zendesk for authorised review` |

Mask only when the remaining value is useful. If the value is not needed, omit it entirely.

## Evidence summaries by destination

### Zendesk private note

Acceptable:

- concise internal diagnosis;
- links to attachments and screenshots;
- limited internal context;
- clear owner/action request.

Still avoid:

- secrets and credentials;
- unnecessary personal data;
- full logs unless essential and already appropriately attached;
- unsupported speculation.

### Slack/internal chat

Prefer:

- short problem summary;
- ticket link;
- one or two key evidence points;
- exact ask and urgency;
- note that sensitive evidence is in Zendesk.

Avoid:

- copying raw logs, screenshots with customer data, credentials, or billing details;
- sharing customer PII in broad channels;
- asking broad groups to inspect private evidence without need.

### Downstream issue tools

Prefer:

- reproducible behaviour;
- environment or product area;
- anonymised affected object type;
- support-safe evidence summary;
- Zendesk link or ticket ID for authorised context.

Avoid:

- customer personal data;
- billing details;
- private comments;
- support commitments that do not belong in product or engineering tooling;
- raw logs unless sanitised and essential.

## Security-sensitive cases

For security-sensitive cases:

1. State only confirmed security-relevant facts.
2. Identify the affected account, system, or workflow at the minimum useful level.
3. Omit secrets and credentials completely.
4. Link to the secured evidence location rather than copying raw evidence.
5. Name who should review it and who should not receive it.
6. Avoid public or broad internal channels unless the user explicitly confirms the audience is appropriate.
7. Include the sensitivity notes block from the main skill output.

Use wording such as:

```markdown
## Sensitivity notes

- Sensitive details omitted: yes
- Share with: [specific authorised team or role]
- Do not share with: broad public/internal channels or downstream tools without sanitisation
```

## Assumptions and uncertainty

If sensitivity is uncertain, mark it explicitly:

- `Sensitivity: unknown - screenshot/log may contain customer data; do not repost outside Zendesk until reviewed.`
- `Sensitive details omitted because raw logs appear to contain auth or personal data.`
- `Audience assumption: prepared for specialist support only; not safe for broad Slack or issue tracker without sanitisation.`

## Final safety check

Before producing the handoff, check:

- Does the recipient need this exact data to act?
- Could the same action be taken with a summary and Zendesk link?
- Are any secrets, credentials, tokens, cookies, or private keys present?
- Are personal or billing details necessary?
- Is the destination appropriate for the sensitivity level?
- Are assumptions separated from confirmed evidence?

If the answer is uncertain, omit sensitive detail and state what was omitted.

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
