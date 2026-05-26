---
name: lightspeed-github-issue-drafter
description: create github-ready markdown issue drafts for lightspeed figma design system to wordpress block theme, block plugin, woocommerce, publishing, tourism and hybrid-theme projects. use when the user has a prd, technical brief, task breakdown, implementation plan, bug report, launch qa finding or acceptance criteria and needs well-structured issue drafts, labels, milestones, dependencies, qa notes, developer notes or review-ready github issue bodies without creating issues automatically.
---

# LightSpeed GitHub Issue Drafter

## Purpose

Convert approved planning outputs into review-ready GitHub issue drafts for LightSpeed WordPress delivery projects.

Use this skill after a PRD, Figma-to-WordPress technical brief, task breakdown, launch QA plan or audit finding has identified work that should become GitHub issues.

## Core rule

Do not create GitHub issues automatically. Generate Markdown issue drafts for human review unless the user explicitly asks to use a GitHub tool after reviewing the drafts.

## Input types

Accept:

- PRDs
- Figma-to-WordPress technical briefs
- task breakdowns
- implementation waves
- acceptance criteria
- QA findings
- launch blocker lists
- parity audit findings
- bug reports
- repo notes
- screenshots or design notes

## Supported project types

Support:

- WordPress block themes
- custom block plugins
- WooCommerce block themes
- publishing and editorial platforms
- tour operator/plugin-led sites
- hybrid/classic-to-block transitions
- design-system implementation projects
- launch QA and remediation projects

## Workflow

1. Identify the issue source: PRD, task plan, technical brief, QA finding, bug or launch gate.
2. Group work by epic, repo, milestone or implementation wave where possible.
3. Create one issue per independently testable unit of work.
4. Keep each issue small enough for a developer to complete and review.
5. Include acceptance criteria, implementation notes and QA checks.
6. Add dependencies, blockers and related issues when known.
7. Suggest labels and milestone, but do not assume final team ownership.
8. Separate client-facing context from internal implementation notes where useful.
9. Flag missing information rather than inventing requirements.

## Required issue output

Each issue draft should include:

- Title
- Summary
- Context
- Scope
- Out of scope
- Acceptance criteria
- Technical notes
- QA checks
- Dependencies/blockers
- Suggested labels
- Suggested milestone
- Suggested owner role
- Estimate model if requested
- Internal LightSpeed notes

## Issue sizing guidance

Prefer:

- one issue per feature, template, block, pattern, integration or QA fix
- one issue per launch blocker
- separate design-system/token work from template implementation
- separate frontend, editor, data/schema and QA work when useful

Avoid:

- vague issues such as "build the homepage"
- combining unrelated design, content, dev and QA tasks
- creating issues that depend on unapproved claims, content or designs without noting the blocker

## Acceptance criteria

Use the format that best fits the issue:

- checklist for implementation tasks
- Given/When/Then for behaviour or user flows
- QA test steps for launch and bug issues
- technical checks for theme, plugin, schema, tracking and accessibility tasks

## Reference loading

Use these references as needed:

- `references/issue-drafting-workflow.md` for issue creation process.
- `references/issue-templates.md` for standard issue structures.
- `references/label-and-milestone-rules.md` for suggested labels and milestones.
- `references/wordpress-issue-rules.md` for WordPress-specific requirements.
- `references/acceptance-criteria-rules.md` for criteria formats.
- `references/qa-and-review-rules.md` for QA and review notes.
- `references/dependency-rules.md` for dependencies and blockers.

## Output packaging

For multiple issues, create:

```text
issue-drafts/
├── README.md
├── issue-index.md
└── issues/
    ├── issue-001-[slug].md
    ├── issue-002-[slug].md
    └── issue-003-[slug].md
```

## Quality standard

Write issues so a developer, designer, QA reviewer and project lead can understand the work without rereading the entire PRD.
