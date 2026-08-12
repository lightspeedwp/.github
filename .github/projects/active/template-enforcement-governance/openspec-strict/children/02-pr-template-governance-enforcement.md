---
file_type: documentation
title: "PR Template Governance Enforcement"
description: "Implement PR template routing governance, validation workflow, and branch-protection integration."
version: "1.1.0"
last_updated: "2026-06-08"
owners: ["LightSpeed Team"]
tags: ["opsx", "governance", "pr-templates", "automation"]
status: active
stability: stable
domain: governance
name: "PR Template Governance Enforcement"
about: "Execute PR-template governance tasks including routing config, root router guidance, validation automation, and protection gating."
labels: ["status:needs-planning", "priority:high", "type:task", "area:governance", "area:automation"]
---

# PR Template Governance Enforcement

## Summary

Deliver enforceable PR-template selection and validation rules that align branch strategy, templates, and automation.

## Scope

- Create and maintain `.github/PULL_REQUEST_TEMPLATE/config.yml` routing map.
- Ensure root `.github/pull_request_template.md` acts as a clear template router.
- Add portable PR template guidance under `instructions/pr-templates.instructions.md`.
- Define and implement validation workflow and branch-protection requirements.

## Acceptance Criteria

- [ ] Routing config exists and maps all supported branch prefixes to PR templates.
- [ ] Root PR template provides clear routing guidance and template links.
- [ ] `instructions/pr-templates.instructions.md` exists and covers all active PR templates.
- [ ] PR-template validation workflow exists with actionable failure feedback.
- [ ] Branch protection requires successful PR-template validation for protected branches.

## Dependencies

- Branch naming strategy and governance documentation must remain the canonical source.
- Labeling and review automation should consume consistent template structure.

## Additional Context

This proposal intentionally excludes issue-template specifics, which are tracked in the companion issue proposal input.
