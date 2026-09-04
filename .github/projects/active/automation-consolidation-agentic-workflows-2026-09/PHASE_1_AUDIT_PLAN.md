---
file_type: documentation
title: "Phase 1: Comprehensive Audit & Planning"
description: "Detailed approach to auditing project management scripts, workflows, and agents"
status: active
version: "1.0.0"
---

# Phase 1: Comprehensive Audit & Planning

**Duration:** 2-3 weeks (Sep 3-21, 2026)  
**Effort:** 40-50 hours  
**Deliverables:** 6 comprehensive reports + design specs + test plan

---

## Audit Scope

### Canonical Script and Workflow Inventory (57 unique files)

Count only explicitly named file paths, once per repository-relative path. Directory placeholders and phrases such as "similar utilities" are excluded. When a file serves multiple categories, its first category below owns the count and later categories show it as a cross-reference. This produces one canonical inventory of 34 scripts and 23 workflows.

**Summary Table:**
| Category | Count | Notes |
|----------|-------|-------|
| Scripts | 34 | Unique named paths across project management, validation, labeling, issue, PR, and orchestration |
| Workflows | 23 | 13 issue + 6 PR + 4 additional labeling workflows |
| **Canonical total** | **57** | Deduplicated scripts and workflows used for scope and success criteria |

Agent definitions, configuration, templates, and documentation remain additional audit scope, but their estimates are tracked separately and are not included in this canonical total.

#### 1. Scripts (34 unique files)
- **Project management scripts** (9 files)
  - `scripts/collect-link-targets.js`
  - `scripts/validate-reports-structure.js`
  - `scripts/workflows/projects/archive-projects.cjs`
  - `scripts/workflows/projects/scan-completion.cjs`
  - `scripts/workflows/orchestrate-phase-progression.cjs`
  - `scripts/automation/project-docs-update.sh`
  - `scripts/automation/test-project-docs-update.sh`
  - `scripts/automation/update-projects-status.cjs`
  - `scripts/consolidate-issue-types.js`

- **Validation scripts** (6 files)
  - `scripts/validation/validate-labeling-configs.cjs`
  - `scripts/validation/validate-labels-before-creation.cjs`
  - `scripts/validation/validate-issue-fields.cjs`
  - `scripts/validation/validate-links.js`
  - `scripts/validation/validate-pr-template-structure.cjs`
  - `scripts/validation/validate-reports-structure.js`

- **Labeling scripts** (7 files)
  - `scripts/automation/update-pr-labels-simple.js`
  - `scripts/automation/sync-pr-labels.js`
  - `scripts/automation/sync-pr-labels-optimized.js`
  - `scripts/automation/review-status-labels.js`
  - `scripts/automation/label-orchestrator.js`
  - `scripts/agents/labeling.agent.js`
  - `scripts/agents/run-labeling-agent.js`

- **Issue management scripts** (7 files)
  - `scripts/automation/add-issue-template-sections.js`
  - `scripts/automation/audit-issue-metadata.js`
  - `scripts/automation/bulk-issue-metadata-updater.js`
  - `scripts/automation/manage-stale-issues.js`
  - `scripts/agents/issues.agent.cjs`
  - `scripts/agents/issues.agent.js`
  - `scripts/agents/issue-remediation-orchestrator.js`
  - `scripts/automation/issue-agent/` is a directory and is excluded from the file count

- **PR automation scripts** (2 unique files)
  - `scripts/automation/normalize-issue-pr-titles.cjs`
  - `scripts/automation/normalize-issue-pr-titles.js`
  - Cross-reference: `scripts/automation/sync-pr-labels.js` is counted under labeling scripts

- **Agent orchestration scripts** (3 files)
  - `scripts/agents/planner.agent.cjs`
  - `scripts/agents/planner.agent.js`
  - `scripts/agents/issue-type.agent.js`

#### 2. Workflows (23 unique files in `.github/workflows/`)

**Issue Management (13 workflows)**
- `issue-create-enhanced.yml`
- `issue-create-from-template.yml`
- `issue-fields-backfill.yml`
- `issue-health-audit.yml`
- `issue-labeling-automation.yml`
- `issue-management-orchestration.yml`
- `issue-project-field-sync.yml`
- `issue-remediation-automation.yml`
- `issue-remediation-bulk.yml`
- `issues.yml`
- `validate-blocking-issue-before-close.yml`
- `validate-issue-dod-before-close.yml`
- `validate-issue-labels.yml`

**PR Management (6 workflows)**
- `allocate-pr-issue-to-milestone.yml`
- `enforce-pr-issue-linking.yml`
- `pr-template-resolver.yml`
- `pr-template-validation.yml`
- `pr-validation.yml`
- `validate-pr-template.yml`

**Labeling (4 additional unique workflows)**
- `labeling.yml`
- `labeling-governance.yml`
- `label-audit-report.yml`
- `meta-labels-sync.yml`
- Cross-references: `validate-issue-labels.yml` and `issue-labeling-automation.yml` are counted under Issue Management

#### 3. Agent Definitions (20+ files)

**In `.github/agents/`**
- `task-planner.agent.md`
- `task-researcher.agent.md`
- `mode-prd.agent.md`
- `mode-document-reviewer.agent.md`
- `mode-demonstrate-understanding.agent.md`
- `mode-thinking.agent.md`
- `labeling.agent.md`
- `issues.agent.md`

**In `agents/` (portable)**
- `mode-prd.agent.md`
- `mode-thinking.agent.md`
- `task-researcher.agent.md`
- `task-planner.agent.md`
- `labeling.agent.md`
- `issues.agent.md`
- `pr-creation.agent.md`
- `task-researcher-agent/` (directory)
- `task-planner-agent/` (directory)

**In `scripts/agents/`**
- `planner.agent.cjs`
- `planner.agent.js`
- `labeling.agent.js`
- `issues.agent.cjs`
- `issues.agent.js`
- `issue-type.agent.js`

#### 4. Configuration Files (5 files)

- `.github/labels.yml` (158 canonical labels)
- `.github/labeler.yml` (label automation rules)
- `.github/label-governance-policy.yml` (governance rules)
- `.github/issue-types.yml` (issue type definitions)
- `.github/issue-fields.yml` (issue custom fields)

#### 5. Issue Templates (25+ files in `.github/ISSUE_TEMPLATE/`)

- All `.md` template files
- **Note:** Audit found 2 templates wrongly prefixed with `25-`

#### 6. Documentation (30+ files)

**Issue Management Docs (9 files)**
- `docs/ISSUE_LABELS.md` (duplicate info with labels.yml)
- `docs/ISSUE_TYPES.md`
- `docs/ISSUE_TRIAGE_LABELING.md`
- `docs/ISSUE_TRIAGE_AUTOMATION.md`
- `docs/ISSUE_TRIAGE.md`
- `docs/ISSUE_MAINTENANCE_SCRIPTS.md`
- `docs/ISSUE_CREATION_GUIDE.md`
- `docs/ISSUE-TRIAGE-GUIDE.md`

**PR Management Docs (3 files)**
- `docs/PR_LABELS.md`
- `docs/PR_CREATION_PROCESS.md`
- `docs/PR_TEMPLATE_VALIDATION.md`

**Labeling Docs (10 files)**
- `docs/LABELING.md`
- `docs/LABELING_EXAMPLES.md`
- `docs/LABELING_FAQ.md`
- `docs/LABELING_GOVERNANCE.md`
- `docs/LABEL_COLOR_STRATEGY.md`
- `docs/LABEL_INVENTORY.md`
- `docs/LABEL_MANAGEMENT_CLI.md`
- `docs/LABEL_STRATEGY.md`
- `docs/ISSUE_TRIAGE_LABELING.md`
- `docs/ISSUE_LABELS.md`

**Automation Docs (3 files)**
- `docs/AUTOMATION.md`
- `docs/AUTOMATION_GOVERNANCE.md`

**Instruction Files (6 files)**
- `.github/instructions/automation.instructions.md`
- `instructions/automation.instructions.md`
- `instructions/pr-automation-review.instructions.md`
- `instructions/labeling.instructions.md`
- `instructions/issue-templates.instructions.md`
- `instructions/issues.instructions.md`
- `instructions/pr-templates.instructions.md`

---

## Audit Questions to Answer

### For Each Script/Workflow

1. **Purpose:** What does it do? (1-line summary)
2. **Status:** Active, dead, duplicate, or overlapping?
3. **Dependencies:** What does it call? What calls it?
4. **Duplicates:** Are there similar scripts with overlapping logic?
5. **Last Update:** When was it last modified?
6. **Error Handling:** What happens if it fails?
7. **Testing:** Are there tests? Are they passing?
8. **Documentation:** Is it documented? Where?

### For Script/Workflow Duplication

1. **Overlap Analysis:**
   - Which scripts/workflows do the same thing?
   - Why do they exist separately?
   - What are the differences?

2. **Consolidation Recommendations:**
   - Can they be merged? How?
   - What would break if we merged them?
   - What refactoring is needed?
   - Estimated effort to consolidate?

3. **Dependency Impact:**
   - What would need to change if we consolidated?
   - Are there consumers that depend on the old structure?
   - What's the migration path?

### For Documentation Duplication

1. **Content Overlap:**
   - Which docs cover the same content?
   - Is the information consistent?
   - Which is the source of truth?

2. **Consolidation Plan:**
   - Should we merge docs? Which ones?
   - What's the canonical hierarchy?
   - How do we redirect old URLs?

3. **Missing Documentation:**
   - Are there scripts/workflows with no docs?
   - Are there gaps in coverage?

### For Agent Organization

1. **Location Inventory:**
   - Where are agents defined? (3+ locations?)
   - Which is canonical?
   - When/why did they move?

2. **Consolidation Approach:**
   - Should we consolidate locations?
   - How do we avoid breaking references?
   - Migration strategy?

---

## Audit Methodology

### Week 1: File Inventory & Classification

**Days 1-2: Scripts (34 unique files)**
- [ ] Create inventory table with all fields above
- [ ] Categorize: Active, Dead, Duplicate, Essential
- [ ] Identify dependencies (what calls what)
- [ ] Flag for detailed analysis

**Days 3-4: Workflows (23 unique files) & Agents (separately tracked)**
- [ ] Inventory all workflows with purpose/status/dependencies
- [ ] Inventory all agent definitions (multiple locations)
- [ ] Cross-reference agents with scripts
- [ ] Identify duplication patterns

**Day 5: Configuration & Templates (30 files)**
- [ ] Catalog configuration files (labels.yml, issue-types.yml, etc.)
- [ ] Inventory all issue templates
- [ ] Check for malformed templates (the `25-` prefix issue)
- [ ] Note dependencies on these files

### Week 2: Duplication Analysis & Design

**Days 1-2: Script Consolidation Opportunities**
- [ ] Group duplicate scripts by function
- [ ] Analyze differences and overlaps
- [ ] Create consolidation options (merge, keep both, archive)
- [ ] Estimate effort for each approach

**Days 3-4: Documentation Audit**
- [ ] Create content map (which docs cover what)
- [ ] Identify overlapping sections
- [ ] Design canonical hierarchy
- [ ] Create consolidation plan with mappings

**Day 5: Agent Design Review**
- [ ] Map all agent definitions
- [ ] Identify canonical versions
- [ ] Design consolidation approach
- [ ] Plan migration strategy

### Week 3: Design & Planning

**Days 1-2: Agentic Workflow Specification**
- [ ] Issue Management Agent design
- [ ] PR Management Agent design
- [ ] Decision trees and triggers
- [ ] Safety gates and approval flows

**Days 3-4: Test Plan & Rollout Strategy**
- [ ] Plan bulk update testing (6 issues + PRs)
- [ ] Run the workflow regression matrix from `scripts/automation/__tests__/integration/workflows.integration.test.js`:

  | Validation target | Expected behaviour |
  |-------------------|--------------------|
  | Six-issue bulk update | Each fixture matches its predeclared labels, milestone, reviewers, and blocked/not-blocked decision; no write occurs until expectations are complete |
  | `meta-labels-sync.yml` | Identifies linked-PR issues missing `meta:has-pr`, applies `meta:has-pr`, marks issues stale after 30+ inactive days with `meta:stale`, preserves manual labels, records label changes, handles concurrent runs without conflicts, respects branch protection, and completes the test fixture within 5 seconds |
  | `label-audit-report.yml` | Reports accurate total, labelled, stale, and coverage metrics, completes the test fixture within 5 seconds, and emits parseable JSON plus CSV with the expected headers and issue rows |
- [ ] Org-wide rollout approach
- [ ] Installation process for new repos
- [ ] Monitoring & observability design

**Day 5: Consolidate & Present**
- [ ] Compile audit findings report
- [ ] Create implementation roadmap
- [ ] Prepare for Phase 2 kickoff

---

## Deliverables Checklist

### 1. Audit Findings Report 📋
- [x] **Inventory Table:** All 57 canonical scripts and workflows with purpose/status
- [ ] **Duplicate Analysis:** Specific findings with consolidation options (Phase 2)
- [ ] **Risk Assessment:** What could break if we consolidate (Phase 2)
- [ ] **Effort Estimates:** Hours required per consolidation (Phase 2)
- [ ] **Priority Ranking:** Which consolidations should happen first (Phase 2)

### 2. Agent Design Specifications ✅
- [x] **Issue Management Agent Spec** (15+ pages complete)
  - [x] Decision trees
  - [x] Trigger conditions
  - [x] Actions & side effects
  - [x] Data flows
  - [x] Safety gates

- [x] **PR Management Agent Spec** (15+ pages complete)
  - [x] Decision trees
  - [x] Trigger conditions
  - [x] Actions & side effects
  - [x] Integration with issue agent
  - [x] Safety gates

### 3. Test Plan ✅
- [x] **Bulk Update Plan**
  - [x] Target: 6 test issues + linked PRs
  - [x] Validation checklist
  - [x] Expected outcomes
  - [x] Success criteria

- ⏳ **Test Execution** (Phase 3)
  - [ ] Run agents against real issues
  - [ ] Document decisions made
  - [ ] Identify ambiguities
  - [ ] Lessons learned

### 4. Documentation Consolidation Plan 📋
- [ ] **Proposed Structure:** New hierarchy (Phase 2)
- [ ] **Consolidation Mapping:** Old docs → new locations (Phase 2)
- [ ] **Redirect Registry:** URL redirects (Phase 2)
- [ ] **Updated TOC:** New documentation index (Phase 2)

### 5. Implementation Roadmap 📋
- [ ] **Phase 2 Tasks:** Prioritized with effort estimates (Phase 2 planning)
- [ ] **Phase 3 Tasks:** Testing and rollout (Phase 3 planning)
- [ ] **Risk Mitigation:** Known blockers and workarounds (Phase 2)
- [ ] **Timeline:** Gantt-style schedule with milestones (Phase 2)

### 6. Related Files Inventory 📋
- [x] **Complete inventory:** All 57 canonical scripts and workflows catalogued
- [ ] **Cross-reference map** (which files reference which) — Phase 2
- [ ] **Dependency graph** (visual representation) — Phase 2
- [ ] **Consolidation impact analysis** — Phase 2

---

## Key Metrics to Track

### Scripts & Workflows

- **Total Count:** 57 unique files (34 scripts + 23 workflows)
- **Active:** ? (TBD in audit)
- **Dead/Unused:** ? (TBD in audit)
- **Duplicates:** 15-20 estimated
- **Code Duplication:** ~500-1000 lines
- **Lines of Code:** ? (TBD)
- **Test Coverage:** ? (TBD)

### Documentation

- **Total Docs:** 30+ files
- **Overlapping Content:** 20+ docs
- **Unique Content:** ?
- **Consolidation Opportunity:** 40-50% reduction

### Agents

- **Total Definitions:** 20+ files
- **Canonical Versions:** 1+ per agent
- **Duplicate Definitions:** 3+ locations per agent
- **Consolidation Opportunity:** Reduce to 1 location per agent

---

## Success Criteria (Phase 1)

**Quantitative:**
- ✅ 57 unique scripts and workflows analysed and categorised
- ✅ All duplicate files identified with consolidation plan
- ✅ All documentation assessed for consolidation
- ✅ 6 test issues + linked PRs fully documented
- ✅ Agent design specs 80%+ complete

**Qualitative:**
- ✅ Clear understanding of current automation landscape
- ✅ Consensus on which consolidations to prioritize
- ✅ Confidence in agentic workflow approach
- ✅ Team ready for Phase 2 execution

---

## Notes & Assumptions

**Audit Scope & Methodology:**
- Audit baseline: develop branch as of Sep 3, 2026
- Files analysed: 57 unique scripts and workflows; agents, configuration, templates, and documentation are tracked separately
- Categorization: By function (project mgmt, validation, labeling, issues, PRs)
- Duplication analysis: Focuses on logic overlap, not exact code matches

**Dependency Tracing (Complete):**
- **Code-level:** Node.js `require()` / `import` statements
- **Workflow-level:** GitHub Actions `uses:` and referenced scripts
- **Config reads:** Files loaded via `.yml` / `.json` references (labels.yml, issue-types.yml, etc.)
- **Agent references:** Agent files invoked by workflows or scripts
- **Cross-file invocations:** Script-to-script calls and orchestration
- **External APIs:** GitHub API calls, artifact servers, rate limiting

**Consolidation Strategy:**
- Recommendations are preliminary (Phase 2 will refine with detailed impact analysis)
- Focus on logic consolidation, not just file reduction
- Preserve backwards compatibility where possible via wrappers/redirects
- Test plan uses 6 real closed issues as validation (not artificial test data)

**Phase Boundaries:**
- Phase 1: Analysis, specifications, test plan (this document)
- Phase 2: Detailed implementation planning, duplicate analysis, risk assessment
- Phase 3: Execution, bulk testing, rollout

---

*This audit is comprehensive and thorough. Quality over speed. Better to take 3 weeks to understand the system deeply than to miss critical dependencies.*
