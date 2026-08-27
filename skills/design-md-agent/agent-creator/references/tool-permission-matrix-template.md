# Tool and Permission Matrix Template

Use this when an agent may use external systems, connected apps, APIs, repositories, files, calendars, inboxes, CRMs, PM tools, or communication channels.

| Tool/source | Required? | Access | Purpose | Freshness requirement | Human approval gate | Risk notes |
|---|---:|---|---|---|---|---|
| [Tool/source] | Yes | Read-only | [Why needed] | [e.g. last 30 days] | No | [Risk] |
| [Tool/source] | Optional | Read-only | [Why useful] | [Threshold] | No | [Risk] |
| [Tool/source] | Conditional | Write | [Action] | Current | Yes, before execution | [Risk] |

## Access defaults

- Default to read-only access.
- Treat write access as a separate requirement, not a hidden side effect.
- Require approval before sending messages, updating records, deleting content, publishing, approving spend, merging code, or changing customer/account data.
- If the user has not authorised a system, mark it as unavailable instead of inventing access.

## Permission language

Use precise verbs:

- **Read**: search, retrieve, inspect, summarise, compare.
- **Draft**: prepare but do not send, publish, merge, update, or delete.
- **Write**: create, update, send, publish, move, delete, merge, archive.
- **Escalate**: stop and ask a human owner to review or approve.
