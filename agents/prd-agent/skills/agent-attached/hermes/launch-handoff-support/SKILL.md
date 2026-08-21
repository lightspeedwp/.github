---
name: launch-handoff-support
description: Use when a planning artefact is moving toward delivery and the agent needs to prepare launch readiness, rollout planning, implementation handoff, or final downstream coordination outputs.
---

# Launch and Handoff Support

## Overview

Use this skill when the work is approaching delivery and needs a cleaner launch or handoff package.

## Request Shapes

- Use `$launch-handoff-support` when the user wants a launch-readiness checklist, rollout plan, or handoff pack.
- Use `$launch-handoff-support` when a PRD or technical brief is strong enough to support delivery coordination.
- Use `$launch-handoff-support` when the agent should identify what is still needed before implementation or launch can proceed safely.

## Workflow

1. Confirm the source planning artefact is mature enough for handoff or rollout work.
2. Extract the delivery-critical details:
   - scope
   - dependencies
   - approvals
   - implementation expectations
   - rollout or launch risks
   - unresolved blockers
3. Choose the right output shape: rollout plan, handoff pack, launch-readiness check, or downstream coordination brief.
4. Make the remaining dependencies and sign-off needs explicit.
5. End with the exact next action for delivery readiness.

## Output Contract

Default sections:

- Purpose of the handoff or rollout
- What is ready
- What is not ready
- Dependencies and blockers
- Risks and mitigations
- Required approvals or owners
- Next actions

## Quality Bar

- Do not imply launch readiness when major gaps remain.
- Keep the handoff practical and operational.
- Surface missing approvals and dependencies clearly.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
