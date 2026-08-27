---
name: research-synthesis
description: Synthesize product and design inputs such as interviews, support themes, tickets, usage summaries, and internal docs into design-ready insights; use when a team needs findings, tensions, and implications for design decisions.
metadata:
  short-description: Synthesize research into design insights
---

# Research Synthesis

Use this skill to turn mixed product inputs into evidence-backed design guidance.

> If placeholders such as `[[example_placeholder]]` are still unresolved, use
> the shared agent file `CONNECTORS.md` to map them to the connected tools for
> this agent.

## Use when

- the user provides interviews, notes, support themes, surveys, or tickets
- the goal is to extract patterns that should change design decisions
- the team needs a concise synthesis artifact rather than raw notes

## Inputs

Minimum useful inputs:

- at least one evidence source
- the product area or decision the synthesis should inform

Optional inputs:

- multiple repositories of notes or docs from {{label:Google Drive,id:connector_5f3c8c41a1e54ad7a76272c89e2554fa,type:app}}, uploads, or pasted context
- analytics summaries from `[[product_analytics]]`
- stakeholder questions that the synthesis should answer

## Workflow

Before drafting, check `DESIGN_CONTEXT.md` when it exists for standing audience, source-priority, or research-repository context. If it is missing or incomplete, say so briefly and continue.

1. Inventory evidence sources, note coverage gaps, and anchor the synthesis in the decision it should inform.
2. Remove exact duplicates and collapse near-duplicates while preserving corroboration count.
3. Cluster evidence by user job and workflow breakdown, not by repeated wording alone.
4. For each major theme, identify the user job, breakdown, observed evidence, workaround, workaround cost, design implication, and confidence using the `research-synthesis-template.md` agent file.
5. Distinguish clearly between symptoms, likely root causes, requests, workarounds, and evidence gaps.
6. Rank opportunity areas using impact, frequency, severity, workaround cost, strategic relevance, and confidence.
7. Convert findings into design implications and next actions, then apply the `output-conventions.md` agent file.
8. If {{label:Google Drive,id:connector_5f3c8c41a1e54ad7a76272c89e2554fa,type:app}} is available, offer to persist the synthesis.
9. If {{label:Slack,id:asdk_app_69a1d78e929881919bba0dbda1f6436d,type:app}} is available, optionally produce a stakeholder summary.

## Boundaries

- Bias toward product and design inputs first; do not drift into generic market research.
- If the user wants a broader experience audit or comparative audit, use `audit`.
- If the next ask is concept generation, hand off to `experiments`.
- Do not turn the synthesis into a deck, slide artifact, or PDF styling exercise as part of this skill.

## Research stance

Act like a principal UX researcher, not a complaint summarizer.

- Explain the workflow the user is trying to complete.
- Highlight where the experience breaks down and what users do instead.
- Surface the trust cost, task cost, and operational cost of those workarounds.
- Separate recurring structural problems from isolated requests.
- Be explicit about what is clear enough to design now versus what still needs research.

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
