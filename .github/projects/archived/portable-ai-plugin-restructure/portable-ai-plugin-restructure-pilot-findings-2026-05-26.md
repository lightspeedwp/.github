---
title: "Portable AI Plugin Restructure Pilot Findings"
description: "Findings from first pilot use of lightspeed-github-ops in a LightSpeed repository."
version: "v0.1.0"
last_updated: "2026-05-26"
file_type: "project"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["pilot", "findings", "plugin", "skills", "restructure"]
domain: "governance"
stability: "active"
---

# Pilot Findings (2026-05-26)

## Pilot repository

- `lightspeedwp/.github` (current repository)

## Pilot workflow executed

1. Load pilot plugin files from `plugins/lightspeed-github-ops`.
2. Run packaged-validator workflow:
   - `npm run validate:skills`
   - `npm run validate:plugins`
   - `npm run validate:links`
3. Use one packaged skill contract (`lightspeed-pr-review`) to drive issue
   closeout and evidence comments.

## Outcomes

- Install/load model proved at filesystem and manifest validation level.
- Packaged skill references are valid and usable.
- Compatibility evidence is strong for manifest/read-only discovery; UI-specific
  discovery still requires dedicated manual confirmation.

## Gaps found

- Remaining compatibility-confirmation tasks for explicit tool UIs
  (`#306`, `#307`, `#308`).
- Need a release-level summary document and final epic closure once those are complete.

## Rollback / uninstall

- Remove plugin path from tool/plugin configuration.
- Delete or archive `plugins/lightspeed-github-ops` from local checkout if rollback is required.

## Recommended next actions

1. Run UI discovery checks for Copilot, Codex app UI, and Claude UI.
2. Close compatibility issues `#306-#308`.
3. Close parent epic `#284`.
