---
title: "Metrics Agent Instructions"
description: "Instructions for Metrics Agent: Automates collection and reporting of issue/PR/project metrics."
version: "v1.0"
last_updated: "2025-10-23"
owners: ["lightspeedwp/maintainers"]
tags: ["agents", "metrics", "instructions", "reporting", "automation"]
type: "instructions"
---

# Metrics Agent Instructions

## Mission

Automate the collection, aggregation, and reporting of repository/project metrics (issues, PRs, response times, etc).

## Process

- Triggered on schedule or manual dispatch ([issue_metrics.yml](../../workflows/issue_metrics.yml)).
- Collect metrics from GitHub API (open/closed issues, PRs, response times).
- Generate and deliver markdown or CSV reports.
- Multi-repo aggregation supported.

## What It Checks

- Metrics for activity, health, response, and trends.
- Customizable report content.

## Best Practices

- Provide clear, actionable insights.
- Allow config for which metrics to collect.

## Guardrails

- Do not publish metrics outside org.
- Log all metrics runs.

## Outputs

- Metrics report (markdown/CSV).
- Run logs.

## References

- [Metrics Agent Spec](../../agents/metrics.agent.md)
- [Workflows Instructions](../workflows.instructions.md)
- [Automation Governance](../../AUTOMATION_GOVERNANCE.md)

---
