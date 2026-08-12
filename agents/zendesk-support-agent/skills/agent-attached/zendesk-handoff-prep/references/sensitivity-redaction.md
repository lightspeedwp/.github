# Sensitivity and redaction guide

<!-- BADGES-START -->
[![actions-minute-savings-watch](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml)
[![awesome-github-site](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml)
[![changelog-auto-update](https://github.com/lightspeedwp/.github/actions/workflows/changelog-auto-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-auto-update.yml)
[![changelog-validate](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validate.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validate.yml)
[![checklist-finalisation](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml)
[![checks](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml)
[![cleanup-branches](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml)
[![dependabot-security-label](https://github.com/lightspeedwp/.github/actions/workflows/dependabot-security-label.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/dependabot-security-label.yml)
[![flaky-test-detection](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml)
[![issue-close-label-hygiene](https://github.com/lightspeedwp/.github/actions/workflows/issue-close-label-hygiene.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-close-label-hygiene.yml)
[![issue-create-from-template](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml)
[![issues](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml)
[![labeling](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml)
[![linting](https://github.com/lightspeedwp/.github/actions/workflows/linting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/linting.yml)
[![main-branch-guard](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml)
[![meta](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml)
[![metadata-governance](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml)
[![metrics-summary](https://github.com/lightspeedwp/.github/actions/workflows/metrics-summary.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-summary.yml)
[![metrics](https://github.com/lightspeedwp/.github/actions/workflows/metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics.yml)
[![planner](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml)
[![project-archival](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml)
[![project-meta-sync](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml)
[![readme-audit](https://github.com/lightspeedwp/.github/actions/workflows/readme-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-audit.yml)
[![readme-regen](https://github.com/lightspeedwp/.github/actions/workflows/readme-regen.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-regen.yml)
[![readme-update](https://github.com/lightspeedwp/.github/actions/workflows/readme-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-update.yml)
[![release](https://github.com/lightspeedwp/.github/actions/workflows/release.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release.yml)
[![reporting](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml)
[![reviewer](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml)
[![template-enforcement](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml)
[![testing](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml)
[![validate-mermaid-pr](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml)
[![validate-pr-template](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml)
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

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
