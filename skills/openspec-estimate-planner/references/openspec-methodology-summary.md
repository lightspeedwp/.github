# OpenSpec methodology summary

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

Last summarized: 2026-06-22. Check the live OpenSpec website or Fission-AI/OpenSpec docs before each run and use this file only as a fallback or baseline.

## Core idea

OpenSpec is a lightweight spec-driven planning framework for agreeing on what to build before implementation. It keeps project intent, requirements, design decisions, and tasks together so agents and humans can review the change before code or build work starts.

## Current artifact model

A typical OpenSpec change is organised as a self-contained change folder:

```text
openspec/changes/<change-name>/
├── proposal.md
├── design.md
├── tasks.md
└── specs/
    └── <domain>/
        └── spec.md
```

For this LightSpeed estimating skill, the default output is adapted for estimate planning:

```text
proposal.md
optional design.md
tasks.md
tasks-checklist.md
tasks-details.md
```

Only create `specs/` delta files when the user explicitly asks for a full OpenSpec change folder.

## Artifact roles

- `proposal.md`: the why and what. Capture intent, problem, goals, scope, non-goals, assumptions, risks, and high-level approach.
- `specs/`: behavior-first deltas showing requirements being added, modified, or removed. Keep implementation details out of specs.
- `design.md`: the how. Capture technical approach, architecture decisions, data flow, design or component decisions, integrations, and file/template impacts.
- `tasks.md`: the implementation checklist. Group related tasks, use checkbox items, use hierarchical numbering, and make each task small enough to complete and verify.

## Artifact flow

OpenSpec treats artifacts as a lightweight flow:

```text
proposal -> specs -> design -> tasks -> implement
```

The flow is not a rigid waterfall. Artifacts can be updated as new information is discovered. For estimate planning, draft enough structure to support a reliable task breakdown without pretending uncertain scope is final.

## Current command language

Current OpenSpec documentation refers to `/opsx:*` commands, including:

- `/opsx:propose`: create a change and planning artifacts.
- `/opsx:apply`: implement incomplete tasks from `tasks.md`.
- `/opsx:sync`: sync/refresh change artifacts.
- `/opsx:archive`: archive a completed change.
- Expanded workflows may include `/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, and `/opsx:onboard`.

Older examples may mention `/openspec:*`; prefer the live documentation if command naming changes.

## Task best practices

- Group related tasks under meaningful headings or supplied project phases.
- Use hierarchical numbering such as `1.1`, `1.2`, `2.1`.
- Start checklist tasks with `- [ ]`.
- Keep tasks implementation-ready but not overly prescriptive.
- Include testing and validation tasks.
- Include documentation, migration, analytics, accessibility, performance, and handover tasks where the PRD implies them.
- Keep cross-cutting risks or dependencies visible.

## Estimating adaptation

When generating tasks from a PRD or rough estimate:

1. Preserve supplied phases where possible.
2. Convert requirements into implementation tasks.
3. Produce both a clean checklist and a detailed breakdown.
4. Flag assumptions and open questions separately.
5. Avoid exact effort or budget unless requested.
6. If effort is requested, separate confirmed effort from placeholders or ranges that need team validation.

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
