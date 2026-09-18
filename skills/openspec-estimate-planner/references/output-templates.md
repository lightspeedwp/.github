# Output templates

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

Use these templates when generating OpenSpec-aligned estimate artifacts. Adapt section wording to the project, but keep filenames and the overall purpose intact.

## proposal.md

```markdown
# Proposal: [Change or Project Name]

## Intent
[Explain why this work is needed and what problem it solves.]

## Source Summary
- Source type: [PRD / rough estimate / discovery notes / mixed]
- Confidence: [high / medium / low]
- Supplied phases: [list phases or say inferred]

## Scope
### In scope
- [Confirmed scope item]

### Out of scope
- [Explicit exclusion or sensible non-goal]

## Requirements Summary
- [Behavior-first requirement or outcome]

## Approach
[High-level approach. Keep implementation details light unless no design.md will be generated.]

## Phase Mapping
| Phase | Outcome | Notes |
|---|---|---|
| [Phase] | [Outcome] | [Notes] |

## Assumptions
- [Assumption]

## Risks and Dependencies
- [Risk or dependency]

## Open Questions
- [Question]
```

## design.md

Generate only when design or design-adjacent content appears in the source.

```markdown
# Design: [Change or Project Name]

## Technical / Design Approach
[Summarise the planned design, technical, architecture, integration, layout, or implementation approach.]

## Design Inputs
- [Figma, prototype, UI, UX, design system, layout, template, theme, component, or brand input]

## Architecture and Implementation Decisions
### Decision: [Decision Name]
[Explain the decision and why it matters.]

## Components, Templates, or Files Affected
- `[component/template/file]` — [expected change]

## Data, Content, or Integration Flow
[Describe flow in bullets or a simple diagram if useful.]

## Constraints
- [Constraint]

## Validation Notes
- [Design, technical, accessibility, responsive, performance, analytics, or QA validation note]
```

## tasks.md

Use this as the standard OpenSpec-compatible implementation checklist. It may match `tasks-checklist.md`, but keep this file named exactly `tasks.md` for OpenSpec compatibility.

```markdown
# Tasks

## 1. [Phase Name]
- [ ] 1.1 [Implementation task]
- [ ] 1.2 [Implementation task]

## 2. [Phase Name]
- [ ] 2.1 [Implementation task]
- [ ] 2.2 [Implementation task]

## 3. QA and Validation
- [ ] 3.1 [Validation task]
- [ ] 3.2 [Review or handover task]
```

## tasks-checklist.md

Use this as the clean estimate checklist. Avoid long explanations here.

```markdown
# Tasks Checklist: [Change or Project Name]

## 1. [Phase Name]
- [ ] 1.1 [Task title]
- [ ] 1.2 [Task title]

## 2. [Phase Name]
- [ ] 2.1 [Task title]
- [ ] 2.2 [Task title]
```

## tasks-details.md

Use this for the detailed task breakdown. Include enough context for estimating, planning, issue creation, or developer handoff.

```markdown
# Task Details: [Change or Project Name]

## Summary
[Short summary of the task breakdown and how phases were applied.]

## Phase 1: [Phase Name]

### 1.1 [Task title]
- Status: Not started
- Source requirement: [Requirement or PRD reference]
- Objective: [What this task achieves]
- Work involved:
  - [Step or work item]
  - [Step or work item]
- Acceptance criteria:
  - [Clear pass condition]
- Dependencies:
  - [Dependency or none]
- QA / validation:
  - [Test, review, accessibility, responsive, analytics, migration, or launch check]
- Estimate notes:
  - [Known sizing notes, uncertainty, or placeholder if not estimating]

### 1.2 [Task title]
- Status: Not started
- Source requirement: [Requirement or PRD reference]
- Objective: [What this task achieves]
- Work involved:
  - [Step or work item]
- Acceptance criteria:
  - [Clear pass condition]
- Dependencies:
  - [Dependency or none]
- QA / validation:
  - [Validation]
- Estimate notes:
  - [Notes]

## Cross-phase Assumptions and Open Questions
- [Assumption or question]
```

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
