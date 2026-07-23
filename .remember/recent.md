# Recent

```

# Recent

## 2026-07-22

Major workflow infra fixes: npm ci/meta.yml redesign (PRs #1073–#1077), branch cleanup safety (4 fixes, PR #1071), template enforcement webhook refetch (PR #1086). Multi-phase agent-standards initiative launched w/ Playwright rewrite (15 agents, multi-provider framework, PR #1108, Epic #1079). Footer validation/CodeRabbit improvements (PRs #1123, #1127). Project milestone allocation strategy implemented (v1.0–v1.6 auto-allocation, ~150→7 milestones, PRs #1113, #1132).
Shipped Playwright agent multi-provider testing (Phase 1C, Epic #1079, PR #1108: 55 files, 695 tests, 19 child issues); restored 17 truncated files & resolved CodeRabbit feedback. Completed milestone allocation strategy: version-based v1.0–v1.6 auto-allocation, ~150 issues → 7 milestones, capacity-exclusion filtering (PR #1132). Fixed meta-workflow (npm ci, mergify), template-enforcement (stale webhook refetch), branch cleanup safety; resolved GitHub OAuth constraint (no DCR) → PAT env var. Standardized agent registry (16 agents → catalogue.ts /c/agents/), fixed Node 24 incompatibility (13 dependabot PRs), js-yaml 5.x compat, footer validation; began batch 2 agent standardization (agents 6–14 to multi-provider, PR #1140 merged).
