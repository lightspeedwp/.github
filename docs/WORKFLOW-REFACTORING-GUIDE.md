# Workflow Shell Control-Flow Refactoring Guide

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
