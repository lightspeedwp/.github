---
name: lightspeed-project-memory-manager
description: create and maintain project memory banks for lightspeed figma design system to wordpress block theme, block plugin, woocommerce, publishing, tourism and hybrid-theme projects. use when the user needs projectbrief, product context, system patterns, tech context, active context, progress logs, task indexes, decision logs, assumption registers or handoff-ready memory packs from prds, technical briefs, github issue drafts, qa plans or launch notes.
---

# LightSpeed Project Memory Manager

## Purpose

Create and maintain a lightweight project memory bank for LightSpeed WordPress projects so future chats, agents, developers and reviewers can understand project context without re-reading every source file.

Use this after or alongside PRD creation, Figma-to-WordPress technical briefs, task breakdowns, GitHub issue drafting, QA planning and launch readiness work.

## Core rule

Do not invent decisions, owners, repo paths, deadlines, estimates or implementation status. If information is missing, mark it as `Unknown`, `Assumption`, or `Needs Confirmation`.

## Inputs to accept

Accept any combination of:

- client brief
- PRD
- Figma design system notes
- Figma-to-WordPress technical brief
- WordPress repo notes
- task breakdown
- GitHub issue drafts
- QA plan
- launch checklist
- content collection outputs
- governance notes
- meeting notes
- current progress updates

## Outputs

Generate or update:

- `projectbrief.md`
- `productContext.md`
- `systemPatterns.md`
- `techContext.md`
- `activeContext.md`
- `progress.md`
- `tasks/_index.md`
- `tasks/task-[id].md`
- `decisions/decision-log.md`
- `risks/assumptions-and-risks.md`
- `handoff/handoff-summary.md`

## Workflow

1. Identify project type and stage.
2. Identify available source material.
3. Extract stable facts, decisions, constraints and open questions.
4. Separate confirmed facts from assumptions.
5. Create memory files using the standard structure.
6. Create or update the task index from PRD/task/issue material.
7. Create a decision log and risk register.
8. Add active context: what is being worked on now, next actions and blockers.
9. Mark stale, superseded or unknown items clearly.
10. Output Markdown files or a downloadable memory pack when requested.

## Standard memory structure

Use this folder structure by default:

```text
project-memory/
├── README.md
├── projectbrief.md
├── productContext.md
├── systemPatterns.md
├── techContext.md
├── activeContext.md
├── progress.md
├── tasks/
│   ├── _index.md
│   └── task-001.md
├── decisions/
│   └── decision-log.md
├── risks/
│   └── assumptions-and-risks.md
└── handoff/
    └── handoff-summary.md
```

## File responsibilities

- `projectbrief.md`: concise project summary, goals, scope, stakeholders and success criteria.
- `productContext.md`: audience, user needs, business goals, content/UX context and constraints.
- `systemPatterns.md`: architecture patterns, Figma-to-WordPress mapping, theme/plugin boundaries and design-system rules.
- `techContext.md`: repos, environments, build type, tooling, standards, dependencies and test approach.
- `activeContext.md`: current state, immediate priorities, recent decisions, blockers and next actions.
- `progress.md`: completed, in progress, pending, blocked and changed items.
- `tasks/_index.md`: task list, status, owner role, dependencies, links and estimate/complexity.
- `decisions/decision-log.md`: dated decisions, rationale, owner and review status.
- `risks/assumptions-and-risks.md`: assumptions, risks, mitigations and confirmation needs.
- `handoff/handoff-summary.md`: short summary for a new chat, developer or reviewer.

## LightSpeed defaults

For Figma-to-WordPress projects, always track:

- Figma design system URL
- Figma prototype URL
- dev/staging URL
- live URL
- theme repo
- block plugin repo
- build type
- `theme.json` token approach
- custom block/plugin boundaries
- template and pattern scope
- accessibility requirements
- performance expectations
- QA and launch gates
- specialist skill routing

## Status labels

Use these status labels:

- Confirmed
- Assumption
- Needs Confirmation
- In Progress
- Blocked
- Superseded
- Done
- Deferred

## Required output format

When generating a memory pack, include:

1. README with source list and update instructions.
2. Core memory files.
3. Task index.
4. Decision log.
5. Risks and assumptions.
6. Handoff summary.
7. Internal LightSpeed notes.

## Review notes

Every memory pack should state:

- source material reviewed
- missing inputs
- key assumptions
- next recommended update
- whether the pack is safe to use for a fresh chat handoff

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
