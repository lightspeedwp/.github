# **Selective Fork Sync**

## *Workflow for LSX Demo Theme interns to selectively sync downstream Forks from Upstream*

***Version:*** 1.0 • ***Last updated:*** 9 Oct 2025

*Example reference: Brandon’s test branch – [https://github.com/brandonmarshal/lsx-demo-theme/tree/fork-sync-test/logs](https://github.com/brandonmarshal/lsx-demo-theme/tree/fork-sync-test/logs)*

---

[Goal](#goal)

[Prerequisites](#prerequisites)

[Quick naming convention](#quick-naming-convention)

[Step‑by‑step](#step‑by‑step)

[Step 0 — (First time only) Fork & clone your fork](#step-0-—-\(first-time-only\)-fork-&-clone-your-fork)

[Step 1 — Add the main repo as upstream (one‑time setup)](#step-1-—-add-the-main-repo-as-upstream-\(one‑time-setup\))

[Step 2 — Create a temporary sync branch with all upstream changes](#step-2-—-create-a-temporary-sync-branch-with-all-upstream-changes)

[Step 3 — Create a working branch for selective file import](#step-3-—-create-a-working-branch-for-selective-file-import)

[Step 4 — Copy only the files you want from the sync branch](#step-4-—-copy-only-the-files-you-want-from-the-sync-branch)

[Step 5 — Push and open a PR inside your fork](#step-5-—-push-and-open-a-pr-inside-your-fork)

[Step 6 — Clean up](#step-6-—-clean-up)

[Do‑not‑copy checklist (common personal files)](#do‑not‑copy-checklist-\(common-personal-files\))

[Troubleshooting](#troubleshooting)

[Reference links (GitHub Docs)](#reference-links-\(github-docs\))

[Appendix: One‑liner for a file you know you want](#appendix:-one‑liner-for-a-file-you-know-you-want)

---

## **Goal** {#goal}

Bring **only the files you want** from the main project repo ( `lightspeedwp/lsx-demo-theme` ) into your own fork without overwriting your personal customisations. You’ll:

1. Fork and clone your personal repo

2. Add the main repo as `upstream`

3. Pull upstream changes into a **temporary sync branch**

4. Copy only selected files into your **working branch**

5. Push, open a PR in **your fork**, and merge

6. Clean up temporary branches

---

## **Prerequisites** {#prerequisites}

* GitHub account and your personal fork of `lightspeedwp/lsx-demo-theme` (create one if you haven’t yet).

* **GitHub Desktop** installed.

* **Git** installed (for one or two terminal commands).

* Write access to your **own fork**.

---

## **Quick naming convention** {#quick-naming-convention}

Use dates so everyone can follow your work:

* Temporary sync branch: `upstream-sync-YYYYMMDD`

* Working (selective) branch: `selective-sync-YYYYMMDD`

---

## **Step‑by‑step** {#step‑by‑step}

### **Step 0 — (First time only) Fork & clone your fork** {#step-0-—-(first-time-only)-fork-&-clone-your-fork}

1. Fork `https://github.com/lightspeedwp/lsx-demo-theme` to **your** account.

2. In GitHub Desktop: **File → Clone repository… → URL**, pick **your fork**.

Tip: Keep your local folder name short, e.g. `lsx-demo-theme/`.

---

### **Step 1 — Add the main repo as upstream (one‑time setup)** {#step-1-—-add-the-main-repo-as-upstream-(one‑time-setup)}

1. In GitHub Desktop: **Repository → Open in Terminal**.

Run:

 git remote add upstream https://github.com/lightspeedwp/lsx-demo-theme.git  
git remote \-v   \# confirm you see both origin (your fork) and upstream

2. 

---

### **Step 2 — Create a temporary sync branch with all upstream changes** {#step-2-—-create-a-temporary-sync-branch-with-all-upstream-changes}

1. In GitHub Desktop, ensure you’re on your fork’s default branch (`main` or `master`). Click **Fetch origin**.

2. **Current Branch → New Branch…**

   * Name: `upstream-sync-YYYYMMDD` → **Create branch**.

3. With `upstream-sync-YYYYMMDD` checked out, merge upstream’s default branch into it:

   * **Branch → Merge into current branch…**

   * In the list, pick **`upstream/main`** (or `upstream/master`) → **Merge**.

4. Resolve any conflicts (open files in your editor from Desktop if needed), then **Commit merge**.

You now have a branch that mirrors the latest upstream state inside your fork.

---

### **Step 3 — Create a working branch for selective file import** {#step-3-—-create-a-working-branch-for-selective-file-import}

1. **Current Branch → New Branch…**

   * Name: `selective-sync-YYYYMMDD` → **Create branch**.

2. Stay on `selective-sync-YYYYMMDD` for the next step.

---

### **Step 4 — Copy only the files you want from the sync branch** {#step-4-—-copy-only-the-files-you-want-from-the-sync-branch}

GitHub Desktop can’t selectively pull individual files; use one of the methods below to bring files from `upstream-sync-YYYYMMDD` into your current `selective-sync-YYYYMMDD` branch.

**Recommended (modern Git):**

1. **Repository → Open in Terminal**

For each file or folder you want, run:

 \# Bring a single file from the sync branch into your current branch  
git restore \--source upstream-sync-YYYYMMDD \-- path/to/file

\# Or bring a whole folder  
git restore \--source upstream-sync-YYYYMMDD \-- path/to/folder/

2. 

**Alternative (older syntax that still works):**

\# Single file or folder  
git checkout upstream-sync-YYYYMMDD \-- path/to/file-or-folder

Return to GitHub Desktop → **Changes** tab shows the imported files.

✅ **Sanity check before committing**

* Review diffs for each file.

* Make sure you’re not overwriting personal-only settings (see the *Do‑not‑copy checklist* below).

**Commit** (e.g. `Import selected files from upstream on 2025‑09‑16`).

Repeat until you’ve added everything you want.

---

### **Step 5 — Push and open a PR inside your fork** {#step-5-—-push-and-open-a-pr-inside-your-fork}

1. In GitHub Desktop: **Push origin** (pushes `selective-sync-YYYYMMDD`).

2. Click **Create Pull Request** (this opens your fork on github.com).

3. Base: `your-username/lsx-demo-theme` → `main` (or `master`)  
    Compare: `your-username/lsx-demo-theme` → `selective-sync-YYYYMMDD`

4. Title the PR clearly (e.g. `Selective sync from upstream (YYYY‑MM‑DD)`).

5. **Create pull request** → review changed files → **Merge** (Squash is fine).

Important: A PR merges **everything in the branch**. That’s why you only commit the files you want in Step 4\.

---

### **Step 6 — Clean up** {#step-6-—-clean-up}

1. In GitHub Desktop, switch back to `main` (or `master`).

2. **Branch → Delete…** the now‑merged `selective-sync-YYYYMMDD` (both local and remote).

3. Keep or delete `upstream-sync-YYYYMMDD`. You can keep the latest one for reference and delete older ones.

---

## **Do‑not‑copy checklist (common personal files)** {#do‑not‑copy-checklist-(common-personal-files)}

Before you commit, consider excluding:

* `.env`, `.env.local`, local secrets

* Editor/IDE settings: `.vscode/`, `.idea/`

* OS files: `.DS_Store`, `Thumbs.db`

* Personal docs: `notes/`, `docs/local/`

* Anything clearly specific to **your** setup

---

## **Troubleshooting** {#troubleshooting}

* **I don’t see `upstream/main` in the merge list.**  
   Open Terminal and run `git fetch upstream`. Then try **Branch → Merge into current branch…** again.

* **Conflicts when merging upstream into my sync branch.**  
   Use Desktop’s conflict UI or open in your editor, resolve, then **Commit merge**. Keep `upstream-sync-YYYYMMDD` clean and conflict‑free; you’ll only cherry‑pick files from it.

* **I accidentally committed extra files.**  
   Remove them and commit again, or create a fresh `selective-sync-YYYYMMDD-2` and redo Step 4 with only the right files.

* **“main” vs “master”?**  
   Use whichever your fork uses as the default branch. Upstream is currently `main` unless otherwise noted.

---

## **Reference links (GitHub Docs)** {#reference-links-(github-docs)}

* About forks – [https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/about-forks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/about-forks)

* Fork a repository – [https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo)

* **Syncing a fork** – [https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork)

* **Configure a remote for a fork** – [https://docs.github.com/articles/configuring-a-remote-for-a-fork](https://docs.github.com/articles/configuring-a-remote-for-a-fork)

* Creating a pull request – [https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request)

* Creating a pull request from a fork – [https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork)

* Comparing commits & branches – [https://docs.github.com/en/pull-requests/committing-changes-to-your-project/viewing-and-comparing-commits/comparing-commits](https://docs.github.com/en/pull-requests/committing-changes-to-your-project/viewing-and-comparing-commits/comparing-commits)

* GitHub Desktop: Syncing your branch – [https://docs.github.com/en/desktop/working-with-your-remote-repository-on-github-or-github-enterprise/syncing-your-branch-in-github-desktop](https://docs.github.com/en/desktop/working-with-your-remote-repository-on-github-or-github-enterprise/syncing-your-branch-in-github-desktop)

* GitHub Desktop: Managing branches – [https://docs.github.com/en/desktop/making-changes-in-a-branch/managing-branches-in-github-desktop](https://docs.github.com/en/desktop/making-changes-in-a-branch/managing-branches-in-github-desktop)

* GitHub Desktop: Committing & reviewing changes – [https://docs.github.com/en/desktop/making-changes-in-a-branch/committing-and-reviewing-changes-to-your-project-in-github-desktop](https://docs.github.com/en/desktop/making-changes-in-a-branch/committing-and-reviewing-changes-to-your-project-in-github-desktop)

---

## **Appendix: One‑liner for a file you know you want** {#appendix:-one‑liner-for-a-file-you-know-you-want}

When you’re on `selective-sync-YYYYMMDD`, bring a single file straight from **upstream** (skipping the temp branch) if you’re confident:

\# Pull a file from upstream/main directly into your working branch  
git fetch upstream  
git restore \--source upstream/main \-- path/to/file  
\# or (older syntax)  
\# git checkout upstream/main \-- path/to/file

Commit in Desktop → push → PR to your fork’s `main`.

---

