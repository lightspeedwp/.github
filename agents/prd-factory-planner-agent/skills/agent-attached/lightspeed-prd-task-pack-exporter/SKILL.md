---
name: lightspeed-prd-task-pack-exporter
description: create consolidated downloadable project packs for lightspeed figma design system to wordpress block theme, block plugin, woocommerce, publishing, tourism and hybrid-theme projects. use when the user has prds, research notes, figma-to-wordpress technical briefs, task breakdowns, github issue drafts, implementation plans, qa plans, launch-routing notes or project memory files and needs them organised into a clean markdown folder structure, zipped handoff pack, google-doc-ready index, source notes, review checklist or client/internal delivery archive.
---

# LightSpeed PRD Task Pack Exporter

## Purpose

Create a clean, handoff-ready Markdown project pack from PRD, technical brief, task planning, GitHub issue draft, QA, implementation and memory-bank outputs.

Use this skill after one or more of these workflows has produced outputs:

- `lightspeed-project-researcher`
- `lightspeed-prd-generator`
- `lightspeed-figma-wordpress-technical-brief`
- `lightspeed-task-breakdown-planner`
- `lightspeed-github-issue-drafter`
- `lightspeed-implementation-plan-generator`
- `lightspeed-prd-task-reviewer`
- `lightspeed-project-memory-manager`
- `lightspeed-launch-task-router`

## Core rule

Do not invent missing project evidence. If a section is incomplete, create a placeholder file with:

- status
- missing inputs
- suggested owner
- recommended next step

## Inputs to accept

Accept any combination of:

- PRD
- discovery/research summary
- Figma/design-system notes
- technical brief
- token, template, block or pattern maps
- task breakdown
- dependency map
- implementation waves
- GitHub issue drafts
- launch QA plan
- readiness review
- project memory files
- source notes
- client-facing summary
- internal LightSpeed notes

## Workflow

1. Identify available outputs and missing sections.
2. Choose the right pack type: quick pack, full project pack, implementation handoff pack, launch pack or review pack.
3. Create a numbered folder structure.
4. Preserve client-facing and internal LightSpeed notes separately.
5. Add README and file index.
6. Add source notes, assumptions, risks and open questions.
7. Add review checklist and next-step routing.
8. If creating files, package as a single zip.

## Default full pack structure

Use this structure unless the user provides another:

```text
project-slug-prd-task-pack/
├── README.md
├── 00-index/
│   ├── file-index.md
│   ├── source-inventory.md
│   └── pack-status.md
├── 01-discovery/
│   ├── research-summary.md
│   ├── evidence-reviewed.md
│   ├── assumptions.md
│   └── open-questions.md
├── 02-prd/
│   ├── prd.md
│   ├── client-facing-summary.md
│   └── internal-lightSpeed-notes.md
├── 03-technical-brief/
│   ├── figma-to-wordpress-technical-brief.md
│   ├── theme-json-token-map.md
│   ├── template-pattern-map.md
│   ├── component-block-map.md
│   └── block-plugin-requirements.md
├── 04-task-plan/
│   ├── epic-map.md
│   ├── task-breakdown.md
│   ├── dependency-map.md
│   ├── implementation-waves.md
│   └── acceptance-test-map.md
├── 05-github-issue-drafts/
│   ├── issue-index.md
│   └── issues/
├── 06-implementation-plan/
│   ├── implementation-plan.md
│   ├── branch-pr-strategy.md
│   ├── workstream-plan.md
│   └── risk-register.md
├── 07-qa-and-launch/
│   ├── launch-qa-plan.md
│   ├── specialist-skill-routing.md
│   ├── launch-gates.md
│   └── go-no-go-summary.md
├── 08-memory-bank/
│   ├── projectbrief.md
│   ├── productContext.md
│   ├── systemPatterns.md
│   ├── techContext.md
│   ├── activeContext.md
│   ├── progress.md
│   └── tasks/_index.md
└── 09-review/
    ├── readiness-review.md
    ├── reviewer-checklist.md
    └── next-actions.md
```

## Required README sections

Every pack README should include:

- Project name
- Pack purpose
- Build type
- Source links
- Files included
- How to use the pack
- Recommended next step
- Approval gates
- Known gaps

## Quality rules

- Use UK English.
- Keep Markdown clean and copy-paste friendly.
- Prefer tables for registers and indexes.
- Keep client-facing notes separate from internal LightSpeed notes.
- Mark incomplete files clearly as `Draft`, `Needs Review`, `Evidence Pending`, `Blocked` or `Approved`.
- Do not create GitHub issues automatically.
- Do not write or modify production code.

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
