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

This guide documents the attached apps and runtime tools the Playwright Testing Agent uses, what evidence each source provides, and when to prefer files or Memory instead of live app calls.

## General usage rules

- Prefer read actions for evidence gathering.
- Treat write actions as approval-gated unless the user explicitly authorises them.
- Prefer attached files, fixtures, templates, examples, and README/reference guides when the needed evidence is already present in the agent file set.
- Prefer Memory for stable workflow defaults and reusable QA preferences, not for raw source dumps or one-off project artifacts.

## GitHub

### Used for

- Repository inspection
- Existing Playwright test review
- CI and workflow review
- Issue and pull request context

### Evidence it provides

- Actual repo structure and source files
- Existing test conventions, helpers, and fixtures
- Pull request and issue history
- CI configuration and workflow signals

### Practical boundaries

- Default to read-only analysis unless the user explicitly authorises write-back.
- Do not treat repository guesses as evidence; inspect the repo first.
- Avoid direct writes to protected branches.

### Prefer files or Memory when

- Prefer files when requirements, templates, examples, or README/reference guidance are already attached in the agent pack.
- Prefer Memory for stable repo-review preferences or repeatable QA defaults, not for storing repo snapshots.

## Google Drive

### Used for

- Reading PRDs, docs, sheets, and presentation material
- Pulling approved source documents into the testing workflow

### Evidence it provides

- Product requirements and acceptance criteria
- Supporting documentation and structured planning docs
- Presentation or spreadsheet evidence that informs test coverage

### Practical boundaries

- Use Drive as evidence only when the relevant document is actually available.
- Do not assume a document is authoritative if newer approved files or chat instructions conflict.
- Treat edits and shares as approval-gated actions.

### Prefer files or Memory when

- Prefer files when the relevant source document has already been added to the agent as a stable reference.
- Prefer Memory for durable preferences like output style or review defaults, not for storing copied document contents.

## Linear

### Used for

- Reading issue, project, and milestone context
- Mapping requirements or failures to product work

### Evidence it provides

- Issue descriptions and status
- Project and milestone context
- Comments and linked planning artifacts available through the app

### Practical boundaries

- Use Linear as product-planning evidence, not as a substitute for approved acceptance criteria.
- Create or update issues only when the user explicitly asks for it.
- Keep traceability grounded to the actual issue or project evidence reviewed.

### Prefer files or Memory when

- Prefer files for reusable traceability templates and final packaged outputs.
- Prefer Memory for recurring preferences about issue packaging or naming, not for storing changing issue state.

## Bugherd

### Used for

- Packaging actionable frontend QA findings
- Reviewing or preparing failure reports tied to Playwright outputs

### Evidence it provides

- QA task context
- Reproduction details and frontend feedback
- Existing comments and issue history available in the tool

### Practical boundaries

- Do not create or update Bugherd items unless the user explicitly authorises it.
- Keep failure packages concise, reproducible, and traceable.
- Never include secrets or unsafe environment credentials.

### Prefer files or Memory when

- Prefer files for reusable failure templates, examples, and packaged summaries.
- Prefer Memory for durable reporting preferences, not for storing one-off failure payloads long term.

## HarvestApp

### Used for

- Reading project, client, or time-tracking context when it materially affects QA planning or reporting
- Confirming project naming, budget context, or work-log framing when the user asks for it

### Evidence it provides

- Project and client labels
- Time-entry context and project bookkeeping signals
- Reporting context for scoped QA work

### Practical boundaries

- Treat Harvest as optional project context, not as a source of product truth.
- Do not create, edit, or delete Harvest records without explicit approval.
- Do not let time-tracking metadata override grounded requirements, repository evidence, or approved design evidence.

### Prefer files or Memory when

- Prefer files for durable project briefs, traceability outputs, and validation notes.
- Prefer Memory for stable reporting preferences or repeatable account-scoping defaults, not for storing changing time-entry history.

## Web search

### Used for

- Public documentation lookup
- Current best-practice checks when internal sources are not enough
- Confirming public framework or platform details

### Evidence it provides

- Up-to-date public documentation and references
- Public implementation guidance and ecosystem signals

### Practical boundaries

- Use web search only when internal files, connected sources, or explicit user input are insufficient.
- Do not let generic public guidance override grounded project evidence.
- Treat search findings as supporting evidence, not automatically as project truth.

### Prefer files or Memory when

- Prefer files when the needed guidance already exists in attached references, templates, or project documents.
- Prefer Memory for stable agent preferences about how to report or validate findings, not for storing general web research dumps.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
