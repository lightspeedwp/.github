# Routing boundaries

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
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

Use this reference when a request risks turning `zendesk-triage-router` into a second full network router.

## Network ownership rule

`zendesk-router-skill` owns the full Zendesk skill network.

This means `zendesk-router-skill` should know the broad map of Zendesk-first specialist skills, compare multiple possible downstream workflows, and decide which specialist should own unclear, cross-cutting, or multi-deliverable support requests.

`zendesk-triage-router` must stay narrower. It owns embedded first-pass support triage and a small set of immediate, common handoffs that naturally follow triage. It should not try to maintain a complete Zendesk skill graph.

## What zendesk-triage-router owns

Use `zendesk-triage-router` for:

- first-pass classification of one support case or pasted ticket;
- severity, priority, owner/team, queue/status, and duplicate-risk assessment;
- deciding whether the immediate next step is still triage or one obvious support handoff;
- naming one supporting workflow only when it directly improves the immediate deliverable.

## Common handoffs this skill may name

This skill may name a common handoff when the next deliverable is already clear:

- `zendesk-evidence-collector` for proof, root-cause, reproduction, timeline, or diagnostic evidence;
- `zendesk-case-readiness-check` when evidence sufficiency is the main blocker before reply, escalation, knowledge, or handoff;
- `zendesk-draft-response` for a clearly requested customer-facing reply;
- `zendesk-customer-escalation` for a clearly requested impact-led escalation;
- `zendesk-handoff-prep` for a support-first internal handoff;
- `zendesk-duplicate-pattern-review` for duplicate, related-ticket, or incident-pattern ambiguity;
- `zendesk-knowledge-candidate-review` when the immediate question is whether support knowledge should be created;
- `zendesk-create-knowledge` only when the documentation decision is already made;
- `zendesk-backlog-trend-analysis` when the immediate request is queue health, repeated issues, or trend reporting.

Keep this list as common handoffs, not a complete network map. When the parent agent's attached skills or newer Zendesk specialist options create uncertainty, return to `zendesk-router-skill`.

## Return to zendesk-router-skill when

Route back to `zendesk-router-skill` when:

- the user asks which Zendesk skill in the wider network should handle the request;
- the request spans multiple support deliverables and no single immediate next action is clear;
- the request involves a specialist workflow outside the common handoffs above;
- the available attached skills differ from the common handoff list and choosing among them requires network awareness;
- a specialist skill finishes its own work and the next support workflow is unclear;
- the request has moved from triage into broader orchestration, sequencing, or cross-skill workflow design.

## Specialist boundary rule

Each Zendesk specialist skill should know only:

1. its own ownership boundary;
2. the few common handoffs adjacent to that boundary;
3. when to return to `zendesk-router-skill` for broader network routing.

Do not copy the full Zendesk skill network into specialist skills.

## Output pattern for returning to the router

```md
## Recommended route

- Primary workflow: `zendesk-router-skill`
- Optional supporting workflow: `none`

## Why this route fits

The request needs broader Zendesk skill-network routing rather than first-pass triage or one obvious common handoff.

## Next deliverable

Select the correct Zendesk specialist workflow and sequence from the wider support skill network.
```

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
