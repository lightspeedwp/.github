# Routing Boundaries

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

Use this reference to keep `zendesk-draft-response` as a specialist reply-drafting skill, not a second Zendesk router.

## Network Ownership Rule

- `zendesk-router-skill` owns the full Zendesk skill network, cross-skill route selection, and ambiguous support workflow decisions.
- `zendesk-draft-response` owns only customer-facing reply drafting from sufficiently confirmed evidence.
- This skill should know its own boundaries, common adjacent handoffs, and when to return to `zendesk-router-skill`.
- This skill must not maintain or present a complete map of the Zendesk skill network.
- When the next workflow is not obvious, return to `zendesk-router-skill` instead of choosing from the wider network.

## This Skill Owns

Use `zendesk-draft-response` when the user needs:

- a first customer reply
- a follow-up customer reply
- an apology, delay, limitation, or bad-news message
- a tone rewrite of a support reply
- localisation or translation of a customer-facing support message
- a support-ready reply using the bundled customer reply template

Proceed only when the reply can be grounded in confirmed ticket, thread, research, or investigation evidence.

## Common Adjacent Handoffs

Name one of these handoffs only when the trigger is clear and directly blocks or improves the reply task:

- `zendesk-evidence-collector`: missing or fragmented Zendesk evidence blocks a safe reply.
- `zendesk-case-readiness-check`: evidence exists but readiness is uncertain, stale, contradictory, or too thin.
- `zendesk-customer-research`: account context, relationship risk, prior commitments, or escalation history materially affects tone or next steps.
- `zendesk-customer-escalation`: internal owner approval or specialist intervention is needed before replying.
- `zendesk-evidence-quality-review`: a drafted reply needs evidence QA before sending.
- `zendesk-create-knowledge`: the requested deliverable is reusable documentation rather than a customer reply.

Do not turn this list into a full Zendesk skill map. If more than one handoff seems plausible, or the request is not primarily reply drafting, return to `zendesk-router-skill`.

## Return to Router When

Return to `zendesk-router-skill` when:

- the user asks which Zendesk workflow or skill should handle the case
- the request combines triage, investigation, escalation, duplicate review, backlog analysis, knowledge creation, and reply drafting
- severity, priority, status, queue, owner, SLA, duplicate, incident, or backlog decisions are central
- the available context is only a broad issue summary and not clearly ready for reply drafting
- multiple specialist handoffs could be reasonable and the safest next owner is unclear

## Handoff Output Pattern

When handing off to an adjacent specialist, keep the response short:

```md
This is not ready for `zendesk-draft-response` yet.

Recommended next step: `<skill-name>`

Reason: <one sentence explaining the blocker or boundary>

Smallest useful input to collect next: <one concrete evidence request or action>
```

When returning to the router:

```md
This needs `zendesk-router-skill` rather than direct reply drafting.

Reason: <one sentence explaining the routing uncertainty or broader workflow need>
```

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)
