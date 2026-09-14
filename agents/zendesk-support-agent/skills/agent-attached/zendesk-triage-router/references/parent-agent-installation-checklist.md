# Parent-agent installation checklist

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

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

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)
