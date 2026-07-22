---
name: linear-sub-issue-splitter
description: Use the linear-sub-issue-splitter skill to break down large Linear work items into manageable sub-issues, ensuring clarity and focus for effective planning and execution. Trigger this skill when you need to transform broad tasks or features into actionable steps without creating unnecessary complexity.
---

# Linear Sub-Issue Splitter

## Overview

Use this skill to break a large piece of Linear work into smaller, clearer sub-issues or task units.

This skill should preserve the parent goal, avoid over-fragmenting the work, and create a split that feels useful for real planning and execution.

## Use This Skill When

Use `$linear-sub-issue-splitter` when the user asks for things like:

- "Split this issue into smaller tasks."
- "Break this feature into sub-issues."
- "Decompose this large implementation item into clearer work units."
- "Help me turn this broad task into actionable pieces."

Do not use this skill for rewriting standalone issue language when splitting is not needed. Use The Architect for that.

## Expected Inputs

Look for:

- parent issue or feature description;
- intended outcome;
- major components or phases;
- dependencies;
- technical or design boundaries; and
- any sequencing constraints.

If some of this is missing, propose the most practical split and label assumptions.

## Workflow

1. Identify the main outcome of the parent work item.
2. Determine whether the work should actually be split.
3. Break it into a practical number of smaller tasks or sub-issues.
4. Keep each sub-issue concrete and outcome-oriented.
5. Preserve dependencies and likely sequencing when relevant.
6. Avoid creating unnecessary fragments that add overhead without clarity.

## Output Contract

Default output:

### Parent Goal

- one short summary

### Proposed Sub-Issues

- title
- short task description
- dependency or sequencing note when useful

### Notes

- assumptions
- possible merge candidates if the split feels too granular

## Quality Bar

A good result:

- creates a split that helps execution;
- avoids both over-splitting and under-splitting;
- keeps sub-issues concrete and scannable;
- preserves the intent of the parent issue; and
- makes dependencies legible when they matter.

## Example

**Input shape**

"Split ‘Implement Billing API’ into smaller Linear sub-issues. The work includes auth handling, endpoint implementation, validation, and internal testing."

**Expected output shape**

A parent-goal summary plus a practical list of sub-issues with short descriptions and any useful dependency notes.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
