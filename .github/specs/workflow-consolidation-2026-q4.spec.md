---
spec_version: "1.0"
title: "GitHub Workflows Consolidation 2026-Q4"
description: "Consolidate 76+ active workflows into 14 core unified workflows"
author: "ashley@lightspeedwp.agency"
created: "2026-09-11"
status: "planning"
priority: "critical"
effort_hours: "65-80"
timeline_weeks: "4-5"
dependencies:
  - "issue-type-workflow-automation (Phases 1-4 complete)"
  - "workflows-consolidation-2026-q3 (Phase 3 complete)"
  - "release-agentic-workflows-2026-08-11 (Phase 5A complete)"
---

# Specification: GitHub Workflows Consolidation 2026-Q4

## Problem Statement

- **Current State:** 76+ active GitHub workflows running in parallel
- **Issues:** Workflow collisions, duplicate logic, merge blockages, maintenance burden
- **Target:** 14 unified core workflows (82% reduction)
- **Outcome:** Faster merges, clearer automation, reduced GitHub Actions minutes usage

---

## Success Criteria

### Quantitative
- [ ] Reduce workflow count from 76 to 14 (82% reduction)
- [ ] All 76 original workflow features preserved in 14 new workflows
- [ ] GitHub Actions minutes reduced by 15-20%
- [ ] Workflow execution time ≤ 110% of original parallel execution
- [ ] Scheduled job collisions reduced from 4+ to 0
- [ ] ~500 lines of duplicate code eliminated
- [ ] Branch name validation supports exception patterns
- [ ] PR template labels auto-extracted from frontmatter

### Qualitative
- [ ] Single unified check gate (no 15+ blockers per PR)
- [ ] Clear documentation of consolidated workflows
- [ ] Team confidence in CI/CD system
- [ ] No breaking changes to existing automation

---

## Core Workflows (14 Total)

### Critical Path (Build First)

1. **labeling-unified.yml**
   - Auto-label from PR template frontmatter
   - Issue type allocation
   - Label validation from `.github/labels.yml`
   - Consolidates: 9 existing labeling workflows
   - Triggers: `pull_request`, `issues`

2. **validation-unified.yml**
   - Branch name validation (with `.github/branch-exceptions.yml`)
   - PR template validation
   - Changelog validation
   - Frontmatter validation
   - Consolidates: 12 existing validation workflows
   - Triggers: `pull_request`, workflow_dispatch

3. **quality-gates.yml**
   - CodeQL integration
   - GitLeaks secret scanning
   - CodeRabbit configuration
   - Accessibility scanning
   - Consolidates: Security scanning workflows
   - Triggers: `pull_request`, scheduled

4. **linting-unified.yml**
   - Markdown linting
   - JavaScript/TypeScript linting
   - JSON/YAML linting
   - Mermaid diagram validation
   - Consolidates: 8+ linting workflows
   - Triggers: `pull_request`

5. **testing-unified.yml**
   - Unit tests
   - Integration tests
   - Coverage validation
   - Consolidates: 8 test workflows
   - Triggers: `pull_request`, `push:develop`

### Secondary Workflows (Build After Critical Path)

6. **events-issue-pr-metadata.yml** — Issue/PR creation, metadata
7. **changelog-management.yml** — Changelog validation & automation
8. **pr-workflow.yml** — Issue linking, status tracking, Mergify
9. **documentation.yml** — README generation, link validation
10. **branch-management.yml** — Branch cleanup, stale branch detection
11. **issue-management.yml** — Issue triage, automation, lifecycle
12. **release-orchestration.yml** — Release agent with safety gates (agentic)
13. **reporting-metrics.yml** — Metrics, reports, activity dashboards
14. **project-management.yml** — Project field sync, milestone allocation

---

## Configuration Files (New/Updated)

### `.github/branch-exceptions.yml` (NEW)
```yaml
exceptions:
  - pattern: "hotfix/.*"
  - pattern: "release/v.*"
  - user: "dependabot"
  - user: "renovate"
```

### `.github/scripts/extract-pr-labels.js` (NEW)
- Extract labels from PR template frontmatter
- Validate against `.github/labels.yml`
- Apply missing labels
- Called by: `labeling-unified.yml`

### Workflow Schedule Staggering (UPDATED)
| Workflow | Time | Frequency |
|----------|------|-----------|
| issue-management | 2:00 UTC | Daily |
| project-management | 2:30 UTC | Daily |
| reporting-metrics | 3:00 UTC | Daily |
| branch-management | 3:30 UTC | Daily |
| quality-gates (scan) | 4:00 UTC | Weekly (Mon) |

---

## Archived Workflows (62 Total)

Directory: `.github/workflows/archived/2026-09-11/`

### By Category
- **Labeling** (9): All variants consolidated to labeling-unified.yml
- **Validation** (12): All variants consolidated to validation-unified.yml
- **Documentation** (8): Consolidated to documentation.yml
- **Issue Management** (10): Consolidated to issue-management.yml + events-issue-pr-metadata.yml
- **PR Management** (7): Consolidated to pr-workflow.yml + events-issue-pr-metadata.yml
- **Testing** (8): Consolidated to testing-unified.yml
- **CI/CD** (8): Consolidated or removed
- **Project Management** (8): Consolidated to project-management.yml
- **Utilities** (8): Consolidated or removed

---

## Implementation Phases

### Phase 1: Backup & Archive (Week 1-2, ~8-10 hours)
- [ ] Backup all 62 non-essential workflows
- [ ] Create `.github/workflows/archived/2026-09-11/`
- [ ] Document consolidation mapping
- [ ] Create `ARCHIVED_WORKFLOWS_MANIFEST.md`
- [ ] PR: Archive non-essential workflows

**Deliverable:** PR with archived workflows + mapping

### Phase 2: Build Consolidated Workflows (Week 3-5, ~45-55 hours)
- [ ] labeling-unified.yml (6-8h) — CRITICAL PATH
- [ ] validation-unified.yml (4-6h) — CRITICAL PATH
- [ ] quality-gates.yml (3-4h) — CRITICAL PATH
- [ ] linting-unified.yml (4-5h) — CRITICAL PATH
- [ ] testing-unified.yml (3-4h)
- [ ] events-issue-pr-metadata.yml (4-5h)
- [ ] changelog-management.yml (2-3h)
- [ ] pr-workflow.yml (3-4h)
- [ ] branch-management.yml (2-3h)
- [ ] issue-management.yml (3-4h)
- [ ] documentation.yml (3-4h)
- [ ] release-orchestration.yml (2-3h)
- [ ] reporting-metrics.yml (2-3h)
- [ ] project-management.yml (2-3h)

**Deliverable:** PR with 14 consolidated workflows, CI passing

### Phase 3: Testing & Validation (Week 6-7, ~10-15 hours)
- [ ] Parallel execution testing (old vs. new workflows)
- [ ] 10 test PRs (all types)
- [ ] Performance benchmarking
- [ ] Team validation & approval
- [ ] Edge case documentation

**Deliverable:** Validation report + performance metrics

---

## Key Implementation Details

### 1. PR Template Label Extraction

**File:** `.github/scripts/extract-pr-labels.js`

```javascript
// Pseudo-code
function extractLabels(prTemplate) {
  const lines = prTemplate.split('\n');
  const labelsLine = lines.find(l => l.includes('labels:'));
  const labels = YAML.parse(labelsLine);
  return labels; // e.g., ["type:task", "status:needs-review"]
}
```

**Called by:** `labeling-unified.yml` on PR open/edited

### 2. Branch Name Validation with Exceptions

**File:** `validation-unified.yml` + `.github/branch-exceptions.yml`

```yaml
# validation-unified.yml
- name: Check branch name exceptions
  run: |
    BRANCH="${{ github.head_ref }}"
    EXCEPTIONS=$(cat .github/branch-exceptions.yml | jq '.exceptions[].pattern')
    for PATTERN in $EXCEPTIONS; do
      if [[ $BRANCH =~ $PATTERN ]]; then
        echo "Branch '$BRANCH' matches exception: $PATTERN"
        exit 0
      fi
    done
    # Continue with normal validation
```

### 3. Schedule Staggering

**Current Problem:** 4+ workflows fire at 3:00 UTC

**Solution:** Update each workflow's `schedule:` cron

```yaml
# issue-management.yml
on:
  schedule:
    - cron: '0 2 * * *'  # 2:00 UTC daily

# project-management.yml
on:
  schedule:
    - cron: '30 2 * * *'  # 2:30 UTC daily
```

### 4. Mergify Configuration

**Approach:** Use GitHub native auto-merge + workflow gates

```yaml
# pr-workflow.yml
- name: Enable auto-merge
  if: |
    github.actor != 'dependabot[bot]' &&
    contains(github.event.pull_request.labels.*.name, 'type:patch')
  run: |
    gh pr merge --auto --squash
  env:
    GH_TOKEN: ${{ github.token }}
```

---

## Related Projects & Coordination

| Project | Integration | Timing |
|---------|-------------|--------|
| workflows-consolidation-2026-q3 | Use Phase 3 findings | Week 1 |
| issue-type-workflow-automation | Skill integration in labeling | Week 3 |
| automation-consolidation-agentic | Agentic agent integration | Week 8+ |
| pr-finalisation-workflow | Depends on labeling-unified | Week 4 |
| release-agentic-workflows | Use existing release agent | Week 5 |

---

## Testing Strategy

### Pre-Production Validation (Phase 3)
1. Parallel execution (old + new workflows simultaneously)
2. 10 test PRs covering all issue types
3. Performance benchmarking (GitHub Actions minutes)
4. Edge case documentation
5. Team review & approval

### Production Rollout
1. Merge Phase 2 PR (consolidated workflows)
2. Archive old workflows (still available if rollback needed)
3. Monitor GitHub Actions metrics for 1 week
4. Keep PR review check disabled first 3 days (manual approval)
5. Enable full auto-merge after validation period

---

## Rollback Plan

If consolidated workflows cause issues:

1. **Immediate:** Revert Phase 2 PR
2. **Restore:** Restore workflows from `.github/workflows/archived/2026-09-11/`
3. **Analysis:** Document what failed in `ROLLBACK_ANALYSIS.md`
4. **Retry:** Fix issues and re-test before next attempt

Expected rollback time: < 30 minutes

---

## Success Metrics (Post-Launch)

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| Workflow count | 76 | 14 | 14 ✅ |
| GitHub Actions minutes/run | ~45 min | ~38 min | 15-20% savings ✅ |
| PR merge time | 8-12 min | 4-6 min | Faster merges ✅ |
| Scheduled job collisions | 4+ | 0 | None ✅ |
| Code duplication | ~500 lines | ~0 lines | Eliminated ✅ |
| Team satisfaction | 6/10 | 9/10 | Confidence ✅ |

---

## Documents to Create

```
.github/specs/
└── workflow-consolidation-2026-q4.spec.md (THIS FILE)

.github/projects/active/workflow-consolidation-master-plan-2026-09/
├── WORKFLOW_CONSOLIDATION_MASTER_PLAN.md
├── PHASE_1_BACKUP_STRATEGY.md
├── PHASE_2_IMPLEMENTATION_PLAN.md
├── PHASE_3_TESTING_PLAN.md
├── ARCHIVED_WORKFLOWS_MANIFEST.md
└── WORKFLOW_FEATURES_MAPPING.md

.github/
├── branch-exceptions.yml (NEW)
├── scripts/
│   └── extract-pr-labels.js (NEW)
├── workflows/
│   ├── archived/
│   │   └── 2026-09-11/ (62 workflows)
│   └── (14 consolidated + reduce to core set)
└── docs/
    └── WORKFLOW_CONSOLIDATION_MAPPING.md (NEW)
```

---

## Acceptance Criteria

- [x] Master plan document created and reviewed
- [ ] Phase 1 backup & archive complete
- [ ] Phase 1 PR merged
- [ ] Phase 2 implementation complete
- [ ] Phase 2 PR merged
- [ ] Phase 3 testing validates all features
- [ ] Performance metrics confirm 15-20% GitHub Actions savings
- [ ] Team approval to ship to production
- [ ] Production rollout complete with monitoring

---

**Spec Status:** 📋 PLANNING  
**Ready for:** Phase 1 execution  
**Owner:** Ashley Shaw  
**Last Updated:** Sep 11, 2026
