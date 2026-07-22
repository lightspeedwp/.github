# Synthetic example: investigation blocked by missing event-time evidence

## User request

Prove whether the customer was charged twice when they reported the checkout error.

## Situation

Zendesk has the customer claim and current account state. The current account shows only one successful order, but the request asks what happened at the time of the incident.

## Expected handling

Use investigation mode with the goal `Proof`. Do not conclude that a duplicate charge never happened from current state alone. Mark the payment branch blocked if event-time payment evidence is unavailable.

## Example output pattern

# Zendesk Case Investigation

## Case

- Ticket: 75102
- Customer / account: Example Outdoor Tours
- Investigation goal: Proof
- Current disposition: Blocked

## Issue being investigated

The customer claims they were charged twice during a failed checkout. Expected behaviour is one charge for one successful order. Actual claimed behaviour is two charges after one checkout attempt.

## Confirmed facts

- Zendesk contains the customer claim and a screenshot of two pending bank transactions.
- Current order history shows one completed order.
- No payment gateway event log or transaction export is attached to the ticket.

## Branch ledger

| branch | question | source category | status | evidence |
| --- | --- | --- | --- | --- |
| customer claim | Did the customer report two charges? | Zendesk | verified | Customer message includes a screenshot showing two pending bank entries. |
| current order state | Is there more than one completed order now? | account/order state | verified | Current order history shows one completed order. |
| event-time payment state | Did the gateway authorise, capture, void, or reverse two transactions at the reported time? | payment gateway logs/export | blocked | Gateway event evidence is not present in Zendesk. |

## Conclusion

The duplicate-charge claim is not proven or disproven from the available evidence. Current order state confirms only one completed order now, but that does not prove what happened at the time of the payment attempt.

## Missing or uncertain evidence

- Gateway transaction export for the reported payment window.
- Transaction IDs from the customer's bank screenshot or payment provider.

## Recommended next action

- Request or retrieve payment gateway event evidence for the reported checkout window before replying with a definitive claim.

## Sources checked

- Zendesk conversation for customer claim and screenshot context.
- Current order/account state for present order count.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
