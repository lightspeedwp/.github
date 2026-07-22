# Example 2: messy multi-issue ticket

## Input

Ticket subject: Billing wrong + webhook failing + no response

Customer says they were charged twice, their webhook integration stopped sending updates yesterday, and they are frustrated because they already emailed last week. The thread includes no payment IDs, no webhook logs, and no link to the previous ticket.

## Output

# Internal triage package

## Issue summary

The ticket combines a disputed billing charge, a webhook/integration failure, and a complaint about previous follow-up. The issues should be separated before reply drafting or escalation.

## Urgency

high — The ticket includes claimed payment harm and a potentially business-impacting integration failure, but evidence is incomplete.

## Severity

High — If confirmed, duplicate billing plus webhook failure could create financial and operational impact; the current severity remains evidence-limited.

## Recommended priority

High — Prioritise evidence collection and previous-contact lookup before deciding whether billing, integrations, or escalation owns the next step.

## Issue type

multi-issue

## Likely owner

senior/technical support — support should coordinate issue separation and evidence collection before routing billing and integration workstreams.

## Duplicate or pattern risk

unknown — The customer claims prior contact, but no previous ticket or related cases are visible in the supplied evidence.

## Customer impact

Confirmed frustration plus claimed duplicate charge and stopped webhook updates. The financial and operational impact are not yet verified.

## Confirmed facts

- The customer reports being charged twice.
- The customer reports webhook updates stopped yesterday.
- The customer says they already emailed last week.
- The ticket does not include payment IDs, webhook logs, or the previous ticket reference.

## Inferred risks or concerns

- There may be SLA or relationship risk if the prior contact is real and unanswered.
- The billing and webhook issues may require different owners once evidence is collected.

## Missing information

- Payment reference, invoice, order ID, or charge timestamps.
- Webhook endpoint, affected event type, error logs, and timestamp of first failure.
- Link or ID for the previous email/ticket.
- Scope: one account, multiple users, or multiple customers.

## Escalation signals

possible — Payment harm and repeated-contact frustration are present, but neither duplicate charge nor previous missed response is confirmed.

## Recommended next action

Collect the missing billing and webhook evidence, search Zendesk for the previous contact, and then decide whether to split the case or escalate.

## Recommended downstream skill

`zendesk-evidence-collector`

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
