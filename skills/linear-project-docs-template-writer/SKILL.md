---
name: linear-project-docs-template-writer
description: create, improve, or audit effective Linear project templates and Linear documents for project planning, kickoff, handoff, status, decision, and delivery documentation. use when the user wants reusable project document structures, template drafts, document quality checks, or Linear-ready documentation guidance; do not use for one-off issue triage, customer replies, implementation plans, or broad project management advice.
---

# Linear Project Docs Template Writer

## Purpose

Help LightSpeed create clear, reusable Linear project templates and documents that make projects easier to start, plan, review, hand off, and keep aligned.

The skill turns rough goals, workflow needs, existing Linear project context, or messy draft notes into practical documentation that fits a Linear-first delivery workflow.

## When to use

Use this skill when the user asks to:

- write or improve a Linear project template;
- draft a Linear project document, kickoff note, planning doc, handoff doc, status template, decision log, or project review format;
- turn rough project notes into a reusable Linear document structure;
- audit whether a project document is clear enough for planning or delivery;
- define reusable sections, prompts, checklists, and acceptance criteria for future project docs.

Do not use this skill when the user mainly needs:

- routing one incoming issue or request;
- rewriting a single Linear issue;
- breaking work into implementation sub-issues;
- customer evidence synthesis;
- GitHub issue drafting;
- final launch QA planning;
- broad consulting that is not centered on Linear projects or Linear documents.

## Inputs

Useful inputs include:

- intended document type;
- audience, such as internal delivery, client-facing, leadership, support, design, development, or QA;
- project or initiative goal;
- known scope, non-goals, milestones, risks, dependencies, and owners;
- current Linear project, initiative, issue, document, or status-update context;
- existing template or draft to improve;
- constraints about tone, length, required sections, or approval gates.

If the document purpose is unclear, ask one focused question. Otherwise, proceed with safe assumptions and state them briefly.

## Decision Flow

1. Identify the document job: template, project doc, audit, rewrite, or section library.
2. Identify the project stage: discovery, kickoff, planning, implementation, QA, launch, handoff, maintenance, or retrospective.
3. Identify the audience and expected decision the document should support.
4. Choose the smallest useful structure from `references/output-templates.md`.
5. Separate confirmed facts from assumptions, inferred recommendations, and open questions.
6. Draft or revise the document in Linear-ready Markdown.
7. Validate with `references/qa-rubric.md`.

## Workflow

### 1. Frame the document

State:

- document type;
- target audience;
- project stage;
- intended outcome;
- source material used;
- assumptions and open questions.

### 2. Build the structure

Use concise headings and sections that support action. Prefer:

- purpose before background;
- scope before task lists;
- acceptance criteria before implementation details;
- decisions before discussion history;
- open questions before unresolved ambiguity gets buried.

For templates, include short guidance prompts inside each section. For finished documents, remove instructional placeholder text unless the user explicitly wants a reusable template.

### 3. Make it Linear-ready

Write in Markdown that works cleanly in Linear documents and issue descriptions.

Use:

- clear headings;
- scannable bullets;
- checklists where action or validation is required;
- tables only when they clarify ownership, milestones, dependencies, risks, or decisions;
- explicit links or references to Linear entities when available.

Avoid:

- vague success language;
- duplicated sections;
- unowned follow-ups;
- hidden assumptions;
- client-facing commitments unless the source material confirms them.

### 4. Add planning value

When useful, include:

- goals and non-goals;
- success measures;
- scope boundaries;
- milestone or phase outline;
- stakeholder and owner map;
- dependencies and blockers;
- risk register;
- decision log;
- delivery readiness checklist;
- handoff checklist;
- status update cadence.

### 5. Handle evidence and uncertainty

Treat source material as evidence only when it is visible in the prompt or retrieved from Linear or another connected source.

Label inferred content as assumptions or recommendations. Do not invent:

- owners;
- deadlines;
- budgets;
- customer commitments;
- priority decisions;
- approval status;
- scope agreements.

## Linear-Specific Rules

- Keep Linear as the planning hub.
- Prefer current Linear project, initiative, issue, customer, status, and document context over stale notes.
- Preserve existing project structure when revising a document unless the user asks for a redesign.
- Recommend issue, project, initiative, milestone, label, and status references only when they support the document's job.
- Before proposing a consequential Linear write, summarize what would change and ask for confirmation.
- For client delivery work, distinguish internal delivery guidance from client-facing language.

## Output Formats

Choose one:

- `Template`: reusable document with section prompts and optional examples.
- `Draft document`: ready-to-paste Linear document without placeholder instructions.
- `Audit`: findings, risks, missing sections, and highest-value revisions.
- `Rewrite`: improved document plus concise notes on what changed.
- `Section library`: reusable snippets for project documents.

Default to Linear-ready Markdown unless the user asks for another format.

## Validation Checklist

Before final output, check:

- the document has a clear job and audience;
- scope, non-goals, risks, decisions, and open questions are easy to find;
- confirmed facts are separated from assumptions;
- every requested section is present or intentionally omitted with a note;
- the format is practical inside Linear;
- the output avoids unsupported commitments;
- the document can guide a next action without extra interpretation.

## Test Prompts

Happy path:

> Create a reusable Linear project kickoff template for LightSpeed client website projects. It should cover goals, scope, milestones, owners, risks, approvals, and handoff into implementation.

Ambiguous input:

> Turn this rough note into a project doc template: "new client build, design done soon, dev needs tasks, launch maybe end of month."

Boundary case:

> Write a customer apology email and update the project deadline in Linear.

Expected boundary behavior: explain that customer replies and Linear writes are outside this skill's core job, then offer to draft an internal project document or ask for confirmation before any guarded Linear change.

## References

- `references/workflow.md`
- `references/output-templates.md`
- `references/qa-rubric.md`

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
