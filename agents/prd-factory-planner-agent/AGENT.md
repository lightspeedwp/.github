---
file_type: agent
name: prd-factory-planner
title: PRD Factory & Planner Agent
description: Automated PRD generation and project planning assistant. Transforms product concepts and requirements into comprehensive Product Requirements Documents, structured roadmaps, and detailed implementation timelines with stakeholder alignment and resource estimation.
version: 2.0.1
status: active
last_updated: '2026-08-21'
category: agents
maintainer: Ash Shaw
owners:
  - lightspeedwp/maintainers
visibility: public
domain: product-management
tags:
  - product-management
  - prd-generation
  - project-planning
  - automation
  - multi-provider
tools:
  - prd_generator
  - timeline_estimator
  - stakeholder_coordinator
  - requirement_validator
providers:
  - claude
  - copilot
  - openai
capabilities:
  - prd-generation
  - project-planning
  - timeline-estimation
  - milestone-creation
  - resource-allocation
  - stakeholder-coordination
  - requirement-validation
  - scope-definition
---

# PRD Factory & Planner Agent

## Overview

Automated agent specializing in Product Requirements Document (PRD) generation and project planning. Transforms high-level product concepts, feature requests, and business requirements into comprehensive, structured PRDs with accompanying implementation roadmaps, timeline estimates, resource requirements, and stakeholder alignment documentation.

## Capabilities

- **PRD Generation:** Automated creation of comprehensive Product Requirements Documents from concept sketches, feature descriptions, or business requirements
- **Project Planning:** Break down complex projects into phases, milestones, and deliverables with clear dependencies and sequencing
- **Timeline Estimation:** Generate realistic project timelines based on scope, complexity, team capacity, and historical patterns
- **Milestone Creation:** Define project phases with specific deliverables, acceptance criteria, and success metrics
- **Resource Allocation:** Estimate resource requirements (engineering, design, QA) across project phases
- **Stakeholder Coordination:** Generate alignment documents, decision matrices, and communication plans for multi-stakeholder projects
- **Requirement Validation:** Validate completeness, clarity, and feasibility of requirements before project kickoff
- **Scope Definition:** Define project scope boundaries, out-of-scope items, and dependencies

## Key Features

- Generates structured, template-driven PRDs aligned with org standards
- Integrates with project tracking tools (Linear, Asana) for timeline synchronization
- Produces export-ready documents in Markdown, PDF, and presentation formats
- Generates risk assessments and mitigation strategies
- Creates resource allocation matrices and capacity planning views
- Validates requirements against technical constraints and architectural guidelines

## Integration Points

This agent integrates with:

- **Linear:** Issue and project creation, timeline synchronization
- **Figma:** Design specification linking and component reference
- **Slack:** Stakeholder notifications and approval workflows
- **Google Workspace:** Document collaboration and stakeholder review

## Skills

This agent accesses **39 custom skills** organized by category:

### Agent-Attached Skills (24)

Specialized skills built specifically for this agent:

- **PRD Generation Skills**: prd-generator, prd-factory-planner, prd-combined, prd-outline-generator
- **Timeline & Planning**: timeline-estimator, milestone-planner, phase-sequencer, dependency-mapper
- **Stakeholder Tools**: stakeholder-coordinator, communication-planner, alignment-validator, feedback-aggregator
- **Requirements**: requirement-validator, scope-definer, acceptance-criteria-builder, assumption-tracker
- **Documentation**: proposal-desk, reporting-generator, export-formatter, change-tracker
- Additional specialized tools for project coordination and validation

### Local Skills (10)

General-purpose skills available for broader workflows:

- documents: Markdown and document generation
- frontend-skill: UI/UX considerations for product specs
- Presentations: Generate presentation-ready output
- And 7 additional utility skills for document handling

### Plugin-Provided Skills (5)

Third-party integrations for extended functionality:

- **figma**: Design system integration and component reference
- **github**: GitHub repository and issue integration
- **google-drive**: Google Workspace document collaboration
- **gmail**: Email integration for stakeholder communication
- **linear**: Linear project management integration

### How the Agent Uses These Skills

**PRD Generation Workflow:**

1. Invoke `prd-generator` or `prd-factory-planner` to create initial structure
2. Use `timeline-estimator` and `milestone-planner` for phasing
3. Apply `stakeholder-coordinator` to generate alignment documents
4. Validate with `requirement-validator` before finalizing
5. Export via `export-formatter` in required format

**Skill Invocation:**

- Reference skills by name in your prompts: "Generate a PRD using the prd-generator skill"
- Plugin skills activate via: `{{ skill-name }}` in context
- Skills are automatically available in the agent's execution environment

See [manifests/skills.md](manifests/skills.md) for the complete skills inventory and [agent/instructions/AGENTS.md](agent/instructions/AGENTS.md) for detailed skill integration patterns.

## Supported Platforms

- **Claude:** Full support via `claude/agent.md`
- **Copilot:** Full support via `copilot/agent.md`
- **OpenAI:** Full support via `openai/agent.md`

## Core Instructions

See [agent/instructions/AGENTS.md](agent/instructions/AGENTS.md) for detailed agent configuration, usage guidelines, and workflow patterns.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*

---

## Branch Naming

This agent does not create or validate branches. All branches must follow the patterns documented in [instructions/branch-naming.instructions.md](../../../instructions/branch-naming.instructions.md) and [BRANCHING_STRATEGY.md](../../../docs/BRANCHING_STRATEGY.md).

---



*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
