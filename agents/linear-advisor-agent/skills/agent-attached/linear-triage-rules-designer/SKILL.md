---
name: linear-triage-rules-designer
description: '**skill route:** reusable Linear triage system. This skill helps design practical triage guidelines for the LightSpeed team, ensuring clear routing, priority setting, review processes, and escalation paths for various work types. Use it when creating or improving reusable systems for managing future issues, rather than for handling individual cases or audits.'
---

# Linear Triage Rules Designer

## Purpose

Design practical Linear triage systems that the LightSpeed team can review, adopt, and maintain.

This skill must produce team-ready routing guidance, not abstract process theory. Outputs should help the team decide how new work moves through Linear, who reviews it, what evidence is needed, which labels or statuses apply, when priority changes, and when escalation or clarification is required.

Use this skill for reusable systems that handle many future issues. Do not use it as the primary workflow for routing one issue, rewriting one issue, auditing every intake channel, or managing duplicates.

## First Response Requirement

Start every output with a short routing statement so the user can see why this skill applies.

Use this format:

- **skill route:** reusable Linear triage system.
- **included:** routing, priority, label, ownership, clarification, escalation, review cadence, and adoption guidance.
- **not included:** any adjacent work that should go to another skill or a human decision owner.

If the request is partly out of scope, continue with the triage-system portion and clearly name the better route for the rest.

## Routing Decision Guide

Use this skill when the request is mainly about:

- creating or improving a reusable triage system;
- defining routing rules across teams, projects, clients, or work types;
- defining priority, label, status, ownership, review, or escalation logic;
- designing a Linear inbox process or recurring triage operating model;
- creating rules for low-context, ambiguous, risky, or commercially sensitive work;
- turning messy team notes into a ruleset the LightSpeed team can use; or
- creating a team adoption pack for a one-week triage trial.

Route away, or separate the out-of-scope portion, when the request is mainly:

| user need | better route | boundary |
| --- | --- | --- |
| route one issue now | linear-triage-router | this skill designs the system, not a single routing decision |
| rewrite one vague issue | linear-the-architect | this skill may define required evidence, but should not rewrite the issue |
| split one large issue | linear-sub-issue-splitter | this skill may define split triggers, but should not decompose the issue |
| audit how requests enter Linear | linear-unplanned-work-intake-audit | this skill may use audit findings, but should not run the intake audit |
| manage duplicate detection and canonical issues | linear-duplicate-management-playbook | this skill may define duplicate-check steps, but not full duplicate governance |
| write only a prose SOP | linear-triage-sop-builder | keep this skill only when rule logic or matrices are needed |
| summarise project health | linear-project-pulse or status reporting workflow | this skill may define triage review cadence, not project status |
| create or update real Linear objects | linear connector workflow after explicit user approval | this skill can recommend implementation changes but should not mutate workspace data by default |

## LightSpeed Defaults

Use these defaults unless the user provides different team rules.

- Treat Linear as the source of truth for planned delivery work, ownership, priority, triage decisions, and issue status.
- Keep the system small enough for a delivery team to use weekly. Prefer durable rules over complex governance.
- Separate commercial approval from delivery triage. Scope, estimate, contractual, or client approval decisions go to Ash, the project lead, or another named decision owner.
- Keep high-risk technical decisions human-reviewed by the technical lead or relevant senior developer.
- Keep accessibility, security, launch-readiness, data, payments, production-risk, ecommerce, and privacy items visible and escalatable.
- Do not route low-context requests deeply into delivery. Mark them as needing clarification and define the minimum evidence needed.
- Prefer a daily inbox sweep for active work, a weekly backlog review for lower-priority work, and immediate escalation for launch blockers or production-impacting issues.
- Make automation optional. State what can be safely standardised, but leave judgement-heavy decisions human-owned.
- Keep the first implementation small enough to test for one week before adding labels, views, automations, or dashboards.

## Inputs To Look For

Gather, infer, or mark as missing:

- intake sources, such as Linear inbox, support tickets, Slack, Asana, GitHub, email, QA notes, client calls, or project docs;
- work categories, such as bug, feature, design, content, QA, support, change request, launch task, technical debt, or internal improvement;
- target teams, owners, reviewers, clients, projects, milestones, or escalation roles;
- existing Linear teams, statuses, labels, projects, cycles, priorities, templates, and saved views;
- impact signals, including client impact, launch risk, revenue risk, accessibility risk, security risk, ecommerce/payment risk, blocked work, or deadline pressure;
- missing-evidence signals, including absent reproduction steps, screenshots, URLs, acceptance criteria, scope owner, priority reason, browser/device notes, affected template, affected client, or test notes;
- duplicate, dependency, blocked-by, and related-issue handling needs;
- handoff points between triage, delivery, review, QA, deployment, and client approval; and
- constraints, such as client-visible vs internal-only, manual approval, sensitive commercial context, or project-specific ownership.

Do not stop just because some inputs are missing. Make safe defaults explicit and include the smallest useful set of follow-up questions.

## Connector And Source Rules

Use Linear connectors only when the user asks to inspect, create, update, or act on real Linear workspace data.

Do not create or update Linear issues, labels, projects, comments, views, cycles, automations, or statuses unless the user explicitly asks for that action.

When the user provides docs, issue lists, QA findings, GitHub context, Asana context, support notes, project briefs, launch plans, or client notes, use them as evidence. Keep final recommendations grounded in provided material and label assumptions clearly.

For LightSpeed work, prefer internal project evidence over generic best practice when project context is available.

## Workflow

1. State the routing decision: confirm this is a reusable triage-design task, or separate out-of-scope parts.
2. Identify the triage problem to solve, such as slow routing, unclear ownership, priority inflation, low-context intake, missed escalation, duplicate work, weak QA handoff, or unclear client approval.
3. Define the operating model before the rule matrix: owner, cadence, review order, decision points, and handoff points.
4. Separate human process from rule logic:
   - process: who reviews, when, and how decisions are made;
   - rules: observable conditions that suggest labels, priority, owner, status, escalation, or clarification.
5. Define rules for classification, priority, labels, ownership, clarification, duplicate checks, blocked-work handling, escalation, and review.
6. Mark what can be standardised safely and what must stay human-reviewed.
7. Add fallback behaviour for ambiguous, low-evidence, cross-team, client-sensitive, commercially sensitive, or production-risk work.
8. Finish with a small first-pass implementation checklist that can be tested for one week before expanding.

## Output Modes

Choose the smallest useful output mode unless the user requests a specific format.

### Full Triage Design

Use for new or substantial triage-system work. Include the full output contract.

### Rules Matrix Only

Use when the user already has an operating model and only needs routing, priority, escalation, or label logic. Keep the answer table-first.

### Team Adoption Pack

Use when the output must be shared with LightSpeed team members. Include a short explanation, the rules matrix, a first-week rollout checklist, owner responsibilities, and how to review whether the trial worked.

### Review And Improve Existing Rules

Use when the user provides an existing triage process. Identify gaps, simplify where possible, remove rules that create maintenance drag, and return a safer revised version.

### Builder-Ready Implementation Notes

Use when the user wants to convert the triage design into Linear templates, labels, views, or automations. Separate recommended workspace changes from actions that require explicit approval.

## Default Output Contract

Use this structure by default. Keep it concise and practical.

### 3-Point Summary

- value:
- risk:
- next step:

### Skill Routing Decision

State why this skill applies and name any adjacent workflow that should handle out-of-scope work.

### Triage Design Objective

Explain what the system improves and what it deliberately does not solve.

### Operating Model

Cover:

- triage owner or rotating reviewer;
- review cadence;
- decision sequence;
- handoff points;
- human-owned decisions; and
- safely standardised decisions.

### Inputs And Signals

List the observable signals the team should check before deciding route, label, priority, owner, escalation, or clarification.

### Routing Matrix

Use this table when practical:

| trigger condition | classification | priority guidance | labels/status | owner/reviewer | exception handling |
| --- | --- | --- | --- | --- | --- |

### Priority And Escalation Rules

Define observable priority rules and escalation triggers. Avoid vague terms unless they are tied to evidence.

### Clarification Rules

Define when an issue should pause for more context, what evidence is required, and who asks for clarification.

### Human Review Points

Identify decisions that should not be automated, especially commercial impact, client approval, launch readiness, security, accessibility, scope change, production risk, data, payments, privacy, and architecture decisions.

### Linear Implementation Checklist

Group actions by:

- change in Linear;
- human habit;
- optional automation;
- review after one week.

### Open Questions

Ask only the smallest number of questions needed to reduce routing risk. Prefer safe defaults when possible.

## Team Consumption Requirements

Make every output easy for the LightSpeed team to use.

- Start with the 3-point summary so the purpose is clear quickly.
- Use direct, practical UK English suitable for a delivery team.
- Prefer tables, short rules, and checklists over long explanations.
- Separate system changes from team habits and optional automation.
- Keep the first implementation small enough to try for one week.
- Name owner roles, not vague groups, whenever possible.
- Call out assumptions, risks, and missing inputs without blocking progress.
- Avoid over-engineering. Do not propose a taxonomy, view structure, or automation layer unless it clearly reduces repeated triage cost.
- Make the output copy-paste friendly for Linear docs, project notes, or an internal SOP.
- Do not bury the action list. End with the next concrete implementation step.

## LightSpeed Starter Rules

Use these starter rules when the user has not provided an existing model.

| trigger condition | default route | priority guidance | human review |
| --- | --- | --- | --- |
| production site down, checkout broken, payment failure, security concern, or launch blocker | immediate escalation | urgent/high | technical lead plus project lead |
| client-visible bug with clear reproduction steps | delivery triage | medium/high based on impact | project lead if scope or deadline impact exists |
| QA finding before launch | launch QA triage | high if blocks launch, medium if non-blocking | QA owner and technical lead for risk items |
| feature request or enhancement | backlog triage | low/medium unless approved for current scope | Ash or project lead for commercial fit |
| unclear support request without URL, screenshot, steps, affected user, or expected behaviour | needs clarification | no delivery priority until clarified | triage owner asks for missing evidence |
| accessibility, privacy, security, payments, data, or architecture concern | specialist review | medium/high depending on risk | relevant senior reviewer |
| possible duplicate | duplicate check before routing | inherit canonical priority if confirmed | triage owner confirms canonical issue |
| blocked delivery work | blocked/dependency review | priority based on downstream impact | owner of blocking decision or dependency |

## Prompt Examples For The Team

Good prompts for this skill include:

- "Design a Linear triage system for client bugs, feature requests, QA findings, and launch blockers."
- "Turn these messy triage notes into a routing matrix the LightSpeed team can use weekly."
- "Create escalation and clarification rules for low-context support issues entering Linear."
- "Review our current Linear labels and propose a simpler triage ruleset."
- "Create a team adoption pack for a one-week Linear inbox triage trial."
- "Create builder-ready notes for labels, statuses, and saved views, but do not update Linear yet."

## Quality Bar

A strong result:

- has a clear routing decision;
- uses observable trigger conditions;
- separates human process from reusable rule logic;
- reduces priority inflation;
- avoids routing low-context work into delivery too early;
- protects judgement-heavy decisions with human review;
- defines escalation and clarification paths;
- names owner or reviewer roles clearly;
- fits current LightSpeed delivery habits;
- keeps recommended Linear changes practical and reversible; and
- is simple enough to maintain without becoming a second project-management system.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
