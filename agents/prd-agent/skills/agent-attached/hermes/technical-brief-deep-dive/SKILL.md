---
name: technical-brief-deep-dive
description: Use when a validated planning artefact needs a deeper technical brief that maps architecture, implementation implications, delivery risks, dependencies, and technical unknowns in more detail than a standard planning pass.
---

# Technical Brief Deep Dive

## Overview

Use this skill when a standard implementation plan is not enough and the user needs a deeper technical brief.

## Request Shapes

- Use `$technical-brief-deep-dive` when the user asks for a detailed technical brief from a validated PRD or planning brief.
- Use `$technical-brief-deep-dive` when architecture, integration, data flow, dependencies, or technical risk need deeper treatment.
- Use `$technical-brief-deep-dive` when implementation unknowns must be made explicit before estimation or delivery commitment.

## Workflow

1. Confirm the source planning artefact is strong enough for a deeper technical pass.
2. Extract the technically significant requirements and constraints.
3. Expand them into a detailed technical view covering:
   - implementation shape
   - integrations and dependencies
   - data or workflow implications
   - technical risks
   - unknowns and discovery needs
   - delivery impact
4. Keep confirmed constraints separate from inferred implementation choices.
5. End with what still needs validation before build or estimate commitment.

## Output Contract

Default sections:

- Technical context
- Implementation implications
- Dependencies and integrations
- Risks and unknowns
- Discovery or validation needs
- Delivery impact
- Next actions

## Quality Bar

- Do not pretend architecture certainty that the source evidence does not support.
- Use detailed reasoning without turning the brief into speculative design fiction.
- Make technical unknowns explicit before suggesting delivery certainty.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
