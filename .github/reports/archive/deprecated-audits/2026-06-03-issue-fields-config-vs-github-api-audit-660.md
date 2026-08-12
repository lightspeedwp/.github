---
file_type: documentation
title: "#660 Audit - Issue Fields Configuration vs GitHub API"
description: "Phase 1 audit validating .github/issue-fields.yml structure, limits, naming consistency, and cross-file alignment with labels and issue types."
category: audits
created_date: "2026-06-03"
last_updated: "2026-06-03"
version: "v1.0.0"
owners:
  - LightSpeed Team
authors:
  - GitHub Copilot
tags:
  - wave-5
  - phase-1
  - issue-660
  - issue-fields
  - github-api
  - canonical-config
status: active
stability: stable
domain: governance
---

# #660 Audit - Issue Fields Configuration vs GitHub API

## Overview

This audit validates `.github/issue-fields.yml` against documented GitHub issue/project field constraints and checks executable cross-file consistency with `.github/labels.yml` and `.github/issue-types.yml`.

## Scope

- `.github/issue-fields.yml`
- `.github/issue-types.yml`
- `.github/labels.yml`
- `docs/ISSUE_FIELDS.md`
- `scripts/validation/validate-issue-fields.cjs`

## Validation Method

1. Ran repository validator: `node scripts/validation/validate-issue-fields.cjs`.
2. Confirmed the validator now enforces cross-file parity for `Status`, `Priority`, and `Type` mappings against `.github/labels.yml` and `.github/issue-types.yml`.
3. Checked declared policy limits against known GitHub project field constraints encoded in repo validation policy.

## Results Summary

| Check Area | Result | Notes |
| --- | --- | --- |
| YAML parse + required structure | Pass | Validator passes for required top-level keys and nested structure. |
| GitHub policy limits in config | Pass | Policy values align with validator checks (10 pinned, 25 org fields, 50 options, 50 project fields). |
| Required custom fields present | Pass | Domain, Delivery Track, Team, Effort, Start date, Target date, Risk, Customer Impact, Technical Impact, Spec Link present. |
| Status mapping labels exist in labels.yml | Pass | Validator confirms all `status:*` mappings are canonical labels. |
| Priority mapping labels exist in labels.yml | Pass | Validator confirms all `priority:*` mappings are canonical labels. |
| Type mapping parity with labels.yml | Pass | All mapped type labels exist in `.github/labels.yml`. |
| Type mapping parity with issue-types.yml | Pass | All mapped type labels exist in `.github/issue-types.yml`. |
| Reverse parity (issue-types.yml -> issue-fields.yml) | Pass | Every canonical issue type label has an explicit Type projection mapping. |

## Findings

### F1 - Core field policy and limits are internally coherent (Pass)

No structural or policy-limit defects were found in:

- top-level schema shape
- custom field declarations
- required options for `Effort`
- hidden issue fields and iteration field settings

### F2 - Cross-file parity is now enforced in validation (Pass)

`scripts/validation/validate-issue-fields.cjs` now fails when any `Status`, `Priority`, or `Type` mapping drifts from canonical label and issue-type sources.

Impact:

- Manual one-off parity checks are no longer required for `#660` closure.
- Future config drift is blocked at validation time instead of surfacing later in reports or project sync behaviour.

## Field Configuration Checklist

### Structural Checklist

- [x] `version: 2` present
- [x] required top-level keys present
- [x] `defaults.issue` required keys present
- [x] `defaults.pull_request` required keys present
- [x] `project_field_mappings.Status` present
- [x] `project_field_mappings.Priority` present
- [x] `project_field_mappings.Type` present

### API/Limit Checklist

- [x] `max_pinned_fields_per_issue_type` is 10
- [x] `max_issue_fields_per_org` is 25
- [x] `single_select_max_options` is 50
- [x] `project_total_field_limit` is 50
- [x] each single-select custom field option count <= 50

### Naming/Parity Checklist

- [x] status labels in mappings exist in labels config
- [x] priority labels in mappings exist in labels config
- [x] all mapped type labels exist in labels config
- [x] all mapped type labels exist in issue-types config
- [x] all canonical issue-type labels are mapped in issue-fields Type projection

## Recommendations

1. Keep `npm run validate:issue-fields` wired into CI for every canonical-config change.
2. Apply the same executable parity pattern to `.github/labeler.yml` so emitted labels cannot drift from `.github/labels.yml`.
3. Update downstream documentation when new canonical types are added so governance docs keep pace with executable config.

## Proposed Acceptance Criteria for Closure

- Zero unmapped type labels across canonical config files.
- Zero canonical issue-type labels missing Type projection mapping.
- Validator script expanded to enforce parity automatically.

## Evidence

- `node scripts/validation/validate-issue-fields.cjs` returned pass.
- Validator now performs cross-file set comparison instead of relying on separate manual audit logic.
