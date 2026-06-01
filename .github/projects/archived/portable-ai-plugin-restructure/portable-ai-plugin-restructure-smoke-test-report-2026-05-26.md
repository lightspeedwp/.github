---
title: "Portable AI Plugin Restructure Smoke Test Report"
description: "Local smoke-test evidence for lightspeed-github-ops plugin manifests and packaged assets."
version: "v0.1.0"
last_updated: "2026-05-26"
file_type: "project"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["compatibility", "smoke-test", "plugin", "restructure"]
domain: "governance"
stability: "active"
---

# Smoke Test Report (2026-05-26)

## Environment

- Repository: `lightspeedwp/.github`
- Local path: `/Users/ash/Studio/LightSpeedWP.Agency/.github`
- Node/NPM validation surface via repository scripts
- GitHub CLI authenticated for issue updates

## Test matrix

| Surface | Method | Result | Notes |
| --- | --- | --- | --- |
| Codex/OpenAI manifest | `npm run validate:plugins` + direct manifest checks | Pass | `.codex-plugin/plugin.json` discovered, references valid files. |
| Claude Code manifest | `npm run validate:plugins` + direct manifest checks | Pass | `.claude-plugin/plugin.json` discovered, references valid files. |
| VS Code/GitHub Copilot metadata | `npm run validate:plugins` + metadata file checks | Pass (metadata) | `copilot-plugin.json` valid and references existing packaged files. |

## Commands and outcomes

```bash
npm run validate:plugins
npm run validate:skills
npm run validate:links
```

- All commands passed with no missing-file errors.

## Unsupported or untested flows

- Interactive in-app discovery in VS Code/GitHub Copilot was not exercised in this CLI run.
- Interactive install/discovery in Claude UI was not exercised in this CLI run.

## Conclusion

Pilot manifests and packaged assets pass local read-only smoke validation and
are ready for tool-UI confirmation in follow-up compatibility issues.
