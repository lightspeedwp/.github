---
file_type: documentation
title: Private-Project Issue-Field Write Verification
description: Verification record for project visibility/write constraints and safe automation boundaries for project-meta-sync.
created_date: "2026-06-07"
last_updated: "2026-06-07"
version: "1.0.1"
domain: governance
category: audits
status: active
stability: stable
tags: [audit, verification, project-meta-sync, issue-fields, governance]
---

# Private-Project Issue-Field Write Verification (#879)

## Purpose

Record the current live automation boundary for project field writes and capture the decision on whether to extend direct issue-field writes.

## Verification Scope

- Workflow path: `.github/workflows/project-meta-sync.yml`
- Field derivation path: `scripts/agents/includes/derive-project-fields.cjs`
- Canonical field mappings: `.github/issue-fields.yml`
- Validation constraints: `scripts/validation/validate-issue-fields.cjs`

## Verification Findings

- **1. Project sync remains credential-gated and safe by default.**

- Sync only runs when all preflight requirements are present: `LS_PROJECT_URL`, `LS_APP_ID`, and `LS_APP_PRIVATE_KEY`.
- If any requirement is missing, the workflow exits that sync path with a notice rather than attempting partial writes.

- **2. Current live write path is explicit and bounded.**

- The workflow writes only these project fields through the update step: `Status`, `Priority`, `Type`, `Effort`, and `Start date`.
- `Target date` is defined in canonical config but is not currently emitted by `derive-project-fields.cjs` and is not in the workflow field write list.

- **3. Canonical governance remains config-first and validator-backed.**

- `.github/issue-fields.yml` remains the canonical mapping source.
- `scripts/validation/validate-issue-fields.cjs` enforces structure and mapping consistency across canonical config files and docs.

## Decision

Retain the guarded project-meta-sync implementation as the current final boundary.

- Approved boundary for active automation writes:
  - `Status`, `Priority`, `Type`, `Effort`, `Start date`
- Deferred boundary:
  - `Target date` and any additional direct issue-field writes remain out of scope until a maintainer-approved follow-up confirms org/project support and required permissions in production settings.

## Follow-up Path

1. Maintain current guarded sync as-is.
2. Use a separate, explicit change issue before expanding write scope.
3. Require that follow-up to include:

- production visibility/permissions confirmation by maintainers
- field-level rollback plan
- validator and docs updates in the same PR

## Acceptance Criteria Mapping

- Live project constraints documented: yes (preflight and credential gates captured).
- Safe automation boundary explicit: yes (current writes and deferred writes listed).
- Follow-up path decided: yes (guarded sync retained; extension deferred to explicit follow-up).

## Related Issue

- #879
