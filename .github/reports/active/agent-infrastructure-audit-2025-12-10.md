---
file_type: "documentation"
title: "Agent Infrastructure Audit Report"
description: "Comprehensive audit of .github repository structure: agents, instructions, workflows, and scripts mapping"
category: "audits"
created_date: "2025-12-10"
last_updated: "2025-12-10"
author: "automation"
tags: ["audit", "agents", "infrastructure", "mapping", "validation"]
---

# Agent Infrastructure Audit Report

**Date**: 2025-12-10
**Scope**: Complete .github repository agent infrastructure
**Status**: CRITICAL ISSUES FOUND

## Executive Summary

This audit reveals **significant infrastructure gaps** in the agent-to-implementation mapping:

- **5 agent files** lack corresponding implementation scripts
- **1 workflow** references a non-existent script
- **1 script** has broken import paths (incorrect directory reference)
- **Several agents** lack proper instruction file mappings
- **Testing infrastructure** is incomplete

### Overall Health Score: 60/100

## 1. Agent-to-Instruction Mapping

### Complete Mappings (✅)

| Agent File           | Has Instruction File        | Status      |
| -------------------- | --------------------------- | ----------- |
| `labeling.agent.md`  | `labeling.instructions.md`  | ✅ Complete |
| `linting.agent.md`   | `linting.instructions.md`   | ✅ Complete |
| `meta.agent.md`      | `meta.instructions.md`      | ✅ Complete |
| `reporting.agent.md` | `reporting.instructions.md` | ✅ Complete |
| `issues.agent.md`    | `issues.instructions.md`    | ✅ Complete |

### Missing or Incomplete Mappings (❌)

| Agent File                   | Missing/Issue                   | Notes                                                                                                 |
| ---------------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `metrics.agent.md`           | ❌ No specific instruction file | Generic agent - may not need dedicated instructions                                                   |
| `planner.agent.md`           | ⚠️ Partial                      | References `spec-driven-workflow.instructions.md` but no dedicated `planner.instructions.md`          |
| `project-meta-sync.agent.md` | ❌ No instruction file          | Needs project management instructions                                                                 |
| `release.agent.md`           | ⚠️ Partial                      | References multiple docs but no dedicated `release.instructions.md`                                   |
| `template.agent.md`          | `template.instructions.md`      | ✅ Template pair complete                                                                             |
| `testing.agent.md`           | ⚠️ Multiple refs                | References `testing.instructions.md`, `tests.instructions.md`, and `coding-standards.instructions.md` |

### Non-Standard Agent Files (Mode Agents)

These are specialized mode agents without traditional mappings:

- `mode-demonstrate-understanding.agent.md` - No instruction file needed (mode-specific)
- `mode-document-reviewer.agent.md` - No instruction file needed (mode-specific)
- `mode-prd.agent.md` - No instruction file needed (mode-specific)
- `mode-thinking.agent.md` - No instruction file needed (mode-specific)
- `prompt-engineer.agent.md` - References `prompt.instructions.md` ✅

## 2. Agent-to-Workflow Mapping

### Complete Mappings (✅)

| Agent File                   | Workflow File           | Status      |
| ---------------------------- | ----------------------- | ----------- |
| `labeling.agent.md`          | `labeling.yml`          | ✅ Complete |
| `linting.agent.md`           | `linting.yml`           | ✅ Complete |
| `meta.agent.md`              | `meta.yml`              | ✅ Complete |
| `metrics.agent.md`           | `metrics.yml`           | ✅ Complete |
| `planner.agent.md`           | `planner.yml`           | ✅ Complete |
| `project-meta-sync.agent.md` | `project-meta-sync.yml` | ✅ Complete |
| `release.agent.md`           | `release.yml`           | ✅ Complete |
| `reporting.agent.md`         | `reporting.yml`         | ✅ Complete |
| `testing.agent.md`           | `testing.yml`           | ✅ Complete |

### Missing Workflows (❌)

| Agent File                 | Issue                    | Impact                                       |
| -------------------------- | ------------------------ | -------------------------------------------- |
| `issues.agent.md`          | ❌ No dedicated workflow | Issue management functionality not automated |
| `template.agent.md`        | N/A                      | Template file - no workflow needed           |
| Mode agents (4 files)      | N/A                      | Interactive agents - no workflows needed     |
| `prompt-engineer.agent.md` | N/A                      | Manual agent - no workflow needed            |

### Additional Workflows Without Direct Agent Files

| Workflow File   | Purpose              | Notes                                       |
| --------------- | -------------------- | ------------------------------------------- |
| `changelog.yml` | Changelog validation | Part of release process, no dedicated agent |
| `reviewer.yml`  | PR review automation | Has script but no agent file                |

## 3. Agent-to-Script Mapping

### Complete Mappings (✅)

| Agent File                   | Script Path                                 | Workflow Reference     | Status                   |
| ---------------------------- | ------------------------------------------- | ---------------------- | ------------------------ |
| `labeling.agent.md`          | `scripts/agents/labeling.agent.js`          | `labeling.yml` line 99 | ✅ Complete              |
| `linting.agent.md`           | `scripts/agents/linting.agent.js`           | `linting.yml` line 16  | ✅ Complete              |
| `meta.agent.md`              | `scripts/agents/meta.agent.js`              | `meta.yml` line 88     | ✅ Complete              |
| `metrics.agent.md`           | `scripts/agents/metrics.agent.js`           | `metrics.yml` line 31  | ✅ Complete (npm script) |
| `project-meta-sync.agent.md` | `scripts/agents/project-meta-sync.agent.js` | N/A (uses actions)     | ✅ Complete              |
| `release.agent.md`           | `scripts/agents/release.agent.js`           | `release.yml` line 53  | ✅ Complete              |
| `reporting.agent.md`         | `scripts/agents/reporting.agent.js`         | N/A (manual)           | ✅ Exists                |

### Missing Scripts (❌ CRITICAL)

| Agent File                 | Workflow      | Issue                                                             | Impact                                              |
| -------------------------- | ------------- | ----------------------------------------------------------------- | --------------------------------------------------- |
| `planner.agent.md`         | `planner.yml` | ❌ **CRITICAL**: `scripts/agents/planner.agent.js` does not exist | **Workflow will FAIL**                              |
| `testing.agent.md`         | `testing.yml` | ❌ `scripts/agents/testing.agent.js` does not exist               | Uses npm scripts instead, but agent file misleading |
| `issues.agent.md`          | N/A           | ❌ No implementation script                                       | Issue type detection not automated                  |
| `template.agent.md`        | N/A           | N/A                                                               | Template file - no script needed                    |
| Mode agents (4 files)      | N/A           | N/A                                                               | Interactive agents - no scripts needed              |
| `prompt-engineer.agent.md` | N/A           | N/A                                                               | Manual agent - no script needed                     |

### Scripts Without Agent Files

| Script Path                          | Issue                                                                                     |
| ------------------------------------ | ----------------------------------------------------------------------------------------- |
| `scripts/agents/reviewer.agent.js`   | ✅ Has workflow (`reviewer.yml`) but no `.agent.md` file in `.github/agents/`             |
| `scripts/agents/template.agent.js`   | ✅ Has corresponding `template.agent.md`                                                  |
| `scripts/agents/issue-type.agent.js` | ⚠️ Old implementation for issue type detection - superseded by unified `issues.agent.md`? |

## 4. Script Dependencies Analysis

### Labeling Agent (`labeling.agent.js`)

**Imports**: All exist ✅

```javascript
import {
  fetchCanonicalLabels,
  buildLabelAliasMap,
  findStandardLabel,
} from "./includes/label-lookup.js";
import {
  enforceOneHotLabels,
  applyDefaultStatus,
  applyDefaultPriority,
  applyDefaultType,
} from "./includes/status-enforcer.js";
import {
  fetchLabelerRules,
  applyLabelerRules,
} from "./includes/labeler-utils.js";
import {
  buildLabelingReport,
  formatErrors,
} from "./includes/label-reporting.js";
```

**Status**: ✅ All dependencies exist in `scripts/agents/includes/`

### Meta Agent (`meta.agent.js`)

**Imports**: ❌ **BROKEN PATHS**

```javascript
import { ensureFooter } from "../../scripts/includes/header-footer.js"; // ❌ WRONG PATH
import { updateBadgesInReadme } from "../../scripts/includes/badges.js"; // ❌ WRONG PATH
```

**Issue**: References `../../scripts/includes/` but should be `./includes/`

**Actual Locations**:

- ✅ `scripts/agents/includes/header-footer.js` EXISTS
- ✅ `scripts/agents/includes/badges.js` EXISTS

**Status**: ❌ **CRITICAL** - Script has incorrect import paths

### Release Agent (`release.agent.js`)

**Imports**: All exist ✅

```javascript
const changelogUtilsPath = path.join(__dirname, "includes/changelogUtils.cjs");
const validateVersionPath = path.join(
  __dirname,
  "../validation/validate-version.cjs",
);
```

**Status**: ✅ All dependencies exist

### Other Scripts

All other agent scripts have verified dependencies that exist in the correct locations.

## 5. Broken References in Agent Files

### Agent File: `labeling.agent.md`

**Line 208**: Reference to coding standards

```markdown
- [Coding Standards](../.github/instructions/coding-standards.instructions.md)
```

**Issue**: ⚠️ Path has extra `../.github/` - should be `../instructions/coding-standards.instructions.md`

### Agent File: `planner.agent.md`

**Line 318**: References to instructions

```markdown
- [Spec-Driven Workflow](.github/instructions/spec-driven-workflow.instructions.md)
- [Coding Standards](.github/instructions/coding-standards.instructions.md)
```

**Issue**: ⚠️ Paths missing leading `..` - should be `../.github/instructions/...`

### Agent File: `testing.agent.md`

**Line 32-39**: Multiple broken references

```markdown
- path: ".github/agents/testing.agent.js" # ❌ DOES NOT EXIST
- path: ".github/workflows/testing.yml" # ✅ EXISTS
- path: ".github/instructions/testing.instructions.md" # ❌ DOES NOT EXIST
- path: ".github/instructions/tests.instructions.md" # ❌ DOES NOT EXIST
```

**Issue**: ❌ References non-existent files

### Agent File: `issues.agent.md`

**Lines 180-186**: References to non-existent files

```markdown
- [Issue Types Configuration](.github/issue-types.yml) # ✅ EXISTS
- [Label Definitions](.github/labels.yml) # ✅ EXISTS
- [Labeler Rules](.github/labeler.yml) # ✅ EXISTS
- [Issue Submission Guide](docs/ISSUE_CREATION_GUIDE.md) # ❌ NOT VERIFIED
- [Label Strategy](docs/LABEL_STRATEGY.md) # ❌ NOT VERIFIED
- [Automation Governance](docs/AUTOMATION_GOVERNANCE.md) # ❌ NOT VERIFIED
```

## 6. Workflow File Issues

### ❌ CRITICAL: `planner.yml`

**Line 20**: References non-existent script

```yaml
- name: Planner
  run: node scripts/agents/planner.agent.js # ❌ FILE DOES NOT EXIST
```

**Impact**: Workflow will fail on every execution

**Recommendation**:

1. Create `scripts/agents/planner.agent.js`, OR
2. Remove/disable the workflow, OR
3. Update workflow to use alternative implementation

### ⚠️ `testing.yml` (aka `CI`)

**Line 16**: Uses npm script instead of direct agent

```yaml
- run: npm run check # Runs: npm run lint:all && npm run test
```

**Issue**: Testing agent file exists but no corresponding `.agent.js` script. Workflow works but documentation is misleading.

**Recommendation**: Update `testing.agent.md` to clarify it's configuration-based, not script-based.

### ✅ `metrics.yml`

**Line 31**: Uses npm script

```yaml
- name: Run metrics
  run: npm run metrics:ci
```

**Status**: ✅ Correct - metrics uses npm scripts, not direct agent execution

### ⚠️ `meta.yml`

**Line 88**: References script with broken imports

```yaml
- name: Run Meta Agent
  run: node scripts/agents/meta.agent.js
```

**Issue**: Script exists but has broken import paths (see section 4)

### ✅ All Other Workflows

All other workflows correctly reference existing scripts and configurations.

## 7. Missing Test Files

### Scripts With Missing Tests

| Script                       | Expected Test Path                                         | Status                       |
| ---------------------------- | ---------------------------------------------------------- | ---------------------------- |
| `labeling.agent.js`          | `scripts/agents/__tests__/labeling.agent.test.js`          | ❌ Deleted in recent cleanup |
| `meta.agent.js`              | `scripts/agents/__tests__/meta.agent.test.js`              | ❌ Never existed             |
| `metrics.agent.js`           | `scripts/agents/__tests__/metrics.agent.test.js`           | ❌ Never existed             |
| `planner.agent.js`           | `scripts/agents/__tests__/planner.agent.test.js`           | ❌ Script doesn't exist      |
| `project-meta-sync.agent.js` | `scripts/agents/__tests__/project-meta-sync.agent.test.js` | ❌ Never existed             |
| `release.agent.js`           | `scripts/agents/__tests__/release.agent.test.js`           | ❌ Never existed             |
| `reporting.agent.js`         | `scripts/agents/__tests__/reporting.agent.test.js`         | ❌ Never existed             |
| `reviewer.agent.js`          | `scripts/agents/__tests__/reviewer.agent.test.js`          | ❌ Deleted in recent cleanup |
| `template.agent.js`          | `scripts/agents/__tests__/template.agent.test.js`          | ❌ Deleted in recent cleanup |
| `linting.agent.js`           | `scripts/agents/__tests__/linting.agent.test.js`           | ❌ Never existed             |
| `issue-type.agent.js`        | `scripts/agents/__tests__/issue-type.agent.test.js`        | ❌ Deleted in recent cleanup |

### Includes With Missing Tests

| Include File               | Expected Test Path                                 | Status     |
| -------------------------- | -------------------------------------------------- | ---------- |
| `label-heuristics.js`      | `includes/__tests__/label-heuristics.test.js`      | ❌ Deleted |
| `label-lookup.js`          | `includes/__tests__/label-lookup.test.js`          | ❌ Deleted |
| `label-reporting.js`       | `includes/__tests__/label-reporting.test.js`       | ❌ Deleted |
| `label-sync.js`            | `includes/__tests__/label-sync.test.js`            | ❌ Deleted |
| `labeler-utils.js`         | `includes/__tests__/labeler-utils.test.js`         | ❌ Deleted |
| `report-writer.js`         | `includes/__tests__/report-writer.test.js`         | ❌ Deleted |
| `status-enforcer.js`       | `includes/__tests__/status-enforcer.test.js`       | ❌ Deleted |
| `type-lookup.js`           | `includes/__tests__/type-lookup.test.js`           | ❌ Deleted |
| `yaml-validator.js`        | `includes/__tests__/yaml-validator.test.js`        | ❌ Deleted |
| `check-template-labels.js` | `includes/__tests__/check-template-labels.test.js` | ❌ Deleted |

### Test Coverage Status

**Overall**: ❌ **0% test coverage for agent scripts**

**Note**: According to git status, many test files were recently deleted:

```
D  scripts/agents/__tests__/agent-performance.test.js
D  scripts/agents/__tests__/agent-workflows.test.js
D  scripts/agents/__tests__/issue-type.agent.test.js
D  scripts/agents/__tests__/label-standardization.agent.test.js
D  scripts/agents/__tests__/labeling.agent.integration.test.js
D  scripts/agents/__tests__/labeling.agent.test.js
D  scripts/agents/__tests__/planner.agent.test.js
D  scripts/agents/__tests__/reviewer.agent.test.js
D  scripts/agents/__tests__/template.agent.test.js
D  scripts/agents/__tests__/test-mock-validation.test.js
```

## 8. Complete Agent Infrastructure Mapping Table

| Agent File                   | Instruction File               | Workflow                   | Script                          | Tests      | Status               |
| ---------------------------- | ------------------------------ | -------------------------- | ------------------------------- | ---------- | -------------------- |
| `agent.md`                   | N/A (index)                    | N/A                        | N/A                             | N/A        | ✅ Index file        |
| `issues.agent.md`            | `issues.instructions.md` ✅    | ❌ None                    | ❌ Missing                      | ❌ Missing | 🔴 No automation     |
| `labeling.agent.md`          | `labeling.instructions.md` ✅  | `labeling.yml` ✅          | `labeling.agent.js` ✅          | ❌ Deleted | 🟡 Works, no tests   |
| `linting.agent.md`           | `linting.instructions.md` ✅   | `linting.yml` ✅           | `linting.agent.js` ✅           | ❌ Missing | 🟡 Works, no tests   |
| `meta.agent.md`              | `meta.instructions.md` ✅      | `meta.yml` ✅              | `meta.agent.js` ⚠️              | ❌ Missing | 🔴 Broken imports    |
| `metrics.agent.md`           | ❌ None                        | `metrics.yml` ✅           | `metrics.agent.js` ✅           | ❌ Missing | 🟡 Works, no tests   |
| `planner.agent.md`           | ⚠️ Partial                     | `planner.yml` ✅           | ❌ **MISSING**                  | ❌ Missing | 🔴 **BROKEN**        |
| `project-meta-sync.agent.md` | ❌ None                        | `project-meta-sync.yml` ✅ | `project-meta-sync.agent.js` ✅ | ❌ Missing | 🟡 Works, no tests   |
| `release.agent.md`           | ⚠️ Partial                     | `release.yml` ✅           | `release.agent.js` ✅           | ❌ Missing | 🟡 Works, no tests   |
| `reporting.agent.md`         | `reporting.instructions.md` ✅ | `reporting.yml` ✅         | `reporting.agent.js` ✅         | ❌ Missing | 🟡 Works, no tests   |
| `template.agent.md`          | `template.instructions.md` ✅  | N/A                        | `template.agent.js` ✅          | ❌ Deleted | ✅ Template          |
| `testing.agent.md`           | ⚠️ Multiple                    | `testing.yml` ✅           | ❌ Missing                      | ❌ Missing | 🟡 Uses npm scripts  |
| **Reviewer** (no .agent.md)  | ❌ None                        | `reviewer.yml` ✅          | `reviewer.agent.js` ✅          | ❌ Deleted | 🟡 Missing agent doc |
| **Issue Type** (old)         | N/A                            | N/A                        | `issue-type.agent.js` ✅        | ❌ Deleted | ⚠️ Legacy?           |

**Legend**:

- 🔴 Critical issues - broken or non-functional
- 🟡 Works but incomplete (missing tests/docs)
- ✅ Complete and functional

## 9. Critical Issues Summary

### Must Fix (Blocking)

1. **`planner.yml` workflow references non-existent `planner.agent.js`**
   - **Impact**: HIGH - Workflow fails on every run
   - **Action**: Create script OR disable workflow

2. **`meta.agent.js` has broken import paths**
   - **Impact**: HIGH - Script will fail at runtime
   - **Action**: Fix import paths from `../../scripts/includes/` to `./includes/`

3. **`issues.agent.md` has no implementation**
   - **Impact**: MEDIUM - Documented functionality not automated
   - **Action**: Create workflow and script OR mark as manual-only

### Should Fix (Quality)

1. **Zero test coverage for agent scripts**
   - **Impact**: MEDIUM - Cannot verify functionality, regression risk
   - **Action**: Restore or recreate critical tests

2. **`testing.agent.md` references non-existent script**
   - **Impact**: LOW - Misleading documentation
   - **Action**: Update agent file to clarify npm-script-based approach

3. **`reviewer.agent.js` has no agent documentation file**
   - **Impact**: LOW - Undocumented automation
   - **Action**: Create `reviewer.agent.md` in `.github/agents/`

4. **Multiple agents have missing or incomplete instruction files**
   - **Impact**: LOW - Inconsistent documentation
   - **Action**: Create missing instruction files

## 10. Recommendations

### Immediate Actions (This Sprint)

1. **Fix `meta.agent.js` import paths** - 15 minutes

   ```javascript
   // Change from:
   import { ensureFooter } from "../../scripts/includes/header-footer.js";
   // To:
   import { ensureFooter } from "./includes/header-footer.js";
   ```

2. **Fix `planner.yml` workflow** - Choose one:
   - Option A: Create minimal `scripts/agents/planner.agent.js` stub
   - Option B: Disable workflow by adding condition `if: false`
   - Option C: Remove workflow file entirely

3. **Document current state** - 30 minutes
   - Add note to `planner.agent.md` that automation is pending
   - Update `testing.agent.md` to clarify npm-script approach

### Short-term Actions (Next Sprint)

1. **Create missing instruction files** - 2-3 hours
   - `metrics.instructions.md`
   - `planner.instructions.md`
   - `project-meta-sync.instructions.md`
   - `release.instructions.md`

2. **Create `reviewer.agent.md`** - 1 hour
   - Document existing reviewer.agent.js functionality
   - Add to agent index

3. **Audit and fix broken file references** - 1 hour
   - Fix path references in agent files
   - Verify all referenced docs exist

### Long-term Actions (Future Sprints)

1. **Restore test coverage** - 1-2 weeks
   - Prioritize core agents: labeling, meta, release
   - Aim for 80% coverage on critical paths

2. **Implement issues automation** - 3-5 days
   - Create workflow
   - Create script
   - Integrate with labeling agent

3. **Standardize agent structure** - 1 week
   - Ensure all agents follow template pattern
   - Complete instruction files for all agents
   - Document agent development process

## 11. Agent Readiness Matrix

| Agent        | Spec | Instructions | Workflow | Script | Tests | Overall |
| ------------ | ---- | ------------ | -------- | ------ | ----- | ------- |
| Labeling     | ✅   | ✅           | ✅       | ✅     | ❌    | 80%     |
| Linting      | ✅   | ✅           | ✅       | ✅     | ❌    | 80%     |
| Meta         | ✅   | ✅           | ✅       | ⚠️     | ❌    | 60%     |
| Metrics      | ✅   | ❌           | ✅       | ✅     | ❌    | 60%     |
| Planner      | ✅   | ⚠️           | ✅       | ❌     | ❌    | 40%     |
| Project Sync | ✅   | ❌           | ✅       | ✅     | ❌    | 60%     |
| Release      | ✅   | ⚠️           | ✅       | ✅     | ❌    | 70%     |
| Reporting    | ✅   | ✅           | ✅       | ✅     | ❌    | 80%     |
| Reviewer     | ❌   | ❌           | ✅       | ✅     | ❌    | 40%     |
| Testing      | ✅   | ⚠️           | ✅       | ❌     | ❌    | 50%     |
| Issues       | ✅   | ✅           | ❌       | ❌     | ❌    | 40%     |

**Average Readiness**: 62%

## 12. Files Referenced in Audit

### Agent Files (18 total)

- `/Users/ash/Studio/.github/.github/agents/agent.md`
- `/Users/ash/Studio/.github/.github/agents/issues.agent.md`
- `/Users/ash/Studio/.github/.github/agents/labeling.agent.md`
- `/Users/ash/Studio/.github/.github/agents/linting.agent.md`
- `/Users/ash/Studio/.github/.github/agents/meta.agent.md`
- `/Users/ash/Studio/.github/.github/agents/metrics.agent.md`
- `/Users/ash/Studio/.github/.github/agents/planner.agent.md`
- `/Users/ash/Studio/.github/.github/agents/project-meta-sync.agent.md`
- `/Users/ash/Studio/.github/.github/agents/release.agent.md`
- `/Users/ash/Studio/.github/.github/agents/reporting.agent.md`
- `/Users/ash/Studio/.github/.github/agents/template.agent.md`
- `/Users/ash/Studio/.github/.github/agents/testing.agent.md`
- `/Users/ash/Studio/.github/.github/agents/mode-*.agent.md` (4 files)
- `/Users/ash/Studio/.github/.github/agents/prompt-engineer.agent.md`

### Workflow Files (11 total)

- `/Users/ash/Studio/.github/.github/workflows/labeling.yml`
- `/Users/ash/Studio/.github/.github/workflows/linting.yml`
- `/Users/ash/Studio/.github/.github/workflows/meta.yml`
- `/Users/ash/Studio/.github/.github/workflows/metrics.yml`
- `/Users/ash/Studio/.github/.github/workflows/planner.yml`
- `/Users/ash/Studio/.github/.github/workflows/project-meta-sync.yml`
- `/Users/ash/Studio/.github/.github/workflows/release.yml`
- `/Users/ash/Studio/.github/.github/workflows/reporting.yml`
- `/Users/ash/Studio/.github/.github/workflows/reviewer.yml`
- `/Users/ash/Studio/.github/.github/workflows/testing.yml`
- `/Users/ash/Studio/.github/.github/workflows/changelog.yml`

### Script Files (10 total)

- `/Users/ash/Studio/.github/scripts/agents/labeling.agent.js`
- `/Users/ash/Studio/.github/scripts/agents/linting.agent.js`
- `/Users/ash/Studio/.github/scripts/agents/meta.agent.js`
- `/Users/ash/Studio/.github/scripts/agents/metrics.agent.js`
- `/Users/ash/Studio/.github/scripts/agents/project-meta-sync.agent.js`
- `/Users/ash/Studio/.github/scripts/agents/release.agent.js`
- `/Users/ash/Studio/.github/scripts/agents/reporting.agent.js`
- `/Users/ash/Studio/.github/scripts/agents/reviewer.agent.js`
- `/Users/ash/Studio/.github/scripts/agents/template.agent.js`
- `/Users/ash/Studio/.github/scripts/agents/issue-type.agent.js`

### Instruction Files (26 total)

All files in `/Users/ash/Studio/.github/.github/instructions/*.instructions.md`

## Appendix A: Quick Reference Commands

### Verify Critical Files Exist

```bash
# Check planner script (currently missing)
test -f scripts/agents/planner.agent.js && echo "EXISTS" || echo "MISSING"

# Check meta agent imports
grep -n "from.*includes" scripts/agents/meta.agent.js

# List all agent scripts
ls -1 scripts/agents/*.agent.js

# List all workflow files
ls -1 .github/workflows/*.yml
```

### Fix Meta Agent Imports

```bash
# Current broken imports in scripts/agents/meta.agent.js:
# Line 4: import { ensureFooter } from "../../scripts/includes/header-footer.js";
# Line 5: import { updateBadgesInReadme } from "../../scripts/includes/badges.js";

# Should be:
# Line 4: import { ensureFooter } from "./includes/header-footer.js";
# Line 5: import { updateBadgesInReadme } from "./includes/badges.js";
```

## Appendix B: Audit Methodology

1. **File Discovery**: Used glob patterns to discover all agent, workflow, script, and instruction files
2. **Content Analysis**: Read each agent file to extract references and dependencies
3. **Cross-Reference Validation**: Verified existence of referenced files
4. **Dependency Tracing**: Analyzed import statements in scripts to verify include files exist
5. **Workflow Validation**: Checked each workflow's script references against actual file system
6. **Test Coverage Analysis**: Checked for corresponding test files in `__tests__/` directories

## Appendix C: Next Steps Tracking

Create these GitHub issues to track remediation:

1. **[CRITICAL] Fix meta.agent.js broken imports** - Label: `priority:critical`, `type:bug`
2. **[CRITICAL] Fix or disable planner.yml workflow** - Label: `priority:critical`, `type:bug`
3. **[HIGH] Create missing instruction files** - Label: `priority:high`, `type:documentation`
4. **[MEDIUM] Restore agent test coverage** - Label: `priority:normal`, `type:test`
5. **[MEDIUM] Implement issues agent automation** - Label: `priority:normal`, `type:feature`
6. **[LOW] Create reviewer.agent.md documentation** - Label: `priority:minor`, `type:documentation`

---

**Report Generated**: 2025-12-10
**Audit Tool**: Claude Code Agent SDK
**Report Location**: `.githu./.github/reports/audits/agent-infrastructure-audit-2025-12-10.md`
