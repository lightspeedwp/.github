---
file_type: "prompt"
title: "Context Continuation Prompt Generator"
description: "Generate self-contained continuation prompt when context window grows too large, with incomplete tasks, open PRs, branch warnings, labels, templates, review feedback, CI errors, merge conflicts."
version: "1.0.0"
created: "2026-09-04"
status: "active"
tags: ["context-management", "workflow", "automation", "pr-workflow"]
owners: ["ashley@lightspeedwp.agency"]
---

# Prompt: Write a Copy-Paste Prompt to Continue with Chat in a New Window

## PROMPT: Generate context continuation prompt when window grows too large

When your chat context grows too large and you need to continue in a new window, this prompt generates a complete, self-contained continuation prompt that includes all critical information without losing state.

### Context

A continuation prompt needs to include:

1. **Incomplete tasks** — What still needs to be done
2. **Open PRs** — Which need review, merging, or fixes
3. **Branch validation** — Warnings about incorrect branch names
4. **Label audit** — Missing or incorrect labels on PRs
5. **PR template status** — Template mismatches
6. **Review feedback** — Unaddressed review comments
7. **Pre-existing CI errors** — Failures not caused by this PR
8. **Merge conflicts** — Any outstanding conflicts needing resolution
9. **Files changed summary** — Quick reference
10. **Completion status** — What's been achieved so far

### Task

Generate a continuation prompt with these 10 sections:

---

## SECTION 1: Session Overview & Accomplishments

```markdown
## Session Overview — {Date} to {Current Date}

**Goal(s):**
- {Describe the original goals of this chat}

**Major Accomplishments:**
- {List 3-5 key accomplishments in this session}

**Files Created/Modified:** {approx. count}

**PRs Opened:** {List PR numbers}

**Issues Created:** {List issue numbers}

**Time Invested:** {Estimate of chat duration}

**Next Steps:** {Where work should resume}
```

---

## SECTION 2: Incomplete Tasks & Blockers

```markdown
## Incomplete Tasks

### Task 1: {Task Name}
- **Status:** {In Progress|Blocked|Pending}
- **What's Done:** {Description}
- **What's Left:** {Specific remaining work}
- **Blocker (if any):** {Describe what's blocking}
- **Next Action:** {What to do next}

### Task 2: {Task Name}
- **Status:** {In Progress|Blocked|Pending}
- **What's Done:** {Description}
- **What's Left:** {Specific remaining work}
- **Blocker (if any):** {Describe what's blocking}
- **Next Action:** {What to do next}

*Note: Don't move on until PR is merged or user input required*
```

---

## SECTION 3: Open PRs Status Table

```markdown
## Open PRs Needing Merge

| PR # | Title | Branch | Status | Blocker | Action |
|------|-------|--------|--------|---------|--------|
| #123 | Fix auth timeout | `fix/auth-timeout` | CI Red | ESLint 5 errors | Fix linting, rerun CI |
| #124 | Add user prefs | `feat/user-prefs` | In Review | Awaiting review | Address feedback |
| #125 | Update deps | `deps/npm-updates` | Ready | None | Merge to develop |

**Priority Order:** Address #125 first (ready), then #124 (review pending), then #123 (CI)
```

---

## SECTION 4: ⚠️ Branch Naming Validation

**CRITICAL: Check branch naming conventions**

```markdown
## Branch Naming Validation

**❌ INVALID Branches Found:**
- `claude/my-feature` — FORBIDDEN prefix (reserved for Claude Code)
- `copilot/fix-bug` — FORBIDDEN prefix (reserved for GitHub Copilot)
- `openai/something` — FORBIDDEN prefix (reserved for OpenAI)

**Action Required:**
These branches MUST be renamed to follow `{type}/{scope}-{title}` pattern:
- `claude/my-feature` → `feat/my-feature-description`
- `copilot/fix-bug` → `fix/bug-description`

**How to Rename (DO NOT close PR):**
1. Go to PR on GitHub
2. Edit branch name in "Branch" dropdown (if available)
3. Or: `git branch -m old-name new-name && git push -u origin new-name`
4. Update PR branch reference
5. PR template will auto-update after branch rename

**Reference:** https://github.com/lightspeedwp/.github/blob/develop/docs/BRANCHING_STRATEGY.md

**Valid Type Values:**
- feat, fix, hotfix, release, refactor, chore, docs, test, perf, ci, build, deps, security, design, a11y, ux, i18n, ops, proto, ds, api, schema, telemetry, content, seo, config, migrate, qa, uat, audit, codex, revert, research
```

---

## SECTION 5: Label Audit — Missing/Incorrect Labels

```markdown
## Label Audit per PR

### PR #123 — Missing Labels
- Missing: `type:*` label (required)
- Missing: `status:*` label (required)
- Correct: `area:ci` ✅

**Action:** Add labels
```
type:bug
status:in-progress
```

### PR #124 — Bare Labels Detected ❌
- **Bare label found:** `urgent` → should be `priority:critical`
- **Bare label found:** `feature` → should be `type:feature`

**Action:** Replace bare labels with family:value format:
- `urgent` → `priority:critical`
- `feature` → `type:feature`

### PR #125 — Labels OK ✅
- type:chore ✅
- status:ready-for-merge ✅
- area:deps ✅

**Reference:** `.github/labels.yml` — Full canonical label list
```

---

## SECTION 6: PR Template Status & Mismatch

```markdown
## PR Template Audit

### PR #123 — Template Mismatch ❌
- **Current Template:** pr_feature.md (wrong)
- **Should Be:** pr_bug.md (based on type:bug label)
- **Action:** Update PR description to match bug report template

### PR #124 — Template Correct ✅
- Type: `type:feature`
- Template: `pr_feature.md` ✅

### PR #125 — Template Correct ✅
- Type: `type:chore`
- Template: `pr_chore.md` ✅

**How to Fix:**
1. Read `.github/PULL_REQUEST_TEMPLATE/pr_bug.md`
2. Update PR description to match sections
3. Fill in all required sections
4. Include: Summary, Changes, Testing, Checklist
```

---

## SECTION 7: Review Feedback Needing Address

```markdown
## Outstanding Review Feedback

### PR #124 — Feedback from @reviewer-name
**Comment #1:** "This function is too complex"
- **Status:** ⏳ Not addressed
- **Action Needed:** Refactor function, reply to comment

**Comment #2:** "Add test coverage for edge case"
- **Status:** ⏳ Not addressed
- **Action Needed:** Add test case, commit, push

**Comment #3:** "Update docs" (nit)
- **Status:** ⏳ Not addressed
- **Action Needed:** Update docs/example.md

### PR #123 — Approved ✅
No outstanding feedback

**Action Order:**
1. Address all substantive feedback (Comments #1, #2)
2. Address optional nits (Comment #3) if quick
3. Commit: `chore: apply review recommendations`
4. Push to PR branch
```

---

## SECTION 8: Pre-existing CI Errors (Not Caused by PR)

```markdown
## Pre-existing CI Failures (Repository-wide, NOT caused by this PR)

### Failure #1: ESLint (338 errors, 282 warnings)
- **Check:** ESLint
- **Root Cause:** Pre-existing JavaScript style issues
- **Occurs On:** develop branch (reproduce without PR)
- **PR Impact:** NO (PR doesn't touch JS)
- **Action:** Document in new issue: `CI: ESLint errors on develop (#XXXX)`
- **Merge Status:** Do NOT block PR merge on this

### Failure #2: Labeler Workflow
- **Check:** Labeler
- **Root Cause:** `.github/labeler.yml` parsing issue
- **Occurs On:** develop branch (reproduce without PR)
- **PR Impact:** NO (PR doesn't modify labeler config)
- **Action:** Document in new issue: `CI: Labeler config parsing error (#XXXX)`
- **Merge Status:** Do NOT block PR merge on this

**How to Verify Pre-existing:**
1. Checkout develop branch: `git checkout develop`
2. Run same CI check locally
3. If it fails: it's pre-existing
4. Create issue to track separately: `type:bug`, `area:ci`

**Reference:** Search `.github/reports/` for CI error tracking
```

---

## SECTION 9: Merge Conflicts (If Any)

```markdown
## Merge Conflicts

### PR #123 — CONFLICT DETECTED ⚠️

**Conflicting Files:**
- `docs/API.md` (2 conflicts)
- `package.json` (1 conflict)

**Action Steps:**
1. Fetch latest develop: `git fetch origin develop`
2. Merge: `git merge origin/develop`
3. Resolve conflicts in editor
4. Run: `npm run format` (auto-fix formatting)
5. Run: `npm run lint:md` (validate markdown)
6. Commit: `merge: resolve conflicts with develop`
7. Push: `git push origin {branch-name}`
8. Verify CI passes after push

**Rebase Guidance:**
- If PR has NO reviews yet: rebase is OK
- If PR HAS reviews: use merge (preserves review comments)

### PR #124 & #125 — NO CONFLICTS ✅
```

---

## SECTION 10: Files Changed Summary

```markdown
## Files Changed (Quick Reference)

### PR #123
- Modified: 5 files
- Added: 2 files
- Deleted: 0 files
- Total Lines: +120, -45

**Key Files:**
- `src/auth.js` (60 line changes)
- `docs/API.md` (merge conflict)
- `tests/auth.test.js` (+new test cases)

### PR #124
- Modified: 8 files
- Added: 1 file
- Deleted: 0 files
- Total Lines: +200, -80

**Key Files:**
- `src/components/UserPrefs.jsx` (main change)
- `.github/workflows/build.yml` (CI config)

### PR #125
- Modified: 2 files
- Added: 0 files
- Deleted: 0 files
- Total Lines: +5, -3

**Key Files:**
- `package.json` (deps updated)
- `package-lock.json` (regenerated)
```

---

## SECTION 11: Milestones & Projects

```markdown
## Milestones & Project Assignments

### Milestones
- PR #123: `v1.3` (assigned)
- PR #124: NOT assigned ⚠️
- PR #125: `v1.2` (assigned)

**Action:** Assign PR #124 to appropriate milestone per `docs/MILESTONE_ALLOCATION_STRATEGY.md`

### Active Projects
- PR #123: Part of `.github/projects/active/auth-hardening/`
- PR #124: NOT linked ⚠️
- PR #125: None

**Action:** Link PR #124 to related active project (if applicable)
```

---

## SECTION 12: Continuation Instructions

```markdown
## How to Continue in New Chat

1. **Copy this entire prompt** (all sections)
2. **Open new Claude Code chat**
3. **Paste the prompt**
4. **Add:** "Continue from the incomplete tasks above. Start with {specific task}"
5. **Review each incomplete task in order**
6. **Don't move to next PR until current PR is merged or user input needed**
7. **After each PR merge, update the status here** and mark as ✅

**Important Reminders:**
- ✅ Use correct branch naming: `{type}/{scope}-{title}` NOT `claude/*`
- ✅ All labels must be `family:value` format (NO bare labels like `bug`)
- ✅ All commits to `develop` branch (NEVER `main`)
- ✅ Update PR templates to match PR type:label
- ✅ Link every PR to a GitHub issue
- ✅ Don't block PR merge on pre-existing CI failures
- ✅ Resolve merge conflicts before merging

**Support Resources:**
- Branch naming: `docs/BRANCHING_STRATEGY.md`
- Labels: `docs/LABELING.md` and `.github/labels.yml`
- PR templates: `.github/PULL_REQUEST_TEMPLATE/`
- Milestones: `docs/MILESTONE_ALLOCATION_STRATEGY.md`
```

---

### Output Format

Generate this as a **complete markdown document** ready to paste into a new chat. Include:

- ✅ All sections above (1-12)
- ✅ Specific details (actual PR numbers, branch names, reviewer names)
- ✅ Action items clearly marked with checkboxes
- ✅ References to key files (docs, labels, templates)
- ✅ Status indicators (✅, ⏳, ❌, ⚠️)

### References

- **Branching Strategy:** `docs/BRANCHING_STRATEGY.md`
- **Label Standards:** `.github/labels.yml` and `docs/LABELING.md`
- **PR Templates:** `.github/PULL_REQUEST_TEMPLATE/`
- **Milestone Strategy:** `docs/MILESTONE_ALLOCATION_STRATEGY.md`
- **GitHub Issues:** `.github/ISSUE_TEMPLATE/`
- **Active Projects:** `.github/projects/active/`

---

**Effort:** 15–30 min to generate  
**Use When:** Context approaching limit, need to resume work in new chat  
**Output:** Ready-to-paste continuation prompt (markdown)  
**Dependencies:** Access to current chat, PR numbers, branch names
