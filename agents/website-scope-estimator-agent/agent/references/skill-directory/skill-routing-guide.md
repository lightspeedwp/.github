# Skill Routing Guide

## Purpose

This file defines the routing boundaries between the attached estimation skills so the agent uses the right skill for the right phase, avoids duplicate work, and does not blur reusable onboarding with project-specific intake.

## Core Principle

Use the lightest valid routing path.

- Do not chain skills just because they exist.
- Do not use more than one skill for the same job in the same phase.
- Do not repeat questions or evidence gathering that a prior step already resolved.
- If the current request can be handled correctly without a skill, proceed with the core estimate workflow.

## Phase Map

Route the current request into one of these phases before selecting a skill:

1. Reusable defaults needed across future runs
2. Audit from website or source materials
3. Project-specific intake for missing scope details
4. Routing and commercial review
5. Readiness review
6. No skill needed

## Skill Boundaries

### estimator-onboarding

Use this skill only when the current request is blocked by missing reusable user defaults that should be remembered across future estimate or proposal runs.

Use when:

- the agent needs durable cross-run defaults such as preferred deliverable, default detail level, ambiguity handling, or standing output preferences
- the missing information should be saved in Memory for future runs

Do not use when:

- the missing information is specific to the current website project
- the agent needs page counts, integrations, migration scope, multilingual scope, ecommerce details, booking logic, or package-fit details for the current estimate
- the user already supplied enough reusable defaults

Boundary:

- onboarding is for reusable user defaults
- onboarding is not discovery intake

### website-evidence-pass

Use this skill when the user provides a live website, screenshots, notes, documents, Figma references, or other source material and the first job is to separate confirmed facts from assumptions before intake or routing.

Use when:

- the agent must inspect provided materials before deciding package fit
- the request starts with a website, design file, notes, screenshots, or supporting documents
- the current estimate depends on building a reliable audit summary first

Do not use when:

- the main blocker is missing project answers that are not available in source material
- package selection is already clear from confirmed intake and evidence
- the agent is already at readiness review

Boundary:

- evidence pass gathers and organizes source-backed facts
- evidence pass does not run full intake, full routing, or final commercial validation

### website-intake-workflow

Use this skill when important project-specific values are still missing after available evidence has been reviewed, or when the job begins as a discovery-led estimate rather than an evidence-led audit.

Use when:

- the agent needs missing scope details that materially affect package routing, pricing, thresholds, approvals, or confidence
- the request is to gather only the missing estimate inputs
- source material alone cannot answer the important routing questions

Do not use when:

- the only missing information is reusable cross-run defaults
- the agent still needs a first-pass audit from provided materials
- the base package is already clear and the next step is routing or readiness review

Boundary:

- intake collects project-specific facts for the current job
- intake is not reusable onboarding
- intake should ask only for missing values that materially matter
- intake does not draft estimates, proposals, or revisions

### website-package-routing

Use this skill once enough confirmed evidence or intake detail exists to choose the best-fit base package, check only the relevant add-ons, and review commercial thresholds or custom-scope triggers.

Use when:

- the agent can make a responsible package decision from confirmed facts
- the next step is selecting the base package and reviewing applicable add-ons
- the agent needs a concise routing handoff using the shared phase language

Do not use when:

- the agent is still missing core routing facts
- the request is still in raw evidence gathering or project intake
- the user only wants a final readiness check on an already drafted estimate or proposal

Boundary:

- package routing is the decision step between intake/evidence and downstream drafting or validation
- package routing should not be used as a substitute for discovery
- add-ons are reviewed only after the base package is selected

### quote-readiness

Use this skill immediately before treating an estimate or proposal as final, or when the user asks whether the current quote, estimate, scope, or proposal is ready to send.

Use when:

- a draft estimate or proposal already exists
- the agent must verify package fit, add-ons, commercial status, missing values, approvals, and template compliance
- the user asks whether the quote is ready, provisional, or not ready

Do not use when:

- the agent still needs first-pass evidence gathering
- project intake is still incomplete
- package routing has not been performed well enough to support final validation

Boundary:

- quote readiness is the final validation gate
- quote readiness does not replace intake, audit, or package routing

## No Skill Needed

Use no skill when the current request can be handled correctly from the main instructions, installed files, existing context, and ordinary reasoning without entering a specialized phase workflow.

Examples:

- small follow-up clarifications
- lightweight revisions that do not reopen audit, intake, routing, or readiness review
- direct answers about the current estimate state
- simple restatements or summaries of already-settled outputs

If the request clearly advances into a specialized phase, use the matching skill instead of forcing a no-skill path.

## Precedence Rules

When more than one skill seems relevant, apply this order:

1. Use `estimator-onboarding` only if reusable defaults are actually missing and needed now.
2. Use `website-evidence-pass` when source material exists and the first need is audit.
3. Use `website-intake-workflow` when project-specific routing values are still missing after evidence review, or when the request is discovery-led.
4. Use `website-package-routing` only when enough confirmed information exists to choose a base package responsibly.
5. Use `quote-readiness` only when the agent is validating a draft estimate or proposal before final presentation.
6. Use no skill when the request does not require a specialized phase workflow.

## Duplicate-Skill Guardrails

To avoid overlap and duplicate-skill behavior:

- Do not use onboarding and intake for the same missing value.
- Do not use evidence pass to ask discovery questions that belong in intake.
- Do not use package routing to compensate for weak or missing evidence.
- Do not use quote readiness as a catch-all review step before the package decision is stable.
- If a prior skill already produced the needed output for the current phase, continue from that result instead of rerunning an earlier skill.

## Fast Routing Checks

Before calling a skill, ask internally:

1. Is the missing information reusable across future runs or only for this project?
2. Is the current blocker a lack of source-backed evidence or a lack of project answers?
3. Is there enough confirmed information to choose a base package responsibly?
4. Am I validating a finished draft, or am I still building toward one?
5. Can the request be handled correctly without a specialized skill?

If these answers point clearly to a phase, use only the matching skill for that phase unless the workflow genuinely advances to the next phase.
