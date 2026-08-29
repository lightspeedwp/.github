---
file_type: documentation
title: "Node.js 24 Upgrade — Execution Prompts"
description: "Copy-paste ready prompts for each phase of the Node.js 24 upgrade"
created_date: 2026-08-29
---

# Node.js 24 Upgrade — Execution Prompts

Use these self-contained prompts for each phase of the Node.js 24 upgrade. Copy the entire prompt into Claude Code and follow step-by-step instructions.

---

## Phase 1: Audit & Documentation

**Duration:** 30 minutes  
**Copy this entire section and paste into Claude Code:**

```
You are executing Phase 1 of the Node.js 24 upgrade project for LightSpeed .github repository.

TASK: Audit current Node.js configuration and document the upgrade scope.

CONTEXT:
- Repository: lightspeedwp/.github
- Current State: .nvmrc specifies Node 24, but package.json requires >=22.0.0
- Goal: Align package.json to Node 24
- Branch: feat/nodejs-upgrade-24 (already created)

PHASE 1 OBJECTIVES:
1. Inventory current Node versions across all workflows
2. Document dependency update scope
3. Create test matrix for validation phase
4. Identify potential breaking changes
5. Generate baseline metrics

EXECUTION STEPS:

1. CURRENT STATE INVENTORY
   - Verify local Node: run `node --version`
   - Identify all workflows referencing Node versions
   - Count total workflows affected
   - Document in INVENTORY.md

2. DEPENDENCY ANALYSIS
   - Run `npm outdated` to see available updates
   - Estimate packages that will update
   - Identify major version changes
   - Flag any deprecated packages

3. BREAKING CHANGES RESEARCH
   - Review Node.js 24 release notes (V8 engine changes)
   - Identify deprecated APIs
   - Research specific dependency breaking changes
   - Document findings in BREAKING_CHANGES_AUDIT.md

4. CREATE TEST MATRIX
   - List all test categories (unit, integration, validation)
   - Document npm scripts that must pass
   - Identify performance requirements
   - Save to TEST_MATRIX.md

SUCCESS CRITERIA:
- INVENTORY.md created with current state
- TEST_MATRIX.md created with all test categories
- BREAKING_CHANGES_AUDIT.md initiated with findings
- All workflows counted and catalogued
- Dependency scope documented

FILES TO CREATE/MODIFY:
- .github/projects/active/nodejs-upgrade-2026-q4/INVENTORY.md (new)
- .github/projects/active/nodejs-upgrade-2026-q4/TEST_MATRIX.md (new)
- .github/projects/active/nodejs-upgrade-2026-q4/BREAKING_CHANGES_AUDIT.md (updated)

Do not proceed to Phase 2 until all success criteria are met.
```

---

## Phase 2: Local Upgrade

**Duration:** 45 minutes  
**Copy this entire section and paste into Claude Code:**

```
You are executing Phase 2 of the Node.js 24 upgrade project for LightSpeed .github repository.

TASK: Upgrade package.json and all dependencies to Node 24 compatibility.

CONTEXT:
- Branch: feat/nodejs-upgrade-24 (on local machine)
- Phase 1: COMPLETE ✓
- Goal: Update package.json engines and run npm update

PHASE 2 OBJECTIVES:
1. Update package.json to require Node >=24.0.0
2. Upgrade all dependencies to Node 24-compatible versions
3. Verify no critical vulnerabilities
4. Commit changes atomically

EXECUTION STEPS:

1. UPDATE package.json ENGINES FIELD
   File: package.json
   Change:
     "engines": {
       "node": ">=24.0.0",
       "npm": ">=10.0.0"
     }
   
   Reasoning: Node 24 is required for advanced GitHub API scripts

2. RUN DEPENDENCY UPDATES
   - Execute: npm update
   - Expected: 50–100 packages updated
   - Wait for completion

3. CHECK FOR VULNERABILITIES
   - Execute: npm audit
   - Verify: No high/critical vulnerabilities
   - Document findings

4. UPDATE LOCK FILE
   - Execute: npm ci
   - Verify: package-lock.json updated
   - Check for consistency

5. COMMIT LOCALLY (DO NOT PUSH YET)
   - Stage changes: git add package.json package-lock.json
   - Commit: git commit -m "chore: upgrade to Node.js 24 — update package.json engine requirement"
   - Save commit SHA for reference

SUCCESS CRITERIA:
- package.json updated to Node >=24.0.0
- npm update completed successfully
- npm audit shows no high/critical vulnerabilities
- package-lock.json consistent and staged
- Commit created locally (not pushed)

FAILURE RECOVERY:
- If package vulnerabilities found: Document in BREAKING_CHANGES_AUDIT.md
- If lock file conflicts: Run npm ci again
- If npm fails: Check Node 24 installation, verify npm version >=10.0.0

NEXT PHASE: Phase 3 (Test & Validation)
```

---

## Phase 3: Test & Validation

**Duration:** 1–1.5 hours  
**Copy this entire section and paste into Claude Code:**

```
You are executing Phase 3 of the Node.js 24 upgrade project for LightSpeed .github repository.

TASK: Validate all tests pass with Node 24 and identify breaking changes.

CONTEXT:
- Branch: feat/nodejs-upgrade-24
- Phase 2: COMPLETE ✓ (package.json and dependencies updated)
- Goal: Full test suite + all validations pass
- This is a CRITICAL BLOCKER phase

PHASE 3 OBJECTIVES:
1. Run full test suite with Node 24
2. Execute all validation scripts
3. Verify advanced GitHub API scripts compatibility
4. Performance benchmark comparison
5. Document all findings

EXECUTION STEPS:

1. RUN COMPLETE TEST SUITE
   - Execute: npm test
   - Document: Total test count and pass rate
   - Expected: All tests pass (85+)
   - If failures: Document each in BREAKING_CHANGES_AUDIT.md

2. RUN ALL VALIDATION SCRIPTS
   - Execute: npm run validate:all
   - This runs all 9 validations:
     * validate:structure
     * validate:skills
     * validate:plugins
     * validate:links
     * validate:frontmatter
     * validate:agents
     * validate:workflows
     * validate:changelog
     * validate:json:all
   - If any fail: Document root cause and fix

3. VERIFY ADVANCED GITHUB API SCRIPTS
   - Identify all GitHub API scripts in your codebase
   - Test each script with Node 24
   - Verify: Event handlers work correctly
   - Verify: API integrations function properly
   - Document any issues in BREAKING_CHANGES_AUDIT.md

4. PERFORMANCE BENCHMARKING
   - Run: npm install (measure time)
   - Compare to Node 22 baseline
   - Note: Variance >15% is concerning
   - Document baseline metrics

5. DOCUMENT ALL FINDINGS
   - Update BREAKING_CHANGES_AUDIT.md with:
     * All test failures (if any)
     * Root cause analysis
     * Proposed fixes
     * Resolution status
   - Categorise failures:
     * Code issue (fix in codebase)
     * Dependency issue (pin version if needed)
     * Infrastructure issue (document, escalate)

SUCCESS CRITERIA (MUST ALL BE TRUE):
- All unit tests passing (85+)
- All validation scripts passing (9/9)
- Advanced GitHub API scripts operational
- No high/critical breaking changes
- Performance within ±15% of Node 22 baseline
- BREAKING_CHANGES_AUDIT.md completed

CRITICAL GATES:
- IF ANY TEST FAILS: Stop and troubleshoot before proceeding
- IF ANY VALIDATION FAILS: Identify root cause and fix
- IF PERFORMANCE DEGRADES >15%: Investigate and document

TROUBLESHOOTING:

Test Failure Recovery:
1. Identify failing test
2. Determine root cause
3. Fix code OR pin problematic package
4. Re-run tests
5. Document in BREAKING_CHANGES_AUDIT.md

Dependency Issue:
1. Identify problematic package
2. Check Node 24 compatibility
3. If incompatible: Pin to known-good version
4. Re-run tests
5. Document constraint reason

ROLLBACK (IF CRITICAL):
- git reset --hard HEAD~1
- Discard branch
- Report findings to stakeholders

NEXT PHASE: Phase 4 (Workflow Standardisation) — only if Phase 3 PASSES ✓
```

---

## Phase 4: Workflow Standardisation

**Duration:** 45 minutes  
**Copy this entire section and paste into Claude Code:**

```
You are executing Phase 4 of the Node.js 24 upgrade project for LightSpeed .github repository.

TASK: Standardise all workflows to use .nvmrc for Node version specification.

CONTEXT:
- Branch: feat/nodejs-upgrade-24
- Phase 3: COMPLETE ✓ (all tests passing)
- Goal: All workflows use .nvmrc (single source of truth)

PHASE 4 OBJECTIVES:
1. Identify workflows with explicit Node versions
2. Replace explicit versions with node-version-file: '.nvmrc'
3. Verify workflow syntax
4. Ensure consistency across all workflows

EXECUTION STEPS:

1. AUDIT WORKFLOWS
   - List all workflows in .github/workflows/
   - For each workflow, identify Node version specification:
     * Explicit version (e.g., node-version: '24') — CHANGE THESE
     * Using .nvmrc — VERIFY UNCHANGED
     * Using lts/* — DOCUMENT REASON (if any)

2. STANDARDISE TO .nvmrc
   - For each workflow with explicit version:
     Replace this:
       - uses: actions/setup-node@v4
         with:
           node-version: '24'
     
     With this:
       - uses: actions/setup-node@v4
         with:
           node-version-file: '.nvmrc'

3. VERIFY SYNTAX
   - Execute: npm run lint:workflows
   - Verify: All YAML syntax valid
   - Verify: No references to deprecated versions

4. DOCUMENT CHANGES
   - List all workflows updated (count: X/16)
   - Note any workflows that keep explicit versions (with reasons)
   - Verify consistency across all workflows

5. COMMIT WORKFLOW CHANGES
   - Stage: git add .github/workflows/**/*.yml
   - Commit: git commit -m "chore: standardise workflows to use .nvmrc for Node 24"

SUCCESS CRITERIA:
- All workflows use .nvmrc (16/16) OR documented exception
- No explicit Node versions hardcoded
- Workflow syntax validation passes
- Consistent format across all workflows
- Commit created locally (not pushed)

WORKFLOW CATEGORIES TO CHECK:
- checks.yml (CI validation)
- testing.yml (Unit tests)
- linting.yml (Code quality)
- release.yml (Release process)
- meta.yml (Metadata & automation)
- changelog.yml (Changelog management)
- [All other workflows in .github/workflows/]

NEXT PHASE: Phase 5 (CI/CD Verification & Merge)
```

---

## Phase 5: CI/CD Verification & Merge

**Duration:** 30 minutes  
**Copy this entire section and paste into Claude Code:**

```
You are executing Phase 5 of the Node.js 24 upgrade project for LightSpeed .github repository.

TASK: Push changes to remote, create PR, merge to develop, and initiate post-merge monitoring.

CONTEXT:
- Branch: feat/nodejs-upgrade-24
- Phase 4: COMPLETE ✓ (all commits staged locally)
- Goal: Merge to develop with passing CI

PHASE 5 OBJECTIVES:
1. Push branch to remote
2. Create pull request with comprehensive description
3. Monitor all CI checks
4. Merge to develop
5. Initiate post-merge monitoring

EXECUTION STEPS:

1. PUSH BRANCH TO REMOTE
   - Execute: git push -u origin feat/nodejs-upgrade-24
   - Verify: Branch pushed successfully

2. CREATE PULL REQUEST
   - Go to GitHub: https://github.com/lightspeedwp/.github
   - Click "New Pull Request"
   - Base: develop
   - Compare: feat/nodejs-upgrade-24
   - Use template: .github/PULL_REQUEST_TEMPLATE/pr_chore.md
   
   Title:
   chore: upgrade to Node.js 24
   
   Description (use this template):
   
   ## Summary
   
   - Aligns `package.json` engines field with `.nvmrc` specification (Node.js 24)
   - Updates all dependencies to Node 24-compatible versions
   - Standardises all 16 workflows to use `.nvmrc` consistently
   - Enables advanced GitHub API scripts and issue maintenance workflows
   - Resolves version alignment gap between .nvmrc and package.json
   
   ## Business Impact
   
   - **Enables:** Advanced GitHub API scripts requiring Node 24+
   - **Improves:** Workflow consistency and maintainability
   - **Reduces:** Configuration drift between local and CI environments
   
   ## Test Plan
   
   - [x] All unit tests pass (85+ tests)
   - [x] All validation scripts pass (structure, skills, plugins, links, frontmatter, agents, workflows, changelog, JSON)
   - [x] Advanced GitHub API scripts verified operational in Node 24
   - [x] Performance benchmarking complete (within ±15%)
   - [x] Workflow syntax validation passes
   - [x] No high/critical security vulnerabilities introduced
   - [x] Post-merge monitoring plan prepared (3-day protocol)
   
   ## Breaking Changes
   
   None identified. See BREAKING_CHANGES_AUDIT.md in project folder for complete analysis.
   
   ## Deployment Notes
   
   Merge to develop. No special deployment required — changes activate automatically on next workflow run.

3. MONITOR CI CHECKS
   - Watch: checks.yml (lint, test, validate) — must pass ✓
   - Watch: release.yml — must pass ✓
   - Watch: meta.yml — must pass ✓
   - Watch: All other workflows — must pass ✓
   - Expected: All green within 10–15 minutes

4. ADDRESS CI FAILURES (IF ANY)
   - If CI fails: Identify failing check
   - Fix issues immediately in same branch
   - Push fix: git push
   - Re-run failed jobs
   - Do not merge if CI is red

5. MERGE TO DEVELOP
   - Merge strategy: Squash merge
   - Merge commit message: chore: upgrade to Node.js 24
   - Delete branch after merge: Yes
   - Verify: Merge completed successfully

6. CREATE POST-MERGE MONITORING ISSUE
   - Title: Node.js 24 Upgrade — Post-Merge Monitoring (3 Days)
   - Label: infrastructure, monitoring, node-upgrade
   - Description:
   
   Post-merge monitoring for Node.js 24 upgrade (PR #[PR_NUMBER]).
   
   Monitors:
   - Workflow stability and performance
   - Advanced GitHub API scripts operational status
   - Edge case detection
   - Performance regressions
   
   Success Criteria:
   - All workflows stable and passing
   - No new Node 24-related issues
   - Advanced GitHub API scripts operational
   - Performance within baseline
   
   Timeline: 3 days (2026-08-29 to 2026-09-01)

7. UPDATE DOCUMENTATION
   - Update: DEVELOPMENT.md
   - Add Node 24 requirement section
   - Link to project README
   
   - Update: CHANGELOG.md (Unreleased section)
   - Add entry: Node.js 24 upgrade
   
   - Create: COMPLETION_REPORT.md
   - Summarise: Project completion, findings, metrics

SUCCESS CRITERIA (MUST ALL BE TRUE):
- Branch pushed to remote
- PR created and visible on GitHub
- All CI checks passing (green)
- Merge conflict resolved (if any)
- Changes merged to develop
- Post-merge monitoring issue created
- Documentation updated

CRITICAL GATES:
- DO NOT merge if CI is red
- DO NOT merge if PR has merge conflicts unresolved
- DO NOT merge without all reviews complete

NEXT PHASE: Post-Merge Monitoring (3 days)
```

---

## Post-Merge Monitoring Summary

**Duration:** 3 days (2026-08-29 to 2026-09-01)

This phase is handled by the post-merge monitoring team. Key activities:

**Day 1: Immediate Verification**

- Verify all workflows passing on develop
- Check for Node 24-related errors in logs
- Test advanced GitHub API scripts manually
- Monitor metrics for anomalies

**Day 2: Spot Checks & Performance**

- Random workflow performance verification
- Metrics pipeline operational check
- Team feedback collection

**Day 3: Final Validation & Sign-Off**

- Comprehensive regression testing
- Performance baseline comparison
- Monitoring completion sign-off

---

## Quick Command Reference

```bash
# Phase 1: Current state verification
node --version                              # Verify local Node 24
npm outdated                                # See available updates

# Phase 2: Package updates
npm update                                  # Update all dependencies
npm audit                                   # Check vulnerabilities
npm ci                                      # Ensure lock file consistency

# Phase 3: Testing & validation
npm test                                    # Full unit test suite
npm run validate:all                        # All 9 validation scripts
npm run validate:workflows                  # Workflow syntax only

# Phase 4: Workflow linting
npm run lint:workflows                      # Validate all workflows

# Phase 5: Git & GitHub
git push -u origin feat/nodejs-upgrade-24  # Push branch
git merge [branch]                          # Merge PR (GitHub UI)
```

---

## Troubleshooting Quick Links

| Issue | Solution |
| --- | --- |
| Node version mismatch | Ensure Node 24: `nvm use 24` or `nvm install 24` |
| npm update fails | Clear cache: `npm cache clean --force` |
| Tests fail on Node 24 | Check BREAKING_CHANGES_AUDIT.md for specific dependency issues |
| Workflow syntax errors | Run `npm run lint:workflows` for detailed validation output |
| CI checks failing | Review workflow logs in GitHub Actions tab |
| Merge conflicts | Run `git merge develop` in feature branch, resolve conflicts |

---

**You now have all prompts ready. Execute each phase sequentially, updating QUICK_REFERENCE.md as you progress.**
