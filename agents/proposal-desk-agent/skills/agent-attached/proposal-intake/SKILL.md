---
name: proposal-intake
description: Use when the task is to analyse a new RFP, questionnaire, proposal brief, or diligence request, extract submission requirements and likely deliverables, identify gaps and risks, and produce a concise intake handoff before drafting begins.
---

# Proposal Intake

## When to use

Use this skill when the current task is primarily about understanding the request artefact before drafting.

Typical triggers:

- the user asks for an intake summary, request triage, requirements extraction, submission analysis, or first-pass proposal assessment
- the user shares a new RFP, questionnaire, proposal brief, or diligence packet and the next useful step is to understand what is being asked
- the agent needs to identify deliverables, deadlines, structure, blockers, missing inputs, and likely workstreams before section drafting begins

Do not use this skill for reusable user defaults or first-run preference collection. Those belong to `$proposal-defaults-onboarding`.

Do not use this skill when the main job is drafting full responses, rewriting sections, or verifying claim support across existing draft language. Use the more specific drafting or evidence workflow instead.

## Goal

Turn the current request artefact into a clear, grounded intake handoff that helps the next drafting step start quickly and safely.

## Workflow

1. Identify the request artefact and the minimum grounded scope.
   - Determine whether the input is an RFP, questionnaire, procurement form, vendor due diligence request, proposal brief, or mixed pack.
   - If multiple files are present, prioritise the customer-facing source artefact over internal notes.
   - If there is no usable artefact, ask for the missing source before inventing requirements.

2. Extract the practical submission frame.
   Capture only what is materially useful for downstream work:
   - due date or timing signal
   - required deliverables and submission format
   - section structure, question groups, or response tables
   - explicit evaluation criteria, constraints, or mandatory requirements
   - attachments, appendices, or referenced materials that appear necessary

3. Decide the likely output route.
   Choose the narrowest useful next artefact based on the request:
   - intake summary only
   - executive summary draft
   - section-by-section drafting
   - gap tracker
   - internal follow-ups
   - full proposal response pack

4. Break the work into practical response units only when needed.
   - Group by section, question block, or workstream.
   - Avoid over-segmenting short requests.
   - Preserve customer naming and ordering when the source artefact provides them.

5. Classify readiness for each major section or workstream.
   Use concise labels such as:
   - strongly supported
   - partially supported
   - gap
   - high-risk / needs validation

6. Surface blockers, missing inputs, and review-sensitive areas.
   - Call out only gaps that materially affect quality, compliance, or submission completeness.
   - Note likely owner groups when that is reasonably inferable.
   - Distinguish true blockers from nice-to-have context.

7. End with a clear next-step handoff.
   - State what should happen next.
   - If drafting is now feasible, say which artefact should be drafted first.
   - If the pack is too incomplete, say what information is still needed before substantive drafting.

## Output contract

Default to concise Markdown with these sections when relevant:

## Intake Summary

- document type
- request goal
- due date or timing signal
- required deliverables
- submission or format requirements

## Recommended Response Route

- the best next artefact to produce
- the reason this is the narrowest useful next step

## Section or Workstream Map

- major sections, question groups, or workstreams
- short readiness label for each one

## Gaps and Risks

- blockers
- missing inputs
- high-risk claims or review-sensitive areas

## Next Step

- the most useful immediate follow-on action

Keep the intake handoff compact. Do not start drafting full proposal answers unless the user explicitly asked for drafting too.

## Quality bar

- Stay grounded in the current artefact and attached context.
- Preserve customer terminology when identifying sections and deliverables.
- Prefer practical routing guidance over exhaustive document transcription.
- Separate factual requirements from assumptions.
- Make it obvious what can proceed now versus what needs more input.

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
