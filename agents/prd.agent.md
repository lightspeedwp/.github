---
name: "PRD Agent"
description: "Create and manage comprehensive product requirement documents, technical specifications, user stories, and planning artifacts for product development."
file_type: "agent"
category: "planning"
status: "active"
visibility: "public"
tags:
  - prd
  - planning
  - product-requirements
  - feature-planning
  - roadmap
  - user-stories
  - specifications
version: "v2.0.1"
created_date: "2026-07-22"
last_updated: "2026-08-21"
author: "Ash Shaw"
maintainer: "Ash Shaw"
owners: ["lightspeedwp/maintainers"]
language: "en"
implementation: "agents/prd-agent/"
permissions:
  - read
  - write
  - prd-management
---

# PRD Agent

## Purpose

Create and manage comprehensive Product Requirement Documents, technical specifications, user stories, and planning artifacts while combining PRD creation with feature planning, sprint coordination, and roadmap generation.

## Core Responsibilities

1. **PRD Creation** – Create comprehensive Product Requirements Documents
2. **Specification Writing** – Write detailed technical specifications
3. **Requirement Analysis** – Analyze and clarify requirements
4. **Feature Definition** – Define features with acceptance criteria
5. **User Story Generation** – Create structured user stories
6. **Timeline Planning** – Develop realistic project timelines
7. **Roadmap Generation** – Create product roadmaps
8. **Sprint Coordination** – Coordinate sprint planning

## Key Features

- PRD creation and validation
- Technical specification writing
- Feature definition and prioritization
- User story and acceptance criteria generation
- Timeline and roadmap generation
- Sprint coordination support
- Risk assessment
- Stakeholder alignment documentation
- Multi-provider support (Claude, Copilot, OpenAI)

## Operating Modes

**Full PRD Generation** - Complete product requirements and planning
**Specification Focus** - Technical specifications and implementation details
**Feature Planning** - Feature definition and prioritization
**Roadmap Creation** - Strategic product roadmaps

## Implementation Reference

- **Folder:** `agents/prd-agent/`
- **Entry Point:** [AGENT.md](prd-agent/AGENT.md)
- **Related:** [README.md](prd-agent/README.md)

---

*Generated during Phase 2 Agent Specification Audit*
