---
name: Workflows Consolidation - Implementation Notes
description: Technical details, file references, and consolidation methodology
created: 2026-07-24
status: active
---

# Workflows Consolidation — Implementation Notes

## Audit Documents

### 1. WORKFLOWS-CONSOLIDATION-AUDIT.md

**Location:** `.github/reports/workflows/WORKFLOWS-CONSOLIDATION-AUDIT.md`  
**Purpose:** Comprehensive audit with detailed consolidation analysis  
**Content:**

- Complete workflow inventory (31 workflows analyzed)
- Categorization by function and consolidation opportunity
- Effort estimates per consolidation
- Risk assessment and mitigation strategies
- Scheduling conflict analysis

**Status:** ✅ Complete (2026-07-24)

### 2. Project Documentation

**Location:** `.github/projects/active/workflows-consolidation-2026-q3/`  
**Contents:**

- README.md — Project overview and timeline
- IMPLEMENTATION_NOTES.md — This document
- Phase-specific playbooks (created per phase)

## Consolidation Methodology

### Step 1: Workflow Classification

**For each of 31 workflows, determine:**

1. **Primary Function:**
   - Testing & Validation
   - CI/CD Pipeline
   - Release & Changelog
   - Documentation
   - Labeling & Automation
   - Maintenance

2. **Trigger Type:**
   - Push-triggered
   - PR-triggered
   - Scheduled
   - Manual dispatch
   - External (webhook)

3. **Dependencies:**
   - Other workflows (sequential)
   - External services (APIs, GitHub)
   - Secrets (list required)

4. **Output/Side Effects:**
   - Generated files
   - Comments posted
   - Labels applied
   - Notifications sent

### Step 2: Consolidation Opportunity Analysis

**For each pair/group of workflows, assess:**

1. **Similarity Score (0-100):**
   - Identical logic: 90-100
   - Very similar: 70-89
   - Somewhat similar: 50-69
   - Different: <50

2. **Consolidation Feasibility:**
   - Easy (1-2 hours): Merge with minimal changes
   - Moderate (3-6 hours): Refactor common logic
   - Complex (7+ hours): Significant redesign needed

3. **Risk Assessment:**
   - LOW: No dependencies, simple consolidation
   - MEDIUM: Some dependencies, careful testing needed
   - HIGH: Complex dependencies, phased rollout required

### Step 3: Phase Planning

**Phase breakdown based on:**

- Risk level (low-risk quick wins first)
- Effort estimation (balance phases)
- Dependencies (sequence properly)
- Team capacity (sustainable pace)

## Detailed Consolidation Candidates

### Phase 1A: Quick Wins (15 hours)

#### Consolidation 1: Remove testing.yml

**Current State:**

- `testing.yml` — Runs basic tests
- Superseded by more comprehensive test runners
- Not referenced by other workflows

**Consolidation Strategy:**

- Delete `testing.yml`
- Verify no critical dependencies
- Update CI documentation
- Estimate: 2 hours

**Risk:** LOW — Isolated workflow, clear deprecation

---

#### Consolidation 2: Shared Validation Helpers

**Current Workflows:**

- `validate-frontmatter.yml`
- `validate-pr-template.yml`
- `branch-validation.yml`

**Common Logic:**

- File validation patterns
- Error messaging
- Comments/labels posting
- ~120 lines of duplicated code

**Consolidation Strategy:**

1. Extract common helpers to `scripts/validation/helpers.js`
2. Update each workflow to use shared helpers
3. Reduce duplication (~60 lines saved per workflow)
4. Maintain separate workflows (triggers differ)
5. Estimate: 8 hours

**Risk:** LOW — Refactoring existing code, careful testing

---

#### Consolidation 3: Document Shared Patterns

**Deliverable:**

- `.github/workflows/PATTERNS.md` — Common patterns guide
- Template snippets for future workflows
- Reusable job configurations

**Estimate:** 5 hours

**Risk:** NONE — Documentation only

---

### Phase 1B: Changelog & Metrics (30 hours)

#### Consolidation 4: Merge Changelog Workflows

**Current Workflows:**

- `changelog-validation.yml` — Validates changelog format
- `changelog-consolidation.yml` — Merges changelog entries
- Triggered on PR/push events
- ~60 lines of overlapping logic

**Consolidation Strategy:**

1. Create `changelog-management.yml` with two conditional jobs:
   - Job 1: Validate on PR (run `changelog-validation.yml` logic)
   - Job 2: Consolidate on merge to develop (run `changelog-consolidation.yml` logic)
2. Delete old workflows
3. Update CHANGELOG.md references
4. Test both event flows
5. Estimate: 12 hours

**Risk:** MEDIUM — Critical to release process, thorough testing needed

---

#### Consolidation 5: Consolidate Metrics Pipeline

**Current Workflows:**

- `metrics-collection.yml` — Collects build metrics
- `performance-tracking.yml` — Tracks performance data
- `reporting.yml` — Generates reports
- Sequential workflow chain

**Consolidation Strategy:**

1. Create `metrics-pipeline.yml` with 3 sequential jobs:
   - Job 1: Collect metrics
   - Job 2: Track performance
   - Job 3: Generate reports
2. Use `needs` for sequencing
3. Single workflow instead of 3
4. Unified data format
5. Estimate: 18 hours

**Risk:** MEDIUM — Interdependent workflows, sequencing critical

---

### Phase 2: Documentation & Validation (20 hours)

#### Consolidation 6: Documentation Workflow

**Current Workflows:**

- `docs-validation.yml` — Validates doc structure
- `markdown-linting.yml` — Runs markdown linting
- `readme-generation.yml` — Auto-generates README sections

**Consolidation Strategy:**

1. Create `documentation.yml` with 3 conditional jobs:
   - Job 1: Validate docs (on PR to docs/)
   - Job 2: Lint markdown (on any push)
   - Job 3: Generate README (on merge to develop)
2. Use path filters for triggering
3. Unified logging and reporting
4. Estimate: 12 hours

**Risk:** LOW — Separate concerns, independent jobs

---

#### Consolidation 7: Shared Validation Rules

**Deliverable:**

- `scripts/validation/rules.json` — Centralized validation config
- Used by multiple workflows
- Single source of truth for rules

**Estimate:** 8 hours

**Risk:** LOW — Configuration-based, easy to test

---

### Phase 3: Labeling & Automation (20 hours)

#### Consolidation 8: Unified Labeling Workflow

**Current Workflows:**

- `issue-labeler.yml` — Labels issues
- `pr-labeler.yml` — Labels PRs
- `auto-assignment.yml` — Auto-assigns issues
- `dependency-labeler.yml` — Labels dependency PRs
- `release-labeler.yml` — Labels releases

**Common Logic:**

- Event type detection
- Label mapping rules
- GitHub API calls
- Error handling

**Consolidation Strategy:**

1. Create `automation.yml` with 4 conditional jobs:
   - Job 1: Issue automation (on issue open/edit)
   - Job 2: PR automation (on PR open/edit)
   - Job 3: Dependency automation (on dependabot PRs)
   - Job 4: Release automation (on release create)
2. Shared label rules config
3. Centralized workflow logic
4. Estimate: 15 hours

**Risk:** MEDIUM — High-frequency workflows, careful testing

---

#### Consolidation 9: Shared Automation Rules

**Deliverable:**

- `scripts/automation/rules.js` — Label mapping and assignment logic
- Used by labeling workflow
- Maintainable from single file

**Estimate:** 5 hours

**Risk:** LOW — Extracted logic, testable

---

## Technical Implementation

### Workflow Structure Best Practices

#### Conditional Jobs Pattern

```yaml
jobs:
  job-a:
    if: contains(github.event.pull_request.title, '[docs]')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
  job-b:
    if: |
      github.event_name == 'push' && 
      contains(github.event.head_commit.message, '[build]')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

#### Shared Helpers Pattern

```javascript
// scripts/helpers.js
module.exports = {
  validateFormat: (content) => { /* ... */ },
  postComment: (octokit, issue, comment) => { /* ... */ },
  applyLabel: (octokit, issue, label) => { /* ... */ },
};
```

#### Configuration-Driven Pattern

```json
{
  "labels": {
    "bug": { "color": "d73a4a", "priority": "high" },
    "feature": { "color": "a2eeef", "priority": "medium" }
  },
  "automation": {
    "auto-assign": true,
    "auto-label": true
  }
}
```

## Performance Metrics

### Baseline (Current State)

**GitHub Actions Minutes (Monthly Average):**

- Testing workflows: ~450 minutes
- CI/CD pipeline: ~320 minutes
- Labeling automation: ~180 minutes
- Documentation: ~120 minutes
- Other: ~130 minutes
- **Total:** ~1,180 minutes/month

### Target (After Consolidation)

**Estimated Savings:**

- Phase 1A: ~100 min/week (~430 min/month) — Quick wins
- Phase 1B: ~75 min/week (~320 min/month) — Changelog/metrics
- Phase 2: ~40 min/week (~170 min/month) — Documentation
- Phase 3: ~50 min/week (~215 min/month) — Labeling
- **Total Savings:** ~265 min/week (~1,135 min/month) — 15-20% reduction

**New Total:** ~45-50 minutes/week (~190-215 minutes/month)

## Testing Strategy

### Unit Testing

- Test shared helpers independently
- Validate conditional logic
- Mock GitHub API calls

### Integration Testing

- Run consolidated workflows in staging
- Verify all jobs execute correctly
- Check output/side effects

### Smoke Testing

- Deploy to production
- Monitor first 10 workflow runs
- Verify no regressions

## Rollback Plan

**If issues discovered:**

1. Revert workflow file to previous version
2. Re-enable old workflow (if needed)
3. Debug in staging environment
4. Create follow-up PR with fixes

**Monitoring:**

- Track GitHub Actions run time
- Monitor workflow success rate
- Watch for new issues/complaints

## Documentation & Knowledge Transfer

### For Each Phase

- Create implementation playbook
- Document all changes
- Update CI/CD documentation
- Record video walkthrough (optional)

### Ongoing

- Maintain `PATTERNS.md` with new examples
- Update workflow troubleshooting guide
- Share learnings with team

## Success Metrics

✅ **To Track:**

- GitHub Actions minutes (before/after)
- Workflow count (31 → 25)
- Code duplication (lines reduced)
- Workflow execution time (per phase)
- Error rate (maintain or improve)
- Team satisfaction (feedback)

## Related Resources

### Git References

- **Branch:** `audit/workflows-consolidation-audit`
- **PR:** #1228
- **Epic:** #1227

### Documentation Files

- `.github/reports/workflows/WORKFLOWS-CONSOLIDATION-AUDIT.md`
- `.github/workflows/` — Active workflows
- `scripts/validation/` — Shared helpers location
- `scripts/automation/` — Automation rules location

### Team References

- **Project Lead:** Ash Shaw (@ashleyshaw)
- **Stakeholders:** DevOps team, agent platform team
- **Code Review:** @lightspeedwp/maintainers

## Timeline & Milestones

- **Week 1-2:** Phase 1A (Quick wins)
- **Week 2-3:** Phase 1B (Changelog & metrics)
- **Week 4-6:** Phase 2 (Documentation)
- **Week 7-12:** Phase 3 (Labeling)
- **End of Week 12:** Full consolidation complete, 25 workflows active

---

**Last Updated:** 2026-07-24  
**Status:** Phase 1A — Starting  
**Next Milestone:** Phase 1A completion (End of Week 2)

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
