---
name: "Task"
about: "Request or propose focused implementation work"
title: "[Task] Slim down branching strategy and align with live labeler rules"
labels: [status:needs-review, priority:important, type:documentation, area:documentation]
github_parent: "https://github.com/lightspeedwp/.github/issues/503"
github_issue: "https://github.com/lightspeedwp/.github/issues/505"
---

## Deliverable

Update branching documentation to explicitly separate required core prefixes from optional profile prefixes and align with current automation.

## Scope Boundary

- In scope: documentation clarity and consistency updates.
- Out of scope: changing branch-prefix behaviour in workflows.

## Acceptance Checklist

- [ ] Required core prefix set is explicit and concise.
- [ ] Optional profile prefixes for client/product contexts are explicit.
- [ ] References point to canonical spec and `.github/labeler.yml`.
- [ ] No contradictions with current labeler branch regex.

## Branch Prefix Expectation

- Use `docs/`.

## Validation Commands

```bash
npx markdownlint-cli2 "docs/BRANCHING_STRATEGY.md" "docs/GITHUB_PROJECT_OPERATIONS_SPEC.md"
git diff --check
```

## Touched Paths

- `docs/BRANCHING_STRATEGY.md`
- `docs/GITHUB_PROJECT_OPERATIONS_SPEC.md`
- `.github/labeler.yml`
