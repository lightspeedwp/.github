---
name: "Task"
about: "Request or propose focused implementation work"
title: "[Task] Document issue and PR metadata automation contract"
labels: [status:needs-review, priority:important, type:documentation, area:documentation]
github_parent: "https://github.com/lightspeedwp/.github/issues/503"
github_issue: "https://github.com/lightspeedwp/.github/issues/507"
---

## Deliverable

Document the canonical issue/PR metadata contract based on live labeling automation, template guardrails, and project field sync.

## Scope Boundary

- In scope: contributor-facing contract and reference links.
- Out of scope: introducing new label families or required fields.

## Acceptance Checklist

- [ ] One-hot expectations for `status:*`, `priority:*`, and `type:*` are explicit.
- [ ] Changelog meta label policy uses canonical names.
- [ ] PR/issue template guidance references live guardrails.
- [ ] Cross-links to canonical spec and current workflow/config files are present.

## Branch Prefix Expectation

- Use `docs/`.

## Validation Commands

```bash
npx markdownlint-cli2 "docs/PR_LABELS.md" "docs/LABEL_STRATEGY.md" "docs/GITHUB_PROJECT_OPERATIONS_SPEC.md"
node scripts/agents/includes/check-template-labels.js
```

## Touched Paths

- `docs/PR_LABELS.md`
- `docs/LABEL_STRATEGY.md`
- `docs/GITHUB_PROJECT_OPERATIONS_SPEC.md`
- `.github/labels.yml`
- `.github/labeler.yml`
