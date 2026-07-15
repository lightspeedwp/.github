# Connector Requirements

The router itself can work without direct Zendesk access because it recommends the next workflow. Downstream evidence-backed workflows may require Zendesk access or pasted ticket evidence.

## If Zendesk Access Is Available

- Use Zendesk ticket IDs, URLs, customer names, queue/status context, and ticket evidence where available.
- Keep Zendesk as the support source of truth.
- Do not route to product, project, GitHub, Linear, Asana, Slack, Gmail, or roadmap workflows unless the user explicitly asks for a downstream artefact outside support.

## If Zendesk Access Is Not Available

- Do not imply that Zendesk has been inspected.
- Ask for the smallest useful pasted ticket/thread extract, customer summary, or issue summary.
- Still recommend the correct downstream support workflow when the user's intent is clear.
- If the exact downstream skill is unavailable, describe the recommended support workflow in plain language using the standard output format.

## Shared-Agent Compatibility

- Do not assume the logged-in user has any individual team member's access.
- Do not assume private Zendesk labels, queues, macros, brands, views, or account mappings exist unless provided in the current agent configuration.
- Keep examples anonymised and portable.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
