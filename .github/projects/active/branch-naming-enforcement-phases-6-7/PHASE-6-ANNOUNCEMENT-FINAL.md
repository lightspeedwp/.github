---
name: phase-6-announcement-final
description: Final team announcement for Phase 6 branch naming enforcement rollout (with dates filled in)
---

# 🚀 Branch Naming Enforcement — Phase 6 Team Rollout

**Announcement Date:** August 12, 2026  
**Enforcement Go-Live:** August 19, 2026  
**Grace Period:** August 12-19, 2026 (7 days)

---

## 📢 Team Announcement (Copy-Paste Ready)

> **📢 Attention Team:**
>
> We're rolling out **branch naming enforcement** across the LightSpeed organization!
>
> Starting **August 19, 2026**, all branches must follow this pattern:
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
> **Valid types:** `feat`, `fix`, `hotfix`, `docs`, `chore`, `refactor`, `test`, `ci`, `build`, etc.
>
> ## ⚙️ Setup Required (by August 19, 2026)
>
> **Grace period:** August 12-19 (validation warns, doesn't block)  
> **After August 19:** Invalid branches will be **blocked**
>
> ### Setup Steps
>
> 1. **Install pre-commit hook:**
>
>    ```bash
>    npm run setup:hooks
>    ```
>
> 2. **Test it works:**
>    Create a test branch with wrong name:
>
>    ```bash
>    git checkout -b invalid-name
>    ```
>
>    You should see a warning that it doesn't follow the format.
>
> 3. **Rename existing branches** to valid names:
>
>    ```bash
>    git branch -m <old-name> <new-name>
>    ```
>
> 4. **Verify valid names work:**
>
>    ```bash
>    git checkout -b feat/test-branch
>    ```
>
>    Should create successfully ✓
>
> ## 📚 Resources
>
> - **Full Setup Guide:** [docs/SETUP_BRANCH_VALIDATION.md](https://github.com/lightspeedwp/.github/blob/develop/docs/SETUP_BRANCH_VALIDATION.md)
> - **Troubleshooting:** [docs/BRANCH_VALIDATION_TROUBLESHOOTING.md](https://github.com/lightspeedwp/.github/blob/develop/docs/BRANCH_VALIDATION_TROUBLESHOOTING.md)
> - **Branch Naming Rules:** [docs/BRANCHING_STRATEGY.md](https://github.com/lightspeedwp/.github/blob/develop/docs/BRANCHING_STRATEGY.md)
> - **Validation Script:** [scripts/validation/validate-branch-name.cjs](https://github.com/lightspeedwp/.github/blob/develop/scripts/validation/validate-branch-name.cjs)
>
> ## 💬 Questions? Get Help
>
> - 📋 **Setup Issues:** See troubleshooting guide above
> - 💬 **Questions:** Reply in this thread or #engineering-help Slack
> - 🆘 **Urgent Issues:** DM @governance-team
>
> **Support window:** August 12-19 (grace period), August 19+ (enforcement + support)
>
> ---
>
> **Timeline:**
>
> - **Today (Aug 12):** Announcement + grace period begins
> - **Day 3 (Aug 15):** Setup check-in — target 80%+ adoption
> - **Day 7 (Aug 19):** Enforcement enabled (validation blocks invalid branches)
> - **Aug 26:** Metrics review + team feedback
> - **Sep 12:** Phase 7 metrics report + Phase 8 planning
>
> **Questions?** Check the resources above or ask in #engineering-help. We're here to help! 🚀

---

## 🔔 Slack Channel Message (Alternative Format)

**Channel:** #engineering-help or #announcements

```
🚀 Branch Naming Enforcement — New Requirement

Starting August 19, we're enforcing branch naming.

Format: {type}/{scope}-{short-title}
Examples: feat/new-feature, fix/bug-fix, docs/update-guide

**Grace period until Aug 19** — install hook now:
npm run setup:hooks

📖 Setup guide: docs/SETUP_BRANCH_VALIDATION.md
❓ Questions? Reply here or check troubleshooting guide
```

---

## 📋 Delivery Checklist

**Phase 6 Announcement Delivery:**

- [ ] **Post to Slack** (#announcements or #engineering)
  - [ ] Copy announcement above
  - [ ] Pin message in channel
  - [ ] Send to team Slack group

- [ ] **GitHub Discussion** (alternate channel)
  - [ ] Create discussion: "Branch Naming Enforcement Phase 6"
  - [ ] Copy announcement above
  - [ ] Link from README

- [ ] **Email** (optional but recommended)
  - [ ] Send to team distribution list
  - [ ] Subject: "Action Required: Branch Naming Setup (Aug 12-19)"

- [ ] **GitHub Issues**
  - [ ] Link Phase 6 execution issue (#1857)
  - [ ] Add announcement link to issue

- [ ] **Follow-up**
  - [ ] Aug 15: Check-in message to Slack
  - [ ] Aug 19: Enforcement enabled notification
  - [ ] Aug 26: Metrics report preview

---

## 📊 Timeline Summary

| Date | Action | Owner | Status |
|------|--------|-------|--------|
| **Aug 12 (Today)** | Announce + grace period opens | Governance | 🟡 Ready |
| **Aug 13** | Team setup begins | Team | 🔄 Scheduled |
| **Aug 15** | 80%+ adoption check-in | Governance | 🔄 Scheduled |
| **Aug 19** | Enforcement enabled 🔒 | GitHub Actions | 🔄 Scheduled |
| **Aug 26** | Metrics review | Metrics Team | 🔄 Scheduled |
| **Sep 12** | Phase 7 report + Phase 8 plan | Governance | 🔄 Scheduled |

---

## ✅ Success Criteria (Phase 6)

- ✅ 100% of team sees announcement
- ✅ 80%+ install pre-commit hook
- ✅ <5 support requests during setup
- ✅ All existing branches renamed to valid format
- ✅ Team ready for enforcement on Aug 19

---

## 📝 Post-Announcement Actions

1. **Monitor Slack** for questions (support SLA: 1-4 hours)
2. **Track adoption** (hook installations) via npm telemetry or manual survey
3. **Prepare enforcement** — test GitHub Actions workflow before Aug 19
4. **Plan check-in** for Day 3 (Aug 15) adoption progress
5. **Ready support docs** for common issues

---

**Announcement prepared:** 2026-08-12  
**Ready to send:** ✅ Yes  
**Dates confirmed:** ✅ August 12-19, 2026
