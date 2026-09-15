# Quickstart: Changelog Quality Audit Validation

**Status**: Phase 1 Design
**Date**: 2026-09-13

## Overview

This quickstart document contains five end-to-end validation scenarios that prove the Changelog Quality Audit system works as designed. Each scenario includes prerequisites, commands, expected outcomes, and success criteria.

These scenarios can be tested locally or in CI/CD environments to validate that the implementation meets the specification requirements.

---

## Scenario 1: Validate a Single Changelog Entry (Local Development)

**Purpose**: Verify that developers can validate a single entry locally and get actionable feedback

**Prerequisites**:
- Changelog validator installed (`npm install`)
- Sample changelog entry file
- Node.js 18+

**Setup**:
```bash
# Create a test entry
cat > /tmp/test-entry.yml << 'EOF'
title: "Improved webhook delivery reliability"
description: |
  Webhooks now automatically retry on transient network errors
  with exponential backoff. This improves delivery success rates
  and reduces manual intervention requirements.
category: feature
date: 2026-09-13
pr_references: [2906]
EOF
```

**Run**:
```bash
cd /home/user/.github
npx changelog-validator validate --file /tmp/test-entry.yml --verbose
```

**Expected Output**:
```
✓ Validation Results for: test-entry.yml

Entry: "Improved webhook delivery reliability"
Date: 2026-09-13
Category: feature

PASSING (Score: 98/100)

Rule Results:
  ✓ R001: no_implementation_details - PASS
  ✓ R002: has_category - PASS (feature)
  ✓ R003: has_title - PASS (50 chars)
  ✓ R004: has_description - PASS (89 chars)
  ✓ R005: clear_language - PASS
  ✓ R009: has_pr_reference - PASS (#2906)
  ✓ R010: valid_pr_reference - PASS (verified on GitHub)
  [14 more rules PASS]

Summary: 18/20 rules passed, 2 warnings
  ⚠️  R013: no_emoji - INFO (no emoji used)
  ⚠️  R018: no_personal_pronouns - INFO (no pronouns used)

Status: ✓ ENTRY READY FOR COMMIT
```

**Success Criteria**:
- ✓ Validator runs without errors
- ✓ Entry validates as PASSING
- ✓ Specific rule feedback provided
- ✓ Score calculation correct (98/100)
- ✓ No false positives on well-written entry

---

## Scenario 2: Detect Implementation Details (Content Analysis)

**Purpose**: Verify that the system catches implementation details and provides remediation guidance

**Prerequisites**:
- Same as Scenario 1

**Setup**:
```bash
cat > /tmp/bad-entry.yml << 'EOF'
title: "Fixed webhook API response handling"
description: |
  Implemented retry logic using async/await callbacks with exponential
  backoff. Updated the webhook service API to return proper HTTP status codes.
  Fixed the Promise.then chaining in the middleware layer.
category: fix
date: 2026-09-13
pr_references: [2907]
EOF
```

**Run**:
```bash
npx changelog-validator validate --file /tmp/bad-entry.yml --verbose
```

**Expected Output**:
```
✗ Validation Results for: bad-entry.yml

Entry: "Fixed webhook API response handling"
Date: 2026-09-13
Category: fix

FAILING (Score: 42/100)

Rule Results:
  ✗ R001: no_implementation_details - FAIL
    Message: Contains 4 implementation detail(s):
      - "API" (code reference detected)
      - "async/await" (async pattern detected)
      - "Promise.then" (promise pattern detected)
      - "middleware" (internal architecture term)
    
    Remediation:
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    Rewrite to focus on USER BENEFIT, not implementation:
    
    ❌ Current: "Fixed webhook API response handling using async/await"
    ✅ Better: "Fixed webhook delivery reliability - improved error handling"
    
    Steps:
    1. Remove technical terms: API, async/await, Promise, middleware
    2. Use user-facing language: "webhooks", "delivery", "reliability"
    3. Describe the benefit: "now retries on network errors"
    4. Read aloud - does a non-developer understand it?
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✓ R002: has_category - PASS
  ✓ R003: has_title - PASS
  ✗ R004: has_description - FAIL
    Message: Description contains implementation details
  [other rules...]

Summary: 6/20 rules passed, 8 warnings, 6 failures
  ✗ ENTRY CANNOT BE COMMITTED - Fix the 6 failing rules above

Estimated remediation time: 5-10 minutes
```

**Success Criteria**:
- ✓ Validator detects all 4 API references
- ✓ Validator detects all async/await patterns
- ✓ Validator detects internal terminology (middleware)
- ✓ Specific, actionable remediation guidance provided
- ✓ Score accurately reflects 6 failures (42/100)
- ✓ Entry marked as FAILING, cannot commit

---

## Scenario 3: Release Manager Comprehensive Audit (Release Validation)

**Purpose**: Verify that release managers can audit all entries for a release and get a compliance report

**Prerequisites**:
- Changelog entries for v1.2.0 exist in CHANGELOG.yml
- Release manager can run commands
- GitHub API access configured

**Setup**:
```bash
# Verify entries exist for v1.2.0
grep -A 2 "version: 1.2.0" /home/user/.github/CHANGELOG.yml | head -20
```

**Run**:
```bash
npx changelog-validator audit --release v1.2.0 --markdown
```

**Expected Output** (console + file `.github/reports/release-audits/v1.2.0.json`):
```
═════════════════════════════════════════════════════════════
  Release Audit Report: v1.2.0
═════════════════════════════════════════════════════════════

Release: v1.2.0
Audit Date: 2026-09-13T14:30:00Z
Entries Audited: 45

COMPLIANCE SUMMARY
──────────────────────────────────
  Total: 45
  Passing: 42 ✓
  Warnings: 1 ⚠️
  Failing: 2 ✗
  Compliance: 93.33%
──────────────────────────────────

PASSING ENTRIES (42)
✓ Changelog Quality Audit System
✓ Real-time webhook validation
✓ Improved performance metrics
[... 39 more ✓]

FAILING ENTRIES (2)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Fixed webhook API response
   ✗ R001: Contains 'API' (code reference)
   Remediation: Use user-facing language like "delivery reliability"

2. Authentication improvements (PR #9999)
   ✗ R010: PR #9999 not found or not accessible
   Remediation: Verify PR reference is correct and accessible

WARNING ENTRIES (1)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Performance optimization
   ⚠️  R012: Lacks user benefit context
   Suggestion: Add "Users will experience faster page loads"

RELEASE READINESS
──────────────────────────────────
Status: CONDITIONAL_PASS
Message: Can proceed with 2 fixes OR 1 override

Action Plan:
1. Fix 2 failing entries (estimated 10 min)
   - Replace "API" in entry #1
   - Update PR reference in entry #2
2. OR approve with --force override (not recommended)

Markdown Report Generated:
→ .github/reports/release-audits/v1.2.0.md

JSON Report Generated:
→ .github/reports/release-audits/v1.2.0.json

Next Steps:
• Fix failing entries and re-run: 
  npx changelog-validator audit --release v1.2.0
• OR override compliance: 
  npx changelog-validator audit --release v1.2.0 --force --reason "urgent-hotfix"
```

**Files Generated**:
- `.github/reports/release-audits/v1.2.0.json` (machine-readable report)
- `.github/reports/release-audits/v1.2.0.md` (human-readable Markdown)

**Success Criteria**:
- ✓ Audit completes in <5 minutes
- ✓ Compliance report generated (93.33%)
- ✓ All failing entries listed with specific issues
- ✓ Remediation guidance provided for each failure
- ✓ Release readiness status calculated (CONDITIONAL_PASS)
- ✓ JSON and Markdown reports created
- ✓ Files committed to git for audit trail

---

## Scenario 4: GitHub Actions CI/CD Integration (PR Validation)

**Purpose**: Verify that PR validation works automatically and blocks non-compliant entries

**Prerequisites**:
- GitHub Actions workflow configured (`.github/workflows/changelog-validation.yml`)
- Pull request with changelog entry changes
- Permissions to post PR comments

**Setup**:
```bash
# Create test branch with non-compliant entry
git checkout -b test/changelog-entry
cat >> CHANGELOG.yml << 'EOF'
- version: "1.3.0"
  date: "2026-09-13"
  category: "feature"
  title: "Added webhook REST API"
  description: "Implemented new REST API endpoints using Express.js middleware"
  pr_references: [3000]
EOF

git add CHANGELOG.yml
git commit -m "docs: add changelog entry"
git push origin test/changelog-entry

# Open PR via GitHub web UI or:
gh pr create --title "Add changelog for v1.3.0" --body "Changelog entry for release" --draft
```

**Expected Workflow Execution**:

1. **GitHub Actions triggers** on PR creation
2. **Validator runs**: `npx changelog-validator check-pr --pr <number>`
3. **Status check updated**: Red X (validation failed)
4. **Comment posted on PR**:
```
🔴 Changelog Validation Failed

Entry: "Added webhook REST API"

Issues Found:
1. ✗ R001: no_implementation_details
   • Contains "REST API" (code reference)
   • Contains "Express.js" (framework name)
   • Contains "middleware" (internal term)

Remediation:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Current: "Implemented new REST API endpoints using Express.js middleware"
✅ Better: "Added new integration endpoints for webhook configuration"

Rewrite focusing on user benefit:
- Remove: REST API, Express.js, middleware, endpoints
- Add: What changed for users? "easier webhook setup"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Action**: Fix the entry above and push again. Re-run: `[Re-run] button`
```

5. **PR merge blocked**: Status check shows red, cannot merge
6. **Developer fixes entry**:
```bash
git add CHANGELOG.yml
git commit -m "fix: improve changelog entry clarity"
git push
```

7. **Workflow re-runs automatically**
8. **Validation passes**: Green checkmark ✓
9. **Comment updated** on PR: "✅ Changelog entry passes validation"
10. **PR mergeable**: All required checks pass

**Success Criteria**:
- ✓ Validator runs automatically on PR creation
- ✓ Status check goes red for non-compliant entry
- ✓ PR merge blocked (cannot merge without green)
- ✓ Comment posted with specific issues
- ✓ Comment updated when entry re-runs
- ✓ Green check when entry is fixed
- ✓ Release manager can force-override if needed:
  ```bash
  npx changelog-validator check-pr --pr <number> --force --reason "hotfix"
  ```

---

## Scenario 5: Analytics & Trending (Metrics Collection)

**Purpose**: Verify that daily metrics are collected and can be exported for analytics

**Prerequisites**:
- Daily metrics collection running for 7+ days (to have trend data)
- Access to `.github/reports/changelog-metrics/` directory

**Setup**:
```bash
# Verify metrics files exist
ls -lah .github/reports/changelog-metrics/ | tail -10
```

**Run**:
```bash
# Get today's snapshot
npx changelog-validator metrics get --date $(date +%Y-%m-%d)

# Get 7-day trend
npx changelog-validator metrics trend --days 7

# Export 30-day metrics to CSV
npx changelog-validator metrics export \
  --format csv \
  --days 30 \
  --output /tmp/changelog-metrics.csv
```

**Expected Output** (metrics get):
```
═════════════════════════════════════════════════════════════
  Daily Metrics Snapshot: 2026-09-13
═════════════════════════════════════════════════════════════

Snapshot Date: 2026-09-13T00:00:00Z

SUMMARY
──────────────────────────────────
Total Entries: 247
Compliant: 235 (95.1%)
Warnings: 8
Failing: 4

Average Quality Score: 92.3/100
Median Quality Score: 94.0/100

MOST COMMON VIOLATIONS
──────────────────────────────────
1. R010: valid_pr_reference (3 entries) - 1.2%
2. R009: has_pr_reference (8 entries) - 3.2%
3. R005: clear_language (2 entries) - 0.8%

DISTRIBUTION
──────────────────────────────────
By Category:
  • feature: 120 entries
  • fix: 100 entries
  • improvement: 20 entries
  • breaking-change: 7 entries

By Status:
  • passing: 235 entries
  • warning: 8 entries
  • failing: 4 entries
```

**Expected Output** (metrics trend):
```
═════════════════════════════════════════════════════════════
  7-Day Trend Analysis
═════════════════════════════════════════════════════════════

Period: 2026-09-07 to 2026-09-13

Daily Compliance:
  2026-09-07: 94.8%  [████████████████████]
  2026-09-08: 95.1%  [████████████████████▌]
  2026-09-09: 94.5%  [████████████████████]
  2026-09-10: 95.3%  [████████████████████▌]
  2026-09-11: 95.0%  [████████████████████]
  2026-09-12: 95.2%  [████████████████████▌]
  2026-09-13: 95.1%  [████████████████████]

TREND SUMMARY
──────────────────────────────────
Average: 95.0%
Range: 94.5% - 95.3%
Direction: ➜ STABLE (slight improvement)
Trend: +0.3% over 7 days

Velocity:
  • Entries added: 14 this week
  • Daily average: 2.0 entries/day
```

**CSV Export Output** (`/tmp/changelog-metrics.csv`):
```csv
Date,Compliance%,Total,Compliant,Warnings,Failures,Most Common Issue
2026-08-14,92.1,210,193,8,9,R010_valid_pr_reference
2026-08-15,92.4,213,196,7,10,R010_valid_pr_reference
2026-08-16,93.0,217,202,8,7,R009_has_pr_reference
2026-08-17,93.5,220,206,8,6,R009_has_pr_reference
2026-08-18,94.0,225,211,8,6,R009_has_pr_reference
2026-08-19,94.3,230,217,8,5,R009_has_pr_reference
2026-08-20,94.6,235,223,8,4,R010_valid_pr_reference
[... 11 more rows through 2026-09-13]
```

**Success Criteria**:
- ✓ Daily snapshots collected automatically
- ✓ Metrics queryable by date
- ✓ Trend data shows 7/30-day patterns
- ✓ Compliance percentage calculated correctly
- ✓ CSV export includes all required columns
- ✓ Trend direction determined (improving/stable/degrading)
- ✓ Data can be imported into BI tools (spreadsheet, data warehouse)

---

## Test Coverage Checklist

Use this checklist to verify all scenarios pass:

### Scenario 1: Single Entry Validation
- [ ] Validator CLI runs without errors
- [ ] Well-written entry validates as PASSING
- [ ] Score calculation correct
- [ ] No false positives

### Scenario 2: Implementation Detail Detection
- [ ] API/code references detected
- [ ] Internal terminology detected (middleware, async/await)
- [ ] Remediation guidance specific and actionable
- [ ] Score reflects failures (42/100)
- [ ] Entry marked as FAILING

### Scenario 3: Release Audit
- [ ] Audit completes in <5 minutes
- [ ] Compliance percentage calculated
- [ ] All failures listed with remediation
- [ ] JSON report created
- [ ] Markdown report created
- [ ] Release readiness status correct

### Scenario 4: GitHub Actions Integration
- [ ] Workflow triggers on PR creation
- [ ] Status check goes red for non-compliant entry
- [ ] PR merge blocked
- [ ] Comment posted with issues
- [ ] Comment updates when fixed
- [ ] Green checkmark when passing
- [ ] Force override works (optional)

### Scenario 5: Metrics & Analytics
- [ ] Daily snapshots collected
- [ ] Compliance percentage accurate
- [ ] Most common violations identified
- [ ] 7-day trend shows pattern
- [ ] CSV export includes all columns
- [ ] Trend direction determined

---

## Success Criteria Summary

If all 5 scenarios pass, the implementation meets the specification requirements for:

✅ **FR-1**: Validation against comprehensive ruleset with actionable guidance  
✅ **FR-2**: Auto-linking of PR/issue references  
✅ **FR-3**: Detection and rejection of implementation details  
✅ **FR-4**: Metrics collection for trend analysis  
✅ **FR-5**: Comprehensive audit command for release managers  
✅ **FR-6**: CI/CD integration with blocking status checks  

✅ **SC-1**: 95%+ compliance achieved (Scenario 5)  
✅ **SC-2**: 100% accurate auto-linking (Scenario 4)  
✅ **SC-3**: Zero implementation details in final notes (Scenario 2)  
✅ **SC-4**: Specific, actionable validation feedback (Scenarios 1-3)  
✅ **SC-5**: Release audit under 5 minutes (Scenario 3)  
✅ **SC-6**: CI/CD blocks non-compliant entries (Scenario 4)  
✅ **SC-7**: Daily metrics collection (Scenario 5)  
✅ **SC-8**: Rules documented for non-technical users (all scenarios)  
✅ **SC-9**: Rule versioning supported (data-model.md)  

---

## Next Steps

1. ✅ Phase 1 Design complete (research, data model, contracts, quickstart)
2. ⏭️ Run `/speckit-tasks` to generate 83 implementation tasks
3. ⏭️ Begin Phase 3 implementation (Entry Quality Assessment)
4. ⏭️ Execute scenarios weekly to track progress

---

**Ready to generate tasks?** Run `/speckit-tasks` to break down the 7-week implementation plan into granular tasks.

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
