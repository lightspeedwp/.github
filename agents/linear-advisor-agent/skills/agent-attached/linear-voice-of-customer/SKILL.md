---
name: linear-voice-of-customer
description: turn customer-facing feedback from support tickets, slack threads, gmail, interviews, calls, sales notes, transcripts, forms, or docs into linear-ready voice-of-customer summaries, grouped pain points, evidence-weighted customer signals, problem statements, planning recommendations, and follow-up issue framing. use when lightspeed needs customer evidence translated into product, support, operations, delivery, roadmap, or triage insight for linear. route away when the user needs raw ticket triage, deep case investigation, customer/account research, escalation packaging, duplicate cleanup, customer-facing replies, knowledge-base articles, backlog trend reporting, issue rewriting, status reporting, change-control routing, or implementation planning.
---

# Linear Voice of Customer

## Purpose

Use this skill to turn customer-facing evidence into planning-ready Linear output that LightSpeed teammates can use for product, support, operations, delivery, or roadmap decisions.

Own the synthesis layer: preserve customer language, group repeated signals, weight evidence honestly, and translate the result into Linear-ready problem framing. Do not own first-line support handling, root-cause investigation, customer replies, project management, or implementation planning unless the user explicitly asks for a combined output.

## Teammate-Ready Use

When a LightSpeed teammate invokes this skill, produce something they can paste into Linear, Slack, a planning doc, or a support handoff with minimal editing.

Default to:

- a 3-bullet executive summary;
- grouped customer signals with evidence strength;
- representative quotes or examples;
- one clear Linear-ready problem statement when supported; and
- a next-route recommendation to the most relevant shared team skill or workflow.

Avoid long research reports unless the user asks for one.

## Inputs To Look For

Look for:

- support tickets, emails, Slack threads, call notes, interview notes, sales notes, transcripts, forms, screenshots, or stakeholder notes;
- direct customer quotes, paraphrased complaints, feature requests, objections, churn risks, confusion points, or workaround descriptions;
- affected users, accounts, customer segments, workflows, products, pages, integrations, or operational processes;
- frequency, recency, urgency, severity, commercial impact, revenue risk, churn risk, or support-load signals;
- known related Linear issues, GitHub issues, Asana tasks, PRDs, project notes, launch notes, or delivery context; and
- the user's intended next step, such as triage, roadmap planning, issue drafting, escalation, customer reply, investigation, or documentation.

If evidence is incomplete, proceed with the available material and label gaps clearly instead of blocking the task.

## Source Handling

Use the evidence supplied by the user first.

Use connected sources only when they materially improve the Linear-related task:

- Slack for customer feedback threads, internal support discussions, copied customer quotes, or sales/support handoff notes.
- Gmail for customer emails or forwarded support context.
- Google Drive for notes, transcripts, exports, research docs, discovery docs, or support summaries.
- Linear for related issues, projects, initiatives, labels, or planning context.
- GitHub or Asana only when the user connects the customer signal to implementation, delivery, or project tracking.
- Zendesk only if the environment exposes it; otherwise work from pasted ticket text, exports, summaries, or other available evidence.

Do not pretend a connector is available. When evidence comes from connected sources, cite it using the active tool's citation rules. When evidence is pasted by the user, identify it as user-provided evidence.

## Routing Decision Order

Before synthesis, decide whether this skill should own the task, run first, or hand off.

1. **Is the user asking to understand customer patterns or planning signals?** Use this skill.
2. **Is the user asking to classify, respond to, investigate, escalate, or document a support case?** Route to the relevant support skill.
3. **Is the user asking to create, clean up, route, split, de-duplicate, or status-check Linear work?** Route to the relevant Linear workflow skill.
4. **Is the user asking to turn the signal into delivery scope, GitHub issues, PRDs, task breakdowns, launch work, or post-launch optimisation?** Route to the relevant LightSpeed delivery skill.
5. **If a combined workflow is useful, run VOC synthesis first only when it materially improves the downstream output.** Otherwise start with the more specific downstream skill.

## Keep This Skill As Owner

Use `linear-voice-of-customer` when the user needs:

- customer feedback grouped into product, support, operational, content, UX, or delivery themes;
- repeated complaints turned into a Linear-ready problem statement;
- direct customer language preserved for planning discussions;
- evidence strength separated into strong, medium, and weak signals;
- customer pain translated into issue framing, roadmap input, product discovery, or triage-ready signal;
- a compact summary of what customers are struggling with and why it matters; or
- a recommendation on what should happen next in Linear.

## Route To Support Skills

Route away before VOC synthesis when the task is primarily support handling.

| User need | Route to | Routing rule |
|---|---|---|
| Classify raw tickets by issue type, severity, priority, team, or immediate action | `ticket-triage` | Use before VOC when tickets have not been classified yet. |
| Research one customer or account before replying, escalating, or summarising risk | `customer-research` | Use when account history, prior commitments, support health, or open risks matter more than pattern synthesis. |
| Investigate one support case end to end | `case-investigation` | Use when the user needs root cause, proof, timeline, implementation clues, or a handoff case file. |
| Package a serious issue for engineering, product, security, or leadership | `customer-escalation` | Use when urgency, churn risk, SLA pressure, or cross-team decision-making is the core job. |
| Draft a customer-facing support reply | `draft-response` | Use when the output is an email, ticket response, or live-thread reply. |
| Create a knowledge-base article, workaround, or known-issue article | `create-knowledge` | Use when the issue is resolved or common enough for self-service documentation. |
| Review a support draft, investigation, or evidence pack for unsupported claims | `evidence-quality-review` | Use when the user wants quality assurance on evidence, claims, or next steps. |
| Analyse Zendesk backlog health, recurring support themes, or weekly support trends | `backlog-trend-analysis` | Use for operational reporting across a backlog or period, not planning-focused VOC synthesis. |

## Route To Linear Workflow Skills

Route to these skills when the customer signal needs Linear workflow action.

| User need | Route to | Routing rule |
|---|---|---|
| Decide team, label, priority, ownership, or routing path | `linear-triage-router` | Use after the customer signal is clear enough to route. |
| Rewrite rough notes into a concrete Linear issue or task | `linear-the-architect` | Use after VOC has produced a problem statement and evidence summary. |
| Identify missing context before triage, planning, QA, handoff, or customer follow-up | `linear-gap-analyzer` | Use when the evidence is too thin or readiness is unclear. |
| Detect duplicates, choose a canonical issue, or preserve context across duplicate reports | `linear-duplicate-management-playbook` | Use when repeated customer signals may already exist as multiple Linear issues. |
| Split a broad customer-driven problem into sub-issues | `linear-sub-issue-splitter` | Use after a parent issue, initiative, or feature direction exists. |
| Audit stalled, stale, blocked, or recently unblocked work | `linear-momentum-auditor` | Use when the question is why related Linear work is not moving. |
| Summarise project status, risks, progress, or next actions | `linear-project-pulse` | Use when the user wants a status snapshot rather than customer-signal analysis. |
| Audit how bugs, requests, and feedback enter Linear | `linear-unplanned-work-intake-audit` | Use when the intake system is causing duplication, chaos, or context loss. |
| Build a team triage SOP | `linear-triage-sop-builder` | Use when the deliverable is a repeatable operating procedure. |
| Design routing, priority, ownership, or triage rules | `linear-triage-rules-designer` | Use when the deliverable is rules, not one-off routing. |
| Save a durable Linear or LightSpeed workflow decision | `linear-decision-logger` | Use only for standing conventions, not one-off VOC findings. |

## Route To LightSpeed Delivery Skills

Route to these skills when the customer signal becomes delivery, implementation, launch, or project-management work.

| User need | Route to | Routing rule |
|---|---|---|
| Draft GitHub-ready issues from VOC findings | `lightspeed-github-issue-drafter` | Use after the problem statement, scope direction, and acceptance notes are clear. |
| Convert customer evidence into a PRD, product brief, goals, personas, or acceptance criteria | `lightspeed-prd-generator` | Use when the signal is large enough to require requirements definition. |
| Break approved scope into epics, tasks, delivery waves, or dependencies | `lightspeed-task-breakdown-planner` | Use after requirements or issue direction are stable. |
| Review a PRD, technical brief, task pack, issue draft, or QA plan | `lightspeed-prd-task-reviewer` | Use before implementation when quality or readiness needs checking. |
| Produce client-facing or internal project status from VOC-related work | `lightspeed-project-status-reporter` | Use when stakeholders need progress, blockers, risks, and next actions. |
| Assess a change request after PRDs, briefs, or task plans are approved | `lightspeed-change-request-router` | Use when customer feedback changes approved scope. |
| Build an implementation plan, sequencing, branch strategy, or test approach | `lightspeed-implementation-plan-generator` | Use after requirements and task direction are approved. |
| Route launch work, specialist launch checks, or go/no-go workflows | `lightspeed-launch-task-router` | Use when VOC evidence affects launch readiness or launch sequencing. |
| Create acceptance tests or QA scripts from approved requirements | `lightspeed-acceptance-test-planner` | Use when feedback needs validation coverage or regression tests. |
| Triage QA findings, parity issues, accessibility failures, or launch defects | `lightspeed-qa-findings-router` | Use when the input is QA evidence rather than customer feedback. |
| Plan post-launch UX, conversion, content, chatbot, or retention improvements | `post-launch-optimisation` | Use when feedback relates to a live site or ongoing improvement roadmap. |

## Combined Workflow Guidance

Use these common handoff patterns:

- **Raw support evidence to planning:** `ticket-triage` -> `linear-voice-of-customer` -> `linear-triage-router` or `linear-the-architect`.
- **Repeated customer pain to implementation:** `linear-voice-of-customer` -> `lightspeed-github-issue-drafter` -> `lightspeed-task-breakdown-planner`.
- **High-risk account signal:** `customer-research` -> `linear-voice-of-customer` -> `customer-escalation`.
- **Thin or messy evidence:** `linear-voice-of-customer` -> `linear-gap-analyzer`.
- **Possible duplicate product feedback:** `linear-voice-of-customer` -> `linear-duplicate-management-playbook`.
- **Live-site improvement signal:** `linear-voice-of-customer` -> `post-launch-optimisation`.
- **Approved scope changed by customer feedback:** `linear-voice-of-customer` -> `lightspeed-change-request-router`.

Do not run multiple downstream skills automatically unless the user asks for the downstream artefact. In the VOC output, name the recommended next skill and give the reason.

## Workflow

1. **Define the evidence boundary.** State what sources are included, what is excluded, date range if known, and whether evidence is user-provided or connector-backed.
2. **Extract raw signals.** Capture customer language, examples, affected workflow, impact, frequency, recency, urgency, and related artefacts.
3. **Separate evidence from interpretation.** Keep quotes, paraphrases, observed facts, assumptions, and inferred themes distinct.
4. **Cluster related signals.** Group by problem, workflow, customer segment, impact, and recurrence. Do not force unrelated anecdotes into one theme.
5. **Weight evidence strength.** Use the evidence-strength rules below.
6. **Translate into Linear-ready framing.** Prefer problem statements over solution requests unless customers clearly asked for the same specific solution.
7. **Recommend the next route.** Suggest the most useful support, Linear, or LightSpeed delivery skill when another workflow should take over.

## Evidence Strength Rules

Use these labels consistently:

- **Strong signal:** multiple customers/accounts report the same problem; or one high-impact customer gives clear evidence with meaningful commercial, operational, accessibility, compliance, launch, or churn impact.
- **Medium signal:** repeated but limited evidence; one credible source plus supporting internal observations; or a clear workflow problem without enough customer volume yet.
- **Weak signal:** isolated anecdote, unclear source, old feedback, speculative interpretation, vague paraphrase, or insufficient customer detail.

When evidence is mixed, use the lower confidence label and explain what would raise confidence.

## Default Output Contract

Use this structure by default. Compress it for small inputs and expand it only when the evidence set requires it.

### 3-Bullet Summary

- **Value:** what the customer signal helps the team understand or decide.
- **Risk:** what could be overstated, missing, urgent, commercially sensitive, or likely to cause rework.
- **Next step:** the most practical Linear, support, or LightSpeed follow-up.

### Core Customer Signals

| Signal | Evidence strength | Customer impact | Evidence basis | Suggested Linear framing |
|---|---:|---|---|---|
| [theme] | Strong / Medium / Weak | [impact] | [tickets, quotes, notes, accounts, docs] | [problem statement or planning signal] |

### Representative Evidence

- **Direct quote:** keep quotes short and clearly marked.
- **Paraphrase:** label paraphrased evidence clearly.
- **Source note:** identify where the evidence came from when available.

### Linear-Ready Problem Statement

Use this pattern when helpful:

> Customers who [context/workflow] are struggling to [job/outcome] because [observed pain or blocker]. This causes [customer/business impact]. Evidence currently suggests [strong/medium/weak] confidence based on [basis]. The team should [investigate/route/plan/solve] [recommended outcome] while preserving [constraints or guardrails].

### Recommended Follow-Up Route

State the best next action and the related shared team skill when useful:

- `linear-triage-router` for team, priority, ownership, or routing;
- `linear-the-architect` for issue drafting;
- `linear-gap-analyzer` for missing evidence;
- `linear-duplicate-management-playbook` for duplicate cleanup;
- `customer-research`, `case-investigation`, or `customer-escalation` for support-heavy follow-up;
- `lightspeed-github-issue-drafter`, `lightspeed-prd-generator`, or `lightspeed-task-breakdown-planner` for delivery follow-up; or
- another route from the routing tables above.

### Assumptions, Gaps And Open Questions

Only include this section when evidence is incomplete, ambiguous, outdated, or not directly customer-facing. Prefer a short set of high-value questions over broad discovery.

## Linear Framing Rules

Prefer problem statements over feature requests.

Good framing:

> Customers who manage recurring subscriptions are struggling to understand failed renewal states because the admin labels and customer emails use inconsistent language. This causes avoidable support tickets and manual account checks. Evidence confidence is medium based on three support examples and one internal support note.

Avoid:

- presenting a preferred feature as proven demand when the evidence only shows a problem;
- merging unrelated complaints because they share a broad category;
- assigning priority, severity, owner, or implementation scope without enough context;
- removing customer language that reveals the actual pain or mental model; and
- claiming customer volume, revenue impact, or churn risk unless the evidence supports it.

## Quality Bar

A good output:

- is grounded in available evidence;
- preserves representative customer language where useful;
- distinguishes facts, quotes, paraphrases, assumptions, and interpretation;
- weights signal strength honestly;
- produces planning-ready Linear language;
- recommends the next shared team skill only when it improves the workflow;
- avoids pretending to create or update Linear/GitHub/Asana records unless explicitly asked; and
- is short enough for a teammate to paste into Linear, Slack, or a planning document without heavy editing.

## Example Use

**Input**

"Summarise these five support tickets and the Slack discussion into a planning-ready problem statement. Separate repeated customer pain from one-off anecdotes and tell me whether this should become a Linear issue or an investigation."

**Expected output shape**

A compact VOC summary with evidence strength, grouped signals, representative quotes, a Linear-ready problem statement, and a recommended next route such as `linear-the-architect`, `linear-gap-analyzer`, `case-investigation`, `customer-escalation`, or `linear-triage-router`.

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
