# Example: Operations handoff

This is an anonymised example. Do not treat it as real Zendesk evidence.

## Internal handoff

- Problem: Customer cannot access a paid add-on after renewal because the account still shows the add-on as expired.
- Impact: One billing contact is blocked from assigning licences. Customer says renewal payment was completed three business days ago.
- Owner or target team: operations
- Exact ask: Check the renewal/payment state for the account and either reactivate the add-on or tell support what billing evidence is still needed.
- Urgency/risk: high - customer paid renewal and is blocked from using the add-on.

## Evidence

- Confirmed: Zendesk ticket ZD-10003, organisation Example Training Co.
- Customer-reported: Renewal invoice was paid on 2026-06-03.
- Confirmed: Account admin screen shows add-on status as expired.
- Customer-provided: Screenshot of payment confirmation, with payment reference redacted in handoff.
- Missing: Operations has not yet confirmed payment reconciliation.

## Attempted steps

- Support checked the account admin status.
- Support asked the customer not to resend payment details in chat.
- Support summarised the payment confirmation without copying full billing details.

## Blockers

- Support cannot reactivate the add-on without operations confirmation.
- Billing reference should be checked in the secure billing system, not copied into Slack.

## Handoff brief

Ops check needed for ZD-10003. Example Training Co reports that their renewal was paid on 2026-06-03, but the account still shows the paid add-on as expired and they cannot assign licences. Support has seen a payment confirmation screenshot but has not copied sensitive billing details here. Please confirm payment state and either reactivate the add-on or tell support what evidence is still needed.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
