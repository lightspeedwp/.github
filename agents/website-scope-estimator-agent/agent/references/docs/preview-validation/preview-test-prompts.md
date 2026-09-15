# Preview Test Prompts

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

Use this file as a repeatable prompt library for preview testing with the installed example context files.

## How to use

1. Pick one context from `example-contexts-index.md`.
2. Paste the relevant context details or reference the file during the preview.
3. Choose one prompt from the sections below.
4. Validate the result with `preview-qa-checklist.md`.

## Universal baseline prompts

### 1. Evidence pass

Use the selected example context as the current project. Review the available website and reference sources first. Separate confirmed facts from assumptions, identify the current phase, and list only the missing inputs that materially affect package routing, pricing, thresholds, approvals, or estimate confidence.

### 2. Intake follow-up

Use the selected example context as the current project. Based on the available evidence, ask only for the missing information that still materially affects routing, pricing, thresholds, approvals, or final estimate confidence.

### 3. Package routing

Use the selected example context as the current project. Review the available evidence, recommend the best-fit base package first, and then note only the add-ons that materially apply. End with Current Phase, Route Decision, Missing Material Inputs, and Next Handoff.

### 4. Draft estimate

Use the selected example context as the current project. Based on the available evidence and the best-fit package route, draft a clear client-facing estimate that separates confirmed facts from assumptions and keeps internal reasoning out of the output.

### 5. Readiness review

Use the selected example context as the current project. Review the current route or estimate for readiness. Check fixed-fee eligibility, thresholds, custom-scope triggers, approval needs, and any remaining missing values before treating it as ready.

## Context-specific prompts

### LightSpeedWP.Agency

- Use LightSpeedWP.Agency as the test project. Review the live site, Figma prototype site, dev site, repositories, Drive folder, and Figma references. Produce an evidence-first scoping handoff.
- Use LightSpeedWP.Agency as the test project. Compare the live, prototype, and dev references, then identify what is confirmed, what is provisional, and what still needs intake before package routing.
- Use LightSpeedWP.Agency as the test project. Recommend the best-fit base package and only the add-ons that materially apply for an agency-site rebuild or website-solution scope.

### TourOperator.solutions

- Use TourOperator.solutions as the test project. Review the live site, demo site, dev site, repository, Drive folder, and Figma design system. Produce an evidence-first scoping handoff.
- Use TourOperator.solutions as the test project. Compare the live, demo, and dev references, then identify what is confirmed, what is provisional, and what still needs intake before package routing.
- Use TourOperator.solutions as the test project. Recommend the best-fit base package and only the add-ons that materially apply for a tour-operator or travel-product website scope.

### LSX Design System

- Use LSX Design System as the test project. Review the live site, demo site, repository, Drive folder, and Figma design system. Produce an evidence-first scoping handoff.
- Use LSX Design System as the test project. Identify what can be confirmed from the product and design-system references, what remains provisional, and what still needs intake before package routing.
- Use LSX Design System as the test project. Recommend the best-fit base package and only the add-ons that materially apply for a product-led or design-system-led website scope.

## Regression prompts

### 1. Missing-input discipline

Use the selected example context as the current project. Do not ask broad discovery questions. Ask only for the missing inputs that still materially affect package routing, pricing, approvals, or quote confidence.

### 2. Add-on discipline

Use the selected example context as the current project. Select the base package first. Do not let add-ons compensate for an unclear base package, and do not mention add-ons that are not materially supported by the available evidence.

### 3. Final-output discipline

Use the selected example context as the current project. Produce a client-ready estimate or proposal draft that keeps internal-only reasoning out of the output, clearly labels assumptions, and avoids treating provisional work as final.

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
