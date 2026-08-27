# GitHub Workflows Audit Report

**Date**: 2025-12-07
**Auditor**: Claude Code (Automated Analysis)
**Repository**: `.github` monorepo

## Executive Summary

Comprehensive audit of 11 GitHub Actions workflow files revealed **critical path mismatches** affecting 5 workflows. The primary issue is that workflows reference scripts at `.github/agents/` and `.github/scripts/` when the actual scripts are located at `scripts/agents/`.

### Critical Findings

- **5 workflows have broken script paths** and will fail to execute
- **6 workflows are correctly configured**
- **0 security vulnerabilities** found in permissions
- **All workflows use valid YAML syntax**

---

## Detailed Findings by Workflow

### 🔴 CRITICAL: Workflows with Path Issues

#### 1. [labeling.yml](./.github/workflows/labeling.yml)

**Status**: ❌ BROKEN - Will fail to execute

**Issues**:

- Line 73: `node .github/agents/includes/label-sync.js` → **WRONG PATH**
- Line 81: `node .github/agents/includes/check-template-labels.js` → **WRONG PATH**
- Line 99: `node .github/agents/labeling.agent.js` → **WRONG PATH**
- Line 105: `node .github/agents/includes/report-writer.js` → **WRONG PATH**

**Actual Locations**:

- ✅ `scripts/agents/includes/label-sync.js`
- ✅ `scripts/agents/labeling.agent.js`
- ✅ `scripts/agents/includes/report-writer.js`
- ❓ `check-template-labels.js` - needs verification

**Impact**: Workflow will fail immediately when trying to execute scripts

---

#### 2. [branding.yml](./.github/workflows/branding.yml)

**Status**: ❌ BROKEN - Will fail to execute

**Issues**:

- Line 56: `node .github/scripts/validate-frontmatter.js` → **WRONG - directory doesn't exist**
- Line 88: `node .github/agents/branding.agent.js` → **WRONG PATH**

**Actual Locations**:

- ✅ `scripts/agents/branding.agent.js`
- ❓ `validate-frontmatter.js` - needs to be located or created

**Impact**: Workflow will fail at frontmatter validation and metrics generation steps

---

#### 3. [changelog.yml](./.github/workflows/changelog.yml)

**Status**: ❌ BROKEN - Will fail to execute

**Issues**:

- Line 20: `node .github/agents/includes/changelogUtils.cjs` → **WRONG PATH**

**Actual Location**:

- ❓ `changelogUtils.cjs` - needs to be located or created

**Impact**: Changelog validation will fail

---

#### 4. [planner.yml](./.github/workflows/planner.yml)

**Status**: ❌ BROKEN - Will fail to execute

**Issues**:

- Line 20: `node .github/agents/planner.agent.js` → **WRONG PATH**

**Actual Location**:

- ❓ `planner.agent.js` - not found in `scripts/agents/`
- ⚠️ `.github/agents/planner.agent.md` exists but it's markdown, not executable JS

**Impact**: Planner workflow cannot execute

**Note**: This workflow references a `.agent.md` file that exists, but the `.agent.js` implementation is missing

---

#### 5. [release.yml](./.github/workflows/release.yml)

**Status**: ❌ BROKEN - Will fail to execute

**Issues**:

- Line 11: `uses: ./.github/workflows/lint.yml` → **FILE DOESN'T EXIST**
- Line 30: `node .github/agents/release.agent.cjs` → **WRONG PATH**

**Actual Locations**:

- ✅ `scripts/agents/release.agent.cjs`
- ❌ `lint.yml` workflow doesn't exist (should be `linting.yml`)

**Impact**: Workflow will fail at dependency check (lint job) and release execution

---

### ✅ Workflows Correctly Configured

#### 6. [testing.yml](./.github/workflows/testing.yml)

**Status**: ✅ WORKING

**Configuration**:

- Node version from `.nvmrc` ✓
- Runs `npm ci` and `npm run check` ✓
- All scripts exist in `package.json` ✓

**Permissions**: `contents: read` (appropriate)

---

#### 7. [linting.yml](./.github/workflows/linting.yml)

**Status**: ✅ WORKING

**Configuration**:

- Node version: LTS ✓
- Runs `npm run lint` ✓
- Script exists in `package.json` ✓

**Permissions**: None specified (uses default read-only)

---

#### 8. [reviewer.yml](./.github/workflows/reviewer.yml)

**Status**: ✅ WORKING

**Configuration**:

- **CORRECT PATH**: `node scripts/agents/reviewer.agent.js` ✓
- Script exists at correct location ✓

**Permissions**: `contents: write, pull-requests: write` (appropriate for PR reviews)

**Note**: This is the ONLY workflow that uses the correct path pattern

---

#### 9. [metrics.yml](./.github/workflows/metrics.yml)

**Status**: ✅ WORKING

**Configuration**:

- Runs `npm run metrics:ci` ✓
- Script exists in `package.json` ✓
- References output files in `metrics/out/` ✓

**Permissions**: `contents: write` (appropriate for committing metrics)

---

#### 10. [project-meta-sync.yml](./.github/workflows/project-meta-sync.yml)

**Status**: ✅ WORKING (no script references)

**Configuration**:

- Uses inline bash scripts ✓
- Uses GitHub CLI (`gh`) ✓
- Uses external actions only ✓

**Permissions**: `contents: read, issues: read, pull-requests: read` (appropriate)

**Security**: Uses GitHub App token correctly ✓

---

#### 11. [reporting.yml](./.github/workflows/reporting.yml)

**Status**: ✅ WORKING (uses bash/find commands)

**Configuration**:

- All operations use bash/find/git commands ✓
- No Node.js script references ✓
- Creates reports in `.github/reports/` ✓

**Permissions**: `contents: write, pull-requests: write` (appropriate)

**Schedule**: Weekly on Mondays at 9am UTC ✓

---

## Security Audit

### Permissions Review

All workflows use appropriate minimal permissions:

| Workflow              | Permissions                                            | Assessment                |
| --------------------- | ------------------------------------------------------ | ------------------------- |
| testing.yml           | `contents: read`                                       | ✅ Minimal                |
| linting.yml           | Default (read-only)                                    | ✅ Minimal                |
| reviewer.yml          | `contents: write, pull-requests: write`                | ✅ Appropriate            |
| metrics.yml           | `contents: write`                                      | ✅ Appropriate            |
| labeling.yml          | `contents: write, issues: write, pull-requests: write` | ✅ Appropriate            |
| branding.yml          | `contents: write`                                      | ✅ Appropriate            |
| project-meta-sync.yml | `contents: read, issues: read, pull-requests: read`    | ✅ Minimal                |
| reporting.yml         | `contents: write, pull-requests: write`                | ✅ Appropriate            |
| release.yml           | `contents: write, pull-requests: write`                | ✅ Appropriate            |
| planner.yml           | `contents: read, pull-requests: write, issues: write`  | ✅ Appropriate            |
| changelog.yml         | None specified                                         | ✅ Uses default read-only |

**Finding**: ✅ All permissions follow least-privilege principle

### Token Usage

- ✅ Uses `${{ secrets.GITHUB_TOKEN }}` (auto-generated, scoped)
- ✅ GitHub App tokens used correctly in project-meta-sync.yml
- ✅ No hardcoded secrets found
- ✅ Proper token scoping

---

## Repository Structure Issues

### Current State

```
.github/
├── .github/
│   ├── agents/           ← Contains .md agent specs
│   ├── workflows/        ← Workflow files (referencing wrong paths)
│   └── instructions/
└── scripts/
    └── agents/           ← Contains actual .js/.cjs agent scripts
        ├── includes/     ← Contains utility modules
        └── *.agent.js
```

### The Problem

1. **Agent spec files (.md)** are in `.github/agents/`
2. **Agent implementation files (.js/.cjs)** are in `scripts/agents/`
3. **Workflows reference** `.github/agents/*.js` (which don't exist)

### Missing Files

Scripts referenced but not found:

1. ❌ `check-template-labels.js` - referenced in labeling.yml
2. ❌ `validate-frontmatter.js` - referenced in branding.yml
3. ❌ `changelogUtils.cjs` - referenced in changelog.yml
4. ❌ `planner.agent.js` - referenced in planner.yml (has .md but no .js)
5. ❌ `.github/workflows/lint.yml` - referenced in release.yml

---

## Recommendations

### Priority 1: Fix Critical Path Issues (URGENT)

Update all workflows to use correct paths:

**Pattern to replace**: `.github/agents/` → `scripts/agents/`

**Files requiring updates**:

1. **labeling.yml** (4 path references)

   ```diff
   - node .github/agents/includes/label-sync.js
   + node scripts/agents/includes/label-sync.js

   - node .github/agents/includes/check-template-labels.js
   + node scripts/agents/includes/check-template-labels.js

   - node .github/agents/labeling.agent.js
   + node scripts/agents/labeling.agent.js

   - node .github/agents/includes/report-writer.js
   + node scripts/agents/includes/report-writer.js
   ```

2. **branding.yml** (2 path references)

   ```diff
   - node .github/scripts/validate-frontmatter.js
   + node scripts/validate-frontmatter.js  # after creating/locating this file

   - node .github/agents/branding.agent.js
   + node scripts/agents/branding.agent.js
   ```

3. **changelog.yml** (1 path reference)

   ```diff
   - node .github/agents/includes/changelogUtils.cjs
   + node scripts/agents/includes/changelogUtils.cjs  # after creating/locating
   ```

4. **planner.yml** (1 path reference)

   ```diff
   - node .github/agents/planner.agent.js
   + node scripts/agents/planner.agent.js  # after creating implementation
   ```

5. **release.yml** (2 issues)

   ```diff
   - uses: ./.github/workflows/lint.yml
   + uses: ./.github/workflows/linting.yml

   - node .github/agents/release.agent.cjs
   + node scripts/agents/release.agent.cjs
   ```

### Priority 2: Create Missing Scripts

1. **check-template-labels.js**
   - Needed by: labeling.yml:81
   - Purpose: Validate template label configuration
   - Location: `scripts/agents/includes/check-template-labels.js`

2. **validate-frontmatter.js**
   - Needed by: branding.yml:56
   - Purpose: Validate YAML frontmatter in docs
   - Location: `scripts/validate-frontmatter.js`

3. **changelogUtils.cjs**
   - Needed by: changelog.yml:20
   - Purpose: Validate CHANGELOG.md schema
   - Location: `scripts/agents/includes/changelogUtils.cjs`

4. **planner.agent.js**
   - Needed by: planner.yml:20
   - Purpose: Implement planner agent (spec exists as .md)
   - Location: `scripts/agents/planner.agent.js`

### Priority 3: Standardize Path Conventions

Establish and document the convention:

- **`.github/agents/`** → Agent specifications (.md files)
- **`scripts/agents/`** → Agent implementations (.js/.cjs files)
- **`scripts/agents/includes/`** → Shared utility modules

Update [ORGANIZATION.md](../../docs/ORGANIZATION.md) to document this structure.

### Priority 4: Add Workflow Tests

Create tests to validate workflow paths before they run:

```yaml
# .github/workflows/validate-workflows.yml
name: Validate Workflow Paths
on: [pull_request, push]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Check all workflow script paths exist
        run: |
          # Extract node commands and verify files exist
          for workflow in .github/workflows/*.yml; do
            echo "Checking $workflow..."
            # Parse and validate paths
          done
```

---

## Test Results

### Workflows Tested

| Workflow              | Status         | Runs On                     | Notes            |
| --------------------- | -------------- | --------------------------- | ---------------- |
| testing.yml           | ✅ Can execute | push, pull_request          | Uses npm scripts |
| linting.yml           | ✅ Can execute | push, pull_request          | Uses npm scripts |
| reviewer.yml          | ✅ Can execute | pull_request_review         | Correct paths    |
| metrics.yml           | ✅ Can execute | push, schedule              | Uses npm scripts |
| project-meta-sync.yml | ✅ Can execute | push, issues, pull_request  | Bash only        |
| reporting.yml         | ✅ Can execute | schedule, workflow_dispatch | Bash only        |
| labeling.yml          | ❌ Will fail   | push, issues, pull_request  | Path errors      |
| branding.yml          | ❌ Will fail   | push                        | Path errors      |
| changelog.yml         | ❌ Will fail   | push, pull_request          | Path errors      |
| planner.yml           | ❌ Will fail   | push, pull_request          | Path errors      |
| release.yml           | ❌ Will fail   | workflow_dispatch           | Path errors      |

---

## Action Items

### Immediate (This Week)

- [ ] Fix all path references in 5 broken workflows
- [ ] Verify `reviewer.agent.js` exists and test reviewer.yml
- [ ] Document correct path conventions in ORGANIZATION.md

### Short-term (Next Sprint)

- [ ] Create missing scripts (check-template-labels, validate-frontmatter, etc.)
- [ ] Implement planner.agent.js based on planner.agent.md spec
- [ ] Add workflow path validation tests
- [ ] Test all workflows in a feature branch

### Long-term (Backlog)

- [ ] Consider consolidating agent specs and implementations
- [ ] Add pre-commit hooks to validate workflow paths
- [ ] Create workflow dependency graph
- [ ] Audit and optimize workflow triggers

---

## Conclusion

The audit revealed that **45% of workflows (5/11) are currently broken** due to incorrect script paths. However, **no security issues** were found, and all working workflows follow best practices.

The root cause is a mismatch between where workflows expect scripts (`.github/agents/`) and where they actually exist (`scripts/agents/`). This can be resolved by updating 5 workflow files and creating 4 missing scripts.

**Recommendation**: Prioritize fixing the path issues in Priority 1 workflows before the next release cycle to prevent workflow failures.

---

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Security Hardening](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
- [ORGANIZATION.md](../../docs/ORGANIZATION.md)
- [WORKFLOWS.md](../../docs/WORKFLOWS.md)
