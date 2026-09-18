# Workflow Reference

## Document Jobs

### Template

Use when the user wants a reusable structure for future projects or recurring documentation.

Output should include:

- recommended title;
- purpose;
- when to use;
- section prompts;
- optional examples;
- completion checklist.

Keep prompts short and practical. Do not overfill the template with guidance that makes it harder to reuse.

### Draft Document

Use when the user wants a ready-to-paste Linear document for a specific project.

Output should include:

- confirmed facts;
- assumptions;
- recommendations;
- open questions;
- action-ready sections.

Remove template placeholder language.

### Audit

Use when the user asks whether a template or document is effective.

Output should include:

- what is working;
- issues or gaps;
- highest-priority fixes;
- risks and assumptions;
- suggested revised structure.

### Rewrite

Use when the user provides a messy document and wants a cleaner version.

Output should include:

- rewritten document;
- short change notes;
- any missing context that still matters.

## Project Stage Mapping

Discovery:

- problem statement;
- stakeholders;
- source inventory;
- assumptions;
- discovery questions;
- decision needed.

Kickoff:

- goals;
- scope;
- non-goals;
- owners;
- milestones;
- risks;
- working agreements;
- approval gates.

Planning:

- workstreams;
- dependencies;
- milestones;
- acceptance criteria;
- open questions;
- ready-for-development checklist.

Implementation:

- delivery plan;
- owner map;
- issue links;
- dependency tracker;
- change-control notes;
- progress cadence.

QA and Launch:

- readiness criteria;
- test areas;
- launch blockers;
- approvals;
- rollback or support notes;
- handoff checklist.

Handoff and Maintenance:

- what shipped;
- known limitations;
- support responsibilities;
- documentation links;
- follow-up work;
- decision history.

Retrospective:

- outcome against goals;
- what worked;
- friction;
- unresolved risks;
- reusable improvements;
- follow-up issues.

## Evidence Handling

Use these labels when helpful:

- `Confirmed`: present in the provided prompt or retrieved source.
- `Assumption`: likely but not directly confirmed.
- `Recommendation`: suggested improvement based on the workflow.
- `Open question`: missing information needed for confidence.

Do not turn assumptions into commitments.

## Linear Write Guard

If the user asks to create or modify a Linear document, project, or issue:

1. Draft the exact proposed content.
2. Summarize affected records.
3. State the reason for the write.
4. Ask for confirmation unless the user already explicitly authorized the write.
