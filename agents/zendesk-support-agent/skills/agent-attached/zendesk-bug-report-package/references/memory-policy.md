# Memory policy

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

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
