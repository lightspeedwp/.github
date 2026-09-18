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

## Reusable Project Template

```markdown
# [Project Name] Project Template

## Purpose
[What this project document helps the team decide or coordinate.]

## When to Use
- [Project type or stage]
- [Team or audience]
- [Decision or workflow this template supports]

## Project Snapshot
- **Project/initiative:**
- **Primary goal:**
- **Audience:**
- **Owner direction:**
- **Current stage:**
- **Target milestone/date, if confirmed:**

## Goals
- [Outcome the project should create]

## Non-Goals
- [Explicitly out-of-scope item]

## Scope
### In Scope
- [Included work]

### Out of Scope
- [Excluded work]

## Milestones or Phases
| Phase | Outcome | Owner | Status | Notes |
| --- | --- | --- | --- | --- |
| [Phase] | [Outcome] | [Owner or owner direction] | [Status] | [Notes] |

## Workstreams
- **Design:**
- **Development:**
- **Content:**
- **QA:**
- **Launch/support:**

## Dependencies
| Dependency | Needed By | Owner | Risk If Missing |
| --- | --- | --- | --- |
| [Dependency] | [Date or phase] | [Owner] | [Risk] |

## Risks
| Risk | Impact | Mitigation | Owner |
| --- | --- | --- | --- |
| [Risk] | [Impact] | [Mitigation] | [Owner] |

## Decisions
| Decision | Status | Owner | Date | Notes |
| --- | --- | --- | --- | --- |
| [Decision] | Proposed/Approved/Deferred | [Owner] | [Date] | [Notes] |

## Open Questions
- [Question blocking confidence or action]

## Acceptance Criteria
- [ ] [Clear validation condition]

## Handoff Checklist
- [ ] Project scope is agreed.
- [ ] Owners or owner directions are clear.
- [ ] Dependencies are visible.
- [ ] Risks have mitigation notes.
- [ ] Open questions have next owners.
- [ ] Related Linear issues/projects/docs are linked.
```

## Project Kickoff Document

```markdown
# [Project Name] Kickoff

## Summary
[One short paragraph describing the project, goal, and current stage.]

## Confirmed Facts
- [Known fact]

## Assumptions
- [Assumption to validate]

## Goals
- [Goal]

## Non-Goals
- [Non-goal]

## Scope
- [Scope item]

## Team and Ownership
| Area | Owner Direction | Notes |
| --- | --- | --- |
| Delivery | [Owner direction] | [Notes] |
| Design | [Owner direction] | [Notes] |
| Development | [Owner direction] | [Notes] |
| QA | [Owner direction] | [Notes] |

## Milestones
| Milestone | Target | Confidence | Notes |
| --- | --- | --- | --- |
| [Milestone] | [Date or phase] | High/Medium/Low | [Notes] |

## Risks and Dependencies
- **Risk:** [Risk]  
  **Mitigation:** [Mitigation]
- **Dependency:** [Dependency]  
  **Owner:** [Owner direction]

## Decisions Needed
- [Decision] by [owner/date if confirmed]

## Next Actions
- [ ] [Action] - [Owner direction]
```

## Project Status Template

```markdown
# [Project Name] Status Update - [Date]

## Overall Status
[On track / At risk / Blocked / Complete] - [short reason]

## Progress Since Last Update
- [Progress]

## Current Focus
- [Focus]

## Risks or Blockers
- [Risk or blocker, owner, next action]

## Decisions Needed
- [Decision, decision owner, needed by]

## Next Milestone
- **Milestone:**
- **Target:**
- **Confidence:**

## Links
- Linear project:
- Related issues:
- Supporting docs:
```

## Document Audit Output

```markdown
## What is working
- [Strength]

## Issues
- [Gap or risk]

## Highest-priority fixes
1. [Fix]
2. [Fix]
3. [Fix]

## Suggested structure
- [Section]
- [Section]
- [Section]

## Risks and assumptions
- [Risk or assumption]
```

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
