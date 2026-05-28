---
name: "Task"
about: "Request or propose focused implementation work"
title: "[Task] Document current-state project-meta-sync contract"
labels: [status:needs-review, priority:normal, type:documentation, area:documentation]
github_parent: "https://github.com/lightspeedwp/.github/issues/503"
github_issue: "https://github.com/lightspeedwp/.github/issues/506"
---

## Deliverable

Document current project-meta-sync behaviour as-is, including preflight requirements and Status/Priority/Type field sync boundaries.

## Scope Boundary

- In scope: documentation of current behaviour.
- Out of scope: extending synced fields or workflow refactors.

## Acceptance Checklist

- [ ] Preflight requirements are documented (`LS_PROJECT_URL`, `LS_APP_ID`, `LS_APP_PRIVATE_KEY`).
- [ ] Synced fields explicitly limited to Status, Priority, Type.
- [ ] Close/merge status handling and defaults are documented.
- [ ] References point to canonical workflow and field mapping YAML.

## Branch Prefix Expectation

- Use `docs/`.

## Validation Commands

```bash
npx markdownlint-cli2 "docs/ISSUE-FIELDS.md" "docs/GITHUB_PROJECT_OPERATIONS_SPEC.md"
node scripts/validation/validate-issue-fields.cjs
```

## Touched Paths

- `docs/ISSUE-FIELDS.md`
- `docs/GITHUB_PROJECT_OPERATIONS_SPEC.md`
- `.github/workflows/project-meta-sync.yml`
- `.github/issue-fields.yml`
