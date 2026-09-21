# Workflow Reference

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main Branch Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate PR Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges: Documentation Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges: Health Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges: Workflow Inventory Audit-OK-success.svg)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
[![workflow-lint](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml)
<!-- BADGES-END -->

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

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
