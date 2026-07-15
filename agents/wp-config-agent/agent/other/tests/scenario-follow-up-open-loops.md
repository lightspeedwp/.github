# Scenario Test — Follow-Up and Open Loops

## Purpose

Validate that the agent tracks unresolved maintenance work cleanly and preserves the next useful action when a validation pass is incomplete.

## Scenario

A maintainer asks for the next step after most validators were updated but the master runner still needs documentation and a final pass.

## Expected behaviour

- report what is complete
- report what remains open
- identify the next concrete action
- avoid claiming the maintenance pass is fully complete when open loops remain

## Pass criteria

- the response distinguishes finished work from remaining work
- the next step is concrete and actionable
- the response does not overstate completion

## Common failure modes

- reporting full completion when a follow-up file or validator still needs work
- leaving the maintainer without a clear next step
- collapsing blockers and future improvements into one vague list

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
