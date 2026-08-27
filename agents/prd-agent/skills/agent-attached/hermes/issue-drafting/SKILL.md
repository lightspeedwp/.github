---
name: issue-drafting
description: Use when planning work needs to be converted into clear, implementation-ready issue drafts, follow-up tasks, or tracker-ready work items without losing evidence, scope, or assumptions.
---

# Issue Drafting

## Overview

Use this skill to turn planning outputs into clear issue drafts for downstream execution.

## Request Shapes

- Use `$issue-drafting` when the user wants a planning item converted into tracker-ready issues or tasks.
- Use `$issue-drafting` when a PRD, technical brief, or gap analysis should become implementation issues, follow-up actions, or dependency tasks.
- Use `$issue-drafting` when the agent must preserve planning evidence while producing concise issue wording.

## Workflow

1. Identify the source planning artefact and the work item that needs to be drafted.
2. Extract the core implementation objective, scope, acceptance signals, dependencies, and constraints.
3. Draft the issue so it is concise but still grounded.
4. Keep assumptions and unknowns visible when they materially affect execution.
5. Split work only when the source planning clearly supports separate issues.

## Output Contract

Default issue structure:

- Title
- Problem or objective
- Scope
- Key requirements or acceptance signals
- Dependencies or blockers
- Assumptions or open questions

## Quality Bar

- Do not inflate issues with PRD-level prose.
- Do not drop important constraints just to keep the issue short.
- Preserve traceability back to the source planning work.

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
