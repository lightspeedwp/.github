---
file_type: documentation
title: "Node.js 24 Upgrade — Comprehensive Plan"
description: "5-phase execution plan for upgrading from Node.js 22 to 24"
created_date: 2026-08-29
last_updated: "2026-08-29"
---

# Node.js 24 Upgrade — Comprehensive Execution Plan

## Executive Summary

This document outlines the complete 5-phase strategy for upgrading the LightSpeed `.github` control plane from Node.js 22 to Node.js 24. The upgrade addresses a critical alignment gap between `.nvmrc` (already specifies 24) and `package.json` (requires >=22), and enables advanced GitHub API scripts and issue maintenance workflows that require Node 24 features.

**Total Duration:** ~4–5 hours  
**Risk Level:** 🟡 Medium  
**Recommended Timeline:** 1–2 days (split Phases 2–3 and 4–5)

---

## Phase Overview

```
Phase 1: Audit & Documentation (30 min)
    ↓
Phase 2: Local Upgrade (45 min)
    ↓
Phase 3: Test & Validation (1–1.5 hours)
    ↓
Phase 4: Workflow Standardisation (45 min)
    ↓
Phase 5: CI/CD Verification & Merge (30 min)
    ↓
Post-Merge Monitoring (3 days)
```

---

## Phase 1: Audit & Documentation (30 minutes)

### Objectives

- Inventory current Node versions across all workflows
- Document dependency update scope
- Create test matrix for validation phase
- Identify potential breaking changes
- Generate baseline metrics

### Key Activities

1. **Current State Inventory**
   - Run `node --version` to verify local Node 24
   - List all workflows using Node versions
   - Identify explicit version specs vs `.nvmrc` usage
   - Count total number of workflows affected

2. **Dependency Analysis**
   - Run `npm outdated` to see available updates
   - Estimate number of packages that will update
   - Identify major version changes
   - Flag any deprecated packages

3. **Breaking Changes Research**
   - Check Node.js 24 release notes for breaking changes
   - Review V8 engine changes (v12.1+)
   - Identify deprecated APIs in dependencies
   - Document findings in BREAKING_CHANGES_AUDIT.md

4. **Create Test Matrix**
   - Document all test categories (unit, integration, validation)
   - List all npm scripts that must pass
   - Identify edge cases and performance requirements
   - Save matrix in TEST_MATRIX.md

### Success Criteria

- ✓ All workflows inventoried
- ✓ Dependency scope documented (estimate: 50–100 packages)
- ✓ Test matrix created with all test categories
- ✓ INVENTORY.md generated with current state
- ✓ Potential breaking changes documented

### Deliverables

- `INVENTORY.md` — Current state of all versions and dependencies
- `TEST_MATRIX.md` — Complete test plan for Phase 3
- `BREAKING_CHANGES_AUDIT.md` — (Initial findings)

---

## Phase 2: Local Upgrade (45 minutes)

### Objectives

- Update `package.json` to require Node >=24.0.0
- Upgrade all dependencies to Node 24-compatible versions
- Commit changes atomically
- Prepare for comprehensive testing in Phase 3

### Key Activities

1. **Update package.json engines field**

   ```json
   "engines": {
     "node": ">=24.0.0",
     "npm": ">=10.0.0"
   }
   ```

   - Change `>=22.0.0` to `>=24.0.0`
   - Verify npm version requirement (typically >=10.0.0 for Node 24)

2. **Run dependency updates**
   - `npm update` — updates all packages to latest compatible versions
   - Review npm audit output
   - Check for high/critical vulnerabilities
   - Expect: 50–100 packages updated

3. **Update lock file**
   - `npm ci` to ensure lock file consistency
   - Commit `package-lock.json` changes
   - Verify no new vulnerabilities introduced

4. **Document changes**
   - Record number of packages updated
   - Note any packages with breaking changes
   - Document npm audit findings

5. **Commit locally**
   - Stage: `git add package.json package-lock.json`
   - Commit: `git commit -m "chore: upgrade to Node.js 24 — update package.json engine requirement"`
   - Save commit SHA for Phase 5

### Success Criteria

- ✓ `package.json` updated to Node >=24.0.0
- ✓ `npm update` completed successfully
- ✓ `npm audit` shows no high/critical vulnerabilities
- ✓ Lock file consistent and committed
- ✓ Changes committed locally (not pushed yet)

### Deliverables

- Updated `package.json` (with Node 24 engine requirement)
- Updated `package-lock.json` (with dependency updates)
- Commit on local branch (not yet pushed)

### Rollback if Phase 3 Fails

- `git reset --hard HEAD~1` to revert local commit
- Discard branch if merging is not needed

---

## Phase 3: Test & Validation (1–1.5 hours)

### Objectives

- Run full test suite with Node 24
- Execute all validation scripts
- Identify and document breaking changes
- Verify advanced GitHub API scripts compatibility
- Performance baseline comparison

### Key Activities

1. **Run Complete Test Suite**

   ```bash
   npm test
   ```

   - Run all Jest tests
   - Document total test count and pass rate
   - Note any failures (expected vs. unexpected)
   - Generate coverage report

2. **Run All Validation Scripts**

   ```bash
   npm run validate:all
   ```

   - Validates structure, skills, plugins, links, frontmatter, agents, workflows, changelog, JSON
   - Document any failures or warnings
   - Fix critical issues immediately

3. **Validate Advanced GitHub API Scripts**
   - Test issue maintenance scripts with Node 24
   - Test GitHub API integrations
   - Verify event handlers work correctly
   - Document any compatibility issues

4. **Performance Benchmarking**
   - Compare npm install time
   - Note any significant changes (>15% variance is concerning)
   - Document baseline metrics

5. **Document Findings**
   - Record all failures in BREAKING_CHANGES_AUDIT.md
   - Categorise as: code issue, dependency issue, or infrastructure issue
   - Propose fix for each failure
   - Track resolution status

### Test Categories

| Category | Script | Test Count | Expected Result |
| --- | --- | --- | --- |
| **Unit Tests** | `npm test:js` | ~85 | All passing ✓ |
| **Structure Validation** | `npm run validate:structure` | N/A | Pass ✓ |
| **Skills Validation** | `npm run validate:skills` | N/A | Pass ✓ |
| **Plugins Validation** | `npm run validate:plugins` | N/A | Pass ✓ |
| **Links Validation** | `npm run validate:links` | N/A | Pass ✓ |
| **Frontmatter Validation** | `npm run validate:frontmatter` | N/A | Pass ✓ |
| **Agent Validation** | `npm run validate:agents` | N/A | Pass ✓ |
| **Workflow Validation** | `npm run validate:workflows` | N/A | Pass ✓ |
| **Changelog Validation** | `npm run validate:changelog` | N/A | Pass ✓ |
| **JSON Validation** | `npm run validate:json:all` | N/A | Pass ✓ |

### Success Criteria

- ✓ All unit tests passing (85/85 or better)
- ✓ All validation scripts passing
- ✓ Advanced GitHub API scripts operational in Node 24
- ✓ No high/critical breaking changes
- ✓ Performance within ±15% of Node 22 baseline
- ✓ BREAKING_CHANGES_AUDIT.md completed

### Troubleshooting

**If tests fail:**

1. Identify the failing test/validation
2. Determine root cause (code, dependency, or infrastructure)
3. Propose fix:
   - **Code issue:** Fix in codebase
   - **Dependency issue:** Pin problematic package version
   - **Infrastructure issue:** Document and escalate

4. Re-run tests after fix
5. Document resolution in BREAKING_CHANGES_AUDIT.md

### Rollback if Critical Failures

- `git reset --hard HEAD~1` to discard Phase 2 commit
- Discard branch
- Report findings to stakeholders

---

## Phase 4: Workflow Standardisation (45 minutes)

### Objectives

- Ensure all workflows use `.nvmrc` for Node version specification
- Remove explicit Node version specifications where possible
- Standardise workflow format and consistency
- Reduce maintenance overhead

### Key Activities

1. **Audit Workflows**
   - Identify workflows with explicit Node versions (e.g., `node-version: '24'`)
   - Identify workflows using `.nvmrc`
   - Note any inconsistencies

2. **Standardise to `.nvmrc`**
   - Replace explicit versions with `node-version-file: '.nvmrc'`
   - Example:

     ```yaml
     # Before
     - uses: actions/setup-node@v4
       with:
         node-version: '24'
     
     # After
     - uses: actions/setup-node@v4
       with:
         node-version-file: '.nvmrc'
     ```

3. **Verify Syntax**
   - Run `npm run lint:workflows` to validate YAML syntax
   - Ensure no references to deprecated Node versions remain
   - Test workflow structure

4. **Document Changes**
   - List all workflows updated
   - Note any workflows that keep explicit versions (with reasons)
   - Verify consistency across all workflows

5. **Commit Workflow Changes**
   - Stage: `git add .github/workflows/**/*.yml`
   - Commit: `git commit -m "chore: standardise workflows to use .nvmrc for Node 24"`

### Workflow Categories

| Category | Count | Status |
| --- | --- | --- |
| Using `.nvmrc` | TBD | Verify unchanged |
| Using explicit versions | TBD | Convert to `.nvmrc` |
| Using `lts/*` | 1 | Document reason |
| Total workflows | 16+ | All standardised ✓ |

### Success Criteria

- ✓ All workflows using `.nvmrc` or documented exception
- ✓ No explicit Node versions hardcoded
- ✓ Workflow syntax validation passes
- ✓ Consistency across all workflows

### Deliverables

- Updated workflows using `.nvmrc`
- Commit documenting workflow standardisation
- Consistency report

---

## Phase 5: CI/CD Verification & Merge (30 minutes)

### Objectives

- Create pull request to `develop` branch
- Verify all CI checks pass
- Merge changes to develop
- Prepare for post-merge monitoring

### Key Activities

1. **Push Branch to Remote**

   ```bash
   git push -u origin feat/nodejs-upgrade-24
   ```

2. **Create Pull Request**
   - Use PR template from `.github/PULL_REQUEST_TEMPLATE/pr_chore.md`
   - Title: `chore: upgrade to Node.js 24`
   - Summary:

     ```
     ## Summary
     - Aligns package.json with .nvmrc specification (Node 24)
     - Updates all dependencies to Node 24-compatible versions
     - Standardises all workflows to use .nvmrc
     - Enables advanced GitHub API scripts and issue maintenance workflows
     
     ## Test Plan
     - [x] Full unit test suite passes (85+ tests)
     - [x] All validation scripts pass (structure, skills, plugins, links, frontmatter, etc.)
     - [x] Advanced GitHub API scripts verified operational
     - [x] Performance benchmarking within ±15%
     - [x] Workflow syntax validation passes
     - [x] No high/critical security vulnerabilities
     ```

3. **Monitor CI Checks**
   - checks.yml (lint, test, validate) — Must pass ✓
   - release.yml — Must pass ✓
   - meta.yml — Must pass ✓
   - Other workflows — Must pass ✓

4. **Address CI Failures**
   - If CI fails, fix issues immediately
   - Re-run failed jobs
   - Document any infrastructure issues
   - Do not merge if CI is red

5. **Merge to Develop**
   - Use squash merge strategy
   - Merge commit message: `chore: upgrade to Node.js 24`
   - Close any related issues
   - Document in CHANGELOG.md (Unreleased section)

6. **Create Post-Merge Monitoring Issue**
   - Link to this project
   - Assign to team for 3-day monitoring period
   - Set milestones and success criteria

### Success Criteria

- ✓ PR created and pushed to remote
- ✓ All CI checks passing
- ✓ Merge conflict resolved (if any)
- ✓ Changes merged to develop
- ✓ Post-merge monitoring initiated
- ✓ Team notified of upgrade completion

### Deliverables

- Pull request (merged)
- COMPLETION_REPORT.md generated
- Post-merge monitoring issue created

---

## Post-Merge Monitoring (3 days)

### Objectives

- Verify no regressions introduced by upgrade
- Monitor workflow stability and performance
- Catch any edge case issues early
- Confirm advanced GitHub API scripts remain operational

### Monitoring Activities

**Day 1: Immediate Verification**

- Check all workflows pass on develop
- Verify no version-related errors in logs
- Test advanced GitHub API scripts manually
- Monitor metrics for anomalies

**Day 2: Spot Checks & Performance**

- Spot-check random workflows for performance
- Verify metrics pipeline operational
- Check for any new Node 24-related issues
- Review team feedback channels

**Day 3: Final Validation & Sign-Off**

- Comprehensive regression testing
- Confirm no breaking changes in production
- Sign-off on monitoring completion
- Document findings in final report

### Success Criteria

- ✓ All workflows stable and passing
- ✓ No new Node 24-related issues reported
- ✓ Advanced GitHub API scripts operational
- ✓ Performance within expected baselines
- ✓ Post-merge monitoring completed successfully

---

## Risk Management

### Identified Risks

| Risk | Probability | Impact | Mitigation |
| --- | --- | --- | --- |
| Breaking changes in dependencies | 10% | High | Phase 3 comprehensive testing; pin if needed |
| GitHub API script incompatibility | 5% | Medium | Phase 3 validates all scripts; test in Node 24 |
| V8 engine changes affecting performance | 5% | Low | Phase 2–3 performance benchmarking |
| Workflow runtime compatibility | 3% | Medium | Phase 4 syntax validation and linting |
| npm version conflicts | 2% | Low | Phase 2 validates compatibility |
| Rollback needed | 2% | Low | All commits atomic; easy revert |

### Risk Response Strategy

**High-Probability Risks (>5%):**

- Comprehensive testing in Phase 3
- Clear remediation procedures documented
- Escalation path defined

**High-Impact Risks:**

- Breaking change identification in Phase 1
- Dependency pinning strategy documented
- Rollback procedures clearly defined

---

## Success Metrics

### Quantitative Metrics

- ✓ **Test Coverage:** 100% of test suite passing (85+ tests)
- ✓ **Validation Scripts:** 10/10 passing (structure, skills, plugins, links, frontmatter, agents, workflows, changelog, JSON, version)
- ✓ **Workflow Standardisation:** 16/16 workflows using `.nvmrc`
- ✓ **CI Status:** All checks green before merge
- ✓ **Security:** 0 high/critical vulnerabilities

### Qualitative Metrics

- ✓ Advanced GitHub API scripts operational
- ✓ No regressions during post-merge monitoring
- ✓ Team feedback positive or neutral
- ✓ Documentation updated (DEVELOPMENT.md)
- ✓ Smooth upgrade experience

---

## Documentation Updates

After Phase 5 completion, update:

### DEVELOPMENT.md

```markdown
## Node.js Requirements

- **Minimum Version:** Node.js 24.x (LTS)
- **Reason:** Advanced GitHub API scripts and issue maintenance workflows require Node 24+ features
- **Verification:** Run `node --version` to check your version
- **Installation:** Use nvm with `nvm use 24` or install directly from nodejs.org

See [Node.js 24 Upgrade Project](./.github/projects/active/nodejs-upgrade-2026-q4/README.md) for upgrade details.
```

### CHANGELOG.md

```markdown
### Changed

- **Node.js 24 Upgrade** — Complete migration from Node.js 22 to 24, aligning package.json engines with .nvmrc configuration. Enables advanced GitHub API scripts and issue maintenance workflows. All dependencies updated to Node 24-compatible versions. Workflow standardisation complete with consistent use of .nvmrc. See [Node.js 24 Upgrade Project](./.github/projects/active/nodejs-upgrade-2026-q4/) for complete details.
```

---

## Timeline

### Day 1 (Recommended)

- **Morning (30 min):** Phase 1 — Audit & Documentation
- **Late Morning (45 min):** Phase 2 — Local Upgrade
- **Afternoon (1–1.5 hours):** Phase 3 — Test & Validation
- **Break for CI checks**

### Day 2 (Recommended)

- **Morning (45 min):** Phase 4 — Workflow Standardisation
- **Late Morning (30 min):** Phase 5 — CI/CD Verification & Merge
- **Rest of week:** Post-merge monitoring (3 days)

### Alternative: Single Day

- Complete Phases 1–5 sequentially
- Estimated total: ~4–5 hours (including wait times)
- Requires continuous attention

---

## Approval Checklist

Before proceeding with execution, confirm:

- [ ] Business requirement confirmed (advanced GitHub API scripts need Node 24)
- [ ] Risk assessment reviewed (Medium risk, mitigated by testing)
- [ ] Timeline acceptable (~4–5 hours)
- [ ] Team assigned for execution
- [ ] Post-merge monitoring resources allocated (3 days)
- [ ] Rollback procedures understood
- [ ] Success criteria documented

---

## Appendix: References

### Node.js 24 Release Information

- **Release Date:** October 2024
- **LTS Status:** No (current stable release)
- **Support Window:** 18 months
- **V8 Version:** 12.1+ (improved performance, new features)

### Related Documentation

- [BREAKING_CHANGES_AUDIT.md](./BREAKING_CHANGES_AUDIT.md) — Breaking changes log
- [TEST_MATRIX.md](./TEST_MATRIX.md) — Complete test matrix
- [INVENTORY.md](./INVENTORY.md) — Current state inventory
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) — One-page checklist
- [Node.js Release Notes](https://nodejs.org/en/blog/release/v24.0.0/)

---

*This plan is comprehensive and executable. Review carefully, ask questions, and proceed with confidence.*
