---
issue_number: 735
parent_issue: 732
file_type: documentation
title: "[Plugin Pack Child] Next Wave Backlog Spec & Sequencing"
description: "OPSX child spec for next-wave plugin pack backlog sequencing and readiness"
spec_type: child
status: active
last_updated: '2026-06-08'
---

# OPSX Child Spec: Next-Wave Backlog

## Plugin Targets

- P08: WP Docs to Playbook Generator
- P09: WP Test Automation Harness
- P10: WP AI Readiness Assessor

## Task Requirements

1. Define sequencing and readiness gates for post-third-wave work.
2. Rank P08-P10 backlog by impact, risk, and maintainability.
3. Record dependencies that must complete before execution starts.
4. Create issue drafts and OpenSpec strict child specs for P08-P10.

## Extra Requirement: AI Readiness Plugin

P10 must explicitly evaluate WordPress websites for AI readiness and produce structured remediation outputs suitable for agency delivery planning.

## Acceptance Criteria

- [x] P08-P10 each have a complete task issue draft file.
- [x] P08-P10 each have a mapped OpenSpec strict child spec.
- [x] P10 includes AI readiness evaluation capability and reporting criteria.
- [ ] Validation commands complete without markdown lint failures.

## Linked Execution Issues

- [#948](https://github.com/lightspeedwp/.github/issues/948)
- [#949](https://github.com/lightspeedwp/.github/issues/949)
- [#950](https://github.com/lightspeedwp/.github/issues/950)
