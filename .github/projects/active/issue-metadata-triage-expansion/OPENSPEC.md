---
file_type: documentation
title: "Issue Metadata Triage Expansion Specification"
description: "Comprehensive specification for 4-5 week initiative to expand issue triage system across 9 status:needs-* label categories"
version: "1.1.1"
created_date: "2026-08-09"
last_updated: "2026-08-10"
status: "active"
authors: ["LightSpeedWP Team"]
owners: ["Ash Shaw"]
tags: ["openspec", "issue-triage", "automation", "metadata"]
---

# Issue Metadata Triage Expansion — Specification

**Parent Epic:** [#1679 — Comprehensive Issue Metadata Expansion & Automated Triage System](https://github.com/lightspeedwp/.github/issues/1679)

**Scope:** Comprehensive issue metadata validation and automation across 9 `status:needs-*` label categories, plus enhanced type detection, assignment, project association, and relationship mapping.

**Estimated Effort:** 4-5 weeks | **Team:** 1 engineer | **Risk:** Low | **Phase Status:** Phase 0-2 Complete (PR #1692 merged)

---

## 1. PHASE 0: PLANNING (Weeks 1) — IN PROGRESS

### 1.1 Planning Task: Create Project Tracker

**Goal:** Establish project infrastructure and document detailed plans

**Acceptance Criteria:**

- [x] Create `.github/projects/active/issue-metadata-triage-expansion/` folder
- [x] Write project README.md with overview, phases, timeline
- [x] Create this OpenSpec specification
- [ ] Create GitHub issues for Phase 0-4
- [ ] Document success criteria for each phase
- [ ] Establish handler sequencing (Tier 1/2/3)

**Deliverables:**

- Project README with phase breakdown
- OpenSpec specification (this file)
- 5+ detailed GitHub issues
- Handler sequencing document

**Owner:** Ash Shaw  
**Status:** 🟡 IN PROGRESS

---

## 2. PHASE 1: AUDIT SCRIPT (Weeks 1-2)

### 2.1 Task: Create Issue Metadata Audit Script

**Goal:** Build comprehensive inventory of all open issues and metadata gaps

**Description:**
Create a Node.js script that audits all open issues in the `.github` repository, analysing metadata completeness across 9 `status:needs-*` label categories. Reuse architecture from `add-issue-template-sections.js` but extend to assess:

- Type labels (feature, bug, epic, story, task, etc.)
- Area labels (ci, docs, security, etc.)
- Status labels (needs-triage, needs-design, etc.)
- Priority labels (critical, important, normal)
- Assignee coverage
- Milestone assignment
- Project association
- PR linkage
- Custom fields (when applicable)
- Issue relationships (parent-child, blocked-by)

**Acceptance Criteria:**

- [ ] Script analyzes all 352+ open issues (uses pagination)
- [ ] Generates audit report in JSON format
- [ ] Exports audit report as markdown
- [ ] Exports data as CSV for manual review
- [ ] Grouped analysis by each 9 `status:needs-*` labels
- [ ] Identifies metadata gaps (missing type, area, status, etc.)
- [ ] Calculates coverage % for each metadata category
- [ ] Completes in <2 minutes
- [ ] Works with `--dry-run` flag (always non-destructive)
- [ ] Supports `--output-dir` for report storage
- [ ] Tested with 50+ issues (unit + integration)

**Implementation Details:**

```javascript
// scripts/automation/audit-issue-metadata.js

Exports metadata audit report with:
├─ Total issues analyzed: 352
├─ By status label:
│  ├─ status:needs-triage: 19 (gaps: type 18, area 15)
│  ├─ status:needs-template-fix: N/A
│  ├─ status:needs-review: 5 (gaps: type 2)
│  └─ ... (7 more)
├─ Overall metadata coverage:
│  ├─ Type labels: 95%
│  ├─ Area labels: 88%
│  ├─ Status labels: 100%
│  ├─ Priority labels: 92%
│  ├─ Assignees: 75%
│  ├─ Milestones: 60%
│  ├─ Projects: 45%
│  └─ PR linkage: 30%
└─ Top gaps (prioritized):
   ├─ 45 issues missing type: label
   ├─ 42 issues unassigned
   ├─ 18 issues missing milestone
   └─ ... (ranked by frequency)
```

**Files:**

- `scripts/automation/audit-issue-metadata.js` (main script)
- `scripts/automation/includes/audit-helpers.js` (utility functions)
- `scripts/automation/__tests__/audit-issue-metadata.test.js` (unit tests)

**Definition of Done:**

- [ ] Script complete and tested
- [ ] Audit report generated and documented
- [ ] 90%+ code coverage
- [ ] Runs in <2 minutes
- [ ] Results match manual spot-check on 10 issues
- [ ] Documentation with examples included

**Owner:** Ash Shaw  
**Status:** 📋 PLANNED  
**Priority:** 🔴 P0 (blocks all subsequent phases)

---

### 2.2 Task: Document Audit Results

**Goal:** Analyze audit output and document metadata gaps

**Description:**
Run the audit script against production data and document findings. Create detailed gap analysis report showing which labels are missing for each issue category, grouped by `status:needs-*`.

**Acceptance Criteria:**

- [ ] Audit runs successfully against all 352 issues
- [ ] Generate `AUDIT_RESULTS.md` with findings
- [ ] Export CSV for team review: `audit-results.csv`
- [ ] Identify top 5 metadata gaps
- [ ] Propose handler priorities based on ROI
- [ ] Document recommendations for each category

**Deliverables:**

- `AUDIT_RESULTS.md` report
- `audit-results.csv` for spreadsheet analysis
- Gap prioritization matrix
- Handler recommendations

**Owner:** Ash Shaw  
**Status:** 📋 PLANNED  
**Dependent On:** 2.1 complete

---

## 3. PHASE 2: TIER 1 HANDLERS (Weeks 3-4)

### 3.1 Task: Create `status:needs-template-fix` Handler

**Goal:** Automatically detect and fix invalid issue templates

**Description:**
Build handler that:

1. Detects if issue template is broken (missing DoR/DoD sections)
2. Identifies correct template based on issue type
3. Regenerates missing sections
4. Validates structure
5. Removes `status:needs-template-fix` label when complete

Reuse template logic from PR #1669 (`add-issue-template-sections.js`).

**Acceptance Criteria:**

- [ ] Detects 10+ template issues correctly (>90% accuracy)
- [ ] Regenerates sections for all issue types (feature, bug, epic, story, task)
- [ ] Validates template structure after fix
- [ ] Removes label when fixed
- [ ] Supports dry-run mode
- [ ] Processes 50+ issues successfully
- [ ] 8+ unit tests covering edge cases
- [ ] Handles concurrent API calls (rate limiting)

**Files:**

- `scripts/automation/handlers/handle-needs-template-fix.js`
- `scripts/automation/__tests__/handlers.test.js` (add tests)

**Definition of Done:**

- [ ] Handler complete and tested
- [ ] Integrated into orchestrator
- [ ] 90%+ accuracy on validation run
- [ ] All tests passing
- [ ] Documentation with examples

**Owner:** Ash Shaw  
**Status:** 📋 PLANNED  
**Dependent On:** 2.1-2.2 complete

---

### 3.2 Task: Create `status:needs-triage` Handler

**Goal:** Automatically assign type, area, and team lead to untriaged issues

**Description:**
Build handler that:

1. Analyzes issue title/description to infer type (feature, bug, etc.)
2. Detects area from keywords/content
3. Suggests team lead assignee based on area
4. Adds inferred labels
5. Assigns team lead
6. Removes `status:needs-triage` label

**Acceptance Criteria:**

- [ ] Infers type from content with 85%+ accuracy
- [ ] Infers area from keywords/tags with 80%+ accuracy
- [ ] Suggests appropriate assignee based on area
- [ ] Processes 100+ issues
- [ ] Supports confidence scoring (only apply >90% confidence)
- [ ] Provides suggestion mode (preview before apply)
- [ ] 8+ unit tests
- [ ] Integration with orchestrator

**Files:**

- `scripts/automation/handlers/handle-needs-triage.js`
- `scripts/automation/__tests__/handlers.test.js` (add tests)

**Definition of Done:**

- [ ] Handler complete and tested
- [ ] Type detection: 85%+ accuracy
- [ ] Area detection: 80%+ accuracy
- [ ] All tests passing
- [ ] Documentation with examples
- [ ] Validated on 50+ issues

**Owner:** Ash Shaw  
**Status:** 📋 PLANNED  
**Dependent On:** 2.1-2.2 complete

---

### 3.3 Task: Create Phase 2 Orchestrator Integration

**Goal:** Integrate Tier 1 handlers into unified workflow

**Description:**
Wire Tier 1 handlers (`status:needs-template-fix`, `status:needs-triage`) into a batch processor that:

- Fetches issues with each label
- Calls appropriate handler
- Supports `--dry-run` mode (preview)
- Supports `--interactive` mode (confirm each)
- Supports `--auto` mode (batch apply)
- Generates summary report

**Acceptance Criteria:**

- [ ] Both handlers integrated
- [ ] `--dry-run` mode shows all changes without applying
- [ ] `--interactive` mode prompts before each change
- [ ] `--auto` mode applies all changes with confidence >threshold
- [ ] Generates summary: # processed, # updated, # skipped, # errors
- [ ] Error handling and retry logic
- [ ] All tests passing (5+ integration tests)

**Files:**

- Update `scripts/automation/bulk-issue-metadata-updater.js`
- `scripts/automation/__tests__/orchestrator.test.js` (integration tests)

**Definition of Done:**

- [ ] Both handlers callable from orchestrator
- [ ] All modes working (dry-run, interactive, auto)
- [ ] Summary reports generated
- [ ] Integration tests passing
- [ ] Documentation updated

**Owner:** Ash Shaw  
**Status:** 📋 PLANNED  
**Dependent On:** 3.1-3.2 complete

---

## 4. PHASE 3: TIER 2 HANDLERS (Weeks 5-6)

### 4.1 Task: Create `status:needs-review` Handler

**Goal:** Auto-assign reviewers based on issue area

**Description:**
Analyzes issue and:

1. Infers review type (code, design, spec)
2. Identifies relevant area (ci, frontend, backend, etc.)
3. Suggests reviewers from codebase (CODEOWNERS, recent committers)
4. Assigns reviewers
5. Removes label when assigned

**Acceptance Criteria:**

- [ ] Identifies review type (80%+ accuracy)
- [ ] Suggests 1-3 relevant reviewers
- [ ] Uses CODEOWNERS for priority
- [ ] 8+ unit tests
- [ ] Validation on 20+ issues
- [ ] Handles no-reviewer cases gracefully

**Owner:** Ash Shaw  
**Status:** 📋 PLANNED

---

### 4.2 Task: Create `status:needs-dev` Handler

**Goal:** Verify pre-requisites and link to sprint

**Description:**
Checks issue readiness for development:

1. Verify type label exists
2. Verify area label exists
3. Check if linked to project (roadmap, sprint)
4. If no project, suggest one based on area
5. Verify design/spec is linked (if applicable)
6. Flag blockers

**Acceptance Criteria:**

- [ ] Validates 80%+ of issues correctly
- [ ] Suggests project assignment based on area
- [ ] 8+ unit tests
- [ ] Handles missing prerequisites

**Owner:** Ash Shaw  
**Status:** 📋 PLANNED

---

### 4.3 Task: Create `status:needs-planning` Handler

**Goal:** Route issues to roadmap/sprint planning

**Description:**
Analyzes issue and:

1. Infers scope (small, medium, large)
2. Suggests appropriate milestone based on scope + area
3. Links to planning project
4. Assigns to product manager
5. Suggests epic linkage if applicable

**Acceptance Criteria:**

- [ ] Suggests milestone with 75%+ accuracy
- [ ] Links to correct project
- [ ] 8+ unit tests
- [ ] Validation on 20+ issues

**Owner:** Ash Shaw  
**Status:** 📋 PLANNED

---

## 5. PHASE 4: REMAINING HANDLERS & COMPLETION (Weeks 7-8)

### 5.1 Task: Create Tier 3 Handlers (Design, Docs, Audit)

**Description:**
Implement remaining handlers:

- `status:needs-design` → Link Figma files, assign designer
- `status:needs-documentation` → Track doc completion, link PR
- `status:needs-audit` → Flag for manual review (limited automation)

**Owner:** Ash Shaw  
**Status:** 📋 PLANNED

---

### 5.2 Task: Complete Test Suite & Documentation

**Goal:** Achieve 80%+ code coverage and comprehensive docs

**Deliverables:**

- [ ] 50+ unit tests (80%+ coverage)
- [ ] 10+ integration tests
- [ ] `docs/ISSUE_METADATA_TRIAGE.md` (complete system documentation)
- [ ] CLI examples and troubleshooting guide
- [ ] API documentation for handlers

**Owner:** Ash Shaw  
**Status:** 📋 PLANNED

---

## 6. SUCCESS CRITERIA

### Quantitative

- [ ] 100% of open issues have `type:*` label
- [ ] 90%+ of issues have appropriate assignee(s)
- [ ] 85%+ of issues in a project
- [ ] 80%+ of issues have milestone
- [ ] 95%+ of DoR/DoD sections complete
- [ ] 100% of issues have ≥1 `area:*` label
- [ ] 100% of issues have ≥1 `status:*` label
- [ ] 100% of issues have ≥1 `priority:*` label

### Qualitative

- [ ] All 9 `status:needs-*` handlers implemented
- [ ] 80%+ code coverage across all scripts
- [ ] Zero regressions in existing workflows
- [ ] Team can run bulk updates with 1 command
- [ ] Comprehensive documentation + examples
- [ ] Validation workflow prevents non-compliant issues

---

## 7. TIMELINE & MILESTONES

| Week | Phase | Deliverables | Status |
|------|-------|--------------|--------|
| Week 1 | Planning | Project tracker, OpenSpec, GitHub issues | 🟡 IN PROGRESS |
| Week 2 | Phase 1 | Audit script, results, gap analysis | 📋 PLANNED |
| Week 3-4 | Phase 2 | Tier 1 handlers, integration, validation | 📋 PLANNED |
| Week 5-6 | Phase 3 | Tier 2 handlers, integration | 📋 PLANNED |
| Week 7-8 | Phase 4 | Tier 3 handlers, tests, docs, completion | 📋 PLANNED |

---

## 8. DEPENDENCIES & BLOCKERS

**Dependencies:**

- ✅ GitHub API access (existing)
- ✅ GitHub token with repo scope (existing)
- ✅ Node.js 18+ (existing)
- ✅ Jest test framework (existing)

**Blockers:** None identified

**Risks:**

- Low: Architecture well-established (reuse PR #1377, PR #1669)
- Low: Testing framework established
- Low: Dry-run mode provides safety net

---

## 9. ROLLOUT PLAN

### Phase A: Validation (Week 1-2)

- [ ] Audit script runs against 352 issues
- [ ] Handlers tested on 50-100 sample issues
- [ ] Team reviews dry-run results
- [ ] Confidence >85% for all handlers

### Phase B: Limited Rollout (Week 3)

- [ ] Apply Tier 1 handlers to subset (50 issues)
- [ ] Monitor for regressions
- [ ] Team spot-checks results

### Phase C: Full Rollout (Week 4+)

- [ ] Apply all handlers to full issue set (352 issues)
- [ ] Monitor compliance metrics
- [ ] Close GitHub issues
- [ ] Update documentation

---

## 10. RELATED ISSUES & REFERENCES

**Prior Art (Reuse Patterns):**

- PR #1377: MilestoneAssignmentAgent
- PR #1669: Bulk template section fixer
- PR #1613: Label validation script
- Issue #1376: Original issue triage automation

**Related Docs:**

- `CLAUDE.md` — Branch naming, PR strategy
- `docs/BRANCHING_STRATEGY.md` — Git discipline
- `docs/LABEL_STRATEGY.md` — Label taxonomy
- `docs/ISSUE_TRIAGE_AUTOMATION.md` — Existing system
- `.github/ISSUE_TEMPLATE/` — Issue templates

---

**Document Version:** 1.1.1  
**Last Updated:** 2026-08-10  
**Status:** Phase 0-2 Complete  
**Next Review:** Phase 3 execution planning
