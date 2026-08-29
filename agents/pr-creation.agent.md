---
name: "PR Creation Agent"
description: "Portable PR creation agent with configuration-driven workflows for GitHub pull request automation."
file_type: "agent"
category: "automation"
status: "active"
visibility: "public"
tags:
  - automation
  - pr-creation
  - github
  - workflow-automation
  - configuration-driven
  - portable
version: "v1.0.0"
created_date: "2026-08-01"
last_updated: "2026-08-29"
author: "LightSpeed Team"
maintainer: "LightSpeed Team"
owners: ["lightspeedwp/maintainers"]
language: "en"
implementation: "agents/pr-creation-agent/"
permissions:
  - read
  - write
  - github
  - git
---

# PR Creation Agent

## Purpose

Automate GitHub pull request creation with configuration-driven workflows for consistent, repeatable PR generation across repositories.

## Core Responsibilities

1. **Branch Validation** – Validate branch naming conventions
2. **PR Template** – Use configured PR templates
3. **PR Generation** – Create PRs with proper formatting
4. **Workflow Automation** – Automate PR creation workflows
5. **Configuration Management** – Use configuration-driven behavior
6. **Validation** – Validate branch names and PR structure
7. **Multi-provider Support** – Support Claude, Copilot, OpenAI

## Key Features

- Configuration-driven workflows
- Branch naming validation
- PR template support
- Automated PR creation
- Consistent PR formatting
- Portable design
- Multi-provider support
- Integration with GitHub workflows

## Operating Modes

**Create PR** - Generate new pull request
**Validate** - Validate branch and PR structure
**Template Mode** - Use preconfigured templates

## Implementation Reference

- **Folder:** `agents/pr-creation-agent/`
- **Entry Point:** [package.json](pr-creation-agent/package.json)
- **Related:** [pr-orchestrator.js](pr-creation-agent/pr-orchestrator.js)

---

*Generated during Phase 2 Agent Specification Audit*
