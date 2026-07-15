# Shared Agent Rollout Checklist

Use this reference when adding the skill to a shared workspace agent or reviewing whether it is ready for team use.

## Agent configuration

- Confirm the shared agent has Zendesk read access for the queues it will report on.
- Confirm whether ticket counts, ticket search, ticket details, Help Centre search, SLA fields, and CSAT records are available.
- Avoid configuring the agent around one teammate's private Zendesk views or saved filters.
- Store stable workspace conventions in the agent setup only after approval.

## Smoke tests

Run at least these prompt types before team rollout:

1. "Give me current open backlog health."
2. "Compare this week with last week."
3. "Find repeated themes from the last 7 days."
4. "Give me a daily support digest."
5. "What can you report if SLA fields are unavailable?"

## Acceptance criteria

The skill is ready for shared use when:

- it states filters and date windows clearly
- it refuses to invent missing counts or SLA data
- it produces support-owned next actions
- it does not route to non-Zendesk systems by default
- it handles permission-limited sessions gracefully
- it avoids personal memory and login-specific assumptions

## Ongoing maintenance

Review the skill when:

- Zendesk fields, groups, brands, or forms change
- team reporting cadence changes
- a new support workflow skill is added
- agents receive new write permissions
- repeated false positives appear in reports

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
