---
name: "Code Refactor"
about: "Request or propose a code refactoring or review to improve code quality, maintainability, and consistency."
title: "[Refactor] Move active portable schemas to `/.schemas`"
labels: [status:needs-review, priority:important, area:core, area:ci]
github_issue: "https://github.com/lightspeedwp/.github/issues/297"
github_parent: "https://github.com/lightspeedwp/.github/issues/283"
---

## Is your code refactoring request related to a problem?

Portable schemas currently live under `.github/schemas`, which blurs the line
between GitHub-native repo configuration and reusable plugin validation.

Parent epic: #283 (<https://github.com/lightspeedwp/.github/issues/283>).

## Describe the Refactoring / Review Task

Move only active, portable schemas into `/.schemas` and update schema
references in docs, VS Code settings, and validators.

## Use Case

Plugin, skill, agent, hook, workflow, and frontmatter schemas should be usable
outside GitHub's special `.github` folder.

## Alternatives Considered

Moving all schemas blindly could carry stale or unused schema debt into the new
structure.

## Additional Context

This issue moves schemas. Fixing invalid JSON syntax can be done in the
validation reset batch if needed.

## Example Code Snippets

```text
.github/schemas/frontmatter.schema.json -> .schemas/frontmatter.schema.json
```

## Refactoring / Review Checklist

- [ ] Active schemas are identified.
- [ ] Portable schemas move to `/.schemas`.
- [ ] Repo-only schema references remain valid.
- [ ] VS Code schema mappings are updated.
- [ ] Validators reference the new path.
- [ ] PR uses correct branch prefix `refactor/`.

## Code Area(s) Impacted

- [ ] Other: schemas and validation references.

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
