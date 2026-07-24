# Phase 4: Changelog Automation & Guardrails — Execution Prompt

**Branch Name:** `feat/changelog-phase-4-guardrails`

**Active Project Folder:** [.github/projects/active/changelog-automation-hardening/](https://github.com/lightspeedwp/.github/tree/develop/.github/projects/active/changelog-automation-hardening/)

**Epic:** [#1271](https://github.com/lightspeedwp/.github/issues/1271) — Changelog Automation Hardening

---

## Overview

Phase 4 completes the changelog automation hardening initiative by implementing safeguards, automated linking, and contributor tooling to ensure long-term sustainability of the changelog process.

**Previous Phases Status:**

- ✅ Phase 1: Section header corruption fix (PR #1276) — MERGED
- ✅ Phase 2: Rebuild lost history (127 PRs) (PR #1281, #1315) — MERGED
- ✅ Phase 3: Rules & guidelines (PR #1281) — MERGED
- 🔄 Phase 4: Guardrails — THIS PHASE

---

## Phase 4 Objectives

### 1. Automated PR-to-Changelog Linking

**What:** Automatically add entries to CHANGELOG.md when PRs merge if they meet criteria.

**Implementation:**

- Create `scripts/workflows/changelog/auto-link-pr.cjs` script
- Trigger on PR merge to develop/main
- Auto-add entry if:
  - PR has `changelog:included` label, OR
  - PR title matches changelog-worthy patterns, OR
  - PR explicitly added CHANGELOG.md entry
- Format entry per CHANGELOG_GUIDELINES.md
- Link to both PR and referenced issues

**Testing:**

- Manual verification on next 5 PRs
- Test with feature/fix/chore PR types
- Verify links are valid and formatted correctly

**GitHub Issue:** Create new if not exists → "Phase 4A: Automated PR-to-changelog linking" (Link to Epic #1271)

---

### 2. Maintainer Review Checklist

**What:** Create a checklist for maintainers reviewing changelog entries before merge.

**File:** `.github/CHANGELOG_REVIEW_CHECKLIST.md`

**Contents:**

- [ ] All entries are user-facing (not docs-only, test-only, internal refactoring)
- [ ] All entries are concise (under 150 chars, 1-2 sentences max)
- [ ] All PR/issue links are valid (URLs exist, formats correct)
- [ ] Section organization is logical (Added/Fixed/Changed/etc.)
- [ ] No duplicate entries exist in [Unreleased]
- [ ] Proper markdown formatting (bold title, em-dash, links)
- [ ] All linked PRs/issues actually exist and are referenced correctly
- [ ] No breaking changes unmarked in "Changed" section
- [ ] Security fixes are in "Security" section (not "Fixed")
- [ ] No verbose/jargon entries without explanation

**Integration:**

- Reference in PR template (optional guidance section)
- Reference in contributor checklist
- Link from CLAUDE.md and AGENTS.md (if applicable)

**GitHub Issue:** Create new if not exists → "Phase 4B: Maintainer review checklist" (Link to Epic #1271)

---

### 3. Enhanced Merge Safeguards

**What:** Add safety mechanisms to `scripts/workflows/changelog/merge-entries.cjs`

**Safeguards to Implement:**

1. **Pre-write validation**
   - Run changelog validation BEFORE write
   - Halt if validation fails
   - Report specific errors to console

2. **Backup before modify**
   - Create timestamped backup of CHANGELOG.md
   - Store in `.github/backups/changelog/CHANGELOG.md.backup-YYYYMMDD-HHMMSS`
   - Keep last 10 backups (delete older ones)

3. **Post-write verification**
   - Verify [Unreleased] section exists after write
   - Verify no section headers were lost
   - Verify file is not corrupted

4. **Rollback instruction**
   - If write fails, emit clear error message with rollback command
   - Example: `git checkout HEAD -- CHANGELOG.md && git restore-working-directory`

5. **Logging**
   - Log all operations (validation pass/fail, backup created, write result)
   - Save logs to `.github/logs/changelog-merge-{TIMESTAMP}.log`
   - Reference log file in error messages

**Testing:**

- Test validation failure scenario (intentionally create invalid entry)
- Test backup creation (verify file exists)
- Test post-write verification (verify sections preserved)
- Test rollback instructions (verify they work)

**GitHub Issue:** Create new if not exists → "Phase 4C: Enhanced merge safeguards" (Link to Epic #1271)

---

### 4. Integration Testing & Monitoring

**What:** Monitor next 10 PRs that modify CHANGELOG.md and verify zero automation failures.

**Success Criteria:**

- ✅ 10 PRs merged with CHANGELOG changes
- ✅ 0 automation failures (validation, linking, safeguards)
- ✅ 0 section header loss
- ✅ 0 duplicate entries
- ✅ 100% of entries properly linked to PRs/issues
- ✅ All entries follow format guidelines

**Process:**

- Create monitoring dashboard or tracking sheet
- Log each PR merge event
- Note any warnings or issues
- Report findings to team

**GitHub Issue:** Create new if not exists → "Phase 4D: Integration testing & monitoring" (Link to Epic #1271)

---

## Project Folder Updates (MANDATORY)

Before starting work, complete these steps:

### Step 1: Review Current Status

- [ ] Read [README.md](README.md)
- [ ] Read [PROJECT_PLAN.md](PROJECT_PLAN.md)

### Step 2: Update PROJECT_PLAN.md

- [ ] Change Phase 4 status from "🔄 PARTIAL" to "🔄 IN PROGRESS"
- [ ] Update timeline entry: "2026-08-07 (target)" → "2026-07-24 (started)"
- [ ] Add detailed breakdown of Phase 4 sub-tasks (4A-4D)
- [ ] Link to new GitHub issues created for each sub-task

### Step 3: Update README.md

- [ ] Change Phase 4 status to "🔄 IN PROGRESS (4A-4D)"
- [ ] Update "Last Updated" timestamp to current date
- [ ] Add Phase 4 sub-task details under "Pending (Phase 4 Guardrails)"
- [ ] Update success criteria progress as items complete

### Step 4: Create GitHub Issues

Create the following issues linked to Epic #1271 (if they don't already exist):

- [ ] Phase 4A: Automated PR-to-changelog linking
- [ ] Phase 4B: Maintainer review checklist
- [ ] Phase 4C: Enhanced merge safeguards
- [ ] Phase 4D: Integration testing & monitoring

---

## Issue Closure Verification (CRITICAL)

**Check existing issues from Phases 1-3 and close completed ones:**

### Issues to Review

| Issue | Phase | Status | Action |
|-------|-------|--------|--------|
| [#1275](https://github.com/lightspeedwp/.github/issues/1275) | 1 | ✅ MERGED (PR #1276) | ✅ **CLOSE** with: "Phase 1 complete. Section header fix verified and deployed. See PR #1276." |
| [#1272](https://github.com/lightspeedwp/.github/issues/1272) | 2 | ✅ MERGED (PR #1281, #1315) | ✅ **CLOSE** with: "Phase 2 complete. All 127 PRs recovered and merged. See PR #1281, #1315." |
| [#1273](https://github.com/lightspeedwp/.github/issues/1273) | 3 | ✅ MERGED (PR #1281) | ✅ **CLOSE** with: "Phase 3 complete. Rules, guidelines, and validation deployed. See PR #1281." |
| [#1314](https://github.com/lightspeedwp/.github/issues/1314) | 2.5 | ✅ MERGED (PR #1315) | ✅ **CLOSE** with: "Additional recovery complete. 51 missing entries added. See PR #1315." |

### Closure Process

1. Navigate to each issue on GitHub
2. Add comment: "Phase complete as of [DATE]. All deliverables merged and validated. See related PR: [LINK]"
3. Click "Close issue" button
4. Verify status shows as "Closed"

---

## Deliverables Checklist

### Phase 4A: Automated PR Linking

- [ ] `scripts/workflows/changelog/auto-link-pr.cjs` created
- [ ] Integration with PR merge workflow complete
- [ ] Tested on 5+ PRs
- [ ] Issue #TBD updated with completion status
- [ ] PR created and merged to develop

### Phase 4B: Maintainer Checklist

- [ ] `.github/CHANGELOG_REVIEW_CHECKLIST.md` created
- [ ] 10-item checklist with clear criteria
- [ ] Linked from PR template
- [ ] Linked from CLAUDE.md
- [ ] Issue #TBD updated with completion status
- [ ] PR created and merged to develop

### Phase 4C: Merge Safeguards

- [ ] Pre-write validation implemented in merge-entries.cjs
- [ ] Backup mechanism created (with rotation logic)
- [ ] Post-write verification implemented
- [ ] Rollback instructions emitted on failure
- [ ] Logging infrastructure added
- [ ] All 4 safeguards tested
- [ ] Issue #TBD updated with completion status
- [ ] PR created and merged to develop

### Phase 4D: Integration Testing

- [ ] Monitoring dashboard/sheet created
- [ ] 10 PRs tracked with zero failures
- [ ] All success criteria met (0 failures, 100% compliance)
- [ ] Report generated with findings
- [ ] Issue #TBD updated with completion status
- [ ] PR created and merged to develop

---

## Final Success Criteria (Phase 4 Complete)

✅ ALL of the following must be true:

- ✅ Automated PR-to-changelog linking works on merge
- ✅ Maintainer review checklist is published and integrated
- ✅ Enhanced safeguards prevent corruption (backup, validation, rollback)
- ✅ 10 monitored PR merges show 0 automation failures
- ✅ All Phase 4 GitHub issues (4A-4D) closed with completion comments
- ✅ Completion notes added to issues #1271, #1272, #1273, #1275, #1314
- ✅ PROJECT_PLAN.md updated with Phase 4 completion date
- ✅ README.md shows Phase 4 as ✅ COMPLETE
- ✅ Epic #1271 ready for closure (all phases complete and merged)

---

## Related References

- **Epic:** [#1271](https://github.com/lightspeedwp/.github/issues/1271) — Changelog Automation Hardening
- **Phase 1:** [#1275](https://github.com/lightspeedwp/.github/issues/1275) — Section header fix
- **Phase 2:** [#1272](https://github.com/lightspeedwp/.github/issues/1272) — Rebuild lost history
- **Phase 3:** [#1273](https://github.com/lightspeedwp/.github/issues/1273) — Rules & guidelines
- **Guidelines:** [CHANGELOG_GUIDELINES.md](CHANGELOG_GUIDELINES.md)
- **Automation Guide:** [docs/CHANGELOG_AUTOMATION.md](../../../../docs/CHANGELOG_AUTOMATION.md)
- **Keep a Changelog:** <https://keepachangelog.com/en/1.1.0/>

---

## Work Timeline

**Estimated Effort:** 40-50 hours across 4 sub-tasks (2-3 weeks)

| Sub-task | Est. Effort | Dependencies | Status |
|----------|------------|--------------|--------|
| 4A: Automated linking | 8-10h | Phase 3 ✅ | 🔴 Not Started |
| 4B: Maintainer checklist | 4-6h | Phase 3 ✅ | 🔴 Not Started |
| 4C: Enhanced safeguards | 12-16h | Phase 1-3 ✅ | 🔴 Not Started |
| 4D: Integration testing | 16-20h | 4A-4C | 🔴 Not Started |

**Total:** ~40-50 hours | **Target:** 2-3 weeks | **Deadline:** August 7, 2026

---

## Next Steps

1. Create feature branch: `feat/changelog-phase-4-guardrails`
2. **CLOSE completed issues:** #1275, #1272, #1273, #1314
3. Create GitHub issues for sub-tasks (4A-4D) linked to Epic #1271
4. Update PROJECT_PLAN.md and README.md with Phase 4 kickoff details
5. Assign team members to each sub-task
6. Begin Phase 4A (automated linking) implementation

🚀 **All Phases 1-3 complete and merged to develop. Ready to start Phase 4.**
