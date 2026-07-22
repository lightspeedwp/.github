# Example 4: case with escalation signals

## Input

Ticket subject: Checkout failing during campaign launch

Customer says checkout has failed for all customers since their campaign launched two hours ago. They included three failed order IDs, a screenshot of the checkout error, and said paid ads are currently running. The site owner is asking for urgent help.

## Output

# Internal triage package

## Issue summary

The customer reports a checkout failure affecting all customers during an active paid campaign launch, with failed order IDs and an error screenshot supplied.

## Urgency

critical — Checkout is reportedly blocked during a live revenue-generating campaign, with multiple failed order examples provided.

## Severity

Critical — The issue appears to block all customers from completing checkout and may directly affect revenue.

## Recommended priority

Urgent — Start urgent technical investigation while support verifies reproduction and gathers gateway/deploy context.

## Issue type

bug/technical fault

## Likely owner

engineering — inferred because checkout failure with failed orders likely needs technical investigation beyond first-line support.

## Duplicate or pattern risk

unknown — The supplied evidence confirms multiple failed orders, but does not show whether other tickets or accounts are affected.

## Customer impact

The customer reports that all shoppers are unable to complete checkout while paid ads are running, creating immediate revenue risk.

## Confirmed facts

- The customer says checkout has failed since the campaign launched two hours ago.
- Three failed order IDs were provided.
- A screenshot of the checkout error was provided.
- Paid ads are currently running according to the customer.

## Inferred risks or concerns

- Revenue loss is likely if the checkout failure is confirmed across all customers.
- Campaign spend may be wasted while checkout is blocked.

## Missing information

- Whether support can reproduce the checkout failure.
- Payment gateway status and recent deploy/plugin/configuration changes.
- Whether the issue affects all products, payment methods, browsers, or regions.

## Escalation signals

confirmed — Active checkout blocker, multiple failed order examples, time-sensitive campaign, and revenue risk.

## Recommended next action

Escalate for urgent technical investigation while support verifies reproduction and gathers gateway/deploy context.

## Recommended downstream skill

`zendesk-customer-escalation`

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
