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

Use this reference when the duplicate/pattern review produces a next-step recommendation, especially inside a shared workspace agent.

## Core routing rule

`zendesk-router-skill` owns the Zendesk skill network. This specialist skill owns only duplicate/pattern classification, its local boundaries, common handoffs, and when to return to the router.

Do not turn this skill into a secondary catalogue of every `zendesk-` prefixed skill. Do not independently browse, compare, or select across the full Zendesk skill ecosystem unless the user explicitly asks for skill design or routing advice.

## What this skill may recommend directly

Recommend a next workflow only when it follows directly from the duplicate/pattern classification:

- ordinary support classification still missing -> `zendesk-triage-router`
- cause, timing, reproduction, or proof is needed -> `zendesk-evidence-collector`
- queue-level reporting, volume, trend, ageing, SLA-risk analysis, or backlog health reporting is the requested deliverable -> `zendesk-backlog-trend-analysis`
- broader operational risk, urgent customer impact, SLA risk, or cross-functional intervention is likely -> `zendesk-customer-escalation`
- evidence sufficiency is unclear before reply, escalation, knowledge, or handoff -> `zendesk-case-readiness-check`
- relationship is clear and the user asks for customer-facing wording -> `zendesk-draft-response`
- repeated confusion may be suitable for documentation but needs suitability review -> `zendesk-knowledge-candidate-review`
- documentation suitability is already clear and the user asks for a draft -> `zendesk-create-knowledge`
- relationship is clear and a support-first internal handoff is requested -> `zendesk-handoff-prep`

These are local exit ramps, not a complete routing map.

## Interoperability note

Clear duplicate or pattern review requests may invoke this skill directly. Unclear support intake should route through `zendesk-router-skill` before selecting a specialist workflow. Product, Linear, GitHub, roadmap, or canonical issue deduplication must not be assumed unless the user explicitly requests that downstream artefact.

## When to return to the router

Route back to `zendesk-router-skill` when:

- the next step is not an obvious result of the duplicate/pattern review;
- the user asks broadly what to do next across support workflows;
- more than one downstream artefact could be appropriate;
- the request shifts away from duplicate/pattern classification;
- a new `zendesk-` prefixed specialist skill may be relevant but is not one of this skill's common handoffs;
- the team skill catalogue has changed and this specialist skill may be stale.

Use wording like:

> The duplicate/pattern classification is complete. For the next workflow choice, route back through `zendesk-router-skill` because the next step is broader than this skill's local boundary.

## What to avoid

Avoid:

- duplicating the router's full skill map;
- loading or invoking multiple downstream skills just because they exist;
- recommending product, Linear, GitHub, Asana, roadmap, or project workflows by default;
- treating a repeated pain pattern as a product-routing decision before support handling is clear;
- choosing a downstream customer reply, escalation, knowledge article, handoff, or report when evidence sufficiency is still unclear.

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
