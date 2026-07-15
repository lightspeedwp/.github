# Evidence Pack Template

Use this template when returning evidence pack mode output for one confirmed Zendesk-centred support case.

Keep the output compact. Do not include sections that are empty unless the missing evidence itself is material. Replace placeholders with specific evidence, uncertainty, or `unknown`.

```md
# Zendesk Evidence Pack

## Case

- Ticket: <ticket id, ticket url, or best available identifier>
- Customer / account: <name if known, or unknown>
- Current state: <status, owner, priority, urgency, ageing or sla signal, or unknown>
- Likely workflow: <plain-language intent or canonical `zendesk-` workflow when recommending a route>
- Deliverable: <requested or inferred deliverable>

## Confirmed facts

- <fact grounded in Zendesk, supplied evidence, or named secondary source>

## Key chronology

- <date/time if available>: <customer statement, agent action, status change, blocker, or relevant update>

## Informed inferences

- <clearly labelled inference and why it follows from the facts>

## Missing or uncertain evidence

- <specific missing source, identifier, timestamp, customer detail, log, attachment, or decision needed>

## Readiness

- <ready | partially ready | not ready>
- Reason: <short reason tied to evidence sufficiency>

## Best next move

- Primary workflow: <canonical `zendesk-` workflow, continue in this skill, or return to `zendesk-router-skill`>
- Supporting workflow: <canonical `zendesk-` workflow or none>
- Immediate next action: <one concrete next action>

## Sources checked

- <source category>: <what it was used for and any access limitation>
```

## Customer or account search variant

Use this variant when the user gives a customer or account name and there is not yet one confirmed ticket.

```md
# Zendesk Evidence Pack

## Search target

- Customer / account: <name or search string>
- Object of work: <one customer | one account | related tickets | unknown>
- Likely workflow: <plain-language intent or canonical `zendesk-` workflow when recommending a route>
- Deliverable: <requested or inferred deliverable>

## Most relevant tickets

- <ticket id or url>: <one-line reason this is relevant; include current state if known>

## Confirmed facts

- <cross-ticket fact or search result fact>

## Informed inferences

- <clearly labelled inference, if any>

## Missing or uncertain evidence

- <why the correct ticket/customer cannot be confirmed, if applicable>

## Readiness

- <ready | partially ready | not ready>
- Reason: <short reason>

## Best next move

- Primary workflow: <canonical `zendesk-` workflow, continue in this skill, or return to `zendesk-router-skill`>
- Supporting workflow: <canonical `zendesk-` workflow or none>
- Immediate next action: <one concrete next action>

## Sources checked

- <source category>: <what it was used for and any access limitation>
```

## Use rules

- Use confirmed facts for sourced details only.
- Use informed inferences for probable conclusions that still need confirmation.
- Use missing or uncertain evidence for blockers, contradictions, connector limits, or unavailable Zendesk access.
- Recommend one primary workflow only, using a canonical `zendesk-` name when routing away.
- Do not add customer-facing wording unless the user explicitly asks for a reply draft.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
