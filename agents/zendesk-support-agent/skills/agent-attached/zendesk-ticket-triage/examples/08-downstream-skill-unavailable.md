# Example 8: downstream skill unavailable

## Input

User request: This looks like a refund dispute. Create the triage package and tell me what should happen next.

Runtime context: `zendesk-refund-assessment` is not attached to the shared agent.

## Output guidance

Create the internal triage package if enough ticket evidence is supplied, but do not invent or invoke an unavailable skill.

Recommended downstream skill field:

`plain-language fallback: refund/policy assessment needed before customer reply; request charge details, customer claim, prior commitments, applicable policy, and approval owner.`

## Why

Optional downstream skills may not be attached in every shared agent. The package should preserve workflow intent without pretending a missing skill is available.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
