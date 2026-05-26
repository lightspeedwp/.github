---
title: "Portable AI Plugin Restructure Future Plugin Pack Backlog"
description: "Research backlog for plugin packs after the lightspeed-github-ops pilot."
version: "v0.1.0"
last_updated: "2026-05-26"
file_type: "project"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["research", "backlog", "plugin", "restructure"]
domain: "governance"
stability: "active"
---

# Future Plugin Pack Backlog (2026-05-26)

## Pack candidates

| Pack | Priority | Candidate sources | Licence/trust notes | Dependencies |
| --- | --- | --- | --- | --- |
| `lightspeed-wordpress-block-theme` | P1 | Block-theme prompts, QA instructions, theme-json guidance | Internal LightSpeed content, GPL-compatible | Finalise portability boundaries |
| `lightspeed-wordpress-block-plugin` | P1 | Block-plugin workflows and QA guidance | Internal LightSpeed content, GPL-compatible | Define plugin-specific validation profile |
| `lightspeed-ai-ops-core` | P2 | Cross-repo governance and CI skills | Internal LightSpeed content, GPL-compatible | Consolidate reusable skills from pilot |
| `lightspeed-release-ops` | P2 | Release checklists, changelog flows, rollout docs | Internal LightSpeed content, GPL-compatible | Stabilise release validator bundle |
| `lightspeed-talk-blog-kit` | P3 | Content workflow and presentation templates | Mixed quality; review needed | Source curation and licensing review |

## Out-of-scope for governance pilot plugin

- Block theme implementation assets.
- Block plugin implementation assets.
- Broad content kit workflows.

## Recommendations

1. Keep `lightspeed-github-ops` narrowly governance-focused.
2. Open follow-up pack issues only after compatibility epic `#284` is closed.
3. Reuse validator and packaging patterns from this pilot.
