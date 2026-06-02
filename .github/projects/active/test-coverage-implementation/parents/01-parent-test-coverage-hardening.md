---
issue_number: 602
title: "[PHASE 1] Move Tests Out of .jest-skip/ and Add Missing Coverage"
description: "OPSX parent spec for restoring reliable coverage and reducing skipped-test debt"
status: active
priority: critical
last_updated: '2026-06-01'
file_type: documentation
---

## OPSX Parent Spec

- Parent issue: #602
- Scope: restore executable test coverage path, remove skipped-test debt, and harden CI reliability for coverage reporting.
- Required children:
  - #599 Module system consistency (CJS/ESM)
  - #600 Reviewer agent dry-run mode
  - #601 Comprehensive error handling
- Exit criteria:
  - Coverage baseline captured and reproducible
  - `.jest-skip/` debt reduced or eliminated with replacements
  - CI passes without infrastructure false negatives
