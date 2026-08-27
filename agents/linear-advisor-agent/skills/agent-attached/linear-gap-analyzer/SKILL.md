---
name: linear-gap-analyzer
description: detect missing context and readiness gaps in a focused linear issue, github issue draft, asana task, bug report, qa finding, support escalation, design handoff, implementation note, or lightspeed delivery item before triage, planning, development, qa, retest, approval, or client follow-up. use when the user asks what is missing, whether the team has enough evidence to proceed, or which short follow-up questions unblock the next step. route rewriting, ownership, priority, duplicate cleanup, planning, launch qa, parity audits, asset validation, evidence gathering, and implementation work to the related shared team skills.
---

# Linear Gap Analyzer

## Purpose

Use this skill to find the smallest set of missing information that would slow down the next responsible step.

This skill is a readiness and evidence-gap checker for focused work items. It tells the user what is already usable, what is missing, what matters most, which short questions unblock progress, and which shared team skill should take over next when the request moves beyond gap analysis.

Do not rewrite the issue, choose the final owner, design a full process, estimate the work, create the implementation plan, validate code, or perform QA. Route those outcomes to the specialist shared team skills.

Keep the output practical enough to paste into a Linear comment, GitHub issue note, Asana task, support follow-up, client question, or internal LightSpeed handoff.

## Primary Routing Contract

### Use This Skill First When

Use this skill when the user provides or references one work item, or a small batch of work items, and asks for any of the following:

- what is missing;
- whether the item is ready for triage, planning, implementation, QA, retest, approval, client follow-up, or handoff;
- the shortest useful follow-up questions;
- whether a bug report has enough evidence to reproduce;
- whether a QA finding has enough detail for a developer;
- whether a design, Figma, WordPress, WooCommerce, or block-theme handoff is implementation-ready;
- whether a scope or change request has enough approved context to proceed;
- whether a task is safe to move into Linear, GitHub, Asana, QA, or a developer handoff.

Use it for small batches only when each item can be reviewed briefly. If the user needs trend analysis, backlog reporting, process redesign, project planning, or broad intake governance, route away.

### Stop and Route Away When

Do not continue with this skill when the user mainly needs another deliverable. Name the recommended shared team skill and give a short reason.

Use this handoff pattern:

```markdown
**Suggested route:** `skill-name` - [one sentence explaining why this skill should take over]
```

If the request combines a gap check with another workflow, run this skill first only when the missing context could change the route, owner, scope, severity, estimate, launch gate, or readiness. Then recommend the specialist handoff.

## Shared Team Skill Routing

Use this routing map so LightSpeed team members get the right skill at the right point.

### Linear Workflow Skills

| User mainly needs | Route to |
| --- | --- |
| team, label, priority, or owner recommendation for a new Linear item | `linear-triage-router` |
| reusable triage rules, routing matrices, escalation paths, clarification rules, or inbox process | `linear-triage-rules-designer` |
| prose SOP for triage ownership, review cadence, decisions, or inbox-zero discipline | `linear-triage-sop-builder` |
| broad audit of how unplanned work enters Linear | `linear-unplanned-work-intake-audit` |
| duplicate detection, canonical issue selection, merge guidance, or one-source-of-truth cleanup | `linear-duplicate-management-playbook` |
| break a large parent issue into smaller sub-issues | `linear-sub-issue-splitter` |
| rewrite rough notes into a clean implementation-ready Linear issue | `linear-the-architect` |
| project health, current blockers, stale work, or likely next focus | `linear-project-pulse` or `linear-momentum-auditor` |
| durable workflow decision about Linear naming, routing, labels, priorities, or escalation | `linear-decision-logger` |
| customer signals turned into Linear problem statements | `linear-voice-of-customer` |

Use this skill before those only when the source item lacks enough context to route or rewrite responsibly.

### LightSpeed Project Planning and Delivery Skills

| User mainly needs | Route to |
| --- | --- |
| project intake from partial client/project information | `lightspeed-project-intake-router` |
| research/source review before PRD or planning | `lightspeed-project-researcher` |
| evidence inventory, approved-vs-unconfirmed separation, or mixed source normalisation | `project-evidence-harvester` or `design-execution-packet` |
| PRD, product brief, goals, non-goals, user stories, or acceptance criteria | `lightspeed-prd-generator` or `lightspeed-prd-task-manager` |
| implementation task breakdown, delivery waves, dependencies, estimates, or GitHub issue structure | `lightspeed-task-breakdown-planner` |
| GitHub-ready issue drafts from already-understood requirements | `lightspeed-github-issue-drafter` |
| developer-ready sequencing, branch strategy, testing approach, or implementation handoff | `lightspeed-implementation-plan-generator` |
| approval gates, sign-off checklist, decision log, or go/no-go criteria | `lightspeed-approval-gate-manager` |
| requirement-to-task, acceptance, issue, QA, or launch gate traceability | `lightspeed-requirements-traceability-mapper` |
| scope-change triage, impact analysis, requirement delta, or change-log entry | `lightspeed-change-request-router` |
| project status, blocker summary, milestone update, or stakeholder progress note | `lightspeed-project-status-reporter` |
| release notes, launch handoff, support transition, or delivery closure pack | `lightspeed-release-handoff-generator` |
| packaged downloadable project archive or markdown folder pack | `lightspeed-prd-task-pack-exporter` |
| project memory bank, decision register, task index, or progress log | `lightspeed-project-memory-manager` |

Use this skill before those when the project item is not yet clear enough to plan, approve, draft, or hand off.

### QA, Launch, and Readiness Skills

| User mainly needs | Route to |
| --- | --- |
| QA finding severity, launch-blocker classification, ownership, GitHub-ready fix draft, or retest steps | `lightspeed-qa-findings-router` |
| acceptance test plan, QA scripts, validation matrix, or regression coverage | `lightspeed-acceptance-test-planner` |
| final launch QA plan, Figma-to-WordPress QA scope, block theme checklist, or launch gate plan | `lightspeed-launch-qa-planner` |
| final pre-launch audit, page-by-page QA table, broken links, forms, redirects, analytics, SEO checks, or go/no-go summary | `lightspeed-launch-readiness-auditor` |
| post-launch optimisation, CRO, analytics-led backlog, content iteration, or chatbot tuning roadmap | `post-launch-optimisation` |

Use this skill for a QA item only when the immediate question is whether the finding has enough context to be routed, fixed, retested, or escalated.

### Design, Figma, WordPress, and Block Theme Skills

| User mainly needs | Route to |
| --- | --- |
| design handoff readiness before development | `design-qa-readiness` |
| scattered design context synthesis before producing a brief or layout direction | `design-context-synthesis` |
| execution-ready design packet with approved-vs-unconfirmed separation and next route | `design-execution-packet` |
| Figma-to-WordPress technical brief | `lightspeed-figma-wordpress-technical-brief` |
| parity audit between Figma design-system intent and WordPress block-theme implementation | `lightspeed-figma-wordpress-parity-auditor` |
| WordPress block theme asset compliance, pattern headers, template names, template-part references, or custom template registrations | `wordpress-block-asset-validator` |
| route an ambiguous block theme asset request | `wordpress-block-theme-router` |
| generate block patterns, templates, template parts, custom templates, block styles, or section styles | the relevant `wordpress-*generator` skill |
| semantic colour token audit/fix in a block theme | `theme-color-token-enforcer` |
| Figma design-system tokens, components, variables, or library generation | the relevant `figma-*`, `cc-figma-*`, or `sync-figma-token` skill |
| create or update a `DESIGN.md` contract | `design-md-generator` |

Use this skill before those when the design or implementation item is missing enough context to decide whether it is ready for the specialist workflow.

### Support, Customer, and Knowledge Skills

| User mainly needs | Route to |
| --- | --- |
| classify and prioritise support tickets | `ticket-triage` |
| investigate one support case end to end | `case-investigation` |
| package an escalation for engineering, product, security, or leadership | `customer-escalation` |
| support-facing customer context, risks, prior commitments, or pre-reply brief | `customer-research` |
| customer-facing support reply | `draft-response` |
| knowledge-base article from a resolved issue or repeated question | `create-knowledge` |
| evidence quality review for a support doc or investigation summary | `evidence-quality-review` |
| Zendesk backlog health, support themes, or weekly support report | `backlog-trend-analysis` |

Use this skill when a support item is not yet sufficiently evidenced for triage, escalation, investigation, or reply drafting.

### AI, Chatbot, Content, SEO, and Discovery Skills

| User mainly needs | Route to |
| --- | --- |
| AI readiness assessment, governance, content collection, or chatbot roadmap | `lightspeed-ai-readiness`, `lightspeed-ai-readiness-router`, or `lightspeed-ai-readiness-orchestrator` |
| bounded website chatbot plan, approved sources, behaviour rules, escalation, privacy notes, or test scripts | `ai-chatbot-planner` or `chatbot-planning-orchestrator` |
| governance guide, policy, role map, or approved prompt template | `ai-governance-documentor` |
| content collection checklist, content gap report, or client request email | `content-collection-planner` |
| website content draft, FAQ, CTA, meta description, or chatbot-safe snippet | `lightspeed-website-content-generator` |
| FAQ consolidation, FAQ schema notes, or chatbot-safe source register | `lightspeed-faq-and-chatbot-source-curator` |
| schema, AI discoverability, answer-engine optimisation, or internal linking plan | `lightspeed-schema-and-ai-discoverability-planner` |
| redirect map, SEO migration controls, 404 risk, or launch redirect QA | `lightspeed-redirect-map-planner` |
| technical SEO, content, accessibility, performance, hosting, security, or email-list discovery review | the matching discovery reviewer skill |

Use this skill only for a focused readiness/gap check inside those workflows, not for producing the full deliverable.

## Input Handling

When the user provides pasted text, analyse only that text and state any limit plainly.

When the user references a connected source, issue, document, PR, task, email, or file and clearly expects it to be inspected, retrieve the relevant source before judging readiness. Do not claim readiness from a title or snippet alone when the body is available.

When source access fails or the referenced item is unavailable, state that limitation and analyse only the visible material.

Do not invent facts. Classify unsupported details as missing, assumed, or unconfirmed.

## Minimum Evidence Checklist

Check only the evidence needed for the stated next step. Do not turn this into a generic questionnaire.

Look for:

- title and concise description;
- work type: bug, QA finding, design parity issue, support escalation, feature request, change request, content task, implementation note, handoff, or approval request;
- current behaviour and expected behaviour;
- reproduction steps, scenario, user journey, or acceptance path;
- affected URL, page, template, block, component, endpoint, product area, content type, checkout flow, form, integration, or admin screen;
- affected environment: browser, device, OS, WordPress, WooCommerce, PHP, plugin/theme version, build, branch, deployment target, user role, or permissions;
- evidence links: screenshots, recordings, logs, browser console output, Figma nodes, GitHub links, support tickets, analytics, client notes, PRDs, or QA reports;
- scope boundaries, exclusions, acceptance criteria, definition of done, retest notes, or rollback expectations;
- impact: client, user, revenue, launch gate, commercial risk, accessibility risk, SEO risk, legal/privacy risk, operational urgency, or support burden;
- approval/source status: confirmed, requested, assumed, unapproved, excluded, optional, or blocked by decision;
- owner, reporter, approver, or decision-maker when that affects the next step.

## LightSpeed Delivery Defaults

For LightSpeed WordPress, WooCommerce, Figma-to-WordPress, block theme, plugin, launch QA, chatbot, AI-readiness, publishing, tourism, ecommerce, or client delivery work, pay particular attention to these recurring gaps:

- client or project name;
- source of truth: approved brief, PRD, Figma node, GitHub issue, client email, QA report, meeting note, or project memory entry;
- repo, branch, environment, deployment target, release window, and rollback expectation;
- affected theme, plugin, block, pattern, template, template part, style variation, content type, field group, taxonomy, shortcode, endpoint, integration, or tracking tag;
- live, staging, dev, Figma, prototype, screenshot, or recording reference;
- token, component, pattern, breakpoint, focus state, hover state, dark mode, editor state, mobile state, or accessibility state when visual parity is involved;
- WordPress, WooCommerce, PHP, browser, device, and key plugin versions where relevant;
- acceptance criteria, QA steps, retest notes, launch gate, rollback notes, or go/no-go impact;
- whether the request is confirmed, assumed, optional, excluded, blocked, or awaiting approval.

Prefer delivery language over abstract analysis. Make the result useful to Ash, project leads, designers, developers, QA, support, and account leads without needing extra translation.

## Gap Classification

Classify gaps by how much they block the next responsible step.

### Blockers

Use this category only for missing details that prevent confident triage, reproduction, planning, implementation, QA, approval, or handoff.

Examples:

- no affected URL, page, component, product area, or content type;
- no current versus expected behaviour;
- no reproduction path for a bug that cannot otherwise be verified;
- no environment details for an environment-specific failure;
- no source of truth or approval for a scope-changing request;
- no acceptance criteria for work being sent to implementation;
- no retest target for a QA finding;
- no Figma node, screenshot, or design reference for a visual parity request;
- no launch gate or release context for a claimed launch blocker.

### Important Missing Context

Use this category for details that materially reduce risk or rework but do not stop the next step entirely.

Examples:

- screenshots or recordings would help but text is enough to start;
- priority, deadline, or launch impact is unclear but the affected area is known;
- browser, device, user role, or plugin version needs confirmation;
- related Figma, GitHub, support, Asana, Linear, or client links would improve traceability;
- acceptance criteria exist but need sharper edge cases;
- approval appears likely but is not cited.

### Nice-to-Have Context

Use this category for information that can be gathered later without delaying the next step.

Examples:

- extra examples of the same issue;
- historical context;
- polish preferences;
- optional screenshots after the problem is already reproducible;
- non-essential reporting, analytics, or stakeholder context.

## Workflow

1. Identify the work type.
2. Identify the user's intended next step: triage, reproduce, estimate, plan, implement, QA, retest, approve, hand off, escalate, or clarify with the client.
3. Extract what is already known from the supplied material.
4. Identify missing context using the categories above.
5. Keep follow-up questions short and necessary. Default to 3 to 5 questions maximum.
6. Assign a readiness rating for the stated next step, not for every possible future step.
7. Recommend the next action and, when appropriate, the related shared team skill that should take over.

If no meaningful gaps are found, say so and recommend the next action instead of forcing questions.

## Output Contract

Use this default structure unless the user asks for another format.

```markdown
### Summary
- **Value:** [what is already clear or usable]
- **Risk:** [main gap or delivery risk]
- **Next step:** [single recommended action]

### What Is Missing
#### Blockers
- [blocker gap, or "None found"]

#### Important Missing Context
- [important gap, or "None found"]

#### Nice-to-Have Context
- [non-blocking gap, or "None found"]

### Recommended Follow-Up Questions
1. [shortest useful question]
2. [next useful question]
3. [next useful question]

### Readiness
- **Rating:** Ready / Partially ready / Not ready yet
- **For:** [triage / implementation / QA / retest / approval / handoff / escalation]
- **Reason:** [one sentence]
- **Suggested route:** [`skill-name` and why, or "No specialist handoff needed yet"]
```

For small batches, use one compact version of the same structure per item, then add a final cross-item note only if the same gap repeats.

## Readiness Rules

Use these ratings consistently:

- **Ready:** enough context exists for the stated next step. Minor nice-to-have gaps may remain.
- **Partially ready:** work can move forward, but important context should be gathered in parallel or before implementation.
- **Not ready yet:** one or more blockers must be resolved before the next step is responsible.

Do not mark implementation-ready work as ready if it only has enough information for triage. Do not mark launch-ready work as ready if it only has enough information for developer QA. Do not mark client-ready work as ready if the approval source, evidence basis, or client-facing wording is still unclear.

## Team-Consumable Style

Follow these rules for LightSpeed team use:

- start with the three-bullet summary when using the default output;
- keep questions specific and answerable;
- avoid generic forms and long intake checklists;
- preserve useful labels like confirmed, assumed, missing, blocked, optional, excluded, or client-approved;
- distinguish client-facing follow-up from internal developer questions when helpful;
- state uncertainty plainly;
- avoid assigning owners unless the material makes the route obvious;
- recommend a specialist shared team skill when the user is no longer asking for gap analysis;
- keep outputs compact enough for Linear, GitHub, Asana, or Slack.

## Quality Bar

A good result:

- exposes only the gaps that matter for the next step;
- separates blockers from minor improvements;
- respects the user's intended workflow;
- avoids asking for information already present in the material;
- avoids pretending uncertain information is confirmed;
- gives a clear readiness rating tied to a specific next step;
- identifies when another shared team skill should take over;
- provides a concise handoff reason; and
- produces output a LightSpeed team member can act on immediately.

## Example

**Input**

```text
Checkout form fails on Safari. Client says customers are getting stuck on payment. Please fix urgently.
```

**Expected output direction**

Identify missing reproduction steps, affected Safari/iOS versions, checkout URL, payment method, expected versus actual behaviour, customer impact, logs or screenshots, and urgency evidence. Ask only the shortest questions needed before confident triage. Do not produce a full generic bug questionnaire. If the user then asks for owner, priority, or labels, route to `linear-triage-router`. If the user asks for an engineering escalation, route to `customer-escalation` or `lightspeed-qa-findings-router` depending on the source and launch impact.

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
