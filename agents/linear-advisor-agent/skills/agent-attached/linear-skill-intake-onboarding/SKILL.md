---
name: linear-skill-intake-onboarding
description: This skill helps collect essential preferences needed to properly route requests for creating or updating reusable skills across shared-team workflows like Linear and LightSpeed. Use it to quickly provide necessary defaults when initiating a skill project, ensuring a smooth and effective continuation of your request without unnecessary delays.
---

# Linear Skill Intake Onboarding

## Purpose

Collect only the minimum reusable defaults needed to route Linear and LightSpeed shared-team skill-factory requests correctly, persist durable preferences, and resume the user's original request as soon as the routing path is clear.

Use this skill as a lightweight intake gate. Do not draft, audit, package, or rewrite the target skill here unless the original request explicitly asks for a small inline recommendation. The primary job is to unblock the correct downstream shared-team skill.

## Operating rules

- Ask only for missing reusable defaults that materially affect future skill creation or routing.
- Do not ask the user to repeat information already present in the request or Memory.
- Ask one concise question at a time.
- Persist durable defaults immediately after they are supplied.
- Use safe optional defaults instead of slowing down the current request.
- Resume the original request immediately once `default_workflow_type` is known.
- Keep onboarding invisible unless a user answer is required.
- Do not store one-off project details, issue content, customer context, or temporary preferences as standing defaults.
- Prefer the most specific specialist skill over generic skill creation whenever the request clearly belongs to an existing shared-team workflow.

## Memory model

Use {{label:Memory,id:file_persistence,type:file_persistence}} as the backing store.

Read these files before asking the user to restate anything:

- `skill-intake-state.yaml` for required onboarding defaults;
- `skill-factory-preferences.yaml` for durable output and packaging preferences;
- `skill-factory-todos.md` for deferred follow-up items.

Store only compact, reusable defaults that are likely to matter in later runs.

## Trigger contract

### Use when all are true

- The current request is to create, update, revise, package, troubleshoot, or audit a reusable skill.
- The target workflow is Linear, LightSpeed delivery, Figma-to-WordPress, support, discovery, AI-readiness, documentation, QA, launch, agent design, or another shared-team operating workflow.
- The request or Memory lacks the minimum reusable default needed to choose the right downstream creation path.

### Do not use when any are true

- The request already contains enough detail to route safely.
- Existing Memory already contains the required defaults.
- The user is asking for a one-off Linear issue, triage decision, status update, project pulse, SOP, QA finding, customer reply, launch checklist, PRD, content draft, or delivery artefact rather than reusable skill creation.
- A specialist skill clearly owns the task and does not need onboarding defaults.

## Required state

### `skill-intake-state.yaml`

Required:

- `default_workflow_type`

Ask only if missing:

> What kind of shared-team skill should this default to: triage, planning, customer analysis, status updates, docs, QA, delivery handoff, AI readiness, discovery, WordPress delivery, or something else?

Store:

```yaml
default_workflow_type: "<short workflow type>"
last_confirmed_at: "YYYY-MM-DD"
notes: "<optional short reusable note>"
```

## Optional defaults

Use these defaults unless the user gives a standing preference or the current task would benefit from asking.

### `skill-factory-preferences.yaml`

```yaml
default_package_shape: "full skill package"
preferred_validation_level: "standard"
markdown_output_profile: "standard factory layout"
last_updated_at: "YYYY-MM-DD"
```

Ask optional questions only when they materially improve future runs:

- Package shape: full skill package, draft `SKILL.md`, or structured audit.
- Validation level: lightweight, standard, or production-ready.
- Markdown profile: standard factory layout, client-ready, developer-ready, or compact internal handoff.

### `skill-factory-todos.md`

Append only short follow-up items that should not block the current request, for example:

```markdown
- Add example prompts for customer-analysis skill packages.
```

Do not use this file as a general activity log.

## Preflight workflow

1. Read the Memory files if they exist.
2. Compare the current request and persisted state against the trigger contract.
3. If the trigger does not match, skip this skill and route directly to the appropriate specialist skill.
4. If the request itself supplies missing required values, persist them immediately.
5. Re-check required state after persisting request-supplied values.
6. If all required state is present, do not ask onboarding questions; route the original request.
7. If required state is still missing, ask the single required question for `default_workflow_type`.
8. Persist the answer, then resume the original request immediately.

## Routing decision sequence

Apply this sequence after onboarding is complete:

1. Decide whether the user wants a reusable skill package or the workflow output itself.
2. If they want a reusable skill, route to the most specific skill-creation specialist.
3. If they want the workflow output itself, route away from this onboarding skill to the domain specialist.
4. If the work spans multiple domains, route to the orchestrator or router skill first, not to a narrow generator.
5. If no specialist matches, use `skill-creator` for skill work or normal ChatGPT behaviour for non-skill work.

## Shared team routing map

### Skill creation, packaging, and validation

- `skill-creator`: general ChatGPT skill creation, updates, validation, troubleshooting, packaging, and conversational questions about skills.
- `linear-app-skill-creator`: reusable skills for Linear-centred issue triage, planning, customer analysis, status updates, documentation, comments, handoffs, or workflow governance.
- `figma-wordpress-skill-creator`: reusable skills for Figma-to-WordPress, block themes, theme.json, block plugins, WooCommerce, publishing workflows, launch QA, analytics, migrations, or LightSpeed delivery processes.
- `agent-creator`: agent design packs, system prompts, requirements docs, tool-permission matrices, output templates, and agent-to-skill packaging decisions.
- `markdown-output-formatter`: skill-factory markdown structure, review format, changelog, copy-paste sections, and single-field packages.
- `markdown-content-validator` or `content-file-validator`: markdown, YAML frontmatter, semantic version fields, links, metadata, template compliance, or packaged documentation validation.

### Linear workflow specialists

Route away from this onboarding skill when the user needs the Linear workflow output itself rather than a reusable skill package:

- `linear-the-architect`: rewrite rough notes or vague requests into concrete Linear-style issues.
- `linear-triage-router`: route a single incoming issue by team, label, priority, owner direction, and next step.
- `linear-triage-rules-designer`: design reusable triage rules, ownership logic, priority rules, labels, statuses, escalations, and review gates.
- `linear-triage-sop-builder`: produce a prose SOP for triage ownership, review cadence, escalation, and inbox discipline.
- `linear-gap-analyzer`: identify missing context before triage, planning, development, QA, retest, approval, or client follow-up.
- `linear-sub-issue-splitter`: break overloaded Linear work into smaller sub-issues.
- `linear-duplicate-management-playbook`: define duplicate detection, canonical issue selection, merge rules, and customer-context preservation.
- `linear-unplanned-work-intake-audit`: review how bugs, requests, and feedback enter Linear and where context is lost.
- `linear-momentum-auditor`: find blocked, stale, or momentum-killing issues and recommend next actions.
- `linear-project-pulse`: summarise project health, momentum, risks, blockers, and likely next focus.
- `linear-voice-of-customer`: turn support, Slack, email, or customer signals into planning-ready Linear problem statements.
- `linear-decision-logger`: record durable team workflow decisions about naming, routing, labels, priorities, approvals, issue framing, escalation, or handoff.
- `linear`: use only when the user wants actual Linear workspace operations or broad Linear connector help rather than a reusable skill or advisory artefact.

### Support and customer workflow specialists

Route to these when the request is about support operations, customer evidence, or support-facing outputs:

- `ticket-triage`: classify and prioritise support tickets from Zendesk, Gmail, or similar sources.
- `customer-research`: build cited support-facing customer context, recent activity, risk, commitments, or pre-reply briefs.
- `case-investigation`: investigate one support issue end to end and produce an evidence-backed case file.
- `evidence-quality-review`: review support drafts, investigations, or trend reports for evidence gaps and unsupported claims.
- `draft-response`: draft customer-facing support replies from tickets, triage summaries, research briefs, or messy live threads.
- `customer-escalation`: package a support issue for engineering, product, security, or leadership escalation.
- `create-knowledge`: turn resolved issues or repeated questions into knowledge-base articles.
- `backlog-trend-analysis`: analyse Zendesk backlog health, support themes, and weekly support operations.

### LightSpeed project and delivery specialists

Route to these when the request is a LightSpeed delivery artefact rather than a reusable skill package:

- `lightspeed-project-intake-router`: partial project information, kickoff packs, missing context, and next-route decisions.
- `lightspeed-project-researcher`: source inventory, repo/design/site research, discovery notes, and PRD-ready evidence summaries.
- `lightspeed-prd-generator`: PRDs, product briefs, goals, non-goals, user stories, acceptance criteria, risks, assumptions, and open questions.
- `lightspeed-figma-wordpress-technical-brief`: Figma design-system insight into WordPress technical briefs and developer-ready architecture notes.
- `lightspeed-task-breakdown-planner`: implementation tasks, epics, dependency maps, estimates, QA checks, and delivery waves.
- `lightspeed-github-issue-drafter`: GitHub-ready markdown issue drafts from PRDs, briefs, plans, bugs, launch findings, or acceptance criteria.
- `lightspeed-implementation-plan-generator`: developer-ready sequencing, workstreams, branch strategy, testing approach, and handoff notes.
- `lightspeed-acceptance-test-planner`: acceptance test plans, QA scripts, validation matrices, responsive checks, accessibility checks, and regression coverage.
- `lightspeed-launch-qa-planner`: final launch QA planning for WordPress block theme, block plugin, or pattern-library projects.
- `lightspeed-launch-readiness-auditor`: final pre-launch QA, page-by-page checks, forms, analytics, redirects, SEO, accessibility, and go/no-go summary.
- `lightspeed-qa-findings-router`: triage QA findings, severity, ownership, GitHub-ready fixes, retest steps, and launch blocker routing.
- `lightspeed-project-status-reporter`: weekly status updates, client-facing summaries, milestone updates, blocker summaries, and stakeholder comms.
- `lightspeed-change-request-router`: scope-change triage, impact analysis, requirement deltas, approval gates, and change-log entries.
- `lightspeed-approval-gate-manager`: sign-off checklists, decision logs, go/no-go criteria, review packs, and approval checkpoints.
- `lightspeed-requirements-traceability-mapper`: requirement-to-task, acceptance, issue, QA, and launch-gate coverage matrices.
- `lightspeed-project-memory-manager`: project memory banks, decision logs, assumptions, task indexes, active context, and progress logs.
- `lightspeed-release-handoff-generator`: release notes, launch handoff packs, support transition notes, monitoring plans, and closure reports.
- `lightspeed-prd-task-pack-exporter`: downloadable project packs, markdown folder structures, indexes, source notes, and delivery archives.
- `lightspeed-prd-task-reviewer`: readiness, risk, acceptance-criteria, issue-quality, and go/no-go planning reviews.

### Design, Figma, and WordPress specialists

Route to the narrow specialist when the asset type is known; otherwise use the router/orchestrator first:

- `design-execution-packet`: normalise scattered design, website, Figma, WordPress, Asana, GitHub, email, QA, content, launch, or implementation inputs into a handoff-ready packet.
- `design-context-synthesis`: reconcile scattered or conflicting design context before briefs, layout directions, page concepts, or Figma-ready handoffs.
- `design-qa-readiness`: assess briefs, layout directions, page concepts, or Figma handoffs before development.
- `handoff-router`: decide whether a brief should route to image creation, Figma, code, WordPress, QA, or another specialist workflow.
- `wordpress-block-theme-router`: choose the correct block-theme specialist for parameters, patterns, template parts, templates, custom templates, block styles, section styles, or validation.
- `wordpress-asset-parameter-generator`: normalise block theme asset parameters, metadata headers, theme.json entries, and starter values.
- `wordpress-pattern-generator`: create WordPress block pattern files from briefs, Figma handoffs, block markup notes, or repo conventions.
- `wordpress-template-part-generator`: create shared template parts and insertion patterns for headers, footers, sidebars, comments, or approved parts.
- `wordpress-template-generator`: create hierarchy-aware block theme templates.
- `wordpress-custom-template-generator`: create custom templates and matching theme.json `customTemplates` entries.
- `wordpress-block-style-generator`: create individual block styles, registrations, variations, and CSS or theme.json guidance.
- `wordpress-section-style-generator`: create section-level styles for heroes, content bands, footers, feature sections, and larger layout zones.
- `wordpress-block-asset-validator`: validate block theme assets, block markup, pattern headers, template names, part references, and custom template registrations.
- `theme-color-token-enforcer`: audit or fix semantic colour token usage, raw colours, dark-token parity, and contrast risks in WordPress block themes.
- `pattern-extractor`: convert Figma designs into `ls-theme` WordPress block patterns with strict semantic token mapping and required downstream validation.
- `themejson-extractor-orchestrator`: orchestrate full theme.json token extraction from Figma variables.
- Use the specific `figma-themejson-*` extraction skill when the user asks for palette, typography, spacing, shadow, or style-variation extraction.

### AI readiness, chatbot, content, and governance specialists

Route to these for LightSpeed AI-readiness and chatbot work:

- `lightspeed-ai-readiness-router` or `lightspeed-ai-readiness-orchestrator`: guided client-specific AI readiness projects, sequence control, combined project packs, and next-skill routing.
- `lightspeed-ai-readiness-estimator`: proposal-ready AI-readiness estimates, chatbot scope, governance/content readiness paths, plugin review, and launch readiness.
- `ai-readiness-assessor`: readiness scoring, checklist interpretation, red flags, foundation work, governance work, content work, and chatbot readiness.
- `ai-governance-documentor`: governance summaries, lightweight policies, role maps, approval workflows, source controls, and prompt templates.
- `content-collection-planner`: content collection checklists, content gap reports, client request emails, and source-of-truth planning.
- `ai-chatbot-planner` or `chatbot-planning-orchestrator`: bounded website chatbot plans, approved sources, exclusions, behaviour rules, escalation, privacy notes, test scripts, and first draft prompts.
- `chatbot-estimate-calibrator`: tighten chatbot estimates, assumptions, exclusions, and commercial recommendations.
- `chatbot-discovery-question-prioritiser`: produce the smallest high-value discovery questions and evidence requests for weak chatbot briefs.
- `lightspeed-faq-and-chatbot-source-curator`: consolidate FAQs, prepare schema-ready FAQ sets, and create chatbot-safe source registers.
- `lightspeed-schema-and-ai-discoverability-planner`: schema, FAQ schema, internal linking, answer-engine optimisation, and AI visibility planning.
- `lightspeed-policy-page-generator`: policy and trust-page drafts, chatbot disclosures, AI governance pages, and review-ready wording separated from legal advice.

### Discovery, audit, optimisation, and launch-adjacent specialists

Route here when the task is discovery, audit, or optimisation rather than reusable skill creation:

- `discovery-source-intake`: gather run-specific evidence from notes, files, and available sources before drafting discovery packs.
- `discovery-onboarding`: collect missing reusable discovery defaults and resume the original website discovery request.
- `discovery-pack-review`: review discovery packs or section drafts for missing template sections, classification mistakes, and client/internal boundary issues.
- `technical-seo-audit`: crawlability, indexation, canonicals, metadata QA, migration SEO risk, redirects, sitemaps, robots, structured data, and technical SEO fix lists.
- `accessibility-discovery-reviewer`: accessibility risks, evidence gaps, recurring problem patterns, and validation needs.
- `website-performance-assessor`: speed, page weight, loading behaviour, Core Web Vitals signals, bottlenecks, and performance risks.
- `website-security-discovery-reviewer`: website security discovery, exposure areas, likely risks, unverified concerns, and specialist-validation needs.
- `content-audit-strategist`: website content audits, inventories, duplication, decay, content gaps, and strategy directions.
- `email-list-reviewer`: list quality, consent posture, segmentation, duplication, inactivity, deliverability, and governance gaps.
- `website-hosting-reviewer`: hosting arrangements, operational constraints, reliability risks, environment fit, and migration or optimisation needs.
- `post-launch-optimisation`: analytics-led CRO, content iteration, chatbot tuning, retention, conversion improvements, and prioritised optimisation roadmaps.

## Handoff behaviour

When handing off to another skill:

- Preserve the user's original request and any already-confirmed defaults.
- Do not ask the user to restate the same brief.
- Mention the route only when it helps the user understand the next output.
- Do not produce a standalone onboarding report.
- Do not save one-off details as reusable preferences.
- Use normal ChatGPT behaviour only after confirming that no shared-team specialist is a better fit.

## Output behaviour

When no question is required, continue directly with the routed task.

When a question is required, ask only that question and briefly explain why it matters. After the user answers, persist the answer and continue the original request.

When onboarding changes Memory or deferred todos, mention only changes relevant to the current request.

## Validation checklist

Before handing off to another skill, confirm internally that:

- `default_workflow_type` is known from the request or Memory;
- no one-off details were saved as reusable defaults;
- optional defaults were not over-collected;
- the downstream route is the most specific matching shared-team skill;
- the route separates reusable skill creation from one-off workflow output;
- the original request can continue without asking the user to restate it.

## Test prompts

Use these prompts to validate routing behaviour:

1. `Create a reusable skill that turns support tickets into Linear planning signals.`  
   Expected route: `linear-app-skill-creator`, optionally with `linear-voice-of-customer` as domain guidance if the user wants the workflow output rather than a skill.
2. `Update this block theme pattern generator skill so it routes token checks properly.`  
   Expected route: `figma-wordpress-skill-creator`, with awareness of `wordpress-pattern-generator` and `theme-color-token-enforcer`.
3. `Turn these messy notes into a Linear issue.`  
   Expected route: skip onboarding and use `linear-the-architect` because the user wants a one-off workflow output, not a reusable skill.
4. `Build a client AI readiness chatbot planning pack from this brief.`  
   Expected route: skip onboarding and use `lightspeed-ai-readiness-router`, `chatbot-planning-orchestrator`, or `ai-chatbot-planner` depending on the requested deliverable.
5. `Audit this skill package for broken markdown and frontmatter.`  
   Expected route: `skill-creator` plus `markdown-content-validator` or `content-file-validator`; do not ask onboarding questions unless workflow type is genuinely needed.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
