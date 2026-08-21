---
file_type: documentation
title: Mergify Strategy & Implementation
description: Complete guide to Mergify configuration, auto-merge rules, and troubleshooting
version: v1.0.1
last_updated: '2026-08-21'
owners:
  - lightspeedwp
---

# Mergify Strategy & Implementation

This document describes how Mergify is configured and used for automated pull request merging in the LightSpeedWP/.github repository.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Configuration](#configuration)
- [Auto-Merge Rules](#auto-merge-rules)
- [Queue System](#queue-system)
- [Known Issues](#known-issues)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)
- [Improvement Recommendations](#improvement-recommendations)

## Overview

Mergify is a GitHub App that automates pull request merging based on configurable rules. We use it for:

1. **Dependabot dependency updates** - Auto-merge when CI passes
2. **ImgBot image optimisations** - Auto-merge when CI passes
3. **Meta-agent sync PRs** - Auto-merge automated metadata updates
4. **Merge queue management** - Sequential merging to prevent conflicts
5. **Flaky test detection** - Integration with CI/CD health monitoring

### Current Status

- **Configuration File**: `.github/mergify.yml`
- **Active Rules**: 4 auto-merge rules + 1 queue rule
- **Known Issues**: Dependabot auto-merge not working; meta-agent double-merge attempts

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Pull Request Events                   │
│              (opened, synchronize, edited)               │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                 Mergify Rules Engine                     │
│            Evaluates conditions for each PR              │
└────────┬──────────────────┬──────────────────┬──────────┘
         │                  │                  │
         ▼                  ▼                  ▼
    ┌─────────┐      ┌───────────┐      ┌────────────┐
    │ Queue   │      │ Direct    │      │ No Action  │
    │ (Merge) │      │ Merge     │      │            │
    └─────────┘      └───────────┘      └────────────┘
```

### Components

1. **Rules Engine** - Evaluates PR conditions against defined rules
2. **Queue System** - Manages sequential merging to prevent race conditions
3. **Check Validation** - Verifies CI status before merging
4. **Workflow Integration** - Communicates with GitHub Actions workflows
5. **Flaky Test Detection** - Reports test reliability metrics

## Configuration

### File Location

```
.github/mergify.yml
```

### Structure

```yaml
queue_rules:
  - name: <queue-name>
    merge_method: squash|merge|rebase

pull_request_rules:
  - name: <rule-name>
    conditions:
      - <condition-1>
      - <condition-2>
    actions:
      update: {}        # Rebase PR if base moved ahead
      review: {}        # Approve PR
      queue: {}         # Add to merge queue
      merge: {}         # Direct merge (not queued)

merge_protections_settings:
  reporting_method: check-runs
  auto_merge_conditions: true
```

### Merge Methods

- **squash**: Squash all commits into one (recommended)
- **merge**: Create merge commit
- **rebase**: Rebase onto base branch

We standardly use **squash** for clean history.

## Auto-Merge Rules

### Rule 1: Keep Dependabot PRs Current

**Purpose**: Rebase Dependabot PRs if develop branch moved ahead

**Conditions**:

- Author is Dependabot (`dependabot[bot]` or `app/dependabot`)
- Base branch is `develop`
- Has `area:dependencies` label
- Not a draft
- No merge conflicts
- More than 0 commits behind

**Actions**:

- Rebase the PR to incorporate latest develop changes

**Trigger**: Automatic on develop updates

**Current Status**: ⚠️ **May not be working** - Base branch needs to update for trigger

---

### Rule 2: Auto-Approve and Queue Dependabot Updates

**Purpose**: Approve and queue Dependabot PRs for automatic merging

**Conditions**:

- Author is Dependabot (`dependabot[bot]` or `app/dependabot`)
- Base branch is `develop`
- Has `area:dependencies` label
- Check success: `All Checks Passed` ⚠️ **Issue: Check name mismatch**
- Not a draft
- No merge conflicts

**Actions**:

- Approve PR with type `APPROVE`
- Queue for merge using `dependabot-develop` queue

**Queue Configuration**:

- Name: `dependabot-develop`
- Merge method: `squash`

**Current Status**: ❌ **Not working** - Known issue #1209

**Issues**:

1. Check name "All Checks Passed" doesn't match actual CI check names
2. Label may not be applied consistently by Dependabot
3. Mergify token may be missing or misconfigured
4. Queue may not be properly executing

---

### Rule 3: Keep ImgBot Current

**Purpose**: Rebase ImgBot image optimization PRs if develop moved ahead

**Conditions**:

- Author is ImgBot (`imgbot[bot]` or `app/imgbot`) - supports both identities
- Base branch is `develop`
- Not a draft
- No merge conflicts
- More than 0 commits behind

**Actions**:

- Rebase the PR

**Trigger**: Automatic on develop updates

**Current Status**: ❓ **Unknown** - No ImgBot PRs created recently

**Notes**:

- Two identities supported due to ImgBot history of identity changes
- No explicit label required

---

### Rule 4: Auto-Merge ImgBot Optimizations

**Purpose**: Automatically merge ImgBot image optimization PRs when CI passes

**Conditions**:

- Author is ImgBot (`imgbot[bot]` or `app/imgbot`)
- Base branch is `develop`
- Check success: `All Checks Passed` ⚠️ **Same check name issue as Dependabot**
- Not a draft
- No merge conflicts

**Actions**:

- Direct merge with squash method

**Current Status**: ❓ **Unknown effectiveness**

**Issues**:

1. Same check name mismatch as Dependabot rule
2. Not used recently (no test data)
3. Direct merge method may cause conflicts if merged out-of-order

---

### Rule 5: Auto-Merge Meta-Agent Sync

**Purpose**: Automatically merge automated metadata update PRs

**Conditions**:

- Author is `lightspeed-bot` ✅ Reliable
- Base branch is `develop`
- Has `meta:no-changelog` label ✅ Applied by workflow
- PR title exactly matches: `^chore\(meta\): automated meta-agent sync$` ✅ Precise
- Check success: `All Checks Passed` ⚠️ **Check name issue**
- Not a draft
- No merge conflicts

**Actions**:

- Direct merge with squash method

**Current Status**: ⚠️ **Double-merge attempt** - See issue #1209

**Issues**:

1. Workflow (meta.yml) ALSO calls `gh pr merge --auto --squash`
2. Both Mergify rule + workflow trying to merge same PR
3. Race condition: which one completes first?
4. Redundant configuration

**Recommended Fix**:
Remove the `gh pr merge --auto --squash` from meta.yml workflow and rely on Mergify rule alone.

---

## Queue System

### Purpose

Prevent race conditions and merge conflicts by executing merges sequentially rather than in parallel.

### Configuration

```yaml
queue_rules:
  - name: dependabot-develop
    merge_method: squash
```

### Behaviour

1. PRs are added to the queue when they meet rule conditions
2. Mergify processes the queue in FIFO order
3. Each PR is validated before merge
4. If merge succeeds, next PR in queue is processed
5. If merge fails, PR is removed from queue and error logged

### Current Queues

- **dependabot-develop**: For Dependabot dependency updates on develop branch

### Issues with Current Implementation

1. **Not executing**: User reports Dependabot PRs don't actually merge
2. **No visibility**: No way to see queue status in GitHub UI
3. **Single queue**: Only one queue configured; may need more for parallel tracks

## Merge Protections Settings

### Configuration

```yaml
merge_protections_settings:
  reporting_method: check-runs
  auto_merge_conditions: true
```

### Options Explained

**reporting_method: check-runs**

- Reports Mergify status as a GitHub check run (appears in PR checks)
- Alternative: `pull-request-comment` (posts comments on PR)
- Current choice is good for CI/CD integration

**auto_merge_conditions: true**

- When enabled: Mergify automatically retries merge if conditions later become true
- When false: Mergify only attempts merge immediately when rule conditions met
- Current choice allows recovery if checks are flaky
- **Trade-off**: May cause unexpected merges if not monitored

## Known Issues

### Issue 1: Dependabot Auto-Merge Not Working

**Symptom**: Dependabot PRs don't merge automatically into develop

**Diagnosis**:

1. Label `area:dependencies` - Check if Dependabot is actually applying this label
2. Check name - Verify actual check name is "All Checks Passed"
3. Queue - Check Mergify dashboard if queue is receiving items
4. Token - Verify MERGIFY_TOKEN secret is configured and valid

**How to Debug**:

```bash
# Check a Dependabot PR's checks
gh pr view <pr-number> --json statusCheckRollup

# Check PR labels
gh pr view <pr-number> --json labels

# Check Mergify logs (requires Mergify dashboard access)
```

**Suspected Causes**:

1. **Check name mismatch** - Mergify looking for "All Checks Passed" but actual check name is different
2. **Missing label** - Dependabot not automatically applying `area:dependencies`
3. **Missing/invalid token** - MERGIFY_TOKEN secret not configured
4. **Queue not processing** - Queue rule defined but not executing

**Recommendation**:
Change check condition to match actual CI check names using regex or wildcard.

---

### Issue 2: Meta-Agent Sync Double-Merge Attempt

**Symptom**: Meta-agent PR gets auto-merged by workflow, then Mergify may also attempt to merge

**Location**:

- Workflow: `.github/workflows/meta.yml` (~line 200-220)
- Rule: `.github/mergify.yml` (lines 59-70)

**Problem**:

```yaml
# In meta.yml workflow:
gh pr merge --auto --squash \
  --subject "chore(meta): apply frontmatter..." \
  "$PR_URL" || true

# PLUS in mergify.yml:
- name: Auto-merge meta-agent sync on develop
  conditions: [...]
  actions:
    merge:
      method: squash
```

**Impact**:

- Redundant configuration
- Potential race condition
- Unclear which method actually merges the PR
- Harder to debug merge failures

**Recommendation**:
Remove the `gh pr merge --auto` call from meta.yml and let Mergify rule handle it.

---

### Issue 3: ImgBot Auto-Merge Effectiveness Unknown

**Symptom**: Unclear if ImgBot rule is still effective

**Reason**: No ImgBot PRs created recently for testing

**Recommendation**:

- Manually test by checking ImgBot PR if one is created
- Or create test PR with ImgBot author to verify
- Document findings

---

## Troubleshooting

### Check if Mergify is Running

1. Look for "Mergify" checks on PR
2. Check Mergify dashboard at mergify.io
3. Look for any Mergify comment on PR

### Check if Rule is Matching

1. Review all PR conditions against rule
2. Common issues:
   - Label not applied (check `gh pr view <num> --json labels`)
   - Check name doesn't match exactly
   - Author mismatch (case-sensitive)
   - Draft state
   - Merge conflicts

### Fix Check Name Mismatch

**Current condition**:

```yaml
check-success=All Checks Passed
```

**Better options**:

```yaml
# Match any check containing "All"
check-success~=All Checks

# Match specific workflow
check-success=build-and-test / build

# Use Mergify's default (any check passing)
check-success=All Checks Passed,All required checks passed

# Multiple checks if needed
check-success=build,test,lint
```

### Verify Labels are Applied

```bash
# Check Dependabot configuration
cat .github/dependabot.yml

# Check what labels Dependabot actually applies to a PR
gh pr view <pr-number> --json labels
```

### Check Queue Status

Unfortunately, GitHub doesn't expose queue status in the UI. Options:

1. Access Mergify dashboard (requires login)
2. Check Mergify's activity logs
3. Monitor PR for Mergify status checks/comments

## Best Practices

### 1. Always Use Squash Merge

**Why**: Keeps git history clean, one commit per feature/fix

**Configuration**:

```yaml
merge_method: squash
```

### 2. Use Queue for Dependency Updates

**Why**: Prevents merge conflicts from parallel merges

**Configuration**:

```yaml
queue:
  name: dependabot-develop
```

### 3. Make Label Application Explicit

**Bad**:

```yaml
conditions:
  - author~=dependabot
  - base=develop
```

**Good**:

```yaml
conditions:
  - author~=dependabot
  - base=develop
  - label=area:dependencies
```

### 4. Use Precise Check Names

**Bad**:

```yaml
check-success=All Checks Passed
```

**Good**:

```yaml
# Run `gh run list` to see actual check names
check-success=build,test,lint,type-check
```

### 5. Document Rule Purpose

```yaml
# Good
- name: Auto-merge Dependabot dependency updates on develop
  description: |
    Automatically merge dependency updates after CI validation.
    Helps keep dependencies current without manual intervention.
  conditions: [...]
```

### 6. Monitor Auto-Merge Effectiveness

Track over time:

- Percentage of PRs that merge automatically
- Time from PR creation to merge
- Merge failure reasons
- False negatives (PRs that should have merged but didn't)

## Improvement Recommendations

### Priority 1: Fix Dependabot Auto-Merge

**Actions**:

1. Identify actual CI check names:

   ```bash
   # Look at recent PRs to see what checks run
   gh pr list --state open --json statusCheckRollup
   ```

2. Update `check-success` condition to match actual check names

3. Verify `area:dependencies` label is applied:

   ```bash
   cat .github/dependabot.yml
   # Should include:
   # labels:
   #   - area:dependencies
   ```

4. Verify MERGIFY_TOKEN secret exists and is valid

5. Test with a real Dependabot PR and monitor merge process

**Timeline**: High priority (blocking dependency updates)

---

### Priority 2: Remove Meta-Agent Double-Merge

**Actions**:

1. Remove this from `.github/workflows/meta.yml`:

   ```yaml
   gh pr merge --auto --squash \
     --subject "..." \
     "$PR_URL" || true
   ```

2. Rely entirely on Mergify rule for meta-agent sync PRs

3. Update PR creation to not request auto-merge:

   ```yaml
   # Remove --auto flag
   gh pr create \
     --base develop \
     --head "$BRANCH" \
     --title "chore(meta): automated meta-agent sync" \
     --label "meta:no-changelog" \
     --body "$PR_BODY"
   ```

4. Let Mergify handle the merge via rule

**Benefits**:

- Single source of truth (Mergify)
- Easier to debug
- No race conditions
- Cleaner workflow code

**Timeline**: Medium priority

---

### Priority 3: Standardize Check Names

**Actions**:

1. Document actual CI check names used in workflows

2. Create matrix of rule-to-check mappings:

   ```
   Dependabot rule -> expects: "All Checks Passed"
   ImgBot rule     -> expects: "All Checks Passed"
   Meta rule       -> expects: "All Checks Passed"
   
   Actual checks in CI: ??
   ```

3. Update all rules to match actual check names

4. Add CI check name validation to branch protection rules

**Timeline**: Medium priority

---

### Priority 4: Implement Mergify Monitoring

**Actions**:

1. Create workflow to monitor Mergify status:
   - Track merge success rate
   - Log merge failures
   - Alert on unusual patterns

2. Add Mergify dashboard link to docs

3. Set up weekly Mergify health report

**Timeline**: Low priority (nice to have)

---

### Priority 5: Consider Multiple Queues

**When**: If we have multiple competing merge tracks

**Current**: Only `dependabot-develop` queue

**Future options**:

```yaml
queue_rules:
  - name: dependabot-develop
    merge_method: squash
  - name: feature-updates
    merge_method: squash
  - name: hotfixes-main
    merge_method: squash
```

**Timeline**: Low priority (not needed yet)

---

## Related Files

- `.github/mergify.yml` - Main configuration
- `.github/workflows/meta.yml` - Meta-agent PR creation
- `.github/workflows/flaky-test-detection.yml` - Mergify GHA usage
- `.github/dependabot.yml` - Dependabot label configuration
- `.github/workflows/main-branch-guard.yml` - Branch protection
- `.github/BRANCHING_STRATEGY.md` - Merge workflow discipline

## References

- [Mergify Documentation](https://docs.mergify.io/)
- [GitHub PR Conditions](https://docs.mergify.io/conditions/)
- [Queue Rules Guide](https://docs.mergify.io/merge-queue/)
- [Troubleshooting Guide](https://docs.mergify.io/faq/)

## Change Log

| Date | Author | Changes |
|------|--------|---------|
| 2026-07-24 | Audit | Initial comprehensive audit and documentation |

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
