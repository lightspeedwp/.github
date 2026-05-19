---
name: "Compatibility"
about: "Track browser/device/WordPress/plugin compatibility issues."
title: "[Compatibility] Add Claude Code plugin manifest for pilot package"
labels: [status:needs-testing, priority:normal, type:compatibility]
github_issue: "https://github.com/lightspeedwp/.github/issues/308"
github_parent: "https://github.com/lightspeedwp/.github/issues/284"
---

## Compatibility Summary

Add `.claude-plugin/plugin.json` for `plugins/lightspeed-github-ops` and keep
Claude-specific details isolated from canonical skill source where possible.

Parent epic: #284 (<https://github.com/lightspeedwp/.github/issues/284>).

## Steps to Reproduce

- [ ] Point Claude Code at the local pilot plugin.
- [ ] Confirm `.claude-plugin/plugin.json` is discoverable.
- [ ] Confirm referenced skills, agents, hooks, and MCP entries exist or are omitted.

## Expected Behavior

Claude Code can load the plugin manifest without broken references.

## Environment

- Claude Code local plugin install path.
- Local checkout of this repository.

## Screenshots / Logs

Add validation or plugin discovery output when testing.

## Acceptance Criteria

- [ ] `.claude-plugin/plugin.json` exists in the pilot plugin.
- [ ] Manifest references only files inside the plugin package.
- [ ] Claude-specific namespace or install notes are documented.
- [ ] Compatible behaviour confirmed in local testing.
- [ ] Documentation/changelog updated if needed.
- [ ] PR uses correct branch prefix `compat/`.
- [ ] Approved by at least one maintainer.

## Additional Context

Do not rely on symlinks outside the plugin root.

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
