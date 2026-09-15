# Strict Preview Validation Checklist

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

Use this checklist to validate future preview runs against the agent's wizard-driven intake rules before treating the behaviour as correct.

## Pass / Fail Rules

A preview should fail if it breaks any critical rule below, even if the overall answer looks useful.

### Critical rules

- [ ] The agent did **not** dump a full questionnaire into chat unless the user explicitly asked for the full questionnaire as the deliverable.
- [ ] The agent identified the user's goal and active workflow context before expanding the intake.
- [ ] The agent selected only the questionnaire or checklist files relevant to the task.
- [ ] The agent explicitly ignored irrelevant questionnaire files, or clearly avoided using them.
- [ ] The agent asked only for **blocking** information, not every potentially useful detail.
- [ ] The agent prefilled values from the user message and available context before asking questions.
- [ ] The agent marked fields only with the allowed statuses: `confirmed`, `inferred`, `defaulted`, or `missing`.
- [ ] The agent did **not** treat inferred or defaulted values as confirmed facts.
- [ ] The agent did **not** start drafting the downstream deliverable when the request was intake-only.

If any critical rule fails, mark the run as **needs revision**.

---

## Wizard Structure Validation

### Core wizard shape

- [ ] The output contains a wizard-style intake structure, not a generic prose summary alone.
- [ ] The wizard stays close to the standard intake shape of around 10 fields.
- [ ] At least 5 useful fields are captured before the agent proceeds.
- [ ] The core fields are present or clearly covered:
  - [ ] Project or task type
  - [ ] Primary goal
  - [ ] Audience or user group
  - [ ] Workflow context
  - [ ] Relevant questionnaire source
  - [ ] Reference asset or source material
  - [ ] Required output format
  - [ ] Scope boundaries
  - [ ] Exclusions or must-not-do rules
  - [ ] Timeline, urgency, risk, or approval requirements

### Field quality

- [ ] Each field value is specific enough to be useful.
- [ ] Inferred values are plausible and grounded in the request.
- [ ] Defaulted values reduce friction without overcommitting scope.
- [ ] Missing values are true gaps, not information the agent could have inferred.
- [ ] Blocking fields are clearly distinguishable from non-blocking ones.

---

## Questionnaire Selection Validation

### File choice quality

- [ ] The primary questionnaire chosen is the narrowest best-fit file.
- [ ] Additional questionnaire files are used only when they materially improve the intake.
- [ ] Overlapping files are not piled on unnecessarily.
- [ ] Ignored files are ignored for a clear reason such as phase mismatch, domain mismatch, or premature detail.

### Intent handling

- [ ] If questionnaire intent was unclear, the agent asked the focused clarification question: “What was this questionnaire intended to help capture for this workflow?”
- [ ] If intent was clear, the agent did not ask that question unnecessarily.

---

## Blocking Question Validation

### Minimum-question rule

- [ ] The agent asked the smallest practical number of blocking questions.
- [ ] Blocking questions are tightly phrased and directly unblock the next step.
- [ ] Non-blocking follow-ups are separated from blockers.
- [ ] The agent did not ask preference questions that could be safely defaulted.

### Strict blocker test

A question should count as blocking only if the missing answer would materially change:

- [ ] the output route
- [ ] the scope boundary
- [ ] the source requirements
- [ ] the approval path
- [ ] the safety or claim posture
- [ ] the correctness of the next artefact

If a question does not meet one of those tests, move it to non-blocking follow-ups.

---

## Source, Claim, Exclusion, and Approval Validation

### Source controls

- [ ] The run identifies likely source assets or missing source material.
- [ ] The run distinguishes approved, unclear, restricted, or still-missing source material when relevant.
- [ ] The run does not imply that questionnaires, Memory, or internal discussion are approved public evidence by default.

### Claim controls

- [ ] Claim-sensitive areas are flagged when the workflow touches trust, outcomes, performance, rankings, reviews, awards, compliance, safety, medical, legal, financial, or AI recommendations.
- [ ] Unsupported or high-risk claims are not treated as ready for public-facing use.
- [ ] If claim risk is present, the run either uses or clearly implies a claim-register pattern.

### Exclusions and approvals

- [ ] Must-not-do rules or likely exclusions are surfaced when relevant.
- [ ] Approval owners or approval-sensitive areas are identified when relevant.
- [ ] Approval-sensitive content is not presented as final if sign-off is still missing.

---

## Memory Validation

- [ ] The run separates current-run context from durable memory candidates in substance.
- [ ] The run does not promote inferred or questionnaire-defaulted values as durable memory.
- [ ] Reusable confirmed facts are distinguishable from unverified assumptions.
- [ ] Risk, claim, exclusion, and approval signals are treated as review inputs unless confirmed.

---

## Output Quality Validation

- [ ] The output matches the requested artefact and does not expand into a larger deliverable.
- [ ] The answer is modular and easy to scan.
- [ ] Questionnaire selection, ignored files, wizard fields, blockers, and risk flags are all visible in the output.
- [ ] The next step is clear and proportionate.
- [ ] The response improves the workflow without replacing the agent's existing purpose.

---

## Scoring Guide

### Ready

Use **ready** only if:

- all critical rules pass
- the wizard is concise and structurally sound
- blocker questions are minimal and necessary
- source, claim, exclusion, and approval handling is appropriate for the scenario

### Needs refinement

Use **needs refinement** if:

- critical rules pass, but one or more of these are weak:
  - too many fields
  - too many blocking questions
  - weak ignored-file reasoning
  - thin risk handling
  - no clear source or claim controls where they would help

### Needs revision

Use **needs revision** if:

- any critical rule fails
- the agent dumps or mirrors full questionnaires
- the run treats inferred values as confirmed
- the run skips blocking gaps and moves ahead unsafely
- the run ignores obvious claim, source, or approval risk

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
