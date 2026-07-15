# Synthetic example: evidence pack partially ready

## User request

Can you pull together context for Example Lodge before we escalate?

## Situation

Zendesk is available. Several tickets match the account name. One open ticket appears relevant, but the user has not supplied the exact ticket ID and impact is unclear.

## Expected handling

Use evidence pack mode. Search for the tightest relevant ticket set, shortlist only the likely case, and mark escalation readiness as partial if impact or reproduction evidence is missing.

## Example output pattern

# Zendesk Evidence Pack

## Case

- Ticket: likely 73984, pending confirmation
- Customer / account: Example Lodge
- Current state: open, priority unknown from available summary, assigned group unknown
- Likely workflow: escalation readiness check
- Deliverable: context before possible escalation

## Confirmed facts

- One recent open ticket mentions checkout failures for Example Lodge.
- The customer says two guests could not complete payment.
- The ticket summary does not include logs, order IDs, or exact failure timestamps.

## Most relevant tickets

- 73984: likely relevant because it is open and mentions checkout failures for Example Lodge.
- 72810: adjacent historical billing question, not likely the escalation target.

## Informed inferences

- This may become escalation-ready if the checkout failures are reproducible or tied to confirmed payment errors.

## Missing or uncertain evidence

- Exact ticket confirmation from the user or a stronger identifier.
- Guest/order IDs or timestamps for the failed checkout attempts.
- Whether the issue is current, repeated, or already resolved.

## Readiness

- Partially ready
- Reason: The likely case is identified, but escalation would be weak without impact and event-time evidence.

## Best next move

- Primary workflow: zendesk-case-readiness-check
- Supporting workflow: none
- Note: if event-time proof becomes required, continue inside this skill's investigation mode before routing away
- Immediate next action: Confirm ticket 73984 is the target and collect the smallest missing checkout identifiers before escalation.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
