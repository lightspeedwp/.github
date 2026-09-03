# Copilot Branch Enforcement Implementation Project

**Status:** 🟡 Planning  
**Created:** 2026-09-03  
**Target Completion:** 2026-09-10  
**Priority:** 🔴 High  

---

## Project Overview

Extend GitHub Copilot integration to enforce your repository's branch naming strategy (`{type}/{scope}-{title}`) at session creation, not just at PR validation.

**Current State:** Post-PR validation only ✅  
**Target State:** Pre-session enforcement ✅  

---

## Problem Statement

Your `.github` repository has **excellent post-PR branch validation** via:
- ✅ `branch-name-validation.yml` (validates on PR)
- ✅ `validate-branch-name.cjs` (373 lines, 34 types supported)
- ✅ Clear error messages and documentation

**But GitHub Copilot doesn't know about these rules.** When Copilot creates a new session, it may suggest invalid branch names like:
- `claude/my-feature` ❌ (forbidden prefix)
- `copilot/fix-bug` ❌ (forbidden prefix)
- `Feature/MyBranch` ❌ (uppercase not allowed)

**Result:** Developers create invalid branches locally, discover the issue only when they push to PR, and must rename branches and recreate PRs.

---

## Solution

Add **3 enforcement layers** to catch invalid branches earlier:

1. **Copilot App Config** (`.github/github-app.yml`) — Enforce at session creation
2. **Pre-Commit Hook** (`.husky/prepare-commit-msg`) — Warn when committing
3. **npm Script** (`npm run validate:branch`) — Manual validation anytime

---

## Success Criteria

- ✅ Copilot enforces branch naming pattern on session creation
- ✅ Pre-commit hook warns developers if on invalid branch
- ✅ `npm run validate:branch` command available and documented
- ✅ Forbidden prefixes (`claude/`, `copilot/`, `openai/`) explicitly rejected in code
- ✅ All tests pass (including new forbidden prefix tests)
- ✅ Documentation updated with Copilot session guidelines
- ✅ Zero regressions to existing validation workflows

---

## Implementation Tasks

### Phase 1: Core Configuration (2 days)

- [ ] **Task 1.1:** Create `.github/github-app.yml`
  - Pattern: `^(feat|fix|...)/{scope}-{title}$`
  - Forbidden prefixes: `claude/`, `copilot/`, `openai/`
  - Error message with examples
  - **Owner:** @user  
  - **Effort:** 1 hour  

- [ ] **Task 1.2:** Create `.husky/prepare-commit-msg` hook
  - Calls `validate-branch-name.cjs --verbose`
  - Non-blocking (warns, doesn't fail)
  - Suggests `npm run validate:branch` command
  - **Owner:** @user  
  - **Effort:** 30 minutes  

- [ ] **Task 1.3:** Add npm scripts to `package.json`
  - `npm run validate:branch`
  - `npm run validate:branch:show-pattern`
  - **Owner:** @user  
  - **Effort:** 15 minutes  

### Phase 2: Validation Enhancement (1 day)

- [ ] **Task 2.1:** Update `scripts/validation/validate-branch-name.cjs`
  - Add explicit forbidden prefix check
  - Add to exported constants
  - Improve error message for forbidden prefixes
  - **Owner:** @user  
  - **Effort:** 1 hour  

- [ ] **Task 2.2:** Add tests for forbidden prefixes
  - Test `claude/` rejection
  - Test `copilot/` rejection
  - Test `openai/` rejection
  - Verify error message contains useful info
  - **Owner:** @user  
  - **Effort:** 1 hour  

### Phase 3: Documentation & Communication (1 day)

- [ ] **Task 3.1:** Update `.github/custom-instructions.md`
  - Add "Copilot Sessions & Branch Naming" section
  - List all 34 allowed types
  - Provide valid/invalid examples
  - Link to strategy guide
  - **Owner:** @user  
  - **Effort:** 1 hour  

- [ ] **Task 3.2:** Update DEVELOPMENT.md or create guide
  - Document new npm script
  - Explain pre-commit hook behavior
  - Provide troubleshooting steps
  - **Owner:** @user  
  - **Effort:** 1 hour  

- [ ] **Task 3.3:** Update CHANGELOG.md
  - Document new enforcement rules
  - Link to PR/issue
  - **Owner:** @user  
  - **Effort:** 30 minutes  

### Phase 4: Testing & Validation (1 day)

- [ ] **Task 4.1:** Local validation testing
  - Test with valid branch: `feat/test-feature`
  - Test with invalid branch: `claude/test`
  - Test with forbidden prefix: `copilot/my-feature`
  - Verify pre-commit hook runs
  - **Owner:** @user  
  - **Effort:** 1 hour  

- [ ] **Task 4.2:** Workflow validation testing
  - Create PR with valid branch name
  - Create PR with invalid branch name
  - Verify both workflows pass/fail as expected
  - Check for regressions
  - **Owner:** @user  
  - **Effort:** 1.5 hours  

- [ ] **Task 4.3:** Run all tests
  - `npm test` passes
  - No new failures introduced
  - All edge cases covered
  - **Owner:** @user  
  - **Effort:** 30 minutes  

### Phase 5: Merge & Deployment (1 day)

- [ ] **Task 5.1:** Create pull request
  - Link to this issue
  - Summary of changes
  - Reference implementation plan
  - **Owner:** @user  
  - **Effort:** 1 hour  

- [ ] **Task 5.2:** Code review & approval
  - At least 1 approval required
  - Address any feedback
  - **Owner:** @reviewer  
  - **Effort:** 2 hours  

- [ ] **Task 5.3:** Merge to develop
  - Squash merge for linear history
  - Add co-author trailer
  - Delete feature branch
  - **Owner:** @user  
  - **Effort:** 30 minutes  

---

## Files to Create/Modify

### Create (New)
```
.github/github-app.yml
.husky/prepare-commit-msg
.github/projects/active/copilot-branch-enforcement-2026-09-03/
  ├── README.md (this file)
  ├── SUMMARY.md
  ├── BRANCH_ENFORCEMENT_AUDIT.md
  ├── IMPLEMENTATION_PLAN.md
  └── QUICK_REFERENCE.md
```

### Modify (Existing)
```
package.json
  └─ Add scripts: validate:branch, validate:branch:show-pattern

scripts/validation/validate-branch-name.cjs
  └─ Add forbidden prefix check (before regex validation)

scripts/validation/__tests__/validate-branch-name.test.cjs
  └─ Add forbidden prefix test cases

.github/custom-instructions.md
  └─ Add "Copilot Sessions & Branch Naming" section

CHANGELOG.md
  └─ Add entry for this release
```

---

## Documentation Structure

| File | Purpose | Location |
|------|---------|----------|
| **SUMMARY.md** | High-level overview + impact | Project folder |
| **BRANCH_ENFORCEMENT_AUDIT.md** | Detailed audit of current system | Project folder |
| **IMPLEMENTATION_PLAN.md** | Step-by-step implementation guide | Project folder |
| **QUICK_REFERENCE.md** | Visual diagrams + commands + FAQ | Project folder |
| **README.md** | This file — project overview | Project folder |

---

## Timeline

```
Week 1 (2026-09-03 to 2026-09-07)
├─ 2026-09-03: Project created, issue filed, initial planning
├─ 2026-09-04: Phase 1 (configuration) — 4 hours
├─ 2026-09-05: Phase 2 (validation) — 2 hours
├─ 2026-09-06: Phase 3 (documentation) — 2.5 hours
└─ 2026-09-07: Phase 4 & 5 (testing + merge) — 3 hours

Total effort: ~4 days (13.5 hours developer time)
```

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Regression in existing validation | Low | High | Comprehensive testing, reuse existing logic |
| Pre-commit hook too strict | Medium | Medium | Non-blocking, just warns |
| Copilot config not recognized | Low | Medium | Document as fallback if not supported |
| Team communication gap | Medium | Medium | Post announcement after merge |

---

## Dependencies

- ✅ Existing `validate-branch-name.cjs` script
- ✅ Existing test infrastructure (Jest)
- ✅ Husky already installed and working
- ⚠️ GitHub Copilot App support (docs assume v1.0+)

---

## Acceptance Criteria

**When this project is complete, verify:**

1. ✅ `.github/github-app.yml` exists and is valid YAML
2. ✅ `.husky/prepare-commit-msg` exists and is executable
3. ✅ `npm run validate:branch` runs without errors
4. ✅ Forbidden prefixes are explicitly checked in code (not just docs)
5. ✅ All new tests pass: `npm test -- validate-branch`
6. ✅ Existing workflows still pass: `branch-name-validation.yml`, `main-branch-guard.yml`
7. ✅ Documentation is updated and examples are correct
8. ✅ PR is merged to `develop` branch
9. ✅ No regressions detected in CI/CD

---

## 🔗 Related Issues

| Issue | Title | Status |
|-------|-------|--------|
| TBD | GitHub issue to be created | 🟡 Planning |

---

## Related Files

| Document | Location | Purpose |
|----------|----------|---------|
| Branch Strategy | `docs/BRANCHING_STRATEGY.md` | Master reference |
| Copilot Instructions | `CLAUDE.md` | Claude-specific guidance |
| Custom Instructions | `.github/custom-instructions.md` | Repo-local guidance |
| Audit Report | `.github/projects/active/copilot-branch-enforcement-2026-09-03/BRANCH_ENFORCEMENT_AUDIT.md` | This project |
| Implementation | `.github/projects/active/copilot-branch-enforcement-2026-09-03/IMPLEMENTATION_PLAN.md` | This project |

---

## Notes

- All code changes preserve backward compatibility
- Validation scripts are reused; no duplicate logic introduced
- Error messages follow existing patterns (clear, actionable, with examples)
- Tests use existing Jest setup; no new dependencies added

---

## Project Lead

**Created by:** Copilot Audit Session  
**Assigned to:** @user  
**Reviewers:** Code owners  

---

*Project folder location:* `.github/projects/active/copilot-branch-enforcement-2026-09-03/`  
*Related issue:* See linked GitHub issue #TBD  
*Maintained by the 🤖 LightSpeedWP Automation Team*
