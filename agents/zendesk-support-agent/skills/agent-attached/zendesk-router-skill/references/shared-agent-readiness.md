# Shared Agent Readiness

Use this reference when the router is installed in a shared workspace agent, when permissions are unclear, or when output might accidentally rely on one team member's private context.

## Shared-Agent Rules

- Do not rely on any individual team member's personal memory, Gmail, calendar, Drive, Slack, Zendesk views, private labels, or individual permissions.
- Treat Zendesk as the support source of truth only when the active shared agent has Zendesk access.
- If Zendesk access is unavailable, request the smallest pasted ticket/thread extract needed to route safely.
- Do not hardcode user names, private workspace URLs, account IDs, queue IDs, view IDs, labels, or macros.
- Do not include real customer data in examples or tests.
- Prefer role-neutral wording: `support agent`, `team member`, `specialist`, `customer`, `account`, `queue`.
- Keep routing recommendations useful even when the downstream skill or connector is unavailable.

## Safe Defaults

- Recommend a workflow, not a person, unless the user provides a named owner.
- Ask one focused question only when the next route cannot be safely inferred.
- Use pasted evidence as user-provided context, not as proof that Zendesk has been inspected.
- Say when live Zendesk evidence is required for the downstream workflow.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
