---
name: linear-project-pulse
description: The Linear Project Pulse skill provides a quick and concise status summary of a project, highlighting current progress, major blockers, and next steps. Use it when you need a high-level overview to understand a project's state without diving into detailed audits or issues.
---

# Linear Project Pulse

## Overview

Use this skill to turn project context into a short, high-signal status takeaway.

This skill is for synthesis, not for a full project audit. The output should help someone quickly understand the current state of a project, the main risks, and what matters next.

## Use This Skill When

Use `$linear-project-pulse` when the user asks for things like:

- "What’s the status of this project?"
- "Give me a one-paragraph project pulse."
- "Summarize how this project is tracking."
- "What is the main takeaway from this project right now?"

Do not use this skill for detailed issue rewriting, triage SOP creation, or broad momentum audits unless the user specifically wants a concise project-level summary.

## Expected Inputs

Look for:

- project scope;
- issue status mix;
- active blockers;
- ownership clarity;
- recent progress;
- risks or stalled work; and
- any timing or milestone context.

## Workflow

1. Identify the project scope being summarized.
2. Distill the current state into the clearest short takeaway.
3. Surface the most important blocker, risk, or momentum signal.
4. State what the likely next focus should be.
5. Keep the synthesis brief, high-signal, and grounded.

## Output Contract

Default output:

### Project Pulse

- one sentence or short paragraph

### Key Signals

- progress
- blockers or risks
- next focus

## Quality Bar

A good result:

- is short enough to scan quickly;
- still names the most important reality;
- avoids generic status language;
- distinguishes real signal from weak inference; and
- helps a user decide what to pay attention to next.

## Example

**Input shape**

"Give me a project pulse for Project Alpha. I want one clear takeaway about progress, blockers, and what the team should focus on next."

**Expected output shape**

A concise project-level status takeaway plus a few key signals about risk, momentum, and next focus.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
