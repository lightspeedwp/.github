# Connector Access Fallbacks

Use this reference when the user mentions Zendesk evidence, ticket IDs, ticket URLs, customer names, or account history but the current shared agent session may not have the same connector access as another teammate.

## Core Rule

Do not assume that the logged-in user has access to the same Zendesk records, saved memory, or private workspace context as the skill author or another teammate.

## Access States

### Direct Zendesk access is available

Proceed with the review only if a reviewable artefact exists and the evidence is accessible. Cite or refer to the evidence available in the current session when possible.

### Zendesk access is unavailable

Do not guess from the ticket ID, customer name, or remembered project context. Ask for the smallest useful evidence extract, such as:

- the customer-facing thread
- the latest internal notes
- the draft being reviewed
- confirmed impact and affected scope
- attempted troubleshooting steps
- current blocker or decision needed

### Partial evidence is available

Review only what the evidence supports. Mark unsupported facts as `needs verification` and recommend the smallest missing evidence needed to complete the review.

### Evidence is pasted but source labels are unclear

Ask the user to label the source of each section or clearly separate:

- customer message
- support reply draft
- internal note
- engineering/product note
- account context
- previous commitment

## Safe Fallback Response

Use this pattern when access is missing:

> I can review this safely once I have the draft or support artefact plus the minimum evidence behind it. I do not have enough accessible Zendesk evidence in this session to verify the ticket facts. Please paste the draft and the relevant ticket comments, internal notes, impact, and current blocker, or route this to evidence collection first.

## Do Not Say

- `I found the ticket` unless the ticket was actually accessed in the current session.
- `The customer has been affected since...` unless that timeline is visible in the supplied evidence.
- `Engineering confirmed...` unless the confirmation is in the supplied evidence.
- `This is a known issue` unless known-issue evidence is visible or supplied.
- `Ash previously said...` or any other user-specific memory as case evidence in a shared agent.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
