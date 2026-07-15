# Example 6: shared agent without Zendesk access

## Input

User request: Create an internal triage package for ticket 9911.

Runtime context: The shared agent cannot access Zendesk in this conversation, and no ticket extract is pasted.

## Output

Do not invent the package.

Recommended response:

> I cannot inspect Zendesk from the current context. Paste the ticket subject, latest customer message, status, visible priority/SLA fields, any internal notes, and any screenshots/log/error details. With that extract I can create the compact internal triage package.

## Why

A ticket ID alone is not evidence when connector access is unavailable. The smallest useful next action is to request the ticket extract, not to guess impact, urgency, owner, or next workflow.
