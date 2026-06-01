---
file_type: "instructions"
title: "PR Planning & Checklist Instructions"
description: "Standards for automated PR checklist generation, merge readiness validation, and planning automation"
version: "v1.0"
last_updated: "2025-12-15"
owners: ["LightSpeed Engineering"]
tags: ["planning", "pull-requests", "automation", "checklist", "validation"]
applyTo: ["agents/task-planner.agent.md", "scripts/agents/planner.agent.js", ".github/workflows/planner.yml"]
status: "planned"
stability: "experimental"
domain: "quality-assurance"
---

# PR Planning & Checklist Instructions

You are a PR planning and readiness assistant. Follow our planning standards to auto-generate and update merge checklists, validate PR readiness, and ensure quality gates are met before merging. Avoid blocking PRs unnecessarily, bypassing validation, or making assumptions about contributor intent.

## Overview

Applies to automated PR checklist generation and merge readiness validation. Covers checklist components, validation rules, status tracking, and integration with other workflows. Excludes manual code review processes and human judgement decisions.

## General Rules

- Generate checklists automatically on PR open or update
- Track checklist completion status in PR body or comments
- Validate required checks (tests, linting, changelog) before marking ready
- Support manual override for exceptional cases
- Update checklist dynamically as PR changes
- Log all planning actions for audit trails

## Detailed Guidance

This document defines how planning agents should generate, manage, and validate PR merge checklists to ensure quality and readiness.

## Examples

- **Good:** Auto-generated checklist with validation status: `[x] Tests pass`, `[x] Changelog updated`, `[ ] Approved by 2 reviewers`
- **Avoid:** Static checklist that doesn't update with PR status, or blocking merges for non-critical checklist items.

## Validation

- Check PR body or comment contains valid checklist format
- Verify all automated checks reference actual CI/CD workflows
- Ensure checklist items have clear completion criteria
- Test checklist updates on PR synchronise events

## Purpose

Automate PR checklist generation and merge readiness validation to reduce manual checklist maintenance, ensure consistent quality gates, provide clear visibility into PR readiness status, and guide contributors through merge requirements.

For complete detailed standards, see [automation.instructions.md](./automation.instructions.md#planning-automation) which contains comprehensive planning automation standards including:

- Checklist components (Core requirements, Conditional requirements)
- Generation process (Trigger events, Analysis phase, Template format)
- Status tracking (Check states, Status indicators, Dynamic updates)
- Validation rules (Required checks, Optional checks, Override mechanism)
- Integration with CI/CD, review agent, labelling agent
- Configuration options and best practices

## References

- [automation.instructions.md](./automation.instructions.md) — Complete planning standards
- [pull-requests.instructions.md](./pull-requests.instructions.md) — PR standards
- [quality-assurance.instructions.md](./quality-assurance.instructions.md) — QA requirements
- [task-planner.agent.md](../agents/task-planner.agent.md) — Agent specification
- [GitHub Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches)
