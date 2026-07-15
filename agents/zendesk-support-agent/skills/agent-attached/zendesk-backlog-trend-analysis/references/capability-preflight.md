# Capability Preflight

Use this checklist before producing a report when Zendesk access or available fields are uncertain.

## Check available read capabilities

Confirm whether the active agent can:

- count tickets by status and date
- search ticket metadata
- filter by status, created date, updated date, and solved date
- filter by group, brand, organisation, assignee, priority, tags, form, channel, and custom field where needed
- read ticket details for representative high-risk cases
- read ticket conversations when metadata is not enough
- see SLA status, SLA breach, or SLA policy fields
- search or read Help Centre articles
- retrieve CSAT or satisfaction records when requested

## Continue with partial capability only when safe

Continue if the report can be grounded in visible data. Clearly mark unavailable fields.

Do not continue if the agent cannot access Zendesk counts or ticket metadata for the requested scope. In that case, state that an evidence-backed report cannot be produced in the active environment.

## Minimum evidence by report type

| Report type | Minimum useful evidence |
|---|---|
| Backlog health | Current open-ticket count, status mix, ageing or updated dates, owner/group where visible |
| Weekly report | Current period counts, comparison or previous period if requested, solved/open/reopened counts where visible |
| Trend comparison | Two comparable windows with matching filters |
| Daily digest | Current day or relevant operational window plus open risks |
| Repeated-theme review | Ticket samples or metadata showing repeated wording, tags, affected workflow, or product area |

## Limitation language

Use limitation language directly in the evidence basis:

```md
SLA data was not visible through the active Zendesk access, so SLA risk is marked unavailable. Ageing and priority were used as fallback risk signals.
```

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
