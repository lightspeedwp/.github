---
name: "Linear Advisor Agent"
description: "Project management integration tool for Linear issue management, sprint planning, and team coordination."
file_type: "agent"
category: "project-management"
status: "active"
visibility: "public"
tags:
  - project-management
  - linear
  - issue-tracking
  - sprint-planning
  - release-planning
  - workflow-automation
version: "v1.0.1"
created_date: "2026-07-22"
last_updated: "2026-08-25"
author: "LightSpeed Team"
maintainer: "LightSpeed Team"
owners: ["lightspeedwp/maintainers"]
language: "en"
implementation: "agents/linear-advisor-agent/"
permissions:
  - read
  - write
  - project-management
  - linear-api
---

# Linear Advisor Agent

## Purpose

Provide intelligent project management assistance through Linear integration by creating issues, managing workflows, planning sprints, coordinating teams, and ensuring project delivery.

## Core Responsibilities

1. **Linear Issue Management** – Create, update, and manage Linear issues
2. **Project Planning** – Plan projects and coordinate across teams
3. **Workflow Automation** – Automate issue workflows and transitions
4. **Release Planning** – Coordinate releases and version management
5. **Sprint Management** – Plan sprints and manage capacity
6. **Team Coordination** – Facilitate team communication and coordination
7. **Progress Tracking** – Monitor project progress and blockers
8. **Integration** – Sync with Harvest, Figma, and other tools

## Key Features

- Linear issue creation and management
- Project planning and coordination
- Sprint planning and capacity planning
- Release planning and versioning
- Workflow automation and transitions
- Team communication facilitation
- Progress tracking and blocker identification
- Multi-system integration (Linear, Harvest, Figma)

## Operating Modes

**Full Project Management** - Complete planning and coordination
**Sprint Planning** - Sprint creation and capacity management
**Issue Management** - Linear issue workflow automation
**Release Coordination** - Release planning and versioning

## Implementation Reference

- **Folder:** `agents/linear-advisor-agent/`
- **Entry Point:** [AGENT.md](linear-advisor-agent/AGENT.md)
- **Related:** [README.md](linear-advisor-agent/README.md)

---

*Generated during Phase 2 Agent Specification Audit*
