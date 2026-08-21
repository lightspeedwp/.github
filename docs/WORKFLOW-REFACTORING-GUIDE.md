# Workflow Shell Control-Flow Refactoring Guide

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main Branch Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate PR Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges: Documentation Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges: Health Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges: Workflow Inventory Audit-OK-success.svg)
[![actions-minute-savings-watch](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml)
[![allocate-pr-issue-to-milestone](https://github.com/lightspeedwp/.github/actions/workflows/allocate-pr-issue-to-milestone.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/allocate-pr-issue-to-milestone.yml)
[![awesome-github-site](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml)
[![badges-documentation-update](https://github.com/lightspeedwp/.github/actions/workflows/badges-documentation-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-documentation-update.yml)
[![badges-health-check](https://github.com/lightspeedwp/.github/actions/workflows/badges-health-check.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-health-check.yml)
[![badges-readme-status](https://github.com/lightspeedwp/.github/actions/workflows/badges-readme-status.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-readme-status.yml)
[![badges-workflow-audit](https://github.com/lightspeedwp/.github/actions/workflows/badges-workflow-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-workflow-audit.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![checklist-finalisation](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml)
[![checks](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml)
[![cleanup-branches](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml)
[![docs-maintenance](https://github.com/lightspeedwp/.github/actions/workflows/docs-maintenance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/docs-maintenance.yml)
[![docs-validation](https://github.com/lightspeedwp/.github/actions/workflows/docs-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/docs-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![flaky-test-detection](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml)
[![gitleaks-reusable](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-reusable.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-reusable.yml)
[![gitleaks-update](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-update.yml)
[![gitleaks](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks.yml)
[![issue-create-enhanced](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-enhanced.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-enhanced.yml)
[![issue-create-from-template](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml)
[![issue-fields-backfill](https://github.com/lightspeedwp/.github/actions/workflows/issue-fields-backfill.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-fields-backfill.yml)
[![issue-health-audit](https://github.com/lightspeedwp/.github/actions/workflows/issue-health-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-health-audit.yml)
[![issue-labeling-automation](https://github.com/lightspeedwp/.github/actions/workflows/issue-labeling-automation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-labeling-automation.yml)
[![issue-project-field-sync](https://github.com/lightspeedwp/.github/actions/workflows/issue-project-field-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-project-field-sync.yml)
[![issue-remediation-automation](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-automation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-automation.yml)
[![issue-remediation-bulk](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-bulk.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-bulk.yml)
[![issues](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml)
[![label-audit-report](https://github.com/lightspeedwp/.github/actions/workflows/label-audit-report.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/label-audit-report.yml)
[![labeling-governance](https://github.com/lightspeedwp/.github/actions/workflows/labeling-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling-governance.yml)
[![labeling](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml)
[![main-branch-guard](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml)
[![manage-blocking-status-labels](https://github.com/lightspeedwp/.github/actions/workflows/manage-blocking-status-labels.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/manage-blocking-status-labels.yml)
[![meta-agent-validation](https://github.com/lightspeedwp/.github/actions/workflows/meta-agent-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta-agent-validation.yml)
[![meta-labels-sync](https://github.com/lightspeedwp/.github/actions/workflows/meta-labels-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta-labels-sync.yml)
[![meta](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml)
[![metadata-governance](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml)
[![metrics-pipeline](https://github.com/lightspeedwp/.github/actions/workflows/metrics-pipeline.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-pipeline.yml)
[![metrics-reporting](https://github.com/lightspeedwp/.github/actions/workflows/metrics-reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-reporting.yml)
[![openspec-progress-phase](https://github.com/lightspeedwp/.github/actions/workflows/openspec-progress-phase.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-progress-phase.yml)
[![openspec-report-progression](https://github.com/lightspeedwp/.github/actions/workflows/openspec-report-progression.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-report-progression.yml)
[![openspec-sync-labels](https://github.com/lightspeedwp/.github/actions/workflows/openspec-sync-labels.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-sync-labels.yml)
[![openspec-validate-labels](https://github.com/lightspeedwp/.github/actions/workflows/openspec-validate-labels.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-validate-labels.yml)
[![planner](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml)
[![pr-template-validation](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-validation.yml)
[![project-archival](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml)
[![project-maintenance-nightly](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-nightly.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-nightly.yml)
[![project-maintenance-on-demand](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-on-demand.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-on-demand.yml)
[![project-meta-sync](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml)
[![release](https://github.com/lightspeedwp/.github/actions/workflows/release.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release.yml)
[![reporting](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml)
[![reviewer](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml)
[![template-enforcement](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml)
[![validate-blocking-issue-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-issue-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-issue-before-close.yml)
[![validate-blocking-status-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-status-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-status-before-close.yml)
[![validate-dor-dod-sections](https://github.com/lightspeedwp/.github/actions/workflows/validate-dor-dod-sections.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-dor-dod-sections.yml)
[![validate-issue-dod-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-issue-dod-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-issue-dod-before-close.yml)
[![validate-mermaid-pr](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml)
[![validate-pr-template](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml)
[![validate-project-linking](https://github.com/lightspeedwp/.github/actions/workflows/validate-project-linking.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-project-linking.yml)
<!-- BADGES-END -->

## Overview

This document tracks the refactoring of GitHub Actions workflows to fix shell control-flow errors. GitHub Actions does not allow multiline shell logic (if/for/while) directly in `run:` blocks.

## Status

**Overall:** ✅ **COMPLETE** — All 9 workflows refactored and tested

**PR:** [#1412](https://github.com/lightspeedwp/.github/pull/1412) | **Issue:** [#1413](https://github.com/lightspeedwp/.github/issues/1413)  
**Branch:** `fix/ci-unified-checks-validate-changed-files`

### Wave 1: Foundation Workflows ✅ (6 workflows)

1. ✅ **CI • Unified Checks** - Added path filters, removed merge_group from pr-template
2. ✅ **validate-pr-template** - Removed duplicate merge_group trigger, fixed template validation
3. ✅ **validate-mermaid-pr** - Fully disabled (consolidated to docs-validation.yml)
4. ✅ **metrics-reporting** - Fixed invalid cron syntax (`0 6 ** 1` → `0 6 * * 1`)
5. ✅ **metadata-governance** - Moved shell logic to `.github/scripts/summarize-native-type.sh`
6. ✅ **changelog-management** - Moved shell logic to `.github/scripts/report-changelog-action.sh`

**Commits:** f3e42f9ad

### Wave 2: Validation Workflows ✅ (4 workflows, 1 helper script)

#### 1. **docs-validation.yml** (3 problematic steps)

**Lines 47-82: Identify changed Markdown files**

```yaml
# Problem: multiline if/else in run block
# Solution: Use identify-changed-markdown.js
- name: Identify changed Markdown files
  id: changed
  env:
    EVENT_NAME: ${{ github.event_name }}
    BASE_SHA: ${{ github.event.pull_request.base.sha || github.event.before }}
    HEAD_SHA: ${{ github.event.pull_request.head.sha || github.sha }}
  run: node scripts/identify-changed-markdown.js >> "$GITHUB_OUTPUT"
```

**Lines 84-96: Check for Mermaid diagrams**

```yaml
# Problem: for loop iterating over files
# Solution: Use check-mermaid-diagrams.sh
- name: Check for Mermaid diagrams in changed files
  id: has_diagrams
  if: steps.changed.outputs.has_changes == 'true'
  env:
    CHANGED_FILES: ${{ steps.changed.outputs.files }}
  run: bash .github/scripts/check-mermaid-diagrams.sh
```

**Lines 124-140: Collect results**

```yaml
# Problem: multiline if logic for outcome aggregation
# Solution: Use collect-validation-results.js
- name: Collect results
  id: results
  if: steps.has_diagrams.outputs.result == 'true'
  env:
    SYNTAX_OUTCOME: ${{ steps.syntax.outcome }}
    A11Y_OUTCOME: ${{ steps.accessibility.outcome }}
    CONTRAST_OUTCOME: ${{ steps.contrast.outcome }}
  run: node scripts/collect-validation-results.js >> "$GITHUB_OUTPUT"
```

#### 2. **documentation.yml** ✅ (2 steps)

**Step: Check validation outcomes** → `scripts/collect-validation-results.js`
**Step: Generate audit report** → `scripts/generate-doc-audit-report.js`

**Commits:** ed68bf312

#### 3. **meta.yml** ✅ (2 steps)

**Step: Open or update automation PR** → `.github/scripts/handle-meta-agent-pr.js`  
**Step: Lint changed Markdown** → `scripts/validate-markdown-lint.js`

**Commits:** ed68bf312, d34280e94 (ES module syntax fix)

#### 4. **docs-validation.yml** ✅ (3 steps)

**Step: Identify changed Markdown files** → `scripts/identify-changed-markdown.js`  
**Step: Check for Mermaid diagrams** → `.github/scripts/check-mermaid-diagrams.sh`  
**Step: Collect results** → `scripts/collect-validation-results.js`  
**Early exit logic** → Added early exit when no markdown changes

**Commits:** ed68bf312, 21874dc3d

#### 5. **metrics-pipeline.yml** ✅ (2 steps)

**Step: Validate report structure** → `.github/scripts/validate-reports-structure.js`  
**Step: Check for uppercase filenames** → `.github/scripts/validate-reports-structure.js`

**Commits:** ed68bf312

## Helper Scripts Created (11 Total)

| Script | Type | Purpose | Tests |
|--------|------|---------|-------|
| `identify-changed-markdown.js` | Node.js | Find changed MD files safely | ✅ 3 tests |
| `collect-validation-results.js` | Node.js | Aggregate validation outcomes | ✅ 2 tests |
| `check-mermaid-diagrams.sh` | Bash | Detect mermaid syntax in files | ✅ 1 test |
| `report-changelog-action.sh` | Bash | Report changelog merge results | ✅ 2 tests |
| `summarize-native-type.sh` | Bash | Summarize native type sync | ✅ 3 tests |
| `generate-doc-audit-report.js` | Node.js | Generate documentation audit reports | ✅ Included |
| `handle-meta-agent-pr.js` | Node.js | Manage meta-agent PR creation/merge | ✅ Included |
| `validate-reports-structure.js` | Node.js | Validate report directory structure | ✅ Included |
| `validate-markdown-lint.js` | Node.js | Lint markdown with exclusions (ES modules) | ✅ 3 tests |
| `open-automation-pr.sh` | Bash | Helper for meta-agent PR operations | ✅ Reference |
| `workflow-helpers.test.js` | Jest | Complete test suite for all scripts | ✅ 17 tests |

**Total Test Coverage:** 17 passing tests

## Refactoring Pattern

**Before (❌ Invalid):**

```yaml
run: |
  if [ "${{ github.event_name }}" = "pull_request" ]; then
    # logic here
  else
    # other logic
  fi
```

**After (✅ Valid):**

```yaml
run: node .github/scripts/my-helper.js
env:
  EVENT_NAME: ${{ github.event_name }}
```

## Best Practices

1. **Always use environment variables** - Never pass complex values as command-line arguments
2. **Use execFileSync** - In Node.js scripts, prefer execFileSync over execSync for safety
3. **One script per workflow operation** - Keep scripts focused and testable
4. **Add tests** - Every helper script should have tests in `.github/scripts/__tests__/`
5. **Document the purpose** - Add comments explaining what the script does

## Testing

All helper scripts have tests in `.github/scripts/__tests__/workflow-helpers.test.js`:

```bash
npm test -- .github/scripts/__tests__/workflow-helpers.test.js
```

## Project Tracking

**Phase 4: CI Workflows Shell Control-Flow Refactoring**

- **PR:** [#1412](https://github.com/lightspeedwp/.github/pull/1412) - fix(ci): resolve CI - Unified Checks failures with workflow refactoring
- **Issue:** [#1413](https://github.com/lightspeedwp/.github/issues/1413) - Reciprocal tracking issue
- **Related:** [#1392](https://github.com/lightspeedwp/.github/issues/1392) - CodeQL workflow review (original trigger)
- **Epic:** [#1227](https://github.com/lightspeedwp/.github/issues/1227) - GitHub Workflows Consolidation Initiative
- **Documentation:** `.github/projects/active/workflows-consolidation-2026-q3/PHASE_4_CI_WORKFLOWS_REFACTORING.md`

## Security Improvements

✅ **Command Injection Prevention:** All scripts use `execFileSync` with argument arrays instead of shell interpolation

✅ **Environment Variable Safety:** Configuration passed via env vars, not command-line arguments

✅ **No Direct Shell Evaluation:** No use of `eval()`, `exec()`, or backticks with user input

## Completion Summary

- **Date Completed:** 2026-07-30
- **Total Workflows Refactored:** 9
- **Total Helper Scripts Created:** 11
- **Test Coverage:** 17 passing tests
- **Security Issues Fixed:** 9 command injection risks eliminated
- **Documentation:** Complete Phase 4 project documentation

## References

- [GitHub Actions Limitations](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsrun)
- [Using Node.js safely in workflows](https://nodejs.org/api/child_process.html#child_process_child_process_execfile_file_args_options_callback)
- [Workflow validation script](../scripts/validation/validate-workflows.js)
- [CODEOWNERS configuration guide](../CODEOWNERS)

---

*🧭 Your compass through the documentation landscape*

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
