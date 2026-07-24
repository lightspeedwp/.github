---
name: lightspeed-qa-findings-router
description: triage qa findings for lightspeed figma design system to wordpress block theme, block plugin, woocommerce, publishing, tourism and hybrid-theme projects. use when the user has acceptance test results, launch qa findings, figma-to-wordpress parity issues, accessibility failures, responsive bugs, form/tracking defects, .schemas/redirect issues or content/governance review notes and needs prioritised fixes, severity classification, ownership, github-ready issue drafts, retest steps or launch blocker routing.
---

# LightSpeed QA Findings Router

## Purpose

Turn raw QA findings into a structured fix plan for LightSpeed WordPress delivery projects.

Use this skill after acceptance testing, design parity review, launch readiness audits, accessibility checks, form tests, Lighthouse/PageSpeed checks, schema validation, redirect QA or stakeholder review.

## Core rule

Do not treat every finding as a launch blocker. Classify issues by launch risk, user impact, evidence quality and fix ownership.

If a finding lacks reproduction steps or evidence, mark it as `Needs Reproduction` rather than inventing details.

## Inputs to accept

Accept any combination of:

- QA notes
- screenshots
- test script results
- acceptance test tables
- Figma parity reports
- accessibility audit notes
- Lighthouse/PageSpeed notes
- broken link reports
- form testing results
- GA4/GTM test results
- redirect/schema validation notes
- GitHub issue drafts
- launch QA plans
- PRD requirements and acceptance criteria
- stakeholder feedback

## Workflow

1. Identify the source of each finding.
2. Normalise each finding into a consistent row: summary, evidence, expected result, actual result, affected URL/template/block, severity, owner role, next action.
3. Classify severity using the issue severity model.
4. Classify workstream: design parity, block theme, block plugin, content, accessibility, responsive, forms, analytics, SEO/redirects, schema, governance, performance or launch operations.
5. Decide launch status: launch blocker, must fix before launch, can launch with follow-up, post-launch improvement, needs reproduction, or duplicate.
6. Draft GitHub-ready issues for actionable findings.
7. Add retest steps and acceptance checks.
8. Produce a launch impact summary and recommended next workflow.

## Required outputs

For a QA triage task, include:

- QA findings triage summary
- prioritised finding register
- launch blocker list
- workstream routing table
- GitHub-ready issue drafts
- retest checklist
- duplicate/invalid findings list
- unresolved questions
- client-facing summary
- internal LightSpeed notes

## Specialist routing

Route findings to existing specialist skills when needed:

- design parity findings → `lightspeed-figma-wordpress-parity-auditor`
- launch readiness findings → `lightspeed-launch-readiness-auditor`
- redirect/404 findings → `lightspeed-redirect-map-planner`
- .schemas/AI search findings → `lightspeed-schema-and-ai-discoverability-planner`
- GA4/GTM findings → `lightspeed-ga4-conversion-tracking-planner`
- claim/content findings → `lightspeed-claim-register-auditor` or `lightspeed-website-content-generator`
- policy/trust findings → `lightspeed-policy-page-generator`
- issue drafting → `lightspeed-github-issue-drafter`

## Quality standard

Outputs must be practical, concise and suitable for GitHub, Asana or launch standup review. Separate client-safe summaries from internal implementation notes.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
