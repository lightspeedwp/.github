# Output templates

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
