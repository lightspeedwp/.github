---
name: linear-duplicate-management-playbook
description: Create a clear and practical duplicate-handling playbook for managing issue triage in Linear. Use this skill when you need to define how to identify duplicates, select a canonical issue, and ensure important context is preserved while improving team communication and resolution efficiency.
---

# Linear Duplicate Management Playbook

## Overview

Use this skill to create a practical duplicate-handling process for {{label:Linear,id:asdk_app_69a089a326dc8191b32a3f2553f5be2c,type:app}}.

The goal is to stop teams from splitting signal across multiple issues, losing customer context, or resolving the same problem twice. Keep the playbook focused on how to identify duplicates, choose the canonical issue, preserve important context, and communicate resolution cleanly.

## Use This Skill When

Use `$linear-duplicate-management-playbook` when the user asks for things like:

- "Create a duplicate-handling playbook for triage."
- "Define how we choose the canonical issue when multiple requests describe the same problem."
- "Show how customer reports should be merged without losing the original signal."

Do not use this skill for general backlog deduplication unless the request is specifically about triage-stage duplicate handling.

## Expected Inputs

Look for:

- where duplicates originate;
- what patterns usually indicate duplication;
- who decides the canonical issue;
- what information must be preserved;
- whether linked requesters need status visibility; and
- how resolution should flow back to connected teams or tools.

## Workflow

1. Define what counts as a likely duplicate in this workflow.
2. Define how to choose the canonical issue.
3. Define what information should be merged or linked rather than discarded.
4. Protect one source of truth inside Linear.
5. Explain how related requesters, teams, or support channels should stay connected to the canonical issue.
6. Include what to do when duplicate confidence is low.

## Output Contract

Default output:

### Duplicate Risk Summary

### How To Identify Likely Duplicates

### Canonical Issue Selection Rules

### What To Preserve From Duplicate Reports

### Communication And Resolution Follow-Through

### Edge Cases And Review Triggers

## Quality Bar

A good duplicate playbook:

- preserves valuable context instead of only collapsing issue counts;
- keeps one clear source of truth;
- explains how confidence should affect merge decisions;
- covers low-confidence or partial-overlap cases; and
- helps teams avoid solving the same problem twice.

## Example

**Input shape**

"Create a duplicate-management playbook for Linear triage. We get the same customer issue through support, Slack, and direct internal requests. Define how to identify duplicates, select the canonical issue, preserve quotes and attachments, and keep everyone tied to the final resolution."

**Expected output shape**

A practical playbook with duplicate signals, canonical-issue rules, context-preservation guidance, and follow-through rules.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
