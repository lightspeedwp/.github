# Synthetic example: Zendesk unavailable, pasted thread only

## User request

Zendesk is not connected for me. Based on this pasted customer thread, can you tell me if this is ready to escalate?

## Situation

The logged-in user does not have Zendesk connector access. The user pasted a partial support thread with customer wording but no ticket metadata.

## Expected handling

Be transparent that Zendesk was unavailable. Work only from supplied evidence. Do not imply that ticket metadata, tags, assignee, SLA, or internal notes were checked.

## Example output pattern

# Zendesk Evidence Pack

## Case

- Ticket: not available from supplied evidence
- Customer / account: Example Safaris
- Current state: unknown because Zendesk is unavailable
- Likely workflow: escalation readiness check
- Deliverable: readiness assessment from pasted thread only

## Confirmed facts

- The pasted customer thread says the booking enquiry form has failed twice.
- The customer reports that leads are commercially important this week.
- No ticket metadata, assignee, priority, tags, SLA, or internal notes are available in the pasted evidence.

## Key chronology

- Customer first reported the form issue in the pasted thread.
- Customer followed up and said the problem happened again.

## Informed inferences

- The case may be escalation-worthy if the form failure is current and reproducible, because it affects lead capture.

## Missing or uncertain evidence

- Zendesk ticket ID, status, owner, priority, and full conversation.
- Form URL, browser/device context, timestamp, error message, and reproduction result.
- Whether any workaround has already been offered.

## Readiness

- Partially ready
- Reason: The pasted thread suggests possible business impact, but escalation lacks reproducible evidence and ticket context.

## Best next move

- Primary workflow: zendesk-case-readiness-check
- Supporting workflow: none
- Immediate next action: Ask for the ticket ID or the smallest missing reproduction details before creating an escalation brief.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
