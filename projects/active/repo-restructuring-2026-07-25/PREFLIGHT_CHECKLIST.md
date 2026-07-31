# Pre-Flight Checklist — Phase 0 Readiness

**Status:** Ready to use  
**Date Created:** 2026-07-31  
**Owner:** Ash Shaw (execution), Claude Code (support)  
**Target Completion:** Before Phase 1 implementation begins

---

## Checklist: Readiness for Repository Restructuring

**Complete all items below before starting Phase 1 implementation.** Each section has a clear owner and acceptance criteria.

---

## PART A: Decisions & Planning (Owner: Ash Shaw)

### A.1 Confirm 50-Question Decisions ⚠️ CRITICAL BLOCKER

- [ ] **Read the 50 questions & answers document**
  - File: `/Users/ash/Downloads/50-questions-and-answers.md` (or wherever stored)
  - Sections: All 50 questions reviewed
  
- [ ] **Provide feedback on ALL 50 questions**
  - Use the template in `PHASE_0_TASKS.md` Task 0.1
  - Mark each question: ✅ Agree / ❌ Disagree (with reason) / ❓ Unclear
  - Add critical decisions (agent location, team size, plugin adoption)
  - **Timeline:** 1 day
  - **Owner:** Ash Shaw

- [ ] **Resolve any disagreements or unclear items**
  - Schedule quick sync with Claude Code if clarification needed
  - Update feedback document with resolutions
  - **Timeline:** 1 day (if needed)

- [ ] **Get written confirmation**
  - Comment in this checklist: "✅ 50-question decisions confirmed"
  - Copy-paste key decisions into next section (A.2)

---

### A.2 Document Confirmed Decisions

**Copy your top decisions here from the 50-questions feedback:**

**EXAMPLE DECISIONS TO CONFIRM:**

```
Schema Consolidation:
- [ ] Move .schemas/ → visible schemas/ at root? (Recommended: YES)
- [ ] Consolidate schema/ + .schemas/ into single schemas/? (Recommended: YES)
- [ ] Make schemas/ visible for cross-project reference? (Recommended: YES)

Root Cleanup:
- [ ] Move scripts/ → .github/scripts/? (Recommended: YES)
- [ ] Move website/ → .github/website/? (Recommended: YES)
- [ ] Split config/ (portable at root, GitHub-native in .github/)? (Recommended: YES)

Agent/Skill Separation:
- [ ] Keep portable agents in root agents/? (Recommended: YES)
- [ ] Keep .github-specific agents in .github/agents/? (Recommended: YES)
- [ ] Same split for skills? (Recommended: YES)

Documentation & Visibility:
- [ ] Make schemas/ visible for WordPress projects? (Recommended: YES)
- [ ] Multi-root VSCode workspace pattern? (Recommended: YES)
```

**YOUR CONFIRMED DECISIONS:**

```
[Paste your decisions here after reviewing 50-questions]

Schema Consolidation:
- [ ] Move .schemas/ → visible schemas/ at root?
- [ ] Consolidate schema/ + .schemas/ into single schemas/?
- [ ] Make schemas/ visible for cross-project reference?

Root Cleanup:
- [ ] Move scripts/ → .github/scripts/?
- [ ] Move website/ → .github/website/?
- [ ] Split config/ (portable at root, GitHub-native in .github/)?

Agent/Skill Separation:
- [ ] Keep portable agents in root agents/?
- [ ] Keep .github-specific agents in .github/agents/?
- [ ] Same split for skills?

Documentation & Visibility:
- [ ] Make schemas/ visible for WordPress projects?
- [ ] Multi-root VSCode workspace pattern?

[ADD OTHER DECISIONS FROM 50-QUESTIONS HERE]
```

---

## PART B: Repository State (Owner: Ash Shaw)

### B.1 Git Status — Ensure Clean Working Directory

- [ ] **No uncommitted changes**

  ```bash
  git status
  # Expected output: "On branch claude/... nothing to commit, working tree clean"
  ```

  - If dirty: Commit or stash changes before proceeding
  - **Timeline:** 5 minutes

- [ ] **Current branch is NOT `main` or `develop`**

  ```bash
  git branch --show-current
  # Expected: Some feature/fix branch, NOT main or develop
  ```

  - If on main/develop: Switch branch or create new one
  - **Timeline:** 2 minutes

- [ ] **Branch is up-to-date with remote**

  ```bash
  git fetch origin
  git status
  # Expected: "Your branch is up to date with 'origin/...'"
  ```

  - If behind: Run `git pull`
  - **Timeline:** 2 minutes

### B.2 Create Backup Branch & Tag

- [ ] **Create backup branch**

  ```bash
  git checkout -b backup/pre-restructure-2026-07-31
  git push -u origin backup/pre-restructure-2026-07-31
  ```

  - **Timeline:** 2 minutes
  - **Acceptance:** Branch exists on remote

- [ ] **Create backup tag**

  ```bash
  git tag -a backup/pre-restructure-2026-07-31 -m "Pre-restructure backup - 2026-07-31"
  git push origin backup/pre-restructure-2026-07-31
  ```

  - **Timeline:** 2 minutes
  - **Acceptance:** Tag visible in `git tag -l`

- [ ] **Verify backup exists**

  ```bash
  git branch -r | grep backup/pre-restructure
  git tag | grep backup/pre-restructure
  ```

  - **Acceptance:** Both branch and tag show in output

### B.3 Switch to Working Branch

- [ ] **Create working branch for restructuring**

  ```bash
  git checkout develop  # or main, as per branching strategy
  git pull origin
  git checkout -b refactor/schema-consolidation-scripts-move
  git push -u origin refactor/schema-consolidation-scripts-move
  ```

  - **Timeline:** 2 minutes
  - **Branch naming:** Must follow `refactor/{scope}-{title}` format per BRANCHING_STRATEGY.md

---

## PART C: Build & Test Environment (Owner: Claude Code / Ash Shaw)

### C.1 Dependency Installation

- [ ] **Install dependencies**

  ```bash
  npm ci
  ```

  - **Timeline:** 3–5 minutes
  - **Acceptance:** No errors; `node_modules/` present

### C.2 Run Full Test Suite

- [ ] **All tests pass**

  ```bash
  npm test
  ```

  - **Timeline:** 5–10 minutes (depends on test count)
  - **Acceptance:** All tests pass (0 failures)
  - **If failures:** Investigate, fix, commit before proceeding

### C.3 Run All Validation Scripts

- [ ] **Frontmatter validation passes**

  ```bash
  npm run validate:frontmatter
  ```

  - **Acceptance:** No errors

- [ ] **Agents validation passes**

  ```bash
  npm run validate:agents
  ```

  - **Acceptance:** No errors

- [ ] **Plugins validation passes**

  ```bash
  npm run validate:plugins
  ```

  - **Acceptance:** No errors (if script exists)

- [ ] **JSON schema validation passes**

  ```bash
  npm run validate:json
  ```

  - **Acceptance:** No errors (if script exists)

- [ ] **Linting passes**

  ```bash
  npm run lint:md
  npm run lint:js
  ```

  - **Acceptance:** No errors

### C.4 Overall Status

- [ ] **All CI checks would pass**
  - Run any local CI equivalent (GitHub Actions available in repo?)
  - Or manually verify: `npm test && npm run lint:*`
  - **Acceptance:** No failures

---

## PART D: Documentation & Communication (Owner: Ash Shaw + Claude Code)

### D.1 Documentation Exists

- [ ] **Review phase-0 planning documents**
  - [x] `PHASE_0_TASKS.md` (original task list)
  - [x] `50-questions-and-answers.md` (decisions)
  - [x] `SPECIFICATION.md` (THIS FILE — implementation plan)
  - [x] `PREFLIGHT_CHECKLIST.md` (readiness check)

- [ ] **Review related repo documentation**
  - [x] `CLAUDE.md` (repo instructions)
  - [x] `AGENTS.md` (AI governance)
  - [x] `docs/BRANCHING_STRATEGY.md` (PR process)

### D.2 Specification Reviewed & Approved

- [ ] **Specification document approved by user**
  - [x] Folder-by-folder mapping makes sense
  - [x] Reference updates are comprehensive
  - [x] Implementation sequencing is clear
  - [x] Risk mitigation is acceptable
  - [x] Rollback plan is clear

- [ ] **Any questions or concerns addressed**
  - If unclear: Comment in SPECIFICATION.md "Questions:" section
  - Resolve before proceeding

### D.3 Communication Sent (Optional but Recommended)

- [ ] **Notify team** (if applicable)
  - Slack/email: "Starting restructuring Phase 1 on 2026-08-02"
  - Link: This specification + PR will follow

- [ ] **Document in PR description** (when created)
  - Link to this checklist
  - Link to SPECIFICATION.md
  - Summary of changes

---

## PART E: Final Sign-Off (Owner: Ash Shaw)

### E.1 Ready to Proceed?

- [ ] **All PART A items completed** (Decisions confirmed)
- [ ] **All PART B items completed** (Repository clean & backed up)
- [ ] **All PART C items completed** (Tests pass, validation passes)
- [ ] **All PART D items completed** (Documentation reviewed)

### E.2 Sign-Off

**Owner:** Ash Shaw

**Sign-off:**

```
✅ All pre-flight checks completed.
✅ Ready to proceed to Phase 1 (Folder Moves).

Date: ____________
Signature/Comment: ____________
```

---

## Timeline Summary

| Task | Owner | Duration | Status |
| --- | --- | --- | --- |
| **Part A: Confirm 50-question decisions** | Ash Shaw | 1–2 days | ⏳ Pending |
| **Part B: Backup repo & create working branch** | Ash Shaw | 10 min | ⏳ Pending |
| **Part C: Install deps, run tests, validate** | Ash Shaw/Claude | 20–30 min | ⏳ Pending |
| **Part D: Review docs & specification** | Ash Shaw/Claude | 30 min | ⏳ Pending |
| **Part E: Sign-off** | Ash Shaw | 5 min | ⏳ Pending |
| **TOTAL Pre-Flight** | — | 2–3 days | ⏳ Pending |

---

## What Happens Next

**After this checklist is complete:**

1. **Phase 1 begins** — Folder moves (2–3 hours)
   - Create `schemas/` folder
   - Copy `schema/` → `schemas/`
   - Copy `scripts/` → `.github/scripts/`
   - Copy `website/` → `.github/website/` (if applicable)

2. **Phase 2 begins** — Reference updates (3–4 hours)
   - Update npm scripts
   - Update validation scripts
   - Update workflows
   - Update documentation

3. **Phase 3 begins** — Validation & testing (1–2 hours)
   - Run all validation scripts
   - Run full test suite
   - Fix any issues

4. **Phase 4 begins** — Create PR & merge (2–3 hours)
   - Create PR on `refactor/schema-consolidation-scripts-move`
   - Request review
   - Merge to `develop`

5. **Phase 5 begins** — Final cleanup & documentation (1–2 hours)
   - Archive old folders
   - Update documentation
   - Communicate to team

**Total estimated time:** 1–2 days (implementation) + 1 day (testing/review) = **2–3 days**

---

## Troubleshooting

### If Git Status Is Dirty

```bash
# See what's uncommitted
git status

# Option 1: Commit changes
git add .
git commit -m "WIP: [your message]"

# Option 2: Stash changes
git stash
git stash list  # Verify
```

### If Tests Fail

```bash
# Check test output
npm test -- --verbose

# Fix failing tests
# Then re-run: npm test
```

### If Validation Scripts Fail

```bash
# Run individual validation script
npm run validate:frontmatter -- --verbose

# Check script errors (look for path issues, missing files)
# Fix and re-run
```

### If Branch Already Exists

```bash
# Delete and recreate
git push origin --delete refactor/schema-consolidation-scripts-move
git branch -D refactor/schema-consolidation-scripts-move
git checkout -b refactor/schema-consolidation-scripts-move
git push -u origin refactor/schema-consolidation-scripts-move
```

---

## References

- [SPECIFICATION.md](./SPECIFICATION.md) — Detailed implementation plan
- [DECISIONS_FRAMEWORK-50-QUESTIONS.md](./DECISIONS_FRAMEWORK-50-QUESTIONS.md) — Decision framework (50-question review)
- [CLAUDE.md](../../CLAUDE.md) — Repo instructions
- [AGENTS.md](../../AGENTS.md) — AI governance standards
- [docs/BRANCHING_STRATEGY.md](../../docs/BRANCHING_STRATEGY.md) — Branch naming rules
- [docs/PR_CREATION_PROCESS.md](../../docs/PR_CREATION_PROCESS.md) — PR process standards

---

## Sign-Off Template (Copy and Fill In)

```markdown
## Pre-Flight Checklist Sign-Off

**Date:** 2026-07-31  
**Checklist Version:** 1.0  
**Owner:** Ash Shaw  

### Completion Status
- [x] Part A: Decisions confirmed
- [x] Part B: Repository backed up
- [x] Part C: Tests pass, validation passes
- [x] Part D: Documentation reviewed
- [x] Part E: Ready to proceed

### Sign-Off
**✅ All pre-flight checks passed. Ready to proceed to Phase 1.**

**Approved By:** Ash Shaw  
**Date:** [DATE]  
**Signature/Comment:** [Your sign-off here]

### Notes
[Any additional notes or considerations for Phase 1]
```

---

**Created by:** Claude Code  
**Status:** Ready to use  
**Last Updated:** 2026-07-31  
**Next Review:** After user completes all checklist items
