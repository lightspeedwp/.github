---
name: lightspeed-launch-task-router
description: route completed lightspeed prds, technical briefs, task plans, github issue drafts and project memory into the correct specialist launch workflows for figma design system to wordpress block theme, block plugin, woocommerce, publishing, tourism and hybrid-theme projects. use when the user needs launch workflow routing, specialist skill selection, launch readiness sequencing, qa workstream mapping, redirect/schema/analytics/policy/claim/design-parity routing, launch gate planning or a consolidated launch task router report.
---

# LightSpeed Launch Task Router

## Purpose

Route completed planning outputs into the correct LightSpeed launch-preparation workflows and produce a consolidated launch routing plan.

Use this skill after a PRD, Figma-to-WordPress technical brief, task breakdown, GitHub issue drafts or project memory bank exists.

## Core rule

Do not run final launch QA directly unless the user asks for it. This skill plans and routes the next launch tasks to the correct specialist skills.

If evidence is missing, mark the workstream as `Pending Input` and list the required source material.

## Inputs to accept

Accept any combination of:

- PRD
- Figma-to-WordPress technical brief
- implementation plan
- task breakdown
- GitHub issue drafts
- launch QA notes
- project memory bank
- Figma design system URL
- Figma prototype URL
- WordPress theme repo
- WordPress block plugin repo
- staging/dev site URL
- live site URL
- content, claim, policy, schema, analytics or redirect notes

## Specialist skill routing

Route to these skills where relevant:

| Need | Specialist skill |
|---|---|
| Final QA scope and launch planning | `lightspeed-launch-qa-planner` |
| Final go/no-go audit | `lightspeed-launch-readiness-auditor` |
| Figma design-system parity | `lightspeed-figma-wordpress-parity-auditor` |
| Redirects and SEO migration | `lightspeed-redirect-map-planner` |
| Schema and AI discoverability | `lightspeed-schema-and-ai-discoverability-planner` |
| GA4/GTM measurement | `lightspeed-ga4-conversion-tracking-planner` |
| Claims, proof and stats | `lightspeed-claim-register-auditor` |
| Policy and trust pages | `lightspeed-policy-page-generator` |
| FAQ and chatbot-safe source set | `lightspeed-faq-and-chatbot-source-curator` |
| Phase 2 chatbot planning | `ai-chatbot-planner` or `lightspeed-ai-readiness` |
| Memory bank update | `lightspeed-project-memory-manager` |
| GitHub issue formatting | `lightspeed-github-issue-drafter` |

## Workflow

1. Identify project type and launch stage.
2. Review supplied PRD, technical brief, task plan and memory outputs.
3. Identify launch workstreams.
4. Classify each workstream as:
   - Ready to route
   - Pending input
   - Blocked
   - Not applicable
5. Select the correct specialist skill for each workstream.
6. Define sequencing and dependencies.
7. Identify launch blockers and approval gates.
8. Create a consolidated launch routing report.
9. Create prompt starters for each specialist skill.
10. Recommend the next immediate action.

## Required output sections

Always include:

- Client/project summary
- Launch stage
- Evidence reviewed
- Workstream routing table
- Specialist skill routing table
- Dependency and sequencing notes
- Launch blockers
- Approval gates
- Prompt starters for specialist skills
- Recommended next action
- Internal LightSpeed notes

## Launch gate model

Use these statuses:

- `Launch Blocker`: must be resolved before launch.
- `Must Fix`: should be resolved before launch unless leadership accepts risk.
- `Can Launch With Follow-up`: non-critical, with owner and date.
- `Post-launch Improvement`: improvement backlog.
- `Pending Input`: cannot assess until source material is supplied.
- `Not Applicable`: irrelevant to this project.

## Output style

Use UK English. Be practical, structured and direct. Keep outputs Markdown-first and suitable for GitHub, Google Docs or a downloadable project pack.
