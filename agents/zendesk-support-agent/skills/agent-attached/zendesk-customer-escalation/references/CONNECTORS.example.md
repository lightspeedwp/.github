# Shared Agent Connector Map Example

Copy or mirror this mapping into the shared agent's `CONNECTORS.md` file. Keep workspace-specific connector names, IDs, URLs, channels, groups, projects, and permissions outside the packaged skill.

## Required source of truth

- `zendesk`: Zendesk ticket history, customer messages, internal notes, status, tags, SLA context, attachments, and troubleshooting attempts.

## Optional supporting sources

- `crm`: account plan, renewal, commercial importance, relationship context, contract pressure, or customer success ownership.
- `slack`: team discussion, incident context, specialist notes, similar reports, or cross-functional decision history.
- `asana`: related bugs, delivery blockers, operational tasks, follow-through actions, or project commitments.
- `support_docs`: known issues, policy notes, previous decisions, documented workarounds, support playbooks, or customer-safe guidance.

## Connector rules

- Anchor escalation evidence in Zendesk first.
- Use Slack only for supporting team context, not as the primary source of truth.
- Use Asana only when there is a concrete delivery, bug, operational follow-through, or project dependency.
- Use CRM only for account, commercial, renewal, or relationship context when available.
- Use support docs only when the source is approved, current, and relevant to the case.
- If a connector is unavailable or access is denied for the logged-in user, state the missing source as an evidence gap rather than guessing.
- Do not store customer-specific ticket facts in memory. Retrieve case facts from Zendesk or approved shared sources for each run.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
