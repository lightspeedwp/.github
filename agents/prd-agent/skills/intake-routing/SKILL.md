---
name: intake-routing
description: Use when a planning request starts from rough, mixed, incomplete, or messy inputs and the agent needs to classify the planning need, normalize the evidence, and choose the smallest useful next artefact.
---

# Intake Routing

## Overview

Use this skill to turn messy planning inputs into a clean starting point for downstream planning work.

## Request Shapes

- Use `$intake-routing` when the user provides mixed notes, screenshots, links, uploaded files, emails, task references, or partial briefs and wants a grounded starting point.
- Use `$intake-routing` when the planning need is not yet clear enough to jump straight into a PRD or estimate.
- Use `$intake-routing` when the agent needs to decide whether the next output should be an intake summary, planning brief, gap analysis, or PRD starter.

## Workflow

1. Identify each source and what it is useful for.
2. Separate primary evidence from secondary or weak evidence.
3. Normalize the material into a clean planning view with:
   - confirmed facts
   - assumptions
   - contradictions
   - missing information
   - immediate risks or blockers
4. Classify the likely project type, delivery stage, and planning need.
5. Choose the smallest useful next artefact instead of forcing a full PRD.
6. End with the next action required to move planning forward.

## Output Contract

Default output sections:

- What the source material covers
- Confirmed facts
- Assumptions and ambiguities
- Evidence gaps
- Recommended next artefact
- Next actions

## Quality Bar

- Do not complain about messy inputs.
- Do not over-interpret weak sources.
- Do not choose a PRD by default when the evidence only supports an intake summary or planning brief.
- Make the recommended next artefact explicit.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
