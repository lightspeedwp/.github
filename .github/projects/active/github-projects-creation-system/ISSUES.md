---
title: "GitHub Issue Templates — Ready to Create"
description: "Copy-paste ready Epic and Story issue templates for GitHub Projects creation system."
file_type: "reference"
status: "ready"
version: "v1.0"
created_date: "2026-07-23"
---

# GitHub Issue Templates — Ready to Create

**Instructions**: Copy each section below into GitHub when creating issues. All formatting and links are preserved.

---

## Issue 1: Epic (Parent)

**Copy This Entire Section (Below) Into GitHub Issue**:

---

### Title

```
Epic: GitHub Projects — Bulk Creation & Template-Driven Initialization
```

### Description

```markdown
## Definition of Ready (DoR)

- [x] Problem and rationale stated
- [x] Scope mapped: two templates (Client Delivery, Product Development)
- [x] Dependencies identified: #1145 (org issue-field writer), #1146 (secret-gating)
- [x] Architecture documented: CSV fixtures, agent, workflow, field mappings
- [x] Acceptance criteria defined for child issues
- [x] Implementation broken into 4 phases

## Summary

Teams need a way to **bulk-create GitHub Projects** with **template-driven field initialization**. Currently:
- Creating projects is manual and error-prone
- Field initialization is incomplete (no automations, no views)
- Each team invents their own structure
- No parity between Client Delivery and Product Development templates

This epic delivers:
1. **CSV-based project fixtures** — teams define projects in a CSV file
2. **Template-driven initialization** — correct fields, automations, views for template type
3. **PR field syncing** — branch prefix → Type field mapping for PRs
4. **Complete automation** — one workflow run; projects ready to use

**Example**: Create 5 client delivery projects and 2 internal product projects in one CSV + one workflow execution.

## Acceptance Criteria

- [ ] CSV fixture format defined and documented (`.github/fixtures/projects.csv`)
- [ ] Template config (`.github/projects.yml`) maps template type → field set + automations + views
- [ ] `project-creator.agent.js` implemented with full test coverage (≥80%)
- [ ] `projects-bulk-create.yml` workflow operational with dry-run support
- [ ] Child Story #[A]: Client Delivery template fully initialized and tested
- [ ] Child Story #[B]: Product Development template fully initialized and tested
- [ ] PR Type field derivation from branch prefix working
- [ ] All new code follows LightSpeedWP standards (JSDoc, testing, UK English)
- [ ] Documentation added to `docs/AUTOMATION.md` or new `docs/PROJECTS.md`
- [ ] Fixture examples in `.github/fixtures/projects-*.csv`
- [ ] Admin runbook for field ID configuration and CSV ownership

## Scope

### In Scope
- ✅ CSV fixture parsing and validation
- ✅ GraphQL-based project creation
- ✅ Field initialization based on template type
- ✅ Project workflow automations (via API where possible)
- ✅ View configuration (documented; manual UI setup for some views)
- ✅ PR Type field syncing from branch prefix
- ✅ Dry-run mode for safe testing

### Out of Scope (Future Epics)
- ⏸️ Template customization UI
- ⏸️ Auto-sync existing projects to new template
- ⏸️ Project archival automation
- ⏸️ Field value defaults by team/domain

## Implementation Notes

**Two Templates**:
- **Client Delivery**: Scrumban + UAT workflow; Status: Backlog → Todo → Done
- **Product Development**: Release Train; Status: Backlog → Ready → Done

**Field Mapping** (from `.github/issue-fields.yml`):
- Priority: Critical, Important, Normal, Minor
- Type: Bug, Feature, Design, Chore, Automation, Research, Documentation, Integration, Release, Task
- Effort: XS–XXXL
- 14 core fields shared across templates (Area, Theme, Size, Dates, Milestone, Environment, Parent Issue, Sub-issues Progress, Time)

**CSV Fixture Format**:
```csv
name,type,description,repository,team,domain,milestone,owner_login,automation_enabled,views_config
"Product – Design System",product-development,"Tokens, components; v2.0",lightspeedwp/.github,Core,Dotgithub Governance,v2.0,ashleyshaw,true,default
"Client – Acme Corp",client-delivery,"Redesign + cart; Phase-1 UAT",lightspeedwp/acme-theme,Theme,WordPress Block Theme,"Phase-1 UAT",ashleyshaw,true,default
```

## Stories

- **Story #[A]**: Initialize Client Delivery Project Template
  - Scrumban + UAT template; 14 fields, 5 automations, 9 views
  
- **Story #[B]**: Initialize Product Development Project Template
  - Release Train template; 14 fields, 5 automations, 8 views

## Success Metrics

- **Adoption**: ≥5 projects created from template in first month
- **Quality**: 0 manual fixes needed post-creation
- **Velocity**: New project fully operational in <5 minutes
- **Coverage**: All field types initialized correctly

## Related Issues

- #1145 — Org issue-field writer infrastructure (blocks org-level field init)
- #1146 — Secret-gating hardening (blocks secure field sync)
- #1148 — Priority vocabulary reconciliation ✅ (merged)

## Questions for Discussion

1. **View creation automation**: Accept manual UI checklist, or push for JavaScript-based automation?
2. **CSV ownership**: Who maintains `.github/fixtures/projects*.csv`? Governance team or distributed?
3. **Custom field values**: Should projects inherit org defaults, or can each project override?

---

**Planning Docs**: See `.github/projects/active/github-projects-creation-system/` for full architectural details, work breakdown, and template comparison.

---

**Milestone**: v1.0  
**Assignee**: [TBD]  
**Labels**: `type:epic`, `area:automation`, `area:projects`, `domain:dotgithub-governance`, `priority:important`, `status:ready`  
**Effort**: L (large — 3–4 weeks, 4 stories, 20+ tasks)  
**Size**: 8–13 (story points)

**Definition of Done (DoD)**

- [ ] All child stories completed and merged to develop
- [ ] Code review approved (≥2 reviewers)
- [ ] All tests passing (unit + integration)
- [ ] Documentation complete
- [ ] Dry-run tested (validates without creating)
- [ ] Live tested with 2–3 fixture projects
- [ ] Zero critical bugs
- [ ] Changelog updated
- [ ] Release notes prepared

```

### Labels:
- `type:epic`
- `area:automation`
- `area:projects`
- `domain:dotgithub-governance`
- `priority:important`
- `status:ready`

### Milestone:
- v1.0

### Assignee:
- [Choose one]

---

## Issue 2: Story A (Client Delivery)

**Copy This Entire Section (Below) Into GitHub Issue**:

---

### Title:
```

Story: Initialize Client Delivery Project Template with Fields, Automations & Views

```

### Description:

```markdown
## Definition of Ready (DoR)

- [x] Template specification provided: `github-projects-client-delivery.md`
- [x] Field mapping documented: 14 fields with canonical values from issue-fields.yml
- [x] Automations defined: 5 core rules
- [x] Views documented: 9 views including UAT (Client)
- [x] Parent Epic #[TBD] created and linked
- [x] Dependencies clear: #1145, #1146
- [x] Test plan: CSV fixture, dry-run, live creation

## Summary

Implement the **Client Delivery Project Template** — a Scrumban + UAT workflow optimized for client projects, migrations, and short-term engagements.

**Template Characteristics**:
- Status: Backlog → **Todo** (committed work) → In progress → In review → In QA → Done
- Focus: Lean workflow, client UAT, minimal ceremony
- Branching: Main-only by default
- Fields: 14 fields; simpler than Product Development
- Automations: 5 core rules
- Views: 9 views (Board for daily stand-ups, UAT view for client testing, Roadmap for planning)

## Acceptance Criteria

### Phase 1: Implementation

- [ ] CSV fixture created (`.github/fixtures/projects-clients-example.csv`)
- [ ] Template config added to `.github/projects.yml`
- [ ] Field initialization logic in `project-creator.agent.js`
- [ ] Field mapping verified (matches issue-fields.yml)
- [ ] Automations implemented (5 rules)
- [ ] Views documented (9 views with setup instructions)

### Phase 2: Testing

- [ ] Unit tests (field init, automations) ≥80% coverage
- [ ] Integration test (dry-run + validation)
- [ ] Live test with example project
- [ ] Regression testing (field-parity, project-meta-sync)

### Phase 3: Documentation

- [ ] Admin runbook (CSV, fields, automations, views)
- [ ] Example CSV fixture
- [ ] JSDoc comments on all functions

## Field Mapping (14 Core Fields)

All values from `.github/issue-fields.yml`:
- Priority: Critical, Important, Normal, Minor ✅
- Type: Bug, Feature, Design, Chore, Automation, Research, Documentation, Integration, Release, Task ✅
- Effort: XS, S, M, L, XL, XXL, XXXL ✅
- Area: Frontend, Backend, Content, A11y, Analytics, Build & CI, DevOps
- Theme: Checkout, Performance, Editor UX, Migration, Configuration, SEO
- Size, Start Date, Deadline, Milestone, Environment, Parent Issue, Sub-issues Progress, Time (hours)

## Automations (5 Rules)

1. Auto-add to Backlog
2. Assignee → Todo
3. PR linked → In review
4. Label `status:needs-qa` → In QA
5. Closed/Merged → Done

## Views (9 Views)

1. Board – Team Flow
2. Backlog – Table
3. QA Gate
4. **UAT (Client)** ⭐
5. Roadmap
6. Blocked
7. Epics (Tracking)
8. Epics – Roadmap
9. Epics – Board (Theme)

## Success Metrics

- ✅ CSV fixture dry-run passes
- ✅ Project creation succeeds (live test)
- ✅ All 14 fields initialized correctly
- ✅ 5 automations tested
- ✅ 9 views documented & creatable
- ✅ Test coverage ≥80%
- ✅ Zero regressions

---

**Parent Epic**: #[TBD]  
**Planning Docs**: See `.github/projects/active/github-projects-creation-system/`

---

**Milestone**: v1.0  
**Assignee**: [TBD]  
**Labels**: `type:feature`, `area:automation`, `area:projects`, `domain:dotgithub-governance`, `priority:important`, `status:ready`  
**Effort**: M (medium — 1–2 weeks)  
**Size**: 5–8 (story points)

**Definition of Done (DoD)**

- [ ] Code merged to develop
- [ ] All tests passing
- [ ] Code review approved (≥2 reviewers)
- [ ] Documentation complete
- [ ] CSV fixture works (dry-run + live)
- [ ] Zero regressions
- [ ] Changelog entry added
```

### Labels

- `type:feature`
- `area:automation`
- `area:projects`
- `domain:dotgithub-governance`
- `priority:important`
- `status:ready`

### Milestone

- v1.0

### Assignee

- [Choose one]

---

## Issue 3: Story B (Product Development)

**Copy This Entire Section (Below) Into GitHub Issue**:

---

### Title

```
Story: Initialize Product Development Project Template with Fields, Automations & Views
```

### Description

```markdown
## Definition of Ready (DoR)

- [x] Template specification provided: `github-projects-product-development.md`
- [x] Field mapping documented: 14 fields (same core as Client Delivery)
- [x] Automations defined: 5 core rules + optional enhancements
- [x] Views documented: 9 views including Release Gate & Tech Debt
- [x] Parent Epic #[TBD] created and linked
- [x] Dependencies clear: #1145, #1146
- [x] Test plan: CSV fixture, dry-run, live creation, release-train scenario

## Summary

Implement the **Product Development Project Template** — a release-train framework optimized for internal products, versioned releases, and multi-team coordination.

**Template Characteristics**:
- Status: Backlog → **Ready** (groomed, not committed) → In progress → In review → In QA → Done
- Focus: Release trains (vX.Y.Z), milestones, planned rollouts
- Branching: develop + release/ branches
- Fields: 14 core fields + optional Iteration (2-week sprints)
- Automations: 5 core rules + future release-aware enhancements
- Views: 9 views (Release Gate for go/no-go, Tech Debt for refactors, Roadmap for forecasting)

## Acceptance Criteria

### Phase 1: Implementation

- [ ] CSV fixture created (`.github/fixtures/projects-internal-example.csv`)
- [ ] Template config added to `.github/projects.yml` (product-development variant)
- [ ] Field initialization logic in `project-creator.agent.js`
- [ ] Field mapping verified (14 fields + optional Iteration)
- [ ] Automations implemented (5 core rules)
- [ ] Views documented (9 views with release-train focus)

### Phase 2: Testing

- [ ] Unit tests (field init, release-train logic) ≥80% coverage
- [ ] Integration test (dry-run + Release Gate view)
- [ ] Release-train scenario test (Milestone filtering, grouping by Type)
- [ ] Live test with example project
- [ ] Regression testing

### Phase 3: Documentation

- [ ] Admin runbook (Product Development variant)
- [ ] Release train guide (monthly cadence, milestones, tags)
- [ ] Example CSV fixture
- [ ] JSDoc comments

## Field Mapping (14 Core + Optional Iteration)

Same as Client Delivery, plus optional Iteration field for sprints.

Differences:
- Status: Ready (not Todo) — groomed but not committed
- Theme: Design System, Performance, Editor UX, Block Theme, Configuration (product-focused)
- Milestone: Release versions (vX.Y.Z) not phases
- Optional: Iteration field (2-week sprints)

## Automations (5 Core + Future Enhancements)

Core (same as Client Delivery):
1. Auto-add to Backlog
2. Assignee → In progress (not Todo; work in progress)
3. PR linked → In review
4. Label `status:needs-qa` → In QA
5. Closed/Merged → Done

Future (not in scope):
- Milestone-aware: "when Milestone=vX.Y.Z AND Iteration=@current → In progress"

## Views (9 Views)

1. **Release Gate – vX.Y.Z** ⭐
2. **Tech Debt** ⭐
3. Roadmap
4. Backlog – Table
5. Epic Drill-down
6. Epics (Tracking) – Table
7. Epics – Roadmap
8. Epics – Board (Milestone)
9. (Optional) Iteration Board

## Success Metrics

- ✅ CSV fixture works
- ✅ Project creation succeeds
- ✅ All 14 fields initialized
- ✅ Release Gate view filters by Milestone correctly
- ✅ Tech Debt view works (filters Refactor/Chore)
- ✅ Test coverage ≥80%
- ✅ Zero regressions

---

**Parent Epic**: #[TBD]  
**Related**: Story #[A] (Client Delivery)  
**Planning Docs**: See `.github/projects/active/github-projects-creation-system/`

---

**Milestone**: v1.0  
**Assignee**: [TBD]  
**Labels**: `type:feature`, `area:automation`, `area:projects`, `domain:dotgithub-governance`, `priority:important`, `status:ready`  
**Effort**: M (medium — 1–2 weeks)  
**Size**: 5–8 (story points)

**Definition of Done (DoD)**

- [ ] Code merged to develop
- [ ] All tests passing (including release-train scenario)
- [ ] Code review approved (≥2 reviewers)
- [ ] Documentation complete
- [ ] CSV fixture works
- [ ] Release Gate view verified
- [ ] Zero regressions
- [ ] Changelog entry added
```

### Labels

- `type:feature`
- `area:automation`
- `area:projects`
- `domain:dotgithub-governance`
- `priority:important`
- `status:ready`

### Milestone

- v1.0

### Assignee

- [Choose one]

---

## How to Create These Issues

1. Create the **Epic** first (Issue 1) — save the issue number
2. Create **Story A** (Issue 2) — link to Epic in "Related issues"
3. Create **Story B** (Issue 3) — link to Epic in "Related issues"
4. Edit the Epic — add a "## Child Stories" section with links to both stories

---

**Ready to Create**: Copy each issue template above into GitHub.com issue creation form.
