---
name: "Task"
about: "Request or propose focused implementation work"
title: "[Task] Unify project template and governance into one canonical operations spec"
labels: [status:needs-review, priority:important, type:documentation, area:documentation]
github_parent: "https://github.com/lightspeedwp/.github/issues/503"
github_issue: "https://github.com/lightspeedwp/.github/issues/504"
---

## Deliverable

Create `docs/GITHUB_PROJECT_OPERATIONS_SPEC.md` as the canonical, non-duplicative governance spec for branching, metadata automation, and unified project template usage.

## Scope Boundary

- In scope: docs consolidation and migration mapping from legacy 2025 strategy docs.
- Out of scope: workflow architecture changes.

## Acceptance Checklist

- [ ] Canonical spec created with clear sections and links to live config/workflows.
- [ ] Unified project template model documented with profile presets (`client_delivery`, `product_delivery`).
- [ ] Legacy doc mapping section added (deprecated vs retained).
- [ ] No duplicated rule definitions that conflict with `.github/*.yml` configs.

## Branch Prefix Expectation

- Use `docs/`.

## Validation Commands

```bash
npx markdownlint-cli2 "docs/GITHUB_PROJECT_OPERATIONS_SPEC.md"
git diff --check
```

## Touched Paths

- `docs/GITHUB_PROJECT_OPERATIONS_SPEC.md`
- `.github/issue-fields.yml`
- `.github/labels.yml`
- `.github/labeler.yml`
