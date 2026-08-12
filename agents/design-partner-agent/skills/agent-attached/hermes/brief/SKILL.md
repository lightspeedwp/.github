---
name: brief
description: Turn goals, constraints, audience context, and references into a structured design brief; use when framing a new feature, redesign, or design problem before concepts or implementation.
metadata:
  short-description: Create a structured design brief
---

# Design Brief

Use this skill to frame a design problem before critique, experiments, or handoff.

> If placeholders such as `[[example_placeholder]]` are still unresolved, use
> the shared agent file `CONNECTORS.md` to map them to the connected tools for
> this agent.

## Use when

- the user needs a brief for a new feature or redesign
- goals, audience, and constraints need to be organized
- the team needs a shared problem statement before generating concepts

## Inputs

Minimum useful inputs:

- the design goal or problem
- target audience or user context
- known constraints or success criteria

Optional inputs:

- source docs from {{label:Google Drive,id:connector_5f3c8c41a1e54ad7a76272c89e2554fa,type:app}}, tickets or feedback from `[[user_feedback]]`, or screenshots from {{label:Google Drive,id:connector_5f3c8c41a1e54ad7a76272c89e2554fa,type:app}}
- existing product context from {{label:Google Drive,id:connector_5f3c8c41a1e54ad7a76272c89e2554fa,type:app}}, {{label:Slack,id:asdk_app_69a1d78e929881919bba0dbda1f6436d,type:app}}, or uploaded/pasted notes

## Workflow

Before drafting, check `DESIGN_CONTEXT.md` when it exists for standing audience, brand, system, accessibility, or source-preference context. If it is missing or thin, say so briefly and continue with request-scoped context.

1. Gather only the facts needed to define the problem and constraints.
2. Split hard constraints from assumptions and open questions.
3. Produce the brief using the `brief-template.md` agent file.
4. Apply the `output-conventions.md` agent file.
5. If {{label:Google Drive,id:connector_5f3c8c41a1e54ad7a76272c89e2554fa,type:app}} is available, offer to save the brief after presenting it in plain text.
6. If {{label:Slack,id:asdk_app_69a1d78e929881919bba0dbda1f6436d,type:app}} is available, optionally produce a short alignment summary.

## Boundaries

- Do not generate design directions unless the user asks; hand off to `experiments`.
- Do not turn the brief into tasks by default; keep the output at problem-framing level unless the user explicitly asks for planning work.
- If research material is the main input, consider `research-synthesis` first.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
