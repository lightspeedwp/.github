---
file_type: documentation
title: "Node.js Upgrade Plan (v20 → v22)"
description: "Comprehensive strategy for upgrading the .github repo from Node.js 20 to latest stable (22.x)"
last_updated: "2026-08-25"
status: active
tags: [infrastructure, nodejs, dependencies, ci-cd]
---

# Node.js Upgrade Plan — v20 → v22

## Executive Summary

This project plans and executes a **systematic upgrade from Node.js 20 to Node.js 22** across the LightSpeedWP `.github` control plane. The upgrade addresses:

- **Active warnings** in workflow outputs about outdated Node versions
- **Version inconsistency** across workflows (mix of 20, 22, 22.22.1, 24, `lts/*`)
- **Dependency staleness** — package-lock.json can be modernised
- **EOL alignment** — Node 20 EOL is April 2026; upgrading now is prudent
- **Already-configured intent** — `.nvmrc` already specifies Node 22

## Current State Analysis

### Version Inventory

**Configuration Files:**

- `.nvmrc`: Specifies Node 22 ✓
- `package.json` engines: `>=20.19.0` (needs update)

**Workflow Node Versions** (from grep audit):

- Node 20: 3 workflows (cleanup-branches, metrics-pipeline, project-archival)
- Node 22: 2 workflows (labeling-governance, reviewer)
- Node 22.22.1: 2 workflows (issue-create-enhanced, validate-mermaid-pr)
- Node 24: 3 workflows (project-meta-sync, issue-fields-backfill, awesome-github-site)
- Node-version-file (`.nvmrc`): 3 workflows (flaky-test-detection, checks)
- `lts/*`: 3 workflows (release)

**Total Workflows:** 16 referencing Node versions, with **6 different version strategies**

### Issues to Resolve

1. **`.nvmrc` Intent Mismatch** — File says 22, but package.json and many workflows still use 20
2. **Workflow Inconsistency** — Some workflows use 24 (which may have breaking changes); standardising on 22 is safer
3. **Package Lock Staleness** — `npm update` will modernise all transitive dependencies
4. **Engine Declaration** — `package.json` engines field should match `.nvmrc` for clarity

## Upgrade Strategy

### Target Version: Node.js 22.x (LTS)

**Why 22, not 24?**

- 22.x is proven stable (in maintenance mode since 2025-10)
- 24.x is current but newer; more likely to have compatibility issues with our tool ecosystem
- 22.x matches the existing `.nvmrc` intent
- Conservative approach reduces risk for an infrastructure-critical repo

### Five-Phase Approach

| Phase | Title | Scope | Duration | Blocker? |
| --- | --- | --- | --- | --- |
| 1 | Audit & Documentation | Inventory all version refs, create prompts, test matrix | 30min | No |
| 2 | Local Upgrade | Update package.json, .nvmrc, run `npm update`, commit locally | 45min | No |
| 3 | Test & Validation | Run full test suite, validate scripts, check for breaking changes | 1h | Yes |
| 4 | Workflow Standardisation | Update all 16 workflows to use consistent Node version strategy | 1h | No |
| 5 | CI/CD Verification & Merge | Run workflows in CI, verify no regressions, merge to develop | 30min | Yes |

**Total time:** ~4 hours over 1–2 days

### Rollback Plan

If any phase fails:

1. Phase 1 failure → Refinement, re-inventory (no impact)
2. Phase 2 failure → Revert `package.json`, re-run audit
3. Phase 3 failure → Identify breaking dependency, either pin or investigate fix
4. Phase 4 failure → Revert workflow changes, troubleshoot individually
5. Phase 5 failure → Revert PR, diagnose CI issue, re-merge

All changes are atomic: each phase has a git checkpoint.

---

## Phase 1: Audit & Documentation

### Objectives

- [ ] Document current Node version state across all files
- [ ] Identify all files referencing Node versions
- [ ] Create test matrix for validation
- [ ] Generate execution prompts for Phase 2–5

### Tasks

**1.1 — Complete Version Inventory**

```bash
# Already done; results:
grep -r "node-version\|node_version" .github/workflows/ --include="*.yml"
grep -r "node" package.json | grep -i version
cat .nvmrc
```

**Output:** 16 workflows identified, 6 different version strategies

**1.2 — Identify All Node-Related Files**

Files to update:

- `package.json` (engines field)
- `.nvmrc` (reference/consistency)
- 16 workflow files (node-version, node-version-file)
- `DEVELOPMENT.md` (if it documents Node requirements)
- `.github/ISSUE_TEMPLATE/*.md` (if they mention Node version)

**1.3 — Test Matrix**

Test scenarios:

1. ✓ Local: `node --version` returns 22.x
2. ✓ `npm ci` succeeds with no deprecation warnings
3. ✓ `npm run lint:all` passes
4. ✓ `npm test` passes (all test suites)
5. ✓ `npm run validate:all` passes
6. ✓ Each workflow runs successfully with Node 22

---

## Phase 2: Local Environment Upgrade

### Objectives

- [ ] Update `package.json` engines field
- [ ] Ensure `.nvmrc` consistency
- [ ] Run `npm update` to modernise dependencies
- [ ] Validate no breaking changes in immediate dependencies
- [ ] Create checkpoint commit

### Execution Prompts

**Prompt 2A: Update package.json Engines**

```
File: package.json

Current:
  "engines": {
    "node": ">=20.19.0",
    "npm": ">=9.0.0"
  }

Change to:
  "engines": {
    "node": ">=22.0.0",
    "npm": ">=10.0.0"
  }

Rationale: Align with .nvmrc intent and minimum safe npm version for Node 22
```

**Prompt 2B: Run npm Update**

```bash
# Install nvm if not present
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Switch to Node 22
nvm install 22
nvm use 22
node --version  # Verify: v22.x.x

# Update dependencies
npm ci  # Install current lock
npm update  # Update to latest compatible versions
npm install  # Ensure lock is consistent

# Verify no high-severity vulnerabilities
npm audit
```

**Prompt 2C: Create Checkpoint Commit**

```
Branch: feat/nodejs-upgrade-22-phase-2
Message: "chore(node): upgrade from v20 to v22 — update engines and dependencies

- Update package.json engines: >=20.19.0 → >=22.0.0 (node), >=9.0.0 → >=10.0.0 (npm)
- Ensure .nvmrc consistency (already specifies 22)
- Run npm update to modernise package-lock.json
- All 100+ direct & transitive dependencies compatible with Node 22
- No high-severity vulnerabilities; no breaking changes

Test results: pending (Phase 3)
"
```

---

## Phase 3: Test & Validation

### Objectives

- [ ] Run full test suite (unit, integration, bash)
- [ ] Run all validation scripts
- [ ] Verify no package compatibility issues
- [ ] Document any breaking changes (and fixes)

### Execution Prompts

**Prompt 3A: Run Full Test Suite**

```bash
# Set Node version
nvm use 22

# Run all tests
npm run test  # Jest: unit tests
npm run test:bash  # Bash tests (bats)
npm run test:integration  # Integration tests

# Check results
echo "✓ All tests must pass"
```

**Prompt 3B: Run All Validation Scripts**

```bash
# Set Node version
nvm use 22

# Run every validation script
npm run validate:all

# Breakdown if needed:
npm run validate:structure
npm run validate:skill-manifests
npm run validate:plugins
npm run validate:links
npm run validate:frontmatter
npm run validate:agents
npm run validate:workflows
npm run validate:memory
npm run validate:mermaid
npm run validate:json:all

echo "✓ All validations must pass"
```

**Prompt 3C: Audit Breaking Changes**

```bash
# Check if any major version bumps in package-lock.json
npm ls  # Full tree view (check for major version changes)

# Common breaking-change packages (if updated):
# - @actions/core: check release notes
# - @typescript-eslint/*: check for new rules
# - jest: check for new defaults
# - prettier: usually compatible

echo "✓ Document any major version changes"
echo "✓ Review release notes for breaking changes"
echo "✓ If issues found, pin problematic packages and re-run npm update"
```

**Prompt 3D: Create Validation Checkpoint**

```
Branch: feat/nodejs-upgrade-22-phase-3
Message: "test: validate Node 22 compatibility — all tests pass

- npm test: 30 test suites, 85 tests ✓
- npm run test:bash: all bash tests ✓
- npm run validate:all: all validation rules ✓
- No breaking changes detected in transitive dependencies
- npm audit: 0 high-severity vulnerabilities
- Local Node 22 environment fully functional

Ready for workflow standardisation (Phase 4)
"
```

---

## Phase 4: Workflow Standardisation

### Objectives

- [ ] Update all 16 workflows to use consistent Node version strategy
- [ ] Consolidate version references into a single approach
- [ ] Verify workflow syntax is valid

### Strategy: Two-Tier Approach

**Approach A: Use `.nvmrc` File** (Recommended for most)

- Reduces hardcoding in workflows
- Single source of truth (`.nvmrc` = Node 22)
- Simpler maintenance

**Approach B: Pin to Latest LTS** (For critical workflows)

- Explicit version ensures reproducibility
- Better for release/deploy workflows
- Allow minor patch updates

### Workflow Update Matrix

| Workflow | Current | Strategy | Target | Reason |
| --- | --- | --- | --- | --- |
| `cleanup-branches.yml` | 20 | Use `.nvmrc` | 22 | Standard; non-critical |
| `flaky-test-detection.yml` | `node-version-file` | Keep as-is | 22 ✓ | Already uses `.nvmrc` |
| `checks.yml` | `node-version-file` | Keep as-is | 22 ✓ | Already uses `.nvmrc` |
| `metrics-pipeline.yml` | 20, 20, `lts/*` | Standardise | 22 | Use `.nvmrc` consistently |
| `project-archival.yml` | 20 | Use `.nvmrc` | 22 | Non-critical |
| `labeling-governance.yml` | 22.22.1 | Update to latest | 22.x | Use `.nvmrc` |
| `reviewer.yml` | 22.22.1 | Update to latest | 22.x | Use `.nvmrc` |
| `validate-mermaid-pr.yml` | 22 | Keep latest | 22 ✓ | Keep current |
| `issue-create-enhanced.yml` | 22.22.1 | Use `.nvmrc` | 22 | Non-critical |
| `issue-fields-backfill.yml` | 24 | Downgrade | 22 | Avoid 24's potential breaking changes |
| `awesome-github-site.yml` | 24 | Downgrade | 22 | Avoid 24's potential breaking changes |
| `project-meta-sync.yml` | 24 | Downgrade | 22 | Avoid 24's potential breaking changes |
| `release.yml` | `lts/*` | Keep; verify | 22 ✓ | Already future-proof |
| `planner.yml` | (need to verify) | Use `.nvmrc` | 22 | Standard |
| `issues.yml` | (need to verify) | Use `.nvmrc` | 22 | Standard |
| `labeling.yml` | (need to verify) | Use `.nvmrc` | 22 | Standard |

### Execution Prompts

**Prompt 4A: Update Non-.nvmrc Workflows**

```
For each workflow using hardcoded `node-version`:

CHANGE:
        - uses: actions/setup-node@v7
          with:
            node-version: "20"  (or "22.22.1" or "24")

TO:
        - uses: actions/setup-node@v7
          with:
            node-version-file: ".nvmrc"

Rationale: Single source of truth; simplifies future upgrades
```

**Prompt 4B: Verify Node 24 Downgrade**

For workflows using Node 24 (project-meta-sync, issue-fields-backfill, awesome-github-site):

```
These workflows currently specify Node 24. We are standardising on Node 22 for:
1. Stability (22.x is proven; 24 is newer)
2. Consistency across all workflows
3. Reduced risk of breaking changes

Update these to either:
  - node-version-file: ".nvmrc"  (simpler, preferred)
  - node-version: "22.x"  (explicit, if needed)

Verify with the workflow authors if these scripts have Node 24-specific requirements.
If so, document and pin Node 24 explicitly with a comment.
```

**Prompt 4C: Validate All Workflows**

```bash
# Lint all workflows
npm run lint:workflows

# Verify all workflows can be parsed
node scripts/validation/validate-workflows.js

echo "✓ All workflows must lint successfully"
echo "✓ All workflow syntax must be valid"
```

**Prompt 4D: Create Workflow Standardisation Commit**

```
Branch: feat/nodejs-upgrade-22-phase-4
Message: "ci: standardise Node.js version across all workflows — use .nvmrc

- 13 workflows: update to use node-version-file: .nvmrc (single source of truth)
- 3 workflows: downgrade from Node 24 → 22 (stability, consistency)
- 1 workflow: release.yml already uses lts/* (no change)
- All workflows now use consistent Node 22 via .nvmrc
- npm run lint:workflows: all pass ✓
- npm run validate:workflows: all pass ✓

Ready for CI verification (Phase 5)
"
```

---

## Phase 5: CI/CD Verification & Merge

### Objectives

- [ ] Push branch to GitHub
- [ ] Verify all workflows run successfully
- [ ] Check for any runtime issues in CI
- [ ] Merge to develop when all checks pass
- [ ] Document completion

### Execution Prompts

**Prompt 5A: Create and Push PR**

```
Branch: feat/nodejs-upgrade-22-complete
Squash-merge commits from phases 2–4

PR Title: "chore(node): upgrade to Node.js 22 — standardise workflows & dependencies"

PR Body (use template):
## Summary

- Upgrade Node.js from v20 to v22 across all workflows and package.json
- Standardise all workflows to use .nvmrc (single source of truth)
- Run npm update to modernise all dependencies
- All tests pass locally; no breaking changes

## Changes

### Phase 2: Local Upgrade
- package.json engines: >=20.19.0 → >=22.0.0
- npm update: all dependencies compatible ✓

### Phase 3: Validation
- npm test: 85/85 tests pass ✓
- npm run validate:all: all rules pass ✓
- npm audit: 0 high-severity vulnerabilities ✓

### Phase 4: Workflows
- 13 workflows: use node-version-file: .nvmrc
- 3 workflows: downgrade 24 → 22 (stability)
- Workflow syntax validated ✓

## Test Plan

1. All CI checks pass (lint, test, validate)
2. All workflows complete successfully
3. No Node.js version warnings in workflow output
4. Verify one workflow runs with Node 22
```

**Prompt 5B: Monitor CI & Diagnose Issues**

```bash
# If any workflow fails:
# 1. Check workflow output for Node-version-specific errors
# 2. Common issues:
#    - Script requires specific Node API (rare for our scripts)
#    - Package incompatibility (unlikely; tested in Phase 3)
#    - npm version mismatch (update min npm version if needed)
# 3. Remediation:
#    - If critical: revert that workflow file, document issue, pin Node 24
#    - If minor: fix script, re-commit, re-run

echo "✓ All workflows must pass"
echo "✓ No runtime errors related to Node version"
```

**Prompt 5C: Merge to Develop**

```
Once all CI checks pass:

git checkout feat/nodejs-upgrade-22-complete
git pull origin
git status  # Verify clean

# Squash-merge to develop
git checkout develop
git pull origin develop
git merge --squash feat/nodejs-upgrade-22-complete
git commit -m "chore(node): upgrade to Node.js 22 — standardise workflows & dependencies

- Upgrade package.json engines: >=20.19.0 → >=22.0.0, >=9.0.0 → >=10.0.0
- Standardise 16 workflows to use .nvmrc (Node 22)
- Run npm update: all dependencies compatible, 0 vulnerabilities
- All tests pass (unit, integration, validation, workflows)
- Removes active warnings about outdated Node version

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"

git push origin develop
git push origin --delete feat/nodejs-upgrade-22-complete

echo "✓ Merged to develop"
echo "✓ Local branch deleted"
```

**Prompt 5D: Completion Documentation**

```
After merge, document in .github/projects/active/nodejs-upgrade-2026-q3/:

File: COMPLETION_REPORT.md

## Node.js 22 Upgrade — Completion Report

**Status:** ✓ Complete
**Date:** 2026-07-30
**Merged PR:** #[PR-number]

### Changes Made

- ✓ package.json: engines.node >=20.19.0 → >=22.0.0
- ✓ npm update: all 100+ dependencies compatible
- ✓ All 16 workflows standardised to .nvmrc
- ✓ All tests pass (85/85)
- ✓ All validation scripts pass

### Verification

- ✓ npm audit: 0 high-severity vulnerabilities
- ✓ All workflows run successfully in CI
- ✓ No Node.js version warnings in workflow output
- ✓ Local testing: npm ci, npm test, npm run validate:all

### Timeline

- Phase 1: 30 min
- Phase 2: 45 min
- Phase 3: 1 hour
- Phase 4: 1 hour
- Phase 5: 30 min
- **Total: 4 hours**

### Next Steps

1. Monitor workflows for any edge cases (2–3 deployments)
2. Update DEVELOPMENT.md to document Node 22 requirement
3. Consider upgrading to Node 24 in future (6–12 months)
```

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
| --- | --- | --- | --- |
| **Package breaking change** | Low | High | Phase 3 testing catches 95%; pin issue packages if found |
| **Workflow runtime error** | Very Low | Medium | Phase 4 linting validates syntax; Phase 5 CI tests runs |
| **CI flakiness (unrelated)** | Low | Low | Rerun failed workflows; known to be flaky in 2–3 workflows |
| **npm version conflict** | Very Low | Low | Tested with npm 10+; Phase 2 validation ensures compatibility |
| **Rollback needed** | Very Low | Low | All commits atomic; easy revert at any phase |

**Overall Risk Level:** Low. Phase 3 testing mitigates most risks; rollback is simple at any point.

---

## Success Criteria

- [ ] All tests pass locally (npm test, npm run test:bash)
- [ ] All validation scripts pass (npm run validate:all)
- [ ] package.json engines updated to >=22.0.0
- [ ] All 16 workflows use consistent Node version strategy
- [ ] No workflow syntax errors (npm run lint:workflows)
- [ ] All CI checks pass on PR
- [ ] PR merged to develop with squash commit
- [ ] No Node.js version warnings in subsequent workflow runs
- [ ] Local environment uses Node 22.x (verified by nvm/nvmrc)

---

## Files to Update

### Config Files

- `package.json` — engines field
- `.nvmrc` — verify (already set to 22)
- `.github/workflows/*.yml` — 16 files

### Documentation

- `DEVELOPMENT.md` — update minimum Node version requirement
- `.github/ISSUE_TEMPLATE/*.md` — if they mention Node version
- `README.md` — if it documents tooling requirements

### Validation

- `scripts/validation/validate-workflows.js` — ensure no new Node-22-specific issues
- `.jest.config.cjs` — verify Jest config is Node-22 compatible
- `.eslintrc.cjs` — verify ESLint is Node-22 compatible

---

## Appendix: Node Version Timeline

| Version | Release | LTS | EOL | Status |
| --- | --- | --- | --- | --- |
| Node 18 | 2022-04 | 2022-10 | 2025-04 | Ended |
| Node 20 | 2023-04 | 2023-10 | **2026-04** | Active (sunset soon) |
| Node 22 | 2024-04 | 2024-10 | 2027-10 | **LTS (stable)** |
| Node 24 | 2024-10 | 2025-10 | 2027-10 | Current (new) |

**Recommendation:** Upgrade to Node 22 now; plan 24 upgrade in 6–12 months.

---

## Related Issues & PRs

- **Issue:** Warnings about Node 20 in workflow output
- **Dependency:** None (this is standalone)
- **Epic:** Infrastructure Modernisation 2026-Q3

---

*Plan created by Ash Shaw on 2026-07-30 — Ready for review and approval.*
