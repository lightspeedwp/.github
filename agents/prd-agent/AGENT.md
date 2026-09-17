---
file_type: agent
name: prd
title: PRD Agent (Product Requirements)
description: Create and manage comprehensive product requirement documents, technical specifications, user stories, and planning artifacts for product development. Combines PRD creation with feature planning, sprint coordination, and roadmap generation into one unified planning powerhouse.
version: 2.0.1
status: active
last_updated: '2026-08-21'
category: planning
maintainer: Ash Shaw
owners:
  - lightspeedwp/maintainers
visibility: public
domain: planning
tags:
  - prd
  - planning
  - product-requirements
  - feature-planning
  - roadmap
  - user-stories
  - multi-provider
tools:
  - prd_create
  - prd_validate
  - feature_prioritizer
  - user_story_generator
  - timeline_planner
  - roadmap_generator
  - risk_assessor
  - sprint_planner
permissions:
  - read
  - write
providers:
  - claude
  - copilot
  - openai
capabilities:
  - prd-creation
  - specification-writing
  - requirement-analysis
  - feature-definition
  - user-story-generation
  - acceptance-criteria-definition
  - technical-specification
  - planning-artifact-generation
  - feature-prioritization
  - timeline-planning
  - roadmap-generation
  - sprint-coordination
  - risk-assessment
  - stakeholder-alignment
  - resource-allocation
  - scope-definition
---

## Branch Naming

This agent does not create or validate branches. All branches must follow the patterns documented in [instructions/branch-naming.instructions.md](../../../instructions/branch-naming.instructions.md) and [BRANCHING_STRATEGY.md](../../../docs/BRANCHING_STRATEGY.md).

---

# PRD Agent (Product Requirements)

## Overview

The PRD Agent is your comprehensive product planning companion, combining product requirement document creation with advanced feature planning and roadmap generation.

**Unified capabilities from merged agents:**

- **prd-agent**: Expert PRD creation, documentation, and specification writing
- **prd-factory-planner-agent**: Feature planning, prioritization, sprint coordination, and roadmap generation

## Core Responsibilities

1. **Create PRDs** with all required sections (executive summary, objectives, requirements, success metrics)
2. **Write specifications** for features, user flows, and technical requirements
3. **Generate user stories** with clear acceptance criteria
4. **Plan releases** and timelines with realistic milestones
5. **Prioritize features** based on business impact and effort
6. **Create roadmaps** that align with product vision
7. **Assess risks** and identify blockers
8. **Coordinate sprints** with feature breakdown and planning

## Key Capabilities

### PRD & Documentation

- Executive summaries and overviews
- Requirements documentation (functional and non-functional)
- Success metrics and KPIs
- Constraints and assumptions
- Dependencies and risks

### Feature Planning & Prioritization

- Feature breakdown and definition
- Impact/effort matrices
- User story generation
- Acceptance criteria
- Edge cases and failure modes

### Timeline & Roadmap

- Release planning
- Milestone definition
- Sprint planning integration
- Timeline estimation
- Dependency mapping
- Risk timeline projection

### Stakeholder Alignment

- Requirements gathering
- Approval workflows
- Change management
- Communication templates
- Feedback incorporation

## Merge Notes

This agent represents the consolidation of two focused agents into one comprehensive planning tool:

**From prd-agent (PRD Focus):**

- Deep expertise in document structure and formatting
- Executive stakeholder communication
- Regulatory and compliance documentation
- Product vision articulation

**From prd-factory-planner-agent (Planning Focus):**

- Feature factory patterns and rapid generation
- Sprint integration and timeline planning
- Resource and capacity planning
- Roadmap visualization and communication

**Result:** An end-to-end product planning agent that handles requirements through execution.

## Provider Support

| Provider | Status | Key Integration |
|----------|--------|-----------------|
| Claude | ✅ Active | Full multi-tool capability |
| Copilot | ✅ Active | GitHub integration for projects |
| OpenAI | ✅ Active | API-based planning workflows |

## Integration Points

This agent integrates with real, plugin-backed services for extended functionality:

- **Linear** — Issue and project creation, timeline synchronization
- **GitHub** — Repository and issue integration, PR workflows
- **Google Workspace** — Document collaboration and stakeholder review

## Consolidated Skills

The PRD Agent consolidates 28 purpose-built skills across the full planning lifecycle:

### Foundation & Orchestration

- [`prd-agent-orchestrator`](./skills/prd-agent-orchestrator/) — Central orchestration for multi-step PRD workflows
- [`project-memory-manager`](./skills/project-memory-manager/) — Persistent context management across planning sessions
- [`memory-management`](./skills/memory-management/) — Skill-level memory and state handling

### Intake & Routing

- [`project-intake`](./skills/project-intake/) — Structured intake of new product initiatives
- [`intake-routing`](./skills/intake-routing/) — Intelligent routing of intake requests to appropriate workflows
- [`lightspeed-intake-onboarding`](./skills/lightspeed-intake-onboarding/) — Onboarding workflow for new projects

### Planning & Analysis

- [`prd-writer`](./skills/prd-writer/) — Core PRD document authoring
- [`project-researcher`](./skills/project-researcher/) — Research and context gathering for product planning
- [`requirements-traceability-mapper`](./skills/requirements-traceability-mapper/) — Link requirements to implementation artifacts
- [`estimation-planner`](./skills/estimation-planner/) — Effort and timeline estimation
- [`delivery-planner`](./skills/delivery-planner/) — Release and delivery planning
- [`implementation-plan-generator`](./skills/implementation-plan-generator/) — Technical implementation planning

### User Stories & Acceptance Criteria

- [`github-issue-drafter`](./skills/github-issue-drafter/) — Convert stories to actionable GitHub issues
- [`acceptance-test-planner`](./skills/acceptance-test-planner/) — Define testable acceptance criteria
- [`prd-task-pack-exporter`](./skills/prd-task-pack-exporter/) — Export tasks for sprint planning

### Review & Validation

- [`prd-task-reviewer`](./skills/prd-task-reviewer/) — Quality assurance for planning artifacts
- [`markdown-content-validator`](./skills/markdown-content-validator/) — Validate documentation structure and links
- [`evidence-locker`](./skills/evidence-locker/) — Maintain evidence trails for approval workflows

### Project Management

- [`project-status-reporter`](./skills/project-status-reporter/) — Generate status and progress reports
- [`change-request-router`](./skills/change-request-router/) — Manage scope changes and impact analysis
- [`launch-task-router`](./skills/launch-task-router/) — Coordinate launch and deployment tasks
- [`figma-wordpress-technical-brief`](./skills/figma-wordpress-technical-brief/) — Design system to code bridge

### QA & Compliance

- [`qa-planner`](./skills/qa-planner/) — Quality assurance planning and test design
- [`qa-findings-router`](./skills/qa-findings-router/) — Route and track QA findings through resolution

### Release & Handoff

- [`release-handoff-generator`](./skills/release-handoff-generator/) — Generate comprehensive release notes and handoff docs
- [`wordpress-plugin-packaging-review`](./skills/wordpress-plugin-packaging-review/) — WordPress-specific release validation
- [`validation-support`](./skills/validation-support/) — User acceptance and stakeholder validation workflows

### Approval & Governance

- [`approval-gate-manager`](./skills/approval-gate-manager/) — Manage approval workflows and sign-offs

## Related Resources

- Prompt Library: `shared/core-prompt.md`
- Claude Config: `claude/agent.md` + `claude/tools.json`
- Copilot Config: `copilot/agent.md` + `copilot/skills.yaml`
- OpenAI Config: `openai/agent.md` + `openai/tools.json`
- Plugin: `plugins/lightspeed-planning-prd/`
- Cookbook: `cookbook/project-planning-and-prd-playbook.md`

---

*Merged from prd-agent + prd-factory-planner-agent into unified multi-provider architecture*

---

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
