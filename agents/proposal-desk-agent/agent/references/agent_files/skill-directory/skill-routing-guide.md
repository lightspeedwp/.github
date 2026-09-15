# Skill Routing Guide

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

Use this file to choose the best attached skill for the current task.

This file is for skill selection and handoffs. Use `docs/app-usage-guide.md` for source, app, and permission routing.

## Attached skills

### proposal-intake

Use `proposal-intake` when the task begins with a new RFP, questionnaire, proposal brief, security questionnaire, procurement form, or diligence request and the first job is to understand the request.

Best fit:

- analyse a newly supplied artefact
- extract submission requirements, deadlines, deliverables, sections, blockers, and risks
- produce a concise intake handoff before drafting
- classify what is grounded, missing, high risk, or review-sensitive

Do not use it as the default drafting skill once intake is clear.

### rfp-response

Use `rfp-response` when intake is clear enough and the task is to draft or assemble response artefacts.

Best fit:

- draft first-pass proposal content
- assemble response packs
- structure section-by-section answers
- turn grounded intake and evidence into review-ready outputs

Prefer this after `proposal-intake` when the user wants draft content rather than only an intake summary.

### evidence-claims-check

Use `evidence-claims-check` when the task is about support quality rather than drafting speed.

Best fit:

- gather proof points
- verify proposal statements against evidence
- classify support strength
- flag stale, weak, unsupported, or risky claims
- compare candidate wording against available evidence

Use it before or alongside drafting when claim quality is the main concern.

### proposal-defaults-onboarding

Use `proposal-defaults-onboarding` only when the task depends on missing reusable user defaults that should be remembered for future runs.

Best fit:

- missing evidence-lookup defaults
- missing output-routing defaults
- missing intake-handling defaults
- small reusable preference capture before resuming the original task

Do not use it for one-off facts that belong in the current request.

### markdown-format-validator

Use `markdown-format-validator` near the end of substantial Markdown deliverables.

Best fit:

- validate a substantial Markdown document before finalising it
- repair heading structure, spacing, dividers, or wrapper quality
- standardise a Markdown deliverable against the agent's formatting rules
- check file-link handoff text around a Markdown output

Do not use it as the main drafting skill.

### wordpress-plugin-packaging-review

Use `wordpress-plugin-packaging-review` when plugin assessment is the primary job.

Best fit:

- plugin packaging reviews
- plugin due diligence
- tiering and upsell analysis
- delivery-risk and governance review
- evaluating plugin fit for agency, MSP, ecommerce, AI, chatbot, automation, or commercial delivery use cases

Do not use it for general proposal drafting.

## Routing priorities

- Choose the skill that best matches the user's primary requested outcome.
- If the task starts with a new artefact, use `proposal-intake` first.
- If the task is mainly about evidence quality, use `evidence-claims-check` before `rfp-response`.
- If the task is mainly a final Markdown quality pass, use `markdown-format-validator` at the end.
- If plugin evaluation is the core job, prefer `wordpress-plugin-packaging-review` over the proposal workflow skills.
- Use `proposal-defaults-onboarding` only when missing reusable defaults would otherwise block good execution.

## Common handoffs

- `proposal-intake` -> `rfp-response` when the request is understood and drafting should begin
- `proposal-intake` -> `evidence-claims-check` when support quality must be established before drafting
- `evidence-claims-check` -> `rfp-response` when evidence has been gathered and the next job is drafting
- `rfp-response` -> `markdown-format-validator` when a substantial Markdown artefact is nearly final
- `proposal-defaults-onboarding` -> resume original task as soon as the minimum reusable defaults are captured

If more than one skill seems relevant, choose the one that best matches the primary outcome and add a second skill only when it clearly improves the result.

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
