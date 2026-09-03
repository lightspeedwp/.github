# Phase 3 Finalization — Continuation Prompt

**Context:** Phase 3 of the AI Governance Audit Implementation project is 67% complete. PRs #2551 and #2612 have been merged to develop. PR #2606 status is unknown and must be verified to complete Phase 3. This prompt continues Phase 3 finalization work.

**Repository:** lightspeedwp/.github  
**Session Branch:** `claude/governance-audit-branch-pr-ph4s3r` (development branch for this work)  
**Project Folder:** `.github/projects/active/ai-governance-audit-implementation/`  
**Key Docs:** PHASE_3_STATUS.md, README.md, PLANNING.md

---

## IMMEDIATE ACTION: Verify PR #2606 Status

### Step 1: Check PR #2606 Merge Status
Navigate to: https://github.com/lightspeedwp/.github/pull/2606

**Verify:**
1. Is PR #2606 already merged to develop?
2. If merged: What date/time was it merged?
3. If NOT merged: What is blocking it? (CI failures, review comments, milestone issues)

### Step 2: Determine Next Steps

**If PR #2606 is already merged:**
- ✅ Phase 3 finalization complete
- Document merge time in PHASE_3_STATUS.md
- Move to Phase 4 preparation

**If PR #2606 is NOT merged:**
- Identify all blocking issues from GitHub Actions CI
- Check for:
  - Missing milestone v1.1 (governance requirement)
  - CodeRabbit review findings
  - Failed tests or linting
  - Merge conflicts with develop
- Apply fixes as needed
- Re-run CI and merge when green

---

## PHASE 3 Context & Status

### What's Complete ✅
- **PR #2551** (test/validate-branch-names) — Merged 2026-09-03 03:25 UTC
  - Branch validation tests added
  - Documentation updated (BRANCHING_STRATEGY.md, ai/README.md)
  - Mermaid diagram fixes validated
  - Regex patterns corrected (30 types → 33 types)
  
- **PR #2612** (feat/automation-normalize-tests) — Merged 2026-09-03 03:26 UTC
  - Title normalization tests added
  - GitHub API integration verified
  - Idempotency validated
  - CodeRabbit warnings addressed

### What's Pending ⏳
- **PR #2606** Status unknown — needs immediate verification

### All 15 Phase 3 Issues ✅
1. ✅ Issue 1.1: Move branch naming rules to CLAUDE.md
2. ✅ Issue 1.2: Add branch naming to AGENTS.md
3. ✅ Issue 1.3: Add branch naming to custom-instructions.md
4. ✅ Issue 1.4: Update PR template config with fallback routes
5. ✅ Issue 2.1: Create PR template resolver GitHub Action
6. ✅ Issue 2.2: Create title normalization script
7. ✅ Issue 2.3: Add title normalization tests (PR #2612 merged)
8. ✅ Issue 2.4: Create title normalization GitHub Action workflow
9. ✅ Issue 3.1: Create PR-issue linking enforcement workflow
10. ✅ Issue 3.2: Update PR templates with linking requirements
11. ✅ Issue 4.1: Add branch validation tests (PR #2551 merged)
12. ✅ Issue 4.2: Add template routing tests (PR #2551 merged)
13. ✅ Issue 4.3: Test title normalization on existing issues/PRs
14. ✅ Issue 5.1: Create/update BRANCHING_STRATEGY.md
15. ✅ Issue 5.2: Run title normalization on all issues/PRs

---

## NEXT PHASE PREPARATION: Phase 4 Outline

Once Phase 3 is complete (all PRs merged), Phase 4 will focus on:

### Phase 4: Deploy & Enforce Governance Rules Organization-Wide

**Objective:** Extend branch naming, PR template routing, and title normalization to other organization repositories.

**Key Activities:**
1. Migrate governance rules to sister repositories (if applicable)
2. Deploy labeling and automation workflows to target repos
3. Create organization-wide policy documentation
4. Establish governance enforcement across CI/CD pipelines
5. Set up training and onboarding for teams
6. Define rollout schedule and success metrics

**Expected PRs for Phase 4:**
- Phase 4.1: Deploy to additional `.github` variants or core repositories
- Phase 4.2: Establish organization-wide governance policy
- Phase 4.3: Create team training and runbooks

---

## Work Instructions for This Session

### Task 1: Verify PR #2606 Status ⚠️ CRITICAL
1. Check if PR #2606 is merged to develop
2. If merged: Document merge time and prepare for Phase 4
3. If not merged: Identify blockers and resolve:
   - Assign milestone v1.1 (if missing) — use GitHub UI, cannot be done programmatically
   - Fix any CodeRabbit findings
   - Re-run CI and verify all checks pass
   - Merge using squash-merge strategy
4. Update PHASE_3_STATUS.md with current status

### Task 2: Update Project Documentation
- Update `.github/projects/active/ai-governance-audit-implementation/PHASE_3_STATUS.md`:
  - Add PR #2606 merge status and timestamp
  - Update "Last Updated" timestamp
  - Mark Phase 3 as 100% complete when all PRs merged
  
- Update linked GitHub issues:
  - Mark all 15 Phase 3 issues with label: `status:done`
  - Add label: `meta:phase-3-complete` to all completed issues
  - Update issue descriptions with completion dates

### Task 3: Prepare Phase 4 Kickoff (If Phase 3 Complete)
- Review `PLANNING.md` for Phase 4 scope
- Create Phase 4 issues and link to project
- Define Phase 4 branches and PR patterns
- Prepare Phase 4 kickoff documentation

---

## Branch Naming Requirements

**For any new work in Phase 4:**
- Pattern: `{type}/{scope}-{title}`
- Allowed types: feat, fix, docs, test, ci, chore, etc. (see CLAUDE.md for full list)
- Forbidden prefixes: ❌ claude/, ❌ copilot/, ❌ openai/
- Example: `feat/phase-4-deploy-governance-rules`

**DO NOT use:**
- ❌ claude/... (triggers governance failures)
- ❌ copilot/... (reserved for Copilot integration)
- ❌ Feature/... (uppercase not allowed)
- ❌ Branches without scope-title format

---

## PR Creation Checklist

When creating new PRs:
- [ ] Branch name follows `{type}/{scope}-{title}` pattern
- [ ] Branch name does NOT use forbidden prefixes (claude/, copilot/, openai/)
- [ ] PR links to at least one GitHub issue (`Closes #XXXX` or `Relates to #XXXX`)
- [ ] PR has milestone assigned (v1.1 for Phase 3 final, or appropriate milestone for Phase 4)
- [ ] PR has labels: `type:*`, `area:*`, `priority:*` from canonical label set
- [ ] All CI checks pass before merge
- [ ] Use squash-merge strategy for clean commit history

---

## Key Files & References

**Project Documentation:**
- `.github/projects/active/ai-governance-audit-implementation/PHASE_3_STATUS.md` — Current status tracker
- `.github/projects/active/ai-governance-audit-implementation/README.md` — Project overview
- `.github/projects/active/ai-governance-audit-implementation/PLANNING.md` — Phase plans and roadmap

**Governance Rules:**
- `CLAUDE.md` — AI instructions (branch naming at top, DO NOT USE claude/ prefix)
- `AGENTS.md` — Organization-wide AI rules and guidelines
- `.github/custom-instructions.md` — Copilot-specific instructions
- `docs/BRANCHING_STRATEGY.md` — Complete branching guide with all 33+ types

**Validation Tools:**
- `scripts/validation/validate-branch-name.cjs` — Local branch name validator
- `scripts/validation/__tests__/validate-branch-name.test.cjs` — Tests for validator
- `.github/workflows/validate-branch-name.yml` — GitHub Actions validation

**Automation:**
- `scripts/automation/normalize-issue-pr-titles.cjs` — Title normalization script
- `.github/workflows/normalize-titles.yml` — Title normalization GitHub Action
- `.github/workflows/pr-template-resolver.yml` — PR template routing workflow

---

## Success Criteria for Session

✅ **Phase 3 Finalization Complete When:**
1. PR #2606 status verified and merged (if not already)
2. PHASE_3_STATUS.md updated with PR merge statuses
3. All 15 Phase 3 issues marked with `status:done` label
4. Develop branch shows all checks passing
5. No merge conflicts or pending issues

---

## If You Get Stuck

**For CI failures on PR #2606:**
- Check the GitHub Actions log for specific error message
- If "Missing milestone v1.1" — assign milestone via GitHub UI (cannot be done programmatically via MCP)
- If CodeRabbit warnings — review findings and fix code or justify as acceptable
- If tests fail — verify tests pass locally, then re-run CI from GitHub UI

**For branch name issues:**
- Validate with: `node scripts/validation/validate-branch-name.cjs --branch your-branch-name`
- Ensure pattern is: `{type}/{scope}-{title}` (all lowercase, kebab-case)
- Never use `claude/`, `copilot/`, or `openai/` prefixes

**For milestone assignment:**
- Must be done via GitHub web UI (right sidebar → Milestone dropdown)
- Cannot be assigned programmatically via MCP GitHub tools

---

## Ready to Continue

**This prompt covers:**
✅ Immediate next action (verify PR #2606)  
✅ Complete Phase 3 context and status  
✅ Branch naming rules for future work  
✅ PR creation checklist  
✅ Key files and documentation references  
✅ Phase 4 preparation outline  
✅ Success criteria  

**Copy this entire prompt to a new Claude Code chat window and start with: "Verify PR #2606 status and complete Phase 3 finalization according to the plan above."**

---

**Document Created:** 2026-09-03 03:26 UTC  
**Source Session:** Phase 3 Finalization (Continuation 2)  
**Status:** Ready for next chat window  
**Next Owner:** You (or next Claude session)
