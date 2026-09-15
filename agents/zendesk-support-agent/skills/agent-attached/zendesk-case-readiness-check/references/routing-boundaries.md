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
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

Use this reference when the readiness check needs to recommend what happens next without becoming the Zendesk router.

## Network ownership rule

`zendesk-router-skill` owns the Zendesk skill network. This specialist skill must not maintain or reproduce the full network map.

This skill only owns:

- whether evidence is sufficient for the requested next deliverable;
- the smallest missing evidence;
- its own scope boundaries;
- a small set of canonical companion handoffs;
- when to return to the router or parent agent.

## Stay inside this skill's scope

Do:

- decide ready, partially ready, or not ready for the target deliverable;
- name confirmed facts, assumptions, and missing evidence;
- recommend one immediate next action;
- use canonical `zendesk-` companion names for common adjacent handoffs;
- use plain-language next steps when the matching specialist is unavailable;
- return to `zendesk-router-skill` when the next workflow is broader than readiness.

Do not:

- classify the whole case queue;
- select owners, priorities, queues, or full triage state;
- choose between every Zendesk specialist skill;
- list the full skill network in normal outputs;
- default to Linear, GitHub, Asana, product planning, or project workflows.

## Common adjacent handoffs

Use only these local handoff patterns:

- **Evidence missing:** recommend `zendesk-evidence-collector` when material evidence is missing, or when single-case investigation, proof, reproduction, timeline reconstruction, or diagnostic context is needed. It owns minimum evidence collection and embedded single-case investigation/proof/timeline/reconstruction work for the LightSpeed support desk. If that companion is not attached, ask for the single smallest missing item instead of choosing another route.
- **Customer reply ready and already requested:** recommend `zendesk-draft-response`.
- **Internal escalation ready and already requested:** recommend `zendesk-customer-escalation`.
- **Support handoff ready and already requested:** recommend `zendesk-handoff-prep`.
- **Knowledge draft ready and already requested:** recommend `zendesk-create-knowledge`. If the question is whether the case should become documentation, return to `zendesk-router-skill` unless the parent agent has already selected `zendesk-knowledge-candidate-review`.
- **Deliverable unsafe:** if the deliverable is not ready, do not draft, escalate, document, or hand off. Name the blocker first.
- **Workflow unclear:** if the user needs broader triage (`zendesk-triage-router`), duplicate/pattern classification (`zendesk-duplicate-pattern-review`), reporting (`zendesk-backlog-trend-analysis`), customer research (`zendesk-customer-research`), evidence-quality review (`zendesk-evidence-quality-review`), ownership, prioritisation, documentation-worthiness (`zendesk-knowledge-candidate-review`), or a choice between multiple Zendesk specialists, return to `zendesk-router-skill`.

## Interoperability note

Clear readiness checks may invoke this skill directly. Unclear Zendesk-first intake should return to `zendesk-router-skill`. This skill should recommend only the smallest local next action and must not maintain its own Zendesk skill network.

## Return-to-router triggers

Return to `zendesk-router-skill` when:

- the user's real request is not just readiness;
- multiple specialist routes could apply;
- ownership, priority, queue, or triage status is the main question;
- duplicate, pattern, incident, or backlog classification is the main question;
- documentation-worthiness is unclear rather than simply evidence readiness;
- a downstream engineering/product artefact may be needed but the support route is not explicit;
- the current agent does not have the named adjacent specialist attached.

## Output wording

Prefer wording like:

> This is ready for the requested customer reply. Recommend `zendesk-draft-response` if that companion is attached and the user asked for a draft.
>
> This is not ready for an engineering/product handoff. The blocker is the missing reproduction context. Recommend `zendesk-evidence-collector` to collect the checkout URL, timestamp, observed behaviour, expected behaviour, and one screenshot before routing further.
>
> The next workflow is broader than readiness. Return this to `zendesk-router-skill` for routing rather than choosing a specialist here.

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
