---
title: "Changelog Automation Hardening — Execution Prompt for New Chat"
description: "Ready-to-use prompt for fixing changelog in a fresh Claude Code session"
created_date: "2026-07-24"
file_type: "prompt"
---

# Changelog Automation Hardening — Execution Prompt

Use this prompt in a fresh Claude Code chat to rebuild and improve the changelog.

⚠️ **CRITICAL ALERT:** This prompt references Phase 2 work that is INCOMPLETE.

**DO NOT USE THIS PROMPT.**

Phase 2 was only 40% complete (40 of 76 PRs captured).
See GitHub Issue #1271 for recovery status and blocking issues.

This prompt will be updated once Phase 2 recovery is complete.

---

## Prompt to Paste (OUTDATED — DO NOT USE)

```
The .github project has critical changelog automation issues that need fixing urgently.
I've created a comprehensive 4-phase plan at:
- .github/projects/active/changelog-automation-hardening/PROJECT_PLAN.md (strategic overview)
- .github/projects/active/changelog-automation-hardening/CHANGELOG_GUIDELINES.md (rules & format)
- .github/projects/active/changelog-automation-hardening/PHASE_2_REBUILD_HISTORY.md (rebuild plan)

Phase 1 (automation bug fix) is complete and merged: fix/changelog-section-headers-preserve branch.
Phase 2 (history rebuild) is BLOCKED and INCOMPLETE — see Issue #1271 for details.

I need you to execute Phase 2: Rebuild Lost History. Here's what to do:

1. Read PHASE_2_REBUILD_HISTORY.md carefully - it has the exact changelog entries to add
2. Rebuild CHANGELOG.md [Unreleased] section with:
   - Removed (none identified)
   - Deprecated (none identified) 
   - Added (14 major features)
   - Changed (7 breaking/major changes)
   - Fixed (16 critical bugs)
   - Security (none identified)
3. Follow CHANGELOG_GUIDELINES.md for formatting:
   - Each entry: `- **Title** — description ([PR #N](url), [#I](issue-url))`
   - Descriptions <150 chars, concise, one-two sentences max
   - All links must point to valid GitHub URLs
4. Add Contributors/Credits section at the end of CHANGELOG.md following Keep a Changelog format
5. Validate the changelog: npm run validate:changelog (if it exists)
6. Commit with: chore(changelog): rebuild entries from Phase 1 (40+ PRs, May 24 — Jul 24)
7. Create a PR with title "chore(changelog): rebuild lost history & apply automation hardening"

The entries are ready for you in PHASE_2_REBUILD_HISTORY.md — just copy them into CHANGELOG.md
organized under the correct section headers.

Reference:
- Keep a Changelog: https://keepachangelog.com/en/1.1.0/
- Project plan: https://github.com/lightspeedwp/.github/issues/1271 (Epic)
- Related issues: #1272 (Phase 2), #1273 (Phase 3), #1275 (Phase 1 bug fix)
```

---

## Context for You (Claude Code)

**Current State:**

- Phase 1 bug fix merged to `fix/changelog-section-headers-preserve` branch
- 76 PRs from past 2 months (May 24 — July 24) lost history
- PHASE 2 INCOMPLETE: Only 40 of 76 PRs captured (GitHub Issue #1271)
- Current CHANGELOG.md has verbose, inconsistent entries
- No validation rules defined
- No contributor guidelines published

**Success Criteria:**

- ✅ [Unreleased] section contains all 40+ merged PRs from past 2 months
- ✅ All entries <150 chars, concise, properly formatted
- ✅ All entries link to relevant PRs and issues
- ✅ Section headers properly organized (Removed, Deprecated, Added, Changed, Fixed, Security)
- ✅ Contributors/Credits section added
- ✅ Passes validation (if npm script exists)

**Deliverables:**

- Updated CHANGELOG.md with rebuilt history
- PR ready to merge to develop
- Project documentation updated to reference Phase 2 completion

**Files You'll Need:**

- `.github/projects/active/changelog-automation-hardening/PHASE_2_REBUILD_HISTORY.md` (entry list)
- `.github/projects/active/changelog-automation-hardening/CHANGELOG_GUIDELINES.md` (rules)
- `CHANGELOG.md` (to rebuild)

---

## Notes

- The PHASE_2_REBUILD_HISTORY.md file has all 40+ PRs categorized and formatted already
- Just copy the entries into CHANGELOG.md under appropriate sections
- Ensure every entry has a PR link — if not, mark it clearly as needing investigation
- Aim for consistency in tone and formatting
- Keep descriptions short: "What changed" + "Why it matters" in 1-2 sentences max
- This is Phase 2 of the 4-phase initiative (Phase 1 bug already fixed)

---

**Estimated Effort:** 30-45 minutes  
**Complexity:** Medium (data gathering already done, just organization and validation)  
**Risk:** Low (non-code change, reversible)
