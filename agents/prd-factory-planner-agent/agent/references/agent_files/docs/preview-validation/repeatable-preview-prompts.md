# Repeatable Preview Prompt Library

Use this library for consistent preview testing across the indexed example contexts.

Reference the master index file:

- `docs/preview-validation/example-contexts-index.md`

## Context Labels

- `CTX-LS-AGENCY`
- `CTX-TOUR-OPERATOR`
- `CTX-LSX-DESIGN`

---

## Prompt 1 — Intake Summary

Use context: `<CONTEXT_LABEL>`

Create the smallest useful intake summary from this indexed project context. Separate confirmed facts from assumptions, list source gaps, identify risks and blockers, and recommend the best next artefact.

---

## Prompt 2 — PRD Draft

Use context: `<CONTEXT_LABEL>`

Using the indexed project context, draft a PRD for the most likely current delivery need. Ground the document in the strongest available sources, separate assumptions clearly, and include goals, non-goals, user needs, risks, blockers, and next actions.

---

## Prompt 3 — Technical Brief

Use context: `<CONTEXT_LABEL>`

Using the indexed project context, create a technical brief focused on implementation planning. Use the most relevant design, repo, and site references. Highlight architecture implications, implementation considerations, dependencies, open questions, and risks.

---

## Prompt 4 — Source Priority Test

Use context: `<CONTEXT_LABEL>`

Review this indexed context and explain which sources should be treated as highest priority for planning accuracy. Identify likely source-of-truth conflicts, note what should be verified first, and recommend a safe planning approach.

---

## Prompt 5 — Repo and Site Alignment Review

Use context: `<CONTEXT_LABEL>`

Using the indexed project context, explain how you would compare the repository, design references, and available site links before drafting implementation work. Return a review plan with confirmed evidence, likely gaps, and what should be checked next.

---

## Prompt 6 — QA Planning Prompt

Use context: `<CONTEXT_LABEL>`

Create a preview-ready QA planning outline for this indexed context. Include validation areas, likely acceptance concerns, implementation-risk checks, evidence gaps, and the most useful next QA artefact.

---

## Prompt 7 — Handoff Readiness Review

Use context: `<CONTEXT_LABEL>`

Assess this indexed context for handoff readiness. Identify what is already sufficient for a planning handoff, what is missing, what remains assumption-based, and which next artefact would best reduce delivery risk.

---

## Prompt 8 — Context Comparison Prompt

Use contexts: `<CONTEXT_LABEL_1>` and `<CONTEXT_LABEL_2>`

Compare these two indexed contexts as planning inputs. Explain how their source mix, project type, and likely delivery needs differ, and recommend the best planning artefact for each.

---

## Prompt 9 — Minimal Useful Output Test

Use context: `<CONTEXT_LABEL>`

Given this indexed context, choose the smallest useful planning output instead of overproducing. Explain the choice briefly, then produce that artefact with clear confirmed facts, assumptions, blockers, and next steps.

---

## Prompt 10 — Evidence Discipline Test

Use context: `<CONTEXT_LABEL>`

Use this indexed context to demonstrate strict evidence discipline. Return a structured output that clearly separates confirmed facts, assumptions, missing evidence, risks, and recommended follow-up actions.

---

## Recommended Test Rotation

For each context, test in this order:

1. Intake Summary
2. Minimal Useful Output Test
3. PRD Draft or Technical Brief
4. Source Priority Test
5. QA Planning Prompt

---

## Notes For Reuse

- Swap only the context label when you want comparable preview runs.
- Keep the prompt wording stable when measuring consistency.
- Add one extra constraint only when intentionally testing behaviour under changed conditions.
- Record whether the run grounded itself correctly in the selected source set.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
