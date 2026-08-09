---
title: "Badges Workflow Integration — Project Overview"
description: "Active project to audit, plan, and integrate badges workflow automation into GitHub Actions"
file_type: "documentation"
status: "active"
created_date: "2026-08-08"
last_updated: "2026-08-09T14:08:00Z"
version: "v1.2.0"
authors: ["Ash Shaw"]
tags: ["badges", "workflow-integration", "automation", "documentation"]
---

# Badges Workflow Integration — Project Overview

**Status:** 🟠 Phase 4: Integration Testing (In Progress)  
**Timeline:** 2 weeks (2026-08-08 → 2026-08-22)  
**Effort:** ~40 hours  
**Owner:** Ash Shaw  
**Latest:** Phases 1-3 complete; PR #1668 fixed action versions, queued for merge

---

## What This Project Is

This project audits the existing badges infrastructure and plans its integration into GitHub Actions workflows. The goal is to **automate badge generation and maintenance across documentation** while preventing the broken badge issues that occurred in the past.

### The Problem We're Solving

1. **Badges utility code exists but is unused** — `scripts/agents/includes/badges.js` (227 lines) sits idle
2. **Broken badges were removed** — PR #1609 removed 33 broken workflow badges from documentation because they linked to non-existent workflows
3. **No automation exists** — Badges are manually maintained or not updated at all
4. **Configuration is missing** — The `.github/automation/badges.schema.yml` file that badges.js expects doesn't exist
5. **Workflow discovery is manual** — When workflows are created/deleted, badges aren't updated

### How We're Solving It

**Four integration workflows** that will:

- 🔄 Auto-generate badges for documentation when files change
- 🔗 Validate badge URLs daily (prevent 404s)
- 🔍 Discover new workflows and auto-update schema
- 📊 Provide status monitoring and coverage reporting

---

## Quick Links

| Document | Purpose | Status |
|----------|---------|--------|
| **[AUDIT_AND_PLAN.md](./AUDIT_AND_PLAN.md)** | Complete audit findings + detailed 4-phase implementation plan | ✅ Created |
| **[BROKEN_BADGES_FINDINGS.md](./BROKEN_BADGES_FINDINGS.md)** | Detailed analysis of broken badge links from VERSIONING.md | ✅ Created |
| **[PROJECT_TRACKER.md](./PROJECT_TRACKER.md)** | GitHub issues checklist and progress tracking | ✅ Created |
| WORKFLOW_ARCHITECTURE.md | Technical design for the 4 new workflows | 📋 Planned (Phase 2) |
| OPENSPEC_ANALYSIS.md | Optional: Complex decision analysis via OpenSpec | 📋 Planned (if needed) |

---

## Key Findings

### Existing Infrastructure ✅

- Badge generation library: `scripts/agents/includes/badges.js` (227 lines)
- Badge utilities: `scripts/agents/includes/badgeUtils.js` (61 lines)
- Test coverage: Basic tests exist (42 lines)

### Critical Gaps ❌

| Gap | Impact | Status |
|-----|--------|--------|
| **No config schema** | badges.js can't load configuration → feature unusable | Missing `.github/automation/badges.schema.yml` |
| **No workflows** | Badges are never generated automatically | 0/4 workflows implemented |
| **No governance** | Unclear when/how to update badges | No documentation |
| **Broken links** | 12 broken badge links in VERSIONING.md | Fixed by removing them (not ideal) |
| **Schema alignment** | TODO comment in badges.js about automation spec alignment | Code debt |

### Recent History

| Event | Date | Status |
|-------|------|--------|
| Issue #1547 created: "Broken badges" | 2026-08 | ✅ Closed |
| PR #1609: Remove broken badges from docs | 2026-08-05 | ✅ Merged |
| Commit 427b7ed62: Remove badges from VERSIONING.md | 2026-08 | ✅ Merged |
| This audit created | 2026-08-08 | 🟢 In progress |

---

## Project Goals

### Phase 1: Foundation (5 days)

- [ ] Create badge schema configuration
- [ ] Align badges.js with automation spec
- [ ] Create badge governance documentation

### Phase 2: Workflows (5 days)

- [ ] Documentation badge update workflow
- [ ] README status badge maintenance workflow
- [ ] Workflow inventory synchronization
- [ ] Badge health check workflow

### Phase 3: Integration (3 days)

- [ ] Test all workflows
- [ ] Generate initial schema from current state
- [ ] Run documentation badge updates
- [ ] Create monitoring dashboard

### Phase 4: Governance (2 days)

- [ ] Finalize badge governance policy
- [ ] Create update procedures
- [ ] Document troubleshooting
- [ ] Set up metrics tracking

---

## Open Questions (Need Your Decision)

**Q1: Badge Coverage Scope**
> Should badges appear in all documentation files or only selected types?

**Options:**

- A) All files with frontmatter
- B) Only key document types (docs/, agents/, schemas/, instructions/)
- C) Opt-in per file

**Recommendation:** Option B (reduces noise, focuses on important docs)

---

**Q2: Workflow Badging Frequency**
> How often should documentation badges be updated?

**Options:**

- A) Every push to develop (frequent, resource-intensive)
- B) Weekly scheduled runs (batch efficiency)
- C) Manual dispatch only

**Recommendation:** Option A for documentation changes + B for status checks

---

**Q3: Badge PR Merge Strategy**
> Should badge-only PRs be auto-merged or require manual review?

**Options:**

- A) Auto-merge badge-only PRs
- B) Always require manual review
- C) Auto-merge routine updates, review significant changes

**Recommendation:** Option C with clear labels

---

**Q4: Which Workflows Deserve Badges**
> Should we badge all 42 workflows or a focused subset?

**Options:**

- A) All 42 workflows (comprehensive but noisy)
- B) Top 10 critical workflows (focused)
- C) Configurable subset in schema

**Recommendation:** Option C (15-20 critical workflows initially)

---

## Next Steps

### For You (Ash)

1. Read [AUDIT_AND_PLAN.md](./AUDIT_AND_PLAN.md) (30 min)
2. Decide on Q1-Q4 above (15 min)
3. Approve to proceed with Phase 1 (5 min)

### If Approved

1. Create GitHub issues for Phase 1-4 tasks (~1 hour)
2. Begin Phase 1 implementation (~5 hours)
3. Complete Phase 4 within 15 days

---

## Success Criteria

- ✅ Schema configuration exists and is validated
- ✅ All 42 workflows have badge definitions
- ✅ Documentation badges auto-generated on push
- ✅ README badges auto-maintained daily
- ✅ Zero broken badge links (checked weekly)
- ✅ New workflows auto-badged within 7 days
- ✅ Team can update badges without code changes

---

## File Structure

```
.github/projects/active/badges-workflow-integration-2026-08-08/
├── PROJECT_README.md (this file)
├── AUDIT_AND_PLAN.md (comprehensive audit + design)
├── BROKEN_BADGES_FINDINGS.md (detailed analysis)
├── PROJECT_TRACKER.md (GitHub issues checklist)
├── WORKFLOW_ARCHITECTURE.md (technical design)
├── OPENSPEC_ANALYSIS.md (optional complex analysis)
└── PHASE_1_SCHEMA_TEMPLATE.yml (starting point for config)

.github/automation/ (to be created)
└── badges.schema.yml (Phase 1 deliverable)

.github/workflows/ (Phase 2 deliverables)
├── badges-documentation-update.yml
├── badges-readme-status.yml
├── badges-workflow-audit.yml
└── badges-health-check.yml

docs/ (Phase 1 deliverables)
├── BADGES_GOVERNANCE.md
├── BADGES_EXAMPLES.md
└── BADGES_TROUBLESHOOTING.md
```

---

## Related Projects & Issues

### Prior Work

- **Issue #1547** — Broken badges (closed, PR #1609)
- **PR #1609** — Remove broken badges (merged 2026-08-05)
- **Release Process Redesign** — Phase 1-3 complete
- **Workflows Consolidation** — Phase 4 audit complete

### OpenSpec Project

- Optional analysis tool for complex decisions
- Located at `.github/projects/active/openspec/`

---

## Contact & Questions

**Project Owner:** Ash Shaw  
**Questions:** See Q1-Q4 above or comment in project tracker

---

*Last updated: 2026-08-08 — Ready for your review and approval*
