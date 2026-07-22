---
name: critique
description: Review a specific design artifact or bounded flow step and produce prioritized feedback with rationale, evidence, and revision guidance; use when evaluating usability, clarity, trust, accessibility, or overall design quality on a concrete artifact.
metadata:
  short-description: Critique a design or flow
---

# Design Critique

Use this skill to evaluate a specific artifact against its intended outcome.

> If placeholders such as `[[example_placeholder]]` are still unresolved, use
> the shared agent file `CONNECTORS.md` to map them to the connected tools for
> this agent.

## Use when

- the user wants feedback on a specific flow step, mock, screen, component, modal, or spec
- a team needs prioritized issues instead of broad commentary
- the review should surface why a problem matters and how to improve it
- accessibility is one of the review lenses, but the request is still about a concrete artifact rather than a broad sweep

## Inputs

Minimum useful inputs:

- the specific artifact, bounded flow slice, or a description of it
- the intended user goal or business outcome

Optional inputs:

- screenshots or {{label:Google Drive,id:connector_5f3c8c41a1e54ad7a76272c89e2554fa,type:app}} artifacts
- target review lens such as accessibility, clarity, or conversion

## Workflow

Before drafting, check `DESIGN_CONTEXT.md` when it exists for standing audience, brand, accessibility, or review-priority context. If it is missing or incomplete, say so briefly and continue.

1. Establish the intended task, review lens, and artifact scope.
2. Evaluate the artifact using the `critique-heuristics.md` agent file, prioritizing structural workflow issues before surface polish.
3. Distinguish visible symptoms from likely breakdowns in hierarchy, sequencing, feedback, trust, or interaction cost.
4. For each major finding, identify the user job, breakdown, evidence in the artifact, likely workaround or failure mode, cost, recommendation, and confidence.
5. Rank findings by task impact, trust cost, recovery cost, and confidence rather than by taste or verbosity.
6. Separate unresolved questions from confirmed issues.
7. Apply the `output-conventions.md` agent file.
8. If {{label:Slack,id:asdk_app_69a1d78e929881919bba0dbda1f6436d,type:app}} is available, optionally produce a concise review summary.
9. If the user wants multiple future directions, hand off to `experiments`.

## Boundaries

- Critique against goals, not aesthetics alone.
- If the request asks for broader coverage across a surface, multi-step flow, feature area, or formalized compliance sweep, use `audit` instead.
- Avoid rewriting detailed product copy unless the user asks; use `ux-writing`.
- Do not turn the critique into a research synthesis or evidence-clustering exercise unless the input is multi-source qualitative evidence.

## Routing guidance

- Use `critique` when the request is about one artifact or one tightly scoped interaction.
- Accessibility is a valid critique lens when the user wants feedback on a single screen, component, modal, state, or bounded flow step.
- If the user wants systematic coverage across a broader experience, route to `audit`.

## Review stance

Act like a lead product designer or principal UX reviewer, not a taste critic.

- Explain how the artifact helps or fails the user complete the task.
- Highlight where users are likely to hesitate, backtrack, or invent their own workaround.
- Separate structural issues from polish issues.
- Be explicit about which issues are directly visible versus which are informed hypotheses.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
