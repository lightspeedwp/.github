# Synthetic example: evidence pack ready

## User request

Look up ticket 74291 and tell me what we know before I reply.

## Situation

Zendesk is available. The ticket has a clear requester, recent conversation, current assignee, and enough confirmed information for a customer-facing follow-up.

## Expected handling

Use evidence pack mode. Do not investigate beyond Zendesk because the case is already clear enough for the next workflow.

## Example output pattern

# Zendesk Evidence Pack

## Case

- Ticket: 74291
- Customer / account: Example Travel Co
- Current state: open, normal priority, assigned to Support Operations
- Likely workflow: reply drafting
- Deliverable: support context before customer follow-up

## Confirmed facts

- The customer reported that imported itinerary images were missing after their latest content sync.
- The agent confirmed the sync completed but noted image warnings in the ticket comments.
- The latest customer message asks whether they need to re-upload images manually.

## Key chronology

- 2026-06-22: Customer reported missing itinerary images after a content sync.
- 2026-06-23: Agent confirmed the sync completed with image warnings.
- 2026-06-24: Customer asked for next steps and whether manual upload is required.

## Informed inferences

- This looks ready for a customer follow-up because the unresolved question is procedural rather than diagnostic.

## Missing or uncertain evidence

- The exact image warning codes are not included in the summary view.

## Readiness

- Ready
- Reason: Zendesk has enough customer wording, current state, and known next question for reply drafting.

## Best next move

- Primary workflow: zendesk-draft-response
- Supporting workflow: none
- Immediate next action: Draft a customer-safe reply explaining the next image recovery or re-sync step based only on confirmed ticket evidence.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
