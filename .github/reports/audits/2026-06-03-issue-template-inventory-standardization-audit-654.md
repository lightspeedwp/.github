---
file_type: documentation
title: Issue Template Inventory and Standardization Audit
description: Inventory and standardization audit of numbered issue templates with issue-type alignment checks.
created_date: "2026-06-03"
last_updated: "2026-06-07"
version: "1.0.1"
domain: governance
status: deprecated
tags: [audit, issue-templates, issue-types, standardization, wave-5]
---

# Issue Template Inventory and Standardization Audit (#654)

## Historical Notice

This report is a historical snapshot from Wave 5 and is no longer the live governance source of truth.

Use these canonical live sources instead:

- `.github/labels.yml`
- `.github/labeler.yml`
- `.github/label-governance-policy.yml`
- `.github/issue-types.yml`
- `.github/issue-fields.yml`
- `scripts/validation/validate-labeling-configs.cjs`
- `scripts/validation/validate-issue-fields.cjs`

## Executive Summary

Audit scope covered `.github/ISSUE_TEMPLATE/`, `.github/ISSUE_TEMPLATE/config.yml`, `.github/ISSUE_TEMPLATE/README.md`, and `.github/issue-types.yml`.

Current state:

- 26 numbered issue templates are present (`01`-`26`) and sequenced.
- Every numbered template includes basic template metadata (`name`, `description`).
- Numbered templates do not include `labels`, `title`, or `assignees` frontmatter keys.
- Template-to-issue-type parity is partial: 26 templates exist for 29 issue types.
- `config.yml` is valid but minimal (blank issues disabled + one support link).

## Inventory

### Templates Found

Numbered templates: 26

- `01-task.md`
- `02-bug.md`
- `03-feature.md`
- `04-design.md`
- `05-epic.md`
- `06-story.md`
- `07-improvement.md`
- `08-user-experience-feedback.md`
- `09-code-refactor.md`
- `10-build-ci.md`
- `11-automation.md`
- `12-testing-coverage.md`
- `13-performance.md`
- `14-a11y.md`
- `15-security.md`
- `16-compatibility.md`
- `17-integration-issue.md`
- `18-release.md`
- `19-maintenance.md`
- `20-documentation.md`
- `21-research.md`
- `22-audit.md`
- `23-code-review.md`
- `24-ai-ops.md`
- `25-content-modelling.md`
- `26-help.md`

Additional non-template file in folder: `README.md`.

## Frontmatter Standardization Check

Across all 26 numbered templates:

- `name`: present in 26/26
- `description`: present in 26/26
- `title`: present in 0/26
- `labels`: present in 0/26
- `assignees`: present in 0/26

This is internally consistent, but it means templates do not directly pre-apply canonical type labels.

## Issue-Type Alignment

`issue-types.yml` currently defines 29 issue types.

Mapped by intent to templates (26):

- Present: Task, Bug, Feature, Design, Epic, Story, Improvement, Refactor, Build, Automation, Testing, Performance, Accessibility, Security, Compatibility, Integration, Release, Maintenance, Documentation, Research, Audit, Review, AI Ops, Content Modelling, User Experience Feedback, Help.

Missing dedicated templates (3):

- Chore (`type:chore`)
- Question (`type:question`)
- Support (`type:support`)

## Usage Status and Recency

No template in the numbered set is marked deprecated.

Last-touch pattern from git history:

- `01`-`07`: updated 2026-05-29
- `08`-`26`: updated 2026-06-01

Interpretation: all templates appear actively maintained during Wave 5 work; none appear stale by date alone.

## `config.yml` Completeness

Current config:

- `blank_issues_enabled: false`
- one `contact_links` support entry

Assessment:

- Valid for GitHub issue template config.
- Minimal but complete for current operating model.

## Findings

1. Numbering and baseline standardization are good (26 sequential templates).
2. Direct template-driven labelling is not configured in issue templates (`labels` absent in all numbered templates).
3. Type parity remains incomplete because 3 issue types do not have dedicated templates.

## Recommendations

1. Add three missing templates for Chore, Question, and Support to close 29-type parity.
2. Add explicit `labels` to issue templates where deterministic type assignment is desired.
3. Keep `config.yml` minimal but add a short comment block documenting why blank issues are disabled.

## Validation Notes

- Template file inventory collected from `.github/ISSUE_TEMPLATE/*.md`.
- Issue-type source of truth: `.github/issue-types.yml`.
- Frontmatter-key coverage derived via static scan of numbered templates.

## Related Issue

- Closes #654
