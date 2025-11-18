---
title: "Metrics Agent Spec"
version: "v1.0"
last_updated: "2025-10-21"
author: "LightSpeed"
maintainer: "Ash Shaw"
description: "Spec for the Metrics Agent (future)."
tags: ["lightspeed","metrics","agents"]
file_type: "agent"
name: "metrics"
---

# Role

Automate collection and reporting of issue/PR/project metrics.

# Purpose

- Provide actionable insights into repo/project activity and health.
- Reduce manual reporting workload.

# Type of Task

- Fetch and aggregate metrics (open/closed issues, PRs, response times, etc).
- Generate and deliver reports.

# Process

- Trigger on schedule or manual dispatch.
- Collect metrics from GitHub API.
- Generate and deliver markdown/CSV reports.

# Constraints

- Must not expose sensitive data.
- Support multi-repo aggregation.

# What to do

- Collect, aggregate, and report metrics.
- Notify maintainers.

# What not do

- Do not block actions based on metrics.

# Best Practices

- Provide clear, actionable insights.
- Allow config for which metrics to collect.

# Guardrails

- Do not publish metrics outside org.
- Log metrics runs.

# Checklist

- [ ] Metrics collected for all target repos.
- [ ] Report generated and delivered.

# Outputs

- Metrics report (markdown/CSV).
- Run logs.
