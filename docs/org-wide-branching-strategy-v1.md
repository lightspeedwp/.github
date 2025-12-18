# **Org‑wide Git Branching Strategy**

***Version:*** 1.0 • ***Last updated:*** 9 Oct 2025

***Purpose:*** Keep `main` always deployable, reduce merge risk, and make PR automation predictable across all repos. This policy aligns branch names with **Issue Types** and **Projects** so reports and saved searches work cross‑repo.

---

[1\) High‑level rules](#1\)-high‑level-rules)

[2\) Protect main (and develop if used)](#2\)-protect-main-\(and-develop-if-used\))

[3\) Branch naming (drives PR Type & labels)](#3\)-branch-naming-\(drives-pr-type-&-labels\))

[4\) Enforce branch names via CI (recommended)](#4\)-enforce-branch-names-via-ci-\(recommended\))

[5\) Make prefixes power automation](#5\)-make-prefixes-power-automation)

[5.1 Labeler (status kick‑off)](#5.1-labeler-\(status-kick‑off\))

[5.2 Projects “Type” mapping](#5.2-projects-“type”-mapping)

[6\) Merge discipline](#6\)-merge-discipline)

[7\) Release & hotfix flow](#7\)-release-&-hotfix-flow)

[8\) Quick per‑repo checklist](#8\)-quick-per‑repo-checklist)

[9\) FAQ & guardrails](#9\)-faq-&-guardrails)

[Appendix: Getting started](#appendix:-getting-started)

---

## **1\) High‑level rules** {#1)-high‑level-rules}

* `main` is production‑ready at all times.

* Optional `develop` for teams that need an integration branch.

* Short‑lived branches only; open a PR early and keep it small.

* Squash merge to preserve a **linear history**; delete branch after merge.

* Use prefixes that map cleanly to Issue Types and Project fields.

---

## **2\) Protect `main` (and `develop` if used)** {#2)-protect-main-(and-develop-if-used)}

In each repo → **Settings → Branches → Branch protection rules → Add rule**

**Branch pattern:** `main`  
**Tick:**

* Require a pull request before merging → **Require approvals: 1** (or **2** for critical repos)

* ✅ **Require review from Code Owners** (if using `CODEOWNERS`)

* ✅ **Dismiss stale approvals** when new commits are pushed

* ✅ **Require conversation resolution** before merging

* Require status checks to pass before merging → select CI jobs (lint, tests, build)

* ✅ **Require branches to be up to date** before merging

* ✅ **Require linear history** (squash‑merge only)

* **Do not allow bypassing** (include administrators)

* *(Optional)* **Require signed commits** if the team is set up for it

Repeat for **`develop`** if your repo uses it.

**Repo settings → Merge options**: Enable **Squash**; **disable** Merge commits & Rebase merges.

---

## **3\) Branch naming (drives PR Type & labels)** {#3)-branch-naming-(drives-pr-type-&-labels)}

**Format**  
`{type}/{scope}-{short-title}`  
*lower‑case; kebab‑case; keep it short.*

**Allowed `{type}` prefixes & mapping**

| Prefix | Intended work | Maps to Project Type | Typical Issue Type |
| ----- | ----- | ----- | ----- |
| `feat/` | New capability | **Feature** | Feature |
| `fix/` | Defect/regression | **Bug** | Bug |
| `docs/`  | Docs & comms | **Documentation** | Documentation |
| `chore/`  | Housekeeping, deps | **Task** | Maintenance / Build & CI / Chore |
| `refactor/` | Internal restructure | **Refactor** | Code Refactor |
| `test/` | Tests only | **Test Coverage** | Test Coverage |
| `perf/` | Performance work | **Performance** | Performance |
| `ci/` | Workflow changes | **Build & CI** | Build & CI |
| `release/` | Release prep | **Release** | Release |
| `hotfix/` | Emergency prod fix | **Release** | Bug / Release |

**Examples**

* `feat/cart-coupon-flow`

* `fix/wp6-6-compat`

* `docs/readme-install-steps`

* `chore/deps-2025-09`

**Link branches to issues**: reference `#123` in commits/PR description; add the Project.

---

## **4\) Enforce branch names via CI (recommended)** {#4)-enforce-branch-names-via-ci-(recommended)}

Create `.github/workflows/validate-branch-name.yml`:

```
name: Validate branch name
on:
  pull_request:
    types: [opened, reopened, synchronize, edited, ready_for_review]
jobs:
  check-branch:
    runs-on: ubuntu-latest
    steps:
      - name: Enforce {type}/{scope}-{short-title}
        run: |
          BRANCH="${{ github.head_ref }}"
          # Allow dependabot/renovate
          if [[ "$BRANCH" =~ ^(dependabot|renovate)/ ]]; then exit 0; fi
          if [[ ! "$BRANCH" =~ ^(feat|fix|docs?|chore|refactor|test|perf|ci|build|release|hotfix)/[a-z0-9._-]+$ ]]; then
            echo "❌ Branch '$BRANCH' must match:
  ^(feat|fix|docs?|chore|refactor|test|perf|ci|build|release|hotfix)/[a-z0-9._-]+$"
            exit 1
          fi
```

This keeps the PR → Project **Type** mapping reliable and avoids `type:*` labels.

---

## **5\) Make prefixes power automation** {#5)-make-prefixes-power-automation}

### **5.1 Labeler (status kick‑off)** {#5.1-labeler-(status-kick‑off)}

Ensure `.github/labeler.yml` seeds new PRs with `status:needs-review` when appropriate:

```
"status:needs-review":
  - head-branch: ['^feat/.*', '^fix/.*', '^docs?/.*', '^(chore|build)/.*', '^refactor/.*', '^test/.*', '^perf/.*', '^(ci|release|hotfix)/.*']
```

### **5.2 Projects “Type” mapping** {#5.2-projects-“type”-mapping}

Extend your project sync workflow (e.g. `project-meta-sync.yml`) so branch prefixes set the Project **Type** field:

```
# pseudo-rule examples
- if: headRef startsWith 'feat/'
  set: Project.Type = Feature
- if: headRef startsWith 'fix/'
  set: Project.Type = Bug
- if: headRef matches 'docs?/'
  set: Project.Type = Documentation
- if: headRef matches '(chore|build)/'
  set: Project.Type = Task
- if: headRef startsWith 'refactor/'
  set: Project.Type = Refactor
- if: headRef startsWith 'test/'
  set: Project.Type = Test Coverage
- if: headRef startsWith 'perf/'
  set: Project.Type = Performance
- if: headRef matches '(ci|release|hotfix)/'
  set: Project.Type = Build & CI  # or Release for release/hotfix if you prefer
```

**Principle**: Labels remain **routing signals** (status/priority/area). **Issue Types** and **Project fields** carry the semantics.

---

## **6\) Merge discipline** {#6)-merge-discipline}

* Keep branches current via **Require branches to be up to date**.

* Fix forward on your branch; avoid force‑pushes to `main`/`develop`.

* **Squash** when merging. PR title becomes the squash commit; keep it clear.

* Delete the branch after merge.

---

## **7\) Release & hotfix flow** {#7)-release-&-hotfix-flow}

* **Release**: open `release/vX.Y.Z`, bump versions/changelog, run full CI, QA on staging, then merge → tag → deploy.

* **Hotfix**: branch from `main` as `hotfix/<slug>`, fix → PR → approvals/CI → merge to `main` → tag → cherry‑pick to `develop` (if used).

---

## **8\) Quick per‑repo checklist** {#8)-quick-per‑repo-checklist}

* Protect `main` (+ `develop` if used) with approvals, passing checks, up‑to‑date and **linear history**.

* Adopt `{type}/{scope}-{short-title}` branch names; encourage short‑lived branches.

* Add **Validate branch name** workflow (Section 4).

* Keep `.github/labeler.yml` and `project-meta-sync.yml` mapping in sync with chosen prefixes.

* Use labels only as **routing signals**; let Issue Types/Project fields carry meaning.

* Enable **Squash merge only**; delete branches on merge.

---

## **9\) FAQ & guardrails** {#9)-faq-&-guardrails}

* **Do we need `develop`?** Optional. If your deployment model can stage off feature branches and release branches, skip `develop`.

* **Where do we record “what type of work this is”?** In Project **Type** (mapped from the branch) and the **Issue Type** on the linked issue.

* **Why no `type:*` labels?** To keep labels orthogonal for routing (status/priority/area/component), avoiding duplication.

* **Can we add more prefixes?** Yes—extend the CI regex and Project mapping together.

---

## **Appendix: Getting started** {#appendix:-getting-started}

1. Create or update org‑level `.github` defaults (workflows, labeler).

2. Sync labels using `gh label` or `.github/labels.yml`.

3. Add protection rules to every repo (script via API or do once‑off).

4. Share this policy in READMEs and onboarding.

---

