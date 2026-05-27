---
name: "Task"
about: "Enforce review-order policy in workflows for issue #69"
title: "[Task] Enforce CodeRabbit before Copilot in PR workflow policy (#69)"
labels: [status:needs-triage, priority:important, type:task, area:ci, type:automation]
---

## Task Summary

Implement the review-order policy from #69 so workflow and documentation clearly enforce CodeRabbit checks before Copilot-assisted flows where required.

## Implementation Checklist

- [ ] Define exact enforcement point (status checks, workflow gates, or both).
- [ ] Update workflow logic and contributor-facing docs.
- [ ] Add validation to detect policy drift.
- [ ] Confirm policy behaviour on a sample PR.

## Acceptance Criteria

- [ ] #69 has an explicit and testable enforcement mechanism.
- [ ] Policy wording and workflow behaviour are aligned.
- [ ] Regression risk is documented for teams using existing PR templates.
