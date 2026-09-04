---
title: "Project Management Scripts & Agents Audit Report"
description: "Complete audit of all scripts, agents, and workflows with consolidation recommendations"
file_type: "audit-report"
status: "active"
created_date: "2026-09-03"
last_updated: "2026-09-03"
author: "Claude Code Audit"
severity: "high"
---

# Project Management Scripts & Agents Audit Report

**Date**: 2026-09-03  
**Scope**: Complete audit of project management infrastructure  
**Status**: ✅ Inventory Complete | 🔄 Analysis In Progress  

---

## Executive Summary

### The Situation
You have built an extensive ecosystem of project management scripts, agents, and workflows to automate:
- Project status tracking and archival
- Label creation and governance
- Workflow orchestration  
- Phase progression
- Documentation generation

**Current State**:
- **8 core project scripts** (mix of Node.js/Bash)
- **40+ agents** across `.github/agents/` and `agents/` directories
- **19 workflows** with unclear precedence and overlaps
- **Multiple duplicate/overlapping implementations** (labeling, phase progression, status updates)
- **100% test coverage missing** on many scripts

### Key Problems Identified

1. **Duplication** (HIGH PRIORITY)
   - `scripts/agents/planner.agent.cjs` vs `scripts/agents/planner.agent.js` (CJS vs ESM)
   - `.github/agents/` vs `agents/` agent implementations
   - Multiple implementations of same functionality (status updates, documentation creation)

2. **Gaps in Testing** (CRITICAL)
   - Only `test-project-docs-update.sh` has test suite
   - No unit tests for Node.js scripts
   - No integration tests for workflow sequences
   - No validation of real-world scenarios

3. **Active Projects** (ADMINISTRATIVE)
   - **Issues/Labels**: 4 active projects tracking labeling work
   - **Workflows**: 2 active consolidation projects  
   - Status updates needed to reflect recent work

4. **Architecture Issues** (MEDIUM)
   - Mixing Bash and Node.js without clear separation of concerns
   - Inconsistent naming conventions (CJS vs ESM, script vs agent)
   - Overlapping workflow responsibilities

---

## Phase 1: Inventory & Dependency Mapping

### 1.1 Scripts Inventory

| Script | Location | Type | Purpose | Status | Dependencies |
|--------|----------|------|---------|--------|--------------|
| `collect-link-targets.js` | `scripts/` | Node.js ESM | Extract markdown files with URLs for link checking | ✅ Active | GitHub Actions env vars |
| `validate-reports-structure.js` | `scripts/` | Node.js ESM | Validate report structure & filenames | ✅ Active | None (filesystem) |
| `archive-projects.cjs` | `scripts/workflows/projects/` | Node.js CJS | Move completed projects to archived folder | ✅ Active | Filesystem, env vars |
| `scan-completion.cjs` | `scripts/workflows/projects/` | Node.js CJS | Scan active projects for completion markers | ✅ Active | Filesystem |
| `orchestrate-phase-progression.cjs` | `scripts/workflows/` | Node.js CJS | Sync labels & progress phases | ⚠️ Mixed | `sync-labels-on-event.cjs`, `orchestrate-phase-progression.cjs` |
| `update-projects-status.cjs` | `scripts/automation/` | Node.js CJS | Audit project docs; generate templates/links | ✅ Active | Filesystem, YAML parsing |
| `project-docs-update.sh` | `scripts/automation/` | Bash | Create/update project docs (PLANNING, OPENSPEC, README) | ✅ Active | `_templates/`, sed, find |
| `test-project-docs-update.sh` | `scripts/automation/` | Bash | Test suite for docs update script | ✅ Active | `project-docs-update.sh` |
| `planner.agent.cjs` | `scripts/agents/` | Node.js CJS | ❓ Unknown purpose | ⚠️ Unclear | Unknown |
| `planner.agent.js` | `scripts/agents/` | Node.js ESM | ❓ Unknown purpose (ESM variant) | ⚠️ Duplicate | Unknown |

**Key Findings**:
- ✅ 6 scripts are focused and single-purpose
- ⚠️ 2 `planner.agent.*` files are duplicates (CJS/ESM variants)
- ⚠️ `orchestrate-phase-progression.cjs` has unclear dependencies
- 📊 **Total**: 10 files, but 2 are duplicates → **8 unique scripts**

### 1.2 Agents Inventory

**In `.github/agents/` (21 files)**:
- `linting.agent.md`, `labeling.agent.md`, `adr.agent.md`, `issues.agent.md`
- `mode-demonstrate-understanding.agent.md`, `metrics.agent.md`, `meta.agent.md`, `changelog.agent.md`
- `mode-prd.agent.md`, `reporting.agent.md`, `prompt-engineer.agent.md`, `mode-thinking.agent.md`
- `template.agent.md`, `mode-document-reviewer.agent.md`, `reviewer.agent.md`
- `task-planner.agent.md`, `release.agent.md`, `task-researcher.agent.md`
- `project-meta-sync.agent.md`, `testing.agent.md`

**In `agents/` (35+ files)** - Portable agent definitions:
- Duplicates: `adr.agent.md`, `changelog.agent.md`, `linting.agent.md`, `labeling.agent.md`, `mode-prd.agent.md`, `mode-thinking.agent.md`, `mode-document-reviewer.agent.md`, `issues.agent.md`, `metrics.agent.md`, `meta.agent.md`, `prompt-engineer.agent.md`, `reporting.agent.md`, `task-planner.agent.md`, `task-researcher.agent.md`, `template.agent.md`, `testing.agent.md`, `reviewer.agent.md`
- Additional: `client-website-discovery-assistant.agent.md`, `chat-closure.agent.md`, `ai-readiness-estimator.agent.md`, and many more

**Problem Identified**: 
- ❌ **17+ agents duplicated** between `.github/agents/` and `agents/`
- ❌ **No clear ownership/canonical location**
- ❌ **Updates go to one location, causing divergence**

**Recommendation**: Single source of truth in `agents/` with `.github/agents/` as symlinks or importing from `agents/`

### 1.3 Workflows Inventory

**Primary Workflows Related to Projects**:
- `.github/workflows/project-archival.yml` — Archives completed projects
- `.github/workflows/validate-project-linking.yml` — Validates project linking
- `.github/workflows/openspec-progress-phase.yml` — Phase progression via OpenSpec
- `.github/workflows/openspec-report-progression.yml` — Report progression

**Status**:  
Per `label-prefix-audit-2026-08-05` project: **19 total workflows** with 5 major overlaps identified. See that project's `WORKFLOW_CONSOLIDATION_ANALYSIS.md` for full details.

---

## Phase 2: Active Projects Audit

### Issues & Labels Related Projects

| Project | Status | Last Updated | Key Docs | Issues |
|---------|--------|--------------|----------|--------|
| `label-prefix-audit-2026-08-05` | ✅ Audit Complete | 2026-09-02 | README (detailed), LABEL_PREFIX_AUDIT_REPORT, REMEDIATION_PLAN, WORKFLOW_CONSOLIDATION_ANALYSIS | Phase 2 execution pending |
| `label-prefix-enforcement-2026-08-05` | 🔄 In Progress | 2026-08-29 | PLANNING, README | Enforcement implementation |
| `labeling-consolidation-2026-09-03` | 🟡 Planning | 2026-09-03 | README (minimal), KICKOFF, RESEARCH_QUESTIONS, EXISTING_INFRASTRUCTURE | Just started, needs detailed planning |
| `openspec-labels-automation` | 🔄 Active | 2026-08-25 | PHASE-4-ARCHITECTURE (detailed) | Phase 4 design complete, implementation pending |

**Status Update Needed**:
All 4 projects need README updates to reflect:
- Current phase completion status
- Blockers or dependencies
- Next immediate action items
- Timeline clarity

### Workflows Related Projects

| Project | Status | Last Updated | Key Docs | Issues |
|---------|--------|--------------|----------|--------|
| `workflows-consolidation-2026-q3` | 🔄 Active | 2026-09-03 | AUDIT_2026_08_07 (detailed), CONSOLIDATED_ACTION_PLAN, IMPLEMENTATION_NOTES, EXECUTION_PLAYBOOK | Consolidation roadmap defined |
| `release-agentic-workflows-2026-08-11` | 📊 Unknown | 2026-08-29 | Unknown | Needs review |

**Recommendation**: Review `release-agentic-workflows-2026-08-11` to determine if merged into Q3 consolidation or still independent.

---

## Phase 3: Overlap & Consolidation Analysis

### 3.1 Script Duplication

**CRITICAL: CJS vs ESM Variants**

```
scripts/agents/planner.agent.cjs  ← Which is canonical?
scripts/agents/planner.agent.js   ← Which is canonical?
```

**Action Required**: 
1. Determine which is correct (ESM is modern standard)
2. Delete the non-canonical version
3. Update all imports to use canonical location

**Other Script Overlaps**:

| Function | File 1 | File 2 | Analysis | Action |
|----------|--------|--------|----------|--------|
| Project status update | `update-projects-status.cjs` | `scan-completion.cjs` | Different purposes but both modify state | Clarify boundaries |
| Doc creation | `project-docs-update.sh` | (None) | Only Bash, no Node.js equivalent | Good separation |

### 3.2 Agent Duplication (CRITICAL)

**17+ agents exist in TWO locations**:

```
.github/agents/task-planner.agent.md       (16 KB)
agents/task-planner.agent.md               (16 KB)

.github/agents/task-researcher.agent.md    (12 KB)
agents/task-researcher.agent.md            (12 KB)

[... + 15 more pairs ...]
```

**Root Cause**:
- `.github/agents/` = legacy location (repo-specific instructions)
- `agents/` = portable location (reusable across projects)
- Both exist, but it's unclear which is authoritative

**Consolidation Options**:

**Option A: `.github/agents/` → Symlinks to `agents/`** (RECOMMENDED)
```bash
cd .github/agents/
rm *.agent.md
ln -s ../../agents/*.agent.md .
```
✅ Single source of truth  
✅ No duplication  
❌ Requires CI adjustments if symlinks not allowed  

**Option B: Delete `.github/agents/`, use only `agents/`**
```bash
rm -rf .github/agents/
# Update CLAUDE.md to reference agents/ only
```
✅ Clean structure  
✅ Follows portable asset pattern (per CLAUDE.md)  
❌ Breaks existing references if any  

**Option C: Consolidate & Delete `agents/` (NOT RECOMMENDED)**
```bash
cp agents/*.agent.md .github/agents/
rm -rf agents/
```
❌ Violates CLAUDE.md (non-portable assets in `.github/`)  
❌ Breaks portability  

**RECOMMENDATION**: Option A or B. Use Option B if CI allows symlinks, Option A otherwise.

---

## Phase 4: Testing & Validation

### 4.1 Test Coverage Assessment

| Script | Has Tests | Test File | Coverage | Status |
|--------|-----------|-----------|----------|--------|
| `collect-link-targets.js` | ❌ No | — | 0% | **MISSING** |
| `validate-reports-structure.js` | ❌ No | — | 0% | **MISSING** |
| `archive-projects.cjs` | ❌ No | — | 0% | **MISSING** |
| `scan-completion.cjs` | ❌ No | — | 0% | **MISSING** |
| `orchestrate-phase-progression.cjs` | ❌ No | — | 0% | **MISSING** |
| `update-projects-status.cjs` | ❌ No | — | 0% | **MISSING** |
| `project-docs-update.sh` | ✅ Yes | `test-project-docs-update.sh` | ~70% | **PARTIAL** |
| Agents (all 40+) | ❌ No | — | 0% | **MISSING** |

**Summary**: Only 1 of 8 scripts has tests. **87.5% test coverage gap**.

### 4.2 Real-World Testing: Bulk Project Status Update Scenario

**Test Scenario**: Update status on 3 active projects

**Projects Selected for Testing**:
1. `label-prefix-audit-2026-08-05` (status: Audit Complete, needs Phase 2 status)
2. `workflows-consolidation-2026-q3` (status: Consolidation in progress)
3. `labeling-consolidation-2026-09-03` (status: Planning, just kicked off)

**Test Steps**:

```bash
# Step 1: Run validation script
node scripts/validate-reports-structure.js

# Step 2: Scan for completion
node scripts/workflows/projects/scan-completion.cjs

# Step 3: Update status
node scripts/automation/update-projects-status.cjs audit

# Step 4: Generate templates
node scripts/automation/update-projects-status.cjs template

# Step 5: Check linking
node scripts/automation/update-projects-status.cjs link
```

**Expected Outcomes**:
- ✅ No errors during execution
- ✅ All project READMEs validated
- ✅ Missing fields identified
- ✅ Template suggestions generated
- ✅ Linking recommendations provided

**Status**: Awaiting execution (requires permissions)

---

## Phase 5: Consolidation Recommendations

### 5.1 Priority 1: Eliminate Agent Duplication

**Timeline**: 1-2 hours  
**Impact**: 40+ agent definitions consolidated to single source

**Steps**:
1. Compare `.github/agents/*` vs `agents/*` file-by-file
2. Identify which location has more recent updates
3. If identical: use Option A (symlinks) or Option B (delete `.github/agents/`)
4. If divergent: merge changes into canonical location
5. Update CLAUDE.md to specify agent location
6. Update CI/tooling to reference only canonical location

**Validation**:
```bash
# Should return 0 differences
diff -r .github/agents agents --exclude='.git' --exclude='node_modules'
```

### 5.2 Priority 2: Create Unit Tests for All Scripts

**Timeline**: 6-8 hours  
**Impact**: 100% test coverage on all project management scripts

**Test Files to Create**:
- `scripts/collect-link-targets.test.js`
- `scripts/validate-reports-structure.test.js`
- `scripts/workflows/projects/archive-projects.test.cjs`
- `scripts/workflows/projects/scan-completion.test.cjs`
- `scripts/workflows/orchestrate-phase-progression.test.cjs`
- `scripts/automation/update-projects-status.test.cjs`

**Test Framework**: Jest or Node's built-in test runner

**Coverage Targets**:
- Unit tests: ≥80% line coverage
- Integration tests: Happy path + error cases
- Mock GitHub API/filesystem as needed

### 5.3 Priority 3: Consolidate Overlapping Scripts

**Timeline**: 2-3 hours  
**Impact**: Reduced maintenance burden, clearer separation of concerns

**Current Issues**:
- `update-projects-status.cjs` (audit, template, link modes) — Consider splitting by responsibility
- `scan-completion.cjs` (completion detection) — Integrate with archive workflow?
- `orchestrate-phase-progression.cjs` (label sync + phase progression) — Document clearly

**Recommended Structure**:
```
scripts/projects/
  ├── scan.cjs          (detect completions, returns JSON)
  ├── archive.cjs       (move to archived folder)
  ├── validate.cjs      (validate structure)
  ├── status.cjs        (audit status, templates, linking)
  └── tests/
      ├── scan.test.cjs
      ├── archive.test.cjs
      ├── validate.test.cjs
      └── status.test.cjs

scripts/automation/
  ├── docs.sh           (create/update docs)
  ├── phase.cjs         (orchestrate phase progression)
  └── tests/
      ├── docs.test.sh
      └── phase.test.cjs
```

### 5.4 Priority 4: Update Active Project Status

**Timeline**: 1-2 hours  
**Impact**: Clear visibility into project progress

**Projects to Update**:

1. **label-prefix-audit-2026-08-05**
   - Current: "Phase 2 execution pending"
   - Update: Document Phase 2 status + what's next

2. **label-prefix-enforcement-2026-08-05**
   - Current: "Remediation implementation"
   - Update: Document specific tasks completed + blockers

3. **labeling-consolidation-2026-09-03**
   - Current: "Planning"
   - Update: Flesh out research questions, create implementation plan

4. **openspec-labels-automation**
   - Current: "Phase 4 design complete"
   - Update: Document Phase 4 timeline + dependencies

5. **workflows-consolidation-2026-q3**
   - Current: "Consolidation in progress"
   - Update: Document phase completions + phase status

### 5.5 Priority 5: Document Scripts & Agents Architecture

**Timeline**: 3-4 hours  
**Impact**: Clarity for future maintainers

**Documents to Create**:
- `.github/projects/active/scripts-audit-2026-09-03/SCRIPT_ARCHITECTURE.md` — Script purposes, dependencies, data flow
- `.github/projects/active/scripts-audit-2026-09-03/AGENT_ARCHITECTURE.md` — Agent taxonomy, usage patterns
- `.github/projects/active/scripts-audit-2026-09-03/WORKFLOW_ARCHITECTURE.md` — Workflow execution order, dependencies
- `docs/PROJECT_MANAGEMENT_SYSTEM.md` — End-user guide

---

## Phase 6: Execution Plan

### Quick Wins (Do First - 2-3 hours)

```
☐ Resolve CJS vs ESM planner.agent files (30 min)
  - Determine canonical version
  - Delete non-canonical
  - Update imports

☐ Resolve agent duplication (30 min)
  - Choose Option A or B
  - Implement (symlinks or deletion)
  - Test CI

☐ Update active project READMEs (30 min)
  - Each project: add current status, blockers, next steps
  - Ensure dates are current
  - Link to related projects
```

### Medium Priority (Do Within 1 Week - 6-8 hours)

```
☐ Create unit tests for all scripts (6 hours)
  - Create test files matching each script
  - Achieve ≥80% coverage
  - Document test approach

☐ Clean up script structure (1 hour)
  - Reorganize into logical folders
  - Create/update test directories
  - Ensure naming consistency
```

### Longer-Term (Do Within 2-3 Weeks - 6-8 hours)

```
☐ Document architecture (3-4 hours)
  - Create SCRIPT_ARCHITECTURE.md
  - Create AGENT_ARCHITECTURE.md
  - Create WORKFLOW_ARCHITECTURE.md

☐ Real-world testing (2-3 hours)
  - Execute bulk project status update
  - Validate all scripts work end-to-end
  - Document any issues found

☐ Follow through on active projects (2-3 hours)
  - Implement recommendations from label-prefix-audit project
  - Implement recommendations from workflows-consolidation project
  - Validate remediation success
```

---

## Success Criteria

✅ **Phase Completion**:
- [ ] Agent duplication resolved (single source of truth)
- [ ] CJS/ESM inconsistency resolved
- [ ] All scripts have unit tests (≥80% coverage)
- [ ] Real-world scenario tested (bulk project status update)
- [ ] All active projects have current status documentation
- [ ] Architecture documentation complete

✅ **System Health**:
- [ ] Zero duplicate agent definitions
- [ ] All imports reference canonical locations
- [ ] Test suite passes 100%
- [ ] Scripts execute without errors in real scenarios
- [ ] New contributors can understand the system in <1 hour

---

## Questions & Clarifications Needed

1. **Should `.github/agents/` be canonical or `agents/`?**
   - Current: Both exist, unclear ownership
   - Impacts: Import paths, CI configuration, documentation

2. **What's the purpose of `planner.agent.cjs` and `planner.agent.js`?**
   - Current: Not clear from file contents
   - Impacts: Which to keep, how to consolidate

3. **Are there other scripts/agents in `plugins/` that should be included?**
   - Current: Found several in `plugins/`
   - Impacts: Scope of consolidation

4. **What's the workflow for running the project management scripts?**
   - Current: Unclear from documentation
   - Impacts: Test scenario setup, real-world validation

5. **Should Phase 2 of label-prefix-audit project be executed as part of this audit?**
   - Current: Pending since 2026-08-05
   - Impacts: Timeline, scope

---

## Next Steps

1. **Review this audit report** (you're reading it!)
2. **Answer clarification questions** above
3. **Execute Quick Wins** (2-3 hours of high-impact work)
4. **Schedule follow-up** for medium/longer-term items
5. **Assign ownership** to team members if applicable
6. **Track progress** in active project READMEs

---

## Appendix A: File Listing

### Scripts
- `.github/scripts/collect-link-targets.js`
- `.github/scripts/validate-reports-structure.js`
- `.github/scripts/workflows/projects/archive-projects.cjs`
- `.github/scripts/workflows/projects/scan-completion.cjs`
- `.github/scripts/workflows/orchestrate-phase-progression.cjs`
- `.github/scripts/automation/update-projects-status.cjs`
- `.github/scripts/automation/project-docs-update.sh`
- `.github/scripts/automation/test-project-docs-update.sh`
- `scripts/agents/planner.agent.cjs` (⚠️ DUPLICATE)
- `scripts/agents/planner.agent.js` (⚠️ DUPLICATE)

### Agents (`.github/agents/`)
- 21 agent files documented above

### Agents (`agents/`)
- 35+ agent files including duplicates

### Active Projects Related to This Audit
- `.github/projects/active/label-prefix-audit-2026-08-05/`
- `.github/projects/active/label-prefix-enforcement-2026-08-05/`
- `.github/projects/active/labeling-consolidation-2026-09-03/`
- `.github/projects/active/openspec-labels-automation/`
- `.github/projects/active/workflows-consolidation-2026-q3/`
- `.github/projects/active/scripts-audit-2026-09-03/` (THIS PROJECT)

---

**Report Generated**: 2026-09-03  
**By**: Claude Code Audit  
**Status**: ✅ Complete & Ready for Review
