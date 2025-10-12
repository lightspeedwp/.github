# **PR Workflow Guide**

***Version:*** 1.0 • ***Last updated:*** 9 Oct 2025  
---

[1\) Why we use a Git workflow](#1\)-why-we-use-a-git-workflow)

[2\) Pick the right branching strategy](#2\)-pick-the-right-branching-strategy)

[2.1 Trunk‑based / GitHub Flow (recommended)](#2.1-trunk‑based-/-github-flow-\(recommended\))

[2.2 GitFlow (when needed)](#2.2-gitflow-\(when-needed\))

[2.3 main vs develop — when to use](#2.3-main-vs-develop-—-when-to-use)

[3\) Pull Requests: our standard](#3\)-pull-requests:-our-standard)

[4\) .gitattributes essentials (team‑wide defaults)](#4\)-.gitattributes-essentials-\(team‑wide-defaults\))

[5\) Intern exercise — selective fork sync into your own repo](#5\)-intern-exercise-—-selective-fork-sync-into-your-own-repo)

[Prereqs](#prereqs)

[Step‑by‑step](#step‑by‑step)

[Clean‑up & safety](#clean‑up-&-safety)

[6\) Quick PR review rules for interns](#6\)-quick-pr-review-rules-for-interns)

[7\) Handy commands & Desktop tips](#7\)-handy-commands-&-desktop-tips)

[8\) Reading list (PRs, forks, reviews, formatting)](#8\)-reading-list-\(prs,-forks,-reviews,-formatting\))

[9\) Appendix — main/develop decision tree](#9\)-appendix-—-main/develop-decision-tree)

---

## **1\) Why we use a Git workflow** {#1)-why-we-use-a-git-workflow}

A shared workflow gives us: predictable releases, fewer merge conflicts, safer rollbacks, better reviews, and faster delivery. It defines how we branch, review, test, and release — so interns and seniors follow the same playbook.

---

## **2\) Pick the right branching strategy** {#2)-pick-the-right-branching-strategy}

**Default for LightSpeed**: Trunk‑based / GitHub Flow with **short‑lived** feature branches and PRs into `main` (plus optional `release/x.y` branches for bigger drops). Use GitFlow **only** when we must stage formal releases and support hotfixes separately.

### **2.1 Trunk‑based / GitHub Flow (recommended)** {#2.1-trunk‑based-/-github-flow-(recommended)}

* Branch from `main` for each task → small PR → squash‑merge → delete branch.

* Continuous testing on every PR; deploy from `main`.

* Use **feature flags** for unfinished work.

### **2.2 GitFlow (when needed)** {#2.2-gitflow-(when-needed)}

* Long‑lived `main` (production) and `develop` (integration).

* `feature/*` off `develop`; `release/*` cut from `develop` to stabilise; `hotfix/*` from `main`.

### **2.3 `main` vs `develop` — when to use** {#2.3-main-vs-develop-—-when-to-use}

* `main`: always deployable; tags/releases come from here; emergency **hotfix** branches cut from here.

* `develop`: optional integration branch for teams that batch features before release.

**LightSpeed decision**: Prefer **no `develop`**. Introduce `develop` only for projects with scheduled releases and lots of parallel features.

---

## **3\) Pull Requests: our standard** {#3)-pull-requests:-our-standard}

**Open Draft early** → keep it small → pass CI → request review → action feedback → **Squash & merge**.

**PR Template (condensed)**

* Summary (what/why)

* Context (Asana/Issue links)

* Changes (bullets)

* Screens (before/after) \+ a11y notes

* Testing notes (steps & edge cases)

* Risks & rollback

* Checklist: CI green • a11y • i18n • docs/changelog • perf • security

**Approvals**: 1 for low‑risk; **2** for core or schema/public API changes.

**Merging**: Squash by default. Use merge commits only when merging a `release/*` branch.

**Reverting**: prefer revert PRs to keep history clear.

---

## **4\) `.gitattributes` essentials (team‑wide defaults)** {#4)-.gitattributes-essentials-(team‑wide-defaults)}

Commit a `.gitattributes` at repo root so all devs behave consistently, regardless of local Git settings.

```
# Normalise text and protect line endings (noise killer)
* text=auto

# Enforce LF for shell/JSON; CRLF for BAT if you need it
*.sh text eol=lf
*.json text eol=lf
*.bat text eol=crlf

# Treat media as binary (no diffs, no EOL conversion)
*.png binary
*.jpg binary
*.gif binary

# Large assets via Git LFS (example)
*.mp4 filter=lfs diff=lfs merge=lfs -text
*.zip filter=lfs diff=lfs merge=lfs -text
```

**Notes**

* `* text=auto` normalises line endings in the repo (LF) and avoids CRLF/LF churn across OSes.

* Mark non‑text as `binary` to skip diff/merge heuristics.

* Use LFS for big binaries; `filter=lfs diff=lfs merge=lfs -text` routes storage & diffs via LFS.

---

## **5\) Intern exercise — selective fork sync into your own repo** {#5)-intern-exercise-—-selective-fork-sync-into-your-own-repo}

**Goal**: Bring **only the files you want** from the upstream project into your personal fork, then PR into your fork’s `main` without overwriting your customised files.

### **Prereqs** {#prereqs}

* You have a fork of `lightspeedwp/lsx-demo-theme` under your GitHub account.

* You’ve cloned **your fork** locally via GitHub Desktop.

### **Step‑by‑step** {#step‑by‑step}

1. **Create a sync branch in your fork**

   * In GitHub Desktop: *Current Branch → New Branch* → name e.g. `fork-sync/2025-09-theme-assets`.

2. **Add the original repo as `upstream`**

   * In GitHub Desktop: *Repository → Repository Settings → Remotes → Add* (name: `upstream`, URL: the LightSpeed repo), or open Terminal from Desktop and run:

```shell
git remote add upstream https://github.com/lightspeedwp/lsx-demo-theme.git
git fetch upstream
```

3.   
   **Preview upstream changes** (optional)

   * `git log --oneline ..upstream/main` to see what’s new since your fork.

4. **Bring specific files across (no blanket merge)**

   * From your sync branch, restore only the paths you want:

```shell
# single file
git restore --source upstream/main path/to/file.css
# whole directory
git restore --source upstream/main assets/css/
# cherry‑pick one commit if that’s cleaner
git cherry-pick <commit-sha>
```

   *   
     Inspect diffs in GitHub Desktop (Changes tab). Use partial staging if needed.

5. **Commit & push**

   * Write a clear message, e.g. `chore(sync): import header styles from upstream/main`.

   * Push the branch to **your fork**.

6. **Open a PR *within your fork***

   * Base: `main` (your fork) ← Compare: `fork-sync/...` (your branch).

   * Review the files — only the ones you restored should appear.

7. **Merge** (Squash) → delete the branch.

8. **Protect your personal changes**

   * If a file would overwrite your custom version, **don’t restore it**. For surgical edits, run:

```shell
# dump upstream version without touching index
git show upstream/main:path/to/file.php > /tmp/file.php
# open both files in your editor and copy only the needed bits
```

### **Clean‑up & safety** {#clean‑up-&-safety}

* Always start from a clean working tree (`git status` should be clean).

* Commit your local customisations before restoring upstream files.

* If you accidentally pulled too much, use `git restore -S HEAD -- <path>` or `git checkout -- <path>` to revert unstaged changes.

---

## **6\) Quick PR review rules for interns** {#6)-quick-pr-review-rules-for-interns}

* Write a **descriptive title** (Conventional Commit \+ scope).

* Fill the template. Include screenshots and test steps.

* CI must be green before requesting review.

* Ask for 1 reviewer; 2 for risky/platform changes.

* Be responsive; convert comments into commits, then re‑request review.

---

## **7\) Handy commands & Desktop tips** {#7)-handy-commands-&-desktop-tips}

* Update branch from your fork: **Fetch origin** → **Pull origin** (or *Pull with rebase*).

* Update from upstream on CLI: `git fetch upstream && git merge upstream/main` (or rebase).

* Compare a single file to upstream: `git diff upstream/main -- path/to/file`.

* Stage interactively (pick hunks): `git add -p`.

---

## **8\) Reading list (PRs, forks, reviews, formatting)** {#8)-reading-list-(prs,-forks,-reviews,-formatting)}

* GitHub Flow & PR fundamentals

* Forking, configuring `upstream`, and syncing

* PR creation, reviews, approvals, merging, reverting

* Markdown basics for great PR descriptions

* Atlassian cheat‑sheet (common commands) & GitOps (infra via PRs)

---

## **9\) Appendix — `main`/`develop` decision tree** {#9)-appendix-—-main/develop-decision-tree}

* **Need scheduled releases, support hotfixes while features continue?** → Add `develop` and `release/*`.

* **Move fast with continuous deployment, small PRs?** → Use only `main` \+ short‑lived branches.

---

For practice, repeat the fork‑sync on a small subset (e.g., `/assets/css`), then a second pass adding one PHP template only. Commit separately.

