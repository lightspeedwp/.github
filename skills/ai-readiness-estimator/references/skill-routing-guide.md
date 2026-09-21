# Skill Routing Guide

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

Use this guide to decide whether a LightSpeed AI-readiness request should stay in the main estimator workflow or route to an attached specialist skill.

## Core routing rules

- Start with the user’s requested outcome, not the name of a skill.
- Use the narrowest skill that cleanly matches the deliverable.
- Use one planning or assessment skill before specialist drafting when the workstream is unclear.
- Do not force a skill when the main estimator workflow can handle the request reliably.
- Do not route to a skill that is not currently attached to the agent.
- Keep onboarding separate from estimate-specific scoping.
- If two skills seem relevant, choose the one earlier in the workflow unless the user explicitly asks for the later-stage deliverable.

## Workflow-stage routing

1. **Orchestrate** — define the project path and next workstream.
2. **Onboard** — capture durable project defaults only when missing.
3. **Assess or plan** — determine readiness, governance, content, chatbot, launch, SEO, or measurement direction.
4. **Curate or draft** — turn approved inputs into structured artefacts.
5. **Audit or validate** — check quality, launch readiness, claims, technical SEO, or markdown structure.
6. **Optimise** — review post-launch performance and prioritise improvements.

## Primary routing table

| User outcome | Route to | Use when | Avoid when |
|---|---|---|---|
| Broad AI-readiness project path, multiple deliverables, or “what next?” | `lightspeed-ai-readiness-orchestrator` | The route is unclear or spans readiness, governance, content and chatbot planning. | The user already asked for one clear specialist deliverable. |
| Durable project defaults | `lightspeed-project-onboarding` | A stable project anchor, recurring source location, or standing preference is missing and should be reused later. | Missing details only affect the current estimate. |
| AI-readiness score or gap assessment | `ai-readiness-assessor` | The user wants scoring, readiness findings, red flags, or next-step recommendations. | The task is mainly governance, chatbot planning, content collection, or public policy copy. |
| Internal AI governance | `ai-governance-documentor` | The user wants approval flows, review rules, role maps, source controls, or operating guidance. | The user wants public-facing policy or disclosure wording. |
| Content source collection | `content-collection-planner` | The user needs a content checklist, source gaps, folder structure, or client request list. | Inputs are already approved and the task is website copy or FAQ curation. |
| Chatbot strategy and behaviour | `ai-chatbot-planner` | The user wants chatbot scope, allowed topics, fallback, escalation, launch rules, or AI Engine planning. | The task is only FAQ/source curation or public disclosure wording. |
| Public policy, disclosure, trust, accessibility, privacy, or cookie wording | `lightspeed-policy-page-generator` | Approved governance decisions need to become public-facing copy or policy briefs. | Governance rules are still unsettled. |
| Launch QA planning | `lightspeed-launch-qa-planner` | The user needs QA scope, matrices, gates, and specialist routing before final audits. | The user wants the final audit itself. |
| Final launch readiness | `lightspeed-launch-readiness-auditor` | The user wants broad pre-launch checks, page QA, forms, responsiveness, accessibility, analytics, or go/no-go summary. | The core question is deep technical SEO or QA planning. |
| Redirect and migration controls | `lightspeed-redirect-map-planner` | URL structures, redesigns, migrations, redirects, or 404 risks matter. | No URL-change or migration context exists. |
| GA4/GTM/conversion measurement | `lightspeed-ga4-conversion-tracking-planner` | The user needs event plans, GTM triggers, dashboard briefs, or tracking governance. | The user wants broader post-launch optimisation. |
| Schema and AI discoverability planning | `lightspeed-schema-and-ai-discoverability-planner` | The user needs structured data, FAQ schema, internal linking, or answer-engine planning. | The user wants crawlability, indexation, canonicals, or technical SEO diagnosis. |
| FAQ and chatbot-safe sources | `lightspeed-faq-and-chatbot-source-curator` | The user wants FAQ consolidation, source registers, unsupported questions, or escalation cases. | Source material still needs to be collected. |
| Figma-to-WordPress parity | `lightspeed-figma-wordpress-parity-auditor` | Design intent versus implementation parity is the core issue. | The request is broad launch QA without a design-system parity question. |
| Website copy from approved inputs | `lightspeed-website-content-generator` | The user wants service pages, FAQs, CTAs, meta descriptions, case studies, or answer snippets from approved planning artefacts. | Source material is weak, unapproved, or policy-specific. |
| Claim risk and proof review | `lightspeed-claim-register-auditor` | The user wants claims classified, risky wording flagged, or evidence mapped before publication. | The task is general drafting without a claim-risk focus. |
| Technical SEO diagnosis | `technical-seo-audit` | The user wants crawlability, indexation, canonicals, metadata, sitemap health, or migration SEO diagnosis. | The user wants schema planning or broad launch go/no-go review. |
| Post-launch improvement roadmap | `post-launch-optimisation` | The project is live and the user wants analytics, SEO, CRO, content, or chatbot performance priorities. | The project is still pre-launch. |
| Markdown/frontmatter/schema validation | `markdown-content-validator` | The task explicitly asks for markdown validation, frontmatter, schema, or version checks. | The task is ordinary Markdown-based planning or drafting. |

## Overlap resolution

- **Orchestrator vs specialist:** use the orchestrator only when the workstream is unclear or spans multiple stages.
- **Onboarding vs orchestrator:** onboarding is only for reusable defaults; otherwise use the orchestrator or main workflow.
- **Governance vs policy:** internal operating rules go to governance; public wording goes to policy-page generation.
- **Content collection vs website copy:** missing or unapproved content goes to collection; approved inputs ready for drafting go to website content generation.
- **Chatbot planner vs FAQ curator:** strategy and behaviour go to chatbot planning; curated source sets go to FAQ/source curation.
- **Launch planner vs launch auditor:** planner defines the QA approach; auditor checks real readiness evidence.
- **Launch readiness vs technical SEO:** broad go/no-go goes to launch readiness; crawl/indexation/canonical diagnosis goes to technical SEO.
- **Schema planner vs technical SEO:** structured-data and discoverability planning go to schema; technical diagnosis goes to technical SEO.
- **GA4 planner vs optimisation:** pre-launch measurement design goes to GA4; post-launch performance improvement goes to optimisation.

## Decision shortcuts

- “What should we do next?” -> `lightspeed-ai-readiness-orchestrator`
- “Remember this project for later” -> `lightspeed-project-onboarding`
- “Assess this website’s AI readiness” -> `ai-readiness-assessor`
- “Create governance docs” -> `ai-governance-documentor`
- “Work out what content we need” -> `content-collection-planner`
- “Plan the chatbot” -> `ai-chatbot-planner`
- “Draft policy or disclosure wording” -> `lightspeed-policy-page-generator`
- “Plan launch QA” -> `lightspeed-launch-qa-planner`
- “Check launch readiness” -> `lightspeed-launch-readiness-auditor`
- “Plan redirects” -> `lightspeed-redirect-map-planner`
- “Plan conversion tracking” -> `lightspeed-ga4-conversion-tracking-planner`
- “Plan schema or AI discoverability” -> `lightspeed-schema-and-ai-discoverability-planner`
- “Consolidate chatbot-safe FAQs” -> `lightspeed-faq-and-chatbot-source-curator`
- “Compare Figma and WordPress” -> `lightspeed-figma-wordpress-parity-auditor`
- “Draft website copy from approved source notes” -> `lightspeed-website-content-generator`
- “Audit claims before publication” -> `lightspeed-claim-register-auditor`
- “Run a technical SEO audit” -> `technical-seo-audit`
- “Review post-launch performance” -> `post-launch-optimisation`
- “Validate Markdown/frontmatter/schema” -> `markdown-content-validator`

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

_Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team_
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
