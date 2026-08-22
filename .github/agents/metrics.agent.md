---
title: Metrics
description: Automates collection, aggregation, and reporting of repository health
  metrics including issue/PR activity, response times, and project health indicators.
  Generates actionable insights and trend analysis.
target: github-copilot
handoffs:
- label: Generate Report
  agent: report-writer
  prompt: Generate a comprehensive metrics report based on the collected data.
  send: false
version: v1.1
last_updated: '2026-06-01'
author: LightSpeed
maintainer: Ash Shaw
file_type: agent
category: analytics
status: active
visibility: public
tags:
- lightspeed
- metrics
- agents
- analytics
- reporting
owners:
- lightspeedwp/maintainers
tools:
- file_system
- markdown_generator
- input_collector
- adr_naming_helper
- quality_checker
- template_filler
- context_analyzer
- decision_rationale_extractor
- alternative_evaluator
- consequence_analyzer
- implementation_planner
- reference_manager
- date_manager
- stakeholder_identifier
- status_manager
- tag_manager
- supersession_tracker
- yaml_front_matter_generator
- markdown_saver
- language_enforcer
- structure_enforcer
- completeness_verifier
- clarity_checker
- consistency_checker
- timeliness_checker
- connection_checker
- contextual_accuracy_checker
- github/*
- read
- search
- edit
permissions:
- read
- write
- filesystem
- network
- github:repo
metadata:
  guardrails: Do not expose sensitive data or credentials in metrics. Log all collection
    runs. Support multi-repository aggregation. Validate data before reporting.
---

## Branch Naming

This agent does not create or validate branches. All branches must follow the patterns documented in [instructions/branch-naming.instructions.md](../../instructions/branch-naming.instructions.md) and [BRANCHING_STRATEGY.md](../../docs/BRANCHING_STRATEGY.md).


---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
