# Risk and review checklist

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
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

## Purpose

This file is the current-state operational review gate for intake-heavy workflows.

Use it to decide whether the work can proceed normally, should continue with cautions, or must pause for claim review, source approval, governance review, privacy or legal review, approval-owner confirmation, or launch-readiness review.

It ties together:

- claim handling
- source approval
- exclusions and scope boundaries
- evidence quality
- approval dependencies
- memory safety
- escalation decisions

---

## Review outcomes

| Outcome | Meaning | Action |
|---|---|---|
| proceed | The current workflow can continue without special review gating. | Continue with the normal next step. |
| proceed_with_caution | The workflow can continue, but assumptions, limits, or soft review notes must stay visible. | Continue, but label the uncertainty clearly. |
| review_required | The workflow should not treat the content as fully safe or complete until the named review happens. | Route to the relevant review owner or checklist. |
| hard_stop | The current path should not continue as if it is safe. | Pause, narrow scope, or redirect the workflow. |

---

## Core review questions

Check these questions in order:

1. Are any public-facing claims present?
2. Are any claims unsupported, comparative, quantified, guaranteed, regulated, or trust-sensitive?
3. Are the sources approved for the intended reuse?
4. Are any exclusions or must-not-do rules being crossed?
5. Are privacy, legal, medical, financial, safety, or compliance issues involved?
6. Is any important approval owner still unknown or still pending?
7. Is the work trying to save unconfirmed or risky values into durable Memory?
8. Is the task trying to move into launch or publication while review blockers remain?

If the answer to any of these materially raises risk, route the work into the right review path before treating it as ready.

---

## Operational checklist

### 1. Source approval check

- [ ] The main source or sources are known.
- [ ] The source approval status is clear.
- [ ] Unapproved or reference-only sources are not being treated as confirmed truth.
- [ ] Public URLs, screenshots, questionnaires, or rough notes are not being treated as automatically approved.
- [ ] Source limits are clear if the source is approved with limits.

If any of these fail and source authority matters, outcome should be at least **review_required**.

### 2. Evidence quality check

- [ ] Extracted evidence tokens are present when needed.
- [ ] Important values are marked correctly as confirmed, inferred, defaulted, missing, or unsupported.
- [ ] Questionnaire-derived values are still marked as inferred unless confirmed elsewhere.
- [ ] The workflow is not silently upgrading weak evidence into strong evidence.
- [ ] Missing blockers are visible instead of being hidden by polished drafting.

If important evidence is weak but the work can continue provisionally, use **proceed_with_caution**.
If weak evidence would make the output misleading, use **review_required** or **hard_stop**.

### 3. Claim review check

- [ ] Any statistic, testimonial, case study, comparison, ranking, pricing claim, ROI claim, guarantee, performance claim, outcome claim, award, or trust claim has been identified.
- [ ] Claim-sensitive FAQ answers are being routed into the claim register.
- [ ] Unsupported or high-risk claims are not being used as if approved.
- [ ] Safer rewrite options are noted when the original claim is too risky.
- [ ] Claim approval state is clear before public-facing use.

If claim review is missing for a claim-bearing output, outcome should be at least **review_required**.
If the claim is clearly unsafe or unsupported, use **hard_stop** for that wording.

### 4. Exclusions and scope check

- [ ] Scope boundaries are clear enough for the current task.
- [ ] Must-not-do rules are visible.
- [ ] Unsupported areas are not being treated as in scope.
- [ ] The workflow is not expanding into a larger task without approval.
- [ ] The work does not conflict with a stronger exclusion or approved authority.

If exclusions are being crossed, use **review_required** or **hard_stop** depending on severity.

### 5. Sensitive-content check

- [ ] Legal, privacy, medical, financial, safety, compliance, or regulated content has been identified if present.
- [ ] Sensitive wording is not being presented as certain if review is missing.
- [ ] Policy or governance interpretation is not being treated as final legal advice.
- [ ] Chatbot or governance outputs include escalation or boundary logic where needed.
- [ ] Sensitive content is routed to the right review path before publication or release.

If sensitive content is present without the right review, outcome should be at least **review_required**.
For clearly unsafe certainty, use **hard_stop**.

### 6. Approval-owner check

- [ ] Required approval owners are known.
- [ ] Approval status is visible where it materially affects readiness.
- [ ] The work does not imply approval already happened when it has not.
- [ ] Approval gaps are surfaced instead of buried.
- [ ] Launch or publish recommendations do not bypass pending approvals.

If approval ownership is unknown and the output depends on it, use **review_required**.

### 7. Memory-safety check

- [ ] Inferred or defaulted values are not being saved as confirmed reusable memory.
- [ ] Questionnaire-derived values are not being promoted into durable Memory without confirmation.
- [ ] Unsupported claims and risky assumptions are not being saved into Memory.
- [ ] Only stable, reusable, confirmed values are candidates for confirmed project memory.
- [ ] Sensitive values are being kept out of durable Memory until review is complete.

If Memory promotion would be unsafe, block the save and use **review_required** for that promotion step.

### 8. Publication or launch-readiness check

- [ ] The workflow is not calling something launch-ready while critical review blockers remain.
- [ ] The output clearly distinguishes provisional from approved content.
- [ ] Open claim, evidence, source, or approval gaps are still visible.
- [ ] Review-only or internal notes are not leaking into public-facing copy.
- [ ] Final readiness recommendations match the real review state.

If publication readiness is overstated, use **hard_stop** for the readiness claim.

---

## Escalation mapping

Use this routing when review is required.

| Trigger | Route to |
|---|---|
| unsupported or high-risk factual claim | claim register review |
| source present but not approved | source approval review |
| privacy, legal, or compliance wording | privacy or legal review |
| governance, accountability, chatbot boundaries, escalation rules | governance review |
| scope conflict or must-not-do rule conflict | exclusions review or owner confirmation |
| unknown sign-off owner | approval-owner confirmation |
| launch recommendation with unresolved blockers | launch-readiness review |
| unsafe Memory promotion | memory review before save |

---

## Practical decision rules

### Use proceed when

- sources are approved enough for the task
- no meaningful claim or compliance risk is present
- exclusions are respected
- approvals are adequate for the current stage
- Memory promotion is either not needed or clearly safe

### Use proceed_with_caution when

- the work is still useful with clearly labelled uncertainty
- evidence is partial but not misleading if framed carefully
- defaults are being used temporarily and not saved durably
- no hard review gate is being crossed yet

### Use review_required when

- public-facing claims need validation
- source approval matters and is unclear
- sensitive wording needs reviewer input
- approval ownership is unresolved
- exclusions materially constrain the output
- Memory promotion depends on confirmation or review

### Use hard_stop when

- the workflow would otherwise publish or imply unsupported claims
- the work would violate a confirmed exclusion or approved authority
- the work would imply legal, medical, financial, safety, or compliance certainty without proper review
- the work would mark something ready for launch or publication when material blockers remain
- the work would save clearly unsafe values into durable Memory

---

## Example review summaries

### Example: proceed_with_caution

- Source approval is still partial, but the current intake summary can continue if all inferred values remain clearly labelled.
- No public-facing claims are being approved yet.
- Do not promote the inferred audience or tone defaults into durable Memory yet.

### Example: review_required

- The page includes quantified trust claims and testimonial-style proof, but no approved evidence is attached.
- Route these items into the claim register before the page is treated as publish-ready.
- The rest of the page structure work may continue as planning only.

### Example: hard_stop

- The output currently implies guaranteed compliance and approved proof claims without approved supporting evidence.
- Do not present this as ready for publication or launch.
- Narrow the wording and route the sensitive items for review first.

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
