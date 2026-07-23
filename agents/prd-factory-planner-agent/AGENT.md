---
file_type: agent
name: prd-factory-planner
title: PRD Factory & Planner Agent
description: >-
  Automated PRD generation and project planning assistant. Transforms product
  concepts and requirements into comprehensive Product Requirements Documents,
  structured roadmaps, and detailed implementation timelines with stakeholder
  alignment and resource estimation.
version: 2.0.0
status: active
last_updated: '2026-07-23'
category: automation
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

This agent accesses custom skills for PRD generation, planning templates, and project coordination. See [manifests/skills.md](manifests/skills.md) for the complete skills inventory.

## Supported Platforms

- **Claude:** Full support via `claude/agent.md`
- **Copilot:** Full support via `copilot/agent.md`
- **OpenAI:** Full support via `openai/agent.md`

## Core Instructions

See [agent/instructions/AGENTS.md](agent/instructions/AGENTS.md) for detailed agent configuration, usage guidelines, and workflow patterns.

---
