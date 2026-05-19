---
name: "Code Refactor"
about: "Request or propose a code refactoring or review to improve code quality, maintainability, and consistency."
title: "[Refactor] Migrate reusable instructions to `/instructions`"
labels: [status:needs-review, priority:important, type:ai-ops, area:core]
github_issue: "https://github.com/lightspeedwp/.github/issues/295"
github_parent: "https://github.com/lightspeedwp/.github/issues/283"
---

## Is your code refactoring request related to a problem?

Reusable LightSpeed and WordPress instructions are currently mixed into
`.github/instructions`, making them harder to package as portable plugin
assets.

Parent epic: #283 (<https://github.com/lightspeedwp/.github/issues/283>).

## Describe the Refactoring / Review Task

Move or copy reusable instruction files into `/instructions` according to the
migration map. Leave repo-only maintenance guidance under `.github`.

## Use Case

Portable instructions should be available to plugin packs without requiring the
`.github` repo to be added as a VS Code workspace folder.

## Alternatives Considered

Keeping all instructions in `.github` preserves the workaround but blocks the
plugin distribution model.

## Additional Context

Do not rewrite the content deeply in this issue. Adjust only enough paths and
frontmatter to keep files valid.

## Example Code Snippets

```text
.github/instructions/<portable>.instructions.md -> /instructions/<portable>.instructions.md
```

## Refactoring / Review Checklist

- [ ] Migration map rows exist for selected instruction files.
- [ ] Portable instructions are moved or copied to `/instructions`.
- [ ] Repo-only instructions remain under `.github`.
- [ ] Links and indexes are updated.
- [ ] Frontmatter remains valid.
- [ ] PR uses correct branch prefix `refactor/`.

## Code Area(s) Impacted

- [ ] Other: documentation and AI instruction assets.

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
