---
name: "Documentation"
about: "Request new documentation or propose updates/clarifications to existing docs."
title: "[Documentation] Write pilot plugin installation and update guide"
labels: [status:needs-triage, priority:important, area:documentation, type:ai-ops]
github_issue: "https://github.com/lightspeedwp/.github/issues/310"
github_parent: "https://github.com/lightspeedwp/.github/issues/284"
---

## What documentation is needed?

Create documentation for installing, updating, testing, and troubleshooting the
`lightspeed-github-ops` pilot plugin locally.

Parent epic: #284 (<https://github.com/lightspeedwp/.github/issues/284>).

## Why is this documentation important?

The goal is to replace the current VS Code workspace workaround with an
installable plugin workflow.

## Acceptance Criteria

- [ ] Installation guide covers VS Code/GitHub Copilot.
- [ ] Installation guide covers Codex/OpenAI compatibility notes.
- [ ] Installation guide covers Claude Code compatibility notes.
- [ ] Update and uninstall notes are included where known.
- [ ] Troubleshooting covers missing manifest and missing referenced-file errors.
- [ ] Documentation is accessible and easy to find.
- [ ] PR uses correct branch prefix `docs/`.

## Additional Context

Document only tested flows as supported. Clearly mark untested flows as notes
or future compatibility work.

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
