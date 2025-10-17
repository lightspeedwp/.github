# **Branch Prefixes**
## *Product Development*

***Version:*** 1.1 • ***Last updated:*** 17 Oct 2025  
A maximal but sane set of prefixes for product repos. Use **shared core** everywhere; add **product-specific** when helpful.

---

[Shared core](#shared-core-use-in-both-templates) • [Product-specific](#product-specific-optional) • [Examples](#examples) • [One regex](#one-regex-to-enforce) • [Mapping](#mapping-to-issue-types-for-automations) • [Tips](#tips)

## **Shared core (use in both templates)** {#shared-core-use-in-both-templates}
- `feat/`, `fix/`, `hotfix/`, `release/`, `refactor/`, `chore/`, `docs/`, `test/`, `perf/`, `ci/`, `build/`, `deps/`, `security/`, `revert/`, `research/`, `design/`, `a11y/`, `ux/`, `i18n/`, `ops/`

## **Product-specific (optional)** {#product-specific-optional}
- `proto/` — experiments  
- `ds/` — design system  
- `api/` — API surface  
- `schema/` — DB/schema  
- `telemetry/` — analytics/metrics

## **Examples** {#examples}

feat/product-grid-quick-add
refactor/split-frontend-bundle
api/orders-bulk-cancel
schema/add-index-orders-created
telemetry/add-checkout-step-events
release/v1.6.0
hotfix/cart-csrf-check

## **One regex to enforce** {#one-regex-to-enforce}

^(feat|fix|hotfix|release|refactor|chore|docs|test|perf|ci|build|deps|security|revert|research|design|a11y|ux|i18n|ops|proto|ds|api|schema|telemetry)/[a-z0-9._-]+$


## **Mapping to Issue Types (for automations)** {#mapping-to-issue-types-for-automations}
- `feat/` → Feature/Story  
- `fix/` → Bug (hotfix → critical Bug)  
- `refactor/` → Refactor  
- `chore/|ci/|build/|deps/|security/` → Chore  
- `research/` → Research  
- `design/|a11y/|ux/` → Design/Task  
- `proto/|api/|schema/|telemetry/|ds/` → Feature/Task  
- `release/` → Release PR

## **Tips** {#tips}
- Enforce with one regex, keep scopes meaningful, prefer Project fields over label proliferation.
