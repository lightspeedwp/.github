---
title: "NotebookLM Source Ingestion Checklist"
description: "Checklist to ensure NotebookLM only ingests approved repository sources for this talk."
last_updated: "2026-05-28"
owners: ["Ash Shaw"]
---

# NotebookLM Source Ingestion Checklist

## Rule

Only ingest files from `lightspeedwp/.github` and `wceu-2026/`.

## PHASE 1: Foundation Sources (Add First)

These files establish context for the entire talk.

### Repository Foundation
- ✅ https://github.com/lightspeedwp/.github/blob/develop/README.md
- ✅ https://github.com/lightspeedwp/.github/blob/develop/CLAUDE.md
- ✅ https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md

### Talk Outline & Asset Index
- ✅ wceu-2026/talk-outline-25min.md
- ✅ wceu-2026/references/repo-source-index.md

## PHASE 2: Architecture & Governance (Add Second)

These files provide the governance and architectural context for the plugin-pack pivot.

- ✅ https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md
- ✅ https://github.com/lightspeedwp/.github/blob/develop/.github/labels.yml
- ✅ https://github.com/lightspeedwp/.github/blob/develop/.github/issue-types.yml
- ✅ https://github.com/lightspeedwp/.github/blob/develop/docs/WORKFLOWS.md

## PHASE 3: Plugin Pack Documentation (Add Third)

These files explain the plugin-pack model and installation/usage.

- ✅ https://github.com/lightspeedwp/.github/blob/develop/docs/PLUGIN_PACK_ROADMAP.md
- ✅ https://github.com/lightspeedwp/.github/blob/develop/docs/PLUGIN_INSTALLATION_GUIDE.md
- ✅ https://github.com/lightspeedwp/.github/blob/develop/plugins/README.md
- ✅ https://github.com/lightspeedwp/.github/blob/develop/plugins/PLUGIN_MANIFEST.json
- ✅ https://github.com/lightspeedwp/.github/blob/develop/plugins/lightspeed-github-ops/README.md

## PHASE 4: Detailed Reference Materials (Add Fourth)

Extended sources for deeper analysis and validation of claims.

- ✅ https://github.com/lightspeedwp/.github/blob/develop/docs/RELEASE_PROCESS.md
- ✅ https://github.com/lightspeedwp/.github/blob/develop/docs/METRICS.md
- ✅ https://github.com/lightspeedwp/.github/blob/develop/skills/SKILL_REGISTRY.json
- ✅ wceu-2026/references/slide-to-source-mapping.md

## PHASE 5: Slide Content Files (Add Fifth)

All slide markdown files for final verification and evidence mapping.

- ✅ wceu-2026/slides/slide-01-hook-and-stakes.md
- ✅ wceu-2026/slides/slide-03-inheritance-boundaries.md
- ✅ wceu-2026/slides/slide-04-control-plane-architecture.md
- ✅ wceu-2026/slides/slide-05-canonical-governance-assets.md
- ✅ wceu-2026/slides/slide-06-why-we-pivoted.md
- ✅ wceu-2026/slides/slide-07-plugin-pack-architecture.md
- ✅ wceu-2026/slides/slide-12-adoption-playbook.md
- ✅ wceu-2026/slides/slide-13-agent-layer.md
- ✅ wceu-2026/slides/slide-15-hook-layer.md
- ✅ wceu-2026/slides/slide-16-workflow-layer.md
- ✅ wceu-2026/slides/slide-17-issue-template-system.md
- ✅ wceu-2026/slides/slide-18-pr-template-system.md
- ✅ wceu-2026/slides/slide-19-ai-governance-model.md
- ✅ wceu-2026/slides/slide-11-lessons-and-anti-patterns.md

## Exclusion checklist

- No external websites
- No files from other repositories
- No speculative claims without file evidence
