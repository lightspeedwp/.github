# **PR Workflow Guide**

***Version:*** 1.1 • ***Last updated:*** 17 Oct 2025  
---

[1) Why we use a Git workflow](#1-why-we-use-a-git-workflow)  
[2) Pick the right branching strategy](#2-pick-the-right-branching-strategy)  
[3) Pull Requests: our standard](#3-pull-requests-our-standard)  
[4) .gitattributes essentials](#4-gitattributes-essentials)  
[5) Intern exercise — selective fork sync](#5-intern-exercise--selective-fork-sync)  
[6) Quick PR review rules (interns)](#6-quick-pr-review-rules-interns)  
[7) Handy commands & Desktop tips](#7-handy-commands--desktop-tips)  
[8) Reading list](#8-reading-list)  
[9) Appendix — main/develop decision tree](#9-appendix--maindevelop-decision-tree)

---

## **1) Why we use a Git workflow**
Predictable releases, fewer conflicts, safer rollbacks, better reviews, faster delivery.

## **2) Pick the right branching strategy**
**Default:** Trunk-based / GitHub Flow with short-lived branches and PRs into `main`. Use GitFlow only when you must stage releases and maintain hotfixes separately. `develop` optional for integration.

## **3) Pull Requests: our standard**
Open Draft early → keep small → CI green → request review → address feedback → **Squash & merge**.  
**Template:** summary, context, changes, screens + a11y notes, testing, risks/rollback, checklist (CI/a11y/i18n/docs/changelog/perf/security).  
Approvals: 1 (low-risk) / **2** (core/schema/public API). Revert via PRs.

## **4) `.gitattributes` essentials**
Normalise text/EOLs, treat media as binary, LFS for large assets. See snippet in original doc.

*(Sections 5–9 unchanged.)*
