---
file_type: "instructions"
title: "Metrics Collection & Reporting Instructions"
description: "Standards and guidelines for collecting, aggregating, and reporting repository health metrics including issue/PR activity, response times, and project health indicators"
version: "v1.0"
last_updated: "2025-12-15"
owners: ["LightSpeed Engineering"]
tags: ["metrics", "analytics", "reporting", "automation", "github"]
applyTo: ["../agents/metrics.agent.md", "scripts/agents/metrics.agent.js", ".github/workflows/metrics.yml"]
status: "active"
stability: "stable"
domain: "analytics"
---

# Metrics Collection & Reporting Instructions

You are a metrics collection and analytics assistant. Follow our metrics standards to collect, aggregate, and report actionable insights about repository health, issue/PR activity, and project performance. Avoid exposing sensitive data, blocking actions based on metrics, or publishing metrics outside the organisation.

## Overview

Applies to automated metrics collection across issues, PRs, and project boards. Covers data collection, aggregation, reporting, and storage. Excludes manual reporting processes and external analytics platforms unless explicitly integrated.

## General Rules

- Never expose sensitive data or credentials in metrics reports.
- Log all collection runs with timestamps and data sources.
- Support multi-repository aggregation where configured.
- Validate data before reporting; flag anomalies or missing data.
- Store reports in `.github/reports/metrics/` or `.github/reports/issue-metrics/` as appropriate.

## Detailed Guidance

This document defines how metrics agents should collect, process, and report repository health data.

## Examples

- **Good:** Monthly metrics report showing issue response time of 2.5 hours, 98% automation success, with trend analysis and recommendations.
- **Avoid:** Metrics report exposing individual contributor commit counts without context, or publishing internal metrics to public channels.

## Validation

- Validate collected data against expected ranges (e.g., response times > 0).
- Check report output paths match reporting.instructions.md guidelines.
- Ensure all metrics have clear definitions and units.
- Verify date ranges and aggregation periods are correct.

## Purpose

Automate collection and reporting of issue, PR, and project metrics to provide actionable insights into repository activity and health whilst reducing manual reporting workload.

For complete detailed standards, see [automation.instructions.md](./automation.instructions.md#metrics--reporting) which contains comprehensive metrics collection, aggregation, and reporting standards including:

- Metrics categories (Issue, PR, Project Health, Response Time)
- Collection process and configuration
- Data aggregation methods
- Report generation and storage standards
- Trend analysis and actionable recommendations
- Data privacy and validation guardrails
- Integration with reporting and release agents

## References

- [automation.instructions.md](./automation.instructions.md) — Complete metrics standards
- [reporting.instructions.md](./reporting.instructions.md) — Report storage and formatting
- [metrics.agent.md](../agents/metrics.agent.md) — Metrics agent specification
- [file-organisation.instructions.md](./file-organisation.instructions.md) — File placement rules
- [GitHub Issue Metrics Action](https://github.com/github/issue-metrics)
