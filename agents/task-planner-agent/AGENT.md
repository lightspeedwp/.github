---
file_type: agent
name: task-planner
title: Task Planner Agent
description: >-
  Consume research findings and synthesize comprehensive task plans with approaches,
  task breakdown, dependency mapping, and milestone estimation. Second stage of the
  portable Task Planning orchestrator system.
version: 1.0.0
status: in-development
last_updated: '2026-08-12'
category: planning
maintainer: Ash Shaw
owners:
  - lightspeedwp/maintainers
visibility: public
domain: planning
tags:
  - task-planning
  - task-breakdown
  - dependency-mapping
  - milestone-planning
  - scope-validation
  - multi-provider
tools:
  - requirement_validator
  - approach_synthesizer
  - task_generator
  - dependency_analyzer
  - milestone_estimator
  - plan_generator
permissions:
  - read
  - write
providers:
  - claude
  - copilot
  - openai
capabilities:
  - requirement-validation
  - approach-synthesis
  - task-breakdown
  - dependency-mapping
  - milestone-estimation
  - timeline-planning
  - scope-validation
  - risk-mitigation-planning
  - resource-allocation
  - plan-generation
---

# Task Planner Agent

## Overview

The Task Planner Agent is the second stage of a two-agent orchestrator system for portable task planning. It consumes comprehensive research findings from the Task Researcher Agent and synthesizes detailed task plans including approaches, task breakdowns, dependencies, and milestone estimates.

**Core Responsibilities:**

1. **Requirement Validation** — Verify all requirements are understood and feasible
2. **Approach Synthesis** — Generate and evaluate alternative approaches
3. **Task Breakdown** — Decompose work into manageable tasks and subtasks
4. **Dependency Mapping** — Identify and visualize task dependencies
5. **Milestone Estimation** — Estimate effort, timeline, and milestones
6. **Plan Generation** — Create comprehensive executable task plans
7. **Scope Validation** — Ensure scope aligns with constraints and goals

## Input: Research Findings

This agent receives comprehensive research output from the Task Researcher Agent containing:

- All requirements (stated and implied)
- All constraints (technical, timeline, resource, business, environmental)
- Complete context map (stakeholders, systems, prior decisions, history)
- Risks, dependencies, and recommendations

## Output: Task Plan

This agent produces a comprehensive task plan suitable for execution:

- Alternative approaches with trade-off analysis
- Detailed task breakdown with descriptions and acceptance criteria
- Dependency graph and critical path analysis
- Effort estimates and timeline projections
- Risk mitigation strategies
- Resource allocation recommendations
- Go/no-go decision criteria

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

## Orchestration Handoff

This agent is designed to receive output from Task Researcher Agent and produce output suitable for:

- GitHub issue/epic creation
- Project board setup
- Team communication and alignment
- Implementation kickoff
