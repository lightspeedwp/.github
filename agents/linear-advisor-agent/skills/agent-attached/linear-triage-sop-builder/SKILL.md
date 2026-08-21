---
name: linear-triage-sop-builder
description: The Linear Triage SOP Builder helps you create a clear and actionable standard operating procedure for your team to consistently review and prioritize new issues. Use this skill when you need to establish decision-making processes and workflows for triage, ensuring clarity in roles and maintaining an organized queue while avoiding automation confusion.
---

# Linear Triage SOP Builder

## Overview

Use this skill to turn triage logic into a practical operating procedure for a team working in {{label:Linear,id:asdk_app_69a089a326dc8191b32a3f2553f5be2c,type:app}}.

The SOP should help a human team review new issues consistently, decide what happens next, and keep the triage queue clean without blurring the difference between automation support and human judgment.

## Use This Skill When

Use `$linear-triage-sop-builder` when the user asks for things like:

- "Write a triage SOP for our product ops team."
- "Turn our triage rules into a daily operating procedure."
- "Create a repeatable process for who reviews new issues and how they decide accept, decline, or duplicate."

Do not use this skill when the user only wants routing logic or automation rules. In those cases, use the rules-design skill instead.

## Expected Inputs

Look for:

- team or function responsible for triage;
- intake sources;
- rotation or ownership model;
- working cadence;
- decision options such as accept, duplicate, decline, snooze;
- urgency or escalation rules; and
- any expectations for inbox zero, handoff, or reporting.

If parts are missing, define a simple, realistic default and label it as an assumption.

## Workflow

1. Clarify the team context and what types of work enter triage.
2. Define the review cadence and ownership model.
3. Define the core decision options and when each applies.
4. Make human judgment explicit for high-impact decisions.
5. Include escalation rules for urgent production or customer-impacting work.
6. Keep the SOP operational: it should read like something a team can actually follow, not a strategy essay.

## Output Contract

Default output:

### SOP Purpose

### Scope

### Roles And Ownership

### Daily Or Weekly Triage Workflow

### Decision Rules

- Accept
- Duplicate
- Decline
- Snooze

### Escalation Rules

### Exceptions

### Expected End State

## Quality Bar

A good SOP:

- is clear enough for a rotating triage owner to follow;
- explains the decision path in a practical order;
- preserves human ownership for consequential choices;
- makes duplicate handling explicit; and
- keeps the triage queue focused on clarity and momentum.

## Example

**Input shape**

"Create a Linear triage SOP for a team with a weekly triage rotation. New work comes from Linear Asks, Slack, and support escalations. Define the review sequence, how to decide accept vs duplicate vs decline vs snooze, and when urgent issues should be escalated immediately."

**Expected output shape**

A structured SOP with roles, review cadence, triage actions, escalation rules, and the expected end state of a clean triage queue.

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
