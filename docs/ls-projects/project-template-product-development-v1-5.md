# **Branching Strategy for Release Train** {#branching-strategy-for-release-train}

***Version:*** 1.5 • ***Last updated:*** 17 Oct 2025  
**Default:** `develop` as integration branch; **`main` always stable**.  
Build into `develop`, stabilise on `release/vX.Y.Z`, then **Release PR → `main`**, **tag**, and **back-merge**.

## **Rationale**
- Predictable release trains, parallel teams, and a stable `main`.

## **Branch Types & Naming**
Format: `{type}/{scope}-{short-title}`  
- `feat/`, `fix/`, `refactor/`, `chore/`, `docs/`, `perf/`, `ci/`, `test/`  
- `release/vX.Y.Z` — stabilisation  
- `hotfix/<slug>` — production patch

## **Normal Flow**
1. Branch from `develop`  
2. PR → `develop`; CI green; 1–2 reviews  
3. Cut `release/vX.Y.Z` for QA  
4. Release PR → `main`; tag & deploy  
5. Back-merge `main → develop`

## **Hotfix Flow**
1. Branch `hotfix/<slug>` from `main`  
2. PR → `main`; tag patch  
3. Back-merge and cherry-pick as needed

## **Environments**
Prototype (optional), Staging (from release), Live (from main)

## **Versioning & Releases**
SemVer, milestones per release, high-quality notes

## **Protections**
Protect `main`/`develop`, approvals, up-to-date before merge, squash only
