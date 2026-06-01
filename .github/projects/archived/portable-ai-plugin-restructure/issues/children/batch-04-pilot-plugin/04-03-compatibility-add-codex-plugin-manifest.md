---
name: "Compatibility"
about: "Track browser/device/WordPress/plugin compatibility issues."
title: "[Compatibility] Add Codex/OpenAI plugin manifest for pilot package"
labels: [status:needs-testing, priority:normal, type:compatibility]
github_issue: "https://github.com/lightspeedwp/.github/issues/307"
github_parent: "https://github.com/lightspeedwp/.github/issues/284"
---

## Compatibility Summary

Add `.codex-plugin/plugin.json` for `plugins/lightspeed-github-ops` using the
local Codex plugin manifest expectations.

Parent epic: #284 (<https://github.com/lightspeedwp/.github/issues/284>).

## Steps to Reproduce

- [ ] Install or point Codex at the local pilot plugin.
- [ ] Confirm `.codex-plugin/plugin.json` is discovered.
- [ ] Confirm referenced skills and assets exist.

## Expected Behavior

Codex can read the pilot plugin metadata without missing paths or invalid
manifest fields.

## Environment

- Local Codex app or Codex-compatible plugin test path.
- Local checkout of this repository.

## Screenshots / Logs

Add validation output or plugin discovery logs when testing.

## Acceptance Criteria

- [ ] `.codex-plugin/plugin.json` exists in the pilot plugin.
- [ ] Manifest `name` matches the plugin folder name.
- [ ] Manifest points to existing skill and asset paths.
- [ ] Manifest validates against the local Codex plugin schema once available.
- [ ] Documentation/changelog updated if needed.
- [ ] PR uses correct branch prefix `compat/`.
- [ ] Approved by at least one maintainer.

## Additional Context

Use the local `plugin-creator` manifest conventions as the reference.

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
