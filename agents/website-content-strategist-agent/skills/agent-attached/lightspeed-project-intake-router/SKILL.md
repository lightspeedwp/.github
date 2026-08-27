---
name: lightspeed-project-intake-router
description: The LightSpeed Project Intake Router skill helps you transform unclear or incomplete project inputs into a structured intake pack for effective workflow routing. Use this skill when you have messy project details, mixed materials, or uncertainties about next steps, enabling your team to identify clear actions without prematurely delivering a full PRD or implementation plan.
---

# LightSpeed Project Intake Router

## Purpose

Turn early, messy or partial LightSpeed project inputs into a structured kickoff intake pack that helps the team choose the right next workflow without prematurely writing the PRD, task plan, GitHub issues, implementation plan or launch QA pack.

Use this skill as the front door when the request combines unclear project scope, mixed source material, missing evidence, uncertain build type, or uncertainty about which LightSpeed shared-team skill should run next.

## Core rules

1. Produce an intake and routing output, not the downstream deliverable.
2. Separate confirmed evidence from assumptions, drafts and missing inputs.
3. Ask only the smallest set of high-value questions needed to unblock the next route.
4. Prefer a safe default route when the evidence is enough to proceed.
5. Route to the most specific downstream shared-team skill rather than trying to cover that specialist workflow here.
6. Include ready-to-copy prompt starters so a teammate can immediately run the next skill.
7. Keep outputs practical, scannable and paste-ready for Google Docs, GitHub, Asana or a Markdown project pack.

## Inputs to accept

Accept any combination of:

- client brief, sales note, estimate note or discovery note;
- Figma design system, prototype, frame, Make prototype, screenshot or export;
- live, staging or dev website URL;
- GitHub repository, issue, pull request or implementation note;
- Asana task, project notes, meeting notes, client email or workshop transcript;
- content pack, IA notes, sitemap, redirect notes, copy draft or policy input;
- audit findings, accessibility notes, performance notes, SEO notes, parity findings or QA results;
- analytics, GA4, GTM, Search Console, Looker Studio or conversion-tracking notes;
- AI-readiness, governance, chatbot, source-of-truth or FAQ notes.

## Workflow

1. Identify the project identity, business goal, stage and desired output.
2. Classify the project type, build type and main risk areas.
3. Build a source inventory using `assets/source-inventory-template.md` when a fuller table is useful.
4. Classify each source by evidence maturity.
5. Identify missing inputs as blockers, important gaps or later-stage gaps.
6. Select one primary route and optional secondary routes from `references/specialist-routing.md`.
7. Define approval gates from `references/approval-gates.md`.
8. Produce the kickoff intake pack using `assets/kickoff-pack-template.md` as the default structure.
9. Include prompt starters from `assets/prompt-starters-template.md` adapted to the selected routes.
10. Stop and hand off unless the user explicitly asks to proceed into the selected downstream workflow.

## Project classification

Classify projects as one or more of:

- WordPress block theme;
- WordPress block theme plus custom block plugin;
- existing classic or hybrid theme conversion;
- WooCommerce or ecommerce build;
- publishing, editorial, ad-tech or content-heavy platform;
- tourism, tour operator, Wetu or itinerary-led platform;
- AI readiness, governance, chatbot or source-of-truth project;
- migration, redesign, domain change or IA/content consolidation;
- lead-generation, professional-services or marketing website;
- internal LightSpeed product, plugin or design-system project.

Use `references/project-type-classification.md` for indicators and routing implications.

## Evidence status labels

Use these labels consistently:

- Confirmed: verified and safe to use for planning.
- Supplied but unreviewed: available but not yet checked.
- Draft: useful but not approved.
- Needs Review: needs specialist or stakeholder review before decisions.
- Evidence Required: a claim, decision or risk needs proof.
- Missing: not supplied.
- Not Applicable: intentionally out of scope.
- Blocker: required before the recommended next route can proceed safely.

## Required output sections

Every intake output must include:

1. Value, risk and next step.
2. Project snapshot.
3. Build type classification.
4. Known inputs and source inventory.
5. Evidence maturity table.
6. Missing information.
7. Clarifying questions.
8. Assumptions and risks.
9. Recommended workflow route.
10. Specialist skill routing.
11. Suggested output pack.
12. Approval gates.
13. Client-facing summary.
14. Internal LightSpeed notes.
15. Ready-to-copy next prompts.

## Routing model

Choose one primary route. Add secondary routes only when they are clearly needed.

### Intake and evidence routes

- Use `project-evidence-harvester` when evidence must be gathered and normalised before planning.
- Use `project-intake-evidence-normaliser` when mixed evidence must be cleaned into confirmed sources, exclusions and structured notes.
- Use `design-execution-packet` when scattered inputs need one execution-ready design or implementation handoff packet.
- Use `lightspeed-project-researcher` when the team needs source review, repo/design/site research, assumptions, blockers and PRD-ready discovery notes.

### Planning routes

- Use `lightspeed-prd-generator` when the next output is a standalone PRD or product brief.
- Use `lightspeed-figma-wordpress-technical-brief` when Figma design-system intent must become WordPress architecture and developer guidance.
- Use `lightspeed-prd-task-manager` when the user explicitly wants a combined PRD, technical brief, task pack and planning route.
- Use `lightspeed-task-breakdown-planner` when PRD and technical brief are approved and implementation tasks are needed.
- Use `lightspeed-implementation-plan-generator` when approved tasks need sequencing, branch strategy, dependencies and delivery controls.

### Design and WordPress routes

- Use `design-context-synthesis` when design inputs conflict or need reconciliation before a brief or handoff.
- Use `design-qa-readiness` when a design brief or Figma handoff needs readiness checks before development.
- Use `wordpress-block-theme-handoff` when approved design direction must become a practical block-theme build handoff.
- Use `wordpress-block-theme-router` when the request is specifically about block-theme assets and needs routing to patterns, templates, template parts, custom templates, block styles or section styles.
- Use `lightspeed-figma-wordpress-parity-auditor` when comparing Figma design-system intent against a WordPress implementation.

### GitHub, QA and launch routes

- Use `lightspeed-github-issue-drafter` when approved tasks or QA findings need GitHub-ready issue drafts.
- Use `lightspeed-requirements-traceability-mapper` when requirements, tasks, issues and QA checks must be mapped for coverage.
- Use `lightspeed-acceptance-test-planner` when acceptance tests, validation matrices or QA scripts are needed before implementation or launch.
- Use `lightspeed-launch-qa-planner` when launch QA scope needs planning.
- Use `lightspeed-qa-findings-router` when actual QA findings need severity, ownership, fixes or retest steps.
- Use `lightspeed-launch-readiness-auditor` when final pre-launch go/no-go checks are needed.
- Use `lightspeed-release-handoff-generator` when launch notes, handover docs, support transition notes or closure reports are needed.
- Use `lightspeed-launch-task-router` when launch work needs specialist sequencing across redirects, schema, analytics, policy, claims, parity and QA.

### Content, SEO, governance and AI routes

- Use `content-collection-planner` when the next step is client content requests, content gap lists or source-of-truth collection.
- Use `lightspeed-website-content-generator` when approved briefs and sources are ready for page copy, FAQs, CTAs, meta descriptions or chatbot-safe snippets.
- Use `lightspeed-redirect-map-planner` when URL structure, migrations, redirects or 404 risk are in scope.
- Use `lightspeed-schema-and-ai-discoverability-planner` when schema, FAQ schema, internal linking or answer-engine visibility is needed.
- Use `lightspeed-ga4-conversion-tracking-planner` when measurement, GTM, GA4, conversion events or dashboards need planning.
- Use `lightspeed-claim-register-auditor` when marketing claims, stats or outcomes need evidence review.
- Use `lightspeed-policy-page-generator` when privacy, cookie, accessibility, AI governance, chatbot disclosure or trust-page wording is needed.
- Use `lightspeed-ai-readiness-router` or `lightspeed-ai-readiness-orchestrator` when the project is primarily an AI-readiness programme needing guided sequencing.
- Use `ai-readiness-assessor`, `ai-governance-documentor`, `content-collection-planner` or `ai-chatbot-planner` for the specific readiness, governance, content or chatbot stage.

### Management and control routes

- Use `lightspeed-project-memory-manager` when a durable project memory bank, decision log, assumption register or task index is needed.
- Use `lightspeed-approval-gate-manager` when the next step is sign-off, go/no-go criteria, stakeholder review or approval control.
- Use `lightspeed-change-request-router` when approved scope is being changed.
- Use `lightspeed-project-status-reporter` when a stakeholder-ready status update is needed.
- Use `lightspeed-prd-task-reviewer` when a PRD, technical brief, task plan or GitHub issue pack needs quality review.
- Use `lightspeed-prd-task-pack-exporter` when the user needs a downloadable or organised project pack.

## Clarifying question discipline

Ask no more than five questions. Prefer three. If the next route is clear, do not ask questions before providing the intake pack. Mark unresolved items as assumptions, gaps or blockers.

Use `references/clarifying-questions.md` to choose questions that materially affect PRD, technical brief, routing, task planning or approval.

## Estimation preference

When task planning may follow, capture the likely estimation model:

- no estimates;
- T-shirt size;
- hours;
- sprint fit;
- complexity/risk only.

If the user is unsure, default to complexity/risk for internal planning and hours for client-facing proposals. Do not generate detailed estimates in this skill unless explicitly requested.

## Readiness tests

Use `references/test-prompts.md` when checking that the skill behaves correctly for happy-path, ambiguous and boundary requests. Treat the skill as ready only when it consistently routes to one justified primary skill, separates evidence from assumptions, includes approval gates and avoids producing downstream deliverables prematurely.

## Validation checklist

Before finalising the intake output, check that:

- the primary route is singular and justified;
- secondary routes are clearly optional or later-stage;
- no downstream deliverable has been written prematurely;
- all source statuses are explicit;
- blockers are separated from later-stage gaps;
- approval gates are included;
- prompt starters are specific enough for another teammate to use;
- client-facing notes exclude internal uncertainty that should stay internal.

## Output stance

Use UK English. Write for a LightSpeed teammate who needs to act quickly. Keep the structure clear, concise and operational. Avoid hype, vague advice, unsupported certainty and over-engineered process.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
