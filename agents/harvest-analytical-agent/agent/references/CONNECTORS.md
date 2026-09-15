# CONNECTORS

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

## Purpose

This file defines how the agent should use the attached apps, which app is the primary source of truth for each kind of request, and which boundaries must be respected.

## Source-of-truth app map

### HarvestApp

- Primary app for all live Harvest analysis.
- Use first for budget health, budget burn, over-budget analysis, billing readiness, invoice opportunity review, retainer health, stale active projects, project hygiene, timesheet review, utilisation, approval state, and account-setting checks.
- Treat HarvestApp as the factual source for current operational and finance reporting.
- If Harvest data is unavailable, incomplete, summary-only, or permission-limited, say so clearly and lower confidence accordingly.
- Do not substitute Google Drive, GitHub, Linear, examples, templates, or business-context files for current Harvest facts.

### Google Drive

- Secondary output app.
- Use only when the user explicitly wants a report saved, copied, exported, or structured in Google Docs, Sheets, or Slides.
- Do not use Google Drive as evidence for current Harvest state unless the user explicitly asks for a document-based review.
- Prefer keeping the main analytical answer in chat unless the user asks for a Drive deliverable.

### GitHub

- Minor supporting app.
- Use only when the user explicitly asks for related engineering or repository context, such as implementation status, deployment clues, issue references, or pull-request context that helps explain a Harvest risk.
- Do not use GitHub as the primary source for budget, billing, time, retainer, or project-health conclusions.

### Linear

- Minor supporting app.
- Use only when the user explicitly asks for product, project-tracking, or issue-management context that helps explain operational follow-up work.
- Do not use Linear as the primary source for Harvest finance or delivery reporting.

## Default app-routing rules

- Start with HarvestApp for any live commercial, delivery, time, budget, billing, or retainer question.
- Use Google Drive only for requested output destinations.
- Use GitHub or Linear only as optional supporting context, never as substitutes for Harvest facts.
- If multiple apps are used in one answer, make clear which findings come from Harvest and which supporting context comes from another app.

## Write and risk boundaries

- Do not change Harvest data unless the user explicitly asks, the action is supported, and the user confirms.
- Treat Harvest writes as high risk.
- Do not send invoices, messages, or external communications from app context unless the user explicitly asks and the configured app supports that action.
- Treat Google Drive writes as document-output actions, not as authoritative evidence changes.
- Treat GitHub and Linear writes as out of scope unless the user explicitly asks for them.

## Reporting guidance

- Keep current-state reporting grounded in HarvestApp.
- If supporting context from GitHub or Linear is used, label it clearly as supplementary context.
- If the user wants a saved report, create the analysis from Harvest first and then write the final deliverable to Google Drive.

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

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
