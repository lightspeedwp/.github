# Preview QA Checklist

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

Use this checklist to evaluate repeatable preview runs against the installed example context files and prompt library.

## How to use

1. Pick an example context from `example-contexts-index.md`.
2. Run one or more prompts from `preview-test-prompts.md`.
3. Check the output against the sections below.
4. Mark failures before treating the preview as acceptable.

## Pass criteria

A strong preview run should:

- identify the correct workflow phase
- inspect available evidence before asking follow-up questions
- separate confirmed facts from assumptions and missing values
- ask only for inputs that materially affect routing, pricing, thresholds, approvals, or estimate confidence
- recommend the base package before reviewing add-ons
- keep commercial and approval checks visible before treating work as final
- use installed files and installed guidance instead of inventing unsupported rules
- keep client-facing output free of internal-only reasoning
- stay consistent with the estimator role rather than drifting into unrelated planning or implementation work

## Core QA checklist

### 1. Phase detection

- Did the agent clearly identify the current phase?
- Did the response match that phase instead of jumping ahead?
- Did it avoid treating intake, routing, drafting, and readiness review as the same task?

### 2. Evidence-first behavior

- Did the agent review the provided website or reference context before asking questions?
- Did it avoid claiming to review sources it did not actually inspect?
- Did it use the available example context as grounded project evidence?

### 3. Fact discipline

- Did the response clearly separate confirmed facts, assumptions, and missing values?
- Were uncertain points labeled instead of presented as facts?
- Did the agent avoid inventing scope, claims, packages, or commercial rules?

### 4. Intake discipline

- Did the agent ask only for missing inputs that materially affect package routing, pricing, approvals, thresholds, or final confidence?
- Did it avoid broad discovery questions that do not change the estimate outcome?
- Did it keep project-specific intake separate from reusable onboarding defaults?

### 5. Package routing quality

- Did the agent choose the base package only when enough evidence was available?
- Did it explain the route decision clearly?
- Did it avoid using add-ons to compensate for an unclear base package?

### 6. Add-on discipline

- Were add-ons reviewed only after the base package was selected?
- Did the agent mention only add-ons that materially apply?
- Did it avoid padding the scope with unnecessary extras?

### 7. Commercial and approval checks

- Did the response account for fixed-fee eligibility, thresholds, custom-scope triggers, and approval needs when relevant?
- Did it avoid presenting provisional work as final when approval or key inputs were still missing?
- Did it route to custom scope when the standard package rules no longer fit?

### 8. Output quality

- Was the output appropriate for the requested phase and deliverable?
- Did it use clear Markdown structure?
- Did it preserve inclusions, exclusions, assumptions, and provisional status where relevant?
- Did it keep internal reasoning out of client-facing estimate or proposal text?

### 9. Routing handoff structure

For package-routing, commercial-routing, or readiness-routing responses:

- Did the response end with these four sections in order?
  1. **Current Phase**
  2. **Route Decision**
  3. **Missing Material Inputs**
  4. **Next Handoff**
- Were the sections explicit and useful rather than generic?

### 10. Memory discipline

- Did the agent avoid storing one-off chatter as durable state?
- Did it keep reusable defaults separate from active project state?
- Did it avoid updating Memory when nothing durable changed?

## Failure flags

Treat the preview as failing if any of these happen:

- the agent skips evidence review and jumps straight to package selection
- the agent asks broad or unnecessary discovery questions
- the agent presents assumptions as confirmed facts
- the agent reviews add-ons before selecting a base package
- the agent treats provisional work as final
- the agent invents packages, pricing logic, thresholds, claims, or source-backed facts
- the agent drifts into implementation planning, design-system consulting, or unrelated workflow management without being asked
- the required routing handoff structure is missing on routing-style outputs

## Suggested scoring

Use this simple score for quick regression checks:

- **Pass**: no material failures; the response is safe and usable for the tested phase
- **Borderline**: mostly correct, but one or two issues reduce confidence or consistency
- **Fail**: one or more material errors break routing, pricing confidence, commercial safety, or output discipline

## Regression notes

When a preview fails, capture:

- which example context was used
- which prompt was used
- what the expected behavior was
- what the agent actually did
- whether the failure affects evidence, intake, routing, add-ons, commercial checks, output quality, or Memory discipline

## Recommended review cadence

For meaningful changes, test at least:

1. one evidence-pass prompt
2. one intake or routing prompt
3. one draft-estimate or readiness-review prompt
4. one second example context to check consistency across projects

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
