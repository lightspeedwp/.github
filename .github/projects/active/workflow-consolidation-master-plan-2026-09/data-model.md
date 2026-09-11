---
file_type: data-model
title: "Workflow Consolidation Data Model"
description: "Entity relationships and validation rules for workflow consolidation refactoring"
---

# Workflow Consolidation Data Model

## Entities

### 1. Workflow

**Definition:** A GitHub Actions workflow file (`.yml`) that automates a specific set of tasks.

**Fields:**
- `name` (string): Workflow filename (e.g., `labeling.yml`)
- `category` (enum): One of [labeling, validation, documentation, issue-management, pr-management, testing, ci-cd, utilities]
- `status` (enum): [active, archived, consolidated]
- `triggered_by` (array): GitHub events that trigger workflow (e.g., `pull_request`, `issues`, `schedule`)
- `dependencies` (array): Other workflows or scripts this depends on
- `features` (array): List of features/capabilities this workflow provides
- `github_actions_minutes_per_run` (number): Estimated minutes consumed per execution
- `scheduled_time` (string, optional): Cron expression if workflow is scheduled

**Relationships:**
- `archived_in_phase` → `Phase`
- `consolidated_into` → `Workflow` (reference to Phase 2 consolidated workflow)
- `related_issues` → `Issue[]`

**Validation Rules:**
- `name` must match pattern: `^[a-z-]+\.yml$`
- `category` must be one of the defined categories
- `features` array must not be empty
- `github_actions_minutes_per_run` must be > 0
- If `scheduled_time` provided, must be valid cron expression

---

### 2. ConsolidatedWorkflow

**Definition:** A unified workflow that combines functionality from multiple original workflows.

**Fields:**
- `name` (string): New workflow filename (e.g., `labeling-unified.yml`)
- `category` (enum): Primary category
- `description` (string): What this unified workflow does
- `merged_from` (array): List of original workflows being consolidated
- `features_combined` (array): Complete list of features from all merged workflows
- `scheduled_time` (string, optional): Cron expression if scheduled
- `status` (enum): [planned, in-progress, complete, tested]
- `phase` (integer): Phase when this consolidated workflow is built

**Relationships:**
- `merges_workflows` → `Workflow[]`
- `requires_scripts` → `Script[]`
- `related_issues` → `Issue[]`

**Validation Rules:**
- `name` must match pattern: `^[a-z-]+-unified\.yml$`
- `merged_from` array must have ≥2 original workflows
- `features_combined` must contain all features from merged workflows
- `phase` must be 2 or later
- Cannot have both `consolidated` status and future `phase`

---

### 3. Phase

**Definition:** A logical grouping of work (backup, build, test).

**Fields:**
- `number` (integer): Phase number (1, 2, or 3)
- `name` (string): Phase title
- `description` (string): What gets done in this phase
- `duration_weeks` (integer): Estimated timeline
- `effort_hours` (number): Estimated effort
- `status` (enum): [planning, in-progress, complete]
- `start_date` (date): When phase starts
- `end_date` (date, optional): When phase completes

**Relationships:**
- `archives_workflows` → `Workflow[]`
- `builds_workflows` → `ConsolidatedWorkflow[]`
- `validates_workflows` → `Workflow[]`
- `has_issues` → `Issue[]`

**Validation Rules:**
- `number` must be 1, 2, or 3
- `duration_weeks` must be > 0
- `effort_hours` must be > 0
- `end_date` (if provided) must be ≥ `start_date`
- Sum of all `effort_hours` across phases must equal total project estimate

---

### 4. WorkflowFeature

**Definition:** A capability or responsibility that a workflow handles.

**Fields:**
- `id` (string): Unique identifier (e.g., `label-auto-apply`, `branch-validate`)
- `name` (string): Feature name
- `description` (string): What this feature does
- `critical` (boolean): Is this a critical feature? (must be preserved)
- `implementations` (array): List of workflows implementing this feature
- `consolidation_approach` (string): How this will be handled in consolidated workflow

**Relationships:**
- `implemented_by` → `Workflow[]`
- `consolidated_in` → `ConsolidatedWorkflow` (Phase 2)

**Validation Rules:**
- `id` must match pattern: `^[a-z-]+$`
- `implementations` array must not be empty
- If `critical: true`, consolidation must preserve behavior exactly
- Each feature must appear in at least one workflow

---

### 5. Issue

**Definition:** GitHub issue tracking work (epic or sub-issue).

**Fields:**
- `number` (integer): GitHub issue number
- `type` (enum): [epic, refactor, task, documentation]
- `title` (string): Issue title
- `description` (string): Issue description
- `status` (enum): [open, in-progress, done, blocked]
- `related_phase` (integer): Which phase this issue is for
- `effort_hours` (number): Estimated effort
- `assigned_to` (string, optional): GitHub username
- `labels` (array): GitHub labels applied

**Relationships:**
- `parent_epic` → `Issue` (if sub-issue)
- `child_issues` → `Issue[]` (if epic)
- `related_workflows` → `Workflow[]`
- `referenced_by` → `PR[]`

**Validation Rules:**
- `number` must be positive integer
- `type` must match GitHub issue types configured
- `labels` must include `type:` prefix matching `type` field
- If `type: epic`, `child_issues` array must not be empty
- `effort_hours` must be > 0
- `status` must be one of defined values

---

### 6. PR

**Definition:** Pull request implementing consolidation changes.

**Fields:**
- `number` (integer): GitHub PR number
- `title` (string): PR title
- `branch` (string): Branch name
- `type` (enum): [refactor, feature, docs]
- `phase` (integer): Which phase this PR implements
- `status` (enum): [draft, ready, review, approved, merged]
- `related_issues` (array): Linked GitHub issues
- `files_changed` (array): Changed files/directories
- `github_actions_minutes_saved` (number): Estimated savings after merge

**Relationships:**
- `implements_phase` → `Phase`
- `closes_issues` → `Issue[]`
- `related_workflows` → `Workflow[]`

**Validation Rules:**
- `number` must be positive integer
- `branch` must match pattern from CLAUDE.md (e.g., `{type}/{scope}-{title}`)
- `type` must be one of [refactor, feature, docs]
- `status: merged` implies `approved` came before it
- `related_issues` must not be empty
- `files_changed` count must match actual PR changes

---

## Relationships & State Transitions

### Workflow Lifecycle

```
[active]
  ↓ (Phase 1)
[archived] ← stored in .github/workflows/archived/{date}/
  ↓ (Phase 2 reference)
[consolidated] ← merged into ConsolidatedWorkflow
  ↓ (Phase 3)
[replaced] ← ConsolidatedWorkflow in production
```

### Phase Progression

```
[Phase 1: Backup & Archive]
  → Archive all 62 non-essential workflows
  → Create consolidation mapping
  → Document archive structure
  → Status: ready for Phase 2

     ↓

[Phase 2: Build Consolidated]
  → Build 14 core workflows
  → Preserve all features
  → Create all config files
  → Status: ready for Phase 3

     ↓

[Phase 3: Testing & Validation]
  → Parallel execution testing
  → Performance benchmarking
  → Team approval
  → Status: production ready
```

### Issue Resolution

```
[Epic opened]
  → Sub-issues created (5 per phase)
  → Issues assigned to team
  → Progress tracked on project board
  
     ↓ (As work completes)
     
[Sub-issues closed]
  → Phase deliverables finalized
  → Next phase issues created
  → Timeline updated if needed

     ↓ (After Phase 3)

[Epic closed]
  → Consolidation complete
  → All workflows tested & approved
  → Documentation finalized
```

---

## Validation Rules (Global)

### Consolidation Constraints
1. **Feature Preservation:** Every feature from archived workflows must be present in consolidated workflow
2. **No Breaking Changes:** All automated tasks must work identically in consolidated workflow
3. **Backward Compatibility:** No changes to workflow triggers or expected outputs
4. **Performance:** Consolidated workflow execution time ≤ 110% of original parallel execution
5. **Scheduling:** No scheduled job collisions (stagger by 30 minutes)

### Archive Requirements
1. **Completeness:** All 62 workflows must be archived
2. **Organization:** Workflows organized by category in subdirectories
3. **Documentation:** Archive manifest & restore procedures complete
4. **Mapping:** Consolidation mapping covers all 76 workflows (62 archived + 14 kept)
5. **History:** All git history preserved; no data loss

### Phase Completion Criteria
1. **Phase 1:** Archive complete, mapping documented, GitHub issues created
2. **Phase 2:** 14 consolidated workflows built, features tested, CI passing
3. **Phase 3:** Parallel testing validates all features, performance benchmarks acceptable

---

## Data Integrity Rules

### Must Be True At All Times
- Total workflows (archived + active) = 76
- Sum of archived workflow phases = 62
- Each workflow belongs to exactly one category
- Each consolidated workflow references ≥2 archived workflows
- No circular consolidation dependencies
- All scheduled workflows have unique cron times

### Transition Rules
- Workflow can only transition from `active` → `archived` during Phase 1
- Workflow can only transition from `archived` → `consolidated` during Phase 2
- Phase status can only move forward: planning → in-progress → complete
- PR status must follow: draft → ready → review → approved → merged

---

## Query Examples

**Q1: Find all features that need consolidation in Phase 2**
```
ConsolidatedWorkflow where phase == 2
  → merged_from.features_combined
```

**Q2: Find workflows that will break Phase 2 if not archived properly**
```
Workflow where critical == true and status == "active"
  → must be in ConsolidatedWorkflow
```

**Q3: Verify no scheduled job collisions**
```
Workflow where triggered_by contains "schedule"
  → all have unique scheduled_time values
```

**Q4: Calculate total GitHub Actions minutes savings**
```
sum(Workflow.github_actions_minutes_per_run)
  - sum(ConsolidatedWorkflow.estimated_minutes_per_run)
  ÷ sum(Workflow.github_actions_minutes_per_run)
  = % savings
```

---

**Data Model Version:** 1.0  
**Last Updated:** Sep 11, 2026  
**Related:** WORKFLOW_CONSOLIDATION_MASTER_PLAN.md, PHASE_1_IMPLEMENTATION_PLAN.md
