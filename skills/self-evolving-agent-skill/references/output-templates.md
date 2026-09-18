# Output Templates

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

Use these templates when the user asks for a structured review, evolution proposal, or changelog.

## Quick skill improvement audit

```markdown
# Quick improvement audit: [artefact]

## 3-point summary
- Value: [highest-value improvement]
- Risk: [main regression, safety, or scope risk]
- Next step: [recommended mutation or decision]

## Current baseline
- [3-7 bullets on current structure, purpose, strengths, and known gaps]

## Improvement opportunities
| Priority | Mutation type | Target | Change | Expected value | Risk | Evidence quality |
|---:|---|---|---|---|---|---|
| 1 | [trigger/workflow/output/etc.] | [file/section] | [change] | [benefit] | [low/medium/high] | [confirmed/inferred/etc.] |

## Recommended decision
[accept/revise/hold/reject one mutation or a tightly related set]

## Do not apply yet
State that changes are not applied unless the user explicitly asks to proceed.
```

## Evolution brief

```markdown
# Evolution brief: [artefact]

## 3-point summary
- Value: [main improvement opportunity]
- Risk: [main safety or regression risk]
- Next step: [recommended action]

## Current baseline
- Version/source: [details]
- Purpose: [what it is meant to do]
- Known strengths: [bullets]
- Known gaps: [bullets]

## Improvement pressure
Primary pressure: [trigger accuracy/output quality/etc.]
Evidence: [source or user feedback]

## Recommended mutation
[Concise description]

## Evaluation plan
- Example/regression 1: [check]
- Example/regression 2: [check]
- Safety check: [check]

## Decision needed
[accept/revise/hold/reject, with reason]
```

## Candidate mutation table

```markdown
| ID | Type | Target | Change | Expected value | Risk | Evaluation | Verdict |
|---|---|---|---|---|---|---|---|
| mut-001 | workflow | SKILL.md > Workflow | [change] | [benefit] | [risk] | [test/check] | [accept/revise/hold/reject] |
```

## Changelog entry

```markdown
## [version] - YYYY-MM-DD

### Changed
- [mutation type] [summary of accepted change]

### Evidence
- [source or feedback]

### Evaluation
- [test/check performed and result]

### Safety and rollback
- Risk level: [low/medium/high]
- Rollback: [how to restore prior state]
```

## Review verdict

```markdown
Verdict: [accept / revise / hold / reject]

Reason: [one paragraph]

Required fixes before acceptance:
1. [fix]
2. [fix]

Regression checks:
- [pass/fail/not tested] [check]
- [pass/fail/not tested] [check]
```

## Skill archive register

```markdown
| Version | Parent | Date | Mutation type | Evidence | Evaluation | Verdict | Rollback |
|---|---|---|---|---|---|---|---|
| 1.1.0 | 1.0.0 | YYYY-MM-DD | workflow | [source] | [result] | accepted | [path/version] |
```

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
