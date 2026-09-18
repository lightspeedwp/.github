# Work Plan Template

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

Use this for substantial work. Small, clear changes can proceed directly from the issue or request.

```markdown
# [Work Item] - Plan

## Goal

[One observable outcome.]

## Context

- Relevant issue/request: [link or summary]
- Repository instructions: [links]
- Important constraints: [list]

## In Scope

- [deliverable]

## Out of Scope

- [explicit exclusion]

## Tasks

1. [task]
2. [task]
3. [task]

## Acceptance Criteria

- [ ] [observable behavior]
- [ ] Relevant repository checks pass (example: `npm run lint`, `npm test`)
- [ ] Tests covering the change are added or validated
- [ ] Documentation/context is updated when behavior or operation changed

## Verification

- Automated: [commands or checks]
  - Example: `npm ci && npm run test` or `pytest -q`
  - Example: `npm run lint && npm run build`
- Manual: [focused scenarios, if useful]
- Independent review: required / optional / not needed - [reason]
- QA: required / optional / not needed - [reason]

## PR Checklist (add to PR body)

- Branch name follows repo policy (e.g., `feat/`, `fix/`, or `chore/`)
- Description: short summary, why, and acceptance criteria
- Verification steps included (commands & manual checks)
- Tests added or existing tests updated
- Relevant docs/PROJECT_BRIEF updated if behavior changed
- Reviewers: @team or specific owners
- Required checks: list CI jobs that must pass
- Release notes / changelog entry: yes/no

## Risks and Decisions

- [risk or material decision]

## QA risk matrix (when to require QA)

- High impact × High uncertainty = QA required
- High impact × Low uncertainty = QA recommended
- Low impact × High uncertainty = QA recommended
- Low impact × Low uncertainty = QA optional

## Next Action

[owner and immediate next step]
```

## Progress Note

For long-running work, keep a short progress note:

```markdown
# [Work Item] - Progress

- Completed: [items]
- In progress: [item]
- Blocked: [issue or none]
- Decisions: [material decisions]
- Verification so far: [results]
- Next action: [specific action]
```

## Dev Handoff

```text
Read the repository instructions, PROJECT_BRIEF.md when present, and this plan.
Implement the in-scope work, run the listed verification, update durable context
when needed, and prepare a pull request. Do not merge.
```

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
