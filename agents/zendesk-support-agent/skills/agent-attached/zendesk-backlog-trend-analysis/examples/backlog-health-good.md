# Backlog health summary

## Overall backlog picture

- Current open backlog is concentrated in open and pending tickets; SLA visibility is unavailable in this environment.
- Ageing risk is concentrated in payment and onboarding tickets older than 5 days.
- The most useful next step is to route unowned high-priority tickets before reviewing lower-risk waiting-on-customer cases.

## Highest-priority risks

| Risk | Evidence | Why it matters | Recommended support action |
|---|---|---|---|
| Payment redirect failures | 3 open tickets share the `payment_redirect` tag and similar checkout wording | Repeated reports in the same workflow could age quickly without ownership | Assign one owner to review the cluster and add an internal note linking the tickets |
| Unowned urgent ticket | 1 urgent open ticket has no visible assignee | No clear next owner | Route to the payment support owner and update the customer with the next step |

## Recommended support actions

1. Assign the unowned urgent payment ticket to the correct support owner.
2. Link the 3 payment redirect tickets in Zendesk and classify whether they are duplicates or related but distinct.
3. Review the oldest pending onboarding tickets and confirm whether they are genuinely waiting on customers.

## Evidence basis and gaps

- Scope: current open Zendesk backlog.
- Filters: status in new, open, pending, hold.
- SLA data visible: no.
- Ticket details sampled: yes, only for the urgent and repeated-payment examples.
- Secondary sources used: none.
- Missing evidence: SLA status and confirmed root cause for the payment cluster.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
