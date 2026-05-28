---
name: "Task"
about: "Request or propose focused implementation work"
title: "[Task] Run validation suite and publish drift report"
labels: [status:needs-review, priority:important, type:task, area:testing]
github_parent: "https://github.com/lightspeedwp/.github/issues/503"
github_issue: "https://github.com/lightspeedwp/.github/issues/509"
---

## Deliverable

Run the agreed validation commands and publish a concise drift report that confirms doc rules trace to live automation/config files.

## Scope Boundary

- In scope: validation execution and report.
- Out of scope: new feature work.

## Acceptance Checklist

- [ ] Markdown lint checks executed.
- [ ] Template-label and config validators pass.
- [ ] Workflow validation command executed.
- [ ] Drift report lists each canonical rule and its source file.

## Branch Prefix Expectation

- Use `test/`.

## Validation Commands

```bash
npx markdownlint-cli2 "**/*.md"
git diff --check
node scripts/agents/includes/check-template-labels.js
node scripts/validation/validate-labeling-configs.cjs
node scripts/validation/validate-issue-fields.cjs
npm run validate:workflows
```

## Touched Paths

- `.github/projects/active/github-workflow-consolidation-2026-05-28/`
- `docs/GITHUB_PROJECT_OPERATIONS_SPEC.md`
- `.github/issue-fields.yml`
- `.github/labels.yml`
- `.github/labeler.yml`
- `.github/workflows/labeling.yml`
- `.github/workflows/project-meta-sync.yml`
