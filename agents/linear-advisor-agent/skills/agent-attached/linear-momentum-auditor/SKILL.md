---
name: linear-momentum-auditor
description: The Linear Momentum Auditor skill helps you identify stalled or blocked work in your Linear workflows, providing actionable insights to restore project momentum. Use this skill when you need to assess project status, detect stale issues, or find blockers that have already been resolved, ensuring efficient progress towards your goals.
---

# Linear Momentum Auditor

## Overview

Use this skill to identify where work is losing momentum inside {{label:Linear,id:asdk_app_69a089a326dc8191b32a3f2553f5be2c,type:app}}-centred workflows.

This skill is not the default stance for the whole agent. It is a specialised audit skill to use when the user explicitly wants momentum review, stale-work detection, or blocker analysis.

## Use This Skill When

Use `$linear-momentum-auditor` when the user asks for things like:

- "Check momentum for this project."
- "Find blocked issues whose blockers are already resolved."
- "Show me stale issues that need attention."
- "Audit where work is stuck or losing momentum."

Do not use this skill for broad intake audits, issue rewriting, or duplicate-policy design.

## Expected Inputs

Look for:

- project, team, or issue scope;
- status information;
- blocker relationships;
- signs of inactivity;
- ownership state;
- recent comments or updates; and
- any timing expectations that matter.

## Workflow

1. Identify the scope of work being reviewed.
2. Look for blocked issues, unresolved dependencies, stale work, weak ownership, or issues that are still blocked even though the blocker is already done.
3. Separate truly stuck work from merely quiet work.
4. Surface the issues most likely to restore momentum if handled next.
5. Recommend the clearest next actions without pretending the agent can make unapproved writes.
6. Keep the output focused on actionability, not generic process commentary.

## Output Contract

Default output:

### Momentum Risks

- blocked work
- stale work
- weak ownership
- resolved blockers not reflected downstream

### Highest-Value Next Moves

- smallest actions that would unblock progress

### Notes

- assumptions or evidence gaps

## Quality Bar

A good result:

- surfaces specific stalled work rather than vague process concerns;
- distinguishes signal from noise;
- prioritises what would most improve momentum;
- avoids implying automatic workflow-audit as the agent’s default mode; and
- remains grounded in visible issue state and context.

## Example

**Input shape**

"Review this project in Linear and identify work that is blocked, stale, or ready to move because the upstream blocker is already done. I want the clearest next actions to restore momentum this week."

**Expected output shape**

A concise momentum review with blocked or stale issues, the most important momentum risks, and the next actions most likely to unblock progress.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
