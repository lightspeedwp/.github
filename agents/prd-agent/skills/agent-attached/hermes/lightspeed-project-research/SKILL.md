---
name: lightspeed-project-research
description: Use when a LightSpeed project has briefs, repos, design context, websites, uploaded docs, or discovery material that need to be summarised into a source-backed research brief before PRD writing, estimating, delivery planning, or change assessment.
---

# LS Project Research

## Purpose

Research and summarise project evidence before downstream planning. The output should be a source-backed research brief that surfaces context, constraints, risks, assumptions, estimate-relevant factors, and open questions without turning into a full PRD.

## Shared LightSpeed lifecycle contract

Use the current user request as the highest-priority source. Then use current conversation context, attached files, existing project-state records, existing skill files, references, templates, examples, and memory defaults in that order.

Do not invent source evidence. Treat public claims, screenshots, or secondary summaries as context until the confidence level is clear.

## Request shapes

Use this skill for requests like:

- "Review this site, repo, and brief and tell me what matters before we write the PRD."
- "Summarise the product, technical, and content constraints from these project sources."
- "Pull together the research brief we need before estimating this build."

Success means returning a concise but trustworthy research brief with clear evidence grading and downstream implications.

## Workflow

1. Read `references/research-scope.md` to decide what belongs in the brief.
2. Use `references/source-confidence.md` and `references/source-priority.md` to grade each source.
3. Build a source inventory that distinguishes:
   - direct primary sources
   - secondary or interpretive sources
   - weak or stale sources
4. Summarise:
   - confirmed project context
   - constraints
   - risks
   - assumptions
   - PRD-ready notes
   - estimate-relevant factors
5. If a design-heavy request is really about design readiness, route to `design-context-synthesis` or `design-qa-readiness`.
6. If the user needs requirements drafting next, recommend `lightspeed-prd-writer`.
7. Use the templates for consistent output rather than a free-form narrative.

## Output contract

Return:

1. research summary
2. source inventory
3. confirmed project context
4. constraints
5. risks
6. assumptions
7. PRD-ready notes
8. estimate-relevant factors
9. open questions
10. recommended next skill

## Boundaries

Do not:

- write the full PRD unless explicitly routed to PRD writing
- estimate effort unless explicitly routed to estimation
- treat public website claims as approved internal requirements
- invent source evidence
- perform design QA; route to `design-context-synthesis` or `design-qa-readiness`

## Supporting Files

- `references/research-scope.md` — what to include in the brief.
- `references/source-confidence.md` — confidence grading rules.
- `references/source-priority.md` — source ranking logic.
- `references/cross-skill-routing.md` — specialist handoff rules.
- `templates/research-brief.md` — main brief structure.
- `templates/source-inventory.md` — source table shape.
- `templates/constraints-and-risks.md` — risk and constraint section.
- `schemas/research-brief.schema.json` — research output shape.
- `schemas/source-inventory.schema.json` — source inventory structure.
- `examples/research-brief-example.md` — sample brief.
- `tests/fixtures/research-cases.md` — manual validation set.

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
