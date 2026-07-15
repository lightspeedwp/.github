# Example 7: router invocation boundary

## Input

User request: Classify this Zendesk ticket and recommend severity, priority, and owner.

## Output

This should route to `zendesk-triage-router`, not `zendesk-ticket-triage`.

Reason: first-pass classification, severity, priority, and owner/team recommendation are canonical responsibilities of `zendesk-triage-router` in the LightSpeed Support Desk shared-agent setup.

## When this skill would fit instead

Use `zendesk-ticket-triage` only if the user asks for a compact internal triage package in this skill's package format.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
