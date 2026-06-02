---
title: "NotebookLM Source Ingestion Checklist"
description: "Checklist to ensure NotebookLM only ingests approved repository sources for this talk."
last_updated: "2026-06-02"owners: ["Ash Shaw"]
---

# NotebookLM Source Ingestion Checklist

## Rule

Only ingest files from `lightspeedwp/.github` and `wceu-2026/`.

## Core sources to add first

- `wceu-2026/talk-outline-25min.md`
- `wceu-2026/references/repo-source-index.md`
- `wceu-2026/slides/` (all files)
- `README.md`
- `AGENTS.md`
- `plugins/README.md`
- `plugins/PLUGIN_MANIFEST.json`
- `plugins/lightspeed-github-ops/README.md`
- `docs/PLUGIN_PACK_ROADMAP.md`
- `docs/PLUGIN_INSTALLATION_GUIDE.md`

## Extended sources for deeper analysis

- `.github/labels.yml`
- `.github/labeler.yml`
- `.github/issue-types.yml`
- `docs/AUTOMATION_GOVERNANCE.md`
- `docs/RELEASE_PROCESS.md`
- `docs/WORKFLOWS.md`
- `docs/METRICS.md`
- `skills/SKILL_REGISTRY.json`

## Exclusion checklist

- No external websites
- No files from other repositories
- No speculative claims without file evidence
