---
name: audit
description: Audit a broader product experience, journey, workflow, feature area, or design surface to identify UX risks, structural issues, accessibility gaps, WCAG-related concerns, and improvement opportunities; use when the user wants systematic assessment rather than feedback on a single artifact.
metadata:
  short-description: Audit UX or accessibility
---

# Design Audit

Use this skill to assess a broader experience systematically, including accessibility when needed.

> If placeholders such as `[[example_placeholder]]` are still unresolved, use
> the shared agent file `CONNECTORS.md` to map them to the connected tools for
> this agent.

## Use when

- the user wants a structured audit of a multi-step flow, feature area, journey, or product surface
- the team needs to identify UX risks, gaps, and opportunity areas
- the user wants a systematic accessibility or WCAG-oriented audit across a flow or surface
- the question is how well the current experience supports the user goal
- competitor comparison is useful as an optional input, but not required

## Inputs

Minimum useful inputs:

- the target journey, flow, feature area, surface, or task set
- the user goal, task, or evaluation lens

Optional inputs:

- the audit mode: UX, accessibility, or combined
- screenshots, notes, links, or specs
- existing critique context or {{label:Google Drive,id:connector_5f3c8c41a1e54ad7a76272c89e2554fa,type:app}} artifacts
- comparators, reference products, or category norms
- specific evaluation lenses such as onboarding, search, pricing, keyboard access, or screen-reader clarity
- target accessibility standard or bar such as WCAG AA when the user cares about formal compliance

## Workflow

Before drafting, check `DESIGN_CONTEXT.md` when it exists for standing accessibility expectations, design-system context, or source preferences. If it is missing or incomplete, say so briefly and continue.

1. Define the target experience scope, user task, and audit mode: UX, accessibility, or combined.
2. Use the `design-audit-framework.md` agent file to structure the audit based on the chosen mode.
3. For UX audits, identify notable risks, friction points, strengths, and opportunity areas tied to the user workflow.
4. For accessibility audits, inspect perceivability, operability, understandability, and robustness, and call out likely WCAG-relevant issues with the confidence level of each finding.
5. When the source artifact is insufficient for a confident accessibility judgment, say what can be assessed from the available design and what requires implementation or assistive-technology verification.
6. If comparator products or category norms are provided, use them as supporting context rather than the default frame.
7. End with recommendations tied to the product goal or accessibility outcome.
8. Apply the `output-conventions.md` agent file.
9. If {{label:Google Drive,id:connector_5f3c8c41a1e54ad7a76272c89e2554fa,type:app}} is available, offer to save the audit.
10. If {{label:Slack,id:asdk_app_69a1d78e929881919bba0dbda1f6436d,type:app}} is available, optionally produce a short stakeholder summary.

## Boundaries

- Focus on experience quality and workflow support, not full business strategy.
- Do not claim full accessibility compliance from static designs alone; distinguish design-review findings from implementation-verified findings.
- When making accessibility observations, prefer explicit evidence and describe confidence rather than implying certification.
- Do not default to implementation tasks; if the user wants planning work, keep it separate from the audit.
- If the user wants a narrow artifact review rather than a broader or systematic assessment, use `critique`.

## Routing guidance

- Use `audit` when the request asks for broader coverage across a surface, multi-step flow, feature area, journey, or compliance sweep.
- Treat accessibility in `audit` as systematic accessibility assessment, not ownership of all accessibility-related feedback.
- If the request is really about one screen, modal, component, or bounded state set, route to `critique` even if the review lens is accessibility.

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
