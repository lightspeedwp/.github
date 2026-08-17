---
name: phase-7-metrics-dashboard-plan
description: Phase 7 metrics dashboard and monitoring plan for branch naming enforcement adoption tracking
---

# Phase 7 — Metrics Dashboard & Monitoring Plan

## Overview

Phase 7 focuses on collecting, analyzing, and acting on metrics from the Phase 6 enforcement period (Days 7-30).

---

## Metrics to Track

### 1. Adoption Metrics

| Metric | Target | Collection |
|---|---|---|
| % Team with hook installed | 90%+ | `npm list` + survey |
| % Valid branch creation attempts | 98%+ | GitHub Actions logs |
| Days until 80% adoption | ≤7 days | Daily check |
| Hook installation success rate | 95%+ | Setup verification checklist |

### 2. Violation Metrics

| Metric | Target | Collection |
|---|---|---|
| Invalid branch attempts (Day 7-30) | <50 total | Pre-commit hook logs |
| Invalid branch attempts per day | <2/day | Daily aggregation |
| Most common violation type | Track | Pattern analysis |
| Violations by team member | Identify trends | Grouped logs |

**Common Violation Types:**

- Missing type prefix (e.g., `my-feature`)
- Uppercase characters (e.g., `Feature/MyBranch`)
- Underscores instead of hyphens (e.g., `feat/my_feature`)
- Spaces in branch name (e.g., `feat/my feature`)

### 3. Support Metrics

| Metric | Target | Collection |
|---|---|---|
| Support requests received | <10 | Issue tracking |
| Average resolution time | <1 hour | Timestamp tracking |
| Most common help request | Track | Category analysis |
| Team satisfaction with support | 85%+ | Survey |

### 4. Process Metrics

| Metric | Target | Collection |
|---|---|---|
| Time to 80% team setup | ≤7 days | Checklist submission dates |
| PR merge blocks due to naming | 0 | GitHub Actions logs |
| False positives reported | 0 | User bug reports |
| Policy exceptions granted | ≤2 | Issue tracking |

---

## Dashboard Design

### Real-Time Dashboard (Updates Daily)

**Location:** `.github/reports/branch-naming-enforcement/`

**Sections:**

1. **Quick Stats (Top of dashboard)**

   ```
   ✅ Adoption Rate: 87% (target: 90%)
   ⚠️  Violations This Week: 3 (target: <7)
   🆘 Support Requests: 1 (target: <10)
   📈 Trend: ↑ Improving
   ```

2. **Adoption Timeline Graph**
   - X-axis: Days since Phase 6 start
   - Y-axis: % team with hook installed
   - Show: target line (90%) + actual line

3. **Violation Heatmap**
   - By violation type (x-axis)
   - By team member (y-axis)
   - Color intensity = frequency

4. **Support Queue**
   - Open requests
   - Resolution times
   - Common issues

---

## Data Collection Methods

### Automated (Daily)

```bash
# 1. Extract GitHub Actions logs for violations
gh api repos/lightspeedwp/.github/actions/runs \
  --jq '.[] | select(.created_at > "2026-08-19")' \
  > branch-violations-log.json

# 2. Parse for invalid branch attempts
jq '.[] | select(.name | contains("branch-name-validation"))' \
  branch-violations-log.json > violations-summary.json

# 3. Count by type
jq 'group_by(.violation_type) | map({type: .[0].violation_type, count: length})' \
  violations-summary.json > violations-by-type.json
```

### Manual (Weekly)

1. **Setup verification checklist review** — count confirmed setups
2. **Support request triage** — categorize and count help requests
3. **Team feedback survey** — 2-3 min Slack poll on satisfaction

### Monthly (Day 30 Review)

1. **Full adoption audit** — `npm list` across team machines
2. **Policy feedback** — structured survey on branch naming rules
3. **Exceptions audit** — review any granted exceptions
4. **Next-phase planning** — decide on refinements for ongoing enforcement

---

## Phase 7 Deliverables

By Day 30, produce:

1. **Metrics Report** — PDF/markdown with key findings
2. **Adoption Graph** — visualization of team setup rate
3. **Violation Analysis** — breakdown by type + team
4. **Support Summary** — top requests + resolutions
5. **Recommendations** — for ongoing enforcement (Phase 8+)

---

## Thresholds & Escalation

### If Any Metric Misses Target

| Scenario | Action |
|---|---|
| Adoption <70% | Extend grace period, send reminder |
| Violations >10/day | Review pattern, adjust rules if needed |
| Support >15 requests | Offer team training session |
| False positives >5 | Create exception list, update validation |

---

## Sample Metrics Report (Day 30)

```
# Branch Naming Enforcement — Phase 7 Metrics Report

**Report Date:** 2026-09-12  
**Period:** 2026-08-19 → 2026-09-12 (24 days enforcement)

## Summary

✅ **Phase 6 Objectives Achieved:**
- 92% team adoption (target: 90%)
- 98.5% valid branch creation (target: 98%)
- 8 support requests (target: <10)
- 0 enforcement-related PR merge blocks

## Key Findings

1. **Adoption fastest on Day 7-14** — most team members set up within first week
2. **Most common violation** — missing type prefix (40% of violations)
3. **Zero false positives** — validation rules working as designed
4. **Support trends:**
   - 50% of requests from new team members
   - 75% resolved in <30 minutes

## Recommendations

- ✅ **Continue enforcement** — working well, no rule changes needed
- 📢 **Onboarding improvement** — add branch naming to new hire checklist
- 📖 **Documentation** — simplify troubleshooting guide based on requests
- 🎯 **Next target** — achieve 95%+ adoption by end of Q3

## Next Phase

**Phase 8 (Continuous Monitoring):** Monthly metrics + annual policy review
```

---

## Timeline for Phase 7

| Date | Action | Owner |
|---|---|---|
| 2026-08-19 | Enforcement enabled, metrics tracking begins | GitHub Actions |
| 2026-08-26 | Weekly violations report | Metrics owner |
| 2026-09-02 | Mid-phase feedback check-in | Team lead |
| 2026-09-09 | Final metrics collection | Metrics owner |
| 2026-09-12 | Phase 7 report + recommendations | Team lead |
| 2026-09-15 | Team discussion + policy decision | All |

---

## Success = Ongoing Enforcement

If Phase 7 metrics are positive (80%+ adoption, <5% violations, >85% satisfaction):

→ **Move to Phase 8: Continuous Monitoring** (monitor, don't actively rollout)  
→ **Annual policy review** instead of active enforcement  
→ **Enforcement becomes "business as usual"**
