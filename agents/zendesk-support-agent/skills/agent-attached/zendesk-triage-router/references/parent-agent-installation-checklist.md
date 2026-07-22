# Parent-agent installation checklist

Use this checklist when adding `zendesk-triage-router` to a shared workspace agent, reviewing an agent configuration, or preparing the skill for a Skill Directory rollout.

## Required baseline

- Attach `zendesk-triage-router`.
- Remove `ticket-triage` as an attached active workflow; if archived instructions still mention it, mark it as deprecated and redirect-only to `zendesk-triage-router`.
- Ensure parent-agent instructions say Zendesk-centred support requests start with Zendesk-first support routing, not Linear, GitHub, Asana, or project planning.
- Confirm the parent agent can still answer from pasted ticket evidence when Zendesk access is unavailable.

## Recommended companion skills

Attach these Zendesk-prefixed workflows where available:

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

If a companion workflow is unavailable, the router should describe the next action in plain language instead of inventing an executable skill.

## Connector assumptions to check

- Zendesk is the preferred source of truth for tickets, internal notes, status, priority, requester, organisation, SLA, tags, groups, assignees, side conversations, related tickets, Help Centre links, and reporting context.
- Pasted ticket excerpts are acceptable fallback evidence.
- Secondary connectors such as Slack, Gmail, Drive, GitHub, Linear, Asana, or BugHerd are optional and should only be used when needed to resolve routing ambiguity or when the user explicitly asks for cross-system context.
- No team member should need Ash's personal Memory, mailbox, Drive, local files, or private notes to use the router.
- Zendesk fields, tags, queues, priorities, SLA state, and custom fields should be treated as evidence signals and normalised with `zendesk-field-map.md` when they affect triage.
- If canonical Zendesk-prefixed companion skills are not attached, the router should describe the next support action in plain language rather than using legacy non-prefixed routes.

## Smoke-test prompts

Run these quick prompts after installation:

1. "Classify this Zendesk ticket and recommend priority."
   - Expected: embedded triage inside `zendesk-triage-router`; `ticket-triage` must not appear as an active route target.
2. "Find the root cause before we reply."
   - Expected: route to `zendesk-evidence-collector` or plain-language evidence collection if unavailable.
3. "Draft the customer update from these confirmed facts."
   - Expected: route to `zendesk-draft-response`, unless evidence is thin enough to need readiness first.
4. "Are these tickets duplicates or just related?"
   - Expected: route to `zendesk-duplicate-pattern-review`.
5. "Prepare the support handoff before we create a GitHub issue."
   - Expected: route to `zendesk-handoff-prep`, not direct GitHub issue drafting.
6. "Draft the customer update, but the shared agent does not have `zendesk-draft-response` attached."
   - Expected: identify canonical intent as `zendesk-draft-response`, then use a plain-language support action with an availability note.
7. "Classify this ticket: SLA breach risk today, major account, blocked checkout tag, no confirmed root cause."
   - Expected: consult `zendesk-field-map.md`; do not treat the tag as proof of root cause or engineering ownership.

## Maintenance checks before sharing

From the skill folder, run:

```bash
python3 scripts/validate_router_package.py .
python3 scripts/run_router_regression_tests.py .
```

Also confirm the package contains no real ticket exports, customer data, credentials, personal email addresses, local filesystem paths, or private Memory defaults.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
