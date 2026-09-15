# Workflow Router

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

Use this reference when deciding which LightSpeed AI readiness workflow should own the next deliverable.

## Stage decision tree

| Stage / signal | Primary route | Output | Return-to-router check |
|---|---|---|---|
| Prospect / early lead with limited detail | `ai-readiness-assessor` | Lightweight readiness summary, evidence gaps and assessment CTA | Decide whether governance or content collection should follow. |
| Completed readiness checklist or website evidence | `ai-readiness-assessor` | Full scorecard, readiness risks and action plan | Convert recommendations into governance/content/chatbot sequence. |
| User wants full guided programme | `lightspeed-ai-readiness` or `lightspeed-ai-readiness-orchestrator` | Managed readiness, governance, content and chatbot project flow | Build combined pack or proposal notes when outputs exist. |
| Proposal or commercial recommendation needed | `lightspeed-ai-readiness-estimator` | Proposal-ready recommendation, package fit, assumptions and scope notes | Check whether supporting specialist outputs are still missing. |
| AI use cases, approvals, review paths or risk controls are unclear | `ai-governance-documentor` | Discovery summary, governance matrix, policy guide or prompt rules | Decide whether content/source work can proceed. |
| Missing source material, page briefs, content ownership or content approval | `content-collection-planner` | Content request list, source tracker and gap report | Decide whether FAQ/source curation or chatbot planning is now viable. |
| FAQs or approved answer sources are needed | `lightspeed-faq-and-chatbot-source-curator` | FAQ map, chatbot-safe source register, unsupported question list | Decide whether chatbot planning or .schemas/discoverability planning follows. |
| Chatbot idea but source/governance unknown | `chatbot-discovery-question-prioritiser` then `chatbot-planning-orchestrator` | Minimal discovery questions, source readiness and go/no-go | Do not proceed to implementation until gates pass. |
| Chatbot planning is appropriate | `ai-chatbot-planner` | Purpose, audience, scope, behaviour, fallback, escalation, privacy notes, tests and first prompt draft | Estimate or launch-readiness route next. |
| Chatbot estimate exists but needs tightening | `chatbot-estimate-calibrator` | Assumptions, exclusions, firmer scope and proposal recommendation | Feed into proposal pack. |
| Public policy, trust or disclosure wording requested | `lightspeed-policy-page-generator` | Review-safe page draft or wording brief | Flag legal/privacy review where needed. |
| Claims, statistics or outcome wording need validation | `lightspeed-claim-register-auditor` | Claim register and approval status | Feed approved claims into content/chatbot/schema work. |
| AI-search, schema or answer-engine optimisation requested | `lightspeed-schema-and-ai-discoverability-planner` | Schema/internal-linking/AI-discoverability plan | Feed into launch QA or content backlog. |
| Project approaching launch | `lightspeed-launch-readiness-auditor` | Launch checklist, go/no-go summary and fix list | Route launch blockers to specialist skills. |
| Live project needing improvement | `post-launch-optimisation` | Optimisation roadmap, content/chatbot tuning and backlog priorities | Feed findings into retainer or issue drafts. |

## Project type detection

Detect likely types and note routing implications:

- **WooCommerce / ecommerce**: check product data, support policy, returns, privacy, transactional content, cart/checkout tracking and sensitive customer data.
- **Tour operator / tourism**: check itineraries, destinations, Wetu/source data, seasonal content, enquiry handling, high-value lead escalation and claim safety.
- **Publisher / media**: check editorial governance, advertising claims, content freshness, authoritativeness, schema, archives and ad/reporting implications.
- **Education / LMS**: check course accuracy, learner privacy, age sensitivity, certification claims and support escalation.
- **Professional services**: check service claims, case studies, lead qualification, advice boundaries and trust pages.
- **Membership / subscription**: check gated content, retention journeys, billing/support boundaries and onboarding content.
- **Regulated or sensitive sector**: prioritise governance, claims, privacy and legal review before automation or chatbot work.
- **General brochure / lead-generation website**: start with readiness, content structure, trust signals and conversion measurement.

## Evidence check before each stage

Before starting or routing a stage, capture:

1. What evidence is available now?
2. Which evidence is approved, client-provided, internal draft, stale, inferred or missing?
3. Is the output internal, client-facing or both?
4. Should the result be a standalone artefact or part of a combined project pack?
5. Are there privacy, claims, source-quality, escalation or launch-gate risks?

## Stop conditions

Stop and ask one focused question, or route to governance/source readiness first, when:

- The website URL or client context is completely missing and the route cannot be inferred.
- Chatbot planning is requested but approved source content is unknown.
- Regulated, sensitive or high-risk advice use cases are detected.
- Privacy, logging, CRM, lead capture or personal data handling is mentioned but unclear.
- Proposal notes are requested without enough delivery scope to avoid misleading estimates.
- Claims or statistics are requested without evidence.

## Team-ready routing note template

```markdown
## Recommended route
- Skill: [skill]
- Stage: [stage]
- Why this route: [reason]
- Inputs to provide: [minimum inputs]
- Expected output: [deliverable]

## Gaps / risks
- [gap]

## Reusable next prompt
[Prompt the LightSpeed team can paste into a new chat]
```

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
