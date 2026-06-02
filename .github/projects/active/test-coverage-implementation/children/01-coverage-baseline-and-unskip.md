---
issue_number: 746
parent_issue: 602
file_type: documentation
title: "[Child of #602] Coverage Baseline and Unskip Execution"
description: "OPSX child spec to baseline coverage and phase skipped-test reactivation"
spec_type: child
status: draft
last_updated: '2026-06-01'
---

## OPSX Child Spec: Coverage Baseline and Unskip

1. Capture current branch + CI coverage baseline.
2. Inventory all tests under `.jest-skip/` and classify by blocker.
3. Re-enable safe tests first; isolate flaky/infrastructure-bound tests with explicit tickets.
4. Validate with `npm test` and coverage report artefacts.
