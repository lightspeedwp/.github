# Implementation Plan: Issue Type & Metadata Automation Initiative

**Objective:** Automatically populate issue metadata (type, labels, assignee, project, custom fields) at creation, enforce Definition of Done across issues and PRs, and fix the silent issue reopening problem.

**Duration:** 5 weeks (July 23 — August 27, 2026)  
**Total Effort:** 37.5 hours  
**Team:** 1–2 engineers  
**Risk Level:** LOW  
**Status:** 🟢 All 12 Issues Created — Phase 1 Ready for Execution

**Epic Issue:** [#1167 — Issue Type & Metadata Automation Initiative](https://github.com/lightspeedwp/.github/issues/1167)  
**Child Issues:** [#1168–#1178](https://github.com/lightspeedwp/.github/issues?q=is%3Aissue%20milestone%3Av1.0%20milestone%3Av1.1%20%231167)

---

## Executive Summary: The Problem & Solution

### Current State (Broken)

When an issue is created by an AI agent or human:

```
❌ Issue type NOT SET (guessed from keywords, often wrong)
❌ Area/component labels NOT APPLIED
❌ Assignee NOT SET (should default to code owner)
❌ Project NOT ASSIGNED (should be .github #33)
❌ Custom fields EMPTY (7 fields undefined)
❌ GitHub bot SILENTLY REOPENS incomplete issues (confusing)
❌ DoD enforcement MISSING for issues (only PRs validated)
❌ PR merges NOT BLOCKED if linked issue incomplete
```

**Result:** Issues require manual cleanup before processing; AI agents can't create correct issues.

### Proposed Solution (Complete)

When an issue is created:

```
✅ Issue type automatically set from template selection
✅ Area/component labels inferred from body keywords
✅ Assignee defaults to code owner (from CODEOWNERS)
✅ Project assigned to .github (ID #33)
✅ Custom fields auto-populated (Risk, Impact, Domain, Team, Effort, etc.)
✅ Status set to "status:needs-triage" (ready for processing)
✅ Clear guidance if issue doesn't meet template requirements
✅ PR merges blocked if linked issue has incomplete DoD
✅ Issue cannot be closed with incomplete DoD checklist
```

**Result:** Issues ready for processing immediately; AI agents can create correct issues consistently.

---

## Implementation Approach: 3 Phases

### Phase 1: Critical Fixes (11.5 hours, Weeks 1-2)

Fix 5 blocking issues that prevent proper metadata assignment at creation.

| # | Issue | Task | Time | Status |
|----|-------|------|------|--------|
| 1.1 | [#1168](https://github.com/lightspeedwp/.github/issues/1168) | Remove non-existent label reference | 5m | 🟢 Ready |
| 1.2 | [#1169](https://github.com/lightspeedwp/.github/issues/1169) | Add missing type label aliases | 30m | 🟢 Ready |
| 1.3 | [#1170](https://github.com/lightspeedwp/.github/issues/1170) | Implement issue-body labeling rules | 3-4h | 🟢 Ready |
| 1.4 | [#1171](https://github.com/lightspeedwp/.github/issues/1171) | Fix template-enforcement silent reopening | 2-3h | 🟢 Ready |
| 1.5 | [#1172](https://github.com/lightspeedwp/.github/issues/1172) | Add issue DoD validation | 2-3h | 🟢 Ready |
| **Total** | | | **11.5h** | |

**Deliverables:**

- ✅ Non-existent label removed from governance
- ✅ Type aliases complete (feature, task, chore, refactor, ci, build, epic, epic)
- ✅ 40+ issue-body labeling rules added for all 25 templates
- ✅ Template-enforcement posts clear guidance instead of silent reopening
- ✅ Issue DoD validation prevents close with incomplete checklist
- ✅ All Phase 1 tests passing
- ✅ PR #1 merged to develop

**Branch:** `feat/issue-type-automation-phase-1`  
**Target Date:** August 3, 2026

---

### Phase 2: Enhanced Automation (15 hours, Weeks 3-4)

Add 3 enhanced features for better metadata population and enforcement.

| # | Issue | Task | Time | Status |
|----|-------|------|------|--------|
| 2.1 | [#1173](https://github.com/lightspeedwp/.github/issues/1173) | Implement PR merge blocker (DoD check) | 3-4h | ⏸️ Blocked |
| 2.2 | [#1174](https://github.com/lightspeedwp/.github/issues/1174) | Auto-populate custom fields | 4-5h | ⏸️ Blocked |
| 2.3 | [#1175](https://github.com/lightspeedwp/.github/issues/1175) | Template-aware type detection | 1-2h | ⏸️ Blocked |
| **Total** | | | **15h** | |

**Deliverables:**

- ✅ PR merge blocked if linked issue has incomplete DoD
- ✅ Custom fields auto-populated (Risk, Impact, Domain, Team, Effort, etc.)
- ✅ Type detection uses template signals (improved over keyword-only)
- ✅ All Phase 2 tests passing
- ✅ PR #2 merged to develop

**Branch:** `feat/issue-type-automation-phase-2`  
**Target Date:** August 17, 2026

---

### Phase 3: Documentation & Testing (11 hours, Weeks 4-5)

Document best practices and validate everything works end-to-end.

| # | Issue | Task | Time | Status |
|----|-------|------|------|--------|
| 3.1 | [#1176](https://github.com/lightspeedwp/.github/issues/1176) | Create AI agent issue creation guide | 2h | ⏸️ Blocked |
| 3.2 | [#1177](https://github.com/lightspeedwp/.github/issues/1177) | Update AGENTS.md with best practices | 2h | ⏸️ Blocked |
| 3.3 | [#1178](https://github.com/lightspeedwp/.github/issues/1178) | End-to-end testing & validation | 4h | ⏸️ Blocked |
| | | Documentation & review | 3h | |
| **Total** | | | **11h** | |

**Deliverables:**

- ✅ `.github/ISSUE_CREATION_GUIDE.md` created (for AI agents + humans)
- ✅ AGENTS.md updated with issue creation best practices
- ✅ Test suite covering all 12 critical workflows
- ✅ All tests passing
- ✅ PR #3 merged to develop

**Branch:** `feat/issue-type-automation-phase-3`  
**Target Date:** August 27, 2026

---

## Detailed Task Breakdown

### Phase 1: Critical Fixes

#### Fix 1.1: Remove Non-existent Label (5 minutes)

**File:** `.github/label-governance-policy.yml`  
**Problem:** `comp:help-tabs` listed as never_delete but doesn't exist in labels.yml  
**Solution:** Remove the line from governance (line 61)  
**Effort:** 5 minutes

**Steps:**

1. Open `.github/label-governance-policy.yml`
2. Find and remove `- comp:help-tabs` from `never_delete_labels` (line 61)
3. Run: `npm run validate:labeling-config`
4. Verify no errors
5. Commit + push

**Test:** Label validation passes

---

#### Fix 1.2: Add Missing Type Label Aliases (30 minutes)

**File:** `.github/labels.yml`  
**Problem:** 8 type labels lack aliases (feature, task, chore, refactor, ci, build, epic, epic)  
**Solution:** Add aliases for each label so bare labels are migrated/preserved  
**Effort:** 30 minutes

**Changes:**

```yaml
- name: type:feature
  aliases:
    - feature
    - feat
    - enhancement
    - feature-request

# ... repeat for task, chore, refactor, ci, build, epic (8 total)
```

**Steps:**

1. Open `.github/labels.yml`
2. Find each type label
3. Add aliases array with common alternatives
4. Verify YAML is valid
5. Run: `npm run validate:labeling-config`
6. Commit + push

**Test:** Label alias migration works (bare labels preserved)

---

#### Fix 1.3: Implement Issue-Body Labeling Rules (3-4 hours)

**File:** `.github/labeler.yml`  
**Problem:** No automation for issue template → type label mapping  
**Solution:** Add `issues:` section with 40+ body-pattern rules  
**Effort:** 3-4 hours

**What to add:**

- Type detection: 32 types (bug, feature, task, epic, story, etc.)
- Area detection: 20+ areas (block-editor, theme, ci, etc.)
- Component detection: 20 components
- Priority inference: bug→high, security→critical, task→normal
- Status labels: needs-review, needs-design
- Template compliance signals

**Rules:**

```yaml
issues:
  - body-contains:
      - regex: 'bug|defect|error|crash'
      - weight: 10
    label: type:bug
  
  - body-contains:
      - regex: 'feature|enhancement|new capability'
      - weight: 10
    label: type:feature
  
  # ... continue for all 32 types
  
  - body-contains:
      - regex: 'block-editor|gutenberg|blocks'
      - weight: 10
    label: area:block-editor
  
  # ... continue for all 20+ areas
```

**Steps:**

1. Open `.github/labeler.yml`
2. Add `issues:` section after `pull_requests:`
3. Add rules for types (32), areas (20+), components (20), priority, status
4. Test with sample issues (create test issues in .github repo)
5. Verify labels applied correctly
6. Commit + push

**Test:** 5-10 test issues created; all get correct labels

---

#### Fix 1.4: Fix Template-Enforcement Silent Reopening (2-3 hours)

**File:** `.github/workflows/template-enforcement.yml`  
**Problem:** Bot silently reopens incomplete issues (confusing UX)  
**Solution:** Post detailed guidance instead; add label; don't reopen  
**Effort:** 2-3 hours

**Current problematic code (lines 211-221):**

```javascript
if (missingSections.length > 0) {
  await github.rest.issues.update({
    state: 'open',  // ← SILENT REOPEN
  });
}
```

**New behavior:**

- POST detailed comment explaining what's missing
- ADD label `status:needs-template-fix`
- DO NOT REOPEN (let user decide)
- Add `meta:force-close` escape hatch

**Steps:**

1. Open `.github/workflows/template-enforcement.yml`
2. Find the "enforce-close-guard" job (lines 160-268)
3. Replace silent reopen with:
   - Detailed comment listing missing sections
   - Label assignment (`status:needs-template-fix`)
   - No reopen (remove `state: 'open'`)
   - Add force-close logic (check for `meta:force-close` label)
4. Test with incomplete issues (manually close; verify comment posted)
5. Commit + push

**Test:** Incomplete issue closed; bot posts guidance + label (doesn't reopen)

---

#### Fix 1.5: Add Issue DoD Validation (2-3 hours)

**File:** `.github/workflows/validate-issue-dod-before-close.yml` (NEW)  
**Problem:** Issues can close with incomplete DoD checklist  
**Solution:** Create workflow to prevent close unless all DoD items checked  
**Effort:** 2-3 hours

**Logic:**

1. Trigger: `issues.closed`
2. Extract DoD section from issue body
3. Count unchecked items (`- [ ]`)
4. If unchecked items exist AND no `meta:force-close` label:
   - Reopen issue
   - Post comment listing incomplete items
   - Add label `status:incomplete-dod`
5. Otherwise: Allow close

**Steps:**

1. Create `.github/workflows/validate-issue-dod-before-close.yml`
2. Add trigger: `issues.closed`
3. Write job:
   - Parse issue body for DoD section
   - Extract checklist items
   - Check for unchecked items
   - Check for `meta:force-close` label
   - If incomplete: reopen + comment + label
   - Otherwise: allow
4. Test with incomplete issue (try to close; verify reopened)
5. Test with complete issue (should close normally)
6. Test with `meta:force-close` (should close despite incomplete DoD)
7. Commit + push

**Test:** 3 test scenarios passing

---

### Phase 2: Enhanced Automation

#### Feature 2.1: PR Merge Blocker (DoD Check) (3-4 hours)

**File:** `.github/workflows/validate-linked-issue-dod-on-pr.yml` (NEW)  
**Problem:** PR merges even if linked issue has incomplete DoD  
**Solution:** Create workflow to block PR merge if linked issue incomplete  
**Effort:** 3-4 hours

**Logic:**

1. Trigger: PR open/sync/ready_for_review
2. Parse PR body for linked issues (`closes #123`, `fixes #456`)
3. For each linked issue:
   - Fetch issue details
   - Extract DoD section
   - Count unchecked items
   - If unchecked items: fail status + post comment
4. Block merge if any linked issue incomplete

**Steps:**

1. Create `.github/workflows/validate-linked-issue-dod-on-pr.yml`
2. Write job:
   - Parse linked issues from PR body
   - For each: check DoD completion
   - Set commit status (FAILURE if incomplete)
   - Post PR comment with details
3. Wire to branch protection rule (require passing check)
4. Test with PR linking incomplete issue (merge blocked)
5. Test with PR linking complete issue (merge allowed)
6. Commit + push

**Test:** 2 scenarios passing (merge blocked, merge allowed)

---

#### Feature 2.2: Auto-Populate Custom Fields (4-5 hours)

**File:** `.github/workflows/populate-custom-fields-on-create.yml` (NEW)  
**Problem:** 7 custom fields empty on issue creation  
**Solution:** Create workflow to infer & populate fields  
**Effort:** 4-5 hours

**Fields to auto-populate:**

- Risk: High (security), Medium (bug), Low (other)
- Customer Impact: High (bug/critical), Medium (feature), Low (task)
- Technical Impact: Same as Customer Impact
- Domain: Inferred from area label (theme→wordpress-block-theme, etc.)
- Team: Inferred from area label (block-editor→Blocks, ci→DevOps, etc.)
- Effort: Estimated from type + body length (epic=8-13, story=5-8, task=2-3, etc.)
- Spec Link: Extract from issue body (if present)

**Steps:**

1. Create `.github/workflows/populate-custom-fields-on-create.yml`
2. Write job:
   - Trigger: `issues.opened`
   - Parse issue labels
   - Infer custom field values based on type, area, keywords
   - Call GitHub GraphQL API to set fields
3. Test with 5-10 issues (different types) — verify fields populated
4. Commit + push

**Test:** 5 test issues; all have custom fields populated correctly

---

#### Feature 2.3: Template-Aware Type Detection (1-2 hours)

**File:** `.github/workflows/issues.yml` (ENHANCE)  
**Problem:** Type detection keyword-only; ignores template selection  
**Solution:** Improve to detect from template signals (better accuracy)  
**Effort:** 1-2 hours

**Current logic (keyword-only):**

```javascript
const typeFromKeywords = detectTypeFromKeywords(issue.body);
// Falls back to type:task if nothing matches
```

**New logic (template-aware):**

```javascript
// 1. Check if issue body contains template signature
const templateMatch = issue.body?.match(/Created from:\s+(.+?)\.md/);
if (templateMatch) {
  // Map template to type (bug.md → type:bug)
  typeLabel = templateToType[templateMatch[1]];
}

// 2. Fall back to keywords if no template signal
if (!typeLabel) {
  typeLabel = detectTypeFromKeywords(issue.body);
}

// 3. Final fallback
if (!typeLabel) {
  typeLabel = 'type:task';
}
```

**Steps:**

1. Open `.github/workflows/issues.yml`
2. Find type detection logic (issues.agent.js)
3. Add template signature detection
4. Improve keyword detection fallback
5. Test with issues created from different templates
6. Commit + push

**Test:** 5 test issues (different templates); correct types assigned

---

### Phase 3: Documentation & Testing

#### Task 3.1: Create AI Agent Issue Creation Guide (2 hours)

**File:** `.github/ISSUE_CREATION_GUIDE.md` (NEW)  
**Content:**

- What fields are required vs optional
- Which fields are auto-populated vs manual
- Template selection guide (25 templates)
- Keyword mapping (labels that will be auto-applied)
- Custom field inference rules
- Examples for each issue type
- Validation checklist
- Common mistakes + how to avoid them

**Steps:**

1. Create `.github/ISSUE_CREATION_GUIDE.md`
2. Write sections as outlined
3. Include examples for bug, feature, epic, task, etc.
4. Link to issue templates
5. Commit + push

**Test:** Documentation review (tech lead, 1 other engineer)

---

#### Task 3.2: Update AGENTS.md (2 hours)

**File:** `.github/AGENTS.md` (ADD SECTION)  
**Content:**

- "Issue Creation Best Practices for LLMs"
- Required sections (DoR, DoD)
- Template selection (which template for which issue type)
- Keyword inclusion for label inference
- Custom field population (what gets inferred)
- Acceptance criteria format
- Common gotchas + solutions

**Steps:**

1. Open `.github/AGENTS.md`
2. Add new section "Issue Creation Best Practices"
3. Include all guidance above
4. Link to ISSUE_CREATION_GUIDE.md
5. Commit + push

**Test:** Documentation review

---

#### Task 3.3: End-to-End Testing & Validation (4 hours)

**Test Matrix:**

| Test Case | Setup | Expected | Validate |
|-----------|-------|----------|----------|
| Bug from template | Create bug.md issue | type:bug, priority:high | Labels correct |
| Feature from template | Create feature.md issue | type:feature, area:* | Labels correct |
| Epic from template | Create epic.md issue | type:epic | Labels correct |
| Custom fields (bug) | Create bug issue | Risk=Medium, Impact=Medium | Fields populated |
| DoD enforcement (issue) | Create issue, try to close with unchecked DoD | Issue reopens | Close blocked |
| Force-close | Add meta:force-close, close issue | Issue closes | Override works |
| PR merge blocker | Create PR linking incomplete issue | Merge blocked | Merge prevented |
| PR merge allowed | Create PR linking complete issue | Merge allowed | Merge works |
| Type detection (template) | Create from feature.md with "bug" in body | type:feature | Template wins |
| Custom fields (epic) | Create epic issue | Effort=8-13 | Auto-estimated |

**Steps:**

1. Create 10+ test issues in .github repo (or test repo)
2. Run through each test case
3. Verify expected outcome
4. Document results
5. Commit test results
6. Flag any issues for fixing

**Test:** All 10+ tests passing

---

## Timeline & Resource Allocation

### Week 1 (July 23-27)

- **Mon-Tue:** Fix 1.1 (5m) + Fix 1.2 (30m) = 35m total
- **Wed-Thu:** Begin Fix 1.3 (issue labeling rules)
- **Fri:** Wrap Fix 1.3; code review; merge if ready

**Assignee:** 1 engineer (5 hours)

### Week 2 (July 30–Aug 3)

- **Mon-Tue:** Fix 1.3 continuation + Fix 1.4 (template-enforcement)
- **Wed-Thu:** Fix 1.4 + Fix 1.5 (DoD validation)
- **Fri:** Phase 1 testing; code review; merge PR #1

**Assignee:** 1 engineer (15 hours)

### Week 3 (Aug 6-10)

- **Mon-Tue:** Feature 2.1 (PR merge blocker)
- **Wed-Thu:** Feature 2.2 (custom field population)
- **Fri:** Code review; prepare Phase 2 PR

**Assignee:** 1 engineer (12 hours)

### Week 4 (Aug 13-17)

- **Mon:** Feature 2.2 continuation
- **Tue-Wed:** Feature 2.3 (template-aware type detection)
- **Thu:** Merge PR #2
- **Thu-Fri:** Begin Phase 3 (documentation)

**Assignee:** 1 engineer (12 hours)

### Week 5 (Aug 20-27)

- **Mon-Tue:** Phase 3 documentation (guidance + AGENTS.md)
- **Wed-Fri:** Testing & validation; code review; merge PR #3

**Assignee:** 1 engineer (11 hours)

**Total:** ~37.5 hours | 1 engineer over 5 weeks (7.5 hrs/week average)

---

## Success Criteria

### Phase 1 ✅

- [ ] Non-existent label removed from governance
- [ ] Type aliases added (8 labels with aliases)
- [ ] Issue-body labeling rules added (40+ patterns)
- [ ] Template-enforcement posts clear guidance (no silent reopen)
- [ ] Issue DoD validation prevents close with unchecked items
- [ ] All Phase 1 tests passing (10+ scenarios)
- [ ] PR #1 merged to develop

### Phase 2 ✅

- [ ] PR merge blocker working (blocks if linked issue incomplete)
- [ ] Custom fields auto-populated (7 fields, 5+ test issues)
- [ ] Template-aware type detection enabled (template signal wins)
- [ ] All Phase 2 tests passing (5+ scenarios)
- [ ] PR #2 merged to develop

### Phase 3 ✅

- [ ] ISSUE_CREATION_GUIDE.md created (comprehensive)
- [ ] AGENTS.md updated (best practices section)
- [ ] End-to-end test suite passing (10+ scenarios)
- [ ] Documentation reviewed (tech lead + 1 other)
- [ ] PR #3 merged to develop

### Overall Success ✅

- ✅ Issues created by AI agents have correct metadata at creation
- ✅ Issue type applied from template selection (not guessed from keywords)
- ✅ All custom fields auto-populated (Risk, Impact, Domain, Team, Effort, etc.)
- ✅ All 158 labels protected in governance policy
- ✅ No silent issue reopening (clear guidance provided)
- ✅ DoD enforced on both issues and PRs
- ✅ PR merges blocked if linked issues incomplete
- ✅ Documented best practices for all contributors
- ✅ Test coverage comprehensive (12+ critical scenarios)
- ✅ Zero regressions in existing workflows

---

## Risk Assessment & Mitigation

### Risk 1: Breaking Existing Issues

**Impact:** HIGH | **Likelihood:** LOW  
**Mitigation:**

- Add `meta:legacy-issue` label to pre-rollout issues
- Exclude legacy issues from DoD enforcement
- Test with sample legacy issues first

### Risk 2: Over-Aggressive Labeling

**Impact:** MEDIUM | **Likelihood:** MEDIUM  
**Mitigation:**

- Use weighted/confidence rules
- Require manual review for ambiguous cases
- Log all inferences for audit

### Risk 3: Custom Field Inference Errors

**Impact:** MEDIUM | **Likelihood:** LOW  
**Mitigation:**

- Provide sensible defaults (fields can be manually updated)
- Log inferences for audit
- Include explanation comment in issue body

### Risk 4: Workflow Performance (too many checks)

**Impact:** MEDIUM | **Likelihood:** LOW  
**Mitigation:**

- Optimize API calls (batch where possible)
- Monitor execution times
- Set SLAs for workflow runtime

### Risk 5: Label Governance Decisions (109 unprotected labels)

**Impact:** MEDIUM | **Likelihood:** MEDIUM  
**Mitigation:**

- Audit & classify all 109 labels (in progress via Phase 1)
- Decide on protection strategy in parallel
- Block destructive cleanup until decided

---

## Validation & Testing Strategy

### Unit Testing

- Individual workflow jobs tested in isolation
- Rule matching tested with sample issues
- Custom field inference tested with various issue types

### Integration Testing

- End-to-end workflow testing (issue creation → label → field → PR merge)
- Cross-workflow testing (labeling → enforcement → blocking)
- Test with actual .github repo issues (sandbox approach)

### Regression Testing

- Existing issue creation workflows still work
- Existing labeling still works
- Existing PR validation still works
- No unintended side effects

### Test Coverage Matrix

- ✅ 12+ critical scenarios (see Phase 3 test matrix)
- ✅ All 5 critical fixes validated
- ✅ All 3 enhanced features validated
- ✅ No regressions in existing features

---

## Deployment & Rollout

### Phase 1 Deployment (Aug 3)

- Merge PR #1 to develop
- Triggers: Standard develop → main release cycle
- No special gates needed (isolated config changes)

### Phase 2 Deployment (Aug 17)

- Merge PR #2 to develop
- Same process as Phase 1

### Phase 3 Deployment (Aug 27)

- Merge PR #3 to develop
- Include documentation + test results

### Post-Deployment

- Monitor workflows for 1 week (watch for execution errors)
- Gather feedback from team
- Iterate on rules/inferences if needed

---

## Success Metrics (Post-Deployment)

**Measure at 1 week, 2 weeks, 1 month:**

1. **Issue Creation Accuracy**
   - % of issues with correct type label (target: 95%+)
   - % of issues with correct area/component (target: 90%+)
   - % of issues with custom fields populated (target: 95%+)

2. **PR-to-Issue Sync**
   - % of PRs that properly block on linked issue DoD (target: 100%)
   - % of silent issue reopenings (target: 0%)
   - User satisfaction with guidance (target: 4.5+/5)

3. **Issue Closure Rate**
   - % of issues successfully closed (no unexpected reopening)
   - Average cycles until successful close (target: <2)

4. **Team Productivity**
   - Time saved on manual issue metadata assignment (estimated 15-30 min/issue)
   - Reduction in GitHub issues about "bot keeping my issue open" (target: 0 new)

---

## Key Contacts & Escalation

**Project Owner:** Ash Shaw (<ashley@lightspeedwp.agency>)

**Technical Lead:** (TBD — assign for code review)

**Phase 1 Engineer:** (TBD)  
**Phase 2 Engineer:** (TBD)  
**Phase 3 Engineer:** (TBD)

**Escalation Path:**

- Workflow issues → Tech Lead
- Design questions → Ash Shaw
- Blockers → Ash Shaw + Tech Lead

---

## References & Related Documentation

### Audit Reports (Complete Details)

- `.github/reports/issue-management/audit-2026-07-23-comprehensive.md`
- `.github/reports/issue-management/solution-design-2026-07-23.md`

### Configuration Files (To Be Updated)

- `.github/labels.yml` (158 labels)
- `.github/labeler.yml` (40+ rules)
- `.github/issue-types.yml` (32 issue types)
- `.github/issue-fields.yml` (7 custom fields)
- `.github/label-governance-policy.yml` (label protection)

### Workflows (To Be Created/Updated)

- `.github/workflows/issues.yml` (enhance type detection)
- `.github/workflows/labeling.yml` (reference)
- `.github/workflows/template-enforcement.yml` (fix reopening)
- `.github/workflows/validate-issue-dod-before-close.yml` (NEW)
- `.github/workflows/validate-linked-issue-dod-on-pr.yml` (NEW)
- `.github/workflows/populate-custom-fields-on-create.yml` (NEW)

### Documentation (To Be Created)

- `.github/ISSUE_CREATION_GUIDE.md` (NEW)
- `.github/AGENTS.md` (section added)
- `.github/projects/active/issue-type-workflow-automation/` (project index)

---

## Checklist Before Phase 1 Start

- [ ] Audit reports reviewed (tech lead + stakeholders)
- [ ] Solution design approved
- [ ] Phase 1 engineer assigned
- [ ] Project folder created in `.github/projects/active/`
- [ ] Epic issue created in GitHub
- [ ] Child issues created in GitHub
- [ ] This IMPLEMENTATION_PLAN.md shared with team
- [ ] Team standup to review timeline
- [ ] Any blockers identified and resolved

---

**Document Status:** ✅ READY FOR EXECUTION  
**Last Updated:** 2026-07-23  
**Target Phase 1 Start:** 2026-07-24  
**Target Phase 1 Complete:** 2026-08-03
