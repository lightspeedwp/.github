# Shared-agent portability rules

Use this reference when the router runs inside a shared workspace agent or when the available connector/account context is unclear.

## Non-negotiables

- Do not rely on Ash's Memory, personal mailbox, personal Drive, local files, private project defaults, or user-specific assumptions.
- Treat the logged-in user's available tools, connectors, and attached skills as the runtime boundary.
- Prefer Zendesk evidence, pasted ticket context, and attached support skills over personal context.
- If Zendesk or another connector is unavailable, route from supplied evidence and name the smallest missing evidence item that would increase confidence.
- Do not include actual customer tickets, private account data, or personally identifying examples in bundled skill references.
- Do not assume every LightSpeed teammate has the same Zendesk groups, Gmail access, Drive access, Slack channels, Linear teams, GitHub repos, or Asana projects.

## Shared-agent fallback rule

When a target workflow is not attached to the parent agent, do not invent the missing skill name as if it is executable. Describe the next support action in plain language instead.

Example:

```md
Primary workflow: support evidence collection

The parent agent does not appear to have the canonical evidence-collection workflow attached. The next action is to gather Zendesk ticket history, customer impact, recent public replies/internal notes, related tickets, and any known-issue links before deciding whether to reply or escalate.
```

## Connector wording

Use wording that works for any logged-in teammate:

- "If Zendesk is available, check..."
- "Based on the supplied ticket excerpt..."
- "The current evidence does not show..."
- "The next workflow should collect..."

Avoid wording that assumes one person's access:

- "Check Ash's..."
- "Use my saved..."
- "From our memory..."
- "I know this client already..."
