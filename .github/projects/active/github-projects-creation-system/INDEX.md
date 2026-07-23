---
title: "GitHub Projects Creation System"
description: "Bulk project creation from CSV fixtures with template-driven field initialization for Client Delivery and Product Development project types."
file_type: "project-tracking"
status: "planning"
version: "v1.0"
created_date: "2026-07-23"
last_updated: "2026-07-23"
authors: ["LightSpeed Team"]
maintainer: "Ash Shaw"
owner: "AI Ops Team"
milestone: "v1.0"
epic_issue: "#[TBD]"
child_issues:
  - story_a: "#[TBD] Initialize Client Delivery Project Template"
  - story_b: "#[TBD] Initialize Product Development Project Template"
tags: ["projects", "automation", "github-api", "workflow", "templates"]
domain: "governance"
---

# GitHub Projects Creation System — Planning Index

**Project Phase**: Planning → Ready for Implementation  
**Target Milestone**: v1.0  
**Created**: 2026-07-23  
**Owner**: Ash Shaw  
**Epic Status**: [Awaiting Issue Creation]

---

## Quick Links

| Document | Purpose | Audience |
|----------|---------|----------|
| [PLANNING.md](./PLANNING.md) | Full architectural blueprint (11 KB) | Tech leads, architects |
| [SUMMARY.md](./SUMMARY.md) | Overview & issue creation guide (8 KB) | Product managers, team leads |
| [WORK-BREAKDOWN.md](./WORK-BREAKDOWN.md) | Task breakdown, effort, timeline (12 KB) | Project managers, developers |
| [TEMPLATE-COMPARISON.md](./TEMPLATE-COMPARISON.md) | Visual template comparison (12 KB) | All stakeholders |
| [ISSUES.md](./ISSUES.md) | GitHub issue templates (ready to copy) | GitHub issue creators |

---

## Project Summary

### What We're Building

A **template-driven GitHub Projects creation system** that:

- Reads CSV fixtures defining new projects
- Creates GitHub Projects v2 with correct template type
- Initializes all fields, automations, and views based on template
- Syncs PR metadata to projects using branch prefix → Type field mapping

### Why It Matters

- ✅ **Eliminates manual project setup** (currently error-prone, ~30 min per project)
- ✅ **Ensures field parity** (Project fields ← issue-fields.yml, single source of truth)
- ✅ **Supports two distinct workflows** (Client Delivery vs. Product Development)
- ✅ **Enables bulk creation** (5 projects in one CSV, one workflow run)
- ✅ **Leverages existing infrastructure** (extends project-meta-sync, reuses derive-project-fields.cjs)

### Two Templates

| Template | Use Case | Status Flow | Key View |
|----------|----------|-------------|----------|
| **Client Delivery** | Client work, migrations, short-term | Backlog → Todo → Done | UAT (Client) |
| **Product Development** | Internal products, releases | Backlog → Ready → Done | Release Gate |

---

## Implementation Plan (4 Phases)

### Phase 1: Foundations (2–3 weeks)

- [ ] CSV fixture format & schema
- [ ] project-creator.agent.js scaffold
- [ ] .github/projects.yml template config
- [ ] projects-bulk-create.yml workflow

### Phase 2: Client Delivery Template (1–2 weeks)

- [ ] 14 fields, 5 automations, 9 views
- [ ] Unit + integration + live tests
- [ ] Admin runbook & example CSV

### Phase 3: Product Development Template (1–2 weeks, parallel with Phase 2)

- [ ] 14 fields, 5 automations, 8 views
- [ ] Release-train scenario test
- [ ] Admin runbook & example CSV

### Phase 4: PR Syncing & Documentation (1 week, can overlap)

- [ ] PR Type derivation from branch prefix
- [ ] Regression tests
- [ ] Comprehensive docs & guide

**Total Duration**: 3–4 weeks (4–5 developers)

---

## GitHub Issues

### Epic (Parent)

**Issue**: [TBD] GitHub Projects — Bulk Creation & Template-Driven Initialization

- **Type**: epic
- **Milestone**: v1.0
- **Status**: Ready for creation
- **File**: [ISSUES.md](./ISSUES.md) → issue-1-epic

### Stories (Child)

**Story A**: [TBD] Initialize Client Delivery Project Template

- **Type**: feature
- **Milestone**: v1.0
- **Depends on**: Phase 1 complete
- **File**: [ISSUES.md](./ISSUES.md) → issue-2-client-delivery

**Story B**: [TBD] Initialize Product Development Project Template

- **Type**: feature
- **Milestone**: v1.0
- **Depends on**: Phase 1 complete
- **File**: [ISSUES.md](./ISSUES.md) → issue-3-product-dev

---

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Intake Format** | CSV fixtures | Declarative, bulk-capable, version-controllable |
| **Template Approach** | Two distinct templates | Client Delivery and Product Development have fundamentally different workflows |
| **Field Source** | issue-fields.yml (canonical) | Avoid vocabulary drift; leverage existing investment |
| **PR Type Derivation** | Branch prefix (feat/→Feature) | PRs lack native Issue Type field; branch prefixes already mapped |
| **View Creation** | Documented checklist (manual UI) | Limited GraphQL support; 5-min post-creation task |
| **Dependencies** | #1145, #1146 | Org issue-field writer + secret-gating required first |

---

## Blockers & Dependencies

### Must Complete First

- **#1145**: Org issue-field writer infrastructure
  - Needed for org-level field initialization
  - Scaffolding done; awaiting field ID configuration

- **#1146**: Secret-gating hardening for project-meta-sync
  - Ensures graceful credential handling
  - Needed for safe field sync

### Already Complete ✅

- **#1148**: Priority vocabulary reconciliation (merged)
- **field-parity.test.js**: Regression test suite (ensures no silent failures)

---

## Success Metrics

### By End of Phase 2 (Client Delivery)

- ✅ CSV fixture works (dry-run passes)
- ✅ Project creation succeeds (live test)
- ✅ All 14 fields initialized correctly
- ✅ 5 automations tested
- ✅ 9 views documented & creatable
- ✅ Admin runbook complete

### By End of Phase 3 (Product Development)

- ✅ Same as Client Delivery
- ✅ Plus: Release Gate view works (filters by Milestone, groups by Type)
- ✅ Plus: Tech Debt view works (filters Refactor/Chore work)

### By End of Phase 4 (PR Syncing)

- ✅ PR Type field synced from branch prefix
- ✅ All regression tests passing
- ✅ Zero regressions in existing workflows
- ✅ Team can adopt: Create 5+ projects in first month

---

## File Locations

**Planning Documents**:

- `.github/projects/active/github-projects-creation-system/` (this folder)

**Source Code** (post-implementation):

- `.github/workflows/projects-bulk-create.yml` (new workflow)
- `.github/projects.yml` (new template config)
- `.github/fixtures/projects*.csv` (example CSVs)
- `scripts/agents/project-creator.agent.js` (new agent)
- `.github/agents/project-creator.agent.md` (agent spec)

**Documentation** (post-implementation):

- `docs/PROJECTS.md` (new, or section in docs/AUTOMATION.md)
- Admin runbook with field ID setup, CSV maintenance, view creation checklist

---

## Team Assignments (To Be Filled)

| Phase | Owner | Lead | Timeline |
|-------|-------|------|----------|
| Phase 1 | [TBD] | [TBD] | Week 1–2 |
| Story A (Client Delivery) | [TBD] | [TBD] | Week 2–3 |
| Story B (Product Development) | [TBD] | [TBD] | Week 2–3 |
| Phase 4 (PR Syncing) | [TBD] | [TBD] | Week 3–4 |

---

## Related Issues & Projects

- **#1145**: Org issue-field writer infrastructure
- **#1146**: Secret-gating hardening for project-meta-sync
- **#1148**: Priority vocabulary reconciliation ✅
- **Existing workflows**: project-meta-sync.yml, labeling.yml, metadata-governance.yml
- **Existing configs**: issue-fields.yml, issue-types.yml, BRANCHING_STRATEGY.md

---

## Approval & Sign-Off

- [ ] Architecture reviewed (tech lead)
- [ ] Field mapping validated (governance team)
- [ ] Dependencies confirmed (infrastructure team)
- [ ] Epic issue created in GitHub
- [ ] Child stories created in GitHub
- [ ] Team assignments confirmed
- [ ] Phase 1 kicks off

---

## Document Navigation

**Start here**: [SUMMARY.md](./SUMMARY.md) — Quick overview + how to create issues  
**Deep dive**: [PLANNING.md](./PLANNING.md) — Full technical architecture  
**Execution**: [WORK-BREAKDOWN.md](./WORK-BREAKDOWN.md) — Tasks, effort, timeline  
**Comparison**: [TEMPLATE-COMPARISON.md](./TEMPLATE-COMPARISON.md) — Template differences  
**Issues**: [ISSUES.md](./ISSUES.md) — GitHub issue templates (copy-paste ready)

---

**Project Status**: ✅ Planning Complete — Ready to Create Issues & Start Phase 1  
**Last Updated**: 2026-07-23  
**Next Step**: Create Epic + Stories in GitHub; assign Phase 1 owner; kick off development

---

*Built with 🚀 architecture and clear governance!*
