---
title: "Portable AI Plugin Restructure Release Readiness Checklist"
description: "Readiness checklist for the pilot milestone after core restructure delivery."
version: "v0.1.0"
last_updated: "2026-05-26"
file_type: "project"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["release", "checklist", "plugin", "restructure"]
domain: "governance"
stability: "active"
---

# Release Readiness Checklist (Pilot Milestone)

## Release goal

Ship the first validated governance-focused plugin package and supporting
portable skill/validator layer for LightSpeed repositories.

## Milestone and linkage

- Parent epics: `#282` closed, `#283` closed, `#284` open, `#285` ready to close.
- Child closure status:
  - Closed: `#286-#305`, `#309-#316`, `#317-#321` (post-documentation updates).
  - Open: `#306`, `#307`, `#308` for tool-surface compatibility confirmations.

## Validation evidence

- `npm run validate:skills` passed.
- `npm run validate:plugins` passed.
- `npm run validate:links` passed.
- Targeted Jest validator suites passed.

## Plugin install/pilot evidence

- Smoke-test report:
  `portable-ai-plugin-restructure-smoke-test-report-2026-05-26.md`
- Pilot findings report:
  `portable-ai-plugin-restructure-pilot-findings-2026-05-26.md`

## QA/staging and release notes

- QA status: local validation complete for packaged assets and validators.
- Remaining gate: UI-level compatibility confirmation for `#306-#308`.
- Release notes draft: use project delivery and findings reports in this folder.

## Maintainer approval checkpoint

This checklist is prepared and ready for maintainer sign-off. Final pilot
milestone release should proceed after `#306-#308` close and parent `#284`
closure.
