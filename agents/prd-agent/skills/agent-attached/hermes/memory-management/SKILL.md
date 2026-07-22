---
name: memory-management
description: Use when the agent must decide whether planning context should be saved as durable memory, updated, ignored, or left unsaved to avoid polluting long-term context.
---

# Memory Management

## Overview

Use this skill to decide what durable planning context should be remembered.

## Request Shapes

- Use `$memory-management` when new planning context may need to persist across future runs.
- Use `$memory-management` when the agent is handling decisions, approved assumptions, recurring preferences, or stable source-of-truth references.
- Use `$memory-management` when the agent needs to avoid storing transient or unapproved material.

## Workflow

1. Check whether the new information is durable and likely to matter later.
2. Save only context such as:
   - approved decisions
   - approved assumptions
   - stable project context
   - recurring preferences
   - stable source-of-truth references
3. Do not save transient notes, brainstorming, duplicates, or unresolved speculation.
4. Prefer structured, predictable memory updates.
5. If the context is not durable enough, explicitly skip saving it.

## Output Contract

When used during reasoning, produce a clear memory judgment:

- save
- update existing memory
- do not save

Include the reason for that decision.

## Quality Bar

- Memory should improve continuity, not add noise.
- Do not treat temporary working notes as durable state.
- Do not store unapproved assumptions as settled facts.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
