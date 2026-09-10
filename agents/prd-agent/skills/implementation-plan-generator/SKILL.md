---
name: lightspeed-implementation-plan-generator
description: create developer-ready implementation plans for lightspeed figma design system to wordpress block theme, block plugin, woocommerce, publishing, tourism and hybrid-theme projects. use when the user has an approved prd, technical brief, task breakdown, github issue drafts or launch plan and needs implementation sequencing, workstream plans, dependency notes, branch strategy, testing approach, acceptance mapping, risk controls or handoff notes before coding begins.
---

# LightSpeed Implementation Plan Generator

## Purpose

Turn approved PRDs, Figma-to-WordPress technical briefs, task breakdowns and GitHub issue drafts into a practical implementation plan for LightSpeed WordPress delivery teams.

This skill sits after PRD/task review and before implementation starts. It should not write production code. It should produce a clear plan that developers, designers, QA and project leads can follow.

## Core rule

Do not invent implementation details that are not supported by the PRD, technical brief, repo notes or approved task pack.

If a technical decision is missing, flag it as an open decision instead of assuming a solution.

## Inputs to accept

Accept any combination of:

- approved PRD
- Figma-to-WordPress technical brief
- task breakdown
- GitHub issue drafts
- project memory bank
- launch QA plan
- repo structure notes
- Figma design system notes
- theme.json/token map
- block/plugin requirements
- constraints, deadlines or sprint goals

## Supported project types

Support LightSpeed projects involving:

- custom WordPress block themes
- block theme plus custom block plugin
- WooCommerce block themes
- publishing or content-heavy platforms
- tourism/tour-operator plugin-led sites
- hybrid theme conversions
- Figma design systems implemented through theme.json, block patterns and custom blocks

## Workflow

1. Confirm the implementation scope and approved inputs.
2. Identify build type and active repos.
3. Split work into implementation workstreams.
4. Sequence the work into waves or sprints.
5. Map dependencies and blockers.
6. Define branch, PR and review strategy.
7. Define testing approach and acceptance mapping.
8. Identify risks, unknowns and decision points.
9. Create developer handoff notes.
10. Recommend next specialist skills or launch workflows.

## Standard workstreams

Use relevant workstreams only:

- Discovery and technical setup
- Figma variables to theme.json
- Block theme foundations
- Block plugin foundations
- Templates and template parts
- Patterns and reusable sections
- Custom blocks and block variations
- WooCommerce templates and blocks
- Content model, CPTs, taxonomies and fields
- Editor experience and governance
- Accessibility and responsive behaviour
- Performance and asset loading
- Forms, conversion and tracking
- Schema, redirects and launch SEO
- QA, launch gates and post-launch monitoring

## Required output sections

For implementation plans, include:

- Value, risk and next step
- Implementation context
- Inputs reviewed
- Build type and repo assumptions
- Implementation workstreams
- Implementation waves or sprint plan
- Dependency map
- Branch and PR strategy
- Testing and QA approach
- Acceptance criteria mapping
- Open decisions and blockers
- Risk register
- Handoff notes by role
- Specialist skill routing
- Internal LightSpeed notes

## Output style

Use UK English. Keep the tone practical, direct and implementation-ready.

Separate:

- client-facing summary
- internal LightSpeed implementation notes
- developer handoff details
- risks and assumptions
- open decisions

Use Markdown tables where they make planning easier.

## Reference loading

Use these references as needed:

- `references/implementation-workflow.md` for the full planning process.
- `references/workstream-model.md` for standard LightSpeed workstreams.
- `references/wave-planning.md` for sequencing and sprint/wave planning.
- `references/branch-pr-strategy.md` for GitHub and review flow.
- `references/testing-and-qa.md` for test planning.
- `references/risk-and-decision-rules.md` for blockers and decisions.
- `references/wordpress-implementation-rules.md` for WordPress delivery standards.

## Quality bar

A good implementation plan should let the team start work without re-reading every source document, while still linking back to decisions, tasks and acceptance criteria.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
