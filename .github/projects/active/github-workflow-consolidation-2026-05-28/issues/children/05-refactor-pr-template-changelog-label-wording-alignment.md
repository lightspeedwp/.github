---
name: "Code Refactor"
about: "Request or propose a code refactoring or review to improve code quality, maintainability, and consistency."
title: "[Refactor] Align PR template changelog-skip wording with canonical meta label"
labels: [status:needs-review, priority:normal, type:refactor, area:automation]
github_parent: "https://github.com/lightspeedwp/.github/issues/503"
github_issue: "https://github.com/lightspeedwp/.github/issues/508"
---

## Deliverable

Update PR template wording so all changelog-skip references consistently use canonical `meta:no-changelog`.

## Scope Boundary

- In scope: wording-only template alignment.
- Out of scope: workflow logic changes.

## Acceptance Checklist

- [ ] All PR templates use `meta:no-changelog` wording consistently.
- [ ] No template references `skip-changelog` as the canonical label.
- [ ] Existing template structure and checklists remain intact.

## Branch Prefix Expectation

- Use `refactor/`.

## Validation Commands

```bash
rg -n "skip-changelog|meta:no-changelog" .github/pull_request_template.md .github/PULL_REQUEST_TEMPLATE -S
node scripts/agents/includes/check-template-labels.js
git diff --check
```

## Touched Paths

- `.github/pull_request_template.md`
- `.github/PULL_REQUEST_TEMPLATE/*.md`
