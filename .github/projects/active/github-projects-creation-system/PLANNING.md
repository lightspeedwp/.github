---
file_type: "planning"
title: ""GitHub Projects Creation System — Full Implementation Plan""
description: ""Complete architectural blueprint for CSV-fixture-driven project creation with template-based field initialization.""
created_date: "2026-07-23"
last_updated: "2026-08-25"
status: active
tags: ["projects", "architecture", "github-api", "workflow", "automation"]
---

[Full content from github-projects-creation-plan.md - see scratchpad version for complete details]

# GitHub Projects Creation & Initialization System

## Comprehensive Implementation Plan

**Epic**: GitHub Projects — Bulk Creation & Template-Driven Initialization
**Status**: Planning Phase
**Milestone**: v1.0
**Created**: 2026-07-23

---

## Table of Contents

1. Overview & Scope
2. Field Mapping Strategy
3. CSV Fixture Format
4. Architecture: Agent & Workflow
5. PR Field Syncing
6. Configuration & Field Management
7. Implementation Roadmap
8. Detailed Issues & Acceptance Criteria
9. Risks & Mitigations
10. Acceptance Criteria

---

## 1. Overview & Scope

This initiative creates a **template-driven project creation system** that:

- Reads CSV fixtures defining new projects
- Creates GitHub Projects v2 with the correct template type
- Initializes all fields, automations, and views based on template
- Syncs PR metadata to projects using branch prefix → Type field mapping
- Extends existing `project-meta-sync` infrastructure to handle new projects

**Key Outcome**: Teams can bulk-create projects (Client Delivery or Product Development) with one CSV file + one workflow run.

### Why This Matters

**Current Pain Points**:

- Creating projects is manual and error-prone (~30 minutes per project)
- Field initialization is incomplete (no automations, no views)
- Each team invents their own structure
- No parity between Client Delivery and Product Development templates

**What This Solves**:

- ✅ Declarative, version-controlled project specs (CSV fixtures)
- ✅ Bulk creation (multiple projects in one workflow run)
- ✅ Complete initialization (all fields, automations, views configured)
- ✅ Two distinct, battle-tested templates (Client Delivery + Product Development)
- ✅ Single source of truth for field mapping (issue-fields.yml)
- ✅ PR→Project sync via branch prefix (no extra labeling needed)

---

## 2. Field Mapping: Issues → Projects → Templates

### 2.1 Canonical Field Set (Source of Truth)

From `.github/issue-fields.yml`:

| Field | Type | Values | Applies To | Notes |
|-------|------|--------|-----------|-------|
| **Priority** | single_select | Critical, Important, Normal, Minor | All issues | Org-level field; synced to projects |
| **Type** | single_select | Bug, Feature, Design, Chore, Automation, Research, Documentation, Integration, Release, Task | All issues | Derived from type:* labels; maps Issue Type → Project field |
| **Effort** | single_select | XS, S, M, L, XL, XXL, XXXL | All issues | Org-level field; synced to projects |
| **Start date** | date | YYYY-MM-DD | All issues | Populated when status:ready or in-progress |
| **Target date** | date | YYYY-MM-DD | All issues | Populated when milestone due_on set |
| **Domain** | single_select | [5 options] | Governance, Product, etc. | Custom org field |
| **Delivery Track** | single_select | Governance, Product, Infrastructure, Release, Support | All issues | Custom org field |
| **Team** | single_select | Core, AI Ops, Theme, Plugin, QA | All issues | Custom org field |
| **Risk** | single_select | Low, Medium, High | Complex issues | Custom org field |
| **Customer Impact** | single_select | Low, Medium, High | External-facing | Custom org field |
| **Technical Impact** | single_select | Low, Medium, High | System-wide | Custom org field |

### 2.2 Project Template Field Differences

**SHARED ACROSS BOTH TEMPLATES** (14 core):

- Status (different column names, same lifecycle concepts)
- Priority → Critical/Important/Normal/Minor
- Type → Bug, Feature, Design, Chore, Automation, Research, Documentation, Integration, Release, Task
- Effort → XS–XXXL
- Area → Frontend, Backend, Build & CI, DevOps, Design, Analytics, A11y
- Theme → Product-specific
- Size → Story points
- Start Date, Deadline, Milestone, Environment, Parent Issue, Sub-issues Progress, Time (hours)

**CLIENT DELIVERY TEMPLATE SPECIFIC**:

- Status columns: Backlog, **Todo** (not Ready), In progress, In review, In QA, Done
- Theme examples: Checkout, Performance, Editor UX, Migration, Configuration, SEO
- Simpler automation (main-only branching, UAT focus)
- UAT view for client testing

**PRODUCT DEVELOPMENT TEMPLATE SPECIFIC**:

- Status columns: Backlog, **Ready**, In progress, In review, In QA, Done
- Milestone field anchors to release trains (vX.Y.Z)
- Iteration field (optional, for sprint planning)
- Complex automations (release/develop branching, milestone-aware rules)
- Epic drill-down, Release Gate, Tech Debt views

### 2.3 Label → Project Field Mapping

Existing in `derive-project-fields.cjs`:

```javascript
const BRANCH_PREFIX_TYPE_MAP = {
  "feat/": "Feature",
  "fix/": "Bug",
  "hotfix/": "Bug",
  "docs/": "Documentation",
  "test/": "Automation",
  "perf/": "Task",
  "refactor/": "Chore",
  "chore/": "Chore",
  "ci/": "Automation",
  "deps/": "Integration",
  "build/": "Automation",
  "security/": "Task",
  "a11y/": "Design",
};
```

**PR Type Field Population** (NEW):

- PR has no Issue Type field, but branch prefix → Type field mapping exists
- When PR opens: extract head.ref prefix → derive Type
- Apply Type field to PR in project
- Example: `feat/product-grid-quick-add` → Type: Feature

---

## 3. CSV Fixture Format

### 3.1 Schema

**File Location**: `.github/fixtures/projects.csv` (or multiple per org/domain)

**Columns**:

```csv
name,type,description,repository,team,domain,milestone,owner_login,automation_enabled,views_config
"Product – Design System",product-development,"Tokens, components, design system work",lightspeedwp/.github,Core,Dotgithub Governance,"v1.0",ashleyshaw,true,default
"Client – Acme Corp Redesign",client-delivery,"Homepage redesign + cart optimization",lightspeedwp/acme-theme,Theme,WordPress Block Theme,"Phase-1 UAT",ashleyshaw,true,default
```

**Field Definitions**:

- `name` — Project name (will be title)
- `type` — Template type: `client-delivery` or `product-development`
- `description` — One-liner; optional link to brief/roadmap
- `repository` — org/repo for auto-linking issues
- `team` — From Team field options; default: AI Ops
- `domain` — From Domain field options; default: Dotgithub Governance
- `milestone` — Anchor milestone or phase name
- `owner_login` — GitHub login for default assignee
- `automation_enabled` — true/false; enable project automations
- `views_config` — Preset: `default`, `minimal`, `custom` (future: reference external YAML)

### 3.2 Example CSVs

**Internal Projects** (`.github/fixtures/projects-internal.csv`):

```
name,type,description,repository,team,domain,milestone,owner_login,automation_enabled
"Product – LSX Design System",product-development,"Tokens, typography, spacing; release train v2.0.",lightspeedwp/.github,Core,Dotgithub Governance,v2.0,ashleyshaw,true
"Product – Tour Operator Plugin",product-development,"Booking flow, calendar UX; release train v1.4.",lightspeedwp/tour-operator,Plugin,WordPress Block Plugin,v1.4,ashleyshaw,true
```

**Client Projects** (`.github/fixtures/projects-clients.csv`):

```
name,type,description,repository,team,domain,milestone,owner_login,automation_enabled
"Client – Acme Corp",client-delivery,"E-commerce site redesign + migration; UAT scheduled for Q3.",lightspeedwp/acme-theme,Theme,WordPress Block Theme,"Phase-1 UAT",ashleyshaw,true
"Client – Novus Media",client-delivery,"Conversion optimization & performance hardening.",lightspeedwp/novus-media,Core,Platform/CI,"Go-Live",ashleyshaw,true
```

---

## 4. Architecture: New Agent & Workflow

### 4.1 New Agent: `project-creator.agent.js`

**Location**: `scripts/agents/project-creator.agent.js`  
**Pair**: `.github/agents/project-creator.agent.md`

**Responsibilities**:

1. Parse CSV
2. Validate fields
3. Create project (GraphQL)
4. Initialize fields (based on template type)
5. Wire automations
6. Generate view config
7. Report results

**Input**:

- CSV fixture file path
- GitHub token
- Organization name

**Output**:

```json
{
  "success": true,
  "created": [
    {
      "name": "Product – Design System",
      "url": "https://github.com/orgs/lightspeedwp/projects/42",
      "id": "PVT_...",
      "fields": ["Status", "Priority", "Type", "Effort", "Area", "Theme", "..."],
      "automations": ["auto-add", "on-assignee", "on-pr-linked", "on-closed", "on-qa-label"],
      "views": ["Release Gate", "Epic Drill-down", "Tech Debt", "Roadmap", "Backlog"]
    }
  ],
  "errors": []
}
```

### 4.2 New Workflow: `projects-bulk-create.yml`

**Location**: `.github/workflows/projects-bulk-create.yml`  
**Trigger**: Manual dispatch (workflow_dispatch) or scheduled

**Steps**:

1. Checkout repo
2. Set up Node.js
3. Create GitHub App token
4. Run project-creator agent
5. Post summary
6. Create issues for post-creation tasks

**Permissions**: `contents: read`, `organization_projects: write`, `pull_request: write`

**Dispatch Inputs**:

- `fixture_file` — CSV file path (default: `.github/fixtures/projects.csv`)
- `organization` — Org name (default: `lightspeedwp`)
- `dry_run` — true/false; validate without creating (default: false)

---

## 5. PR Field Syncing: Branch Prefix → Type Field

### 5.1 Current State

`project-meta-sync.yml` already reads PR branch prefix via `github.event.pull_request.head.ref` and could derive Type.

**What's missing**: Extract Type from branch prefix for PRs that have no labels.

### 5.2 Changes to `derive-project-fields.cjs`

**Enhancement**:

- When `eventName === "pull_request"` AND no Type label present
- Extract head ref prefix → look up in BRANCH_PREFIX_TYPE_MAP
- Return mapped type (e.g., "Feature")
- Allows PRs to populate Type field without explicit labels

**Code change** (minimal):

```javascript
// In derivePRType(): if no label-based type, check branch prefix
if (!typeFromLabel && prHeadRef) {
  const prefix = extractPrefix(prHeadRef);
  if (BRANCH_PREFIX_TYPE_MAP[prefix]) {
    return BRANCH_PREFIX_TYPE_MAP[prefix];
  }
}
```

### 5.3 Test Coverage

Add test case to field-parity.test.js:

- "PR from feat/ branch with no labels derives Type: Feature"
- "PR from fix/ branch derives Type: Bug"
- "PR from refactor/ branch derives Type: Chore"

---

## 6. Configuration & Field ID Management

### 6.1 Field ID Discovery

From docs/AUTOMATION.md and issue #1145:

To initialize org issue fields, need field IDs (org-specific):

```graphql
query {
  organization(login: "lightspeedwp") {
    customFields(first: 20) {
      nodes {
        id       # PVTF_... ID
        name
      }
    }
  }
}
```

**Org admin workflow** (pre-setup):

1. Run query above
2. Map field names to IDs
3. Save to `.github/issue-field-ids.yml`
4. Agent references this at runtime

### 6.2 Template Type → Field Set Mapping

**Config file**: `.github/projects.yml`

```yaml
templates:
  client-delivery:
    status_options:
      - Backlog
      - Todo
      - In progress
      - In review
      - In QA
      - Done
    required_fields:
      - Status
      - Priority
      - Type
      - Effort
      - Area
      - Theme
      - Size
      - Start Date
      - Deadline
      - Milestone
      - Environment
      - Parent Issue
      - Sub-issues Progress
    optional_fields:
      - Time (hours)
    automations:
      - auto_add_to_backlog
      - assignee_to_in_progress
      - pr_linked_to_in_review
      - label_qa_to_in_qa
      - closed_to_done
    views:
      - Board – Team Flow
      - Backlog – Table
      - QA Gate
      - UAT (Client)
      - Roadmap
      - Blocked
      - Epics (Tracking)
      - Epics – Roadmap
      - Epics – Board (Theme)

  product-development:
    status_options:
      - Backlog
      - Ready
      - In progress
      - In review
      - In QA
      - Done
    # ... same structure, different values for status_options, views, etc.
```

---

## 7. Implementation Roadmap

### Phase 1: Foundations (2–3 weeks)

- ✅ Design CSV fixture format & schema
- [ ] Implement project-creator.agent.js
- [ ] Create `.github/projects.yml` template config
- [ ] Build projects-bulk-create.yml workflow

### Phase 2: Client Delivery Template (1–2 weeks)

- [ ] Initialize fields, automations, views
- [ ] Tests: unit, integration, live
- [ ] Admin runbook + example CSV

### Phase 3: Product Development Template (1–2 weeks, parallel)

- [ ] Initialize fields, automations, views
- [ ] Release train scenario test
- [ ] Admin runbook + example CSV

### Phase 4: PR Field Syncing (1 week, can overlap)

- [ ] Enhance derive-project-fields.cjs
- [ ] Add regression tests
- [ ] Comprehensive docs

---

## 8. Detailed Issues & Acceptance Criteria

### Issue Template: Epic

**Type**: Epic  
**Milestone**: v1.0  
**Labels**: `type:epic`, `area:automation`, `area:projects`, `priority:important`

### Issue Template: Story/Task

**Type**: Feature or Task  
**Milestone**: v1.0  
**Labels**: `type:feature`, `area:automation`, `area:projects`, `priority:important`

---

## 9. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| GraphQL API limits | Blocked | Batch mutations; use app token for higher rate limit |
| Field IDs not discoverable | High | Document discovery query; provide script |
| Automations partially manual | Medium | Document manual checklist |
| CSV schema drift | Medium | Version schema; validate strictly |
| Template parity | Medium | Single `.github/projects.yml` source of truth |

---

## 10. Acceptance Criteria (For All Issues)

- [ ] Code follows LightSpeedWP standards (UK English, JSDoc, testing)
- [ ] Test coverage ≥80% for all new utilities
- [ ] Documentation added to AUTOMATION.md or new guide
- [ ] CSV fixture examples provided in `.github/fixtures/`
- [ ] No hardcoded values; all config in YAML/CSV
- [ ] Graceful error handling; actionable error messages
- [ ] Dry-run mode supported

---

**Document Status**: ✅ Ready for Implementation  
**Next Step**: Create GitHub Epic + Stories; start Phase 1
