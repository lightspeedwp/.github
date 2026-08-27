---
name: lightspeed-requirements-traceability-mapper
description: map lightspeed prd requirements, figma-to-wordpress technical brief items, user stories, acceptance criteria, github issue drafts, qa checks and launch gates into a clear traceability matrix for wordpress block theme, block plugin, woocommerce, publishing, tourism and hybrid-theme projects. use when the user needs requirement-to-task mapping, acceptance coverage, issue coverage, qa coverage, missing requirement detection, launch gate traceability or a go/no-go coverage report before implementation or launch.
---

# LightSpeed Requirements Traceability Mapper

## Purpose

Create traceability between project intent and delivery execution for LightSpeed Figma design system to WordPress projects.

Use this skill after a PRD, technical brief, task breakdown, GitHub issue drafts or QA plan exists and the user needs to confirm that every requirement is covered by tasks, acceptance criteria, issue drafts and test checks.

## Core rule

Do not assume that a requirement is covered just because a related task exists. Coverage must be explicit.

If a requirement lacks a task, issue, acceptance criterion or QA check, mark it as a gap.

## Inputs to accept

Accept any combination of:

- PRD
- product brief
- user stories
- Figma-to-WordPress technical brief
- task breakdown
- implementation plan
- GitHub issue drafts
- QA plan
- launch readiness checklist
- Figma parity notes
- WordPress repo notes
- acceptance criteria
- test scripts
- launch gate checklist

## Workflow

1. Identify the source documents and their status.
2. Extract requirements and classify them.
3. Map each requirement to technical brief items, tasks, issue drafts, acceptance criteria and QA checks.
4. Identify unmapped or weakly mapped requirements.
5. Identify orphan tasks that do not trace back to a requirement.
6. Flag launch blockers, high-risk gaps and duplicated work.
7. Produce a traceability matrix and coverage summary.
8. Recommend fixes before implementation or launch.

## Requirement categories

Classify requirements as:

- Business / product
- Figma design system
- WordPress block theme
- WordPress block plugin
- WooCommerce
- Content / editorial workflow
- Accessibility
- Performance
- SEO / schema / AI discoverability
- Analytics / conversion tracking
- Privacy / policy / governance
- Redirect / migration
- QA / launch operations

## Coverage levels

Use these statuses:

- Covered
- Partly covered
- Not covered
- Needs clarification
- Duplicated
- Out of scope
- Launch blocker

## Required outputs

Include:

- Executive summary
- Source inventory
- Requirement register
- Traceability matrix
- Acceptance criteria coverage table
- GitHub issue coverage table
- QA and launch gate coverage table
- Coverage gaps
- Orphan tasks/issues
- Risk and blocker summary
- Recommended fixes
- Internal LightSpeed notes

## Reference loading

Use these references as needed:

- `references/traceability-workflow.md` for the mapping process.
- `references/requirement-classification.md` for category and status rules.
- `references/coverage-rules.md` for coverage decision rules.
- `references/wordpress-traceability.md` for WordPress-specific mapping.
- `references/qa-coverage-rules.md` for acceptance and QA coverage.
- `references/report-template.md` for final report structure.

## Quality standard

Outputs should be practical, evidence-led and ready to paste into a project pack, GitHub issue review, Google Doc or launch QA handoff. Keep wording direct, UK English and LightSpeed-specific.

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
