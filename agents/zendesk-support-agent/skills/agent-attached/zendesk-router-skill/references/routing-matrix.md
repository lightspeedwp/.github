# Routing Matrix

Use this as a compact lookup when the request is ambiguous or when the router behaviour needs a quick consistency check.

| User intent | Primary skill | Supporting skill | Minimum useful input |
|---|---|---|---|
| Classify severity, priority, queue, owner, or status | `zendesk-triage-router` | none | Ticket ID, URL, or pasted issue summary |
| Gather missing facts or reconstruct case evidence | `zendesk-evidence-collector` | none | Ticket ID/URL, customer name, or pasted thread |
| Check if evidence is enough for a reply, escalation, handoff, or knowledge draft | `zendesk-case-readiness-check` | none | Current evidence summary and intended next deliverable |
| Draft a customer-facing reply | `zendesk-draft-response` | `zendesk-case-readiness-check` if evidence is thin | Ticket/thread plus intended outcome |
| Prepare an engineering, security, product, operations, leadership, or specialist escalation | `zendesk-customer-escalation` | `zendesk-evidence-collector` if evidence has not been assembled | Impact, evidence, exact escalation ask |
| Prepare internal support handoff | `zendesk-handoff-prep` | none | Case summary, attempted steps, blockers, target queue/person |
| Decide whether a case or repeated answer should become documentation | `zendesk-knowledge-candidate-review` | none | Resolved case, workaround, repeated question, or known issue |
| Draft or update a help-centre/internal knowledge article | `zendesk-create-knowledge` | `zendesk-knowledge-candidate-review` if value is not confirmed | Confirmed resolution and intended audience |
| Compare duplicate tickets or repeated support patterns | `zendesk-duplicate-pattern-review` | none | Ticket IDs/URLs or symptom summaries to compare |
| Summarise queue health, backlog, ageing risk, SLA risk, weekly themes, or daily digest | `zendesk-backlog-trend-analysis` | none | Queue, date range, SLA or priority focus |
| Build customer/account context before replying or deciding next step | `zendesk-customer-research` | none | Customer/account name or Zendesk customer link |
| Review an existing draft, investigation, escalation note, handoff, or trend report | `zendesk-evidence-quality-review` | none | Draft plus source evidence or ticket reference |

## Routing Guardrails

- Choose one primary skill.
- Add one supporting skill only when it improves evidence quality, safety, or sequencing.
- Do not use broad project/product routing unless explicitly requested.
- Do not perform the downstream workflow inside the router response.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
