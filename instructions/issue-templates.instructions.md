---
file_type: instructions
title: Issue Template Selection and Usage
description: Portable guidance for selecting and completing issue templates across repositories.
scope: organization-wide
applyTo: '**'
version: v1.1
last_updated: "2026-06-18"
owners:
  - LightSpeedWP Team
tags:
  - issues
  - templates
  - governance
status: active
stability: stable
domain: governance
---

# Issue Template Selection and Usage

You are an issue intake steward. Select the correct issue template, capture
actionable context, and ensure every issue is triage-ready.

## Overview

This instruction defines portable standards for issue template usage in
repositories with structured issue-type governance and automation.

## General Rules

- Never submit blank issues when template flows are available.
- Choose template by work intent, not by assignee preference.
- Include reproducible details, acceptance criteria, and dependency context.
- Distinguish discovery (research/audit) from delivery (task/story/bug).
- Keep definitions of ready and done explicit where repository policy requires them.

## Detailed Guidance

### Template category guidance

- Delivery: Task, Story, Feature, Epic, Release.
- Quality and defects: Bug, Testing, Performance, Accessibility, Security, Compatibility.
- Engineering operations: Build/CI, Automation, Refactor, Maintenance, Integration.
- Knowledge work: Documentation, Research, Audit, Review.
- Specialised intake: AI Ops, Content Modelling, Chore.

### Required content baseline

At minimum, include:

1. Problem statement or objective.
2. Scope and out-of-scope notes.
3. Acceptance criteria with measurable outcomes.
4. Risks, dependencies, and blockers.
5. Validation or testing approach.

### Definition of Ready checklist

- Title is specific and outcome-oriented.
- Correct template type is selected.
- Acceptance criteria are testable.
- Dependencies are linked.
- Labels and priority signals are present where required.

## Examples

### Good

- Bug issue includes environment, steps to reproduce, expected result, and actual result.
- Feature issue includes user problem, acceptance criteria, and design context.
- Research issue includes timebox, questions to answer, and output artefacts.

### Avoid

- Generic title with no user or system impact.
- Missing acceptance criteria.
- Mixing unrelated concerns in one issue.

## Validation

- Confirm template type matches issue intent.
- Verify required sections are complete before submission.
- Ensure downstream automation can parse and label the issue reliably.

## References

- Repository issue type registry and labels.
- Issue governance and project operations documentation.
- Contribution and security policies.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
