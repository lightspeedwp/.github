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

Use this reference when `zendesk-evidence-collector` needs to recommend a next step without becoming a second Zendesk router.

## Network rule

`zendesk-router-skill` owns the Zendesk skill network.

This specialist owns only:

- evidence collection before another support workflow;
- embedded single-case investigation when triage is not enough;
- direct handoff to a small set of common next workflows when the evidence clearly supports that route;
- return to `zendesk-router-skill` when the next workflow is unclear, contested, multi-path, or outside this specialist's boundaries.

Do not maintain a full map of all Zendesk skills here. Do not decide between every possible downstream support workflow. Do not route to product, Linear, GitHub, Asana, roadmap, or project-planning workflows unless the user explicitly asks and the support evidence is already complete.

## This skill's boundary

Stay inside this skill when the main job is to:

- gather minimum reliable Zendesk context;
- reconstruct a compact support chronology;
- separate confirmed facts, informed inferences, and missing evidence;
- diagnose one support case with a branch ledger;
- answer a proof, RCA, lookup, timeline, reproduction-context, or known-issue question for one case;
- decide whether evidence is ready, partially ready, or not ready for the next support deliverable.

Leave this skill when the main job has become the deliverable itself rather than evidence or investigation.

## Common direct handoffs

Use a direct handoff only when the evidence clearly supports it. Use these canonical companion names exactly when routing away:

- `zendesk-triage-router`: first-pass classification, severity, priority, owner, queue status, or duplicate-risk assessment.
- `zendesk-draft-response`: customer-facing reply or follow-up when the facts are sufficiently explained.
- `zendesk-customer-escalation`: engineering, product, security, leadership, or specialist escalation when impact and ask are clear.
- `zendesk-handoff-prep`: internal support handoff when ownership, blocker, ask, and evidence need packaging.
- `zendesk-case-readiness-check`: evidence sufficiency is the main question before a reply, escalation, knowledge draft, or handoff.
- `zendesk-duplicate-pattern-review`: duplicate, related-case, repeated-theme, or incident-pattern uncertainty blocks the next move.
- `zendesk-knowledge-candidate-review`: the main question is whether a resolved or repeated issue should become reusable documentation.

Keep each handoff short. Name one primary next workflow and, only when clearly helpful, one supporting workflow.

## Return to the router

Return to `zendesk-router-skill` when:

- the user asks which Zendesk workflow or specialist should handle the case;
- the request spans multiple specialist deliverables;
- more than one downstream route is plausible and none is clearly dominant;
- the case is no longer mainly evidence collection or investigation;
- the user asks for broad support operations, backlog, knowledge, escalation, reply, account research, or pattern work and the best specialist is not obvious;
- the evidence is too thin to decide a safe next step beyond asking for the smallest missing identifier;
- a shared-agent user lacks the connector access needed to confirm the route.

Use wording like:

> Return to `zendesk-router-skill` because the case is no longer mainly evidence collection or investigation, and the next specialist route is not clear from the current evidence.

## Output rule

In this skill's outputs, avoid long routing menus. The `Best next move` or `Recommended next action` section should contain:

- one immediate next action;
- one primary workflow when clear;
- one supporting workflow at most;
- or a clear return to `zendesk-router-skill` when routing needs network-level judgement.

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
