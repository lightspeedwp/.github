# Workflow Shell Control-Flow Refactoring Guide

## Overview

This document tracks the refactoring of GitHub Actions workflows to fix shell control-flow errors. GitHub Actions does not allow multiline shell logic (if/for/while) directly in `run:` blocks.

## Status

### ✅ Completed (6 workflows)

1. ✅ **CI • Unified Checks** - Added path filters to validate only changed files
2. ✅ **validate-pr-template** - Removed duplicate merge_group trigger
3. ✅ **validate-mermaid-pr** - Fully disabled (consolidated to docs-validation.yml)
4. ✅ **metrics-reporting** - Fixed invalid cron syntax
5. ✅ **metadata-governance** - Moved shell logic to `scripts/summarize-native-type.sh`
6. ✅ **changelog-management** - Moved shell logic to `scripts/report-changelog-action.sh`

### ⏳ In Progress / To Do (5 workflows)

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
  run: bash scripts/check-mermaid-diagrams.sh
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

#### 2. **documentation.yml** (2 steps)

**Step: Check validation outcomes**

- Location: Search for "Check validation outcomes"
- Issue: Multiline if statements
- Solution: Extract to helper script or use node script

**Step: Generate audit report**

- Location: Search for "Generate audit report"
- Issue: Complex shell logic
- Solution: Extract shell logic to separate script

#### 3. **meta.yml** (1 step)

**Step: Open or update automation PR**

- Location: Line 220
- Issue: Nested if statement checking git diff
- Solution: Create `scripts/open-automation-pr.sh` wrapper

#### 4. **metrics-pipeline.yml** (2 steps)

**Step: Validate report structure**

- Issue: Multiline validation logic
- Solution: Use Node.js helper script

**Step: Check for uppercase filenames**

- Issue: Multiline find command with if
- Solution: Create `scripts/check-filename-case.sh`

## Helper Scripts Created

| Script | Location | Purpose | Tests |
|--------|----------|---------|-------|
| `identify-changed-markdown.js` | `scripts/` | Find changed MD files safely | ✅ Tested |
| `collect-validation-results.js` | `scripts/` | Aggregate validation outcomes | ✅ Tested |
| `check-mermaid-diagrams.sh` | `scripts/` | Detect mermaid syntax in files | ✅ Tested |
| `report-changelog-action.sh` | `scripts/` | Report changelog merge results | ✅ Tested |
| `summarize-native-type.sh` | `scripts/` | Summarize native type sync | ✅ Tested |

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
run: node scripts/my-helper.js
env:
  EVENT_NAME: ${{ github.event_name }}
```

## Best Practices

1. **Always use environment variables** - Never pass complex values as command-line arguments
2. **Use execFileSync** - In Node.js scripts, prefer execFileSync over execSync for safety
3. **One script per workflow operation** - Keep scripts focused and testable
4. **Add tests** - Every helper script should have tests in `scripts/__tests__/`
5. **Document the purpose** - Add comments explaining what the script does

## Testing

All helper scripts have tests in `scripts/__tests__/workflow-helpers.test.js`:

```bash
npm test -- scripts/__tests__/workflow-helpers.test.js
```

## References

- [GitHub Actions Limitations](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsrun)
- [Using Node.js safely in workflows](https://nodejs.org/api/child_process.html#child_process_child_process_execfile_file_args_options_callback)
- [Workflow validation script](scripts/validation/validate-workflows.js)
