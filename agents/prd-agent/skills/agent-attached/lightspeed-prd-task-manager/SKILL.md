---
name: lightspeed-prd-task-manager
description: create prds, figma-to-wordpress technical briefs, implementation plans, github issue drafts, task breakdowns, qa plans, launch gates and project memory packs for lightspeed figma design system to wordpress block theme, block plugin, woocommerce, publishing, tourism and hybrid theme projects. use when the user asks for prd planning, task planning, project packs, github issue drafts, figma-to-wordpress requirements, block theme/plugin delivery planning, acceptance criteria, implementation waves, memory bank files or launch qa planning for wordpress projects.
---

# LightSpeed PRD Task Manager

## Purpose

Turn a client brief, Figma design system, Figma prototype, existing WordPress site, GitHub repository, GitHub issue or mixed project notes into a structured LightSpeed delivery pack.

This skill is for Figma design-system-led WordPress projects, including:

- block theme only builds
- block theme plus custom block plugin builds
- classic or hybrid theme conversion
- WooCommerce block theme builds
- publishing and content-heavy websites
- tour operator projects using LightSpeed's Tour Operator plugin

## Core stance

Plan before implementation. Generate Markdown drafts for review before creating GitHub issues or changing source files.

Do not invent implementation details, estimates, repository structure, claims, content, timelines or ownership where evidence is missing. Flag assumptions and open questions.

## Supported starting points

Accept any combination of:

- client brief
- Figma design system URL
- Figma page/frame URL
- Figma Make prototype URL
- Figma variables export
- screenshots
- manual design notes
- current live website URL
- staging/dev website URL
- GitHub repository URL
- GitHub issue or issue list
- existing PRD or task notes
- content collection outputs
- launch QA notes

## Output modes

Ask or infer which output is needed:

1. PRD only
2. PRD plus technical brief
3. PRD plus GitHub issue drafts
4. PRD plus implementation plan
5. Full project pack: PRD, technical brief, tasks, issue drafts, QA and launch plan

## Default workflow

1. Confirm project context and output mode.
2. Identify available evidence and missing inputs.
3. Classify build type and WordPress architecture.
4. Produce or update the PRD.
5. Produce a Figma-to-WordPress technical brief.
6. Produce epics, tasks, dependencies and implementation waves.
7. Draft GitHub issue Markdown for manual review.
8. Produce QA and launch planning notes.
9. Create or update memory-bank files.
10. Recommend specialist skills for deeper work.

## Required approval gates

Pause or clearly mark review required:

- before finalising the PRD
- before converting drafts into GitHub issues
- before assigning priorities
- before implementation planning where scope is uncertain
- before launch QA
- before changing source files

## Task planning rules

Support multiple levels of granularity:

- big epics suitable for Asana
- GitHub issues per feature
- developer-ready tasks under about one day
- atomic tasks under about two to four hours
- DAG or wave-based plans with dependencies

Use a mixed acceptance criteria model based on task type:

- checklist format for implementation tasks
- Given/When/Then for behavioural requirements
- QA test steps for verification tasks
- developer-focused technical checks for code tasks

## Estimation rules

Ask which estimation model to use when unclear:

- no estimates
- T-shirt sizes
- hours
- sprint fit
- complexity and risk only

For client work, default to hours if the user asks for costing. For internal work, default to complexity/risk unless the user requests hours.

## LightSpeed WordPress defaults

Apply these defaults unless the user says otherwise:

- WordPress Coding Standards
- block-first implementation
- theme.json tokens
- minimal plugin dependencies
- editor-friendly patterns and blocks
- accessibility checks
- performance budgets
- PHPCS, ESLint and Playwright where relevant
- no page-builder dependency unless explicitly required
- UK English
- practical, modular, maintainable recommendations

## Expected LightSpeed repository structures

Use these as starting assumptions, but detect and adapt when actual repositories are supplied.

Theme:

```text
/wp-content/themes/client-theme/
├── style.css
├── theme.json
├── functions.php
├── docs/
├── languages/
├── patterns/
├── templates/
├── parts/
├── styles/
├── inc/
├── src/
└── build/
```

Block plugin:

```text
/wp-content/plugins/client-blocks/
├── languages/
├── docs/
├── inc/
├── plugin/
├── scf-json/
├── templates/
├── src/
├── src/blocks/
├── build/
├── plugin-name.php
└── functions.php
```

## Figma-to-WordPress mapping requirements

When Figma evidence exists, map:

- Figma variables to theme.json tokens
- colour tokens
- typography tokens
- spacing tokens
- Figma components to WordPress blocks
- Figma sections to WordPress patterns
- Figma pages to WordPress templates
- light/dark mode states
- mobile states
- focus states
- accessibility states

## Specialist skill routing

Recommend these specialist skills when deeper output is needed:

- lightspeed-figma-wordpress-parity-auditor
- lightspeed-launch-qa-planner
- lightspeed-launch-readiness-auditor
- lightspeed-redirect-map-planner
- lightspeed-claim-register-auditor
- lightspeed-ga4-conversion-tracking-planner
- lightspeed-schema-and-ai-discoverability-planner
- lightspeed-policy-page-generator
- lightspeed-faq-and-chatbot-source-curator
- lightspeed-website-content-generator

## Required output standard

Every major output should include:

- client-facing summary
- internal LightSpeed implementation notes
- assumptions
- open questions
- risks and blockers
- recommended next step

For project packs, create numbered Markdown files and a README-style index.

## Reference loading

Use these references as needed:

- `references/agent-spec.md` for the full agent operating model.
- `references/prd-template.md` for PRD structure.
- `references/figma-wordpress-technical-brief.md` for design-system to WordPress planning.
- `references/task-breakdown-rules.md` for epics, tasks, dependencies and waves.
- `references/github-issue-drafts.md` for issue formatting.
- `references/acceptance-criteria.md` for acceptance criteria styles.
- `references/memory-bank.md` for project memory files.
- `references/qa-and-launch-routing.md` for launch and specialist skill routing.
- `references/wordpress-standards.md` for WordPress delivery standards.

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
