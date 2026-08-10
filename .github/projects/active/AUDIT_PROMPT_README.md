---
file_type: documentation
title: "Documentation Audit Prompt - Quick Start"
description: "How to use the Comprehensive Documentation Audit Prompt to create GitHub issues"
version: '1.0.2'
created_date: "2026-05-31"
---

# 📋 Documentation Audit Prompt — Quick Start

## What This Is

A detailed, structured prompt document designed to help you create GitHub issues for systematically auditing and fixing the `.github` repository's documentation, templates, and automation systems.

## Problem It Solves

- **Issue labeling system isn't working** (but PR labeling is)
- **Documentation is scattered** across 40+ files with duplication
- **AI agents don't have clear instructions** on how to create well-formed issues
- **File organization doesn't match** the planned structure in CLAUDE.md
- **44 README files need updating** with accessible Mermaid diagrams

## The Prompt Document

**Location:** `.github/projects/active/DOCUMENTATION_AUDIT_PROMPT_COMPREHENSIVE.md`

**Contains:**

- Problem statement and root causes
- 5 parent issues (full descriptions ready to copy)
- ~25 child issues (templates for customization)
- Instructions for creating issues via GitHub UI or CLI
- Success criteria and next steps

## How to Use It

### Option 1: Create Issues via GitHub UI (Easiest)

1. Open `.github/projects/active/DOCUMENTATION_AUDIT_PROMPT_COMPREHENSIVE.md`
2. Go to each "Parent Issue" section
3. Copy the description and metadata
4. Create new GitHub issue in the repository
5. Paste description into issue body
6. Repeat for all child issues
7. Link parent ↔ child issues using GitHub's linking feature

### Option 2: Create Issues via GitHub CLI

```bash
# Example: create parent issue 1
gh issue create \
  --title "[Audit] Issue Templates, Automation, & AI Agent Integration" \
  --body-file parent-1.md \
  --label "type:audit,area:automation,priority:important" \
  --assignee @ashley

# Repeat for each issue
```

### Option 3: Use a Script

If creating 30+ issues manually is tedious, create a simple script to parse the prompt document and batch-create issues via the GitHub API.

## Issue Structure

```
Parent Issue #NNN
├── Child Issue #NNN.1 — specific component audit
├── Child Issue #NNN.2 — related audit
├── Child Issue #NNN.3 — findings consolidation
└── Child Issue #NNN.4 — implementation plan
```

Each child issue references its parent. Parent issue tracks all children.

## What Each Issue Does

### Parent Issues (Strategic Audits)

1. **Issue Templates & Automation** — Why don't issue templates trigger labeling like PR templates do?
2. **Canonical Configs** — Are labels.yml, issue-types.yml, issue-fields.yml complete and consistent?
3. **Documentation Consolidation** — Where is duplication and what can be merged?
4. **README & Mermaid Diagrams** — Are 44 READMEs accessible and up-to-date?
5. **File Organization** — Does current structure match CLAUDE.md boundaries?

### Child Issues (Detailed Investigations)

Each parent has 4-5 child issues that:

- Focus on a specific component or area
- Provide detailed audit checklists
- Specify deliverables (reports, recommendations)
- Point to relevant files
- Enable parallel investigation

## Expected Outcomes

Once all audits are complete, you'll have:

✅ Clear understanding of why issue automation doesn't work
✅ Mapping of templates → automation triggers → labeling rules
✅ Consolidated documentation plan (reduce 40+ files to core essentials)
✅ Audit of 44 README files with accessibility fixes
✅ File organization plan aligned with CLAUDE.md

This clarity will guide the next implementation wave to fix the system.

## Timeline

- **Week 1:** Create all 30 issues
- **Week 2-3:** Execute audits (gather findings, document issues)
- **Week 4:** Review findings, consolidate recommendations
- **Week 5+:** Execute implementations based on audit outcomes

## Next Steps

1. ✅ **You're here** — Read this README
2. **Create issues** — Use the prompt document to create GitHub issues
3. **Execute audits** — Team investigates and documents findings
4. **Consolidate** — Review audit outputs and create implementation plan
5. **Implement** — Fix templates, configs, documentation based on findings
6. **Validate** — Verify issue automation works correctly

## Key Files to Reference

While creating and executing audits, reference these source documents:

- `CLAUDE.md` — Repository structure and boundaries (source of truth)
- `docs/LABEL_STRATEGY.md` — Label philosophy and color strategy
- `docs/AUTOMATION_GOVERNANCE.md` — Automation standards
- `.github/labels.yml` — All canonical labels
- `.github/issue-types.yml` — All canonical issue types
- `.github/labeler.yml` — Automation rules (shows PR rules, helps identify gaps for issues)

## Questions or Issues?

If while creating issues you realize something needs adjustment:

- Add notes to the issue being created
- Update this README with clarifications
- Check `next-issues-execution-plan.md` for related context

---

**Status:** ✅ Ready to use
**Last Updated:** 2026-05-31
**Maintained by:** LightSpeed Team
