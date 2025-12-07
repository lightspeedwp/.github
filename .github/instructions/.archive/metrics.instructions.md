---
file_type: "instructions"
title: "Workflow: Issue Metrics Reporting"
description: "Collect and report issue metrics monthly for repositories and projects."
version: "v1.0"
apply_to: ".github/workflows/issue_metrics.yml"
last_updated: "2025-10-22"
owners: ["LightSpeed Engineering"]
references:
  - "./workflows.instructions.md"
  - "https://github.com/github/issue-metrics"
---

# Mission

Automate monthly reporting of issue statistics and trends.

# Strategy

- Scheduled or manual run.
- Collect stats (labels, aging, assignments, response times).
- Generate and post markdown report.

# Agent Alignment

- Future: integrate with metrics/reporting agent.

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
