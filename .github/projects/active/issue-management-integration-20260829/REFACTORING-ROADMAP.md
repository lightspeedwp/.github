---
title: Integration Refactoring Roadmap
status: in-progress
phase: 2-implementation
created_date: 2026-08-29
---

# Integration Refactoring Roadmap

**Goal**: Execute phased refactoring to unify issue automation framework.

**Duration**: 4 phases over ~3-4 sessions

**Owner**: Claude Code

---

## Phase 1: Extend Triage Handler ✨ IN PROGRESS

**Objective**: Add milestone assignment to existing `handle-needs-triage.js`

**Scope**: Minimal changes to core handler logic

### Tasks

#### 1.1: Analyze Milestone Requirements

- [x] Document current milestone strategy (Priority → Milestone mapping)
- [x] Identify milestone assignment patterns
- [ ] Validate milestone existence in repository
- [ ] Define confidence thresholds for milestone assignment

**Status**: Analysis complete in INTEGRATION-ANALYSIS.md

**Work**:

```bash
# Check existing milestones in repository
curl -s -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/lightspeedwp/.github/milestones | jq '.[] | {id, title}'
```

#### 1.2: Extend Handler Type/Area Patterns

- [ ] Add milestone-specific keywords to areaPatterns (optional)
- [ ] Document milestone → area mapping
- [ ] Add priority label detection (if not already present)

**File**: `scripts/automation/handlers/handle-needs-triage.js`

**Changes**:

```javascript
// Add to typePatterns or areaPatterns
const milestonePatterns = {
  "backlog": {
    keywords: ["backlog", "future", "enhancement", "nice-to-have"],
    patterns: [/backlog|future|enhancement/i],
    weight: 0.8
  }
};
```

#### 1.3: Add Milestone Assignment Logic

- [ ] Implement `getMilestoneForArea()` function
- [ ] Map (area + priority) → milestone
- [ ] Add milestone suggestion to output

**Implementation**:

```javascript
function getMilestoneForArea(areas, priorityLabel) {
  // If priority:critical or priority:high → return "High Priority"
  // If type:epic → return "Epics"
  // Else → return "Backlog"
  
  const mapping = {
    "priority:critical": "Critical Issues",
    "priority:high": "High Priority",
    "type:epic": "Epics",
    "type:bug": "Bug Fixes",
    "type:feature": "Enhancements"
  };
  
  // Priority takes precedence over type
  for (const label of priorityLabel) {
    if (mapping[label]) return mapping[label];
  }
  return "Backlog";
}
```

#### 1.4: Update processIssue() Return Value

- [ ] Add `milestoneSuggested` to preview/updated results
- [ ] Document milestone assignment in comments
- [ ] Update test cases

**Output Change**:

```javascript
{
  status: "updated",
  issueNumber: 2352,
  labelsAdded: ["type:feature", "area:ci"],
  milestoneSuggested: "High Priority",  // ← NEW FIELD
  assigneeAdded: true,
  labelRemoved: true
}
```

#### 1.5: Update Orchestrator to Handle Milestones

- [ ] Extend `bulk-issue-metadata-updater.js` to apply milestone via API
- [ ] Add milestone assignment to GitHub API call sequence
- [ ] Handle milestone not found error gracefully

**Work**:

```javascript
// In orchestrator, after adding labels:
if (suggestedMilestone) {
  const milestoneNumber = await findMilestoneByTitle(suggestedMilestone);
  if (milestoneNumber) {
    await githubRequest("PATCH", `/repos/${owner}/${repo}/issues/${issueNumber}`, {
      milestone: milestoneNumber
    });
  }
}
```

#### 1.6: Test Phase 1 Changes

- [ ] Unit tests for milestone logic
- [ ] Integration test with sample issues
- [ ] Dry-run test with `audit-issue-metadata.js`
- [ ] Verify existing tests still pass

**Commands**:

```bash
npm test -- scripts/automation/handlers/handle-needs-triage.test.js
npm test -- scripts/automation/__tests__/
npm run triage:analyze -- --format json | head -50
```

**Estimated Effort**: 2-3 hours  
**Estimated Lines Changed**: +60-80 lines (net +40 after optimizations)

---

## Phase 2: Refactor PR #2442 Scripts

**Objective**: Remove redundant scripts, delegate to framework

**Scope**: Delete 2 scripts, update npm scripts, preserve project tracking

### Tasks

#### 2.1: Verify Framework Parity

- [ ] Run existing `audit-issue-metadata.js` on status:needs-triage issues
- [ ] Compare output with PR #2442's `triage-issues-needs-triage.js`
- [ ] Verify milestone suggestions match expectations
- [ ] Document any missing features

#### 2.2: Update npm Scripts in package.json

- [ ] Update `triage:analyze` to use `audit-issue-metadata.js`
- [ ] Update `triage:apply` to use `bulk-issue-metadata-updater.js`
- [ ] Test npm scripts work as expected
- [ ] Verify `--dry-run` and other flags work

**Changes**:

```json
{
  "scripts": {
    "triage:analyze": "node scripts/automation/audit-issue-metadata.js --label status:needs-triage --format json",
    "triage:apply": "node scripts/automation/bulk-issue-metadata-updater.js --auto --label status:needs-triage --confidence 0.85"
  }
}
```

#### 2.3: Merge Documentation

- [ ] Review `docs/ISSUE-TRIAGE-GUIDE.md` content
- [ ] Merge valuable sections into `scripts/automation/README.md`
- [ ] Update links and cross-references
- [ ] Preserve historical context in project tracking

#### 2.4: Delete Redundant Scripts

- [ ] Delete `scripts/triage-issues-needs-triage.js`
- [ ] Delete `scripts/apply-triage-improvements.js`
- [ ] Delete or archive `docs/ISSUE-TRIAGE-GUIDE.md`
- [ ] Commit deletion with clear message

**Commit Message**:

```
refactor: integrate PR #2442 scripts into automation framework

- Delete triage-issues-needs-triage.js (replaced by audit-issue-metadata.js)
- Delete apply-triage-improvements.js (replaced by bulk-issue-metadata-updater.js)
- Merge ISSUE-TRIAGE-GUIDE.md into scripts/automation/README.md
- Update npm scripts to use unified framework
- Preserve TRIAGE-IMPROVEMENTS-SUMMARY.md for project tracking

This completes the integration of PR #2442's improvements into the existing
automation framework, eliminating code duplication and providing a single
source of truth for issue triage automation.

Related: #2442
```

#### 2.5: Update PR #2442 Description

- [ ] Document refactoring changes
- [ ] Link to integration analysis
- [ ] Update metrics (net lines changed)
- [ ] Update status to reflect refactoring

#### 2.6: Verify CI Passes

- [ ] Run linting and validation
- [ ] Confirm all tests pass
- [ ] Check for new issues from governance checks
- [ ] Resolve any CI failures

**Commands**:

```bash
npm run lint:js
npm run lint:md
npm test
npm run validate:frontmatter
```

**Estimated Effort**: 2-3 hours  
**Estimated Net Change**: -500 lines (additions removed)

---

## Phase 3: Agent Alignment

**Objective**: Align spec-based agents in `.github/agents/` directory

**Scope**: Consolidate, create, and update agent specs for cross-org reuse

### Tasks

#### 3.1: Consolidate Issues Agent

- [ ] Review existing `agents/issues.agent.md` (wrong location)
- [ ] Review existing `.github/agents/issues.agent.md` (incomplete spec)
- [ ] Merge both specs into consolidated version
- [ ] Add references to triage automation framework
- [ ] Delete duplicate from wrong location

#### 3.2: Create PR Creation Agent Spec

- [ ] Review existing `/agents/pr-creation-agent/` directory
- [ ] Create `.github/agents/pr-creation.agent.md` spec file
- [ ] Document PR creation workflow
- [ ] Add cross-references to issues agent

#### 3.3: Update Labeling Agent

- [ ] Review `.github/agents/labeling.agent.md`
- [ ] Add references to both issues and PR creation agents
- [ ] Document label taxonomy
- [ ] Add integration notes

#### 3.4: Design Multi-File Agent Architecture

- [ ] Create shared taxonomy module: `.github/agents/shared/taxonomy.md`
- [ ] Document label system (type, priority, area, status, meta)
- [ ] Create shared configuration reference
- [ ] Enable cross-org reuse (Block Theme, Plugin, control plane)

#### 3.5: Validate Agent Specs

- [ ] Check frontmatter compliance
- [ ] Verify cross-references resolve
- [ ] Test agent initialization with new specs
- [ ] Document any breaking changes

**Estimated Effort**: 3-4 hours  
**Estimated Lines Added**: +200-300 lines

---

## Phase 4: Create Tracking Issues

**Objective**: Document integration work as GitHub issues for visibility

**Scope**: Create linked issues for sub-tasks and decisions

### Issues to Create

#### Issue 1: Extend handler with milestone logic

```
Title: feat: Add milestone assignment to triage handler
Label: type:feature, area:automation
Project: Issue Management Integration
Description: Extends handle-needs-triage.js with milestone assignment
Milestone: Backlog
Assignee: ashleyshaw
```

#### Issue 2: Refactor PR #2442 scripts

```
Title: refactor: Integrate PR #2442 into automation framework
Label: type:task, area:automation
Project: Issue Management Integration
Description: Remove redundant scripts, use existing framework
Milestone: Backlog
Related: #2442
```

#### Issue 3: Align spec-based agents

```
Title: refactor: Consolidate and align spec-based agents
Label: type:task, area:automation
Project: Issue Management Integration
Description: Move agents to .github/agents, create multi-file architecture
Milestone: Backlog
```

#### Issue 4: Multi-file agent architecture for cross-org reuse

```
Title: feat: Design multi-file agent architecture
Label: type:feature, area:automation
Project: Issue Management Integration
Description: Enable agent specs to be reused across Block Theme, Plugin, control plane
Milestone: Backlog
```

**Estimated Effort**: 1 hour (documentation only)

---

## Overall Timeline

| Phase | Est. Duration | Status |
|-------|---|--------|
| Phase 1: Handler Extension | 2-3h | ⏳ In Progress |
| Phase 2: Script Refactoring | 2-3h | ⏹️ Blocked on Phase 1 |
| Phase 3: Agent Alignment | 3-4h | ⏹️ Blocked on Phase 2 |
| Phase 4: Issue Creation | 1h | ⏹️ Blocked on Phase 3 |
| **Total** | **8-11h** | **⏳ Multi-session** |

---

## Success Criteria

✅ Phase 1:

- Handler extends existing `handle-needs-triage.js` without breaking changes
- Tests pass
- Milestone assignment works with confidence thresholds

✅ Phase 2:

- Redundant scripts deleted
- npm scripts use unified framework
- CI passes
- PR #2442 updated with refactoring

✅ Phase 3:

- Agent specs consolidated in `.github/agents/`
- Multi-file architecture designed
- Cross-references validated

✅ Phase 4:

- Related GitHub issues created and linked
- Integration tracking complete
- Documentation updated

---

## Risk Mitigation

| Risk | Probability | Mitigation |
|------|-------------|-----------|
| Breaking existing tests | Medium | Run full test suite after each phase |
| Milestone not found | Low | Graceful error handling + create missing milestones |
| CI validation fails | Medium | Pre-validate with lint and unit tests |
| Agent specs conflict | Low | Clear consolidation plan, review before merge |
| Lost context from PR #2442 | Low | Preserve TRIAGE-IMPROVEMENTS-SUMMARY.md |

---

**Next Action**: Execute Phase 1 tasks, then proceed to Phase 2 after validation.
