# Node.js 22 Upgrade — Test Matrix

**Date**: 2026-07-30  
**Repository**: `.github` (LightSpeedWP)  
**Phase**: Phase 1 — Audit & Documentation  
**Status**: Complete

---

## Overview

This test matrix defines all validation points required to confirm Node.js 22 upgrade compatibility. Tests are categorized by:

1. **Pre-Upgrade Baseline** — Run on Node 20 (current)
2. **Post-Upgrade Validation** — Run on Node 22 (target)
3. **Regression Testing** — Confirm no functionality lost

---

## Test Categories

### 1. Unit Tests (Jest)

**Command**: `npm test` (or `npm run test:js`)  
**Success Criteria**: All tests pass with same count as baseline  
**Estimated Duration**: ~2–3 minutes  
**Parallel Jobs**: Yes

#### Pre-Upgrade Baseline (Node 20)

- [ ] Run `npm ci` (clean install)
- [ ] Run `npm test` — **Baseline: 819 tests pass**
- [ ] Verify: Coverage report generated
- [ ] Verify: No deprecation warnings logged

#### Post-Upgrade Validation (Node 22)

- [ ] Run `npm ci` (clean install)
- [ ] Run `npm test` — **Target: 819 tests pass (same as baseline)**
- [ ] Verify: Coverage report generated
- [ ] Verify: No new deprecation warnings
- [ ] Compare: Coverage percentage unchanged

#### Test Files to Monitor

- `agents/design-partner-agent/agent/scripts/design-md-agent/__tests__/validateDesignMd.test.js`
- `scripts/agents/__tests__/release.agent.test.js`
- `scripts/validation/__tests__/validate-frontmatter.test.js`
- `scripts/agents/__tests__/adr.agent.test.js`
- `scripts/validation/__tests__/validate-changelog.test.js`
- `scripts/validation/__tests__/validate-plugins.test.js`
- `hooks/agent-spec-validator/__tests__/agent-spec-validator.test.js`
- And 39 more test files (819 tests total)

---

### 2. Linting (ESLint, Prettier, Markdownlint, YAML)

**Success Criteria**: Same number of errors/warnings or fewer  
**Estimated Duration**: ~3–5 minutes  

#### 2a. JavaScript Linting (ESLint)

**Command**: `npm run lint:js`  
**Baseline Errors**: 2,823 errors, 468 warnings  
**Baseline Files Scanned**: ~3,291 total problems

Pre-Upgrade:

- [ ] Run `npm run lint:js` — **Baseline: 2,823 errors, 468 warnings**
- [ ] Document error distribution
- [ ] Document ignored patterns

Post-Upgrade:

- [ ] Run `npm run lint:js` — **Target: ≤2,823 errors**
- [ ] Verify: No new error categories introduced by Node 22 compatibility
- [ ] Verify: No new deprecation warnings from ESLint

#### 2b. Markdown Linting (Markdownlint)

**Command**: `npm run lint:md`  
**Success Criteria**: No regression in markdown validation

Pre-Upgrade:

- [ ] Run `npm run lint:md` — document baseline

Post-Upgrade:

- [ ] Run `npm run lint:md` — verify same or fewer issues
- [ ] Verify: No Node.js version-specific markdown issues

#### 2c. YAML Linting (Spectral)

**Command**: `npm run lint:yaml`  
**Success Criteria**: All workflows pass YAML validation

Pre-Upgrade:

- [ ] Run `npm run lint:yaml` — baseline workflows valid

Post-Upgrade:

- [ ] Run `npm run lint:yaml` — all workflows still valid
- [ ] Verify: No workflow syntax errors introduced

#### 2d. JSON Linting

**Command**: `npm run lint:json`  
**Success Criteria**: All JSON files valid

Pre-Upgrade:

- [ ] Run `npm run lint:json` — baseline valid

Post-Upgrade:

- [ ] Run `npm run lint:json` — all files still valid

#### 2e. Comprehensive Lint

**Command**: `npm run lint:all`  
**Success Criteria**: Same or fewer total issues

Pre-Upgrade:

- [ ] Run `npm run lint:all` — document baseline
- [ ] Verify: ESLint + Markdown + YAML + JSON passing

Post-Upgrade:

- [ ] Run `npm run lint:all` — verify same baseline
- [ ] Verify: No new linting failures introduced

---

### 3. Validation Scripts

**Success Criteria**: All validation scripts pass  
**Estimated Duration**: ~2–3 minutes  

#### 3a. Frontmatter Validation

**Command**: `npm run validate:frontmatter`  
**Purpose**: Validate YAML frontmatter in instruction files and agents

Pre-Upgrade:

- [ ] Run `npm run validate:frontmatter` — baseline passes

Post-Upgrade:

- [ ] Run `npm run validate:frontmatter` — verify passes
- [ ] Verify: No Node 22-specific frontmatter parsing issues

#### 3b. Workflow Validation

**Command**: `npm run validate:workflows`  
**Purpose**: Validate GitHub Actions workflow syntax

Pre-Upgrade:

- [ ] Run `npm run validate:workflows` — baseline workflows valid

Post-Upgrade:

- [ ] Run `npm run validate:workflows` — all updated workflows valid
- [ ] Verify: Node version updates don't break workflow parsing

#### 3c. Agent Validation

**Command**: `npm run validate:agents`  
**Purpose**: Validate agent specifications and manifests

Pre-Upgrade:

- [ ] Run `npm run validate:agents` — baseline agents valid

Post-Upgrade:

- [ ] Run `npm run validate:agents` — verify agents valid
- [ ] Verify: No Node.js version-specific agent validation issues

#### 3d. Plugin Validation

**Command**: `npm run validate:plugins`  
**Purpose**: Validate plugin configurations

Pre-Upgrade:

- [ ] Run `npm run validate:plugins` — baseline plugins valid

Post-Upgrade:

- [ ] Run `npm run validate:plugins` — verify plugins valid

#### 3e. Skills Validation

**Command**: `npm run validate:skills` and `npm run validate:skill-manifests`  
**Purpose**: Validate skill definitions and manifests

Pre-Upgrade:

- [ ] Run `npm run validate:skills` — baseline skills valid
- [ ] Run `npm run validate:skill-manifests` — manifests valid

Post-Upgrade:

- [ ] Run `npm run validate:skills` — verify skills valid
- [ ] Run `npm run validate:skill-manifests` — manifests valid

#### 3f. JSON Validation

**Command**: `npm run validate:json` and `npm run validate:json:all`  
**Purpose**: Validate JSON schema conformance

Pre-Upgrade:

- [ ] Run `npm run validate:json` — baseline JSON valid
- [ ] Run `npm run validate:json:all` — comprehensive JSON validation

Post-Upgrade:

- [ ] Run `npm run validate:json` — verify valid
- [ ] Run `npm run validate:json:all` — comprehensive validation passes

#### 3g. Structure Validation

**Command**: `npm run validate:structure`  
**Purpose**: Validate repository structure and file organization

Pre-Upgrade:

- [ ] Run `npm run validate:structure` — baseline structure valid

Post-Upgrade:

- [ ] Run `npm run validate:structure` — verify structure valid

#### 3h. Branch Name Validation

**Command**: `npm run validate:branch-name`  
**Purpose**: Validate Git branch naming conventions

Pre-Upgrade:

- [ ] Run `npm run validate:branch-name -- --branch $(git branch --show-current)` — baseline passes

Post-Upgrade:

- [ ] Run same command — verify branch name rules still apply

#### 3i. Link Validation

**Command**: `npm run validate:links`  
**Purpose**: Validate all documentation links

Pre-Upgrade:

- [ ] Run `npm run validate:links` — baseline links valid

Post-Upgrade:

- [ ] Run `npm run validate:links` — verify links valid

#### 3j. Frontmatter Freshness

**Command**: `npm run validate:frontmatter:freshness`  
**Purpose**: Check frontmatter last-updated timestamps

Pre-Upgrade:

- [ ] Run `npm run validate:frontmatter:freshness` — document baseline

Post-Upgrade:

- [ ] Run `npm run validate:frontmatter:freshness` — verify acceptable

---

### 4. Security Audit (npm audit)

**Command**: `npm audit`  
**Success Criteria**: No new high-severity vulnerabilities introduced  
**Estimated Duration**: ~1 minute  

#### Pre-Upgrade Baseline (Node 20)

- [ ] Run `npm audit` — **Baseline: 34 vulnerabilities (3 moderate, 31 high)**
- [ ] Document: Exact vulnerability list
- [ ] Document: Which vulnerabilities are transitive dependencies

#### Post-Upgrade Validation (Node 22)

- [ ] Run `npm audit` — **Target: ≤34 vulnerabilities**
- [ ] Document: Any new vulnerabilities introduced by Node 22 compatibility
- [ ] Verify: No additional high-severity issues
- [ ] Verify: Known vulnerabilities remain same or improve
- [ ] Note: Some may auto-fix with Node 22 version compatibility

---

### 5. Clean Install & Dependency Verification

**Command**: `npm ci`  
**Success Criteria**: Clean install completes without errors  
**Estimated Duration**: ~2–3 minutes  

#### Pre-Upgrade Baseline

- [ ] Remove `node_modules` and `package-lock.json`
- [ ] Run `npm ci` — **verify completes successfully**
- [ ] Verify: All dependencies installed correctly
- [ ] Document: Any deprecation warnings from Node 20

#### Post-Upgrade Validation

- [ ] Remove `node_modules` and `package-lock.json`
- [ ] Run `npm ci` — **verify completes successfully**
- [ ] Verify: Same dependency tree as baseline
- [ ] Verify: No deprecation warnings introduced by Node 22
- [ ] Compare: package-lock.json has no unexpected changes

---

### 6. Node Version Verification

**Purpose**: Confirm correct Node version is active  
**Success Criteria**: Version matches expected  

#### Pre-Upgrade

- [ ] Run `node --version` — **Expected: v20.x.x**
- [ ] Run `npm --version` — **Expected: 9.x.x or 10.x.x**
- [ ] Run `nvm use` (from .nvmrc) — Should select Node 20

#### Post-Upgrade

- [ ] Run `node --version` — **Expected: v22.x.x**
- [ ] Run `npm --version` — **Expected: 9.x.x or 10.x.x**
- [ ] Run `nvm use` (from .nvmrc) — Should select Node 22

---

### 7. Workflow Execution in CI

**Purpose**: Validate all updated workflows execute correctly  
**Success Criteria**: Workflows run without errors in GitHub Actions  
**Estimated Duration**: Varies by workflow (5–30 minutes total)  

#### Pre-Upgrade CI Baseline

- [ ] Merge test branch to `develop` (create PR with Node 20 workflows)
- [ ] Verify: All workflows complete successfully
- [ ] Document: Any warnings or deprecation notices

#### Post-Upgrade CI Validation

- [ ] Merge PR with Node 22 workflow updates
- [ ] Verify: All updated workflows (5 Node 20→22 changes) complete successfully
- [ ] Verify: No job timeouts or cancellations
- [ ] Verify: No dependency resolution errors in CI
- [ ] Check: GitHub Actions runner output for Node 22-specific issues

#### Workflows to Test

1. `cleanup-branches.yml` (Node 20→22, v4→v7)
2. `issues.yml` (Node 20→22)
3. `metrics-pipeline.yml` (Node 20→22)
4. `metrics-reporting.yml` (Node 20→22)
5. `project-archival.yml` (Node 20→22)

Plus all unchanged workflows (20 others).

---

### 8. Script Execution Tests

**Purpose**: Verify all Node.js scripts run without errors  
**Success Criteria**: Scripts complete with expected output  
**Estimated Duration**: ~1–2 minutes  

#### Key Scripts to Test

- `npm run validate:frontmatter`
- `npm run validate:agents`
- `npm run validate:plugins`
- `npm run validate:workflows`
- `npm run lint:all`

**Pre-Upgrade**: Run each script and document baseline output

**Post-Upgrade**: Run each script and verify:

- [ ] Same output structure
- [ ] No new errors
- [ ] No Node 22-specific compatibility issues

---

### 9. Package.json Validation

**Purpose**: Verify engines field is correctly updated  
**Success Criteria**: npm enforce correct Node version  

#### Pre-Upgrade

- [ ] Verify: `engines.node` is `>=20.19.0`
- [ ] Test: Try to run on Node 18 (should fail)
- [ ] Test: Try to run on Node 22 (should succeed if allowed)

#### Post-Upgrade

- [ ] Verify: `engines.node` is `>=22.19.0`
- [ ] Test: `npm install` on Node 20 (should fail)
- [ ] Test: `npm install` on Node 22 (should succeed)
- [ ] Test: `npm install` on Node 24 (should succeed)

---

### 10. Documentation Examples

**Purpose**: Verify code examples in docs are correct  
**Success Criteria**: All examples use Node 22 (where applicable)  

#### Files to Check

- [ ] `docs/BRANDING_AGENT_USAGE.md` — update "Node.js 18+" to "22+"
- [ ] `docs/COOKBOOKS_STANDARDS.md` — update "Node.js 18+" to "22+"
- [ ] `docs/CHANGELOG_AUTOMATION.md` — verify Node 22 examples work
- [ ] `docs/FRONTMATTER_SCHEMA.md` — update example version
- [ ] `docs/LINTING.md` — update example version
- [ ] `docs/HUSKY_PRECOMMITS.md` — verify `.nvmrc` documentation correct
- [ ] `docs/BRANCH_CLEANUP.md` — verify Node 22 example works

---

## Test Execution Plan

### Phase: Pre-Upgrade Baseline (Node 20)

**Duration**: ~10–15 minutes  
**When**: Before any changes to workflows or package.json

1. Verify Node 20 is active: `node --version`
2. Run `npm ci`
3. Run all tests:
   - [ ] `npm test` (819 tests)
   - [ ] `npm run lint:all`
   - [ ] `npm run validate:frontmatter`
   - [ ] `npm run validate:workflows`
   - [ ] `npm run validate:agents`
   - [ ] `npm run validate:plugins`
   - [ ] `npm run validate:structure`
   - [ ] `npm run validate:links`
   - [ ] `npm audit`
4. Document all baseline results

### Phase: Post-Upgrade Validation (Node 22)

**Duration**: ~10–15 minutes  
**When**: After updating .nvmrc, package.json, and workflows to Node 22

1. Update `.nvmrc` to `22`
2. Update `package.json` engines.node to `>=22.19.0`
3. Update 5 workflows (Node 20→22)
4. Run `npm ci` (clean install with Node 22)
5. Run all tests (same as baseline):
   - [ ] `npm test` (should pass all 819)
   - [ ] `npm run lint:all`
   - [ ] `npm run validate:frontmatter`
   - [ ] `npm run validate:workflows`
   - [ ] `npm run validate:agents`
   - [ ] `npm run validate:plugins`
   - [ ] `npm run validate:structure`
   - [ ] `npm run validate:links`
   - [ ] `npm audit`
6. Compare results to baseline
7. Document any differences

### Phase: CI Integration Testing

**Duration**: Varies (5–30 minutes per workflow)  
**When**: After committing Node 22 changes to develop branch

1. Create PR with all Node 22 updates
2. Watch all workflows execute
3. Verify:
   - No job timeouts
   - No dependency resolution errors
   - No Node 22-specific failures
4. Merge to develop when all checks pass
5. Run release workflow to confirm no issues

---

## Quick Reference: Commands

```bash
# Pre-Upgrade Baseline (Node 20)
node --version                          # v20.x.x
npm ci
npm test                                # 819 tests pass
npm run lint:all
npm run validate:frontmatter
npm run validate:workflows
npm run validate:agents
npm run validate:plugins
npm audit

# Post-Upgrade Validation (Node 22)
nvm use 22                              # or update .nvmrc
node --version                          # v22.x.x
npm ci
npm test                                # 819 tests pass
npm run lint:all
npm run validate:frontmatter
npm run validate:workflows
npm run validate:agents
npm run validate:plugins
npm audit
```

---

## Success Criteria Summary

| Category | Pre-Upgrade | Post-Upgrade | Status |
| --- | --- | --- | --- |
| **Unit Tests** | 819 pass | 819 pass | ✓ Required |
| **Linting** | 2,823 errors | ≤2,823 errors | ✓ Required |
| **Validation Scripts** | All pass | All pass | ✓ Required |
| **npm audit** | 34 vulnerabilities | ≤34 vulnerabilities | ✓ Required |
| **npm ci** | Success | Success | ✓ Required |
| **Workflow Execution** | No errors | No errors | ✓ Required |
| **Node Version** | 20.x.x | 22.x.x | ✓ Required |
| **package.json engines** | >=20.19.0 | >=22.19.0 | ✓ Required |
| **Documentation Updated** | N/A | 7 files updated | ✓ Required |

---

## Test Failure Remediation

If any test fails during post-upgrade validation:

1. **Unit Test Failure**
   - [ ] Check error message for Node 22 incompatibility
   - [ ] Review test file for Node-version-specific code
   - [ ] Check dependencies for outdated versions

2. **Linting Failure**
   - [ ] Compare error counts to baseline
   - [ ] Check if new errors are Node 22-specific
   - [ ] Review ESLint/Prettier configuration for compatibility

3. **Validation Failure**
   - [ ] Check script source for Node 22 compatibility
   - [ ] Verify file format hasn't changed
   - [ ] Review validation rules for version assumptions

4. **npm audit Failure**
   - [ ] Identify new vulnerabilities introduced
   - [ ] Check if high-severity issues are new
   - [ ] Consider `npm audit fix` if safe

5. **Workflow Failure in CI**
   - [ ] Check workflow logs for Node 22 errors
   - [ ] Verify setup-node action version (should be v7)
   - [ ] Check for node_modules cache issues

---

## Next Steps

1. Baseline all tests on Node 20 (current environment)
2. Verify all counts match this matrix
3. Document any discrepancies
4. Proceed to Phase 2 when baseline established

---

*Test Matrix — Phase 1: Audit & Documentation — Node.js 22 Upgrade*
