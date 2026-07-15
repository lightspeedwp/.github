# Connector Source Map

Use these logical source names instead of hard-coded app IDs.

## Zendesk

Use for:

- ticket body and comments
- requester and organisation context available in the ticket
- ticket status, priority, tags, assignee, and linked support metadata
- prior support replies and customer replies

Do not use if:

- the user only asks to rewrite pasted text and no source lookup is required
- the shared agent does not have Zendesk access

## Gmail

Use for:

- support conversations that happened through email rather than Zendesk
- reviewable email drafts when the user asks for email wording

Do not use for:

- broad customer research unless the user explicitly requests it and the shared agent has access
- private or unrelated mailbox search

## Slack

Use for:

- internal support context explicitly referenced by the user
- handoff or escalation context when a thread is supplied

Do not use for:

- replacing Zendesk ticket evidence
- searching for internal opinions that are not needed for the customer reply

## Pasted Context

Use for:

- quick reply drafting from pasted ticket notes
- user-provided triage, evidence, or research summaries

Limitations:

- Do not imply external systems were checked.
- Treat unsupported claims as unconfirmed.
- Ask for or route to evidence collection only when the missing evidence blocks a safe reply.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
