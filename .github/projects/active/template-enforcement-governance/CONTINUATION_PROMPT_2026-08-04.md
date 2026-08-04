---
title: "Governance Validation Process Improvement — Continuation Prompt"
description: "Resume work on PR #1488 governance issues and establish AI compliance process"
date_created: "2026-08-04T14:35:00Z"
session_id: "claude-code-continuation"
status: "ready-for-next-session"
---

# Continuation Prompt: Governance Validation & AI Process Fixes

**Issue Reference:** #1489  
**Related PRs:** #1488 (merged), #1490 (pending)  
**Project:** `.github/projects/active/template-enforcement-governance/`

## What Happened

PR #1488 was merged to develop despite:

1. **Critical regex bug** in governance hook preventing linked-issue detection
2. **Governance process violations** (initial template non-compliance, then correction)
3. **Missing pre-commit validation** preventing these errors upfront

## Current State

- ✅ Issue #1489 created documenting all findings
- ✅ Regex bug fixed in PR #1490 (pending merge)
- ✅ Pre-commit checklist documented in #1489 DoD
- ⏳ PR #1490 awaiting review/merge to develop
- ⏳ Pre-commit validation hook NOT YET implemented

## Immediate Next Steps

### 1. Merge PR #1490 (Regex Fix)

```bash
gh pr merge 1490 --squash --delete-branch
```

Verify the regex fix works by running locally:

```bash
pr_body="Fixes #1376 test"
echo "$pr_body" | grep -qiE "(fixes|resolves|closes|relates to)[[:space:]]+#[0-9]+" && echo "PASS: linked-issues detected" || echo "FAIL"
```

### 2. Implement Pre-Commit Validation Hook

Create a hook in `.claude/settings.json` that runs the governance checklist BEFORE commits:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "scripts/hooks/pr-checklist-validator.sh",
            "statusMessage": "Validating PR compliance checklist..."
          }
        ]
      }
    ]
  }
}
```

**Create script:** `scripts/hooks/pr-checklist-validator.sh`

- Verify branch naming compliance
- Warn if on feat/ without proper PR body structure
- Suggest checklist items before committing

### 3. Test on Real PR

After implementation:

- Create a test PR on feat/ branch
- Verify hook validates template structure
- Confirm it provides clear error messages for violations

## Root Cause Analysis

**Pattern:** PR template violations repeat across chats, then get corrected

**Why:** No enforcement mechanism exists between "I plan a commit" and "I push the commit"

**Solution:** Pre-commit validation that:

1. Runs BEFORE staging files
2. Checks branch name format
3. For feat/ branches: warns about PR body structure
4. Blocks commits with clear, actionable error messages
5. Provides context (link to AGENTS.md template rules)

## Governance Rules (VERIFIED)

**No conflicting rules** in AGENTS.md ↔ CLAUDE.md ↔ CLAUDE.md

**For feat/ PRs (required):**

- Template: `pr_feature.md`
- Sections: Linked issues, Changelog, DoD checklist
- Content: Not placeholders

**Enforcement:**

- PR creation: Template validation workflow
- PR merge: Governance hook (now with regex fix)
- Pre-commit: NEW validation hook (to be implemented)

## Definition of Done (For Next Session)

- [ ] PR #1490 merged to develop
- [ ] Regex fix verified working
- [ ] Pre-commit validation script created: `scripts/hooks/pr-checklist-validator.sh`
- [ ] `.claude/settings.json` updated with UserPromptSubmit hook
- [ ] Test on new feat/ branch: validation prevents commit without proper structure
- [ ] Document in AGENTS.md: "AI Governance Compliance" section
- [ ] Close #1489 with verification that all DoD items complete

## Related Context

- **Issue #1489:** All code review findings + process gaps documented
- **PR #1488:** Merged despite issues (governance hook now blocking similar cases)
- **PR #1490:** Pending merge (regex fix for linked-issues detection)
- **Project:** `template-enforcement-governance/` — broader governance framework

## Long-Term Impact

Once pre-commit validation is in place:

- Template violations prevented BEFORE push (not caught by CI later)
- Token waste eliminated (no commit → CI failure → correction cycle)
- Governance rules enforceable for AI operations consistently across chats
- Clear feedback loop for compliance issues

---

**Ready to resume in next session.**  
All context, links, and documentation in place.
