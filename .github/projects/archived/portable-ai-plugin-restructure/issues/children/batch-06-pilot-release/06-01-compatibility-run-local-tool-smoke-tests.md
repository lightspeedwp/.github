---
name: "Compatibility"
about: "Track browser/device/WordPress/plugin compatibility issues."
title: "[Compatibility] Run local tool smoke tests for the pilot plugin"
labels: [status:needs-testing, type:compatibility, type:ai-ops]
github_issue: "https://github.com/lightspeedwp/.github/issues/317"
github_parent: "https://github.com/lightspeedwp/.github/issues/285"
---

## Compatibility Summary

Run local smoke tests for `plugins/lightspeed-github-ops` across the supported
AI tool surfaces.

Parent epic: #285 (<https://github.com/lightspeedwp/.github/issues/285>).

## Steps to Reproduce

- [ ] Test VS Code/GitHub Copilot plugin discovery.
- [ ] Test Codex/OpenAI manifest discovery.
- [ ] Test Claude Code manifest discovery.
- [ ] Record unsupported or untested flows clearly.

## Expected Behavior

The pilot plugin loads or validates without missing-file errors in each tested
tool.

## Environment

- Local checkout of `lightspeedwp/.github`.
- Current VS Code/GitHub Copilot environment.
- Current Codex app environment.
- Current Claude Code environment, if available.

## Screenshots / Logs

Attach local command output, screenshots, or notes to the GitHub issue.

## Acceptance Criteria

- [ ] Issue is reproducible and documented.
- [ ] Compatible behaviour confirmed on affected platforms.
- [ ] No adverse impact on other platforms.
- [ ] Documentation/changelog updated if needed.
- [ ] PR uses correct branch prefix `compat/`.
- [ ] Approved by at least one maintainer.

## Additional Context

This issue verifies compatibility; it should not redesign manifests.

## Definition of Ready (DoR)

- [ ] Compatibility issue/context described.
- [ ] Steps to reproduce and environment details provided.
- [ ] Acceptance criteria listed.
- [ ] Estimate added if applicable.

## Definition of Done (DoD)

- [ ] Issue resolved and verified on affected platforms.
- [ ] Documentation/changelog updated.
- [ ] PR uses correct branch prefix `compat/`.
- [ ] Approved by at least one maintainer.
