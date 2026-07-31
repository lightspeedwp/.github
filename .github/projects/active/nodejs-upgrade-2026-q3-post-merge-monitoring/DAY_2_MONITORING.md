---
title: Day 2 — Spot-Check & Performance Verification
description: Sample recent workflows; verify performance within baseline
created_date: 2026-07-30
---

# Day 2: Spot-Check & Performance Verification

**Objective:** Sample workflow runs; verify no performance regression; confirm baseline stability.

## Quick Checklist

- [ ] 2 checks.yml runs sampled, test count 822/822 in both
- [ ] Test execution time: both within ±10% of baseline
- [ ] npm ci time: both within ±15% of baseline
- [ ] All exit codes: 0 (no failures)
- [ ] npm audit: 0 critical/high vulnerabilities
- [ ] No unexpected npm WARN messages

## Detailed Verification

### 1. Sample 2 Recent checks.yml Runs

**Get 2 most recent successful runs:**

```bash
gh run list --workflow=checks.yml --branch=develop --limit=2 --json databaseId,conclusion,createdAt
```

**Pick the 2 from output; download full logs:**

```bash
gh run view <RUN_ID_1> --log > monitoring-day2-run1.log
gh run view <RUN_ID_2> --log > monitoring-day2-run2.log
```

### 2. Verify Test Counts

**For each log file:**

```bash
grep -E "Test Suites:|Tests:|Snapshots:|Time:" monitoring-day2-run1.log
grep -E "Test Suites:|Tests:|Snapshots:|Time:" monitoring-day2-run2.log
```

**Success criteria:**

- Both must show: "Tests: 822 passed" (or very close, 815-830 acceptable)
- No "failed" or "skipped" tests (pre-existing known skips acceptable)

### 3. Performance Check — npm ci Time

**Baseline:** ~30-45 seconds (from first post-merge run)  
**Acceptable variance:** ±15% (25-52 seconds)

**Extract npm ci time:**

```bash
grep -A 5 "npm ci" monitoring-day2-run1.log | grep -E "real|user|sys"
grep -A 5 "npm ci" monitoring-day2-run2.log | grep -E "real|user|sys"
```

**If either >52s:** ⚠️ Log it but don't escalate (might be CI resource variance)

### 4. Performance Check — Test Execution Time

**Baseline:** ~45-60 seconds  
**Acceptable variance:** ±10% (40-66 seconds)

**Extract test time:**

```bash
grep -E "Time:" monitoring-day2-run1.log
grep -E "Time:" monitoring-day2-run2.log
```

**If either >66s:** ⚠️ Log it, check if consistent in Run 2

### 5. Exit Codes

**All job exit codes must be 0:**

```bash
grep -E "exit code|Exit code|jobs completed" monitoring-day2-run1.log
grep -E "exit code|Exit code|jobs completed" monitoring-day2-run2.log
```

**If any exit code ≠ 0:** Escalate immediately — workflow failure

### 6. npm Audit

**Run locally on Node 22:**

```bash
npm audit
```

**Expected output:**

```
found 0 vulnerabilities
```

**If vulnerabilities found:**

- Critical/High: Escalate immediately
- Moderate/Low: Log but don't escalate (pre-existing)

### 7. npm WARN Scan

**Check for unexpected warnings:**

```bash
grep "npm WARN" monitoring-day2-run1.log monitoring-day2-run2.log
```

**Acceptable:** 0 warns, or only pre-existing warns (e.g., peer dependency mismatches)

## Day 2 Sign-Off

Fill in results:

```
✅ Run 1: test count = 822, time within baseline ±10%
✅ Run 2: test count = 822, time within baseline ±10%
✅ npm ci time: both within ±15% baseline
✅ All exit codes = 0
✅ npm audit: 0 vulnerabilities
✅ npm WARN: acceptable level
```

**Next:** Proceed to Day 3 sign-off
