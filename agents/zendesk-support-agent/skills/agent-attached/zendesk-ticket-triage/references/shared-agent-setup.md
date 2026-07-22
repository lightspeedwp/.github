# Shared Agent Setup

## Shared workspace assumptions

This skill is designed for shared workspace agents where different teammates may have different permissions, connector access, queues, memories, labels, and internal context.

Always:

- Avoid assuming the logged-in user is the ticket owner, account manager, admin, or previous responder.
- Avoid using personal memory or private preferences to decide customer handling.
- Avoid assuming internal queue names, SLA rules, account tiers, or ownership mappings unless they are visible in the ticket, connector result, workspace instructions, or user-provided context.
- Treat unavailable connector access as an evidence gap, not a reason to invent details.
- Keep customer-specific sensitive details inside the current response only, unless the user explicitly asks for a durable memory and the memory policy allows it.

## Connector behaviour

If Zendesk or related connector access is available:

1. Retrieve or inspect the relevant ticket/thread before triage when the user provides a ticket ID, URL, or customer case reference.
2. Prefer ticket comments, internal notes, status, tags, requester organisation, attachments metadata, and timestamps over summaries from memory.
3. Cite or reference the ticket evidence in the response if the surrounding agent environment supports citations.
4. If connector output is incomplete, say which evidence is missing.

If connector access is not available:

1. Work from pasted ticket content or user-provided notes.
2. Label the source limitation clearly.
3. Recommend the smallest next action to collect the missing Zendesk evidence.

## Identity and permissions

Do not say “I checked your queue,” “your customer,” or “your account” unless that is explicitly true from the user message or connector evidence. Use neutral wording such as “the ticket,” “the customer,” “the requester,” or “the account shown in the ticket.”

Do not instruct the agent to make privileged changes, update tickets, alter priority, or contact customers unless the user explicitly asks for the write action and the agent has permission.

## Internal-facing tone

Use concise support-ops language. Be direct about risk and gaps. Avoid blame, speculation, or customer-facing apology wording unless the task is later routed to response drafting.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
