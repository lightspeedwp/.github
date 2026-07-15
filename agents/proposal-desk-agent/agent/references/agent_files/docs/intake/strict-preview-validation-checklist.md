# Strict Preview Validation Checklist

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

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
