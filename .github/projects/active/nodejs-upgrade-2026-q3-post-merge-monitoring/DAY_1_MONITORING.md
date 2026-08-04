---
title: Day 1 — Workflow Monitoring & Edge Case Detection
description: Monitor critical workflows and identify edge cases post-merge
created_date: 2026-07-30
---

# Day 1: Workflow Monitoring & Edge Case Detection

**Objective:** Verify critical workflows run on Node 22; detect edge cases.

## Quick Checklist

- [ ] checks.yml: 3 runs, all passing, test count ≥822, node -v = v22.x
- [ ] release.yml: 5 runs successful, node -v verified
- [ ] meta.yml: 2 runs passed
- [ ] changelog-management.yml: 2 runs passed
- [ ] All logs: 0 "npm ERR!" errors
- [ ] All logs: 0 "DeprecationWarning"

## Detailed Checks

### 1. checks.yml (CRITICAL)

This is the main test & lint workflow. Must pass completely.

**Get recent runs:**

```bash
gh run list --workflow=checks.yml --branch=develop --limit=3 --json status,conclusion,createdAt,databaseId
```

**For each of the 3 runs:**

```bash
gh run view <RUN_ID> --log | grep -E "Test Suites:|Tests:|PASSED|FAILED"
```

**Success criteria:**

- Status: completed ✅
- Conclusion: success ✅
- Test output shows: "Tests: X passed" where X ≥ 822 ✅
- No "FAILED" in output

**Check Node version:**

```bash
gh run view <RUN_ID> --log | grep -E "node -v|npm -v"
```

**Must show:** v22.x.x (e.g., v22.0.0, v22.11.0)  
**If shows v24+:** Create issue immediately (lts/* resolving wrong)  
**If shows v20:** Escalate — rollback required

### 2. release.yml (EDGE CASE)

This workflow uses `lts/*` — high risk of resolving to Node 24+.

**Get recent runs:**

```bash
gh run list --workflow=release.yml --limit=5 --json status,conclusion,createdAt,databaseId
```

**For each run:**

```bash
gh run view <RUN_ID> --log | grep -E "node -v|npm -v"
```

**Check results:**

- If node -v shows v22.x: ✅ GOOD
- If node -v shows v24+: ⚠️ CREATE ISSUE "release.yml needs .nvmrc standardization"
- If node -v shows v20: ❌ ESCALATE — version mismatch

### 3. meta.yml (CRITICAL)

Project metadata synchronization workflow.

**Get recent runs:**

```bash
gh run list --workflow=meta.yml --limit=2 --json status,conclusion
```

**Verify:** Both completed with conclusion=success

### 4. changelog-management.yml (IMPORTANT)

Changelog automation workflow.

**Get recent runs:**

```bash
gh run list --workflow=changelog-management.yml --limit=2 --json status,conclusion
```

**Verify:** Both completed with conclusion=success

## Error Detection

**Search all logs for critical errors:**

```bash
# npm errors
gh run list --workflow=checks.yml --branch=develop --limit=3 --json databaseId | jq -r '.[].databaseId' | while read RUN; do
  echo "=== Run $RUN ==="
  gh run view $RUN --log | grep -c "npm ERR!" || echo "0 npm errors"
done

# Deprecation warnings
gh run list --workflow=checks.yml --branch=develop --limit=3 --json databaseId | jq -r '.[].databaseId' | while read RUN; do
  echo "=== Run $RUN ==="
  gh run view $RUN --log | grep -c "DeprecationWarning" || echo "0 deprecation warnings"
done
```

**If found:**

- npm ERR! → Escalate to DevOps (package issue)
- DeprecationWarning → Log but don't escalate (usually pre-existing)

## Day 1 Sign-Off

When all checks complete, fill in the checklist:

```
✅ checks.yml: 3 runs verified, test count ≥822, Node v22.x
✅ release.yml: 5 runs verified, Node version correct (or issue created)
✅ meta.yml: 2 runs passed
✅ changelog-management.yml: 2 runs passed
✅ Error scan: 0 npm ERR!, 0 unexpected DeprecationWarnings
```

**Next:** Proceed to Day 2 monitoring
