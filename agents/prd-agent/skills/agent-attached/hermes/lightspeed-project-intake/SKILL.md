---
name: lightspeed-project-intake
description: Use when a LightSpeed project starts from rough notes, client briefs, links, docs, tracker comments, email excerpts, QA notes, or other scattered source material and needs a clean intake record before PRD, research, estimate, or delivery work.
---

# LS Project Intake

## Purpose

Turn messy LightSpeed project inputs into a clean intake summary, source inventory, evidence register, confirmed facts, assumptions, exclusions, open questions, and an initial project-state recommendation.

This skill is for normalisation and readiness, not for full PRD drafting or estimation.

## Shared LightSpeed lifecycle contract

Use the current user request as the highest-priority source. Then use current conversation context, attached files, existing project-state records, existing skill files, references, templates, examples, and memory defaults in that order.

Do not invent facts, approval status, deadlines, estimates, or commitments. Mark assumptions explicitly and keep evidence labels visible: confirmed, inferred, assumed, missing.

When project state should change, recommend an update rather than silently rewriting durable memory unless the user explicitly asks.

## Request shapes

Use this skill for requests like:

- "Here are the notes, links, screenshots, and repo. Can you turn this into a proper project intake?"
- "We have client comments, QA notes, and a few docs — what do we actually know?"
- "Normalise this scattered project evidence before we start writing the PRD."

Success means producing a structured intake record that is usable by downstream research, PRD, estimation, or routing work.

## Workflow

1. Read `references/intake-rules.md` for normalisation behaviour.
2. Read `references/evidence-quality.md` and `references/source-priority.md` before treating any source as confirmed.
3. Build a source inventory:
   - approved source material
   - weak or stale material
   - excluded or unapproved sources
4. Convert the evidence into:
   - intake summary
   - confirmed facts
   - inferred assumptions
   - missing evidence
   - open questions
5. Use `templates/project-intake-record.md`, `templates/evidence-register.md`, and `templates/open-questions.md` to keep the shape consistent.
6. Recommend the next skill based on the strongest unresolved need:
   - research when source review is still needed
   - PRD writing when requirements are ready enough
   - estimation only when scope is materially stable
   - lifecycle routing when the next step is still ambiguous
7. If project-state implications are clear, recommend an initial project-state update without silently saving it.

## Output contract

Return:

1. intake summary
2. source inventory
3. confirmed facts
4. inferred assumptions
5. excluded or unapproved sources
6. missing evidence
7. smallest useful follow-up questions
8. recommended next skill
9. initial project-state update recommendation

## Boundaries

Do not:

- write the full PRD
- estimate effort
- produce implementation tasks
- generate launch QA plans
- treat unapproved evidence as approved
- store durable defaults without explicit approval

## Supporting Files

- `references/intake-rules.md` — intake workflow and evidence handling.
- `references/evidence-quality.md` — confidence checks for weak or mixed inputs.
- `references/source-priority.md` — source ranking rules.
- `references/cross-skill-routing.md` — when to hand off downstream.
- `templates/project-intake-record.md` — main intake structure.
- `templates/evidence-register.md` — source-by-source evidence log.
- `templates/open-questions.md` — gap-focused follow-up questions.
- `schemas/project-intake.schema.json` — intake payload shape.
- `schemas/evidence-register.schema.json` — evidence register shape.
- `schemas/project-state.schema.json` — shared project-state structure.
- `examples/intake-before-after.md` — example transformation.
- `tests/fixtures/intake-cases.md` — manual validation cases.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
