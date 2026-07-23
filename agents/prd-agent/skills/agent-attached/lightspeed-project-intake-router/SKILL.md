---
name: lightspeed-project-intake-router
description: structure rough project briefs, figma links, github repos, live or staging urls, client notes and discovery inputs into a lightspeed prd/task kickoff pack for figma design system to wordpress block theme, block plugin, woocommerce, publishing, tourism and hybrid-theme projects. use when the user needs intake questions, project classification, source inventory, missing inputs, approval gates, estimation preference, specialist skill routing or a kickoff-ready brief before research, prd creation or task planning.
---

# LightSpeed Project Intake Router

## Purpose

Turn early, messy or partial project inputs into a structured kickoff pack that can feed LightSpeed PRD, research, technical brief, task planning, GitHub issue drafting, memory and launch QA workflows.

Use this skill before `lightspeed-project-researcher`, `lightspeed-prd-generator`, `lightspeed-figma-wordpress-technical-brief` or `lightspeed-prd-task-manager` when the project context is incomplete, mixed across notes, or needs routing.

## Core rule

Do not write the final PRD or task plan in this skill. Produce a clear intake summary, missing information list, source inventory, recommended workflow route and next prompts.

## Inputs to accept

Accept any combination of:

- client brief
- discovery notes
- Figma design system URL
- Figma page/frame URL
- Figma Make prototype URL
- screenshots or exports
- live site URL
- staging/dev site URL
- GitHub repo links
- GitHub issue links
- existing content pack
- audit notes
- Asana notes
- client emails or meeting notes
- launch/readiness notes

## Workflow

1. Identify the project type and build type.
2. Extract known facts from the supplied inputs.
3. Build a source inventory.
4. Classify inputs by evidence maturity.
5. Ask only the highest-value missing questions.
6. Define the likely output route.
7. Recommend specialist skills to run next.
8. Produce a kickoff pack in Markdown.
9. Include client-facing summary and internal LightSpeed notes.
10. Stop before creating final PRD, issues or implementation plan unless the user explicitly asks to proceed.

## Project type detection

Classify projects as one or more of:

- WordPress block theme
- WordPress block theme plus custom block plugin
- existing classic or hybrid theme conversion
- WooCommerce block theme
- publishing/content-heavy platform
- tourism/tour operator platform
- AI readiness/governance website
- migration/redesign
- lead-generation/professional-services site
- internal LightSpeed product/plugin project

## Required output sections

For every intake output include:

- Value, risk and next step
- Project snapshot
- Build type classification
- Known inputs and sources
- Evidence maturity table
- Missing information
- Clarifying questions
- Assumptions and risks
- Recommended workflow route
- Specialist skill routing
- Suggested output pack
- Approval gates
- Client-facing summary
- Internal LightSpeed notes

## Routing rules

Route to:

- `lightspeed-project-researcher` when evidence needs review before PRD.
- `lightspeed-prd-generator` when the user needs a PRD only.
- `lightspeed-figma-wordpress-technical-brief` when Figma-to-WordPress architecture needs definition.
- `lightspeed-task-breakdown-planner` when PRD/technical brief are approved and tasks are needed.
- `lightspeed-github-issue-drafter` when tasks need GitHub-ready issue drafts.
- `lightspeed-project-memory-manager` when a handoff/memory bank is needed.
- `lightspeed-launch-qa-planner` when launch QA scope needs planning.
- `lightspeed-prd-task-manager` when the user wants the full combined pack.

## Evidence status labels

Use:

- Confirmed
- Supplied but unreviewed
- Draft
- Needs Review
- Evidence Required
- Missing
- Not Applicable
- Blocker

## Estimation preference

Ask the user which estimation model to use when planning tasks later:

- no estimates
- T-shirt size
- hours
- sprint fit
- complexity/risk only

If the user is unsure, default to complexity/risk for internal planning and hours for client-facing proposals.

## Output stance

Use UK English. Keep outputs practical, structured and ready to paste into Google Docs, GitHub or a Markdown project pack. Avoid over-specifying implementation before the PRD and technical brief are approved.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
