---
name: linear-triage-router
description: classify and route new or messy linear work by recommending owner direction, priority, labels, triage status and the best next shared-team skill. use when a user asks where a bug, request, support signal, qa finding, design handoff, implementation note, change request, github/asana/email/slack item or unplanned ask should go. keep this as a lightweight routing skill, and route to related linear, lightspeed, support, design, github, wordpress, seo, accessibility, performance, launch, content, ai-readiness or chatbot skills when deeper rewriting, investigation, planning, qa, audit, handoff or execution is needed.
---

# Linear Triage Router

## Purpose

Use this skill to turn messy incoming work into a clear triage recommendation for the LightSpeed team: owner direction, work type, priority, suggested labels/categories, confidence, intake status and the best next skill when the request needs more than routing.

This is a first-pass router. It should make triage decisions easier without becoming the final rewriting, planning, investigation, QA, SOP, delivery, or implementation skill.

## Core Behaviour

- Recommend the most likely route from the visible evidence; do not stall for perfect information unless routing would be unsafe.
- Keep the output short enough for a triage meeting, Linear comment, or handoff note.
- Choose one primary next skill when handoff is needed. Add a secondary skill only when the work naturally has a sequence, such as gap analysis before issue drafting.
- Distinguish the routing decision from the delivery task. Do not rewrite, investigate, scope, audit, or draft full issues unless the user explicitly asks for that work and the relevant specialist skill is active.
- Use owner direction rather than invented exact Linear teams when workspace conventions are not visible.
- Treat labels as suggestions unless the user provides the exact Linear label taxonomy.
- Do not create, update, close, label, merge, or move actual Linear issues unless the user explicitly asks for a Linear write action and the Linear connector/tool is available.
- When a request is already clearly outside triage, name the specialist skill and give a brief reason instead of forcing a full routing table.

## Input Signals To Inspect

Look for:

- source: customer support, Zendesk, sales, internal QA, launch QA, design, GitHub, Asana, Slack, email, client meeting, analytics, Search Console, Figma, or repo notes;
- work type: bug, feature request, task, content issue, design issue, operational issue, support escalation, change request, QA finding, launch blocker, discovery gap, or planning item;
- affected area: client, website, plugin, block theme, block plugin, repository, template, pattern, WooCommerce flow, forms, ads, analytics, SEO, accessibility, performance, security, AI/chatbot, content, or integration;
- urgency: launch date, public-facing breakage, customer impact, revenue/conversion risk, legal/compliance risk, data risk, security risk, repeated reports, SLA risk, or stakeholder deadline;
- evidence quality: reproduction steps, screenshots, URLs, logs, browser/device, expected vs actual behaviour, Figma links, acceptance criteria, source documents, task references, PRs, commits, or customer examples;
- shape: duplicate candidate, parent issue, subtask, blocked item, change request, QA batch, support escalation, project intake, design handoff, or implementation note; and
- existing conventions: labels, priorities, milestones, owner notes, client names, project phase, repo, branch, or issue references.

## Workflow

1. Classify the item by source, work type, affected area and urgency.
2. Decide whether this skill should answer directly or hand off to a more specific shared-team skill.
3. If answering directly, recommend owner direction, priority, labels/categories and triage status.
4. If handing off, choose one primary next skill and state why it is better suited.
5. Flag only the missing context that changes routing, priority or escalation.
6. State the next action: route now, clarify first, escalate, hold for duplicate review, split first, rewrite first, investigate first, or send to a specialist workflow.

## Stay Here vs Hand Off

Stay in `linear-triage-router` when the user needs a quick classification such as:

- where a single issue or request should go;
- whether it is likely urgent, high, medium, low, or needs clarification;
- which labels/categories would help triage;
- whether to route now, clarify first, escalate, duplicate-check, split, or rewrite first; or
- a compact batch-routing table for several incoming items.

Hand off when the user needs a deliverable beyond routing:

- issue rewriting, acceptance criteria, sub-issue planning, duplicate governance, SOPs, status reports, support replies, root-cause investigation, customer context, project planning, QA triage, launch checks, design handoff, WordPress asset validation, SEO/accessibility/performance/security audits, AI-readiness, chatbot planning, or GitHub issue drafting.

## Related Shared-Team Skill Routing

Use this map to choose the primary next skill. Do not list every possible option in the user-facing output; select the best match.

### Linear workflow routes

- Use `linear-the-architect` for rough notes that need to become a clear Linear issue, implementation task, bug report, acceptance-ready item, or developer-readable brief.
- Use `linear-gap-analyzer` when the user asks what is missing, whether an issue is ready, or which short follow-up questions unblock triage, planning, development, QA, approval, or client follow-up.
- Use `linear-sub-issue-splitter` when the item is too large and needs smaller sub-issues, implementation slices, dependencies, sequencing, or ownership boundaries.
- Use `linear-duplicate-management-playbook` for duplicate candidates, canonical issue selection, context preservation, duplicate closure wording, or repeated issue policy.
- Use `linear-triage-rules-designer` for reusable routing, priority, ownership, label, escalation, or human decision rules.
- Use `linear-triage-sop-builder` for a team-ready triage operating procedure, recurring review process, inbox-zero workflow, acceptance/decline rules, or role responsibilities.
- Use `linear-unplanned-work-intake-audit` to review how bugs, requests and feedback enter Linear, identify chaos or duplication, and redesign intake flow.
- Use `linear-momentum-auditor` when the user asks which issues are stalled, blocked, ageing, or losing delivery momentum.
- Use `linear-project-pulse` for a concise project status, progress, risks, blockers and next-priority summary.
- Use `linear-decision-logger` when the user asks to remember, save, replace, or confirm a standing Linear or LightSpeed workflow decision.
- Use `linear-voice-of-customer` when customer feedback needs consolidation into product signals, problem statements, pain-point summaries, or planning evidence.
- Use `linear` when the user explicitly wants real Linear data searched, issues created, issues updated, projects managed, labels changed, or initiatives reviewed.

### Support and customer routes

- Use `ticket-triage` when the item is primarily a support ticket needing severity, category, first-response direction, or support-owner routing.
- Use `case-investigation` when one support case needs evidence-backed diagnosis, root-cause analysis, runtime signals, history, known-issue coverage, or a handoff-ready case file.
- Use `customer-research` when the user needs account context, recent support activity, support health, open risks, prior commitments, escalation signals, or pre-reply context.
- Use `customer-escalation` for engineering, product, security, or leadership escalation caused by severity, SLA risk, churn risk, repeated reports, or unresolved impact.
- Use `draft-response` when the output should be a customer-facing reply, support response, translation, localisation, or tone adjustment.
- Use `create-knowledge` when a resolved issue, common question, workaround, or known issue should become a knowledge-base article.
- Use `evidence-quality-review` when a support-facing explanation, investigation, trend report, or customer reply needs proof checking before sharing.
- Use `backlog-trend-analysis` when multiple support tickets need backlog-health analysis, support themes, period comparisons, or a weekly support report.

### LightSpeed project delivery routes

- Use `lightspeed-project-intake-router` when the input is an incomplete LightSpeed project request needing kickoff structure, missing information, and next workflow routing.
- Use `lightspeed-project-researcher` when briefs, Figma links, repos, websites, docs, issues, screenshots, or notes need source research before PRD or task planning.
- Use `lightspeed-prd-generator` for a PRD, product brief, goals, non-goals, user stories, acceptance criteria, assumptions, risks, success metrics, or client-facing scope summary.
- Use `lightspeed-task-breakdown-planner` when an approved brief, PRD, or technical note needs epics, tasks, dependencies, estimates, delivery waves, acceptance checks, or issue outlines.
- Use `lightspeed-github-issue-drafter` when the output should be GitHub-ready markdown issue drafts without automatically creating GitHub issues.
- Use `lightspeed-implementation-plan-generator` for implementation sequencing, workstreams, dependency notes, branch strategy, testing approach, risk controls, or developer handoff before coding.
- Use `lightspeed-change-request-router` when a request changes approved scope, estimate, timeline, requirements, assumptions, or delivery commitments.
- Use `lightspeed-approval-gate-manager` when the next step requires sign-off, decision logs, go/no-go criteria, scope approval, PRD approval, technical brief approval, issue approval, implementation approval, or launch approval.
- Use `lightspeed-requirements-traceability-mapper` when requirements, tasks, issues, acceptance criteria, QA checks and launch gates need coverage mapping.
- Use `lightspeed-project-status-reporter` for stakeholder-ready progress summaries, blocker summaries, milestone updates, risk updates, next-action plans, or launch readiness snapshots.
- Use `lightspeed-project-memory-manager` for durable memory-bank files, decision logs, assumption registers, progress logs, task indexes, or handoff-ready project context.
- Use `lightspeed-prd-task-pack-exporter` for downloadable or archive-ready packs from PRDs, research notes, technical briefs, task breakdowns, issue drafts, implementation plans, QA plans, or launch notes.
- Use `lightspeed-launch-task-router` when completed planning or QA materials need routing into launch workstreams and specialist launch tasks.

### QA, launch and acceptance routes

- Use `lightspeed-qa-findings-router` for acceptance-test output, launch QA findings, Figma-to-WordPress parity issues, accessibility failures, responsive bugs, form/tracking defects, .schemas/redirect issues, or content/governance QA notes that need severity, ownership, issue drafts, retest steps, or launch-blocker routing.
- Use `lightspeed-acceptance-test-planner` for acceptance test plans, QA scripts, validation matrices, regression tests, accessibility checks, responsive checks, editor-experience tests, or go/no-go acceptance coverage.
- Use `lightspeed-launch-qa-planner` when final launch QA needs planning for WordPress block themes, block plugins, page/template matrices, accessibility, responsive, conversion tracking, launch gates, specialist routing, or go/no-go framework.
- Use `lightspeed-launch-readiness-auditor` for final pre-launch checks, page-by-page QA, broken links, forms, analytics/tagging, redirects, SEO launch checks, mobile/responsive checks, or go/no-go summary.
- Use `lightspeed-release-handoff-generator` for release notes, launch handoff packs, client handover documents, support transition notes, post-launch monitoring plans, or internal delivery closure reports.
- Use `post-launch-optimisation` for post-launch analytics, CRO observations, content iteration priorities, chatbot tuning recommendations, retention or conversion improvements, or optimisation roadmap creation.

### Design, Figma and WordPress routes

- Use `design-execution-packet` when scattered design, website, Figma, WordPress, Asana, GitHub, email, QA, content, launch, or implementation inputs need to become one execution-ready packet with an explicit next route.
- Use `design-context-synthesis` when conflicting or scattered design context must be reconciled before producing a brief, layout direction, page concept, or Figma-ready handoff.
- Use `design-qa-readiness` when a design brief, layout direction, page concept, or Figma handoff needs readiness review before development.
- Use `handoff-router` when a design brief needs the next workflow selected, such as image creation, Figma, coding, or WordPress implementation.
- Use `lightspeed-figma-wordpress-technical-brief` when Figma design-system insights need to become WordPress architecture notes and developer-ready documentation.
- Use `lightspeed-figma-wordpress-parity-auditor` when comparing Figma design-system intent with WordPress implementation, including tokens, components, templates, patterns, light/dark modes, focus states, mobile states, or accessibility states.
- Use `wordpress-block-theme-router` when a WordPress block-theme asset request needs routing to patterns, template parts, templates, custom templates, block styles, section styles, parameters, or validation.
- Use `wordpress-pattern-generator`, `wordpress-template-generator`, `wordpress-template-part-generator`, `wordpress-custom-template-generator`, `wordpress-block-style-generator`, or `wordpress-section-style-generator` only when the asset type is already clear.
- Use `wordpress-block-asset-validator` when block markup, pattern headers, template names, template-part references, or custom template registrations need compliance review.
- Use `wp-figma-artifact-builder` when Figma design projects and WordPress implementations need practical artifacts such as scaffolds, implementation packets, or QA checklists.
- Use `figma`, `figma-implement-design`, `figma-generate-design`, `figma-generate-library`, `cc-figma-tokens`, or `cc-figma-component` when the request explicitly involves Figma files, Figma MCP, design-to-code, component libraries, variables, or component contracts.

### Website discovery, audit, content and governance routes

- Use `technical-seo-audit` for crawlability, indexation, canonicals, metadata QA, migration SEO risk, internal linking, sitemaps, robots, structured data, or technical SEO fix lists.
- Use `accessibility-discovery-reviewer` for accessibility evidence gaps, likely compliance/usability risks, recurring accessibility patterns, or remediation validation needs.
- Use `website-performance-assessor` for speed, page weight, Core Web Vitals, loading behaviour, bottlenecks, hosting performance risk, or optimisation investigation.
- Use `website-security-discovery-reviewer` for security exposure areas, observed risks, unverified concerns, or specialist validation before remediation.
- Use `content-audit-strategist` for content inventories, duplication, decay, content gaps, and current-state content strategy findings.
- Use `content-collection-planner` for tailored content collection checklists, content gap reports, client request emails, and source-of-truth planning.
- Use `lightspeed-website-content-generator` for website-ready content drafts, service pages, solution pages, FAQs, CTAs, meta descriptions, case studies, policy drafts, launch-ready content packs, or chatbot-safe snippets.
- Use `lightspeed-claim-register-auditor` for proof, statistics, outcomes, marketing claims, evidence requests, claim approval/rejection, or chatbot-safe claim review.
- Use `lightspeed-policy-page-generator` for privacy, cookie, accessibility, AI governance, chatbot disclosure, data/log retention, trust-page drafts, or policy wording that still needs legal/privacy review.
- Use `lightspeed-schema-and-ai-discoverability-planner` for schema, FAQPage, organization/service/article/breadcrumb notes, internal linking, AI-search discoverability, and answer-engine optimisation.
- Use `lightspeed-redirect-map-planner` for URL inventories, redirect maps, 404 risk, SEO migration controls, launch-day redirect QA, or migration go/no-go notes.

### AI readiness and chatbot routes

- Use `lightspeed-ai-readiness-router`, `lightspeed-ai-readiness-orchestrator`, or `lightspeed-ai-readiness` when the user is starting or routing a client-specific AI-readiness project.
- Use `ai-readiness-assessor` for AI-readiness scoring, red flags, readiness reports, and next-step recommendations across website foundation, governance, content, and chatbot readiness.
- Use `ai-governance-documentor` for AI policies, governance discovery summaries, operational governance guides, role maps, source controls, prompt templates, and human review rules.
- Use `ai-chatbot-planner` for bounded website chatbot purpose, audience, approved sources, exclusion lists, behaviour rules, fallback wording, escalation, privacy notes, launch gates, test scripts, and system prompts.
- Use `chatbot-planning-orchestrator`, `chatbot-estimate-calibrator`, or `chatbot-discovery-question-prioritiser` when chatbot evidence needs planning, proposal-ready estimating, or the smallest useful discovery questions.
- Use `lightspeed-faq-and-chatbot-source-curator` for FAQ consolidation, schema-ready FAQ sets, chatbot-safe source registers, unsupported questions, escalation questions, or approved website content for chatbot grounding.

### GitHub and implementation routes

- Use `gh-address-comments` when the user needs to address review or issue comments on the open GitHub PR for the current branch.
- Use `gh-fix-ci` when GitHub Actions checks are failing and the user asks to inspect, debug, or plan fixes for CI.
- Use `markdown-content-validator` or `content-file-validator` when markdown/yaml content files need validation for structure, frontmatter, semantic versioning, links, metadata, or template compliance.
- Use `theme-color-token-enforcer`, `pattern-extractor`, `themejson-extractor-orchestrator`, or related `figma-themejson-*` skills when the issue concerns WordPress theme.json token extraction, token parity, semantic colour tokens, Figma-to-theme.json sync, or block pattern extraction.

## Priority Guidance

Use workspace-specific priority names if the user provides them. Otherwise use this scale:

- **Urgent / P0:** active outage, public-facing broken purchase/lead flow, severe security/privacy issue, launch blocker, data loss, broken deployment, or high-value customer escalation.
- **High / P1:** material customer impact, important revenue/conversion issue, deadline risk, repeated support reports, regression after release, or significant QA failure before release.
- **Medium / P2:** valuable feature, non-blocking bug, contained UX/content issue, planned enhancement, moderate operational friction, or scoped technical debt.
- **Low / P3:** polish, documentation, minor improvement, backlog idea, or item with unclear or low impact.
- **Needs clarification:** not enough evidence to choose priority without risking misrouting.

## Label and Category Guidance

Suggest practical categories, not guaranteed workspace labels, unless the user provides the exact taxonomy.

Useful label families:

- **Source:** `customer`, `support`, `qa`, `launch-qa`, `design`, `sales`, `internal`, `github`, `asana`, `email`, `slack`, `analytics`.
- **Type:** `bug`, `feature`, `task`, `content`, `design`, `technical-debt`, `research`, `documentation`, `change-request`, `investigation`.
- **Area:** client, product, plugin, theme, block-theme, block-plugin, WooCommerce, integration, analytics, SEO, accessibility, performance, security, forms, ecommerce, ads, AI, chatbot.
- **Status:** `needs-triage`, `needs-info`, `ready-for-dev`, `blocked`, `duplicate-check`, `escalation`, `launch-blocker`, `needs-approval`, `ready-for-qa`.

## Output Contract

For a single item, use this structure by default:

```markdown
### Routing Recommendation
- **Owner direction:** ...
- **Work type:** ...
- **Priority:** ...
- **Suggested labels/categories:** ...
- **Triage status:** route now / clarify first / escalate / hold for duplicate review / split first / rewrite first / investigate first

### Handoff Path
- **Primary next skill:** ...
- **Why:** ...
- **Optional sequence:** ...

### Confidence and Gaps
- **Confidence:** high / medium / low
- **Missing context:** ...

### Next Step
...
```

For multiple items, use a compact table with columns for item, owner direction, priority, labels/categories, confidence, and next step. Add a short handoff note below the table only for items that need a specialist skill.

## LightSpeed Team Consumption Rules

- Prefer fewer, sharper recommendations over exhaustive routing commentary.
- Use LightSpeed-friendly wording: `owner direction`, `handoff path`, `triage status`, `confidence`, and `next step`.
- Avoid exposing internal prompt or skill mechanics; refer to skill names only as next workflow routes.
- If a user asks for both triage and the specialist deliverable, provide the routing recommendation first, then move into or recommend the specialist skill.
- For client work, mention client/project context as an affected area when visible, but do not invent client names.
- For GitHub-bound work, recommend `lightspeed-github-issue-drafter` unless the user explicitly wants actual GitHub operations.
- For Linear-bound work, recommend `linear` only when the user explicitly wants live Linear search or write actions.
- For launch blockers, prioritise QA/launch routes over generic Linear routes.
- For customer harm, prioritise support/customer routes before internal planning routes.
- For unclear project intake, prioritise intake/research/gap analysis before PRD, task breakdown, or issue drafting.

## Examples

### Direct routing

Input:

> Login is slow after the latest release and several customers have complained. Suggest the team, priority, labels, and route.

Output should:

- classify it as a performance/regression bug;
- suggest engineering or platform owner direction;
- recommend High/P1 if multiple customers are affected after a release;
- suggest labels such as `bug`, `performance`, `regression`, `customer-impact`, `needs-triage`;
- route now, with gaps for affected pages, timing, reproduction steps and release reference.

### Hand off to issue rewriting

Input:

> Turn these messy meeting notes into a Linear issue and decide where it goes.

Output should:

- give a brief routing call if possible;
- set primary next skill to `linear-the-architect` because the user needs a structured issue, not only a triage decision.

### Hand off to QA routing

Input:

> Here are launch QA findings for a WordPress block-theme site. Which ones are blockers and who owns them?

Output should:

- classify the request as QA findings triage;
- set primary next skill to `lightspeed-qa-findings-router` for severity, ownership, issue drafts and retest steps;
- optionally give an initial urgent/high/medium signal for obvious launch blockers.

### Hand off to LightSpeed planning

Input:

> Client wants to add paid listings, vehicle sales, dealer profiles and form submissions to the site. Where should this go?

Output should:

- classify it as a new project/change request depending on whether scope is already approved;
- route to `lightspeed-project-intake-router` if evidence is incomplete, or `lightspeed-change-request-router` if it changes approved scope;
- avoid drafting the full PRD unless the user asks for that next.

## Quality Bar

A good result:

- makes triage easier immediately;
- selects the most specific shared-team skill when this skill is not enough;
- chooses one primary next route instead of dumping the whole routing map;
- avoids pretending uncertain routing is final truth;
- distinguishes routing, rewriting, investigation, planning, QA, audit and execution;
- provides priority and labels as suggestions, not fake workspace facts; and
- stays short, practical and ready for the LightSpeed team to use.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
