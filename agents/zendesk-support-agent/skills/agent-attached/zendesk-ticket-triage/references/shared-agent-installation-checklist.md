# Shared-agent installation checklist

Use this checklist before adding `zendesk-ticket-triage` to a shared workspace agent or shared skill directory.

## Required baseline

- Confirm whether the shared agent already has `zendesk-triage-router` attached.
- If `zendesk-triage-router` is attached, keep it as the canonical first-pass triage workflow.
- Attach `zendesk-ticket-triage` only when the team needs the compact internal triage package output format.
- Confirm the agent can work from pasted ticket evidence when Zendesk connector access is unavailable.
- Confirm no team member needs any individual teammate's personal Memory, mailbox, Drive, local files, private Zendesk views, saved searches, labels, or connector access.
- Confirm examples, fixtures, and tests contain no real customer data, credentials, private ticket exports, or personal email addresses.

## Recommended companion skills

Attach these where available for end-to-end Zendesk support operations:

- `zendesk-router-skill`
- `zendesk-triage-router`
- `zendesk-evidence-collector`
- `zendesk-case-readiness-check`
- `zendesk-draft-response`
- `zendesk-customer-escalation`
- `zendesk-handoff-prep`
- `zendesk-duplicate-pattern-review`
- `zendesk-knowledge-candidate-review`
- `zendesk-create-knowledge`
- `zendesk-backlog-trend-analysis`
- `zendesk-customer-research`
- `zendesk-evidence-quality-review`

Optional only when present in the workspace:

- `zendesk-refund-assessment`
- `zendesk-bug-report-package`

## Smoke-test prompts

Run these in the shared support desk agent:

1. "Classify this Zendesk ticket and recommend priority."
   - Expected: `zendesk-triage-router`, not this skill.
2. "Create a compact internal triage package for this pasted ticket."
   - Expected: `zendesk-ticket-triage` may be used.
3. "Route this unclear Zendesk case to the right workflow."
   - Expected: `zendesk-router-skill`.
4. "The shared agent cannot access Zendesk; triage this ticket ID."
   - Expected: ask for the smallest useful pasted ticket extract; do not pretend to inspect Zendesk.
5. "Draft the customer reply from this package."
   - Expected: `zendesk-draft-response` if evidence is enough, or `zendesk-case-readiness-check` if evidence is thin.
6. "Package this for engineering."
   - Expected: `zendesk-customer-escalation` or `zendesk-evidence-collector` first if evidence is not assembled; use `zendesk-bug-report-package` only if that optional skill is attached and explicitly requested.

## Do not configure

- Do not make this skill the default route for all Zendesk triage in a shared LightSpeed Support Desk agent.
- Do not require private queues, saved views, labels, Slack channels, Gmail labels, local paths, or personal memories.
- Do not include real Zendesk exports, customer identifiers, screenshots, logs, ticket URLs, order IDs, payment references, or credentials in the skill package.
- Do not use this skill to bypass `zendesk-triage-router` for first-pass classification or `zendesk-router-skill` for ambiguous workflow routing.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
