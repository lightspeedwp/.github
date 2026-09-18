# Shared Agent Runtime Rules

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
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
<!-- BADGES-END -->

Use this reference when the skill is running inside a shared workspace agent, when Zendesk access may differ between users, or when the source material depends on private support evidence.

## Core Rule

This skill must not rely on personal Memory, private user assumptions, or one logged-in user's connector permissions.

The skill should work for any authorised team member in the workspace when the required source evidence is available through the current agent, connector, pasted material, or uploaded source.

## Evidence Access

Before drafting, confirm what evidence is available in the current session:

- Zendesk ticket, thread, article, or search result accessible to the current agent
- Pasted ticket content, support notes, investigation notes, or article draft
- Uploaded source material supplied by the user
- Approved internal support notes or help-centre content

If Zendesk access is unavailable, work only from the user-provided evidence and label the output as evidence-limited.

Do not imply that Zendesk evidence was checked unless it was actually available in the current run.

## Memory Rules

Do not depend on personal Memory for correct behaviour.

Do not save or rely on Memory for:

- customer names
- account-specific support context
- ticket IDs
- private Zendesk comments
- unresolved investigation details
- sensitive product, security, billing, or legal context
- one-off workaround status
- unpublished support decisions

Reusable team conventions should live inside the skill package, not in personal Memory.

## Connector-Safe Behaviour

When using Zendesk, Google Drive, Slack, Gmail, or any other connector:

- use only sources available to the current agent session
- cite or name the source type in publishing notes
- separate confirmed evidence from assumptions
- do not assume that another teammate will have the same connector permissions
- do not expose private source details in public article drafts

If a connector result is missing, stale, inaccessible, or ambiguous, say so clearly and route to evidence collection or readiness review.

## Shared-Agent Output Requirements

Every draft should make these fields explicit:

- source of truth
- visibility
- public/internal boundary
- evidence confidence
- reviewer needed
- recommended next route

If evidence is limited, use one of these labels:

- `Evidence-limited: user-provided notes only`
- `Evidence-limited: Zendesk access not available in current session`
- `Evidence-limited: source resolution not confirmed`
- `Evidence-limited: public/internal boundary not confirmed`

## Safe Fallback Wording

Use this when evidence is incomplete:

> I can prepare a draft from the available notes, but this should not be treated as publish-ready until the source Zendesk case, article overlap, and public/internal boundary are confirmed.

Use this when access differs by user:

> I do not have access to the same Zendesk evidence in this session, so I am treating the provided material as the source of truth for this draft.

## Routing

Route away from article drafting when:

- the issue is unresolved
- documentation-worthiness is unclear
- customer impact is uncertain
- public visibility is uncertain
- source evidence is missing
- the user actually needs a customer reply, escalation, handoff, or backlog report
- the user needs backlog, queue, SLA, ageing, volume, theme, or trend reporting, which should route to `zendesk-backlog-trend-analysis`
- the user needs duplicate, related-case, repeated-pain, or incident-pattern classification, which should route to `zendesk-duplicate-pattern-review`

Use the relevant Zendesk workflow before creating the knowledge draft.

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
