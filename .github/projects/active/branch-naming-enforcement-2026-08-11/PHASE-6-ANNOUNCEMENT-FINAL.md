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
**Enforcement Go-Live:** August 19, 2026  
**Grace Period:** August 12-19, 2026 (7 days)

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
> **Grace period:** August 12-19 (validation warns, doesn't block)  
> **After August 19:** Invalid branches will be **blocked**
>
> 1. Install pre-commit hook:
>    ```bash
>    npm run setup:hooks
>    ```
>
> 2. Test it works:
>    ```bash
>    git checkout -b invalid-name
>    ```
>
> 3. Rename existing branches to valid names
>
> 4. Verify valid names work:
>    ```bash
>    git checkout -b feat/test-branch
>    ```
>
> **Questions?** Reply in this thread or DM @governance-team

## Timeline Summary

| Date | Action | Status |
|------|--------|--------|
| **Aug 12** | Announcement + grace period | 🟡 Today |
| **Aug 15** | Adoption check-in (target 80%+) | 🔄 Scheduled |
| **Aug 19** | Enforcement enabled | 🔄 Scheduled |
| **Aug 26** | Metrics review | 🔄 Scheduled |
