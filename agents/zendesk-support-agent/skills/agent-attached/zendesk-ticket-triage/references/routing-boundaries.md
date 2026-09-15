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

## Use `zendesk-ticket-triage` when

- The user explicitly asks for a compact internal triage package.
- A legacy prompt or saved workflow specifically names this skill.
- The required output is this package's facts/inference/missing-evidence/next-workflow format.
- The work starts from a Zendesk ticket ID, URL, pasted ticket thread, support summary, or mixed support notes and the user does not need the canonical embedded triage output from `zendesk-triage-router`.

## Do not use it as the primary workflow when

- The request is first-pass classification, severity, priority, queue/status, owner/team recommendation, or duplicate-risk assessment. Use `zendesk-triage-router`.
- The request is broad workflow routing. Use `zendesk-router-skill`.
- Evidence is weak, partial, or missing and must be collected first. Use `zendesk-evidence-collector`.
- The user asks whether evidence is sufficient for a reply, escalation, handoff, knowledge draft, or downstream package. Use `zendesk-case-readiness-check`.
- The user asks for a finished customer-facing reply and the ticket has enough context. Use `zendesk-draft-response`.
- The user asks for a formal escalation brief or the case clearly requires cross-functional action. Use `zendesk-customer-escalation`.
- The task is support-first internal handoff, not triage packaging. Use `zendesk-handoff-prep`.
- The user asks to review whether a draft reply, escalation, handoff, or report is evidence-backed. Use `zendesk-evidence-quality-review`.
- The task is mainly account history, recent support activity, prior commitments, or customer health context. Use `zendesk-customer-research`.
- The task is duplicate, related-case, repeated-pain, or incident-pattern review. Use `zendesk-duplicate-pattern-review`.
- The task is documentation-worthiness review. Use `zendesk-knowledge-candidate-review`.
- The task is knowledge article or internal documentation drafting after documentation-worthiness is clear. Use `zendesk-create-knowledge`.
- The task is clearly refund, credit, compensation, billing adjustment, goodwill gesture, or policy exception assessment. Use `zendesk-refund-assessment` if attached; otherwise use a plain-language fallback.
- The user already requests an engineering-ready bug handoff and the case has reproduction details. Use `zendesk-bug-report-package` if attached; otherwise use `zendesk-evidence-collector` or `zendesk-customer-escalation` depending on the immediate need.

## Adjacent skill handoff rules

### `zendesk-triage-router`

Route here when the user wants first-pass classification, severity, priority, queue/status, owner/team guidance, or duplicate-risk assessment.

### `zendesk-router-skill`

Route here when the next Zendesk-first workflow is unclear or the user asks what should happen next without requesting this package format.

### `zendesk-evidence-collector`

Route here when missing evidence, proof, timeline reconstruction, reproduction context, or diagnostic investigation is the immediate blocker.

### `zendesk-draft-response`

Route here when the next deliverable is customer-facing wording. Hand off confirmed facts, missing information to ask for, tone/risk notes, and boundaries on what not to promise.

### `zendesk-customer-research`

Route here when the blocker is account history, prior commitments, account value, recurring support pattern, or recent customer activity.

### `zendesk-customer-escalation`

Route here when credible customer impact needs engineering, product, security, leadership, or specialist intervention. Hand off impact, evidence, blocker/ask, urgency rationale, and proof gaps.

### `zendesk-evidence-quality-review`

Route here when there is already a drafted response, escalation, handoff, report, or other support artefact that needs checking for unsupported claims, unsafe wording, weak evidence, or missing risk.

## Avoid overlap

This skill produces an internal package. It does not replace the central router, first-pass triage router, evidence collector, draft-response skill, escalation workflow, handoff workflow, duplicate-pattern review, or knowledge workflows.

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
