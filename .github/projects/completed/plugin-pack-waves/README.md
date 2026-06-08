---
title: "Plugin Pack Waves OPSX"
description: "Parent/child OPSX specification set for plugin-pack wave execution with a 10-plugin WordPress catalogue"
created_date: "2026-06-01"
last_updated: "2026-06-08"
file_type: "documentation"
version: "v1.1.0"
status: active
owners:
  - "LightSpeed Team"
tags:
  - "wordpress"
  - "plugin-pack"
  - "opsx"
  - "planning"
---

# Plugin Pack Waves OPSX

## Scope

- Current execution epic: [#940](https://github.com/lightspeedwp/.github/issues/940)
- Current execution tasks: [#941](https://github.com/lightspeedwp/.github/issues/941), [#942](https://github.com/lightspeedwp/.github/issues/942), [#943](https://github.com/lightspeedwp/.github/issues/943), [#944](https://github.com/lightspeedwp/.github/issues/944), [#945](https://github.com/lightspeedwp/.github/issues/945), [#946](https://github.com/lightspeedwp/.github/issues/946), [#947](https://github.com/lightspeedwp/.github/issues/947), [#948](https://github.com/lightspeedwp/.github/issues/948), [#949](https://github.com/lightspeedwp/.github/issues/949), [#950](https://github.com/lightspeedwp/.github/issues/950)
- Legacy wave parent/children for historical continuity: [#732](https://github.com/lightspeedwp/.github/issues/732), [#733](https://github.com/lightspeedwp/.github/issues/733), [#734](https://github.com/lightspeedwp/.github/issues/734), [#735](https://github.com/lightspeedwp/.github/issues/735)
- Objective: define, sequence, and execute a 10-plugin WordPress-focused plugin pack informed by Awesome Copilot marketplace patterns.

## Plugin Catalogue (10)

| ID | Plugin Name | Primary Purpose | Wave |
| --- | --- | --- | --- |
| P01 | WP Content Model Designer | Generate post type and taxonomy modelling plans from editorial requirements. | Second |
| P02 | WP Theme JSON Governor | Validate and harmonise theme.json tokens, presets, and spacing systems. | Second |
| P03 | WP Block Accessibility Guardian | Run WCAG 2.2 AA checks for custom blocks and editor flows. | Second |
| P04 | WP Plugin Dependency Sponsor Insights | Surface dependency health, risk, and sustainability signals for plugin stacks. | Third |
| P05 | WP Editor Performance Lab | Benchmark block editor interactions and identify measurable regressions. | Third |
| P06 | WP Release Readiness Gate | Automate pre-release QA, changelog checks, and packaging validation. | Third |
| P07 | WP Site Observability Traces | Add structured observability and trace diagnostics for plugin runtime paths. | Third |
| P08 | WP Docs to Playbook Generator | Turn repository docs into executable implementation playbooks. | Next-wave backlog |
| P09 | WP Test Automation Harness | Generate and run targeted tests for block/plugin changesets. | Next-wave backlog |
| P10 | WP AI Readiness Assessor | Evaluate WordPress sites for AI readiness and produce remediation reports. | Next-wave backlog |

## Traceability

- Parent/child wave specs:
  - [parents/01-parent-plugin-pack-wave-execution.md](parents/01-parent-plugin-pack-wave-execution.md)
  - [children/01-second-wave.md](children/01-second-wave.md)
  - [children/02-third-wave.md](children/02-third-wave.md)
  - [children/03-next-wave-backlog.md](children/03-next-wave-backlog.md)
- GitHub issue draft files: [issues](issues)
- OpenSpec strict proposal inputs: [openspec-strict](openspec-strict)
- OPSX run log and issue execution controls:
  - [ISSUE_EXECUTION_PLAN.md](ISSUE_EXECUTION_PLAN.md)
  - [ISSUE_REGISTER.md](ISSUE_REGISTER.md)
  - [RUN_LOG.md](RUN_LOG.md)

## Source Inspiration

The plugin concept set is informed by categories visible on the Awesome Copilot plugins index, including CMS development, readiness reporting, testing automation, observability, and project documentation workflows.

## Completion Checklist

- [x] 10-plugin catalogue documented and mapped to waves
- [x] Parent and child spec documents aligned to catalogue
- [x] Issue draft files created for all proposed tasks
- [x] OpenSpec strict proposal files prepared
- [x] GitHub issues created from draft files (#940-#950)
- [ ] OPSX proposal commands executed for each spec input (blocked by CLI lacking /opsx:propose support)
- [ ] PR opened, checks passed, and merged
- [ ] Related issues closed with completion evidence
