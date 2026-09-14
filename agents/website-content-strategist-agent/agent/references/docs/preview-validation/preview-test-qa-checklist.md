# Preview test QA checklist

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

## Purpose

Use this checklist to validate repeatable preview tests across the LightSpeedWP.Agency, TourOperator.solutions, and LSX Design System example contexts.

## File set to keep together

- example-contexts index
- project example context file
- repeatable preview test prompts
- this QA checklist

## Pre-run checks

- Confirm you selected the correct example context file.
- Confirm the referenced URLs and repositories match the project being tested.
- Confirm the preview prompt matches the test goal.
- Confirm the run is using a repeatable prompt rather than ad hoc wording.

## Context-quality checks

- The response uses the selected project context rather than mixing projects.
- The response distinguishes confirmed context from missing context.
- The response does not invent approvals, evidence, or authority.
- The response uses the available sources in a sensible priority order.
- The response flags important gaps instead of smoothing over them.

## Workflow-quality checks

- The response recommends the most upstream blocking workflow first.
- The response does not skip straight to drafting when intake or strategy is still missing.
- The response gives one clear next step rather than several competing ones.
- The response keeps workflow naming plain and user-facing.

## Formatting-quality checks

- The response uses the required review wrapper when the task is review-style.
- The response includes the required readiness section when the task is intake-style.
- Missing-intake items use the required labelled pattern when applicable.
- The response stays structured, concise, and easy to compare across runs.

## Cross-run comparison checks

- Repeated runs with the same prompt stay broadly consistent in structure and routing.
- Differences between runs are traceable to changed context or changed instructions.
- Project-specific prompts produce more targeted answers without losing the core review structure.

## Failure signals to note

- wrong project context used
- source priority order is confused
- unsupported certainty or invented facts
- skipped upstream workflow
- vague or competing next steps
- formatting drift that makes runs harder to compare

## Suggested review flow

1. Open the example-contexts index.
2. Pick one project context.
3. Run one prompt from the prompt library.
4. Check the result against this QA checklist.
5. Record the failure mode before changing prompts or instructions.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
