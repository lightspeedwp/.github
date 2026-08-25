# Phase 3: Labeling Automation — Issue Triage System

## Overview

Phase 3 applies **type labels**, **area labels**, and **priority labels** to all 250+ issues remediated in Phase 2. This phase completes the automated triage system by ensuring every issue has complete metadata for filtering, automation, and roadmap planning.

## Current Status

- **Phase 1** ✅ Complete — Implementation (agents, workflows, docs)
- **Phase 2** ✅ Complete — Milestone Assignment (PR #1488 merged)
- **Phase 3** 🔄 In Progress — Labeling Automation (started 2026-08-04)

**Branch:** `feat/issue-triage-phase-3-labeling` (properly named per CLAUDE.md conventions)

## Scope & Goals

### Goals

1. **100% type label coverage** — Every issue has exactly one `type:*` label
2. **Area-specific labels** — Issues tagged with relevant `area:*` labels (ci, scripts, tests, etc.)
3. **Priority labels** — High/urgent issues flagged with `priority:*` labels
4. **Automated enforcement** — Future issues auto-labeled on creation via enhanced workflows
5. **Zero manual intervention** — System fully automated end-to-end

### Success Criteria

- [ ] LabelingAgent created and tested (≥80% coverage tests)
- [ ] issue-labeling-automation.yml workflow created and deployed
- [ ] All 250+ remediated issues labeled automatically
- [ ] Type coverage: 250/250 (100%)
- [ ] Area coverage: 240+/250 (96%+)
- [ ] Priority coverage: 50+/250 (20%+ high/urgent)
- [ ] No label conflicts or duplicates
- [ ] Dry-run validation passed
- [ ] Final compliance audit 100%
- [ ] Documentation complete (agent API, workflow guide, examples)

## Technical Architecture

### 3 New Agents/Workflows

#### 1. LabelingAgent (`scripts/agents/includes/labeling-agent.js`)

**Purpose:** Intelligent label assignment based on issue metadata and content

**Features:**

- Type detection from issue structure/template
- Area routing based on file paths and keywords
- Priority extraction from title/labels/body
- Batch processing (1000+ issues/run)
- Confidence scoring for each label decision
- Dry-run preview mode

**Rules:**

- **Type Detection:** Based on template used, keywords in title/body
  - Bug → `type:bug` (if root cause documented)
  - Feature → `type:feature` (if acceptance criteria clear)
  - Task → `type:task` (if scoped and deliverable)
  - Epic → `type:epic` (if has child issues)
  - etc. for all 10+ types

- **Area Routing:** Based on file paths and keywords
  - Mentions "workflow", "github-actions", "CI" → `area:ci`
  - Mentions "test", "spec", "coverage" → `area:tests`
  - Mentions "script", "automation", "node" → `area:scripts`
  - etc.

- **Priority Detection:** From title/body/existing labels
  - Contains "urgent", "critical", "blocker" → `priority:urgent`
  - Contains "high priority" → `priority:high`
  - etc.

#### 2. issue-labeling-automation.yml Workflow

**Purpose:** Run LabelingAgent on schedule and trigger events

**Triggers:**

- Manual dispatch (workflow_dispatch)
- After bulk remediation completes
- On issue creation (for new issues)
- Scheduled: daily at 02:00 UTC

**Configuration:**

```yaml
- dry_run: true/false (default: true for preview)
- issue_filter: 'created >= 7 days ago' (only recent issues)
- label_types: 'all' (type, area, priority)
- batch_size: 50 (process in batches)
```

**Output:**

- Detailed labeling report (JSON)
- Applied labels summary
- Failures/errors log
- Compliance audit trail

#### 3. Label Validation Workflow

**Purpose:** Ensure label consistency and detect conflicts

**Checks:**

- No duplicate labels
- Exactly one `type:*` label per issue
- Valid label names (against canonical list)
- No orphaned labels (labels without items)
- Coverage metrics (% of issues labeled)

## Implementation Plan

### Step 1: Create LabelingAgent (2-3 hours)

**File:** `scripts/agents/includes/labeling-agent.js` (~400 lines)

**Components:**

1. Label mapping configuration
2. Type detection rules
3. Area routing logic
4. Priority detection
5. Batch processing
6. Dry-run/apply modes
7. Reporting

**Testing:**

- Unit tests for each rule (≥20 tests)
- Integration tests with mock GitHub API
- Edge case handling (partial metadata, missing body, etc.)
- Coverage: ≥80%

### Step 2: Create Workflow (1-2 hours)

**File:** `.github/workflows/issue-labeling-automation.yml` (~150-200 lines)

**Components:**

1. Workflow definition (triggers, inputs)
2. Agent invocation
3. GitHub API calls for label application
4. Error handling
5. Report generation
6. Artifact storage

### Step 3: Documentation (1-2 hours)

**File:** `docs/ISSUE_TRIAGE_LABELING.md` (~400-500 lines)

**Sections:**

1. Overview & architecture
2. Label mapping reference
3. Workflow usage guide (examples)
4. Agent API documentation
5. Troubleshooting guide
6. Rules and decision logic

### Step 4: Testing & Validation (2-3 hours)

**Dry-Run Phase:**

```bash
gh workflow run issue-labeling-automation.yml \
  --ref feat/issue-triage-phase-3-labeling \
  -f dry_run=true \
  -f issue_filter='created >= 7 days ago'
```

**Results:**

- Preview all label assignments
- Review report for correctness
- Verify area routing logic
- Check type detection accuracy

**Apply Phase:**

```bash
gh workflow run issue-labeling-automation.yml \
  --ref feat/issue-triage-phase-3-labeling \
  -f dry_run=false \
  -f issue_filter='created >= 7 days ago'
```

**Validation:**

- Spot-check 10 issues for correct labels
- Verify no label conflicts
- Check coverage metrics
- Run compliance audit

### Step 5: Integration & Deployment (1 hour)

1. Create PR to develop branch
2. Code review & testing
3. Merge to develop
4. Deploy to production
5. Monitor for issues

## Label Mapping Reference

### Type Labels (Mutually Exclusive)

| Label | Detection Rules | Example Issues |
|-------|-----------------|------------------|
| `type:bug` | Has "Root Cause" section in template | #1850, #1903 |
| `type:feature` | Has "Acceptance Criteria" in template | #1750, #1800 |
| `type:task` | Simple scoped work, no AC required | #1700, #1725 |
| `type:epic` | Has child issues/parent tracking | #1376 |
| `type:story` | Has user narrative + AC | #1600, #1625 |
| `type:improvement` | Suggests enhancement to existing feature | #1500, #1550 |
| `type:chore` | Housekeeping, maintenance, dependency update | #1400, #1450 |
| `type:documentation` | Docs, readme, guides | #1300, #1350 |
| `type:design` | UI/UX, tokens, accessibility | #1200, #1250 |
| `type:code-refactor` | Code cleanup without changing behavior | #1100, #1150 |

### Area Labels (Multiple Allowed)

| Label | Detection Keywords | Related Workflows |
|-------|-------------------|--------------------|
| `area:ci` | workflow, github-actions, CI/CD, action | .github/workflows/ |
| `area:scripts` | script, automation, node, javascript | scripts/ |
| `area:tests` | test, spec, coverage, unit, e2e | *.test.js,*.spec.js |
| `area:docs` | documentation, readme, guide, spec | docs/, *.md |
| `area:governance` | governance, policy, rules, enforcement | AGENTS.md, CLAUDE.md |
| `area:performance` | speed, latency, optimization, benchmark | perf/ |
| `area:security` | security, vulnerability, auth, encryption | security/ |

### Priority Labels (Up to 1)

| Label | Keywords | SLA |
|-------|----------|-----|
| `priority:urgent` | critical, blocker, production down | 4 hours |
| `priority:high` | high priority, important, significant | 1 day |
| `priority:normal` | standard work | 1 week |
| `priority:low` | nice-to-have, cosmetic, future | no SLA |

## Dependencies & Integration Points

### Upstream (Completed)

- Phase 2: MilestoneAssignmentAgent ✅
- Phase 2: issue-remediation-bulk.yml workflow ✅

### Downstream (Future)

- Automated filtering/grouping by labels
- Roadmap planning (milestones + labels)
- Status reporting (label coverage metrics)

### Integration with Existing Systems

- **issue-create-enhanced.yml** — Will auto-label new issues
- **labeling.yml** — Existing workflow (validation layer)
- **issue-remediation-bulk.yml** — Triggers labeling after milestones assigned

## Timeline

**Total Duration:** ~1 week (including review & fixes)

| Phase | Duration | Start | End |
|-------|----------|-------|-----|
| Development | 6-8 hours | 2026-08-04 | 2026-08-05 |
| Testing & Validation | 4-6 hours | 2026-08-05 | 2026-08-06 |
| Code Review | 2-4 hours | 2026-08-06 | 2026-08-07 |
| Dry-Run Execution | 1-2 hours | 2026-08-07 | 2026-08-07 |
| Approval & Apply | 2-3 hours | 2026-08-07 | 2026-08-08 |
| Verification | 1-2 hours | 2026-08-08 | 2026-08-08 |

## Deliverables

### Code

- [x] Placeholder: `scripts/agents/includes/labeling-agent.js` (TBD)
- [x] Placeholder: `.github/workflows/issue-labeling-automation.yml` (TBD)
- [x] Placeholder: Unit tests (TBD)

### Documentation

- [x] Placeholder: `docs/ISSUE_TRIAGE_LABELING.md` (TBD)
- [x] This file: PHASE_3_LABELING_PLAN.md

### Reports

- [x] Placeholder: Phase 3 dry-run report (TBD)
- [x] Placeholder: Phase 3 final compliance report (TBD)

## Next Steps

1. **Create LabelingAgent** — Core logic for label assignment
2. **Create workflow** — Orchestrate label application at scale
3. **Write tests** — Unit + integration tests (≥80% coverage)
4. **Write documentation** — Agent API, examples, troubleshooting
5. **Execute dry-run** — Preview all label assignments
6. **Review & refine** — Address any concerns from dry-run
7. **Execute apply** — Apply labels to all 250+ issues
8. **Verify compliance** — 100% coverage validation
9. **Create PR to develop** — Code review & merge
10. **Document results** — Archive in project folder

## Success Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Type label coverage | 100% (250/250) | 0% (0/250) |
| Area label coverage | 96%+ (240+/250) | 0% (0/250) |
| Priority label coverage | 20%+ (50+/250) | 0% (0/250) |
| Label conflict rate | 0% | TBD |
| Agent test coverage | ≥80% | TBD |
| Workflow test coverage | ≥80% | TBD |
| Dry-run accuracy | ≥95% | TBD |
| Final compliance | 100% | TBD |

## References

- **Phase 1 Docs:** `.github/projects/active/issue-triage-automation-system/IMPLEMENTATION_PLAN.md`
- **Phase 2 PR:** #1488 (feat: complete Issue Triage Phase 2 execution with governance validation)
- **Phase 2 Results:** Milestone assignment completed for 77+ issues
- **Label Reference:** `.github/labels.yml`
- **Issue Types:** `.github/issue-types.yml`

---

**Status:** Phase 3 Initiated (2026-08-04)  
**Owner:** Ash Shaw  
**Branch:** `feat/issue-triage-phase-3-labeling`  
**Next Review:** 2026-08-05

*Built with LightSpeed AI infrastructure for enterprise-scale GitHub automation.*
