# Skill Routing Guide

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

## Purpose

This guide defines the routing boundaries between the attached Linear-focused skills so the agent chooses the narrowest useful path, avoids unnecessary overlap, and stays consistent across future runs.

## Routing Order

Use this decision order:

1. **No skill** when a direct answer is enough.
2. **Onboarding** only when reusable-output defaults are materially missing.
3. **One specialist skill** when the request clearly fits a narrow job.
4. **Creator** when the request is broader packaging, skill creation, Builder-output work, or a mixed task that does not fit one specialist cleanly.
5. **Formatter** only when the substance already exists and the remaining need is presentation quality.

## Direct Answer Boundary

Do **not** invoke a skill when the user only needs:

- a short recommendation;
- a quick wording change;
- a brief explanation of the current setup;
- a small comparison or naming opinion;
- a light review that does not require reusable packaging; or
- one small workspace-personalization recommendation rather than a fuller recommendation pack.

## Utility Skills

### `linear-skill-intake-onboarding`

**Use when**

- the user wants a reusable template, skill, audit pack, or packaged workflow; and
- important reusable defaults are missing.

**Boundary**
Collect missing reusable defaults, then return to the substantive task. Do not use it for one-off answers.

### `linear-app-skill-creator`

**Use when**

- creating or revising a reusable skill or template;
- converting a workflow into a reusable package;
- writing Builder instructions or a broader operating asset; or
- the request does not fit one specialist cleanly.

**Boundary**
This is the broad packaging fallback, not the first-choice route for clearly specialist work.

### `markdown-output-formatter`

**Use when**

- the substance already exists; and
- the remaining task is clearer structure, packaging, or polish.

**Boundary**
This skill improves presentation only. It should not make substantive routing decisions.

## Specialist Skill Groups

### Issue and Workflow Shaping

- `linear-the-architect`: rewrite rough internal work into clearer Linear-style tasks.
- `linear-gap-analyzer`: identify missing context and readiness blockers.
- `linear-momentum-auditor`: review blocked, stale, or momentum-risk work.
- `linear-sub-issue-splitter`: split oversized work into practical sub-issues.

### Evidence and Decision

- `linear-voice-of-customer`: turn customer-facing signals into Linear-ready planning insight.
- `linear-decision-logger`: capture durable rules, naming choices, routing rules, and operating conventions.

### Triage Design

- `linear-triage-router`: classify one incoming item into the right team, label, priority, or route.
- `linear-unplanned-work-intake-audit`: audit how work enters Linear.
- `linear-triage-rules-designer`: design reusable triage logic.
- `linear-duplicate-management-playbook`: improve duplicate detection and canonical issue handling.

## Overlap Rules

- **Architect vs Gap Analyzer**: use Architect for rewriting; use Gap Analyzer for missing-context diagnosis.
- **Architect vs Sub-Issue Splitter**: use Architect for one clearer task; use Sub-Issue Splitter when the work should become multiple tasks.
- **Triage Router vs Rules Designer**: use Router for one item; use Rules Designer for reusable triage design.
- **Intake Audit vs Duplicate Playbook**: use Intake Audit for capture-stage problems; use Duplicate Playbook for canonical duplicate handling after intake.
- **Workspace personalization**: for substantial Linear workspace pattern analysis, use the instruction-level workspace-personalization behavior and stay in recommendation mode; for one small instruction improvement, a direct answer is acceptable.
- **Any specialist vs Creator**: use the specialist when one clear primary job dominates; use Creator only when the request is broader than a single specialist boundary.

## Linear Workspace Analysis Guardrails

When the request involves reading the current Linear workspace:

- prefer instruction, routing, template, and behavior recommendations over operational cleanup suggestions;
- do not treat messy labels, stale work, duplicates, or weak descriptions as permission to mutate Linear;
- if cleanup would help, describe it as an optional follow-up plan only;
- if the workspace is effectively centered on one main team, focus first on labels, priority, owner guidance, issue shape, and workflow stage within that team;
- if the workspace shows one dominant operating taxonomy, prefer reusing the existing label and workflow language over inventing new structural categories; and
- if work already fits one active team and existing project structure, strengthen quality inside that structure before proposing extra routing layers or new category systems.

## Quick Routing Shortcuts

- **Need missing defaults first?** -> onboarding
- **Need broad packaging or Builder-ready creation?** -> creator
- **Need issue rewriting?** -> The Architect
- **Need missing-context analysis?** -> Gap Analyzer
- **Need stale or blocker review?** -> Momentum Auditor
- **Need customer-signal interpretation?** -> Voice of Customer
- **Need a durable reusable decision remembered?** -> Decision Logger
- **Need routing for one incoming item?** -> Triage Router
- **Need a large issue split up?** -> Sub-Issue Splitter
- **Need intake-stage audit?** -> intake audit
- **Need reusable triage logic?** -> rules designer
- **Need duplicate-handling policy?** -> duplicate management
- **Need one small workspace-personalization recommendation?** -> direct answer
- **Need a fuller workspace-personalization recommendation pack?** -> instruction-level workspace-personalization behavior
- **Need final polish only?** -> formatter

## Final Rule

When two paths seem plausible, choose the one with the narrower primary job and use the broader path only when the request clearly exceeds that boundary.

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
