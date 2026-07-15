# Evidence Classification Guide

Use this reference when writing reports that combine hard Zendesk evidence with operational judgement.

## Confirmed reported evidence

Use for directly visible Zendesk facts:

- counts returned by searches
- ticket IDs or examples
- status, priority, group, brand, assignee, organisation, channel, form, tags, and custom fields
- created, updated, solved, reopened, customer reply, and agent reply timestamps where visible
- public replies, internal notes, and customer-reported symptoms
- directly visible SLA, CSAT, and Help Centre evidence
- documented blockers or owner decisions visible in Zendesk

Good wording:

```md
Confirmed evidence: 6 open tickets in the selected queue use the `payment_redirect` tag, and 3 were created in the last 48 hours.
```

## Informed interpretations

Use for cautious conclusions drawn from evidence:

- likely theme
- likely duplicate cluster
- possible incident signal
- operational risk
- escalation judgement
- likely customer impact
- likely next best support action

Good wording:

```md
Interpretation: this looks like repeated support pain rather than a confirmed incident because the tickets share the same workflow but do not yet show a shared root cause.
```

## Missing or incomplete evidence

Use when the active agent cannot verify a signal:

- unavailable SLA or CSAT fields
- incomplete ticket samples
- missing customer impact
- unclear owner or group
- unavailable comparison window
- hidden custom fields
- no ticket conversation access

Good wording:

```md
Missing evidence: SLA status was not visible. Ageing and priority were used as fallback risk signals.
```

## Unsafe wording to avoid

Avoid:

- "This is caused by..." without confirmed cause.
- "SLA is breached" when SLA is unavailable.
- "Engineering needs to fix..." unless Zendesk evidence confirms an engineering-owned blocker.
- "This is an incident" unless incident evidence is confirmed.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
