# Access and permissions handling

Use this reference when the router runs inside a shared workspace agent, when Zendesk or another connector is unavailable, or when the current user has different permissions from the skill author or another teammate.

## Runtime boundary

Treat the current logged-in user's available connectors, visible records, and attached skills as the only executable runtime. Do not assume access to another teammate's Zendesk groups, Gmail, Drive, Slack, Linear, GitHub, Asana, personal Memory, local files, or private notes.

If a source or workflow is unavailable, continue from supplied evidence when possible and say what limitation affects confidence.

## Safe routing when Zendesk is unavailable

If Zendesk is unavailable but the user supplied a ticket excerpt, thread, screenshot summary, or copied fields:

1. Route or triage from the supplied evidence.
2. Mark the result as lower-confidence when key Zendesk context is missing.
3. Name the smallest missing Zendesk item that would improve the route.
4. Do not ask broad discovery questions unless the missing item blocks any useful route.

Use wording like:

```md
Based on the supplied ticket excerpt, the best next support action is evidence collection. Zendesk evidence was not available in this run, so confidence is limited. The smallest missing item is the latest internal note and related-ticket search result.
```

## Safe fallback when a workflow is not attached

If the canonical workflow is not attached:

1. Check whether an equivalent legacy or generic support workflow is attached.
2. If an equivalent workflow is attached, route to that available workflow and do not present the missing canonical workflow as executable.
3. If no equivalent workflow is attached, describe the needed support action in plain language.

Do not invent, invoke, or promise unavailable skills.

## Permission-safe wording

Prefer:

- "If Zendesk is available, check the ticket history and internal notes."
- "Based on the pasted context, the route is..."
- "The current evidence does not show impact, affected user count, or related-ticket results."
- "The next action is to gather..."

Avoid:

- "I checked Ash's Zendesk view" unless actually available and checked.
- "Use my saved context" or "from Memory".
- "The team definitely has access to..."
- "This is the customer's full history" when only an excerpt was supplied.

## Escalation of missing access

Missing connector access should not become a customer-facing blocker by itself. Route the support action and identify the smallest teammate action needed, such as:

- paste the latest ticket thread;
- add the internal note summary;
- provide related-ticket search results;
- confirm requester organisation and impact;
- attach screenshots, logs, or reproduction notes;
- confirm which support workflow skills are attached to the parent agent.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
