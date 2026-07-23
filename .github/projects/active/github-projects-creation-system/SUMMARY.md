---
title: "Planning Summary & Issue Creation Guide"
description: "Quick overview of the GitHub Projects creation system and instructions for creating the Epic and child Story issues."
file_type: "guide"
status: "ready"
version: "v1.0"
created_date: "2026-07-23"
---

# GitHub Projects Creation System — Planning Summary & Issue Creation Guide

**Status**: ✅ Ready to Create Issues  
**Next Action**: Create Epic + Stories in GitHub  

---

## Quick Overview

### What We're Building

A **template-driven GitHub Projects creation system** that:

- Reads CSV fixtures defining new projects
- Creates GitHub Projects v2 with correct template type
- Initializes all fields, automations, and views
- Supports two templates: Client Delivery (Scrumban + UAT) and Product Development (Release Train)

### Implementation Timeline

- **Phase 1**: Foundations (2–3 weeks) — CSV schema, agent scaffold, config, workflow
- **Phase 2**: Client Delivery template (1–2 weeks, parallel)
- **Phase 3**: Product Development template (1–2 weeks, parallel)
- **Phase 4**: PR syncing + docs (1 week, can overlap)
- **Total**: 3–4 weeks with 4–5 developers

### Key Numbers

- **2 templates** (Client Delivery, Product Development)
- **14 core fields** per template (Priority, Type, Effort, Area, Theme, Size, Dates, Milestone, Environment, Parent Issue, Sub-issues Progress, Time)
- **5 automations** per template (auto-add, assignee, pr-linked, qa-label, closed)
- **9 views** for Client Delivery (including UAT), **8 for Product Development** (including Release Gate)
- **0 regressions** target (all existing workflows continue to work)

---

## GitHub Issues to Create

### 1. Epic (Parent)

**GitHub Issue Creation**:

1. Go to [lightspeedwp/.github → Issues → New Issue](https://github.com/lightspeedwp/.github/issues/new)
2. **Title**: Copy from [ISSUES.md](./ISSUES.md) — issue-1-epic section
3. **Description**: Copy entire body from issue-1-epic.md in ISSUES.md
4. **Labels**:
   - `type:epic`
   - `area:automation`
   - `area:projects`
   - `domain:dotgithub-governance`
   - `priority:important`
   - `status:ready`
5. **Milestone**: v1.0
6. **Assignee**: [Choose project owner]
7. **Submit**

**Save the issue number** (e.g., #1152) for linking child stories.

### 2. Story A (Client Delivery Template)

**GitHub Issue Creation**:

1. **Title**: Copy from [ISSUES.md](./ISSUES.md) — issue-2-client-delivery section
2. **Description**: Copy entire body
3. **Labels**:
   - `type:feature`
   - `area:automation`
   - `area:projects`
   - `domain:dotgithub-governance`
   - `priority:important`
   - `status:ready`
   - `parent:epic-[NUMBER]` (replace [NUMBER] with epic number, e.g., `parent:epic-1152`)
4. **Milestone**: v1.0
5. **Assignee**: [Choose story owner]
6. **Related Issues**: Link parent epic
7. **Submit**

### 3. Story B (Product Development Template)

**GitHub Issue Creation**:

1. **Title**: Copy from [ISSUES.md](./ISSUES.md) — issue-3-product-dev section
2. **Description**: Copy entire body
3. **Labels**: Same as Story A
4. **Milestone**: v1.0
5. **Assignee**: [Choose story owner]
6. **Related Issues**: Link parent epic
7. **Submit**

### 4. Update Epic with Child Links (After Stories Created)

Edit the Epic issue:

1. Add a "## Child Stories" section
2. Link to both stories (e.g., #[A], #[B])

---

## Field Mapping Strategy

### Source of Truth

All field mappings come from **`.github/issue-fields.yml`** — we synchronize issues and projects from this single source.

### Shared Fields (14 Core Across Both Templates)

| Field | Type | Values | Notes |
|-------|------|--------|-------|
| Priority | single_select | Critical, Important, Normal, Minor | Org-level |
| Type | single_select | Bug, Feature, Design, Chore, Automation, Research, Documentation, Integration, Release, Task | From issue-types.yml |
| Effort | single_select | XS, S, M, L, XL, XXL, XXXL | Org-level |
| Area | single_select | Frontend, Backend, Build & CI, etc. | New custom field |
| Theme | single_select | Checkout, Performance, etc. (client) OR Design System, Performance, etc. (product) | Template-specific |
| Size, Start Date, Deadline, Milestone, Environment, Parent Issue, Sub-issues Progress, Time | (various) | (see PLANNING.md) | Shared |

### Template Differences

| Aspect | Client Delivery | Product Development |
|--------|---|---|
| Status | Backlog → **Todo** → Done | Backlog → **Ready** → Done |
| Key View | UAT (Client) | Release Gate |
| Milestone Examples | Phase-1 UAT, Go-Live, vX.Y.Z | v1.0, v2.0 (releases) |
| Branching | Main-only (optional develop) | develop + release/vX.Y.Z |
| Iteration Field | Not used | Optional (2-week sprints) |

---

## CSV Fixture Format

**Example** (`.github/fixtures/projects.csv`):

```csv
name,type,description,repository,team,domain,milestone,owner_login,automation_enabled,views_config
"Product – Design System",product-development,"Tokens, components; v2.0",lightspeedwp/.github,Core,Dotgithub Governance,v2.0,ashleyshaw,true,default
"Client – Acme Corp",client-delivery,"Redesign + cart; Phase-1 UAT",lightspeedwp/acme-theme,Theme,WordPress Block Theme,"Phase-1 UAT",ashleyshaw,true,default
```

---

## Architecture Summary

```
CSV Fixture (.github/fixtures/projects.csv)
  ↓
projects-bulk-create.yml (new workflow)
  ↓
project-creator.agent.js (new agent)
  ├─ Parse CSV + Validate
  ├─ Create Project (GraphQL)
  ├─ Initialize Fields (.github/projects.yml)
  ├─ Wire Automations
  └─ Generate View Configs
  ↓
GitHub Project v2 (fully initialized)
```

---

## Key Design Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| **Intake** | CSV fixtures | Declarative, bulk-capable, version-controlled |
| **Templates** | Two distinct (not configurable) | Different semantics (Todo vs. Ready), automations, views |
| **Field Source** | issue-fields.yml (canonical) | Single source of truth; avoid vocabulary drift |
| **PR Type** | Branch prefix (feat/→Feature) | PRs lack native Issue Type field; prefixes already mapped |
| **Views** | Document + manual checklist | Limited GraphQL support; 5-min post-creation task |

---

## Success Metrics

### Phase 2 (Client Delivery)

- ✅ CSV fixture dry-run passes
- ✅ Project creation succeeds (live test)
- ✅ All 14 fields initialized
- ✅ 5 automations working
- ✅ 9 views documented
- ✅ Admin runbook complete

### Phase 3 (Product Development)

- ✅ Same as Phase 2
- ✅ Plus: Release Gate view filters by Milestone correctly
- ✅ Plus: Tech Debt view groups Refactor/Chore work

### Phase 4 (PR Syncing)

- ✅ PR Type synced from branch prefix
- ✅ All regression tests passing
- ✅ Zero regressions in existing workflows

---

## Blockers & Dependencies

### Must Complete First

- **#1145**: Org issue-field writer infrastructure (org-level fields init)
- **#1146**: Secret-gating hardening (project-meta-sync security)

### Already Complete ✅

- **#1148**: Priority vocabulary reconciliation
- **field-parity.test.js**: Regression test suite

---

## Questions Before Creating Issues?

1. **Assignees**: Who drives Phase 1? Who owns Stories A & B?
2. **Timing**: When does Phase 1 start?
3. **View Creation**: Accept manual UI checklist, or push for automation?
4. **CSV Ownership**: Who maintains project fixtures? Governance team or distributed?

---

## Document Index

| File | Purpose | Audience |
|------|---------|----------|
| [INDEX.md](./INDEX.md) | Project overview & navigation | All |
| [PLANNING.md](./PLANNING.md) | Full architecture & technical details | Tech leads, architects |
| **SUMMARY.md** | This file — quick overview + issue creation | Project managers, team leads |
| [WORK-BREAKDOWN.md](./WORK-BREAKDOWN.md) | Tasks, effort, timeline, dependencies | Developers, PMs |
| [TEMPLATE-COMPARISON.md](./TEMPLATE-COMPARISON.md) | Visual template differences | All stakeholders |
| [ISSUES.md](./ISSUES.md) | GitHub issue templates (ready to copy) | GitHub issue creators |

---

## Next Steps

1. ✅ **Review this summary** (you are here)
2. ✅ **Read PLANNING.md** (full details)
3. ✅ **Read TEMPLATE-COMPARISON.md** (understand template differences)
4. ⏭️ **Create GitHub Epic** (copy from ISSUES.md)
5. ⏭️ **Create GitHub Stories** (copy from ISSUES.md)
6. ⏭️ **Assign team** (Phase 1 owner, Story owners)
7. ⏭️ **Kick off Phase 1**

---

**Planning Status**: ✅ Complete — Ready to Execute  
**Last Updated**: 2026-07-23  
**Next Action**: Create GitHub Epic + Stories
