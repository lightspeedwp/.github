# CONNECTORS.md Example for Shared Support Agents

Copy this file into the shared agent's persistent instructions or shared files as `CONNECTORS.md` when the platform supports it. Adapt the availability notes to the actual shared agent configuration.

## Source of truth order

1. Zendesk
   - Use as the primary source of truth for support tickets, customer replies, support replies, status, priority, tags, requester details, and organisation context available in the ticket.
   - Do not claim Zendesk was checked unless the connector was actually used or the ticket evidence was provided in the prompt.

2. Gmail
   - Use only for email-based support threads, reply drafting, or reviewable email drafts.
   - Do not use for broad mailbox research unless the user explicitly asks and the shared agent is approved for that access.

3. Slack
   - Use only for internal support context that is explicitly referenced, pasted, or available through an approved shared connector.
   - Treat Slack as internal context, not as customer-facing proof.

4. Pasted context
   - Use when connectors are unavailable or when the user wants a fast draft from supplied notes.
   - Mark evidence limitations in internal `Notes`.

## Availability table

| Source | Available in this shared agent? | Approved uses | Notes |
| --- | --- | --- | --- |
| Zendesk | yes/no | ticket evidence, customer/support thread history, status, priority, tags | replace with workspace-specific details |
| Gmail | yes/no | email-based support replies only | replace with workspace-specific details |
| Slack | yes/no | supplied or approved internal context | replace with workspace-specific details |
| Google Drive | yes/no | approved shared templates or support docs only | optional |

## Fallback rules

- If Zendesk is unavailable, do not imply ticket history was checked.
- If Gmail is unavailable, work only from pasted email text.
- If Slack is unavailable, do not invent internal context or owner confirmation.
- If evidence is incomplete, use the smallest safe clarification or route to evidence collection.
- Never include private connector IDs, credentials, API tokens, or personal mailbox details in skill files.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
