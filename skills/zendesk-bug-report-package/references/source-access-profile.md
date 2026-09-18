# Source access profile

Use this reference when deciding what evidence can support a bug package in a shared support desk agent.

## Preferred source classes

- Live Zendesk ticket fields, public replies, internal notes, side conversations, attachments, linked tickets, tags, groups, status, priority, and timestamps accessible in the current run.
- Pasted ticket excerpts, customer messages, screenshots, logs, reproduction notes, or investigation summaries supplied by the user.
- Approved product documentation, release notes, changelogs, Help Center articles, or internal support playbooks when expected behaviour needs grounding.
- Secondary evidence from Slack, Gmail, Google Drive, GitHub, Linear, Asana, BugHerd, runtime logs, analytics, repos, or monitoring only when supplied, explicitly requested, or necessary.

## Not enough by itself

- Customer frustration without exact behaviour.
- A teammate's recollection without a current source.
- A stale screenshot without timestamp or context.
- Prior ticket replies that do not include evidence or source links.
- A suspected release correlation without logs, timestamps, reproduction, or linked cases.

## Fallback when access is incomplete

Use supplied evidence, mark missing facts, and ask for the smallest next extract. Do not invent Zendesk status, requester, account, group, priority, assignee, tags, linked cases, or SLA details.

## Redaction guidance

Summarise sensitive evidence and link back to Zendesk or the authorised source when possible. Do not copy credentials, tokens, payment details, personal data, security-sensitive logs, or unnecessary raw payloads into a bug package.
