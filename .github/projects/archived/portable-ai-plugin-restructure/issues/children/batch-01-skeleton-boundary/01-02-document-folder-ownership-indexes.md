---
name: "Documentation"
about: "Request new documentation or propose updates/clarifications to existing docs."
title: "[Documentation] Add ownership indexes for new top-level folders"
labels: [status:needs-triage, priority:normal, area:documentation]
github_issue: "https://github.com/lightspeedwp/.github/issues/290"
github_parent: "https://github.com/lightspeedwp/.github/issues/282"
---

## What documentation is needed?

Add README or index files explaining ownership, allowed content, and migration
rules for the new top-level folders.

Parent epic: #282 (<https://github.com/lightspeedwp/.github/issues/282>).

## Why is this documentation important?

The restructure changes long-standing `.github` placement rules. Each folder
needs a clear contract so future agents and maintainers do not recreate the
same ambiguity.

## Acceptance Criteria

- [ ] `/.schemas/README.md` explains schema ownership.
- [ ] `/agents/README.md` explains portable agent specs.
- [ ] `/cookbook/README.md` explains recipes and examples.
- [ ] `/hooks/README.md` explains safe hooks and adapters.
- [ ] `/instructions/README.md` explains portable instruction scope.
- [ ] `/plugins/README.md` explains plugin family strategy.
- [ ] `/skills/README.md` explains skill folder rules.
- [ ] `/workflows/README.md` distinguishes agentic workflows from GitHub Actions.
- [ ] Documentation is accessible and easy to find.
- [ ] PR uses correct branch prefix `docs/`.

## Additional Context

Use UK English and keep the indexes concise. Link to the active PRD.

## Definition of Ready (DoR)

- [ ] Documentation need is clear and well-defined.
- [ ] Related docs/issues or files linked.
- [ ] Acceptance criteria listed.
- [ ] Estimate added if relevant.
- [ ] Milestone/release assigned if applicable.

## Definition of Done (DoD)

- [ ] Documentation meets org standards and guidelines.
- [ ] Changelog entry prepared for PR.
- [ ] Documentation reviewed for clarity and accessibility.
- [ ] Screenshots/code examples included if relevant.
- [ ] PR uses correct branch prefix `docs/`.
