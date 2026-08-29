---
name: "Harvest Analytical Agent"
description: "Time tracking and project analytics tool for profitability analysis, team productivity metrics, and billing generation."
file_type: "agent"
category: "analytics"
status: "active"
visibility: "public"
tags:
  - analytics
  - harvest
  - time-tracking
  - profitability
  - budgeting
  - billing
  - productivity-metrics
version: "v1.0.1"
created_date: "2026-07-22"
last_updated: "2026-08-25"
author: "LightSpeed Team"
maintainer: "LightSpeed Team"
owners: ["lightspeedwp/maintainers"]
language: "en"
implementation: "agents/harvest-analytical-agent/"
permissions:
  - read
  - analysis
  - harvest-api
---

# Harvest Analytical Agent

## Purpose

Analyze time tracking data, project profitability, team productivity, and budget performance to provide insights into project economics and team efficiency.

## Core Responsibilities

1. **Time Tracking Analysis** – Analyze time tracking patterns and accuracy
2. **Project Profitability** – Calculate project margins and profitability metrics
3. **Team Productivity** – Measure and analyze team productivity metrics
4. **Budget Tracking** – Monitor projects against budget and variance analysis
5. **Report Generation** – Create detailed analytics and profitability reports
6. **Billing Generation** – Support invoice creation and billing accuracy
7. **Cost Estimation** – Analyze cost estimation accuracy
8. **Integration** – Sync with Linear, Proposal Desk, and financial systems

## Key Features

- Time tracking data analysis and patterns
- Project profitability calculations
- Team productivity metrics and analysis
- Budget tracking and variance reporting
- Cost estimation accuracy analysis
- Resource utilization insights
- Billing and invoice generation support
- Multi-system integration (Harvest, Linear, Proposal Desk)

## Operating Modes

**Full Analytics** - Complete profitability and productivity analysis
**Profitability Analysis** - Project margin calculations
**Team Metrics** - Productivity and utilization analysis
**Budget Tracking** - Project budget monitoring

## Implementation Reference

- **Folder:** `agents/harvest-analytical-agent/`
- **Entry Point:** [AGENT.md](harvest-analytical-agent/AGENT.md)
- **Related:** [README.md](harvest-analytical-agent/README.md)

---

*Generated during Phase 2 Agent Specification Audit*
