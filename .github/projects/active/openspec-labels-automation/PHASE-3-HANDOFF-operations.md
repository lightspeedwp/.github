# Phase 3 Handoff: Workflow Orchestration & Automated Phase Progression

**Status:** Ready for Phase 3  
**Previous Phase:** Phase 2 (Template Validation & Auto-Injection) — COMPLETE ✅  
**Branch:** `feat/openspec-labels-phase2`  
**Target Completion:** 2026-08-25 (estimated)

---

## What Phase 2 Delivered

Phase 2 is **100% complete** and provides:

### Core Assets

- **Template System** (`scripts/automation/dor-dod-templates.js`)
  - 17 issue-type-specific DoR/DoD templates
  - Detection functions for existing sections
  - Mapping from labels to templates

- **Validation & Injection** (`scripts/automation/validate-inject-dor-dod.js`)
  - Batch processing capability (configurable up to 300 issues)
  - Type-aware template injection
  - Dry-run mode for safe preview
  - Statistics reporting

- **Test Suite** (43/43 tests passing ✅)
  - Template structure validation
  - Detection function tests
  - Integration scenarios
  - Edge case coverage

- **GitHub Actions Workflow** (`validate-dor-dod-sections.yml`)
  - Daily scheduled execution (8 AM UTC)
  - Manual trigger support
  - Dry-run and apply modes
  - Batch size customization

### Current Status

✅ All Phase 2 deliverables complete  
✅ Code is production-ready  
✅ Documentation is comprehensive  
✅ Ready for Phase 3 implementation  

---

## Phase 3 Overview: Workflow Orchestration

**Objective:** Implement continuous label syncing and automated phase progression based on issue events.

### Phase 3 Scope

#### Task 3.1: Event-Driven Label Syncing

- Listen for issue events (created, labeled, reopened, closed)
- Automatically sync related labels (openspec:*, status:*, type:*)
- Validate label combinations
- Report conflicts or issues

**Key Function:**

```javascript
syncLabelsOnIssueEvent(issue, event) {
  // Ensure consistency with labels.yml canonical set
  // Update status labels based on openspec labels
  // Validate no conflicting labels
}
```

#### Task 3.2: Automated Phase Progression

- Track issue through specification/implementation lifecycle
- Auto-advance labels: pending → in-progress → complete
- Trigger on PR link, commit reference, or manual label change
- Report progression timeline

**Label Progression:**

```
openspec:specification-pending
    ↓ (PR opened or `status:in-progress` added)
openspec:specification-in-progress
    ↓ (PR merged or manual label change)
openspec:specification-complete
    ↓
openspec:implementation-pending
    ↓ (PR opened)
openspec:implementation-in-progress
    ↓ (PR merged)
openspec:implementation-complete
```

#### Task 3.3: GitHub Actions Triggers

- Issue created: Check for missing DoR/DoD (Phase 2)
- Issue labeled: Validate label combinations
- PR opened: Link to issue, sync labels
- PR merged: Advance phase if in lifecycle
- Issue closed: Finalize phase progression

#### Task 3.4: Workflow Testing

Create 10+ test scenarios:

1. New issue without type label
2. Label addition triggers sync
3. PR link triggers phase advance
4. Conflict detection (incompatible labels)
5. Progression timeline tracking
6. Multiple issues in same PR
7. Issue with no openspec labels (non-spec work)
8. Phase rollback (label removed)
9. Concurrent label changes
10. Missing issue link on PR

#### Task 3.5: Team Rollout & Training

- Internal documentation
- Team announcement
- Training walkthrough
- Q&A session
- Monitoring and feedback

---

## Files to Review Before Starting Phase 3

### Phase 2 Documentation

- `.github/projects/active/openspec/PHASE-2-TEMPLATE-VALIDATION.md` — Full Phase 2 overview
- `PHASE-2-SUMMARY.md` — Completion summary (this session)
- `scripts/automation/dor-dod-templates.js` — Template structure (reference for label patterns)

### Related Phase 1 Documentation

- `.github/projects/active/openspec/README.md` — OpenSpec project overview
- `.github/labels.yml` (lines 336-356) — OpenSpec label definitions
- `PR #1985` — Phase 1 implementation (reference)

### Reference Files

- `.github/ISSUE_TEMPLATE/*.md` — Issue templates (DoR/DoD structures)
- `scripts/automation/auto-update-all.js` — Phase 1 batch processing (reference for patterns)

---

## Key Decisions & Patterns

### Design Decisions from Phase 2

1. **Template-Driven Approach**
   - Centralized template mapping in `dor-dod-templates.js`
   - Type detection from GitHub labels (not title)
   - Reason: Maintainable, testable, type-safe

2. **Dry-Run First**
   - All scripts default to safe preview mode
   - Statistics reporting before changes
   - Reason: Safety, transparency, debugging

3. **Batch Processing**
   - Process multiple issues in one run
   - Configurable limits (--limit flag)
   - Reason: Efficient, scalable

4. **Comprehensive Testing**
   - 43+ tests for Phase 2
   - Target 50+ tests for Phase 3
   - Reason: Confidence, regression prevention

### Phase 3 Patterns (Recommended)

1. **Event-Driven Architecture**
   - GitHub Actions as event source
   - Each event type triggers specific handler
   - Reason: Clean separation, testable

2. **Label State Machine**
   - Define valid state transitions
   - Validate before each change
   - Reason: Prevents invalid states

3. **Audit Trail**
   - Log all label changes with timestamps
   - Track who changed what when
   - Reason: Debugging, compliance

---

## Technical Setup

### Environment

- Node.js 20 (verified in Phase 2)
- npm dependencies: `js-yaml` (labels.yml parsing)
- GitHub CLI (`gh`) for API calls
- GitHub Actions for orchestration

### API Usage

```javascript
// Fetch issues/PRs
gh issue list --repo owner/repo --state open --json number,title,labels,body

// Get issue details
gh issue view <number> --repo owner/repo --json labels,body

// Update labels
gh issue edit <number> --repo owner/repo --add-label "openspec:*"

// Get PR commits
gh pr view <number> --repo owner/repo --json commits,title

// Get related issues from PR description
// Parse "Resolves #123" or "Related: #456" from body
```

### Rate Limiting

- GitHub API: 5,000 requests/hour (authenticated)
- Plan for 100-300 issues per run
- Batch in groups of 10-20 for safety

---

## Code Structure Recommendation

```
scripts/automation/
├── dor-dod-templates.js (Phase 2)
├── validate-inject-dor-dod.js (Phase 2)
├── sync-labels-on-event.js (NEW - Phase 3)
├── orchestrate-phase-progression.js (NEW - Phase 3)
├── handlers/ (NEW - Phase 3)
│   ├── handle-issue-created.js
│   ├── handle-issue-labeled.js
│   ├── handle-pr-opened.js
│   ├── handle-pr-merged.js
│   └── handle-issue-closed.js
├── __tests__/
│   ├── dor-dod-validation.test.js (Phase 2)
│   └── phase-progression.test.js (NEW - Phase 3)
└── includes/ (NEW - Phase 3)
    ├── phase-state-machine.js
    ├── label-validator.js
    └── audit-logger.js
```

---

## Testing Strategy for Phase 3

### Unit Tests (20+ tests)

- Label validation logic
- State machine transitions
- Event parsing
- Conflict detection

### Integration Tests (15+ tests)

- Multi-step workflows (PR → merge → label advance)
- Event sequence handling
- Label combination validation
- Concurrent changes

### Scenario Tests (15+ tests)

- 10+ use cases from "Workflow Testing" above
- Edge cases (no labels, unknown states)
- Error recovery

### Total Target: 50+ tests (all passing ✅)

---

## Success Criteria for Phase 3

- [ ] Event handlers working for all 5 GitHub event types
- [ ] Phase progression automatically advancing labels
- [ ] Label validation preventing invalid combinations
- [ ] 50+ tests passing (100%)
- [ ] Audit trail logging all changes
- [ ] Documentation complete
- [ ] Team training completed
- [ ] No critical issues in production testing

---

## Estimated Timeline for Phase 3

**Week of 2026-08-25:**

- Mon-Tue (2 days): Event handler implementation & testing
- Wed (1 day): Phase progression & conflict detection
- Thu-Fri (2 days): Workflow testing & documentation
- Next week (1-2 days): Team rollout & training

**Total Estimate:** 5-8 days (1-1.5 weeks)

---

## Questions for Phase 3 Session Start

1. Should phase progression be automatic or require approval?
   - *Recommendation: Automatic for low-risk advances (pending→in-progress), manual for rollbacks*

2. How should label conflicts be handled?
   - *Recommendation: Warn user, don't auto-remove, require manual intervention*

3. Should closed issues have their openspec labels preserved?
   - *Recommendation: Yes, preserve for historical tracking*

4. What's the frequency for label syncing?
   - *Recommendation: Event-driven (immediate) for GitHub events, daily reconciliation*

---

## References & Links

**Phase 2 Completion:**

- Summary: `PHASE-2-SUMMARY.md` (this session)
- Full Details: `.github/projects/active/openspec/PHASE-2-TEMPLATE-VALIDATION.md`
- Tests: `npm test -- scripts/automation/__tests__/dor-dod-validation.test.js`

**Phase 1 Reference:**

- PR #1985: OpenSpec Status Labels (<https://github.com/lightspeedwp/.github/pull/1985>)
- Issue #1943: Epic (<https://github.com/lightspeedwp/.github/issues/1943>)

**Related Issue:**

- Create GitHub issue for Phase 3 epic (link here after created)

---

## Ready for Phase 3 ✅

Phase 2 foundation is solid:

- ✅ Template system complete
- ✅ Testing patterns established
- ✅ GitHub Actions workflow ready
- ✅ Documentation comprehensive
- ✅ Code is production-ready

**Next step:** Start Phase 3 implementation with event handlers and label orchestration.

---

**Session Completed:** 2026-08-18  
**Branch:** `feat/openspec-labels-phase2`  
**Status:** Ready for PR → Code Review → Merge  
**Next Session:** Phase 3 Implementation (estimated start: 2026-08-21)
