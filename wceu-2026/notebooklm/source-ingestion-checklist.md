---
title: "NotebookLM Source Ingestion Checklist"
description: "Checklist to ensure NotebookLM only ingests approved repository sources for this talk."
file_type: "documentation"
last_updated: "2026-05-28"
owners: ["Ash Shaw"]
tags: ["wceu-2026", "notebooklm", "governance", "source-control"]
---

# NotebookLM Source Ingestion Checklist

**Purpose**: Ensure that NotebookLM analysis of the WCEU 2026 talk is grounded ONLY in approved repository sources and adheres to strict governance rules.

**Repo State**: develop branch (all URLs pinned to `https://github.com/lightspeedwp/.github/blob/develop/...`)  
**Last Updated**: 2026-05-28

---

## Source Approval Policy

### APPROVED Sources

- ✅ Files within `lightspeedwp/.github` repository
- ✅ Files on the `develop` branch only
- ✅ Public documentation (README, AGENTS.md, CLAUDE.md, instructions/, docs/)
- ✅ Governance & standards files (.github/ workflow documentation, AUTOMATION_GOVERNANCE.md)
- ✅ Plugin architecture files (plugins/, plugin manifests, installation guides)
- ✅ Talk assets (wceu-2026/ folder contents)

### NOT APPROVED Sources

- ❌ External blogs, Medium posts, or third-party documentation
- ❌ Files on other branches (main, experimental, feature branches)
- ❌ Private documentation or internal-only content
- ❌ Generated artifacts or build outputs
- ❌ Node_modules or vendor directories
- ❌ AI-generated summaries or analyses from other sources

---

## Canonical Source Set — Phase-Based Ingestion

Ingest sources in this order for logical coherence:

### Phase 1: Foundation Architecture

- [ ] [README.md](https://github.com/lightspeedwp/.github/blob/develop/README.md)
- [ ] [AGENTS.md](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md)
- [ ] [CLAUDE.md](https://github.com/lightspeedwp/.github/blob/develop/CLAUDE.md)

### Phase 2: Governance & Standards

- [ ] [Coding Standards](https://github.com/lightspeedwp/.github/blob/develop/instructions/coding-standards.instructions.md)
- [ ] [Automation Governance](https://github.com/lightspeedwp/.github/blob/develop/.github/AUTOMATION_GOVERNANCE.md)
- [ ] [File Organisation](https://github.com/lightspeedwp/.github/blob/develop/.github/instructions/file-organisation.instructions.md)

### Phase 3: Plugin Pack Architecture

- [ ] [Plugins README](https://github.com/lightspeedwp/.github/blob/develop/plugins/README.md)
- [ ] [Plugin Manifest](https://github.com/lightspeedwp/.github/blob/develop/plugins/PLUGIN_MANIFEST.json)
- [ ] [Plugin Structure Instructions](https://github.com/lightspeedwp/.github/blob/develop/instructions/plugin-structure.instructions.md)

### Phase 4: Talk Assets & Documentation

- [ ] [Plugin Pack Roadmap](https://github.com/lightspeedwp/.github/blob/develop/docs/PLUGIN_PACK_ROADMAP.md)
- [ ] [Plugin Installation Guide](https://github.com/lightspeedwp/.github/blob/develop/docs/PLUGIN_INSTALLATION_GUIDE.md)
- [ ] [Talk Outline (25 min)](https://github.com/lightspeedwp/.github/blob/develop/wceu-2026/talk-outline-25min.md)
- [ ] [Repository Source Index](https://github.com/lightspeedwp/.github/blob/develop/wceu-2026/references/repo-source-index.md)

---

## Pre-Ingestion Validation

Before feeding sources to NotebookLM, verify:

### URL Format

- [ ] All URLs follow pattern: `https://github.com/lightspeedwp/.github/blob/develop/...`
- [ ] No bare URLs; all wrapped in markdown links
- [ ] No shortened or redirected URLs (full explicit paths only)

### Branch Verification

- [ ] All URLs reference `/blob/develop/` (not main, staging, or feature branches)
- [ ] No branch switching during ingestion
- [ ] Repository is `lightspeedwp/.github` (not a fork or mirror)

### File Type Scan

- [ ] Only `.md`, `.json`, and `.yml` files (no binaries)
- [ ] No image files, PDFs, or media assets
- [ ] No generated artifacts (build/, dist/, coverage/)

### Content Spot-Check

- [ ] Files contain valid frontmatter (title, description, owners)
- [ ] No truncated or corrupted files
- [ ] No placeholder text like "[PLACEHOLDER]" or "[TODO]"

---

## Ingestion Process

1. **Log ingestion start**: Record date, time, operator name, branch state
2. **Feed Phase 1–4 sources** in order to NotebookLM
3. **Allow analysis time**: Let NotebookLM process fully (5–10 min per phase)
4. **Review output**: Check that citations reference only approved sources
5. **Record completion**: Log ingestion end time, any issues encountered

**Ingestion Log**:

```
Date: [YYYY-MM-DD]
Time: [HH:MM:SS UTC]
Operator: [Name/Email]
Branch: develop (commit: [SHA])
Sources Fed: Phase 1, Phase 2, Phase 3, Phase 4
Issues: [None / List any]
Verification Status: [PASSED / NEEDS REVIEW]
```

---

## Post-Ingestion Verification

After NotebookLM completes analysis:

- [ ] All citations reference approved sources only
- [ ] No references to external blogs or third-party docs
- [ ] No speculation beyond repository content
- [ ] Analysis grounded in actual code/governance structure
- [ ] No mention of unreleased features or speculative roadmap items
- [ ] Fact-check 3–5 key claims against source material

---

## Blocked Content Rules

The following MUST be rejected before ingestion:

- ❌ **External links**: Blog posts, tutorial sites, YouTube, Medium, DEV.to
- ❌ **Non-develop branches**: Links to main, staging, feature branches
- ❌ **Private docs**: Internal-only documentation or confidential strategies
- ❌ **Generated artifacts**: node_modules, build outputs, coverage reports
- ❌ **Partial/stub files**: Files with only frontmatter and no body content
- ❌ **AI-generated content**: Summaries from other LLMs or synthesis tools

---

## Version Control & Audit Trail

**Repo State Snapshot**:

- Repository: `lightspeedwp/.github`
- Branch: `develop`
- Ingestion Date: [To be filled]
- Ingestion By: [To be filled]

All source URLs are explicit develop-branch URLs. If repository is updated after this checklist date, a new ingestion cycle is required.

---

## Sign-Off

- **Checklist Completed By**: [Name]
- **Date**: [YYYY-MM-DD]
- **Verification Status**: ✅ PASSED / ⚠️ NEEDS REVIEW / ❌ FAILED
- **Notes**: [Any deviations, issues, or follow-up actions]
