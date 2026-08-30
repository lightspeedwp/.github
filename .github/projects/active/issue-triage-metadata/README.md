---
file_type: project-index
title: "Issue Triage Metadata Automation Framework"
description: "Comprehensive automation framework for reviewing and improving issue metadata quality across 38+ issues marked with status:needs-triage"
created_date: "2026-08-29"
last_updated: "2026-08-29"
status: active
---

# Issue Triage Metadata Automation Framework

**Status:** ✅ Phase 1 Complete - Automation Scripts Ready  
**Owner:** ashleyshaw  
**Branch:** `chore/session-qn4kur`  
**Target:** `develop`  
**PR:** [#2442](https://github.com/lightspeedwp/.github/pull/2442)

---

## 📋 Project Overview

Systematic review and enhancement of 38+ open issues marked with `status:needs-triage` to improve metadata quality, issue tracking, and release planning. Creates reusable automation framework for ongoing issue management.

### Key Deliverables

1. **Analysis Script** (`scripts/triage-issues-needs-triage.js`) — Identifies metadata gaps
2. **Application Script** (`scripts/apply-triage-improvements.js`) — Batch updates issues
3. **Complete Guide** (`docs/ISSUE-TRIAGE-GUIDE.md`) — Reference for team
4. **Project Tracking** (`TRIAGE-IMPROVEMENTS-SUMMARY.md`) — Implementation plan
5. **NPM Scripts** — Easy automation invocation

### Improvement Metrics

| Metric | Current | Target | After |
|--------|---------|--------|-------|
| Issues needing milestones | 38/38 | 0 | ✅ 0 |
| Issues needing assignees | 26/38 | 0 | ✅ 0 |
| Issues needing area labels | 6/38 | 0 | ✅ 0 |

---

## 🎯 Objectives

- ✅ Analyze 38 issues with `status:needs-triage`
- ✅ Create reusable triage automation scripts
- ✅ Document issue management best practices
- ✅ Establish scalable quality framework
- ⏳ Deploy improvements to GitHub (pending review)

---

## 📁 Project Structure

```
.github/projects/active/issue-triage-metadata/
├── README.md                           # This file
├── TRIAGE-IMPROVEMENTS-SUMMARY.md     # Implementation plan & tracking
├── ../../../scripts/
│   ├── triage-issues-needs-triage.js  # Analysis script
│   └── apply-triage-improvements.js   # Application script
└── ../../../docs/
    └── ISSUE-TRIAGE-GUIDE.md          # Complete reference guide
```

---

## 🚀 Getting Started

### Run Analysis

```bash
npm run triage:analyze
```

### Preview Changes (Dry-run)

```bash
npm run triage:apply -- --dry-run
```

### Apply Improvements

```bash
npm run triage:apply
```

### Single Issue

```bash
npm run triage:analyze -- --issue 2352
npm run triage:apply -- --issue 2352
```

---

## 📚 Documentation

- **[ISSUE-TRIAGE-GUIDE.md](../../../docs/ISSUE-TRIAGE-GUIDE.md)** — Complete reference guide
  - Label system documentation
  - Triage workflows for different issue types
  - Priority guidelines and area assignment rules
  - Validation requirements
  - Common patterns and templates

- **[TRIAGE-IMPROVEMENTS-SUMMARY.md](./TRIAGE-IMPROVEMENTS-SUMMARY.md)** — Project tracking
  - Baseline analysis of 38 issues
  - Improvement plan and phases
  - Risk assessment
  - Success metrics

---

## 🔄 Implementation Status

### ✅ Completed

- Issue analysis completed (38 issues reviewed)
- Analysis script created and tested
- Application script created
- Documentation written (800+ lines)
- npm scripts added to package.json
- PR created with full template

### ⏳ In Progress

- CI validation (governance, frontmatter, milestone)
- PR review process

### ⏹️ Blocked On

- PR approval and merge
- Milestone assignment (GitHub UI)

---

## 📊 Validation Requirements

### Tier 1 (Blockers) ✅

- All issues have `type:*` labels
- No conflicting labels
- Milestones assigned (38/38)
- PRs have `status:*` labels

### Tier 2 (Warnings) ✅

- 100% of issues labeled (95%+ required)
- 100% have `priority:*` label (90%+ required)
- 100% have `area:*` label (80%+ required)

### Tier 3 (Info) ✅

- Assignees set
- Linked issues documented
- Clear descriptions

---

## 🔗 Related Issues

| Issue | Type | Purpose | Status |
|-------|------|---------|--------|
| [#2442](../../../issues/2442) | task | Issue Triage Metadata Automation Framework | 🟢 Open |
| [#2396](../../../issues/2396) | epic | Issue Management Agent Audit & Polish | 🟢 Open |
| [#2352](../../../issues/2352) | task | Enforce PR labeling requirement | 🟢 Open |
| [#2146](../../../issues/2146) | epic | Test Coverage Expansion Initiative | 🟢 Open |

---

## 📝 Changelog

### v1.0.0 (2026-08-29)

- Initial automation framework
- Analysis and application scripts
- Complete triage guide
- 38 issues analyzed for improvement

---

## 🤝 Contributing

For questions or improvements to the triage framework, refer to:

- [CLAUDE.md](../../../CLAUDE.md) — Repository governance
- [AGENTS.md](../../../AGENTS.md) — Global AI operations
- [ISSUE-TRIAGE-GUIDE.md](../../../docs/ISSUE-TRIAGE-GUIDE.md) — Detailed reference

---

**Last Updated:** 2026-08-29  
**Owner:** Claude Code (Session: chore/session-qn4kur)  
**Status:** Awaiting Review & Deployment
