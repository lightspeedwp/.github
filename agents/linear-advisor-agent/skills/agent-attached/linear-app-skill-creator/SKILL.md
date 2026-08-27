---
name: linear-app-skill-creator
description: the linear-app-skill-creator skill helps users efficiently create and maintain reusable workflows for Linear-related tasks such as issue triage, project planning, and customer analysis. use this skill when you need to automate or enhance processes, transform existing workflows, or generate documentation in a streamlined manner.
---

# Linear App Skill Creator

## Purpose

Create production-ready ChatGPT skills for Linear-centred work.

Use this skill for reusable workflows such as:

- issue triage, backlog hygiene, and enrichment;
- project, initiative, and cycle planning;
- customer-request analysis and signal extraction;
- status updates, roadmap communication, and planning reviews;
- documentation, comments, handoffs, and workflow governance; and
- conversion of older document-style or script-style workflows into modern reusable skill packages.

## Operating Principles

1. Build reusable workflow systems, not long advice documents.
2. Keep `SKILL.md` compact but complete enough to stand alone.
3. Make the trigger conditions clear in the frontmatter description.
4. Use scripts only for deterministic or fragile work. Do not script tasks the model can reliably do from instructions.
5. Include realistic test prompts when the skill affects planning quality, workflow routing, customer interpretation, prioritisation, or status communication.
6. Return complete updated skills as `skill.zip` when the user wants a usable package.
7. Preserve useful structure and workflow logic when updating an existing skill unless it is invalid or unsafe.

## Fast Decision Flow

1. Determine request type: new skill, existing skill update, skill audit, skill conversion, or conversational question.
2. Determine workflow domain: issue triage, planning, status updates, customer analysis, documentation, coordination, or general maintenance.
3. Determine evidence needed: provided docs, exports, screenshots, links, briefs, authoritative Linear sources, or connected-app context.

## Creation Workflow

### 1. Capture intent

Ask only the minimum questions needed. If the user already provided enough detail, proceed with reasonable defaults.

Clarify only when needed:

- expected input;
- expected output;
- required sources or apps;
- domain boundaries; and
- quality bar.

### 2. Model the workflow

Convert the request into a repeatable process.

Identify:

- trigger phrase or task type;
- required inputs;
- required tools or files;
- key decisions;
- output format;
- validation checks; and
- failure modes or escalation points.

Prefer a workflow-based skill when the process has stages, gates, or handoffs. Prefer a reference-guided skill when the skill mainly enforces standards, conventions, or decision rules.

### 3. Plan the skill contents

Use this structure unless there is a clear reason not to:

- `SKILL.md`
- `agents/openai.yaml`
- `references/workflow.md`
- `references/output-templates.md`
- `references/qa-rubric.md`
- optional `scripts/`
- optional `assets/`

Do not include empty placeholder files.

### 4. Draft `SKILL.md`

Use this order:

1. frontmatter with `name` and `description`;
2. purpose;
3. decision flow;
4. workflow steps;
5. domain-specific rules;
6. tool and source guidance;
7. output formats;
8. validation and packaging steps; and
9. references or embedded examples when useful.

Frontmatter rules:

- `name` must be lowercase hyphen-case;
- `description` should be lowercase, specific, and trigger-focused;
- include positive trigger scenarios and enough boundaries to avoid over-triggering; and
- keep the description concise but complete.

### 5. Add Linear-specific guidance

For Linear-centred skills, include:

- target entities such as issues, projects, initiatives, cycles, documents, comments, customers, customer needs, or status updates;
- workflow stages such as triage, enrichment, prioritisation, summarisation, planning, routing, auditing, or drafting;
- how teams, labels, statuses, priorities, cycles, projects, and assignees affect decisions when relevant;
- what must be treated as evidence versus interpretation; and
- where human review is needed before changing scope, commitments, ownership, or customer-facing language.

Useful distinctions include signal vs noise, urgent vs important, proposal vs confirmed fact, summarisation vs recommendation, and read-only analysis vs write-oriented workflows.

### 6. Add test prompts and rubrics

For production skills, include at least three test prompts:

1. a happy-path prompt using realistic source material;
2. an ambiguous or incomplete prompt that should trigger safe defaults or one focused question; and
3. a boundary prompt the skill should decline, defer, or route elsewhere.

For important skills, also note what a normal ChatGPT response would likely miss, what the skill should improve, and what would count as a failed output.

Score outputs from 1 to 5 for trigger fit, input handling, workflow accuracy, output structure, practicality, risk handling, and reusability.

### 7. Validate and package

Before returning a skill package:

1. confirm `SKILL.md` exists;
2. confirm frontmatter includes `name` and `description`;
3. confirm the folder name matches the frontmatter name when returning a package;
4. remove placeholders and package noise;
5. validate the instructions, trigger wording, boundaries, and test prompts; and
6. package as exactly `skill.zip` when the user expects a usable skill.

## Updating Existing Skills

When updating a skill:

1. inspect the current structure first;
2. preserve useful references, scripts, assets, and metadata when they still serve the workflow;
3. apply the requested changes directly;
4. improve trigger descriptions only when it helps invocation accuracy;
5. add eval prompts when the skill is important or likely to overlap with other skills; and
6. tell the user what changed and any assumptions made.

Do not return only a patch when the user expects a usable skill.

## Output Style for Skill Drafts

When presenting a draft before packaging, prefer this structure:

```markdown
## Skill summary
- Purpose:
- Main triggers:
- Inputs:
- Outputs:
- Sources/tools:
- Domain boundaries:
- Risks:
- Safe defaults:

## Proposed files
[file tree]

## Notes
- Assumptions:
- Validation focus:
- Open questions:
```

For reusable skill files or templates, use separate copy-paste-ready code blocks.

## Audit and trigger rubric

For skill audits, check:

- whether the workflow matches the intended Linear entities and outcomes;
- whether the trigger description is specific enough to avoid over-triggering;
- whether confirmed facts are separated from inference;
- whether outputs are practical, reusable, and low-risk; and
- whether bloated or duplicated guidance should be removed.

A good trigger description should answer:

1. what the skill does;
2. when it should be used;
3. which Linear entities or workflow types trigger it;
4. which outputs it creates; and
5. which adjacent requests should not trigger it.

## Safety

Do not invent Linear workspace data, customer evidence, planning decisions, status facts, or ownership agreements.

Do not claim a workflow is production-ready unless the inputs and validation support that conclusion.

When information is incomplete, make the most reusable safe assumption you can, state it briefly, and continue.

When converting from another environment, remove stale references to setup or tooling that do not belong in the final ChatGPT skill unless the user explicitly asks to keep them.

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
