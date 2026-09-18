# Shared-Agent Setup

This skill must be portable across shared workspace agents. It should work for any authorised teammate, not only the skill author.

## Identity and authority

- Do not assume the logged-in user is the account owner, finance approver, legal reviewer, or person who made prior commitments.
- Do not treat a teammate's request as approval unless they explicitly state they have approval authority or a source record confirms an approved decision.
- When authority is unclear, state `approval authority not confirmed` and recommend escalation or approval before offering anything financial.

## Connector assumptions

Do not hardcode connector IDs, group IDs, Zendesk views, Slack channel names, billing system names, CRM object names, or workspace URLs.

Use logical source categories:

| Source category | Use for | Reliability note |
| --- | --- | --- |
| `zendesk` | ticket history, customer messages, support replies, internal notes, status, tags | primary support source of truth |
| `help_center` / `support_docs` | refund policy, cancellation terms, compensation guidance, public wording | primary policy source when current and approved |
| `billing` / `commerce` | invoices, payments, refunds, subscriptions, credits, chargebacks | primary transaction source when available |
| `crm` / `account` | commercial context, relationship owner, customer tier, contract notes | supporting context; not refund approval by itself |
| `slack` / internal discussion | internal context, approvals, team discussion | supporting evidence; verify important claims in source systems |
| `pasted context` | user-supplied context when connectors are unavailable | evidence-limited; state limitation |

## Source availability wording

Use clear evidence-limit language:

- `Based on the supplied ticket context only...`
- `I do not see a policy source in the supplied evidence...`
- `Billing evidence is not available in this run, so transaction eligibility is not confirmed...`
- `Internal discussion suggests this may be approvable, but approval is not confirmed in an authoritative source...`

## Permission-safe behaviour

If a connector is unavailable or the current teammate lacks access:

1. Continue with available evidence.
2. Mark the missing connector as an evidence gap.
3. Recommend the smallest safe follow-up, such as checking billing record, policy page, or approval note.
4. Avoid implying the source was checked when it was not.

## Shared installation notes

For a shared workspace agent, add or maintain an agent-level connector map outside this skill, for example:

```markdown
# Connector map
- zendesk: <workspace Zendesk connector name>
- help_center/support_docs: <docs connector or Zendesk Guide source>
- billing/commerce: <billing connector or manual lookup path>
- crm/account: <CRM connector or account record source>
- escalation channel: <team-approved escalation destination>
```

Keep environment-specific names out of the packaged skill so the same skill can be attached to other shared agents safely.
