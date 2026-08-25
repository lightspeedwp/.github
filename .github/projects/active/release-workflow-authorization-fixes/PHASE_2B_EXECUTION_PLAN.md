# Phase 2B: Script Migration & Path Updates

**Status:** READY TO EXECUTE  
**Phase 2A Reference:** [SCRIPTS_INVENTORY.md](./SCRIPTS_INVENTORY.md)  
**Owner:** Ash Shaw (DevOps)  
**Timeline:** v1.0 Weeks 1-2  
**Total Effort:** 16-20 hours  
**GitHub Issue:** [#1464](https://github.com/lightspeedwp/.github/issues/1464)

---

## Overview

Phase 2B executes the actual migration of 58 PORTABLE scripts from `.github/scripts/` to root `scripts/` folder, with comprehensive test coverage strategy.

**Key Decision:** Defer hybrid script refactoring to Phase 3 (defer 4-6 hour task to maintain v1.0 timeline)

---

## Revised Scope (From Phase 2A Audit)

**Original Estimate:** 5 portable scripts → **Actual: 58 portable scripts**

### Scripts to Move (58 total)

| Category | Count | Examples | Test Files |
|---|---|---|---|
| Validation Scripts | 25 | validate-changelog, validate-frontmatter | 14 test files |
| Utility Libraries | 16 | changelogUtils, commitParser, footerUtils | 8 test files |
| Changelog Utilities | 3 | extract-pr-entries, merge-entries | 2 integration tests |
| TOTAL PORTABLE | 58 | — | ~24 test files |

### Scripts to Keep in .github/scripts (79 total)

- Core agents (22): labeling, release, issue-type, etc.
- Workflow scripts (10): release, branch-policy, metrics
- GitHub-specific utilities (12): milestone checks, template validation
- Design/config tools (10+): DESIGN.md validation, skill packaging

### Scripts to Defer (27 HYBRID)

- Mark as "Future Refactoring Candidates"
- Document refactoring strategy in separate Phase 3 document
- Defer to balance Phase 2B timeline within v1.0

---

## Test Coverage Strategy

### Test Files to Migrate WITH Scripts (24 total)

**Validation Test Files (14):**

- validate-changelog.test.js
- validate-frontmatter.test.js
- And 12 other test files in `.github/scripts/validation/__tests__/`

**Agent Include Test Files (8):**

- badgeUtils.test.js, changelogUtils.test.js, footerUtils.test.js
- And 5 other test files in `.github/scripts/agents/includes/__tests__/`

**Changelog Integration Tests (2):**

- changelog-management.test.cjs
- merge-entries.integration.test.cjs

### Test Coverage Actions

**Task 2B.1: Audit Test Coverage**

- Verify each of 58 portable scripts has corresponding test file(s)
- Document test file locations and dependencies
- Identify any portable scripts lacking test coverage
- List 24 test files that will be moved with scripts

**Task 2B.2: Update Test Path References**

- Update all imports in test files to reference new script locations
- Verify all test paths resolve correctly
- Run test suite pre-migration to establish baseline

**Task 2B.3: Test Execution After Migration**

- Run full test suite after moving scripts
- Verify all 24 test files still pass
- Check for any module resolution errors
- Document any test failures and remediate

---

## Phase 2B Task Breakdown

### Task 2B.1: Create Directory Structure (1 hour)

Create root `scripts/` folder hierarchy:

```
scripts/
├── validation/              (25 validation scripts + 14 test files)
│   └── __tests__/
├── workflows/               (3 changelog utilities + 2 integration tests)
│   ├── changelog/
│   └── __tests__/
├── agents/                  (16 utility libraries + 8 test files)
│   ├── includes/
│   └── __tests__/
├── utils/                   (general utilities)
└── README.md                (portable scripts overview)
```

**Acceptance Criteria:**

- All 5 directories created
- README.md files in each category
- Directory structure matches Phase 2B plan
- No files in place yet (just structure)

### Task 2B.2: Move Portable Scripts Using git mv (5 hours)

Move scripts in logical batches to preserve git history:

**Batch 1: Validation Scripts (2 hours)**

- Move 25 validation scripts to scripts/validation/
- Move 14 validation test files to scripts/validation/**tests**/
- Commit: "refactor(scripts): Move validation scripts to portable root (#1464)"

**Batch 2: Changelog Utilities (1.5 hours)**

- Move 3 changelog utilities to scripts/workflows/changelog/
- Move 2 integration tests to scripts/workflows/changelog/**tests**/
- Commit: "refactor(scripts): Move changelog utilities to portable root (#1464)"

**Batch 3: Agent Utility Libraries (1.5 hours)**

- Move 16 portable agent utilities to scripts/agents/includes/
- Move 8 test files to scripts/agents/includes/**tests**/
- Commit: "refactor(scripts): Move agent utility libraries to portable root (#1464)"

**Acceptance Criteria:**

- All 58 portable scripts moved to `scripts/`
- All 24 test files moved alongside scripts
- Git history preserved (used `git mv`)
- 3 commits created, one per batch

### Task 2B.3: Update All Path References (6-8 hours)

Update references across 30-40 files:

**Subtask 2B.3.1: Update Workflow YAML Files (2 hours)**

- Update ~15 workflows with new paths
- Pattern: `../../../scripts/validation/` instead of `../../.github/scripts/validation/`
- Test workflow YAML syntax with `npm run lint:workflows`

**Subtask 2B.3.2: Update npm Scripts in package.json (1 hour)**

- Update ~20 npm scripts
- Pattern: `scripts/validation/` instead of `.github/scripts/validation/`

**Subtask 2B.3.3: Update Script-to-Script Imports (2 hours)**

- Update validation scripts importing parsers
- Update changelog utilities importing changelogUtils
- Test imports by running scripts locally

**Subtask 2B.3.4: Update Test File Imports (1.5 hours)**

- Update all test file imports to new paths
- Run test suite: `npm test`

**Subtask 2B.3.5: Documentation References (1 hour)**

- Update any markdown/docs that reference script paths
- Update CLAUDE.md references

**Acceptance Criteria:**

- 15 workflow YAML files updated and linted
- 20+ npm scripts updated and tested
- 10-15 script imports updated and tested
- 24 test file imports updated and passing
- 5+ documentation references updated
- Total: 30-40 files updated

### Task 2B.4: Comprehensive Testing (2 hours)

**Phase 1: Unit Tests (30 min)**

- Run full test suite
- Expected: All 24 moved test files pass

**Phase 2: npm Script Validation (30 min)**

- Test each validation npm script
- Expected: All scripts execute successfully

**Phase 3: Workflow Dry-Run (30 min)**

- Test key workflows with dry-run
- Expected: Workflows run without path errors

**Phase 4: Integration Test (30 min)**

- Test full workflow execution
- Expected: All checks pass

**Acceptance Criteria:**

- All 24 test files pass
- All npm scripts execute without errors
- 3+ key workflows run successfully in dry-run
- Full integration test suite passes
- No regressions in existing functionality

---

## Stacked PR Strategy

Create 4-5 stacked PRs for atomic, reviewable changes:

### PR 1: Create Directory Structure

- Create scripts/ directories and README templates
- Commits: 1
- Reviewable: Yes

### PR 2: Move Validation Scripts

- Move 25 validation scripts + 14 test files
- Commits: 1
- Reviewable: Yes

### PR 3: Move Workflow/Agent Utilities

- Move 3 changelog scripts + 16 agent utilities + 10 test files
- Commits: 2 (one per category)
- Reviewable: Yes

### PR 4: Update All Path References

- Update workflows, npm scripts, imports, tests, docs (~30-40 files)
- Commits: 5 (grouped by type)
- Reviewable: Yes

### PR 5: Phase 2B Completion (if needed)

- Any remaining cleanup
- Commits: 1

---

## Success Criteria for Phase 2B

- All 58 portable scripts moved to `scripts/` (preserving git history)
- All 24 test files moved alongside scripts
- All 30-40 path references updated
- Full test suite passes with new paths
- All npm scripts execute successfully
- Key workflows run without errors in dry-run
- 4-5 stacked PRs created and reviewed
- Zero test coverage loss
- Hybrid script refactoring deferred to Phase 3
- CLAUDE.md updated with portable assets documentation
- Ready to merge to develop

---

## Timeline & Effort Estimate

| Task | Duration |
|---|---|
| 2B.1: Create directory structure | 1h |
| 2B.2: Move 58 scripts + tests | 5h |
| 2B.3: Update path references | 6-8h |
| 2B.4: Comprehensive testing | 2h |
| **Total Phase 2B** | **16-20h** |

---

**Document Status:** READY FOR PHASE 2B EXECUTION  
**Phase 2A Dependency:** COMPLETE (see SCRIPTS_INVENTORY.md)  
**GitHub Issue:** #1464  
**Owner:** Ash Shaw (DevOps)  
**Created:** 2026-08-04
