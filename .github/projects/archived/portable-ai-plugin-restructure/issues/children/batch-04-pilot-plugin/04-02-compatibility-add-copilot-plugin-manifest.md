---
name: "Compatibility"
about: "Track browser/device/WordPress/plugin compatibility issues."
title: "[Compatibility] Add VS Code and GitHub Copilot plugin manifest metadata"
labels: [status:needs-testing, type:compatibility, type:ai-ops]
github_issue: "https://github.com/lightspeedwp/.github/issues/306"
github_parent: "https://github.com/lightspeedwp/.github/issues/284"
---

## Compatibility Summary

Add the manifest metadata needed for VS Code and GitHub Copilot plugin
discovery for `plugins/lightspeed-github-ops`.

Parent epic: #284 (<https://github.com/lightspeedwp/.github/issues/284>).

## Steps to Reproduce

- [ ] Open the repo in VS Code.
- [ ] Point plugin discovery at the local pilot plugin path.
- [ ] Confirm the pilot plugin metadata and referenced assets are discoverable.

## Expected Behavior

The plugin manifest references existing local agent and skill paths and can be
used by the supported Copilot plugin flow without missing-file errors.

## Environment

- VS Code with GitHub Copilot.
- Local checkout of `lightspeedwp/.github` on the restructure branch.

## Screenshots / Logs

Add install or discovery logs when testing.

## Acceptance Criteria

- [ ] Copilot-facing manifest exists in the agreed plugin location.
- [ ] Manifest validates against the local plugin schema once available.
- [ ] Referenced agents and skills exist.
- [ ] Compatible behaviour confirmed in local VS Code testing.
- [ ] Documentation/changelog updated if needed.
- [ ] PR uses correct branch prefix `compat/`.
- [ ] Approved by at least one maintainer.

## Additional Context

Keep this manifest conservative. Do not invent unsupported fields.

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
