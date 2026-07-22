# Report Intent Router

Use this reference when the user's request is vague, mixed, or could match several Zendesk reporting workflows.

## Route by user intent

| User intent | Primary output | Default scope | Notes |
|---|---|---|---|
| "How is the queue?" | Backlog health summary | Current open backlog | Focus on status mix, ageing, ownership, blockers, and next actions. |
| "What changed this week?" | Weekly support report | Last 7 days | Include created, solved, reopened, updated, and current open backlog where visible. |
| "Is this getting worse?" | Trend comparison | Current 7 days vs previous 7 days | Use matching filters for both windows. Mark comparison unavailable if either window cannot be queried. |
| "Any repeats?" | Repeated-theme review | Last 7 days unless stated | Classify as likely duplicate, related but distinct, repeated support pain, possible incident signal, or inconclusive. |
| "What needs attention today?" | Daily digest | Most recent operational window | Lead with urgent/ageing/unowned/blocked cases. |
| "What should we do next?" | Queue-risk check or mixed report | Current open backlog | Recommend support-owned actions only. |

## Mixed requests

When a request combines report types, produce one concise mixed operational report instead of several long reports. Use this order:

1. queue picture
2. material trend changes
3. highest-risk tickets or patterns
4. recommended support actions
5. evidence basis and gaps

## When to ask a question

Ask one clarification only when the missing scope changes the evidence query materially, such as an unknown brand, group, customer, or date range. Otherwise apply the defaults in `SKILL.md` and state them in the report.

## When to route away

Use a neighbouring skill instead when the user primarily asks for:

- a specific ticket investigation: `zendesk-evidence-collector`
- duplicate classification for named tickets: `zendesk-duplicate-pattern-review`
- one customer/account brief: `zendesk-customer-research`
- QA of an existing draft: `zendesk-evidence-quality-review`
- first-pass severity or owner triage for a single case: `zendesk-triage-router`

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
