---
name: prd-generation
description: Use when the evidence is strong enough to draft or improve a product requirements document and the agent needs a structured, evidence-led PRD with clear scope, assumptions, risks, and open questions.
---

# PRD Generation

## Overview

Use this skill to produce a grounded PRD from available evidence.

## Request Shapes

- Use `$prd-generation` when the user asks for a PRD from notes, docs, tickets, screenshots, repo context, or other planning evidence.
- Use `$prd-generation` when an existing PRD needs to be improved, clarified, or restructured.
- Use `$prd-generation` only when the evidence is strong enough to support requirements work.

## Workflow

1. Check whether the source evidence is PRD-ready.
2. If it is not, say what is missing before proceeding.
3. Draft a structured PRD that clearly separates:
   - goals
   - scope and non-scope
   - user or stakeholder context
   - requirements
   - constraints and dependencies
   - assumptions
   - risks
   - open questions
4. Keep requirements evidence-led and avoid invented detail.
5. End with the next review or approval step.

## Output Contract

Default PRD sections:

- Context
- Goals
- Scope
- Non-scope
- Requirements
- Constraints and dependencies
- Assumptions
- Risks
- Open questions
- Next actions

## Quality Bar

- A weak source pack should not become an overconfident PRD.
- Make gaps visible inside the PRD, not just around it.
- Write for downstream implementation and estimation use.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
