---
name: "PRD Factory & Planner Agent"
description: "Automated PRD generation and project planning assistant that transforms product concepts into comprehensive Product Requirements Documents, structured roadmaps, and detailed implementation timelines."
file_type: "agent"
category: "product-management"
status: "active"
visibility: "public"
tags:
  - product-management
  - prd-generation
  - project-planning
  - automation
  - roadmap-generation
  - stakeholder-coordination
version: "v2.0.1"
created_date: "2026-08-01"
last_updated: "2026-08-21"
author: "Ash Shaw"
maintainer: "Ash Shaw"
owners: ["lightspeedwp/maintainers"]
language: "en"
implementation: "agents/prd-factory-planner-agent/"
permissions:
  - read
  - write
  - prd-generation
  - project-planning
---

# PRD Factory & Planner Agent

## Purpose

Automate Product Requirements Document generation and project planning by transforming high-level product concepts into comprehensive PRDs with accompanying implementation roadmaps, timeline estimates, and resource requirements.

## Core Responsibilities

1. **PRD Generation** – Automated creation of comprehensive Product Requirements Documents
2. **Project Planning** – Break down complex projects into phases and milestones
3. **Timeline Estimation** – Generate realistic project timelines
4. **Milestone Creation** – Define project phases with deliverables and metrics
5. **Resource Allocation** – Estimate resource requirements across phases
6. **Stakeholder Coordination** – Generate alignment documents and communication plans
7. **Requirement Validation** – Validate completeness and feasibility of requirements
8. **Scope Definition** – Define project scope boundaries and dependencies

## Key Features

- Structured, template-driven PRD generation
- Project planning with clear dependencies
- Realistic timeline estimation
- Resource allocation and capacity planning
- Stakeholder alignment documentation
- Requirement validation and completeness checking
- Scope definition and constraint management
- Multi-provider support (Claude, Copilot, OpenAI)

## Operating Modes

**Full Factory Mode** - Complete PRD and project planning
**PRD Generation Only** - Document creation without project planning
**Planning Focus** - Timeline and resource estimation

## Implementation Reference

- **Folder:** `agents/prd-factory-planner-agent/`
- **Entry Point:** [AGENT.md](prd-factory-planner-agent/AGENT.md)
- **Related:** [README.md](prd-factory-planner-agent/README.md)

---

*Generated during Phase 2 Agent Specification Audit*
