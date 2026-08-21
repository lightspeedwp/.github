---
name: lightspeed-task-breakdown-planner
description: create implementation task breakdowns, epics, dependency maps, github issue drafts, acceptance criteria, qa checks and delivery waves for lightspeed figma design system to wordpress block theme, block plugin, woocommerce, publishing, tourism and hybrid-theme projects. use when the user has a prd, technical brief, figma-to-wordpress brief, client brief, repo notes or launch plan and needs developer-ready tasks, asana-friendly epics, github issue drafts, implementation sequencing, dependencies, estimates or risk-based task planning.
---

# LightSpeed Task Breakdown Planner

## Purpose

Turn a PRD, Figma-to-WordPress technical brief, client brief or repo/context notes into a practical delivery plan for LightSpeed WordPress projects.

This skill is focused on planning, not implementation. It should generate epics, tasks, GitHub issue drafts, dependencies, QA checks, acceptance criteria and implementation waves for WordPress block theme, block plugin and design-system-led builds.

## Core rule

Do not invent scope. If the PRD or technical brief is incomplete, create a safe task outline and list the missing decisions, blockers and assumptions.

Do not create GitHub issues directly unless the user explicitly asks and the relevant connector/tool action is available. Default to Markdown issue drafts for human review.

## Inputs to accept

Accept any combination of:

- PRD
- Figma-to-WordPress technical brief
- Figma design system notes
- Figma prototype notes or screenshots
- WordPress repo notes
- client brief
- page/template scope
- block/plugin requirements
- launch QA plan
- existing GitHub issues
- Asana project notes
- acceptance criteria
- open questions

## Supported project types

Support:

- WordPress block theme builds
- block theme plus custom block plugin builds
- block plugin feature work
- classic or hybrid theme conversion
- WooCommerce block theme projects
- publishing/content-heavy websites
- tour operator/plugin-led projects
- AI-readiness and governance-enabled websites
- Figma design-system to WordPress implementations

## Workflow

1. Identify the requested planning depth:
   - epics only
   - GitHub issue drafts
   - implementation plan
   - dependency map
   - full project pack
2. Review available source material.
3. Identify delivery workstreams.
4. Break work into epics, features, tasks and subtasks.
5. Map dependencies and blockers.
6. Choose or ask for an estimation mode when unclear:
   - t-shirt size
   - hours
   - sprint fit
   - complexity/risk only
7. Generate acceptance criteria appropriate to the task type.
8. Add QA checks for each task.
9. Add labels, milestone suggestions and owner-role suggestions.
10. Produce implementation waves and launch gates.
11. Separate client-facing summary from internal LightSpeed notes.

## Required output sections

For a full task plan, include:

- Client-facing delivery summary
- Internal LightSpeed implementation notes
- Assumptions and open questions
- Workstream map
- Epic map
- Dependency map
- Implementation waves
- GitHub issue draft index
- Developer-ready issue drafts
- QA and acceptance-test map
- Launch and specialist-skill routing notes
- Risks and blockers
- Recommended next step

## Task quality rules

Each developer-ready task should include:

- title
- context
- objective
- scope
- out of scope
- implementation notes
- acceptance criteria
- QA checks
- dependencies
- risks
- estimate or complexity
- labels
- milestone or wave
- owner role

## Acceptance criteria style

Use a mix depending on task type:

- checklist for implementation tasks
- Given/When/Then for user-facing behaviour
- QA test steps for launch or regression work
- technical checks for WordPress, PHP, JS, blocks, theme.json and build tooling

## WordPress defaults

Plan tasks around LightSpeed defaults:

- WordPress Coding Standards
- block-first implementation
- theme.json design tokens
- minimal plugin dependencies
- accessibility checks
- performance budgets
- PHPCS/ESLint/Playwright where relevant
- editor experience, not only frontend output
- reusable patterns and maintainable templates
- clear separation between theme and plugin responsibilities

## Reference loading

Use these references as needed:

- `references/task-breakdown-workflow.md` for the planning workflow.
- `references/workstream-model.md` for standard LightSpeed workstreams.
- `references/issue-draft-rules.md` for GitHub issue formatting.
- `references/acceptance-criteria.md` for criteria patterns.
- `references/dependency-and-wave-planning.md` for sequencing.
- `references/estimation-models.md` for sizing options.
- `references/wordpress-task-rules.md` for WordPress-specific task rules.
- `references/qa-mapping.md` for QA and launch checks.

## Output format

Use Markdown. For project packs, create numbered files and an index. Keep issue drafts copy-pasteable into GitHub.

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
