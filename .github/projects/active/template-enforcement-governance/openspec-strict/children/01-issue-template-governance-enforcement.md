---
file_type: documentation
title: "Issue Template Governance Enforcement"
description: "Implement issue template governance, metadata hardening, and instruction alignment."
version: "1.1.0"
last_updated: "2026-06-08"
owners: ["LightSpeed Team"]
tags: ["opsx", "governance", "issue-templates", "automation"]
status: active
stability: stable
domain: governance
name: "Issue Template Governance Enforcement"
about: "Execute issue-template governance tasks including config hardening, instruction alignment, and canonical routing guidance."
labels: ["status:needs-planning", "priority:high", "type:task", "area:governance", "area:documentation"]
---

# Issue Template Governance Enforcement

## Summary

Drive completion of issue-template governance work in this repository so issue intake is consistent, non-blank, and automation-ready.

## Scope

- Validate and harden `.github/ISSUE_TEMPLATE/config.yml`.
- Ensure the issue type model and template set remain aligned and documented.
- Produce portable guidance in `instructions/issue-templates.instructions.md`.
- Align AGENTS and CLAUDE references to issue-template selection behaviour.

## Acceptance Criteria

- [ ] `ISSUE_TEMPLATE/config.yml` documents governance metadata and keeps blank issues disabled.
- [ ] 35 issue types are aligned with the maintained issue template set and documentation.
- [ ] `instructions/issue-templates.instructions.md` exists and covers template selection logic.
- [ ] Canonical governance references in AGENTS and CLAUDE are accurate and non-conflicting.
- [ ] Validation workflow and branch policy dependencies are documented where relevant.

## Dependencies

- Organisation issue type settings must include all required types.
- Repository-level naming and governance documents must remain authoritative.

## Additional Context

This proposal intentionally excludes PR-template specifics, which are tracked in the companion PR proposal input.
