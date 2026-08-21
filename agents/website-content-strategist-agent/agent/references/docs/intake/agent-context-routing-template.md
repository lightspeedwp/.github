# Agent context routing template

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
[![actions-minute-savings-watch](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml)
[![allocate-pr-issue-to-milestone](https://github.com/lightspeedwp/.github/actions/workflows/allocate-pr-issue-to-milestone.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/allocate-pr-issue-to-milestone.yml)
[![awesome-github-site](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml)
[![badges-documentation-update](https://github.com/lightspeedwp/.github/actions/workflows/badges-documentation-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-documentation-update.yml)
[![badges-health-check](https://github.com/lightspeedwp/.github/actions/workflows/badges-health-check.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-health-check.yml)
[![badges-readme-status](https://github.com/lightspeedwp/.github/actions/workflows/badges-readme-status.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-readme-status.yml)
[![badges-workflow-audit](https://github.com/lightspeedwp/.github/actions/workflows/badges-workflow-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-workflow-audit.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![checklist-finalisation](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml)
[![checks](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml)
[![cleanup-branches](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml)
[![docs-maintenance](https://github.com/lightspeedwp/.github/actions/workflows/docs-maintenance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/docs-maintenance.yml)
[![docs-validation](https://github.com/lightspeedwp/.github/actions/workflows/docs-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/docs-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![flaky-test-detection](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml)
[![gitleaks-reusable](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-reusable.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-reusable.yml)
[![gitleaks-update](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-update.yml)
[![gitleaks](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks.yml)
[![issue-create-enhanced](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-enhanced.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-enhanced.yml)
[![issue-create-from-template](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml)
[![issue-fields-backfill](https://github.com/lightspeedwp/.github/actions/workflows/issue-fields-backfill.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-fields-backfill.yml)
[![issue-health-audit](https://github.com/lightspeedwp/.github/actions/workflows/issue-health-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-health-audit.yml)
[![issue-labeling-automation](https://github.com/lightspeedwp/.github/actions/workflows/issue-labeling-automation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-labeling-automation.yml)
[![issue-project-field-sync](https://github.com/lightspeedwp/.github/actions/workflows/issue-project-field-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-project-field-sync.yml)
[![issue-remediation-automation](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-automation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-automation.yml)
[![issue-remediation-bulk](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-bulk.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-bulk.yml)
[![issues](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml)
[![label-audit-report](https://github.com/lightspeedwp/.github/actions/workflows/label-audit-report.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/label-audit-report.yml)
[![labeling-governance](https://github.com/lightspeedwp/.github/actions/workflows/labeling-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling-governance.yml)
[![labeling](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml)
[![main-branch-guard](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml)
[![manage-blocking-status-labels](https://github.com/lightspeedwp/.github/actions/workflows/manage-blocking-status-labels.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/manage-blocking-status-labels.yml)
[![meta-agent-validation](https://github.com/lightspeedwp/.github/actions/workflows/meta-agent-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta-agent-validation.yml)
[![meta-labels-sync](https://github.com/lightspeedwp/.github/actions/workflows/meta-labels-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta-labels-sync.yml)
[![meta](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml)
[![metadata-governance](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml)
[![metrics-pipeline](https://github.com/lightspeedwp/.github/actions/workflows/metrics-pipeline.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-pipeline.yml)
[![metrics-reporting](https://github.com/lightspeedwp/.github/actions/workflows/metrics-reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-reporting.yml)
[![openspec-progress-phase](https://github.com/lightspeedwp/.github/actions/workflows/openspec-progress-phase.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-progress-phase.yml)
[![openspec-report-progression](https://github.com/lightspeedwp/.github/actions/workflows/openspec-report-progression.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-report-progression.yml)
[![openspec-sync-labels](https://github.com/lightspeedwp/.github/actions/workflows/openspec-sync-labels.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-sync-labels.yml)
[![openspec-validate-labels](https://github.com/lightspeedwp/.github/actions/workflows/openspec-validate-labels.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-validate-labels.yml)
[![planner](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml)
[![pr-template-validation](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-validation.yml)
[![project-archival](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml)
[![project-maintenance-nightly](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-nightly.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-nightly.yml)
[![project-maintenance-on-demand](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-on-demand.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-on-demand.yml)
[![project-meta-sync](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml)
[![release](https://github.com/lightspeedwp/.github/actions/workflows/release.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release.yml)
[![reporting](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml)
[![reviewer](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml)
[![template-enforcement](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml)
[![validate-blocking-issue-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-issue-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-issue-before-close.yml)
[![validate-blocking-status-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-status-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-status-before-close.yml)
[![validate-dor-dod-sections](https://github.com/lightspeedwp/.github/actions/workflows/validate-dor-dod-sections.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-dor-dod-sections.yml)
[![validate-issue-dod-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-issue-dod-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-issue-dod-before-close.yml)
[![validate-mermaid-pr](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml)
[![validate-pr-template](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml)
[![validate-project-linking](https://github.com/lightspeedwp/.github/actions/workflows/validate-project-linking.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-project-linking.yml)
<!-- BADGES-END -->

## Purpose

This file is the current-state routing template for classifying a request into the right intake-heavy workflow before drafting, review, approval, claim handling, or Memory promotion begins.

Use it to decide:

- what kind of request this is
- which workflow should run first
- which questionnaire sources are relevant
- which missing inputs are truly blocking
- whether the next output should be intake, review, planning, drafting, claim review, approval routing, or launch gating

This routing layer sits upstream of the source, evidence, exclusions, claims, risk, approval, and Memory controls.

---

## Core routing rule

Route to the most upstream workflow that is still materially blocking good work.

Do not skip into downstream drafting when the real blocker is still one of these:

- missing scenario or project context
- missing page or content intake
- missing audience, tone, or conversion strategy
- missing approved sources
- missing FAQ or stats intake
- missing claim review
- missing governance or approval context
- missing launch-readiness review

If several workflows could fit, choose the one that resolves the next most important decision.

---

## Canonical routing outcomes

| Routing outcome | Use when | Typical next output |
|---|---|---|
| onboarding_intake | The scenario is new and the minimum routing context is still missing. | Compact onboarding intake or scenario setup. |
| project_or_task_intake | The task is known broadly, but page, scope, assets, or workflow inputs are still thin. | Wizard-style intake or structured intake table. |
| voice_and_tone_strategy | Brand voice, tone, personality, or wording guardrails are too thin for strong drafting. | Voice and tone strategy output or reusable tone defaults. |
| conversion_goal_strategy | Audience intent, CTA logic, user flow, or conversion purpose is too thin. | Conversion-goal strategy or user-flow guidance. |
| content_collection_planning | Approved source material is incomplete, scattered, or weak. | Content collection plan, source register, or gap report. |
| faq_intake | The page or workflow depends on objection handling, FAQs, or chatbot-safe answers that are not yet defined safely. | Five-slot FAQ planning layer. |
| stats_or_proof_intake | The page depends on figures, proof, trust signals, or other evidence-backed statements. | Stats intake or proof-capture layer. |
| claim_review | Claims, proof, comparisons, guarantees, or trust-sensitive wording need validation before use. | Claim register or claim-review handoff. |
| governance_or_policy_review | The request depends on AI-use rules, chatbot behaviour, disclosures, privacy, approvals, or governance controls. | Governance review, policy brief, or approval/risk summary. |
| drafting_workflow | Upstream context is strong enough to create structured content safely. | Draft, page pack, policy page, FAQ pack, form spec, or similar output. |
| launch_or_readiness_review | The work is near implementation, release, or go-live and final checks matter. | Review, readiness pack, blocker list, or go/no-go output. |

---

## Required routing inputs

Try to classify the request using these inputs first:

- project or task type
- primary goal
- audience or user group
- workflow context or stage
- relevant questionnaire source
- reference assets or source material
- required output format
- scope boundaries
- exclusions or must-not-do rules
- timeline, urgency, risk, or approval requirements

These do not all need to be fully known before routing, but the route should reflect which missing inputs are still blocking.

---

## Routing sequence

Apply this order when several routes are plausible:

1. onboarding or scenario intake
2. project or task intake
3. voice and tone strategy
4. conversion-goal strategy
5. content collection planning
6. FAQ intake
7. stats or proof intake
8. claim review
9. governance or policy review
10. drafting workflow
11. launch or readiness review

Choose the earliest stage that is still materially unresolved.

---

## Workflow classification checklist

### 1. Is this a new scenario?

Use **onboarding_intake** when:

- the user is starting a new initiative
- the project type or site type is still unclear
- the current request lacks the minimum routing context
- the request refers to a rough opportunity rather than an active scoped task

Do not use onboarding when the request already belongs clearly inside an active workflow.

### 2. Is the task clear but underdefined?

Use **project_or_task_intake** when:

- the user has a real task, but the page, deliverable, assets, or scope is still thin
- the request needs a concise wizard-style intake before any specialist step
- the best next move is to capture missing essentials rather than to analyse or draft deeply

### 3. Is strategy the real blocker?

Use **voice_and_tone_strategy** when:

- wording, brand personality, or voice consistency is central to success
- the current materials imply several possible tones
- content would become generic or off-brand without tone decisions

Use **conversion_goal_strategy** when:

- the audience or user intent is still weak
- CTA direction is unclear
- the page or content role in the broader journey is not yet defined
- the task could be structured in very different ways depending on the intended conversion

### 4. Is source quality the blocker?

Use **content_collection_planning** when:

- key inputs are missing or scattered
- source-of-truth is unclear
- the task depends on assets, briefs, docs, URLs, screenshots, repos, or stakeholder inputs not yet organised
- the best next output is a collection plan, request list, or gap report

### 5. Does the request depend on FAQs or proof?

Use **faq_intake** when:

- the page needs objection handling or FAQ planning
- the request involves chatbot-safe answer preparation
- five useful FAQ slots are needed before drafting

Use **stats_or_proof_intake** when:

- the page depends on numbers, proof signals, trust cues, or quantified claims
- statistics, awards, testimonials, rankings, ROI, performance, or outcome proof is central to the task

### 6. Is claim review required before use?

Use **claim_review** when:

- public-facing claims already exist or are likely to be created
- the task includes trust-sensitive or evidence-backed language
- proof wording needs validation before drafting or approval
- stats or FAQ inputs are claim-sensitive and need review routing

### 7. Is governance or policy the blocker?

Use **governance_or_policy_review** when:

- chatbot behaviour, AI use, disclosures, approvals, privacy, or escalation logic is central
- the task concerns policy, trust, accessibility, or governance pages
- risk and accountability rules matter more than ordinary drafting speed

### 8. Is the work ready for drafting?

Use **drafting_workflow** only when:

- the core intake is strong enough
- the right strategy context exists or is already established
- source quality is adequate for the requested output
- claim-sensitive or governance-sensitive blockers are either resolved or explicitly routed

### 9. Is this about readiness or go-live?

Use **launch_or_readiness_review** when:

- the output is about QA, launch gates, go-live readiness, or unresolved blockers near implementation
- the request asks what still needs checking before release
- specialist planning is already mostly complete and final readiness is now the decision point

---

## Questionnaire-aware routing rules

Use questionnaire files as selective routing helpers, not mandatory forms.

- Choose only the questionnaire files relevant to the current workflow and stage.
- Use questionnaire signals to infer likely project type, missing fields, risk prompts, and approval points.
- Do not let a questionnaire override clearer evidence from the user or approved sources.
- When questionnaire intent is unclear, ask one focused question: **What was this questionnaire intended to help capture for this workflow?**
- Continue with a safe routing default instead of stalling after that question.

Typical questionnaire influence by route:

- **onboarding_intake**: broad project classification and scenario discovery
- **project_or_task_intake**: field selection and wizard prefills
- **voice_and_tone_strategy**: tone, personality, wording preference extraction
- **conversion_goal_strategy**: audience, offer, CTA, and journey cues
- **content_collection_planning**: missing source and asset detection
- **faq_intake**: likely visitor questions, objections, and unsupported-answer zones
- **stats_or_proof_intake**: trust cues, metrics, proof categories, and evidence gaps
- **governance_or_policy_review**: approved sources, exclusions, privacy, escalation, and risk prompts

---

## Blocking vs non-blocking routing gaps

### Route-blocking gaps

Treat a gap as route-blocking when the missing answer would materially change:

- which workflow should run first
- whether the task is planning, drafting, governance, or launch work
- whether source approval or claim review is needed before progress
- whether the request is page-level, section-level, site-level, or policy-level

When a route-blocking gap appears, ask one focused question.

### Non-blocking routing gaps

Do not stall routing for:

- minor output-format preferences
- details that can stay visible as provisional
- defaults that are reversible and low-risk
- improvements that affect polish more than direction

In these cases, route using the safest sensible default and label the assumption.

---

## Recommended routing output structure

When returning a routing decision, use this compact structure:

1. **Classified request type**
   - what kind of workflow this appears to be
2. **Why this route fits**
   - the strongest signals supporting the route
3. **Relevant questionnaire sources**
   - only the files that actually help
4. **Blocking gaps**
   - only the missing points that materially affect the route
5. **Safe defaults for now**
   - temporary assumptions used for routing only
6. **Best next workflow**
   - the single next workflow that should run first
7. **Next handoff after that**
   - only if a likely downstream workflow is already obvious

---

## Example routing decisions

### Example: onboarding intake

**Request:** "We have a new tourism client and want help with website content and maybe a chatbot."

**Route:** onboarding_intake

**Why:** the scenario is new, the project type is broad, and the workflow context is still too thin for a more specific route.

### Example: project or task intake

**Request:** "Draft a service page from these notes."

**Route:** project_or_task_intake

**Why:** the task is real, but the page purpose, audience, CTA, and approved sources may still need concise intake before drafting.

### Example: voice and tone strategy

**Request:** "We need the site to feel premium but not stiff, and we keep changing the wording."

**Route:** voice_and_tone_strategy

**Why:** tone-definition is the real blocker before page drafting quality can stabilise.

### Example: content collection planning

**Request:** "We have some docs, a Figma file, and a rough sitemap, but nothing is organised."

**Route:** content_collection_planning

**Why:** source quality and source-of-truth planning are blocking better downstream work.

### Example: claim review

**Request:** "Check these proof points and stats before we put them on the homepage."

**Route:** claim_review

**Why:** evidence-backed public claims need validation before drafting or approval.

### Example: launch or readiness review

**Request:** "What still needs checking before we launch this website?"

**Route:** launch_or_readiness_review

**Why:** the decision point is now readiness, blockers, and go-live safety rather than upstream intake.

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
