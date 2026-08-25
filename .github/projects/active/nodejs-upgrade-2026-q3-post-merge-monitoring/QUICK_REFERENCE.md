# Post-Merge Monitoring — Quick Reference

## Day 1: Workflow Monitoring & Edge Cases

**Duration:** 20 min | **Owner:** DevOps

- [ ] **1A** — checks.yml: verify 3 recent runs, all passing ✅
- [ ] **1B** — checks.yml: confirm test count ≥822 in all runs
- [ ] **1C** — checks.yml: verify node -v shows v22.x (NOT v24)
- [ ] **1D** — release.yml: verify 5 recent runs completed successfully
- [ ] **1E** — release.yml: check node -v in logs (if v24+, create issue)
- [ ] **1F** — meta.yml: verify 2 recent runs passed
- [ ] **1G** — changelog-management.yml: verify 2 recent runs passed
- [ ] **1H** — All runs: grep logs for "npm ERR!" (must find 0)
- [ ] **1I** — All runs: grep logs for "DeprecationWarning" (must find 0)

**Day 1 Complete:** All 9 checks passed ✅

---

## Day 2: Spot-Check & Performance Verification

**Duration:** 20 min | **Owner:** DevOps

- [ ] **2A** — checks.yml: download logs from 2 recent successful runs
- [ ] **2B** — Both runs: compare test execution time to baseline ±10%
- [ ] **2C** — Both runs: compare npm ci time to baseline ±15%
- [ ] **2D** — Both runs: verify all exit codes = 0 (no failures)
- [ ] **2E** — Both runs: test count in both = 822/822
- [ ] **2F** — npm audit: run locally or check workflow logs (must be 0 vulnerabilities)
- [ ] **2G** — Both runs: grep "npm WARN" (acceptable: 0 or pre-existing only)

**Day 2 Complete:** All 7 checks passed ✅

---

## Day 3: Regression Confirmation & Sign-Off

**Duration:** 15 min | **Owner:** DevOps

- [ ] **3A** — Issue search: `gh issue list --label=node-version --state=open` (must be 0)
- [ ] **3B** — Local test: `npm test` on Node v22.x → exit code 0, ≥822 tests
- [ ] **3C** — release.yml: verify 3 latest runs all completed successfully
- [ ] **3D** — metrics-pipeline.yml: verify no Node version errors in logs
- [ ] **3E** — All edge cases: 0 Node.js errors detected

**Day 3 Complete:** All 5 checks passed ✅

---

## Final Sign-Off

**If all checks pass:**

```bash
gh pr comment 1420 -b "✅ 3-day post-merge monitoring complete.

All critical workflows passing. Edge cases managed. Test baseline maintained. Ready for production."
```

**If any check fails:**

- Create issue: `gh issue create --title "Post-merge monitoring: regression detected" --label=type:investigation`
- Link to workflow run(s) and logs
- Document failure and recommendation (fix vs rollback)

---

**Monitoring Period:** 2026-07-30 to 2026-08-02
