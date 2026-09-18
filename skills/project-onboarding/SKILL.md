---
name: lightspeed-project-onboarding
description: Collect first-run project defaults needed for LightSpeed AI readiness assessments, persist them, and resume the user's original request.
---

# LightSpeed Project Onboarding

## When to use this skill

Use this skill only when the current request is intake-heavy and requires missing project defaults or blocking context defined in `references/onboarding-contract.yaml`.

Do not use this skill when the current request can be completed from the current message, existing Memory state, and attached context alone.

Treat `Files / Questionnaires` as an optional intake support library, not as a mandatory questionnaire flow.

## Memory state

Use {{label:Memory,id:file_persistence,type:file_persistence}} as the backing store for the onboarding keys in `references/onboarding-contract.yaml`.

Persist those keys for the current runtime end user in a single compact state file named `lightspeed-project-defaults.yaml`, and read that file before asking the user to restate defaults.

Do not use Memory as a general transcript or scratchpad. Store only durable defaults that the contract says should be reused across future runs for that same runtime end user.

Keep temporary intake structure in `intake-state.yaml` using the schema in `references/intake-wizard-schema.yaml`.

Never save inferred values, questionnaire defaults, extracted guesses, or unreviewed risk flags as durable memory without confirmation.

## Preflight

1. Read `references/onboarding-contract.yaml`.
2. Read `references/intake-wizard-schema.yaml`.
3. Read the Memory state file named by the contract's `memory_state_file` field if it exists.
4. Check the current message, attached files, connected sources, and Memory before asking anything.
5. If `Files / Questionnaires` is available for the current task, use only the relevant questionnaire or checklist files as field libraries and smart-default sources.
6. Compare the current request and available persisted state against the contract's `trigger_when` and `required_state` fields.
7. If no trigger matches, skip this skill and continue the user's original request.
8. If the current request already provides any contract-defined defaults that are missing from Memory, persist only the confirmed values to the Memory state file using the contract's `store_as` keys.
9. Re-check `required_state` after persisting request-supplied values. If all required state is now present, skip user questions and continue the user's original request.
10. If required state is still missing, ask the current runtime end user only for the missing blocking field.

## Onboarding workflow

1. Detect the active workflow context before asking questions.
2. Build a concise intake wizard from the contract and `references/intake-wizard-schema.yaml`.
3. Prefer roughly 10 fields and collect at least 5 useful fields before proceeding only when the task truly needs intake.
4. Track each field with one status: `confirmed`, `inferred`, `defaulted`, or `missing`.
5. Start by resolving the project anchor in `required_state`. A project anchor may be a client name plus project name, a website domain, a repository name, or a design file reference.
6. Prefill fields from the current message, attached files, URLs, documents, screenshots, designs, repos, connected sources, questionnaire clues, and current Memory.
7. Ask the current runtime end user one concise question at a time, and only for missing blocking information.
8. If questionnaire intent is unclear, ask: `What was this questionnaire intended to help capture for this workflow?`
9. Treat optional defaults as follow-up improvements, not blockers. Ask for them only when they would materially improve future runs for the same end user.
10. Persist only confirmed durable answers to `lightspeed-project-defaults.yaml` using the contract's `store_as` keys. Keep provisional intake state in `intake-state.yaml`.
11. After `completion_requires` is satisfied, stop onboarding and resume the user's original request immediately.

## Questionnaire use rules

- Use questionnaire files as field libraries, smart-default sources, checklist sources, memory-schema inspiration, claim or risk trigger sources, project-type classifiers, and reusable template references.
- Do not assume every questionnaire applies.
- Ignore questionnaire files that do not fit the current workflow.
- Do not dump a full questionnaire into chat.
- Use the fewest questionnaire files needed to improve the wizard.
- Mark extracted questionnaire values as `inferred` unless the user explicitly confirms them.
- Typical questionnaire families may include website briefing, design, content collection, ecommerce, tone of voice, basic or standard website packages, and tour-operator planning or blog workflows.
- For governance or chatbot work, use only the questionnaire fields that clarify audience, approved sources, exclusions, claims, risk, privacy, support routes, and escalation.

## Claim, source, and approval rules

- If extracted questionnaire or evidence values include regulated, commercial, comparative, testimonial, performance, pricing, ROI, or outcome claims, mark `claim_register_required` in the intake state.
- Treat unsupported or high-risk claims as not approved for final public-facing output unless reviewed.
- Separate approved sources from candidate sources whenever questionnaires, links, files, or other evidence are mixed.
- Track exclusions, reviewer ownership, and approval gates when the workflow may produce client-facing, published, or operationally sensitive output.
- If claim, source, or approval status is unclear, ask only the smallest blocking question instead of opening a full review flow.
- Use the intake support templates when they are available and relevant, especially the source-approval register, exclusions register, claim register template, risk-and-review checklist, blocking-gaps checklist, and approval-gate checklist.

## Intake field guidance

Preferred wizard fields:

- project or task type
- primary goal
- audience or user group
- workflow context
- relevant questionnaire source
- reference asset or source material
- required output format
- scope boundaries
- exclusions or must-not-do rules
- timeline, urgency, risk, or approval requirements

Useful extraction tokens include:

- brand
- audience
- offer
- services or products
- content types
- design direction
- technical requirements
- integrations
- source assets
- exclusions
- legal or privacy requirements
- claims
- approval owners
- launch or handoff requirements
- risks
- missing blockers

## Claim, source, and approval rules

If intake evidence introduces publication-sensitive claims, approval-sensitive statements, exclusions, or regulated risk, convert them into structured working records rather than loose notes.

Create or recommend a claim register when captured values include:

- medical, health, legal, financial, safety, or regulated content
- pricing, ROI, conversion, ranking, performance, or outcome claims
- testimonials, case studies, statistics, guarantees, comparisons, or awards
- externally published factual claims
- smart defaults that imply compliance, quality, suitability, or safety
- AI-generated recommendations that could affect decisions

For claim-sensitive intake:

- mark unsupported or high-risk claims as not approved for final public-facing use
- separate approved sources from candidate sources
- capture exclusions, review ownership, and approval gates when relevant
- keep unreviewed claims in temporary intake state until confirmed

## Wizard output pattern

When the task needs a visible wizard summary, render a compact intake table or list that includes:

- field
- current value
- status
- source
- save policy when useful

Capture at least 5 useful fields before proceeding only when the task truly needs wizard-style intake. Otherwise, use the same logic silently and continue the task.

## Output

Do not summarize onboarding for its own sake. Confirm only the project default or preference that matters for the current task, then continue the original request.

## Supporting Files

- `references/onboarding-contract.yaml` — use this to determine when onboarding should trigger, which field is truly required, which preferences are optional, and when to skip onboarding entirely.
- `references/intake-wizard-schema.yaml` — use this to structure the wizard fields, statuses, token extraction, and Memory save policies.

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
