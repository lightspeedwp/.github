---
title: "NotebookLM Source Ingestion Checklist"
description: "Comprehensive source validation and approval policy for NotebookLM analysis. Ensures only approved internal sources (develop-branch) are used for WCEU 2026 talk research."
file_type: "checklist"
category: "Documentation"
version: "1.0.0"
last_updated: "2026-05-28"
owners: ["Engineering Team"]
tags: ["wceu-2026", "notebooklm", "source-validation", "policy"]
status: "active"
stability: "stable"
domain: "documentation"
---

# NotebookLM Source Ingestion Checklist

## Purpose

This checklist enforces a strict **repo-only source policy** for NotebookLM analysis related to the WCEU 2026 talk. All sources must be from the `lightspeedwp/.github` repository's `develop` branch, explicitly approved, and validated before ingestion.

**Policy Statement**:
> NotebookLM shall only ingest content from the approved source set in `deep-research-prompt.md`. No external sources (blogs, wikis, social media, third-party tools) are permitted without explicit approval from the maintainer team.

---

## Section 1: Source Category Definitions

### ✅ APPROVED Sources

**Category: Internal Repository (develop branch)**

- File location: `lightspeedwp/.github` repository
- Branch requirement: **MUST be from `develop` branch**
- URL format: `https://github.com/lightspeedwp/.github/blob/develop/<path>`
- Freshness requirement: Last updated within past 6 months (per frontmatter `last_updated`)
- Content: Architecture docs, governance guides, plugin manifests, agent specs, process guides

**Examples of APPROVED sources**:

- `https://github.com/lightspeedwp/.github/blob/develop/README.md`
- `https://github.com/lightspeedwp/.github/blob/develop/docs/ARCHITECTURE.md`
- `https://github.com/lightspeedwp/.github/blob/develop/plugins/PLUGIN_MANIFEST.json`
- `https://github.com/lightspeedwp/.github/blob/develop/.github/projects/active/ISSUE_33_BRANDING_AGENT_PARENT_SPEC.md`

### ❌ PROHIBITED Sources

**Category: External Content**

- External blogs, Medium posts, Dev.to articles
- Archived wikis or outdated documentation
- Social media (Twitter, LinkedIn, Reddit)
- GitHub issues or pull request comments
- Third-party SaaS documentation without explicit approval
- Unverified AI-generated content

**Category: Non-Canonical Internal Content**

- Files from `main` or other branches (only `develop` allowed)
- Archived or deprecated files (e.g., in `.github/archive/`)
- Draft documents in personal branches
- Temporary working files in `.github/tmp/`

**Category: Future/Speculative Content**

- Unreleased roadmap items not documented in approved sources
- Hypothetical features or architectures
- "Future state" documentation without commitment
- Feature requests or enhancement proposals

**Examples of PROHIBITED sources**:

- ❌ `https://medium.com/@author/lightspeed-governance` (external blog)
- ❌ `https://github.com/lightspeedwp/.github/blob/main/README.md` (wrong branch)
- ❌ `https://twitter.com/lightspeed/governance` (social media)
- ❌ `https://github.com/lightspeedwp/.github/issues/123#comment-xyz` (issue comment)
- ❌ `.github/archive/OLD_README.md` (archived file)

---

## Section 2: Pre-Ingestion Validation Checklist

Before adding a source to NotebookLM, complete this checklist:

### Source Identity

- [ ] Source URL is provided
- [ ] URL format matches approved pattern: `https://github.com/lightspeedwp/.github/blob/develop/<path>`
- [ ] File path is accurate (verify file actually exists in repo)

### Branch Verification

- [ ] URL explicitly contains `/develop/` in the path
- [ ] **NOT** from `main`, `master`, or feature branches
- [ ] **NOT** from archived or deprecated locations

### Content Freshness

- [ ] File has valid YAML frontmatter with `last_updated` field
- [ ] `last_updated` date is within past 6 months of current date
- [ ] If file is older than 6 months, document why it's still authoritative

### Content Relevance

- [ ] Content is directly relevant to at least one research question from `deep-research-prompt.md`
- [ ] Content is not speculative or hypothetical
- [ ] Content aligns with approved analysis scope

### Content Accessibility

- [ ] File is readable (not binary, not encrypted)
- [ ] File is in standard format (Markdown, JSON, YAML, plain text)
- [ ] File contains substantive content (not a stub or placeholder)

### Approval

- [ ] Source is listed in approved source set in `deep-research-prompt.md`
- [ ] Source has been reviewed and approved by at least one maintainer
- [ ] No conflicts exist with other approved sources

---

## Section 3: Prohibited Sources — Quick Reference

### ❌ DO NOT USE

- **External blogs & articles**: Medium, Dev.to, Hashnode, personal blogs
- **Social media**: Twitter/X, LinkedIn, Reddit, Mastodon
- **Wikis & forums**: Archived wikis, StackOverflow, unofficial docs
- **Wrong branch**: Files from `main` or feature branches (use `develop` only)
- **Archived content**: Anything in `.github/archive/` or deprecated folders
- **Speculative**: Unreleased features, hypothetical architectures
- **Drafts**: Files marked [Draft] or [WIP], stub files with minimal content

---

## Section 4: Adding New Sources

If you need to add a source not in the approved list:

1. **Propose**: Create an issue with the source URL and justification
2. **Validate**: Run through the validation checklist above
3. **Review**: Get approval from maintainer team
4. **Update**: Add to approved source list in `deep-research-prompt.md`
5. **Document**: Record approval date and reviewer name

---

## Section 5: Enforcement Rules

### Before Running NotebookLM

- ✅ Verify all sources are from approved list
- ✅ Run validation checklist on any new sources
- ✅ Document source list used (for traceability)

### While Feeding Sources to NotebookLM

- ✅ Copy content directly from develop branch (no paraphrasing)
- ✅ Preserve source attribution (include URL and title)
- ❌ DO NOT mix in external sources or editorial commentary
- ❌ DO NOT add paraphrased content beyond source material

### After NotebookLM Produces Output

- ✅ Verify all references point to approved sources
- ✅ Flag any unapproved source references for review
- ✅ Document gaps where approved sources don't fully explain narrative

---

## Section 6: Example Validation Scenarios

### ✅ APPROVED

**URL**: `https://github.com/lightspeedwp/.github/blob/develop/docs/PLUGIN_PACK_ROADMAP.md`

- ✅ Branch is `develop`
- ✅ File exists and accessible
- ✅ Last updated: 2026-05-15 (within 6 months)
- ✅ Listed in approved source set
- **RESULT**: APPROVED for ingestion

### ❌ REJECTED: Wrong Branch

**URL**: `https://github.com/lightspeedwp/.github/blob/main/README.md`

- ❌ Branch is `main`, not `develop`
- **RESULT**: REJECTED — Use develop: `https://github.com/lightspeedwp/.github/blob/develop/README.md`

### ❌ REJECTED: External Source

**URL**: `https://medium.com/@contributor/how-lightspeed-does-governance`

- ❌ External blog (not from repo)
- ❌ Not in approved source set
- **RESULT**: REJECTED — Prohibited external source

### ❌ REJECTED: Archived File

**URL**: `https://github.com/lightspeedwp/.github/blob/develop/.github/archive/OLD_GOVERNANCE_MODEL.md`

- ❌ File in archived folder (deprecated)
- ❌ Not in approved source set
- **RESULT**: REJECTED — Use current governance docs instead

---

## Section 7: Compliance Tracking

After each NotebookLM analysis, document:

| Date | Analyst | Sources Used | New Sources | Violations | Status |
| --- | --- | --- | --- | --- | --- |
| YYYY-MM-DD | [Name] | N | N | 0 | ✅ |

---

## Section 8: Related Documents

- **Deep Research Prompt**: `wceu-2026/notebooklm/deep-research-prompt.md`
- **Audit & Readiness Plan**: `wceu-2026/WCEU_2026_AUDIT_AND_READINESS_PLAN.md`
- **Repository Governance**: `CLAUDE.md`

---

*This checklist last updated: 2026-05-28*
