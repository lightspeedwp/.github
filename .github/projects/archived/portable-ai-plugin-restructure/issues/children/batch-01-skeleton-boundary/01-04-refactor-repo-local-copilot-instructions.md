---
name: "Code Refactor"
about: "Request or propose a code refactoring or review to improve code quality, maintainability, and consistency."
title: "[Refactor] Scope `.github` Copilot instructions to this repo only"
labels: [status:needs-review, priority:important, type:ai-ops, area:documentation]
github_issue: "https://github.com/lightspeedwp/.github/issues/292"
github_parent: "https://github.com/lightspeedwp/.github/issues/282"
---

## Is your code refactoring request related to a problem?

`.github/custom-instructions.md` currently treats `.github` as the home for
general LightSpeed WordPress AI assets, which conflicts with the new portable
plugin boundary.

Parent epic: #282 (<https://github.com/lightspeedwp/.github/issues/282>).

## Describe the Refactoring / Review Task

Rewrite the repo-local Copilot instruction entrypoint so it explains how to
maintain this `.github` repository, while pointing portable WordPress and AI
ops assets to the new top-level folders.

## Use Case

Future AI agents should not place block theme, block plugin, or generic
LightSpeed skills in `.github` by default.

## Alternatives Considered

Leaving the file unchanged would preserve the local workaround but undermine
the plugin restructure.

## Additional Context

Keep the current org standards, UK English, security, accessibility, and
performance requirements.

## Example Code Snippets

```text
Before: Use .github/prompts and .github/instructions for shared project AI files.
After: Use .github for this repo's GitHub-native maintenance; use top-level source folders for portable AI assets.
```

## Refactoring / Review Checklist

- [ ] `.github/custom-instructions.md` explains the new boundary.
- [ ] Links to portable source folders are added.
- [ ] Stale references to missing `_index.instructions.md` are removed or corrected.
- [ ] No reusable WordPress project guidance is presented as repo-local only.
- [ ] Documentation updated as needed.
- [ ] PR uses correct branch prefix `refactor/`.

## Code Area(s) Impacted

- [ ] Other: Copilot and AI instruction files.

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
