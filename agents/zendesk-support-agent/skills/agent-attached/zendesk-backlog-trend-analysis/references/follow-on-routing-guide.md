# Follow-on Routing Guide

Use this reference after a backlog or trend report when the user asks for the next deliverable.

## Safe follow-on actions inside this skill

This skill may produce:

- a refined backlog or trend report
- a shorter Slack-style support update
- a management summary of the same Zendesk evidence
- a list of support-owned next actions
- a Zendesk internal-note draft only if the user explicitly asks for wording and no write action is performed

## Route to a neighbouring Zendesk skill

| Follow-on request | Route |
|---|---|
| "Investigate ticket ZD-123" | `zendesk-evidence-collector` |
| "Are these tickets duplicates?" | `zendesk-duplicate-pattern-review` |
| "Draft the customer reply" | `zendesk-draft-response` if available in the active agent |
| "Prepare an escalation brief" | `zendesk-customer-escalation` or `zendesk-handoff-prep` if available |
| "Turn this into a Help Centre article" | `zendesk-create-knowledge` after readiness is clear |
| "Check this report before I send it" | `zendesk-evidence-quality-review` |
| "Give me context on this customer" | `zendesk-customer-research` |

## Secondary systems

Do not move work into GitHub, Linear, Asana, Slack, Gmail, Google Drive, or a roadmap unless:

- the user explicitly requests it, or
- Zendesk evidence directly references an external blocker or decision that must be checked to avoid a misleading support report.

If a secondary system is used, label its evidence separately from Zendesk evidence.

## Write actions

This skill should not perform Zendesk write actions by default. If the user asks to update tickets, assign owners, add tags, or publish knowledge content, confirm the exact write action or route to the appropriate write-capable workflow available in the active agent.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
