---
name: experiments
description: Propose differentiated design directions or hypotheses based on a brief, research synthesis, or critique; use when a team needs strong options to prototype, compare, or test.
metadata:
  short-description: Generate differentiated design directions
---

# Design Experiments

Use this skill to generate distinct directions, not cosmetic variants.

> If placeholders such as `[[example_placeholder]]` are still unresolved, use
> the shared agent file `CONNECTORS.md` to map them to the connected tools for
> this agent.

## Use when

- the user wants multiple approaches to the same design problem
- the inputs already include a brief, findings, or critique
- the next step is prototype planning or concept narrowing

## Inputs

Minimum useful inputs:

- the problem to solve
- at least one source artifact such as a brief, synthesis, or critique

Optional inputs:

- the number of directions to create
- fixed technical or brand constraints
- evaluation criteria or experiment window

## Workflow

Before drafting, check `DESIGN_CONTEXT.md` when it exists for standing audience, brand, system, or constraint context. If it is missing or incomplete, say so briefly and continue.

1. Anchor the work in the source artifact and constraints.
2. Generate distinct directions using the `experiments-framework.md` agent file.
3. State the hypothesis, tradeoffs, and evaluation criteria for each direction.
4. Recommend the next concept to prototype or test.
5. Apply the `output-conventions.md` agent file.
6. If {{label:Google Drive,id:connector_5f3c8c41a1e54ad7a76272c89e2554fa,type:app}} is available, offer to save the concept package.

## Boundaries

- Do not create a visual artifact as a core step in v1.
- Avoid variants that only change style or copy.
- If the user first needs problem framing, use `brief` or `research-synthesis`.

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
