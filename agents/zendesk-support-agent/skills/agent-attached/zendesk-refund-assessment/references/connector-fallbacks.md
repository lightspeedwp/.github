# Connector Fallbacks

Use this reference when live Zendesk, billing, policy, CRM, or internal discussion evidence is unavailable, incomplete, or only represented by pasted context.

## Fallback principle

Continue only as far as the available evidence allows. Do not imply that a connector, ticket, account, invoice, policy article, or approval record was inspected unless it was actually available in the current run.

## Source-specific fallback rules

| Missing or limited source | Safe fallback | Do not do |
| --- | --- | --- |
| `zendesk` | Ask for the smallest useful ticket/thread extract: customer ask, latest support reply, internal notes, status, tags, and prior commitments. | Do not claim ticket history was checked. |
| `help_center` / `support_docs` | State that policy basis is not confirmed and recommend `zendesk-help-center-grounding` or documented policy lookup. | Do not infer refund eligibility from memory or general practice. |
| `billing` / `commerce` | Ask for order, invoice, subscription, usage, refund, chargeback, or credit-note facts needed for the remedy. | Do not treat a requested amount as paid amount or refundable amount. |
| `crm` / `account` | Mark relationship, renewal, plan, account owner, or contract context as missing. | Do not invent customer tier, renewal risk, or commercial commitments. |
| `slack` / internal discussion | Treat supplied discussion as supporting context only and ask for authoritative approval or source-system confirmation. | Do not treat informal discussion as approval. |
| `pasted context` | Use it as supplied evidence, label the run evidence-limited, and recommend verification of high-risk claims. | Do not present pasted context as independently verified. |

## Evidence-limit wording

Use direct internal wording:

- `Based on the supplied context only, evidence is insufficient to decide the refund outcome.`
- `Zendesk ticket history is not available in this run; the assessment depends on the pasted extract.`
- `Billing evidence is not available, so paid amount, usage state, refund history, and chargeback state are not confirmed.`
- `Policy basis is not confirmed; ground the case in current help-center or support-policy documentation before deciding.`
- `Internal discussion is supporting context, not approval evidence, unless an authorised approval record is supplied.`

## Smallest useful next input

When blocked, request only the smallest missing evidence needed for the next safe decision:

1. latest customer ask and requested remedy
2. latest support reply and any prior commitments
3. relevant policy or help-center wording
4. billing/order/subscription facts for the remedy
5. prior refund, credit, chargeback, or exception history if relevant
6. approval threshold or approval record when a financial offer or policy exception is being considered

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
