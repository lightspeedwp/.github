---
issue_number: 771
parent_issue: 770
file_type: documentation
title: "[Task] Finalise dependency rationalisation from usage evidence"
description: "OpenSpec strict planning artefact"
last_updated: "2026-06-03"
status: active
---

# [Task] Finalise dependency rationalisation from usage evidence

## template-map

- template_file: .github/ISSUE_TEMPLATE/22-audit.md

## Deliverables

1. Final dependency decision table with keep/remove rationale.
2. Explicit removal list for currently unused packages and lockfile sync.
3. Post-change validation evidence for lint, tests, and validate:all.

## Acceptance Criteria

- [ ] Every removed package has traceable evidence of non-usage in current implementation.
- [ ] package.json and package-lock.json are synchronised and valid.
- [ ] npm run lint:all passes (warnings allowed if pre-existing policy permits).
- [ ] npm run test and npm run validate:all pass.
