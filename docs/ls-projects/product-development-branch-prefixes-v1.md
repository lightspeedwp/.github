# **Branch Prefixes**

## *Product Development*

***Version:*** 1.0 • ***Last updated:*** 9 Oct 2025  
A maximal but sane set of **branch prefixes** for product repos. Use the **shared core** everywhere, and add the **product‑specific** set when helpful. Branches should be short‑lived and merged via PRs (squash).

---

[Shared core (use in both templates)](#shared-core-\(use-in-both-templates\))

[Product‑specific (optional)](#product‑specific-\(optional\))

[Examples](#examples)

[One regex to enforce](#one-regex-to-enforce)

[Mapping to Issue Types (for automations)](#mapping-to-issue-types-\(for-automations\))

[Tips](#tips)

---

## **Shared core (use in both templates)** {#shared-core-(use-in-both-templates)}

- `feat/` — new capability or UI change  
- `fix/` — bug fix (non‑critical)  
- `hotfix/` — urgent production fix  
- `release/` — release stabilisation branches (e.g., `release/v1.6.0`)  
- `refactor/` — internal restructure, no behaviour change  
- `chore/` — repo hygiene (lint, formatting, housekeeping)  
- `docs/` — documentation only  
- `test/` — tests only (unit/e2e/fixtures)  
- `perf/` — performance optimisation  
- `ci/` — CI workflow changes  
- `build/` — bundling/tooling changes (Webpack, Vite, etc.)  
- `deps/` — dependency updates (lockfiles, minor bumps)  
- `security/` — security work (audits, fixes)  
- `revert/` — revert a previous change  
- `research/` — time‑boxed investigation/PoC  
- `design/` — design‑system/tokens/handoff updates  
- `a11y/` — accessibility fixes  
- `ux/` — interaction/usability tweaks (non‑feature)  
- `i18n/` — internationalisation/localisation  
- `ops/` — ops/infrastructure (deploy, DNS, backups)

## **Product‑specific (optional)** {#product‑specific-(optional)}

- `proto/` — throwaway prototypes/experiments  
- `ds/` — design‑system work (tokens/components) short tag  
- `api/` — API surface changes (versioning, endpoints)  
- `schema/` — DB/schema changes  
- `telemetry/` — analytics/metrics events

---

## **Examples** {#examples}

```
feat/product-grid-quick-add
refactor/split-frontend-bundle
api/orders-bulk-cancel
schema/add-index-orders-created
telemetry/add-checkout-step-events
release/v1.6.0
hotfix/cart-csrf-check
```

*(format: `{prefix}/{scope}-{short-title}` — all lowercase, hyphen‑separated)*

---

## **One regex to enforce** {#one-regex-to-enforce}

Use a single rule so devs never guess across repos.

```
^(feat|fix|hotfix|release|refactor|chore|docs|test|perf|ci|build|deps|security|revert|research|design|a11y|ux|i18n|ops|proto|ds|api|schema|telemetry)\/[a-z0-9._-]+$
```

### **Optional enforcement workflow**

Place in `.github/workflows/branch-name-check.yml`:

```
name: Branch name policy
on:
  pull_request:
    types: [opened, synchronize, reopened, edited]
jobs:
  check-branch-name:
    runs-on: ubuntu-latest
    steps:
      - name: Validate branch name
        run: |
          BRANCH="${{ github.head_ref }}"
          REGEX='^(feat|fix|hotfix|release|refactor|chore|docs|test|perf|ci|build|deps|security|revert|research|design|a11y|ux|i18n|ops|proto|ds|api|schema|telemetry)/[a-z0-9._-]+$'
          if [[ ! "$BRANCH" =~ $REGEX ]]; then
            echo "❌ Branch name '$BRANCH' does not match policy."
            echo "Allowed prefixes are listed in BRANCHING.md."
            exit 1
          fi
```

---

## **Mapping to Issue Types (for automations)** {#mapping-to-issue-types-(for-automations)}

- `feat/` → **Feature/Story**  
- `fix/` → **Bug**  
- `hotfix/` → **Bug** (critical)  
- `refactor/` → **Refactor**  
- `chore/`, `ci/`, `build/`, `deps/`, `security/` → **Chore**  
- `research/` → **Research**  
- `design/`, `a11y/`, `ux/` → **Design**/**Task** (as appropriate)  
- `proto/`, `api/`, `schema/`, `telemetry/`, `ds/` → **Feature/Task**  
- `release/` → **Release PR**

---

## **Tips** {#tips}

- Keep the **scope** meaningful: area \+ short slug, e.g. `feat/frontend-pay-button`, `fix/backend-coupon-rounding`.  
- Mirror branch prefixes to **labels** only if needed for cross‑repo filters; prefer **Project fields** first.  
- Delete branches on merge to keep the repo clean.

---

