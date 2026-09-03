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

### Files to Analyze (150+ total)

#### 1. Scripts (45+ files)
- **Project management scripts** (9 files)
  - `scripts/collect-link-targets.js`
  - `scripts/validate-reports-structure.js`
  - `scripts/workflows/projects/archive-projects.cjs`
  - `scripts/workflows/projects/scan-completion.cjs`
  - `scripts/workflows/orchestrate-phase-progression.cjs`
  - `scripts/automation/project-docs-update.sh`
  - `scripts/automation/test-project-docs-update.sh`
  - `scripts/automation/update-projects-status.cjs`

- **Validation scripts** (8 files)
  - `scripts/validation/validate-labeling-configs.cjs`
  - `scripts/validation/validate-labels-before-creation.cjs`
  - `scripts/validation/validate-issue-fields.cjs`
  - `scripts/validation/validate-links.js`
  - `scripts/validation/validate-pr-template-structure.cjs`
  - `scripts/validation/validate-reports-structure.js`
  - Similar validation utilities

- **Labeling scripts** (8 files)
  - `scripts/automation/update-pr-labels-simple.js`
  - `scripts/automation/sync-pr-labels.js`
  - `scripts/automation/sync-pr-labels-optimized.js`
  - `scripts/automation/review-status-labels.js`
  - `scripts/automation/label-orchestrator.js`
  - `scripts/agents/labeling.agent.js`
  - `scripts/agents/run-labeling-agent.js`

- **Issue management scripts** (8 files)
  - `scripts/automation/add-issue-template-sections.js`
  - `scripts/automation/audit-issue-metadata.js`
  - `scripts/automation/bulk-issue-metadata-updater.js`
  - `scripts/automation/manage-stale-issues.js`
  - `scripts/agents/issues.agent.cjs`
  - `scripts/agents/issues.agent.js`
  - `scripts/agents/issue-remediation-orchestrator.js`
  - `scripts/automation/issue-agent/` (directory)

- **PR automation scripts** (8 files)
  - `scripts/automation/normalize-issue-pr-titles.cjs`
  - `scripts/automation/normalize-issue-pr-titles.js`
  - `scripts/automation/sync-pr-labels.js`
  - Similar PR utilities

- **Agent orchestration scripts** (6+ files)
  - `scripts/agents/planner.agent.cjs`
  - `scripts/agents/planner.agent.js`
  - `scripts/agents/issue-type.agent.js`
  - `scripts/consolidate-issue-types.js`

#### 2. Workflows (25+ files in `.github/workflows/`)

**Issue Management (8 workflows)**
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

**PR Management (5 workflows)**
- `allocate-pr-issue-to-milestone.yml`
- `enforce-pr-issue-linking.yml`
- `pr-template-resolver.yml`
- `pr-template-validation.yml`
- `pr-validation.yml`
- `validate-pr-template.yml`

**Labeling (6 workflows)**
- `labeling.yml`
- `labeling-governance.yml`
- `label-audit-report.yml`
- `meta-labels-sync.yml`
- `validate-issue-labels.yml`
- `issue-labeling-automation.yml`

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

**Days 1-2: Scripts (45+ files)**
- [ ] Create inventory table with all fields above
- [ ] Categorize: Active, Dead, Duplicate, Essential
- [ ] Identify dependencies (what calls what)
- [ ] Flag for detailed analysis

**Days 3-4: Workflows & Agents (45+ files)**
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
- [ ] Org-wide rollout approach
- [ ] Installation process for new repos
- [ ] Monitoring & observability design

**Day 5: Consolidate & Present**
- [ ] Compile audit findings report
- [ ] Create implementation roadmap
- [ ] Prepare for Phase 2 kickoff

---

## Deliverables Checklist

### 1. Audit Findings Report ✅
- [ ] **Inventory Table:** All 150+ files with purpose/status/dependencies
- [ ] **Duplicate Analysis:** Specific findings with consolidation options
- [ ] **Risk Assessment:** What could break if we consolidate
- [ ] **Effort Estimates:** Hours required per consolidation
- [ ] **Priority Ranking:** Which consolidations should happen first

### 2. Agent Design Specifications ✅
- [ ] **Issue Management Agent Spec** (15-20 pages)
  - Decision trees
  - Trigger conditions
  - Actions & side effects
  - Data flows
  - Safety gates

- [ ] **PR Management Agent Spec** (15-20 pages)
  - Decision trees
  - Trigger conditions
  - Actions & side effects
  - Integration with issue agent
  - Safety gates

### 3. Test Plan ✅
- [ ] **Bulk Update Plan**
  - Target: 6 test issues + linked PRs
  - Validation checklist
  - Expected outcomes
  - Success criteria

- [ ] **Test Execution**
  - Run agents against real issues
  - Document decisions made
  - Identify ambiguities
  - Lessons learned

### 4. Documentation Consolidation Plan ✅
- [ ] **Proposed Structure:** New hierarchy
- [ ] **Consolidation Mapping:** Old docs → new locations
- [ ] **Redirect Registry:** URL redirects
- [ ] **Updated TOC:** New documentation index

### 5. Implementation Roadmap ✅
- [ ] **Phase 2 Tasks:** Prioritized with effort estimates
- [ ] **Phase 3 Tasks:** Testing and rollout
- [ ] **Risk Mitigation:** Known blockers and workarounds
- [ ] **Timeline:** Gantt-style schedule with milestones

### 6. Related Files Inventory ✅
- [ ] **Complete inventory** of all 150+ files
- [ ] **Cross-reference map** (which files reference which)
- [ ] **Dependency graph** (visual representation)
- [ ] **Consolidation impact analysis**

---

## Key Metrics to Track

### Scripts & Workflows

- **Total Count:** 70 files
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
- ✅ 150+ files analyzed and categorized
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

- Audit assumes all files are in the develop branch (as of Sep 3, 2026)
- Script dependencies are traced through imports + GitHub Actions workflow calls
- Duplication analysis focuses on logic overlap, not exact code matches
- Consolidation recommendations are preliminary (Phase 2 will refine)
- Test plan uses 6 real closed issues as validation (not artificial test data)

---

*This audit is comprehensive and thorough. Quality over speed. Better to take 3 weeks to understand the system deeply than to miss critical dependencies.*
