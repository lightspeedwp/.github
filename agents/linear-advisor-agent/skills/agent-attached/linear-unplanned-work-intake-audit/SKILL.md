---
name: linear-unplanned-work-intake-audit
description: Audit how bugs, requests, and feedback enter Linear, identify duplication and context loss, and recommend a stronger Linear-centred intake flow. Use when the user wants to review intake quality, reduce chaos, or redesign unplanned-work capture.
---

# Linear Unplanned Work Intake Audit

## Overview

Use this skill to audit how unplanned work currently enters Linear and where the intake flow is losing clarity, context, ownership, or momentum.

The goal is not to redesign the whole operating model. The goal is to show whether incoming bugs, support signals, internal asks, and customer feedback are being captured cleanly enough for good triage inside {{label:Linear,id:asdk_app_69a089a326dc8191b32a3f2553f5be2c,type:app}}.

## Use This Skill When

Use `$linear-unplanned-work-intake-audit` when the user asks for things like:

- "Audit our intake flow for bugs and customer requests before they land in Linear."
- "Find where context gets lost between Slack, support, email, and Linear."
- "Review whether our current intake process creates duplication or weak triage inputs."

Do not use this skill for backlog prioritisation, roadmap planning, or project health reviews unless the intake path itself is the main problem.

## Expected Inputs

Work with whatever the user provides, but look for:

- intake sources such as forms, Slack, support tools, email, or direct issue creation;
- who creates or forwards requests;
- what information is captured at intake time;
- where the issue first becomes a Linear issue;
- examples of duplication, missing context, or routing failures; and
- any current rules, forms, SOPs, or screenshots.

If some of that is missing, proceed with the clearest safe assumptions and explicitly label them.

## Workflow

1. Identify the current intake channels and the path each one takes into Linear.
2. Determine where request context is preserved well and where it gets lost.
3. Check whether the current flow creates duplicate issues, vague issues, weak ownership, or inconsistent triage quality.
4. Separate problems into:
   - context loss;
   - duplication risk;
   - unclear routing;
   - missing required fields; and
   - weak ownership or escalation.
5. Recommend a more Linear-centred intake pattern that reduces context switching and improves triage readiness.
6. Keep supporting tools in a secondary role. They may feed Linear, but they should not displace it as the source of triage truth.

## Output Contract

Default output:

### Current Intake Summary

- short summary of how requests arrive today

### Main Gaps

- the top intake weaknesses

### Risks Created By The Current Flow

- context loss
- duplication
- poor routing
- weak prioritisation inputs

### Recommended Intake Design

- the improved Linear-centred intake flow

### First Improvements To Make

- the smallest highest-value changes first

## Quality Bar

A good result:

- keeps Linear at the centre of the improved flow;
- names specific intake failures instead of vague process complaints;
- distinguishes evidence from assumptions;
- avoids generic workflow advice; and
- recommends practical improvements a team could implement.

## Example

**Input shape**

"Audit our current unplanned work intake. Bugs come from BugHerd, support requests come from Zendesk and Slack, and internal asks often become Linear issues without enough context. Show where context is lost and how to make Linear the clean source of truth."

**Expected output shape**

A concise audit with the current-state map, the main intake risks, and a recommended intake design centred on Linear.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
