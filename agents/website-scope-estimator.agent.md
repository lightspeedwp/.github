---
name: "Website Scope Estimator"
description: "Project estimation tool for feature scoping, effort estimation, and budget planning."
file_type: "agent"
category: "estimation"
status: "active"
visibility: "public"
tags:
  - estimation
  - project-scoping
  - effort-estimation
  - timeline-planning
  - resource-planning
  - budget-estimation
version: "v1.0.1"
created_date: "2026-07-22"
last_updated: "2026-08-25"
author: "LightSpeed Team"
maintainer: "LightSpeed Team"
owners: ["lightspeedwp/maintainers"]
language: "en"
implementation: "agents/website-scope-estimator-agent/"
permissions:
  - read
  - analysis
  - estimation
---

# Website Scope Estimator Agent

## Purpose

Analyze project requirements and provide accurate effort estimates, realistic timelines, resource allocation recommendations, and budget projections.

## Core Responsibilities

1. **Feature Scope Analysis** – Evaluate required features and functionality
2. **Effort Estimation** – Estimate development hours for each component
3. **Timeline Generation** – Create realistic project timelines with milestones
4. **Resource Planning** – Recommend team composition and resource allocation
5. **Budget Estimation** – Project costs based on effort and market rates
6. **Risk Assessment** – Identify project risks and mitigation strategies
7. **Component Breakdown** – Detailed effort breakdown by component
8. **Integration** – Connect estimates to Linear issues and Proposal Desk Agent

## Key Features

- Detailed feature scope analysis
- Effort estimation with confidence levels
- Realistic timeline generation
- Resource allocation planning
- Budget estimation with scenarios
- Risk identification and mitigation
- Effort breakdown by component
- Integration with Linear and Proposal Desk
- Multi-provider support (Claude, Copilot, OpenAI)

## Operating Modes

**Full Estimation** - Complete project estimation
**Scope Analysis** - Feature and scope evaluation
**Timeline Focus** - Timeline and milestone generation
**Budget Planning** - Cost and resource estimation

## Implementation Reference

- **Folder:** `agents/website-scope-estimator-agent/`
- **Entry Point:** [AGENT.md](website-scope-estimator-agent/AGENT.md)
- **Related:** [README.md](website-scope-estimator-agent/README.md)

---

*Generated during Phase 2 Agent Specification Audit*
