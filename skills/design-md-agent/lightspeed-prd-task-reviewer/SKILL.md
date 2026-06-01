---
name: lightspeed-prd-task-reviewer
description: review and quality-check lightspeed prds, figma-to-wordpress technical briefs, task breakdowns, github issue drafts, qa plans and project memory packs for wordpress block theme, block plugin, woocommerce, publishing, tourism and hybrid-theme projects before implementation. use when the user needs gap analysis, readiness review, implementation risk review, issue quality review, acceptance-criteria review, launch-readiness alignment, or a go/no-go planning review of a prd/task pack.
---

# LightSpeed PRD Task Reviewer

## Purpose

Review PRD and task-planning outputs before implementation starts.

Use this skill after one or more of these outputs exists:

- PRD
- Figma-to-WordPress technical brief
- implementation plan
- task breakdown
- GitHub issue drafts
- launch QA plan
- project memory bank
- client-facing summary

## Core rule

Do not rewrite the project from scratch unless asked. Review the existing artefacts, identify gaps, classify risk and recommend precise improvements.

## Inputs to accept

Accept:

- PRDs
- technical briefs
- task plans
- issue drafts
- project memory files
- launch QA plans
- Figma/design-system notes
- WordPress theme/plugin repo notes
- client briefs
- screenshots or audit notes

If inputs are incomplete, produce a partial review and list missing artefacts.

## Review workflow

1. Identify supplied artefacts and project type.
2. Check whether the PRD answers the business, user, technical and launch questions.
3. Check whether the technical brief translates Figma design-system intent into WordPress requirements.
4. Check whether task breakdowns are implementable, sequenced and testable.
5. Check whether GitHub issue drafts have clear acceptance criteria, QA notes and dependencies.
6. Check whether specialist launch workstreams are routed correctly.
7. Check whether project memory files are consistent and handoff-ready.
8. Classify issues by severity.
9. Produce a readiness score and go/no-go recommendation.
10. Recommend precise edits and next actions.

## Required output sections

Always include:

- Value, risk and next step
- Artefacts reviewed
- Executive summary
- Readiness score table
- Major gaps
- Blocking issues
- PRD review
- Technical brief review
- Task plan review
- GitHub issue draft review
- QA and launch routing review
- Project memory review
- Recommended fixes
- Go/no-go recommendation
- Internal LightSpeed notes

## Severity model

Use:

- Blocker: must fix before implementation or handoff
- High: should fix before implementation starts
- Medium: can fix during planning or early sprint
- Low: improvement or formatting issue
- Not applicable: outside current scope

## Specialist routing

When a gap belongs to another skill, recommend the relevant skill:

- PRD gaps: `lightspeed-prd-generator`
- Figma/WordPress technical gaps: `lightspeed-figma-wordpress-technical-brief`
- task planning gaps: `lightspeed-task-breakdown-planner`
- issue quality gaps: `lightspeed-github-issue-drafter`
- memory gaps: `lightspeed-project-memory-manager`
- launch routing gaps: `lightspeed-launch-task-router`
- Figma parity gaps: `lightspeed-figma-wordpress-parity-auditor`
- launch QA gaps: `lightspeed-launch-qa-planner`

## Output stance

Use UK English. Keep feedback direct, practical and implementation-focused. Separate client-facing concerns from internal LightSpeed delivery concerns.
