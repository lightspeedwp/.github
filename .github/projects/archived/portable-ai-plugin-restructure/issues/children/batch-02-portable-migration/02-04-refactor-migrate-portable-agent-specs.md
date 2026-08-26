---
name: "Code Refactor"
about: "Request or propose a code refactoring or review to improve code quality, maintainability, and consistency."
title: "[Refactor] Migrate reusable agent specs to `/agents`"
labels: [status:needs-review, priority:important, type:ai-ops, area:core]
github_issue: "https://github.com/lightspeedwp/.github/issues/296"
github_parent: "https://github.com/lightspeedwp/.github/issues/283"
---

## Is your code refactoring request related to a problem?

Reusable agent specs currently live in `.github/agents`, alongside repo
maintenance specs and GitHub workflow references.

Parent epic: #283 (<https://github.com/lightspeedwp/.github/issues/283>).

## Describe the Refactoring / Review Task

Move reusable agent specs to `/agents`, leaving repo-maintenance agents under
`.github/agents` until they are rewritten or retired.

## Use Case

Installable plugin packs should be able to include agent specs from a portable
source folder.

## Alternatives Considered

Moving every agent at once is too risky because some specs are tightly coupled
to GitHub Actions and legacy JavaScript runners.

## Additional Context

Treat `scripts/agents` as legacy runtime for now. Do not move JavaScript
runners in this issue.

## Example Code Snippets

```text
.github/agents/<portable>.agent.md -> /agents/<portable>.agent.md
```

## Refactoring / Review Checklist

- [ ] Agent specs are classified as portable, repo-only, archive, or defer.
- [ ] Portable specs move to `/agents`.
- [ ] Repo-only specs stay in `.github/agents`.
- [ ] Links to scripts and workflows are updated or marked legacy.
- [ ] Frontmatter remains valid.
- [ ] PR uses correct branch prefix `refactor/`.

## Code Area(s) Impacted

- [ ] Other: agent specifications.

## Definition of Ready (DoR)

- [ ] Refactoring goals and scope defined.
- [ ] Code area(s) and impact listed.
- [ ] Estimate added.
- [ ] Dependencies mapped.

## Definition of Done (DoD)

- [ ] Code meets org coding standards.
- [ ] Documentation updated if needed.
- [ ] Changelog entry prepared for PR.
- [ ] Tests added/updated.
- [ ] PR uses correct branch prefix.
