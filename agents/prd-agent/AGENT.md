---
file_type: agent
name: prd
title: PRD Agent (Product Requirements)
description: Create and manage comprehensive product requirement documents, technical specifications, user stories, and planning artifacts for product development. Combines PRD creation with feature planning, sprint coordination, and roadmap generation into one unified planning powerhouse.
version: 2.0.1
status: active
last_updated: '2026-08-18'
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

## Related Resources

- Prompt Library: `shared/core-prompt.md`
- Claude Config: `claude/agent.md` + `claude/tools.json`
- Copilot Config: `copilot/agent.md` + `copilot/skills.yaml`
- OpenAI Config: `openai/agent.md` + `openai/tools.json`
- Plugin: `plugins/lightspeed-planning-prd/`
- Cookbook: `cookbook/project-planning-and-prd-playbook.md`

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
