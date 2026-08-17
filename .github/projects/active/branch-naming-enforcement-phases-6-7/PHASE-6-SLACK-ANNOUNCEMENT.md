---
name: phase-6-slack-announcement
description: Draft Slack announcement for Branch Naming Enforcement Initiative team rollout
---

# 🚀 Branch Naming Enforcement — Phase 6 Team Rollout

## Announcement Draft

> **📢 Attention Team:** 
>
> We're rolling out **branch naming enforcement** across the LightSpeed organization! 
>
> Starting **[ENFORCEMENT DATE]**, all branches must follow this pattern:
>
> ```
> {type}/{scope}-{short-title}
> ```
>
> **Examples:**
> ✅ `feat/branch-naming-enforcement`  
> ✅ `fix/validation-script-bug`  
> ✅ `docs/branching-strategy-guide`  
> ❌ `my-branch` (missing type)  
> ❌ `Feature/MyBranch` (uppercase not allowed)  
>
> ## Setup Required (by [GRACE PERIOD END DATE])
>
> 1. **Install pre-commit hook:** `npm run setup:hooks`
> 2. **Test it works:** Create a test branch with wrong name, watch it fail ✓
> 3. **Rename existing branches** using: `git branch -m <old-name> <new-name>`
>
> ## Where to Get Help
>
> - 📖 **Full Setup Guide:** [docs/SETUP_BRANCH_VALIDATION.md](./docs/SETUP_BRANCH_VALIDATION.md)
> - 🔧 **Troubleshooting:** [docs/BRANCH_VALIDATION_TROUBLESHOOTING.md](./docs/BRANCH_VALIDATION_TROUBLESHOOTING.md)
> - ❓ **Ask Questions:** Reply in this thread or message @[TEAM_LEAD]
>
> **Grace period:** [GRACE PERIOD DURATION] — no enforcement blocks until then.  
> **Go live date:** [ENFORCEMENT DATE] — validation becomes required on all new branches.

---

## Rollout Timeline

| Date | Action |
|------|--------|
| Today | Announcement + grace period begins |
| Day 3 | Check-in: 80%+ team setup verification |
| Day 7 | Enforcement enabled (validation required) |
| Day 14 | Metrics review + team feedback |
| Day 30 | Phase 7 metrics & policy refinement |

---

## Success Criteria (Phase 6)

- ✅ 100% of team members see announcement
- ✅ 80%+ install pre-commit hook (npm run setup:hooks)
- ✅ <5% of merge failures due to branch naming
- ✅ Support team receives <10 help requests
- ✅ All team members acknowledge rollout
