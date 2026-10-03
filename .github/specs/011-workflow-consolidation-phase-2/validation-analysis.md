---
title: "Phase 4 Analysis — Archived Validation Workflows"
date_created: "2026-09-17"
last_updated: "2026-09-17"
feature: "Workflow Consolidation Phase 2 — US2 validation-unified.yml"
---

# Archived Validation Workflows Analysis (US2)

## Overview

This analysis examines the 11 archived validation workflows that will be consolidated into **validation-unified.yml**. The analysis identifies trigger patterns, job structures, composite action opportunities, and dependencies to inform unified workflow design.

**Consolidation Scope:** 11 archived validation workflows → 1 unified validation workflow

**Key Metrics:**

- Baseline: 180 min/month
- Target: ≤150 min/month (16.7% reduction)
- Expected savings: ~30 min/month

---

## Archived Validation Workflow Inventory

### 1. **branch-name-validation.yml** — Branch Naming Enforcement

- **Status:** Reactive validation on PR events
- **Triggers:**
  - `pull_request` → types: opened, reopened, synchronize, edited
  - `workflow_dispatch`
- **Jobs:** Single branch validation job
- **Key Steps:**
  - Check branch name against pattern `{type}/{scope}-{title}`
  - Validate type is in allowed list
  - Post comment if validation fails
  - Report status to PR check
- **Dependencies:** `.github/instructions/branch-naming.instructions.md`
- **Permissions:** pull-requests:write, contents:read
- **Error Handling:** Validation failure blocks merge (required check)

**Consolidation Priority:** HIGH — Core PR validation, critical for workflow routing

---

### 2. **changelog-safety-audit.yml** — Changelog Validation

- **Status:** Safety audit on PR events
- **Triggers:**
  - `pull_request` → opened, edited, synchronize
  - `workflow_dispatch`
- **Jobs:** Single changelog validation job
- **Key Steps:**
  - Check CHANGELOG.md exists and is modified
  - Validate changelog entry format (per Keep a Changelog 1.1.0)
  - Check entry has correct version and date
  - Report violations via PR comment
- **Dependencies:** CHANGELOG.md (canonical changelog)
- **Permissions:** pull-requests:write, contents:read
- **Note:** Skipped for docs-only PRs

**Consolidation Priority:** HIGH — Changelog governance enforcement

---

### 3. **checks.yml** — General PR Checks

- **Status:** Reactive validation on PR events
- **Triggers:**
  - `pull_request` → opened, edited, synchronize, reopened
  - `workflow_dispatch`
- **Jobs:** Multiple parallel check jobs
- **Key Steps:**
  - Validate branch name (delegated to branch-name-validation.yml)
  - Check for required PR template sections
  - Validate commit message format
  - Report comprehensive check results
- **Dependencies:** Branch naming rules, PR template schema
- **Permissions:** pull-requests:write, contents:read
- **Concurrency:** Single check per PR

**Consolidation Priority:** HIGH — Aggregates multiple validations

---

### 4. **docs-validation.yml** — Documentation Validation

- **Status:** Reactive and scheduled validation
- **Triggers:**
  - `push` → `develop` branch with `docs/` paths
  - `pull_request` → opened, edited, synchronize
  - `schedule` → Daily 01:00 UTC
  - `workflow_dispatch`
- **Jobs:** Documentation validation job
- **Key Steps:**
  - Lint Markdown files (markdownlint)
  - Check documentation frontmatter validity
  - Validate internal link references
  - Report missing documentation updates
- **Dependencies:** `.markdownlintrc`, Markdown files
- **Permissions:** pull-requests:write, contents:read

**Consolidation Priority:** MEDIUM — Specialized documentation checks

---

### 5. **linting.yml** — Code Quality Linting

- **Status:** Reactive linting on PR/push events
- **Triggers:**
  - `push` → `develop` branch
  - `pull_request` → opened, edited, synchronize
  - `workflow_dispatch`
- **Jobs:** Parallel linting jobs (ESLint, Prettier, etc.)
- **Key Steps:**
  - Run ESLint on JavaScript/TypeScript files
  - Run Prettier for code formatting
  - Report style violations via PR comment
  - Fail if critical style issues found
- **Dependencies:** `.eslintrc`, `.prettierrc` configuration
- **Permissions:** pull-requests:write, contents:read
- **Note:** Part of Phase 5 (linting-unified.yml) — candidate for separate workflow

**Consolidation Priority:** DEFERRED — Handle in Phase 5 (US4)

---

### 6. **pr-template-validation.yml** — PR Template Routing

- **Status:** Reactive validation on PR open event
- **Triggers:**
  - `pull_request` → opened
  - `workflow_dispatch`
- **Jobs:** Single template routing job
- **Key Steps:**
  - Detect branch type from branch name
  - Route to correct PR template file (e.g., `feat/` → `pr_feature.md`)
  - Validate template was correctly applied
  - Apply template-based labels
- **Dependencies:** `.github/PULL_REQUEST_TEMPLATE/` directory, branch naming rules
- **Permissions:** pull-requests:write, issues:write
- **Error Handling:** Re-routing allowed up to 3 times per PR

**Consolidation Priority:** HIGH — Core routing mechanism

---

### 7. **validate-blocking-issue-before-close.yml** — Blocking Issue Validation

- **Status:** Reactive validation on issue close event
- **Triggers:**
  - `issues` → types: closed
  - `workflow_dispatch`
- **Jobs:** Single blocking validation job
- **Key Steps:**
  - Check if closing issue blocks other issues
  - Scan for dependent issues
  - Post comment if blocking detected, prevent close
  - Suggest resolution path
- **Dependencies:** Issue relationships, issue linking metadata
- **Permissions:** issues:write, contents:read

**Consolidation Priority:** MEDIUM — Safety check on issue closure

---

### 8. **validate-blocking-status-before-close.yml** — Status Blocking Validation

- **Status:** Reactive validation on issue close event
- **Triggers:**
  - `issues` → types: closed
- **Jobs:** Single status validation job
- **Key Steps:**
  - Check for `status:blocked` label on issue
  - Prevent close if blocking status set
  - Post remediation comment
- **Dependencies:** Label taxonomy (`.github/labels.yml`)
- **Permissions:** issues:write

**Consolidation Priority:** LOW — Overlaps with issue state validation

---

### 9. **validate-dor-dod-sections.yml** — Definition of Ready/Done Validation

- **Status:** Reactive validation on issue events
- **Triggers:**
  - `issues` → types: opened, edited, reopened
  - `pull_request` → opened, edited, synchronize
  - `workflow_dispatch`
- **Jobs:** Single DoR/DoD validation job
- **Key Steps:**
  - Check for "Definition of Ready" section in issue body
  - Check for "Definition of Done" section in PR body
  - Report missing sections via comment
  - Validate section structure (checklist, acceptance criteria)
- **Dependencies:** Issue/PR template schema
- **Permissions:** issues:write, pull-requests:write

**Consolidation Priority:** MEDIUM — Quality gate for issue/PR clarity

---

### 10. **validate-project-linking.yml** — GitHub Projects Linking

- **Status:** Reactive validation on issue/PR events
- **Triggers:**
  - `issues` → types: opened, reopened
  - `pull_request` → opened, reopened
  - `workflow_dispatch`
- **Jobs:** Single project linking job
- **Key Steps:**
  - Check if issue/PR linked to GitHub project
  - Validate linked project is active (not archived)
  - Require project field populated for non-trivial issues
  - Report via comment if validation fails
- **Dependencies:** GitHub Projects API
- **Permissions:** issues:write, pull-requests:write

**Consolidation Priority:** MEDIUM — Project governance validation

---

### 11. **workflow-validation.yml** — Workflow Syntax & Security

- **Status:** Reactive validation on workflow file changes
- **Triggers:**
  - `push` → `.github/workflows/` paths
  - `pull_request` → `.github/workflows/` paths
  - `workflow_dispatch`
- **Jobs:** Workflow validation job
- **Key Steps:**
  - Validate YAML syntax of workflow files
  - Check for dangerous workflow patterns (e.g., `pull_request_target` with untrusted inputs)
  - Run actionlint checks
  - Report findings via PR comment
- **Dependencies:** Workflow schema, actionlint configuration
- **Permissions:** pull-requests:write, contents:read

**Consolidation Priority:** HIGH — Security gate for workflow changes

---

## Trigger Pattern Analysis

### Event Type Coverage

| Trigger Type | Workflows | Patterns |
|---|---|---|
| `pull_request` → opened | 8 workflows | Branch validation, changelog, checks, docs, linting, template routing, DoR/DoD, project linking |
| `pull_request` → edited | 6 workflows | Same as opened (excludes linting, project linking in some cases) |
| `pull_request` → synchronize | 6 workflows | Branch name, checks, docs, linting, DoR/DoD, template routing |
| `issues` → opened/reopened | 4 workflows | DoR/DoD, project linking, blocking status, blocking issue |
| `issues` → edited | 3 workflows | DoR/DoD, project linking, blocking status |
| `issues` → closed | 2 workflows | Blocking issue, blocking status |
| `push` → develop | 3 workflows | Docs, linting, workflow validation |
| `push` → workflows paths | 1 workflow | Workflow validation |
| `schedule` → cron | 1 workflow | Docs validation (daily 01:00 UTC) |
| `workflow_dispatch` | 11 workflows | Manual trigger support for all validations |

### Schedule Coverage

- 01:00 UTC — Documentation validation (daily)
- All others: Reactive only (no cron schedules)

**Consolidation Opportunity:** Merge all scheduled/reactive jobs into single workflow with conditional execution based on event type

---

## Consolidation Strategy

### Phase 4 MVP Scope

**Consolidate:** 11 archived validation workflows → **validation-unified.yml**

**Scope Breakdown:**

1. **Reactive (PR/Issue event-triggered) jobs:**
   - Branch name validation (from branch-name-validation.yml)
   - PR template validation (from pr-template-validation.yml)
   - Changelog validation (from changelog-safety-audit.yml)
   - Commit/workflow validation (from checks.yml, workflow-validation.yml)
   - Secret scanning (from workflow-validation.yml, enhanced)
   - DoR/DoD validation (from validate-dor-dod-sections.yml)
   - Project linking (from validate-project-linking.yml)
   - Blocking status checks (from validate-blocking-*.yml)

2. **Scheduled jobs:**
   - Documentation validation (01:00 UTC daily) — can migrate to reactive on docs path changes

3. **Special handlers:**
   - Linting (docs-validation.yml) → Deferred to Phase 5 (linting-unified.yml)

### Expected GitHub Actions Minutes Reduction

**Baseline:** 180 min/month

**Optimizations:**

1. **Consolidation:** Merge 11 workflows into 1 (eliminate 10 workflow setup overheads) → ~20 min savings
2. **Parallelization:** Run non-blocking validations in parallel where possible → ~5 min savings
3. **Conditional execution:** Skip validations when not applicable (e.g., skip changelog for docs-only PRs) → ~3 min savings
4. **Deferred linting:** Move linting to Phase 5 unified workflow → ~2 min savings

**Target:** ≤150 min/month (16.7% reduction) = **30 min savings**

---

## Implementation Notes

### Job Dependencies

```
pr-validation (on PR events)
├── branch-name-validation [parallel]
├── pr-template-validation [parallel]
├── changelog-validation [parallel]
├── commit-validation [parallel]
├── secret-scanning [parallel]
├── dor-dod-validation [parallel]
└── project-linking [parallel]

issue-validation (on issue events)
├── dor-dod-validation [parallel]
├── project-linking [parallel]
├── blocking-issue-check [parallel]
└── blocking-status-check [parallel]

workflow-validation (on workflow changes)
└── workflow-syntax-check [serial]

scheduled-validation (01:00 UTC daily)
└── docs-validation [serial]
```

### Permissions Required

```yaml
permissions:
  contents: read
  issues: write
  pull-requests: write
  discussions: read
```

### Concurrency Strategy

- Group: `validation-{event_name}-{issue_number_or_run_id}`
- Cancel in progress: false (allow all validation runs to complete)

---

## Test Coverage Requirements

### Unit Tests (≥80% line coverage)

- Branch name validation logic
- Changelog format validation
- DoR/DoD section detection
- Project linking checks

### Functional Tests (100% for critical paths)

- PR branch name validation: Trigger on PR open, verify format checking and PR comment
- Changelog validation: Verify format checking and error reporting
- Project linking: Verify project requirement enforcement
- Blocking issue: Verify dependency detection and close prevention
- Workflow validation: Verify YAML syntax checking and security pattern detection

---

## Next Steps (Phase 4 Implementation)

1. **T026:** Create skeleton validation-unified.yml with all jobs
2. **T027-T031:** Implement PR validation jobs in parallel [P]
3. **T032-T033:** Integrate composite actions (validate-check, collect-metrics)
4. **T034:** Test on feature branch (trigger via PR, verify all patterns)
5. **T035:** Document behavior and troubleshooting in VALIDATION_UNIFIED.md
6. **T036:** Validate CI passes ≥3 consecutive runs with no regressions

---

## References

- **Archived workflows:** `.github/workflows/archived/2026-09-11/validation/`
- **Branch naming:** `.github/instructions/branch-naming.instructions.md`
- **Changelog spec:** `CHANGELOG.md` (Keep a Changelog 1.1.0)
- **Label taxonomy:** `.github/labels.yml` (canonical label definitions)
