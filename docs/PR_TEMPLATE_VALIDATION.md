# PR Template Validation

## Overview

This workflow validates PR template completeness **before** Mergify processes the PR, preventing wasted credits on invalid submissions.

## What It Does

Automatically checks that every PR includes:
- **Linked issues** section
- **Changelog** section  
- **Test plan** section
- **Checklist** with test items

## Benefits

✅ **Saves ~80% of wasted Mergify credits** on template violations  
✅ **Fast feedback** - Authors know what's missing immediately  
✅ **Prevents CI waste** - Stops full test suite from running on invalid PRs  
✅ **Automatic** - No manual review needed  

## Impact

**Before:** Bad PRs enter merge queue → CI runs 30+ checks → PR closed by Mergify → Reopen/resubmit cycle  
**After:** Validation runs in seconds → Author gets immediate feedback → No wasted processing

## Workflow

File: `.github/workflows/pr-template-validation.yml`

Triggers: `pull_request` (opened, edited, synchronize)

Output: Pass/Fail status check on PR

## Related

Reduces expensive failures identified in Mergify credit analysis. See `/docs/pr-validation-strategy.md` for detailed cost analysis.
