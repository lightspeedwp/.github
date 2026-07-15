# Prompt Starters

Adapt these prompts after selecting the recommended route.

## Evidence review

```text
Use the lightspeed-project-researcher skill to review the supplied project sources and produce a PRD-ready evidence summary.

Known context:
[paste project snapshot]

Sources to review:
[paste source inventory]

Please separate confirmed evidence, draft/unreviewed sources, assumptions, blockers and open questions.
```

## Intake evidence normalisation

```text
Use the project-intake-evidence-normaliser skill to clean this mixed project evidence into a structured intake record.

Inputs:
[paste notes, links and files]

Please produce confirmed sources, unconfirmed sources, exclusions, structured evidence notes and missing information.
```

## PRD

```text
Use the lightspeed-prd-generator skill to create a PRD from this approved intake pack.

Project snapshot:
[paste snapshot]

Confirmed sources:
[paste confirmed sources]

Known gaps and assumptions:
[paste gaps]

Please include goals, non-goals, personas, user stories, acceptance criteria, success metrics, risks, assumptions and open questions.
```

## Figma-to-WordPress technical brief

```text
Use the lightspeed-figma-wordpress-technical-brief skill to turn this approved design and WordPress evidence into a developer-ready technical brief.

Project context:
[paste snapshot]

Figma/design evidence:
[paste design sources]

Repo/theme/plugin evidence:
[paste technical sources]

Please define theme/plugin boundaries, templates, patterns, tokens, block/plugin requirements, risks and handoff notes.
```

## Task breakdown

```text
Use the lightspeed-task-breakdown-planner skill to turn the approved PRD and technical brief into implementation tasks.

Approved PRD:
[paste/link]

Approved technical brief:
[paste/link]

Planning preferences:
[paste estimation model and delivery constraints]

Please produce epics, tasks, dependencies, acceptance criteria, QA notes and recommended delivery waves.
```

## GitHub issue drafts

```text
Use the lightspeed-github-issue-drafter skill to convert these approved tasks or QA findings into GitHub-ready issue drafts.

Approved tasks/findings:
[paste]

Repo context:
[paste repo]

Please produce markdown issue bodies with labels, milestones, dependencies, acceptance criteria and QA notes. Do not create issues automatically.
```

## Launch QA planning

```text
Use the lightspeed-launch-qa-planner skill to plan final launch QA for this LightSpeed WordPress project.

Project context:
[paste snapshot]

Implementation status:
[paste status]

Known risks:
[paste risks]

Please produce a page/template QA matrix, responsive/accessibility checks, conversion tracking checks, launch gates and go/no-go framework.
```

## AI readiness and chatbot route

```text
Use the lightspeed-ai-readiness-router skill to route this AI-readiness or chatbot project into the right readiness, governance, content collection and chatbot planning workflow.

Client/project context:
[paste snapshot]

Available sources:
[paste source inventory]

Known risks:
[paste governance, content or chatbot risks]

Please recommend the next workflow and produce the appropriate project pack sections.
```

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
