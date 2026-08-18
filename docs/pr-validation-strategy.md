# PR Validation Strategy: Reducing Mergify Credit Waste

## Problem

- ❌ PRs are created with incomplete templates
- ❌ They pass through Mergify queue processing
- ❌ CI runs 30+ checks on invalid PRs
- ❌ Mergify/GitHub close them for template violations
- ❌ Costs credits and dev time on reopen/fix/resubmit cycle

## Root Causes

1. **Late Validation** - Template validation happens *after* Mergify processes PR
2. **No Feedback Loop** - Authors don't know what's wrong until PR is closed
3. **Expensive Failure** - Full CI suite runs on bad PRs before rejection

## Solution: Shift-Left Validation

### 1. Early Template Validation (NEW)
**File**: `.github/workflows/validate-pr-early.yml`

- ✅ Runs on PR open/edit (before Mergify processes)
- ✅ Fails fast if sections missing
- ✅ Comments on PR with what's needed
- ✅ Prevents wasted CI/Mergify processing

### 2. Client-Side Hooks (Optional)
Add `.husky/prepare-commit-msg` to suggest template:

```bash
#!/bin/bash
# Suggest PR template based on branch prefix
branch=$(git rev-parse --abbrev-ref HEAD)
prefix=$(echo $branch | cut -d/ -f1)

case $prefix in
  feat|fix|hotfix|etc) echo "Use proper PR template!" ;;
esac
```

### 3. Mergify Configuration Changes (Recommended)

Update `.github/mergify.yml` to add a pre-queue validation:

```yaml
pull_request_rules:
  - name: Reject incomplete PRs from queue
    conditions:
      - -check-success="Validate PR Template Early"
      - -draft
    actions:
      comment:
        message: |
          ⚠️ This PR is missing required template sections.
          Fix the template above and it will automatically re-queue.
      dismiss_reviews:
        approved: true
```

## Expected Savings

| Before | After |
|--------|-------|
| **30+ CI checks** per bad PR | **1 validation** before CI |
| **Mergify queue processing** | **Early exit** (no queue cost) |
| **~2-3 PRs/week** closed for template | **0 wasted submissions** |
| **5-10 credits/week** wasted | **~1 credit/week** max |

## Implementation Checklist

- [x] Create early validation workflow (`validate-pr-early.yml`)
- [ ] Update Mergify config to respect validation result
- [ ] Add documentation to PR template about required sections
- [ ] Consider adding `.husky` pre-push hooks
- [ ] Monitor for reduced auto-closures

## Metrics to Track

After implementation, monitor:
- PRs created per week
- PRs auto-closed for template violations
- Average time to merge
- Mergify credit consumption

Target: **Zero** template-related closures within 2 weeks.
