# Example: Insufficient evidence handoff

This is an anonymised example. Do not treat it as real Zendesk evidence.

## Readiness judgement

- Status: not ready for target-team handoff
- Reason: the current notes describe a customer complaint but do not include enough confirmed facts for engineering, product, operations, or security to act.
- Best next route: evidence collection or readiness check before preparing a handoff.

## Current evidence

- Customer-reported: "The checkout is broken."
- Missing: affected URL, browser/device, timestamp, payment method, error text, screenshot, account/order ID, reproduction attempt, and whether the issue affects one customer or many.
- Missing: support has not yet checked recent related tickets or known-issue notes.

## Smallest missing evidence

Ask support to collect:

1. Exact customer-facing error message or screenshot.
2. Affected checkout URL or store/account identifier.
3. Approximate timestamp and timezone.
4. Payment method or checkout path used.
5. Whether support can reproduce the issue.

## Safe interim handoff brief

This case is not ready for engineering or product handoff yet. The only confirmed detail is that the customer reports checkout is broken. Before routing, support needs the exact error, affected account/store, timestamp, checkout path, and reproduction result. Do not create a downstream issue or escalation until those facts are available or the case becomes urgent due to confirmed widespread impact.
