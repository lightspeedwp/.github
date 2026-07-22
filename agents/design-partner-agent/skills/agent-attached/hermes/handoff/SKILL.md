---
name: handoff
description: Turn a specific design frame, component, or bounded flow into an engineer-ready handoff package with implementation notes, key diffs, decisions, edge cases, and acceptance criteria; use when design work is ready to be implemented.
metadata:
  short-description: Prepare a design for engineering handoff
---

# Design Handoff

Use this skill to prepare a bounded design artifact for implementation.

> If placeholders such as `[[example_placeholder]]` are still unresolved, use
> the shared agent file `CONNECTORS.md` to map them to the connected tools for
> this agent.

## Use when

- the user wants to hand a specific design slice to engineering for build
- the source is a frame, component, prototype path, or small set of related states
- the team needs implementation notes, behavior details, and acceptance criteria tied to a concrete design target

## Inputs

Minimum useful inputs:

- a specific frame, component, node, or bounded flow
- the target platform such as web, iOS, Android, or email
- the primary implementation audience such as engineering, QA, or mixed

Optional inputs:

- a {{label:Google Drive,id:connector_5f3c8c41a1e54ad7a76272c89e2554fa,type:app}} artifact such as Figma, Sketch exports, screenshots, or specs
- designer-authored notes on key diffs and implementation-significant decisions
- existing code component mappings, design-system references, or technical constraints
- preferred output mode such as engineer brief, QA checklist, or full package

## Workflow

Before drafting, check `DESIGN_CONTEXT.md` when it exists for standing platform, accessibility, design-system, or handoff expectations. If it is missing or incomplete, say so briefly and continue.

1. Confirm the implementation target is bounded. Prefer a specific frame, component, node, or short flow segment over a broad design file.
2. If the source is too broad, do not fake precision. Ask the user to narrow the target or produce a short list of recommended handoff slices instead of a final handoff.
3. Gather the designer-authored decision log before generating the handoff. Ask for:
   - key diffs from the previous design or shipped experience
   - important decisions that should be treated as intentional
   - details engineering must preserve
   - details where implementation flexibility is acceptable
   - known gaps or unresolved questions
4. Use {{label:Google Drive,id:connector_5f3c8c41a1e54ad7a76272c89e2554fa,type:app}} when available to inspect the exact artifact. If code-component mappings or Dev Mode style metadata exist, prefer them over visual guesswork.
5. Translate the design into implementation language using the `handoff-template.md` agent file.
6. Cover behavior, states, edge cases, responsive rules, accessibility expectations, dependencies, and open questions for the scoped artifact.
7. If the designer decision log is missing, proceed in inferred mode and explicitly lower confidence on inferred decisions.
8. If {{label:Google Drive,id:connector_5f3c8c41a1e54ad7a76272c89e2554fa,type:app}} is available, offer to save the handoff after presenting it in plain text.
9. If `[[project_tracker]]` is available and the design is sufficiently mature, offer to create concrete work items as a follow-on action rather than the primary output.
10. If {{label:Slack,id:asdk_app_69a1d78e929881919bba0dbda1f6436d,type:app}} is available, optionally produce a concise implementation summary for stakeholders.
11. Apply the `output-conventions.md` and `capability-routing.md` agent files.

## Boundaries

- Do not treat a broad design file as final implementation guidance.
- Do not invent behavior, states, or hierarchy that the design and decision log do not support.
- Do not assume a specific tracker or document system.
- Keep the handoff grounded in the source artifact and designer decisions, not product planning or critique synthesis.
- If the source is weak or ambiguous, call out assumptions and unresolved questions before offering tasks.

## Fallback behavior

- If only a broad Figma or Sketch file is provided, help the user choose the specific frame, component, or flow that should be handed off.
- If only screenshots are provided, produce a lower-confidence handoff and flag what still needs design confirmation.
- If the user mainly wants tasks or rollout planning rather than design-to-engineering transfer, suggest `brief`, `critique`, or a future delivery-planning skill instead.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
