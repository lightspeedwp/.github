# **Org-wide Git Branching Strategy**

***Version:*** 1.1 • ***Last updated:*** 17 Oct 2025

***Purpose:*** Keep `main` deployable, reduce merge risk, and make PR automation predictable across repos. Align branch names with **Issue Types** and **Projects**.

---

[1) High-level rules](#1-high-level-rules)  
[2) Protect main (and develop if used)](#2-protect-main-and-develop-if-used)  
[3) Branch naming (drives PR Type & labels)](#3-branch-naming-drives-pr-type--labels)  
[4) Enforce branch names via CI](#4-enforce-branch-names-via-ci)  
[5) Make prefixes power automation](#5-make-prefixes-power-automation)  
[6) Merge discipline](#6-merge-discipline)  
[7) Release & hotfix flow](#7-release--hotfix-flow)  
[8) Quick per-repo checklist](#8-quick-per-repo-checklist)  
[9) FAQ & guardrails](#9-faq--guardrails)  
[Appendix: Getting started](#appendix-getting-started)

---

## **1) High-level rules** {#1-high-level-rules}
- `main` is production-ready at all times  
- `develop` optional (integration branch)  
- Short-lived branches; squash merges; delete on merge  
- Prefixes map cleanly to Project “Type” and Issue Types

## **2) Protect `main` (and `develop` if used)** {#2-protect-main-and-develop-if-used}
Add protection rules: PR required, approvals (1–2), Code Owners, dismiss stale approvals, require up-to-date branches, passing checks, linear history, no bypass, (optional) signed commits. Mirror for `develop` if used. Merge options: **Squash only**.

## **3) Branch naming (drives PR Type & labels)** {#3-branch-naming-drives-pr-type--labels}
Format: `{type}/{scope}-{short-title}`  
Allowed prefixes and mapping shown in your table (Feature, Bug, Documentation, Task, Refactor, Test Coverage, Performance, Build & CI, Release/Hotfix).

## **4) Enforce branch names via CI (recommended)** {#4-enforce-branch-names-via-ci}
Use one regex policy in a small workflow to fail non-conforming branches.

## **5) Make prefixes power automation** {#5-make-prefixes-power-automation}
- Labeler → initial status  
- Projects mapping → sets Project **Type** from branch  
- Sync status from labels to Project fields

## **6) Merge discipline** {#6-merge-discipline}
Keep branches current; resolve conversations; squash; delete branch on merge.

## **7) Release & hotfix flow** {#7-release--hotfix-flow}
- **Release:** cut `release/vX.Y.Z`, run full CI, QA on staging, PR → `main`, tag, deploy  
- **Hotfix:** branch from `main`, minimal fix PR → `main`, tag, then cherry-pick/back-merge

## **8) Quick per-repo checklist** {#8-quick-per-repo-checklist}
Enable protections, adopt naming, add validation workflow, sync labeler/project mapping, prefer Issue Types/Project fields over `type:*` labels, squash only, delete branches.

## **9) FAQ & guardrails** {#9-faq--guardrails}
- Do we need `develop`? Optional.  
- Where do we record “type of work”? Project **Type** and **Issue Type**.  
- Why no `type:*` labels? Keep labels for routing: status/priority/area.  
- Can we add prefixes? Yes — update CI regex + mapping.

## **Appendix: Getting started** {#appendix-getting-started}
1) Update org `.github` defaults. 2) Sync labels. 3) Add protections. 4) Share this policy in READMEs/onboarding.
