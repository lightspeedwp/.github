---
title: "PR Finalisation Workflow Modernization — Technical Specification"
type: "openspec"
version: "1.0"
created: "2026-09-04"
status: "draft"
---

# OPENSPEC: PR Finalisation Workflow v2.0

## Executive Summary

This specification defines the integration of 6 existing agents and skills into the PR finalization workflow, improving automation coverage from ~30% to ~70%.

**Scope:** Integrate Changelog Agent, Label Audit Skill, Issue-Type Allocator Skill, Issue Agent, and PR Agent into a unified 12-step workflow.

**Success Metric:** v2.0 workflow deployed and tested on 5+ real PRs with zero blockers.

---

## Implementation Specification

### 1. Changelog Agent Integration

**Component:** `agents/changelog/`  
**Status:** ✅ Built & tested (19 tests, 100% coverage)

#### Integration Point: STEP 2 — Validate & Automate Changelog Entry

**Required APIs:**
```javascript
// Validate individual entry
validateEntry(entry, { autoFormat: true })
  → { valid, errors, formatted, status, message }

// Validate entire changelog
validateChangelog(changelogPath, { parseContent: true })
  → { valid, errors, warnings, parsed, status, message }

// Add entry to changelog
addEntry(changelogPath, entry, { validate, autoFormat })
  → { success, errors, updated, entry, status, message }

// Process for release
processChangelog(changelogPath, version, date)
  → { success, errors, updated, version, date, content, status, message }
```

**Validation Rules:**
- Entry format: Title < 60 chars, optional description < 150 chars
- Em-dashes (—) not hyphens (-)
- PR link included (#123)
- Correct section (Added, Changed, Fixed, Security, etc)
- Keep a Changelog 1.1.0 compliance

**Entry Category Mapping:**
- `type:feature` → `### Added`
- `type:bug` → `### Fixed`
- `type:enhancement` → `### Changed`
- `type:security` → `### Security`
- `type:a11y` → `### Accessibility`
- `type:refactor` → `### Technical`
- Skip: Chore, Task, Research, Documentation, Maintenance

**Error Handling:**
- Invalid format → Request manual correction
- Auto-format enabled → Reformat automatically
- Pre-existing issues → Document for investigation

**Workflow Integration:**
```yaml
# PR validation workflow
- name: Validate Changelog Entry
  run: |
    npm run changelog:validate-pr
    # Blocks merge if entry invalid

# Release workflow
- name: Process Changelog for Release
  run: |
    npm run changelog:process -- --version $VERSION --date $DATE
    # Blocks release if changelog invalid
```

---

### 2. Label Audit Skill Integration

**Component:** `skills/audit-label-coverage/`  
**Status:** ✅ Built & tested (100% unit + integration)

#### Integration Point: STEP 5 — Apply Correct Labels (With Audit)

**Required API:**
```javascript
// Get label recommendations for a single PR
getRecommendations(prNumber)
  → { number, coverage, missing, suggestions }

// Run full audit on open issues/PRs
audit(options)
  → { success, auditResult, reports, dryRun }
```

**Required Labels (Must Have):**
- `type:*` — Exactly one (bug, feature, enhancement, task, documentation, security, design, refactor, chore)
- `status:*` — Exactly one (needs-triage, in-progress, in-review, ready-for-merge, done, blocked)
- `priority:*` — Exactly one (critical, high, normal, low)
- `area:*` — At least one (ci, docs, labels, security, testing, automation, workflows, etc)

**Optional Labels:**
- `meta:*` — Meta labels (needs-changelog, has-pr, duplicate, blocked)
- `release:*` — Release scope (patch, minor, major, hotfix)

**Validation Rules:**
- ALL labels must follow family:value format from `.github/labels.yml`
- NO bare labels (bug, feature, urgent, ci, ready, etc)
- One-hot constraints enforced (only one per family for type:, status:, priority:)
- Coverage percentage calculated per issue

**Integration in Workflow:**
```javascript
// In STEP 5 of PR finalization
const recommendations = await auditSkill.getRecommendations(prNumber);

// Present to user
console.log(`Coverage: ${recommendations.coverage}%`);
console.log(`Missing families: ${recommendations.missing}`);
console.log(`Suggested labels: ${recommendations.suggestions}`);

// User applies recommendations manually (or future auto-apply)
```

---

### 3. Issue-Type Allocator Skill Integration

**Component:** `skills/issue-type-allocator/`  
**Status:** ✅ Built with 35 types & decision tree

#### Integration Point: STEP 6 — Allocate Correct Issue Type

**Decision Tree:**
```
Is something broken? → type:bug
Adding entirely new capability? → type:feature
Making existing capability better? → type:enhancement
Small, focused work? → type:task or type:chore
Large, coordinated work? → type:epic or type:story
Code quality work? → type:refactor, type:performance, type:test
Critical concerns? → type:security, type:a11y, type:audit
```

**35 Supported Types:**
- Core (5): Task, Bug, Feature, Enhancement, Chore
- Planning (2): Epic, Story
- Code Quality (3): Refactor, Performance, Test Coverage
- Critical (3): Security, A11y, Audit
- Infrastructure (4): Build/CI, Integration, Compatibility, Dependency
- Documentation (2): Documentation, Research
- Design (4): Design, Content Modelling, UI, UX Feedback
- Operations (5): Automation, AI Ops, QA, Release, Maintenance

**Integration in Workflow:**
```javascript
// In STEP 6 of PR finalization
const issueType = allocator.allocateType(prDescription, linkedIssue);

// Validate issue has correct type label
if (!linkedIssue.labels.includes(`type:${issueType}`)) {
  updateIssueLabel(linkedIssue, `type:${issueType}`);
}
```

---

### 4. Issue Agent Integration

**Component:** `scripts/automation/issue-agent/`  
**Status:** 🔄 Phase 2 skills in development (infrastructure complete)

#### Integration Point: STEP 7 & STEP 12 — Issue Lifecycle Management

**Current Phase 2 Skills (In Development):**
1. issue-creation — Create new GitHub issues
2. issue-validation — Validate issue fields
3. label-orchestration — Smart label assignment
4. milestone-mapping — Map issues to milestones
5. assignee-routing — Route to team members
6. status-tracking — Update lifecycle
7. integration-orchestrator — Coordinate all

**STEP 7 Integration — Update Linked Issue:**
```javascript
// Use Issue Agent to:
// - Update description with PR link
// - Add correct status label (in-review, ready-for-merge)
// - Add meta:has-pr label
// - Ensure correct type:* and priority:* labels
```

**STEP 12 Integration — Post-Merge Cleanup:**
```javascript
// Use Issue Agent to:
// - Close issue if work complete (state_reason: "completed")
// - Add status:done label
// - Keep issue open if remaining work
// - Add status:in-progress label
// - Add closure comment with PR number & date
```

**Infrastructure (Complete):**
- GitHub API client with retry logic (50+ tests)
- Utilities: template loader, label loader, formatters (65+ tests)
- Test fixtures: 15+ realistic issues, 50+ canonical labels, 10+ milestones
- Jest/Vitest configuration for Node environment

---

### 5. PR Agent Integration

**Component:** `agents/pr-creation-agent/` (to be renamed `pr-agent/`)  
**Status:** ✅ Built with 5 skills

#### Integration Point: STEP 10 — Merge to Develop (Using PR Agent)

**Skills Inside Agent:**
- `validate-branch-name.js` — Check branch follows naming pattern
- `route-pr-template.js` — Route to correct template
- `validate-and-apply-labels.js` — Apply matching labels
- `submit-pr.js` — Create and merge PR
- `handle-pr-errors.js` — Error recovery

**Merge Coordination:**
```javascript
// STEP 10: Merge to Develop
const result = await prAgent.mergeToDelop({
  prNumber: 123,
  strategy: 'squash' || 'merge',
  branchName: 'feat/my-feature',
  commitMessage: '[Type] PR Title (#XXXX)\n\nDescription\n\nCo-Authored-By: ...'
});

// Returns: { success, merged, branchDeleted, message }
```

**Validation Before Merge:**
- Base branch is `develop` (never `main`)
- No merge conflicts (GitHub says "Ready to merge")
- CI passing (or pre-existing failures documented)
- All review comments addressed
- Correct labels applied

---

### 6. CI Error Documentation (Structured Process)

**Component:** STEP 11 — Document Pre-Existing CI Failures  
**Status:** ✅ Process defined

**Process:**
1. Verify failure occurs on `develop` branch too (test locally)
2. Create NEW GitHub ISSUE:
   - Title: `CI: {check-name} failing on develop`
   - Type: `type:bug`
   - Labels: `type:bug`, `area:ci`, `priority:normal`
   - Description: Root cause analysis + proposed fix
3. Reference issue in PR: `Pre-existing CI failure tracked in #{issue-number}`
4. **Do NOT block PR merge** on pre-existing failures

**Future Enhancement:** CI Error Diagnosis Skill
- Automatically test failure on develop
- Extract logs & error messages
- Suggest root cause categories
- Recommend fixes from related issues
- Generate pre-filled GitHub issue

---

## Migration Path

### Step 1: Validate (Phase 1)
- Test Changelog Agent on sample PRs
- Test Label Audit recommendations
- Test Issue-Type Allocator on sample issues
- Confirm Issue Agent infrastructure works

### Step 2: Reorganize Agents (Phase 2)
- Rename `pr-creation-agent` → `pr-agent` (~50 files)
- Move `issue-agent` to `agents/` root (~30 files)
- Update all references and test

### Step 3: Integrate (Phase 3)
- Add agents to workflows
- Update PR finalization prompt
- Test end-to-end on real PRs

### Step 4: Launch & Monitor (Phase 4+)
- Deploy v2.0 workflow
- Complete Issue Agent Phase 2 skills
- Create CI Error Diagnosis Skill

---

## Testing Strategy

### Unit Tests (Per Component)
- Changelog Agent: 19 tests (100% coverage)
- Label Audit Skill: 100+ unit + integration tests
- Issue-Type Allocator: Decision tree validation
- PR Agent: 5 skill tests
- Issue Agent: Infrastructure tests (115+ tests)

### Integration Tests (Agent-to-Agent)
- Changelog Agent → Label Audit (validate then label)
- Label Audit → Issue-Type Allocator (allocate type from labels)
- Issue-Type Allocator → Issue Agent (create issue with correct type)
- Issue Agent → PR Agent (link PR to issue, merge)
- PR Agent → Issue Agent (close issue on merge)

### End-to-End Tests (Real PRs)
- Test on 5+ real PRs before deployment
- Verify:
  - Changelog entry validated
  - Labels recommended correctly
  - Issue type allocated
  - Issue lifecycle updated
  - PR merges successfully
  - Post-merge cleanup works

### Performance Tests
- Changelog validation: < 100ms per entry
- Label audit: < 50ms per issue
- Issue-Type allocation: < 10ms per issue
- Workflow execution: < 5 min total per PR

---

## Success Criteria

### Phase 1 Success
- ✅ All components tested on sample data
- ✅ No blocking issues discovered
- ✅ Team approval to proceed
- ✅ Migration timeline agreed

### Phase 2 Success
- ✅ pr-creation-agent renamed to pr-agent (merged)
- ✅ issue-agent moved to agents/ (merged)
- ✅ All ~80 references updated
- ✅ CI passing on both PRs

### Phase 3 Success
- ✅ Agents integrated into workflows (merged)
- ✅ End-to-end test passes on real PR
- ✅ v2.0 prompt deployed
- ✅ Documentation updated

### Overall Success
- ✅ Automation coverage increased to ~70%
- ✅ 5+ common workflow errors prevented
- ✅ Team trained on new workflow
- ✅ Adoption rate > 90% within 2 weeks

---

## Risk Mitigation

### Risk 1: Agent Integration Complexity
**Mitigation:** Comprehensive testing, gradual rollout, rollback plan

### Risk 2: Workflow Breaking Changes
**Mitigation:** New workflow as opt-in initially, parallel run period

### Risk 3: Developer Adoption
**Mitigation:** Clear documentation, examples, training session

### Risk 4: Changelog Agent Adoption
**Mitigation:** Auto-format by default, helpful error messages, gradual enforcement

### Risk 5: Issue Agent Delays
**Mitigation:** Use Phase 1 infrastructure, build skills iteratively, don't wait for all 7 skills

---

## References

- **Changelog Agent:** `agents/changelog/README.md`
- **Label Audit Skill:** `skills/audit-label-coverage/SKILL.md`
- **Issue-Type Allocator:** `skills/issue-type-allocator/SKILL.md`
- **PR Agent:** `agents/pr-creation-agent/`
- **Issue Agent:** `scripts/automation/issue-agent/README.md`
- **Audit Findings:** `.github/projects/active/pr-finalisation-workflow/AUDIT-FINDINGS.md`
- **Workflow Prompt:** `.github/projects/active/pr-finalisation-workflow/WORKFLOW-PROMPT.md`

---

**Last Updated:** 2026-09-04  
**Status:** Draft (Ready for Phase 1 Validation)  
**Next Review:** 2026-09-11 (after Phase 1 testing)
