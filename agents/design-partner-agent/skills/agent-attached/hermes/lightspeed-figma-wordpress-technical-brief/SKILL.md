---
name: lightspeed-figma-wordpress-technical-brief
description: This skill transforms Figma design-system insights into actionable WordPress technical briefs, perfect for preparing project handoffs. Use it when you have Figma assets and need detailed architecture notes or developer-ready documentation before breaking down tasks or drafting GitHub issues.
---

# LightSpeed Figma WordPress Technical Brief

## Purpose

Turn Figma design-system intent into a practical WordPress technical brief for LightSpeed projects.

Use this skill after or alongside `lightspeed-prd-task-manager` when a project needs developer-ready architecture notes before task breakdown or GitHub issue drafting.

## Core rule

Do not invent implementation details. If Figma, repo or WordPress evidence is missing, state the assumption and add it to open questions or evidence required.

## Inputs to accept

Accept any combination of:

- Figma design system URL
- Figma page, frame or component URL
- Figma variables export
- Figma Make prototype URL
- screenshots
- manual design notes
- client brief or PRD
- current live site URL
- staging/dev site URL
- WordPress theme repo
- WordPress plugin repo
- `theme.json`
- block/plugin source tree notes
- content model notes
- existing page/template list

## Supported build types

Support:

- block theme only
- block theme plus custom block plugin
- block plugin only
- classic or hybrid theme conversion
- WooCommerce block theme
- publishing/content-heavy sites
- tour operator/plugin-led sites using LightSpeed's Tour Operator plugin

## Workflow

1. Confirm project context and build type.
2. Identify available Figma, WordPress, repo and content evidence.
3. Map Figma variables to `theme.json` token requirements.
4. Map Figma components to WordPress core blocks, block variations or custom blocks.
5. Map Figma sections to WordPress patterns and template parts.
6. Map Figma pages/screens to WordPress templates.
7. Define block theme requirements.
8. Define block plugin requirements where custom blocks or data-driven UI are needed.
9. Define content model, post type, taxonomy and custom field implications.
10. Define editor experience requirements.
11. Define accessibility, responsive and light/dark mode requirements.
12. Define performance, asset and dependency constraints.
13. Add implementation risks, assumptions and open questions.
14. Output a technical brief suitable for developer handoff and GitHub issue planning.

## Required output sections

For a full technical brief, include:

- Value, risk and next step
- Project context
- Evidence reviewed
- Build type decision
- Figma-to-WordPress mapping summary
- `theme.json` and token requirements
- Template and template-part requirements
- Pattern library requirements
- Component-to-block mapping
- Custom block/plugin requirements
- Content model and data requirements
- Editor experience requirements
- Accessibility and responsive requirements
- Light/dark mode requirements
- Performance and dependency notes
- Testing and QA notes
- GitHub issue seed list
- Open questions
- Internal LightSpeed notes

## Reference loading

Use these references as needed:

- `references/technical-brief-workflow.md` for the end-to-end workflow.
- `references/figma-evidence-intake.md` for Figma input handling.
- `references/theme-json-token-mapping.md` for token mapping rules.
- `references/component-to-block-mapping.md` for mapping design components to blocks.
- `references/pattern-template-mapping.md` for templates, parts and patterns.
- `references/block-theme-requirements.md` for block theme rules.
- `references/block-plugin-requirements.md` for custom block/plugin rules.
- `references/editor-experience.md` for editor governance and usability.
- `references/qa-handoff.md` for QA and downstream skill routing.

## Specialist skill routing

Recommend specialist skills when needed:

- Use `lightspeed-figma-wordpress-parity-auditor` for parity audit after implementation exists.
- Use `lightspeed-launch-qa-planner` for final QA planning.
- Use `lightspeed-prd-task-manager` for PRD, tasks and GitHub issue drafts.
- Use `lightspeed-claim-register-auditor` if proof or marketing claims appear in the brief.

## Quality standard

Use UK English. Be practical, specific and developer-friendly. Prioritise maintainable WordPress architecture, block-first editing, accessibility, performance, minimal dependency load and clear handoff notes.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
