---
file_type: announcement
title: "Phase 6 Team Announcement — Branch Naming Enforcement Rollout"
description: "Ready-to-send team announcement for Phase 6 branch naming enforcement with setup instructions"
version: 1.0.0
created_date: 2026-08-12
last_updated: 2026-08-12
authors:
  - Governance Team
owner: Repository Governance
---

# 🚀 Branch Naming Enforcement — Phase 6 Team Rollout

**Announcement Date:** August 12, 2026  
**Enforcement Go-Live:** August 19, 2026 (00:00 UTC)  
**Grace Period:** August 12-18, 2026 (warnings only)  
**Blocking Start:** August 19, 2026 (00:00 UTC, PR merges blocked)

## Team Announcement (Copy-Paste Ready)

> **📢 Attention Team:**
>
> We're rolling out **branch naming enforcement** starting **today, August 12**!
>
> Starting **August 19, 2026**, all branches must follow:
> ```
> {type}/{scope}-{short-title}
> ```
>
> **Examples:**
> ✅ `feat/branch-naming-enforcement`  
> ✅ `fix/validation-script-bug`  
> ❌ `my-branch` (missing type)  
> ❌ `Feature/MyBranch` (uppercase not allowed)
>
> ## Setup Required (by August 19)
>
> **Grace period:** August 12-18 (validation warns, doesn't block)  
> **After August 19 (00:00 UTC):** Invalid branches will **block PR merges** on GitHub
>
> ### Local Setup (Recommended)
>
> 1. **Install optional pre-commit hook** (catches branch naming early):
>    ```bash
>    npm run setup:hooks
>    ```
>    *Note: This is recommended but not required. The hook runs before commits to warn about invalid branch names.*
>
> 2. **Test the hook** (creates temp branch and commits):
>    ```bash
>    git checkout -b invalid-name
>    git commit --allow-empty -m "test: branch validation"
>    # During grace period (Aug 12-18): warning appears
>    # After Aug 19: hook will reject the commit
>    git checkout -
>    git branch -D invalid-name
>    ```
>
> 3. **Verify valid branch names work:**
>    ```bash
>    git checkout -b feat/test-branch
>    ```
>
> ### GitHub Enforcement (Mandatory)
>
> Starting **August 19, 2026 (00:00 UTC)**, GitHub Actions will **block PR merges** for any branch that doesn't follow the naming format. This applies even if you skip the local hook.
>
> ### Existing Branches
>
> Rename any existing branches that don't follow `{type}/{scope}-{short-title}` format before August 19.
>
> **Questions?** Reply in this thread or DM @governance-team

## Timeline Summary

| Date | Action | Status |
|------|--------|--------|
| **Aug 12** | Announcement + grace period | 🟡 Today |
| **Aug 15** | Adoption check-in (target 80%+) | 🔄 Scheduled |
| **Aug 19** | Enforcement enabled | 🔄 Scheduled |
| **Aug 26** | Metrics review | 🔄 Scheduled |
