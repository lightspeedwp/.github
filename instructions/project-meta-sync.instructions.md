---
file_type: instructions
title: Project Meta Sync Instructions
description: Deprecated compatibility guidance for the legacy project meta sync entrypoint. The active contract lives in the project-meta-sync and metadata-governance workflows plus their helper scripts.
version: v1.1
last_updated: '2026-08-18'
owners:
  - LightSpeed Engineering
tags:
  - project-management
  - automation
  - github-projects
  - synchronisation
  - labels
stability: experimental
domain: governance
apply_to:
  - ../.github/agents/project-meta-sync.agent.md
  - scripts/agents/project-meta-sync.agent.js
  - .github/workflows/project-meta-sync.yml
  - .github/workflows/metadata-governance.yml
  - scripts/agents/includes/derive-project-fields.cjs
  - scripts/agents/includes/issue-pr-metadata.cjs
  - Keep `status:*`, `priority:*`, and `type:*` labels canonical and one-hot.
  - Treat issue types as the source of truth for canonical `type:*` intent and let `project-meta-sync.yml` project that intent into GitHub Project fields.
  - Allow the workflow to re-run on label changes so late-applied labels and issue type corrections catch up in the project board.
---


---

*Maintained by the 🤖 LightSpeedWP Automation Team*
