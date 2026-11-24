---
name: "lightspeed-label-governance"
description: "Review label governance quality across labels, templates, saved replies, and triage conventions."
---

# lightspeed-label-governance

## Scope

- `.github/labels.yml`
- `.github/labeler.yml`
- `.github/issue-types.yml`
- `.github/ISSUE_TEMPLATE/`
- `.github/SAVED_REPLIES/`

## Workflow

1. Validate naming consistency and taxonomy coverage.
2. Check issue-template alignment with label categories.
3. Check saved-reply reuse and triage workflow consistency.
4. Report duplication, stale labels, and mapping gaps.

## Safety

- Read-only by default; do not mutate labels automatically.
