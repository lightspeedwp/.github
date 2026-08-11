# Branch Naming Enforcement — Project Plan

**Project:** Branch Naming Enforcement Workflow  
**Status:** 🚀 Ready for Execution  
**Owner:** Ash Shaw  
**Created:** 2026-08-11  
**Target Completion:** 2026-08-14

## Project Phases

### Phase 1: Specification & Planning (2026-08-11)

**Goal:** Establish clear requirements, design, and GitHub issue tracking

**Deliverables:**

- ✅ SPEC.md — Detailed functional & non-functional requirements
- ✅ RFC.md — Design decisions and technical approach
- ✅ PLANNING.md — This document (execution plan)
- 🔄 GitHub Issues (5–7 linked issues, see below)
- 🔄 Interlinking & project structure

**Key Activities:**

1. Review and refine specification with team input
2. Create GitHub issues for each phase and component
3. Link issues to this project folder
4. Set up issue labels and milestones

**Estimated Effort:** 4 hours  
**Owner:** Ash Shaw  
**Deadline:** 2026-08-11 EOD

---

### Phase 2: Validation Script Implementation (2026-08-12)

**Goal:** Create reusable branch name validation script with tests

**Components:**

#### 2.1 Validation Script (`.github/scripts/validation/validate-branch-name.cjs`)

- Create Node.js script with CLI interface
- Export validation function for reuse
- Implement regex pattern for branch names
- Support `--verbose` flag for detailed output
- Support `--show-pattern` flag to display pattern
- Add clear comments explaining validation logic

**Acceptance Criteria:**

- ✅ Validates all 30+ allowed branch types
- ✅ Rejects special characters, uppercase, underscores
- ✅ Accepts valid kebab-case names
- ✅ CLI interface works with arguments
- ✅ Function exports correctly for import

**Estimated Effort:** 2 hours  
**Assigned to:** (Issue #TBD)

#### 2.2 Unit Tests

- Create `.github/scripts/validation/__tests__/validate-branch-name.test.js`
- Test 50+ valid and invalid branch names
- Test edge cases: empty string, very long names, special chars
- Test function export and CLI interface
- Aim for 100% code coverage

**Acceptance Criteria:**

- ✅ All tests pass
- ✅ >95% code coverage
- ✅ Edge cases covered

**Estimated Effort:** 3 hours  
**Assigned to:** (Issue #TBD)

**Key Decision:** Jest test runner (consistent with existing tests)

---

### Phase 3: Pre-Commit Hook (2026-08-12)

**Goal:** Create and test local pre-commit hook

**Components:**

#### 3.1 Hook Implementation (`.github/hooks/pre-commit`)

- Create bash script to validate branch name
- Call validation script from hook
- Skip validation on `main` and `develop` branches
- Skip validation on detached HEAD (rebase, merge, bisect)
- Display helpful error messages on failure
- Add setup instructions as comments

**Acceptance Criteria:**

- ✅ Hook validates valid branch names
- ✅ Hook rejects invalid branch names
- ✅ Hook allows commits on main/develop
- ✅ Hook allows commits during rebase
- ✅ Error messages are helpful

**Estimated Effort:** 2 hours  
**Assigned to:** (Issue #TBD)

#### 3.2 Hook Setup Command (npm)

- Add `npm run setup:hooks` command to `package.json`
- Script copies hook to `.git/hooks/` and sets executable permission
- Include documentation in command output

**Acceptance Criteria:**

- ✅ Command copies hook correctly
- ✅ Hook becomes executable after setup
- ✅ Help text displays setup instructions

**Estimated Effort:** 1 hour  
**Assigned to:** (Issue #TBD)

#### 3.3 Testing (macOS, Linux, Windows)

- Test hook on macOS with valid/invalid branch names
- Test hook on Ubuntu (Linux) with valid/invalid names
- Test hook on Windows (Git Bash) with valid/invalid names
- Test hook during rebase operation
- Test hook on main/develop branches
- Verify error messages display correctly

**Acceptance Criteria:**

- ✅ Hook works on all three OS platforms
- ✅ Error messages consistent across platforms
- ✅ No issues during rebase
- ✅ Setup process is simple

**Estimated Effort:** 4 hours  
**Assigned to:** (Issue #TBD)

---

### Phase 4: GitHub Actions Workflow (2026-08-13)

**Goal:** Create mandatory PR validation workflow

**Components:**

#### 4.1 Workflow Implementation (`.github/workflows/branch-name-validation.yml`)

- Create workflow triggered on `pull_request` events
- Extract branch name from PR context
- Call validation script with branch name
- Set status check result (pass/fail)
- Post comment on failure with helpful message
- Exempt `release/*` and `hotfix/*` on `main` branch

**Acceptance Criteria:**

- ✅ Workflow runs on PR open/reopen/synchronize
- ✅ Validates branch names correctly
- ✅ Sets status check result
- ✅ Posts comment on failure
- ✅ Comment includes naming rules and examples
- ✅ Exemptions work correctly

**Estimated Effort:** 2 hours  
**Assigned to:** (Issue #TBD)

#### 4.2 Workflow Testing

- Test workflow with valid branch names (should pass)
- Test workflow with invalid branch names (should fail)
- Test workflow with `release/v1.0.0` on `main` (should pass)
- Test workflow with `hotfix/critical-fix` on `main` (should pass)
- Test workflow with invalid branch on `main` (should fail)
- Verify comment is posted on failure
- Verify status check is required for merge

**Acceptance Criteria:**

- ✅ All test cases pass
- ✅ Status check enforces naming
- ✅ Comments are helpful

**Estimated Effort:** 3 hours  
**Assigned to:** (Issue #TBD)

---

### Phase 5: Documentation (2026-08-13)

**Goal:** Create comprehensive setup and troubleshooting guides

**Components:**

#### 5.1 Setup Guide (`docs/SETUP_BRANCH_VALIDATION.md` or `.github/docs/branch-validation-setup.md`)

- Clear step-by-step installation instructions
- Screenshots for macOS, Linux, Windows
- Troubleshooting common issues
- How to disable/bypass hook if needed
- Link to BRANCHING_STRATEGY.md

**Sections:**

1. Overview (what the system does)
2. Installation (npm run setup:hooks)
3. Verification (test the hook)
4. Troubleshooting
5. FAQ

**Acceptance Criteria:**

- ✅ Instructions are clear and complete
- ✅ New developers can follow without help
- ✅ Covers all three platforms
- ✅ Links to canonical sources

**Estimated Effort:** 2 hours  
**Assigned to:** (Issue #TBD)

#### 5.2 Update BRANCHING_STRATEGY.md

- Add section explaining the enforcement system
- Describe the two-layer approach
- Link to SETUP_BRANCH_VALIDATION.md
- Explain exemptions (release/hotfix)

**Acceptance Criteria:**

- ✅ Enforcement explanation is clear
- ✅ Links are correct
- ✅ Fits naturally into existing doc

**Estimated Effort:** 1 hour  
**Assigned to:** (Issue #TBD)

#### 5.3 Troubleshooting Guide

- Common issues: hook not running, validation failure messages
- How to rename a branch after violation
- How to bypass hook temporarily (--no-verify)
- How to reinstall hook
- Contact info for help

**Acceptance Criteria:**

- ✅ Covers 10+ common issues
- ✅ Solutions are actionable
- ✅ Clear and friendly tone

**Estimated Effort:** 1.5 hours  
**Assigned to:** (Issue #TBD)

---

### Phase 6: Rollout & Monitoring (2026-08-14+)

**Goal:** Deploy to production and monitor effectiveness

**Components:**

#### 6.1 Workflow Deployment

- Configure workflow as required status check in branch protection rules
- Set up notifications for validation failures
- Create dashboard to monitor violation rate

**Acceptance Criteria:**

- ✅ Workflow is required for PR merge
- ✅ Notifications working
- ✅ Monitoring dashboard active

**Estimated Effort:** 1 hour  
**Assigned to:** (Issue #TBD)

#### 6.2 Team Announcement

- Send setup instructions to team
- Explain two-layer enforcement system
- Provide link to SETUP_BRANCH_VALIDATION.md
- Answer questions

**Acceptance Criteria:**

- ✅ All team members informed
- ✅ Questions answered
- ✅ Setup adoption tracked

**Estimated Effort:** 1 hour  
**Assigned to:** (Issue #TBD)

#### 6.3 Monitoring & Feedback (2026-08-14 to 2026-08-21)

- Track hook adoption rate (target: >80% within 2 weeks)
- Monitor PR validation failure rate (target: drop to <5%)
- Collect team feedback on UX
- Address issues and edge cases

**Key Metrics:**

- Hook setup adoption rate (%)
- PR validation pass rate (%)
- Time to fix validation failure (minutes)
- User satisfaction (survey)

**Estimated Effort:** 2 hours/week  
**Assigned to:** (Issue #TBD)

---

## GitHub Issues (Linked to Project)

### Issue #TBD: [Phase 2.1] Create validation script

**Type:** Task  
**Effort:** 2 hours  
**Dependencies:** None  
**Linked To:** SPEC.md / RFC.md

---

### Issue #TBD: [Phase 2.2] Write unit tests for validation script

**Type:** Testing  
**Effort:** 3 hours  
**Dependencies:** Issue #TBD (validation script)

---

### Issue #TBD: [Phase 3.1] Create pre-commit hook

**Type:** Task  
**Effort:** 2 hours  
**Dependencies:** Issue #TBD (validation script)

---

### Issue #TBD: [Phase 3.2–3.3] Setup command & multi-platform testing

**Type:** Task  
**Effort:** 5 hours  
**Dependencies:** Issue #TBD (pre-commit hook)

---

### Issue #TBD: [Phase 4.1–4.2] GitHub Actions workflow & testing

**Type:** Task  
**Effort:** 5 hours  
**Dependencies:** Issue #TBD (validation script)

---

### Issue #TBD: [Phase 5.1–5.3] Documentation (setup guide & troubleshooting)

**Type:** Documentation  
**Effort:** 4.5 hours  
**Dependencies:** All implementation issues

---

### Issue #TBD: [Phase 6] Team rollout, deployment & monitoring

**Type:** Task  
**Effort:** 4 hours  
**Dependencies:** All previous phases

---

## Timeline & Milestones

| Phase | Start | End | Duration | Milestone |
| --- | --- | --- | --- | --- |
| 1: Spec & Planning | 2026-08-11 | 2026-08-11 | 1 day | Project kickoff |
| 2: Validation Script | 2026-08-12 | 2026-08-12 | 1 day | Implementation begins |
| 3: Pre-Commit Hook | 2026-08-12 | 2026-08-12 | 1 day | Local enforcement ready |
| 4: Workflow | 2026-08-13 | 2026-08-13 | 1 day | Cloud enforcement ready |
| 5: Documentation | 2026-08-13 | 2026-08-13 | 1 day | Setup guides complete |
| 6: Rollout | 2026-08-14+ | 2026-08-21 | 1+ week | Team adoption & monitoring |

**Total Effort:** ~30 hours (split across team)  
**Critical Path:** Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6

---

## Risk Management

### Risk: Hook breaks existing rebase workflows

**Probability:** Medium | **Impact:** High | **Severity:** 🔴 High

**Mitigation:**

- Skip validation on detached HEAD (handles rebase, merge, bisect)
- Thorough testing on rebase scenarios
- Clear documentation on how to bypass if needed (`git commit --no-verify`)

**Owner:** Phase 3 testing lead

---

### Risk: Low adoption of hook setup

**Probability:** Medium | **Impact:** Medium | **Severity:** 🟡 Medium

**Mitigation:**

- Provide workflow as mandatory backup (catches violations regardless of hook setup)
- Clear, step-by-step setup instructions
- Announcement email with setup link
- Track adoption and follow up at 2 weeks

**Owner:** Phase 6 rollout lead

---

### Risk: Validation pattern is too strict or too lenient

**Probability:** Low | **Impact:** Medium | **Severity:** 🟡 Medium

**Mitigation:**

- Extensive testing on 50+ valid/invalid branch names
- Team review of pattern before launch
- Easy to update pattern if needed (single regex location)
- Collect feedback after rollout

**Owner:** Phase 2 testing lead

---

### Risk: Windows (Git Bash) compatibility issues

**Probability:** Medium | **Impact:** Medium | **Severity:** 🟡 Medium

**Mitigation:**

- Test hook on Windows Git Bash during Phase 3
- Document any Windows-specific issues
- Provide workarounds or alternatives if needed
- Update setup guide with Windows notes

**Owner:** Phase 3 testing lead (Windows)

---

## Success Criteria (Project Level)

1. ✅ **Functional:** Hook and workflow validate correctly
2. ✅ **Coverage:** >80% of developers install hook within 2 weeks
3. ✅ **Effective:** PR validation violation rate drops from ~30% to <5%
4. ✅ **Performant:** No measurable impact on commit/push speed
5. ✅ **Usable:** Error messages are clear and helpful (>4/5 user rating)

---

## Dependencies & Resources

### Skills Required

- Bash scripting (hook implementation)
- Node.js/JavaScript (validation script, tests)
- GitHub Actions (workflow)
- Git knowledge (testing)

### Tools & Platforms

- Git 2.9+
- Node.js 18+
- GitHub Actions
- Jest (testing)
- npm

### Existing Artifacts to Reference

- `.github/workflows/main-branch-guard.yml` (workflow model)
- `npm run validate:branch-name` (existing validation)
- `.github/PULL_REQUEST_TEMPLATE/config.yml` (template routing)

---

## Post-Project Activities (Future Enhancements)

1. **Auto-suggest branch names** — When validation fails, suggest a corrected name
2. **Configurable pattern** — Load pattern from `.github/config/branch-naming.json`
3. **Slack notifications** — Post to team channel on validation failures
4. **Analytics dashboard** — Track violations by type/scope/developer
5. **Git UI integration** — Support for VS Code, GitHub Desktop branches panel

---

## Sign-Off & Approval

| Role | Name | Status | Date |
| --- | --- | --- | --- |
| Project Owner | Ash Shaw | ⏳ Pending | — |
| Tech Lead | (TBD) | ⏳ Pending | — |
| DevOps Lead | (TBD) | ⏳ Pending | — |

---

**Document Status:** 📋 Ready for Execution  
**Last Updated:** 2026-08-11  
**Next Review:** Post-Phase 1 (2026-08-11 EOD)
