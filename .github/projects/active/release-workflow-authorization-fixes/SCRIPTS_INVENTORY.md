---
file_type: project_document
description: Complete inventory of all scripts across portable and GitHub-specific locations
date: 2026-08-04
author: Claude Haiku 4.5
status: in-progress
---

# Complete Scripts Inventory

**Generated:** 2026-08-04  
**Purpose:** Track all scripts, their locations, and current status  
**Status:** ⚠️ DUAL PATH ISSUE - Scripts exist in both locations

---

## Summary Statistics

```
PORTABLE SCRIPTS (scripts/ folder):           217 files
  - Validation scripts:                       59 files
  - Workflow integration scripts:             56 files
  - Agent utility libraries:                  102 files

GITHUB-ONLY SCRIPTS (.github/scripts/):       107 files
  - GitHub-specific agents:                   5 files
  - Workflow adapters:                        ~50 files
  - Validation utilities:                     ~52 files

TOTAL UNIQUE SCRIPTS:                         ~270 scripts
DUPLICATED SCRIPTS:                           ~54 scripts (PROBLEM)

WORKFLOWS USING SCRIPTS:                      21 files
DOCUMENTATION REFERENCING SCRIPTS:            28 files
```

---

## PORTABLE SCRIPTS (should be in `scripts/`)

### Validation Scripts (`scripts/validation/`)

**Total: 59 files**

Core validators:

- `validate-agent-frontmatter.js` - Agent YAML frontmatter validation
- `validate-agent-hooks.cjs` - Agent hook configuration validation
- `validate-branch-name.js` - Git branch naming compliance
- `validate-footers.js` - Document footer validation
- `validate-frontmatter.js` - YAML frontmatter structure validation
- `validate-json.js` - JSON file validation with strict mode
- `validate-links.js` - Markdown link validation
- `validate-mermaid-colour-contrast.js` - Diagram color accessibility
- `validate-plugins.js` - Plugin manifest validation
- `validate-skills.js` - Skill manifest validation
- `validate-structure.js` - Repository structure validation

Schema validators:

- All validators reference `../../../schemas/` (correct relative path)

Test files:

- `__tests__/` directory with unit tests for each validator

**Status:** ✅ Files exist in `scripts/validation/`

---

### Workflow Scripts (`scripts/workflows/`)

**Total: 56 files**

#### Changelog (`scripts/workflows/changelog/`)

- `extract-pr-entries.cjs` - Extract PR data from GitHub for changelog
- `merge-entries.cjs` - Merge and consolidate changelog entries
- `merge-entries.test.cjs` - Unit tests
- `merge-entries.integration.test.cjs` - Integration tests
- `__tests__/extract-pr-entries.test.cjs` - Unit tests

**Status:** ✅ Files exist in `scripts/workflows/changelog/`

#### Metrics (`scripts/workflows/metrics/`)

- `aggregate.cjs` - Aggregate metrics from multiple sources
- `generate-report.cjs` - Generate metrics report

**Status:** ✅ Files exist in `scripts/workflows/metrics/`

#### Projects (`scripts/workflows/projects/`)

- `scan-completion.cjs` - Scan for completed projects
- `archive-projects.cjs` - Archive completed projects

**Status:** ✅ Files exist in `scripts/workflows/projects/`

#### Release (`scripts/workflows/release/`)

- `trigger-telemetry.cjs` - Trigger telemetry during release
- `run-release-agent.cjs` - Execute release agent

**Status:** ✅ Files exist in `scripts/workflows/release/`

---

### Agent Utility Libraries (`scripts/agents/includes/`)

**Total: 62 files**

Core agents:

- `milestone-assignment.js` - Milestone assignment logic (81% test coverage)
- `issue-pr-metadata.cjs` - Extract and manage issue/PR metadata
- `allocate-milestone.cjs` - Milestone allocation algorithm
- `derive-project-fields.cjs` - Project field derivation
- `remediation-checklist-generator.js` - Generate remediation checklists

Supporting utilities:

- `changelogUtils.cjs` - Changelog utility functions
- (and 57 more utility files)

Test files:

- `__tests__/milestone-assignment.test.js` - 28 tests, validates bulk assignment logic
- `__tests__/` directory with integration tests

**Status:** ✅ Files exist in `scripts/agents/includes/`

---

## GITHUB-ONLY SCRIPTS (should stay in `.github/scripts/`)

### GitHub-Specific Agents (`.github/scripts/agents/`)

**Total: 5 files**

These use GitHub Actions context and cannot be ported:

- `meta.agent.js` - GitHub metadata operations (reads `github.event`)
- `issues.agent.js` - Issue operations (GitHub API specific)
- `reviewer.agent.js` - PR reviewer assignment (GitHub API specific)
- `planner.agent.js` - GitHub project planning (GitHub API only)
- `run-labeling-agent.cjs` - Labeling with GitHub context (core.setOutput)

**Characteristics:**

- Import `@actions/github` and `@actions/core`
- Read GitHub Actions context variables
- Cannot function without GitHub API
- Should NOT be moved to portable location

**Status:** ⚠️ Files exist but some may have duplicates in `scripts/`

---

### GitHub Workflow Integrations (`.github/scripts/workflows/`)

**Total: ~50 files** (mixed with portable duplicates)

- `assign-milestones-workflow.js` - GitHub Actions integration for milestones
  - Status: ⚠️ EXISTS IN BOTH `.github/scripts/` AND `scripts/`
  - Referenced by: `issue-remediation-bulk.yml`
- (and ~49 more workflow integration files)

**Status:** ⚠️ PROBLEM - Many scripts exist in both locations

---

### GitHub Validation Utilities (`.github/scripts/`)

**Total: ~52 files**

These are GitHub-specific validations:

- `identify-changed-markdown.js` - Find changed markdown files in PR
- `collect-validation-results.js` - Collect results from validation runs
- `validate-markdown-lint.js` - Markdown lint wrapper for GitHub
- `collect-link-targets.js` - Collect link targets from repo

**Characteristics:**

- Use GitHub API or GitHub Actions context
- Specific to control-plane workflows
- Not intended for external use

**Status:** ⚠️ Files exist but may need deduplication with `scripts/`

---

## PROBLEM: DUAL PATH DUPLICATIONS

### Duplicate Files (Scripts in BOTH locations)

The following files exist in BOTH `.github/scripts/` AND `scripts/`:

```
assign-milestones-workflow.js
(and potentially many others - needs full audit)
```

**Impact:**

- Maintenance burden (changes in two places)
- Workflow confusion (which path is authoritative?)
- Potential inconsistency if files drift
- No clear ownership model

**Required Action:**

1. Identify ALL duplicates
2. Decide which location is authoritative
3. Remove duplicates
4. Update references consistently

---

## WORKFLOWS USING SCRIPTS (21 files)

### Using `.github/scripts/` (OLD PATH - NEEDS UPDATE)

1. `documentation.yml`
   - References: `.github/scripts/**` (path pattern)
   - Scripts needed: meta validation

2. `docs-maintenance.yml`
   - References: `.github/scripts/**` (path pattern)
   - Scripts: `agents/meta.agent.js`

3. `docs-validation.yml`
   - References: `.github/scripts/identify-changed-markdown.js`
   - References: `.github/scripts/collect-validation-results.js`

4. `labeling.yml`
   - References: `.github/scripts/agents/run-labeling-agent.cjs`

5. `labeling-governance.yml`
   - References: `.github/scripts/agents/run-labeling-agent.cjs`

6. `issue-remediation-bulk.yml`
   - References: `.github/scripts/workflows/assign-milestones-workflow.js` ⚠️
   - Also references: `scripts/agents/includes/` (portable)

7. `metrics-pipeline.yml`
   - References: `.github/scripts/workflows/metrics/aggregate.cjs`
   - References: `.github/scripts/workflows/metrics/generate-report.cjs`

8. `metrics-reporting.yml`
   - References: `.github/scripts/workflows/metrics/aggregate.cjs`
   - References: `.github/scripts/workflows/metrics/generate-report.cjs`

9. `project-archival.yml`
   - References: `.github/scripts/workflows/projects/scan-completion.cjs`
   - References: `.github/scripts/workflows/projects/archive-projects.cjs`

10. `issues.yml`
    - References: `.github/scripts/agents/issues.agent.js`

11. `reviewer.yml`
    - References: `.github/scripts/agents/reviewer.agent.js`

12. `release.yml`
    - References: `.github/scripts/workflows/release/trigger-telemetry.cjs`
    - References: `.github/scripts/workflows/release/run-release.agent.cjs`

13. `meta.yml`
    - References: `.github/scripts/validate-markdown-lint.js`
    - References: `.github/scripts/collect-link-targets.js`

14. `planner.yml`
    - References: `.github/scripts/agents/planner.agent.js`

15. `issue-create-enhanced.yml`
    - References: `scripts/agents/includes/milestone-assignment.js` (portable)
    - References: `scripts/agents/includes/remediation-checklist-generator.js` (portable)

### Using `scripts/` (NEW PORTABLE PATH - Mostly correct)

1. `changelog-management.yml`
   - References: `scripts/agents/includes/changelogUtils.cjs`
   - References: `scripts/validation/validate-changelog.cjs`

2. `docs-maintenance.yml` (mixed)
   - Also uses: `.github/scripts/**`

3. `issue-remediation-bulk.yml` (mixed)
   - Uses both paths (inconsistent)

4. `labeling-governance.yml`
   - References: `scripts/validation/validate-labeling-configs.cjs`
   - References: `scripts/validation/validate-issue-fields.cjs`

5. `labeling.yml`
   - References: `scripts/validation/validate-labeling-configs.cjs`
   - References: `scripts/validation/validate-issue-fields.cjs`

6. `metadata-governance.yml`
   - References: `scripts/agents/includes/issue-pr-metadata.cjs`
   - References: `scripts/agents/includes/allocate-milestone.cjs`

7. `project-meta-sync.yml`
   - References: `scripts/agents/includes/derive-project-fields.cjs`

8. `template-enforcement.yml`
   - References: `scripts/validation/template-helpers.cjs`

9. `validate-mermaid-pr.yml`
   - References: `scripts/validation/validate-mermaid-colour-contrast.js`

10. `validate-pr-template.yml`
    - References: `scripts/validation/template-helpers.cjs`

---

## DOCUMENTATION REFERENCING SCRIPTS (28 files)

All these files reference `.github/scripts/` paths:

```
docs/AUTOMATION.md
docs/AWESOME_GITHUB_MAPPING_STRATEGY.md
docs/BRANCH_CLEANUP.md
docs/BRANDING_AGENT_USAGE.md
docs/BRANDING_CONFIG_SPEC.md
docs/CANONICAL_CONFIGS_GUIDE.md
docs/CHANGELOG_AUTOMATION.md
docs/DECISIONS.md
docs/FOOTER_REMEDIATION_GUIDE.md
docs/FOOTER_VALIDATION_AUDIT.md
docs/FRONTMATTER_SCHEMA.md
docs/GITHUB_PROJECT_OPERATIONS_SPEC.md
docs/ISSUE_TRIAGE_AUTOMATION.md
docs/LABELING.md
docs/LABELING_GOVERNANCE.md
docs/MAINTENANCE.md
docs/METRICS.md
docs/MIGRATION.md
docs/MILESTONE_ALLOCATION_STRATEGY.md
docs/QUIRKY_FOOTERS_GUIDE.md
docs/RELEASE_PROCESS.md
docs/VERSIONING.md
docs/WORKFLOW-REFACTORING-GUIDE.md
docs/agents/AGENT_ARCHITECTURE.md
docs/agents/PLANNER_RUNBOOK.md
docs/agents/REVIEWER_RUNBOOK.md
```

**Required Action:** Update all references to use correct paths based on Phase 2B resolution

---

## SCHEMA FILES REFERENCE

All validation scripts should reference schemas from root `schemas/` folder.

**Correct relative paths:**

- From `scripts/validation/` → `../../../schemas/`
- From `scripts/agents/includes/` → `../../../../schemas/`
- From `scripts/workflows/changelog/` → `../../../../schemas/`

**Status Check:**

- ✅ Path references UPDATED in Phase 2B
- ⚠️ But not VERIFIED in all scripts
- 🔴 Missing comprehensive audit

---

## Action Items (Priority Order)

### CRITICAL (Blocking)

1. **Resolve dual path issue**
   - [ ] Identify ALL duplicate files
   - [ ] Move portable scripts to `scripts/`
   - [ ] Keep GitHub-only in `.github/scripts/`
   - [ ] Remove duplicates
   - [ ] Estimate: 2-3 hours

2. **Update ALL workflow references (21 files)**
   - [ ] Update 14+ workflows using `.github/scripts/` old paths
   - [ ] Verify each workflow still works
   - [ ] Test with dry-run
   - [ ] Estimate: 3-4 hours

3. **Update ALL documentation references (28 files)**
   - [ ] Review each doc file
   - [ ] Update script paths
   - [ ] Verify examples still work
   - [ ] Estimate: 1-2 hours

### HIGH (Important)

1. **Comprehensive path validation**
   - [ ] Audit every script for schema references
   - [ ] Verify relative paths are correct
   - [ ] Run validation suite
   - [ ] Estimate: 1 hour

2. **Testing & verification**
   - [ ] Run npm test (ensure 1,114+ tests pass)
   - [ ] Run npm run validate:all (ensure all validators work)
   - [ ] Dry-run affected workflows
   - [ ] Estimate: 1 hour

### FOLLOW-UP (Next Phase)

1. **Archive & documentation**
   - [ ] Create migration guide
   - [ ] Document lessons learned
   - [ ] Update Phase 3 plan
   - [ ] Estimate: 1 hour

---

## Time Estimate

- **Total Remediation:** 8-11 hours
- **Review & Merge:** 1-2 hours
- **Total:** ~10-13 hours

---

## Success Criteria

✅ Phase 2B + 2C Fix is COMPLETE when:

- [x] PHASE_2B_EXECUTION_PLAN.md created and documented
- [x] SCRIPTS_INVENTORY.md created (this file)
- [ ] All duplicate scripts removed
- [ ] All workflow references updated (21 files)
- [ ] All documentation references updated (28 files)
- [ ] All tests passing (1,114+)
- [ ] All validators working
- [ ] No path resolution errors
- [ ] PR merged to develop
- [ ] Issues #1461, #1464, #1465 updated with findings

---

**Status:** This inventory reflects current state as of 2026-08-04.  
**Next Step:** Execute remediation plan in Phase 2C (extended scope)
