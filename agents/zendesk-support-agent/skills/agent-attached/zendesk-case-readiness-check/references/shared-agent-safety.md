# Shared agent safety

Use this reference when the skill is attached to a shared workspace agent, installed from a shared skill directory, or run by different teammates with different connector access.

## Portability rules

- Do not depend on a specific user's Memory, Gmail, Slack, Drive, Linear, GitHub, Asana, or calendar access.
- Treat connector availability as optional and user-dependent.
- Prefer Zendesk evidence when available.
- If Zendesk is unavailable, assess only the pasted or supplied evidence.
- Do not invent unavailable ticket details, fields, linked tickets, customer history, SLA state, side conversations, or support commitments.
- Do not assume that a teammate has the same labels, saved searches, private views, browser session, workspace permissions, or memory as another teammate.
- Do not store customer-specific case facts in durable memory.
- Only use durable memory for stable team conventions when explicitly available and safe to reuse.
- Keep the output useful even when the only input is a pasted ticket summary.

## Safe fallback wording

When Zendesk or a named connector is unavailable, say what can be assessed from the supplied evidence and name the missing Zendesk detail plainly.

Use wording like:

```markdown
I can assess readiness from the supplied evidence only. Zendesk history, linked tickets, SLA state, and internal notes were not available in this run.
```

## Do not include in the skill package

- Real customer tickets, account IDs, private screenshots, transcripts, logs, or attachments.
- User-specific workspace shortcuts, saved searches, labels, or connector paths.
- Assumptions about which teammate is logged in.
- Private memory values that are not stable team conventions.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
