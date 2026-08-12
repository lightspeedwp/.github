---
name: lightspeed-change-request-router
description: route and assess change requests for lightspeed figma design system to wordpress block theme, block plugin, woocommerce, publishing, tourism and hybrid-theme projects after prds, technical briefs or task plans have been approved. use when the user needs scope-change triage, impact analysis, requirement deltas, task/issue updates, estimate impact, approval gates, risk notes or change-log entries before implementation continues.
---

# LightSpeed Change Request Router

## Purpose

Assess and route change requests after a PRD, technical brief, task plan, GitHub issue draft set, implementation plan or launch QA plan has already been approved.

Use this skill to prevent uncontrolled scope drift while still giving LightSpeed a practical way to handle new requirements, client feedback, design changes, technical blockers or launch findings.

## Core rule

Do not silently fold a change into existing scope. Classify it, explain the impact, identify affected artefacts, and recommend an approval path before implementation continues.

## Inputs to accept

Accept any combination of:

- change request text
- client feedback
- Figma comments or new design links
- GitHub issue comments
- PRD sections
- technical brief sections
- task breakdowns
- GitHub issue drafts
- implementation plans
- launch QA findings
- project memory bank files
- estimates or proposal notes

If the original approved scope is missing, ask for it or mark the assessment as provisional.

## Workflow

1. Summarise the requested change.
2. Identify source and trigger: client, design, development, QA, launch, governance, analytics, accessibility or content.
3. Classify the change type.
4. Compare against approved scope.
5. Assess impact on PRD, technical brief, tasks, GitHub issues, QA, launch gates, estimates and timeline.
6. Identify risks, dependencies and blockers.
7. Recommend one of: accept, defer, reject, needs discovery, needs estimate, or needs stakeholder approval.
8. Generate update instructions for affected artefacts.
9. Produce a change log entry and approval checklist.
10. Recommend the next specialist skill if needed.

## Change classification

Use these labels:

- In Scope - clarification
- In Scope - implementation detail
- Scope Change - minor
- Scope Change - major
- Design Change
- Technical Constraint
- QA Finding
- Launch Blocker
- Content/Governance Change
- Analytics/Measurement Change
- Deferred Enhancement
- Reject / Not Recommended

## Required outputs

Always include:

- Change request summary
- Classification
- Scope impact
- Affected artefacts
- Task and issue impact
- Estimate/timeline impact
- QA and launch impact
- Risks and blockers
- Recommendation
- Approval gate
- Updated task or issue notes
- Change log entry
- Internal LightSpeed notes

## Specialist routing

Route to these skills when relevant:

- `lightspeed-prd-generator` for PRD requirement updates.
- `lightspeed-figma-wordpress-technical-brief` for design-system or WordPress architecture changes.
- `lightspeed-task-breakdown-planner` for new tasks or dependency changes.
- `lightspeed-github-issue-drafter` for updated issue drafts.
- `lightspeed-estimation-proposal-planner` for estimate or commercial impact.
- `lightspeed-approval-gate-manager` for approval checkpoints.
- `lightspeed-launch-qa-planner` for launch-gate or QA changes.
- `lightspeed-project-memory-manager` for memory bank updates.

## Output style

Use UK English. Keep recommendations practical, direct and implementation-aware. Separate client-facing wording from internal LightSpeed notes when the change has commercial, delivery or risk implications.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
