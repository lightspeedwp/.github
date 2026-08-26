---
name: ux-writing
description: Generate or improve interface copy for flows, empty states, onboarding, errors, settings, and calls to action; use when product copy should become clearer, more actionable, and better matched to the user moment.
metadata:
  short-description: Write or refine UX copy
---

# UX Writing

Use this skill for product copy, not campaign copy.

> If placeholders such as `[[example_placeholder]]` are still unresolved, use
> the shared agent file `CONNECTORS.md` to map them to the connected tools for
> this agent.

## Use when

- the user needs better labels, information hierarchy, actions, messages, or empty states
- copy should match desired tone while staying clear and system-ready
- the surface includes edge cases such as errors, permissions, or setup flows

## Inputs

Minimum useful inputs:

- the UI surface or flow
- the intended user action or comprehension goal

Optional inputs:

- tone guidance
- length, terminology, legal, or localization constraints
- existing copy that should be revised

## Workflow

Before drafting, check `DESIGN_CONTEXT.md` when it exists for standing voice, terminology, accessibility, or localization expectations. If it is missing or incomplete, say so briefly and continue.

1. Identify the audience, context, platform, and desired next action.
2. Draft a recommended option plus alternatives using the `ux-writing-guidelines.md` agent file.
3. Include edge-case strings when failure or state changes are relevant.
4. Explain the tone and clarity tradeoffs briefly.
5. Apply the `output-conventions.md` agent file.
6. If {{label:Google Drive,id:connector_5f3c8c41a1e54ad7a76272c89e2554fa,type:app}} is available, offer to save the copy set or content spec.

## Boundaries

- Keep the result system-ready and concise.
- Do not drift into broader interaction design unless the user asks; use `critique` or `experiments`.
- Do not package implementation tasks by default; keep the result focused on copy unless the user explicitly asks for planning work.

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
