# Task Researcher Agent

## Overview

The Task Researcher Agent is the first stage of a two-agent orchestrator system for portable task planning. It analyzes requirements, extracts constraints, maps context, and synthesizes research findings to prepare comprehensive input for the Task Planner Agent.

**Core Responsibilities:**

1. **Requirement Discovery** — Extract and clarify all stated and implied requirements
2. **Constraint Extraction** — Identify technical, timeline, resource, and business constraints
3. **Context Mapping** — Build a complete picture of relevant context and dependencies
4. **Research Synthesis** — Compile findings into structured research output
5. **Risk Assessment** — Identify potential blockers and risks
6. **Stakeholder Analysis** — Map stakeholder interests and constraints

## Handoff to Task Planner

This agent produces a comprehensive research output that feeds directly into the Task Planner Agent for:

- Approach synthesis
- Task breakdown
- Dependency mapping
- Milestone estimation
- Plan generation

## Provider Support

- **Claude** — Primary provider (latest Claude model)
- **Copilot** — GitHub Copilot enterprise integration
- **OpenAI** — OpenAI API (GPT-4 compatible)

## Architecture

Each provider has an identical interface but implementation-specific optimizations:

- `claude/agent.md` — Claude-specific instructions and tools
- `copilot/agent.md` — Copilot-specific instructions and tools
- `openai/agent.md` — OpenAI-specific instructions and tools

Provider-agnostic core prompt in `shared/core-prompt.md`.

---

## Branch Naming

This agent does not create or validate branches. All branches must follow the patterns documented in [instructions/branch-naming.instructions.md](../../../instructions/branch-naming.instructions.md) and [BRANCHING_STRATEGY.md](../../../docs/BRANCHING_STRATEGY.md).

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
