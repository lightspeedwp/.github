---
name: "Code Refactor"
about: "Request or propose a code refactoring or review to improve code quality, maintainability, and consistency."
title: "[Refactor] Update file organisation rules for GitHub-native vs portable assets"
labels: [status:needs-review, priority:important, area:core, area:documentation]
github_issue: "https://github.com/lightspeedwp/.github/issues/291"
github_parent: "https://github.com/lightspeedwp/.github/issues/282"
---

## Is your code refactoring request related to a problem?

The current file-organisation guidance says operational assets should stay
under `.github`, which conflicts with the new portable plugin structure.

Parent epic: #282 (<https://github.com/lightspeedwp/.github/issues/282>).

## Describe the Refactoring / Review Task

Update `.github/instructions/file-organisation.instructions.md` and related
references so they distinguish GitHub-native repo files from portable AI
plugin assets.

## Use Case

Maintainers and AI agents need unambiguous placement rules during and after the
restructure.

## Alternatives Considered

Keeping the old rule would continue to trap portable AI assets under `.github`.

## Additional Context

Do not move files in this issue. This issue updates the placement policy only.

## Example Code Snippets

```text
Before: All operational artefacts belong under .github.
After: GitHub-native artefacts stay under .github; portable AI assets belong in top-level source folders.
```

## Refactoring / Review Checklist

- [ ] Guidance defines GitHub-native files.
- [ ] Guidance defines portable plugin assets.
- [ ] Guidance maps reports and active project files.
- [ ] Existing links to file organisation guidance still resolve.
- [ ] No production assets are moved.
- [ ] Documentation updated as needed.
- [ ] PR uses correct branch prefix `refactor/`.

## Code Area(s) Impacted

- [ ] Other: documentation and AI instruction placement rules.

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
