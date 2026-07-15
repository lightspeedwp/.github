# Risk Labelling Guide

Use plain-language risk labels. Do not pretend to calculate precision from incomplete data.

## High risk

Use when one or more of these are visible:

- ageing or SLA-risk ticket
- high-impact customer issue
- unresolved blocker
- repeated cluster with active customer impact
- escalation-sensitive customer or organisation
- unclear owner on a high-priority case
- time-bounded cluster suggesting possible incident impact

Required explanation:

```md
High risk because the ticket is ageing, priority is high, and the next owner is unclear.
```

## Medium risk

Use when one or more of these are visible:

- repeated but contained support friction
- unclear owner likely to cause ageing
- blocked state without confirmed severe customer impact
- several related tickets but no confirmed shared root cause
- customer confusion that may need a macro or Help Centre update

Required explanation:

```md
Medium risk because the pattern is repeated but currently contained and no SLA signal is visible.
```

## Low risk

Use when one or more of these are visible:

- isolated ticket
- recent and owned
- low-impact or informational request
- waiting on customer without SLA concern
- no repeated pattern or escalation signal

Required explanation:

```md
Low risk because the ticket is recent, owned, and waiting on customer input.
```

## Risk table format

Use this compact table when multiple risks need scanning:

| Risk | Label | Evidence | Recommended support action |
|---|---|---|---|

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
