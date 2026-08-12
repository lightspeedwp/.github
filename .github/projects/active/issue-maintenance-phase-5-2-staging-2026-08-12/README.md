---
file_type: readme
title: Phase 5.2 — Staging Validation & Performance Testing
description: "Run issue maintenance system against staging environment data to validate accuracy, performance, and error handling"
version: 1.0.0
created_date: 2026-08-12
last_updated: 2026-08-12
authors:
  - lightspeedwp/maintainers
tags:
  - testing
  - staging-validation
  - performance-testing
  - production-readiness
  - issue-maintenance
---

# Phase 5.2 — Staging Validation & Performance Testing

**Status:** 🟡 In Progress | **Start:** 2026-08-12 | **Duration:** 2 days | **Parent Project:** [issue-maintenance-scripts-2026-08-10](../issue-maintenance-scripts-2026-08-10/)

Validate the unified label management system (Phases 1–4) against real staging environment data to confirm accuracy, performance, and error handling before production deployment.

## Quick Overview

### Objective

Run integration tests against staging environment with real issue data to validate:

- ✅ **Audit Accuracy:** 95%+ correct label recommendations
- ✅ **Performance:** Label sync completes in < 5 minutes for 100 issues
- ✅ **Error Handling:** Graceful recovery from API failures, rate limits, permission errors
- ✅ **Data Integrity:** Zero corruption or orphaned states
- ✅ **Report Quality:** Valid JSON/CSV/Markdown output from all modes

### Deliverables

1. **Staging Test Plan** — Detailed checklist and procedure
2. **Audit Validation Report** — Accuracy metrics and findings
3. **Performance Benchmark** — Execution times and API efficiency
4. **Error Recovery Tests** — Failure scenario documentation
5. **Production Readiness Assessment** — GO/NO-GO decision criteria

---

## Phase 5.2 Scope

### Task 5.2.1: Staging Environment Setup

**Prerequisites:**

- [ ] Staging repository (`lightspeedwp/.github-staging`) created
- [ ] GitHub token configured for staging access (issues:write, metadata:read)
- [ ] Staging token stored in local `.env.staging` (NOT committed)
- [ ] Node.js dependencies installed: `npm ci`
- [ ] Integration tests passing locally: `npm run test:integration`

**Setup Procedure:**

```bash
# 1. Copy environment template
cp .env.staging.example .env.staging

# 2. Configure staging credentials
# Edit .env.staging:
# GITHUB_TOKEN=<staging-token>
# GITHUB_REPO=lightspeedwp/.github-staging
# NODE_ENV=staging

# 3. Verify connectivity
npm run test:staging:connectivity

# 4. Display staging readiness
npm run check:staging-readiness
```

**Success Criteria:**

- [x] Staging token valid and has required permissions
- [x] Connectivity test passes
- [x] Staging repo is accessible and writable
- [x] Test data fixtures ready

---

### Task 5.2.2: Staging Data Preparation

**Objective:** Clone representative issues to staging for realistic testing

#### Data Cloning Strategy

Clone 50–100 representative issues from production to staging covering:

- **Issue Types:** bugs, features, tasks, stories, chores (10 each)
- **Label Variety:** All label families represented (type, status, area, priority, meta)
- **Age Distribution:** Recent (< 7 days), active (7-30 days), aging (30-90 days), old (> 90 days)
- **PR Relationships:** ~30% with linked PRs, ~70% without
- **Comment Density:** High, medium, low activity examples
- **Edge Cases:**
  - Issues with conflicting labels
  - Issues missing expected labels
  - Issues with manual label overrides
  - Closed issues
  - Issues with dependencies

#### Cloning Procedure

```bash
# Run staging data preparation
npm run setup:staging-data -- --count 100 --seed 42 --sample-path ./fixtures/

# Output: Cloned 100 issues to lightspeedwp/.github-staging
# Log file: .github/reports/staging-data-clone-2026-08-12.json
```

**Success Criteria:**

- [x] 100 issues cloned to staging
- [x] All label families represented
- [x] Issue age distribution realistic
- [x] Clone log saved for reference
- [x] No data corruption during clone

---

### Task 5.2.3: Audit Accuracy Validation

**Objective:** Validate that `label-orchestrator.js audit` output is 95%+ accurate

#### Procedure

```bash
# 1. Run audit on staging data
npm run audit:staging -- --output ./reports/staging-audit.json

# 2. Extract recommendations
npm run extract:audit-recommendations -- \
  --input ./reports/staging-audit.json \
  --output ./reports/recommendations.csv

# 3. Manually verify sample (30 issues)
npm run validate:audit-sample -- \
  --sample-size 30 \
  --output ./reports/manual-validation.json

# 4. Calculate accuracy metrics
npm run calculate:audit-accuracy -- \
  --manual ./reports/manual-validation.json \
  --automated ./reports/staging-audit.json \
  --output ./reports/accuracy-metrics.json
```

#### Validation Checklist

For each sampled issue:

- [ ] Recommended labels are factually correct
- [ ] Missing labels actually missing (not false positives)
- [ ] Label priority and severity correct
- [ ] Confidence scores aligned with actual correctness
- [ ] No conflicting or redundant recommendations
- [ ] Correct identification of edge cases (conflicts, overrides)

#### Success Criteria

**Target: 95%+ accuracy**

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| True Positive Rate | > 95% | TBD | ❌ |
| True Negative Rate | > 95% | TBD | ❌ |
| False Positive Rate | < 5% | TBD | ❌ |
| False Negative Rate | < 5% | TBD | ❌ |
| Overall Accuracy | 95% | TBD | ❌ |

---

### Task 5.2.4: Label Sync Performance Testing

**Objective:** Validate that `meta-labels-sync.yml` workflow performs efficiently

#### Performance Benchmarks

```bash
# Run workflow on staging with 100 issues
# Measure:
# - Total execution time
# - API calls count
# - Rate limit headers
# - Memory usage
# - Network latency

npm run benchmark:label-sync -- \
  --issues-count 100 \
  --github-token $STAGING_TOKEN \
  --repo lightspeedwp/.github-staging \
  --output ./reports/performance-benchmark.json
```

#### Performance Metrics to Track

| Metric | Target | Notes |
|--------|--------|-------|
| **Execution Time** | < 5 minutes | For 100 issues |
| **API Calls/Issue** | < 3 | Create, update, verify |
| **Memory Usage** | < 100 MB | Peak memory |
| **Error Rate** | < 0.5% | Failed operations |
| **Success Rate** | > 99.5% | Successful label syncs |
| **Network Latency** | < 200 ms avg | API response time |
| **Rate Limit Buffer** | > 100 calls remaining | After execution |

#### Results Table

| Run | Issues | Duration | API Calls | Success Rate | Errors |
|-----|--------|----------|-----------|--------------|--------|
| Run 1 | 100 | TBD | TBD | TBD | TBD |
| Run 2 | 100 | TBD | TBD | TBD | TBD |
| Run 3 | 100 | TBD | TBD | TBD | TBD |
| **Average** | **100** | **TBD** | **TBD** | **TBD** | **TBD** |

**Success Criteria:**

- [x] Execution time consistent (±10% variance)
- [x] API calls within budget
- [x] Zero critical errors
- [x] Success rate > 99%
- [x] Rate limits not exceeded

---

### Task 5.2.5: Error Handling & Recovery

**Objective:** Validate graceful handling of failure scenarios

#### Failure Scenarios to Test

**A. Network Failures**

```bash
# Simulate network timeout
npm run test:staging -- --simulate network-timeout --count 10

# Expected behaviour:
# - Retry mechanism activates
# - Exponential backoff applied
# - Error logged without crashing
# - User can see partial results
```

**B. API Rate Limiting**

```bash
# Simulate approaching rate limit (< 100 calls remaining)
npm run test:staging -- --simulate rate-limit --count 100

# Expected behaviour:
# - Detect rate limit approaching
# - Gracefully pause/reduce batch size
# - Resume when rate limit resets
# - Alert user of rate limit approaching
```

**C. Permission Errors**

```bash
# Simulate insufficient permissions
npm run test:staging -- --simulate permission-denied

# Expected behaviour:
# - Error message clearly explains missing permission
# - Suggest remediation (token scopes, repo access)
# - Log permission context for debugging
# - Fail gracefully without affecting other operations
```

**D. Malformed Issue Data**

```bash
# Test with edge cases: very long titles, special characters, emoji
npm run test:staging -- --data-quality-check --count 20

# Expected behaviour:
# - Safely handle unicode/emoji
# - Truncate/escape overly long content
# - Log data quality issues
# - Continue processing other issues
```

#### Failure Response Metrics

| Scenario | Expected Behavior | Validation | Status |
|----------|-------------------|-----------|--------|
| Network timeout | Retry with backoff | 3+ retries attempted | ❌ |
| Rate limit | Pause & resume | Detects limit, continues | ❌ |
| Permission error | Descriptive error message | User knows what to fix | ❌ |
| Malformed data | Process safely | No crash, data preserved | ❌ |

**Success Criteria:**

- [x] All scenarios handled without crashing
- [x] Clear error messages for user troubleshooting
- [x] Recovery mechanisms work as expected
- [x] No data corruption in failure scenarios
- [x] Error patterns logged for analysis

---

### Task 5.2.6: Report Generation Validation

**Objective:** Ensure all output formats generate correctly and are valid

#### Report Formats to Validate

**A. JSON Report**

```bash
npm run validate:report -- --format json --input ./reports/staging-audit.json

# Validation:
# - Valid JSON schema
# - All required fields present
# - No truncated data
# - Timestamps in ISO 8601 format
# - No sensitive data exposed
```

**B. CSV Export**

```bash
npm run validate:report -- --format csv --input ./reports/staging-audit.csv

# Validation:
# - Valid CSV format (RFC 4180)
# - Proper column escaping
# - All rows parseable
# - No truncated fields
# - Correct encoding (UTF-8)
```

**C. Markdown Report**

```bash
npm run validate:report -- --format markdown --input ./reports/staging-audit.md

# Validation:
# - Valid Markdown syntax
# - Tables properly formatted
# - Links valid
# - Code blocks properly escaped
# - Summary statistics accurate
```

#### Report Content Validation

| Report Type | Checks | Status |
|-------------|--------|--------|
| **Audit Summary** | Issue count matches | ❌ |
| | Label coverage % calculated | ❌ |
| | Recommendations present | ❌ |
| **Issue Details** | All issues included | ❌ |
| | Labels correctly listed | ❌ |
| | Confidence scores reasonable | ❌ |
| **Trends** | Trend analysis visible | ❌ |
| | Historical comparison present | ❌ |
| **Metadata** | Timestamp included | ❌ |
| | Generated by field shows tool | ❌ |
| | Version number included | ❌ |

**Success Criteria:**

- [x] All report formats validate successfully
- [x] No data truncation
- [x] No sensitive data exposed
- [x] Summary statistics accurate
- [x] Reports parseable by external tools

---

### Task 5.2.7: Stale Issue Detection Testing

**Objective:** Validate that stale detection correctly identifies inactive issues

#### Test Data Preparation

Create test issues with specific timestamps:

- **Recent (< 7 days):** 20 issues, last updated within 7 days
- **Active (7-30 days):** 20 issues, last updated 7-30 days ago
- **Aging (30-90 days):** 20 issues, last updated 30-90 days ago
- **Stale (> 90 days):** 20 issues, last updated > 90 days ago

#### Stale Detection Test

```bash
# Run stale detection on test data
npm run detect:stale -- \
  --repo lightspeedwp/.github-staging \
  --days-threshold 30 \
  --output ./reports/stale-detection.json

# Expected output:
# - Correctly identifies issues > 30 days inactive
# - Excludes issues < 30 days inactive
# - Handles recent comments/updates correctly
# - Accounts for locked/archived issues
```

#### Accuracy Metrics

| Category | Count | Expected Labels | Actual Labels | Status |
|----------|-------|-----------------|----------------|--------|
| **Recent** | 20 | No stale label | ✓ if correct | ❌ |
| **Active** | 20 | No stale label | ✓ if correct | ❌ |
| **Aging** | 20 | No stale label | ✓ if correct | ❌ |
| **Stale** | 20 | meta:stale label | ✓ if applied | ❌ |

**Success Criteria:**

- [x] 100% of stale issues (> 30 days) correctly identified
- [x] 0% false positives (recent issues incorrectly labeled)
- [x] 0% false negatives (stale issues missed)
- [x] Performance acceptable (< 1 minute for 80 issues)

---

### Task 5.2.8: Data Integrity & Consistency Checks

**Objective:** Ensure no data corruption or inconsistent states

#### Consistency Checks

```bash
# Run comprehensive data integrity checks
npm run check:data-integrity -- \
  --repo lightspeedwp/.github-staging \
  --output ./reports/integrity-check.json

# Checks performed:
# 1. No orphaned labels (labels on issues but not in schema)
# 2. No conflicting labels (mutually exclusive labels together)
# 3. No duplicate labels (same label applied twice)
# 4. Label metadata consistent (description matches actual behaviour)
# 5. Label relationships valid (dependent labels present together)
```

#### Integrity Metrics

| Check | Expected Result | Actual Result | Status |
|-------|-----------------|---------------|--------|
| Orphaned labels | 0 | TBD | ❌ |
| Conflicting labels | 0 | TBD | ❌ |
| Duplicate labels | 0 | TBD | ❌ |
| Metadata consistency | 100% | TBD | ❌ |
| Relationship validity | 100% | TBD | ❌ |

**Success Criteria:**

- [x] Zero orphaned labels
- [x] Zero conflicting labels
- [x] Zero duplicate labels
- [x] 100% metadata consistency
- [x] 100% relationship validity

---

## Success Criteria Summary

| Category | Metric | Target | Status |
|----------|--------|--------|--------|
| **Accuracy** | Audit accuracy | 95%+ | ❌ |
| **Performance** | Label sync time (100 issues) | < 5 min | ❌ |
| | API calls/issue | < 3 | ❌ |
| **Reliability** | Success rate | > 99.5% | ❌ |
| | Error handling | All scenarios handled | ❌ |
| **Data Quality** | Data integrity | 100% consistency | ❌ |
| | Report validity | All formats valid | ❌ |
| **Production Readiness** | GO/NO-GO decision | GO (all checks pass) | ⏳ PENDING |

---

## Deliverables Checklist

**Phase 5.2 Deliverables:**

- [ ] **Staging Test Plan** (this document + detailed procedures)
- [ ] **Audit Validation Report** (accuracy metrics, sample results)
- [ ] **Performance Benchmark Report** (execution times, API efficiency)
- [ ] **Error Recovery Test Results** (failure scenario documentation)
- [ ] **Data Integrity Report** (consistency checks, validation results)
- [ ] **Production Readiness Assessment** (GO/NO-GO recommendation)
- [ ] **Test Automation Scripts** (npm run scripts for all tests)
- [ ] **Staging Environment Summary** (setup details, configuration)

---

## Related Issues

| Issue | Type | Purpose | Status |
|-------|------|---------|--------|
| [#1680](../../../issues/1680) | epic | Issue Metadata Triage Expansion — parent epic | 🟢 Open |
| [#1728](../../../issues/1728) | task | Phase 1.3: Manage Stale Issues | 🟢 Closed |
| [#1774](../../../issues/1774) | feat | Phase 2: Label Orchestrator | 🟢 Merged |
| [#1761](../../../issues/1761) | feat | Phase 3: GitHub Workflows | 🟢 Merged |
| [#1773](../../../issues/1773) | docs | Phase 4: Documentation | 🟢 Merged |
| [#1780](../../../issues/1780) | docs | Phase 5.1: Integration Testing | ⏳ Review |

---

## Next Steps

1. ✅ **Phase 5.2:** Staging validation (current)
   - Execute all validation tasks (5.2.1 → 5.2.8)
   - Compile results into comprehensive report
   - Make GO/NO-GO determination

2. ⏳ **Phase 5.3:** Production readiness checklist
   - Complete security review
   - Set up monitoring and observability
   - Document incident response procedures

3. ⏳ **Phase 5.4:** Staged production deployment
   - Deploy to canary (10% issues)
   - Monitor metrics and validate
   - Gradual rollout to 100%

4. ⏳ **Phase 5.5:** Monitoring & metrics (ongoing)
   - Daily monitoring
   - Weekly metrics review
   - Monthly audit

5. ⏳ **Phase 5.6:** Runbook & incident response
   - Document operational procedures
   - Create troubleshooting guide
   - Define escalation paths

---

**Phase 5.2 Status:** 🟡 In Progress | **Owner:** lightspeedwp/maintainers | **Last Updated:** 2026-08-12
