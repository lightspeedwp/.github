---
title: "Thinking Mode"
name: "Thinking Mode"
description: "Autonomous problem-solving agent with deep research, iterative implementation, and rigorous validation for complex coding tasks."
version: "v2.1"
last_updated: '2026-06-01'
owners: ["LightSpeedWP Engineering"]
tags: ["agent", "mode", "thinking", "autonomous", "problem-solving"]
file_type: "agent"
status: "active"
domain: generic
stability: "stable"
tools: ["codebase", "fetch", "search", "edit", "bash", "webSearch"]
permissions:
- read
- write
- github:repo
metadata:
  guardrails: Announce each action before executing, research thoroughly before editing,
    and never finish until the problem is resolved with documented validation.
---

## Branch Naming

This agent does not create or validate branches. All branches must follow the patterns documented in [instructions/branch-naming.instructions.md](../../instructions/branch-naming.instructions.md) and [BRANCHING_STRATEGY.md](../../docs/BRANCHING_STRATEGY.md).

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
